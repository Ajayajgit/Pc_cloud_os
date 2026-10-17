#!/usr/bin/env node
// Command-line driver for the Power Cloud CRM RESTlet.
// NetSuite OAuth 2.0 client credentials (machine-to-machine) flow, PS256 signed JWT assertion.
// Node 18+ built-ins only. No network access in --selftest.

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const TOOLS_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_CONFIG = path.join(TOOLS_DIR, 'crm_api.local.json');
const CACHE_FILE = path.join(TOOLS_DIR, '.token_cache.json');
const LOG_FILE = path.join(TOOLS_DIR, 'runbook_log.jsonl');
const NO_REQUEST_ID_ACTIONS = new Set(['resolveClient', 'listTravelProjects']);
const PSS_SALT_LENGTH = 32;
const REFRESH_MARGIN_MS = 2 * 60 * 1000;
const JWT_LIFETIME_S = 1800; // Oracle caps the assertion at 60 minutes; 30 keeps clock skew out of it

const BOOLEAN_FLAGS = new Set(['help', 'verbose', 'no-cache', 'no-request-id', 'token-only', 'selftest']);
const VALUE_FLAGS = new Set([
  'as', 'deploy', 'action', 'payload', 'payload-file', 'request-id',
  'verb', 'raw-body', 'extra', 'config',
]);

const HELP = `crm_api_driver.mjs: call the Power Cloud CRM RESTlet with OAuth 2.0 client credentials.

Usage:
  node crm_api_driver.mjs --as <mapping> --action <name> [--payload '<json>'] [options]
  node crm_api_driver.mjs --as <mapping> --token-only
  node crm_api_driver.mjs --selftest

Options:
  --as <mapping>          Certificate mapping to sign with (key in config "mappings"). Required.
  --deploy <key>          Deployment key from config "deployments". Defaults to the --as name.
                          A value starting with "customdeploy" is used as a raw script id.
  --action <name>         Action sent in the body.
  --payload '<json>'      Payload object (default {}).
  --payload-file <path>   Read the payload JSON from a file.
  --request-id <uuid>     Use this requestId (replay tests).
  --no-request-id         Omit requestId from the body entirely.
  --verb <verb>           GET | POST | PUT | DELETE (default POST). GET is sent without a body.
  --raw-body '<string>'   Send exactly this string as the body (malformed-body tests).
  --extra '<json object>' Merge extra top-level keys into the body.
  --token-only            Exchange a token, print ok / expires_in / mapping, no RESTlet call.
  --verbose               Print URLs and the first 6 characters of the token to stderr.
  --config <path>         Config file (default tools/crm_api.local.json).
  --no-cache              Ignore and do not write the token cache.
  --selftest              Offline JWT build and verify check.
  --help                  This text.

Exit codes: 0 HTTP 2xx, 1 usage or config error, 2 token exchange failure, 3 RESTlet non-2xx or network failure.
A requestId is generated for every action except resolveClient and listTravelProjects, and printed
as "requestId: <uuid>". Each RESTlet call is appended to tools/runbook_log.jsonl.
`;

// ---------- small helpers ----------

class UsageError extends Error {}
class TokenError extends Error {}

function b64url(input) {
  return Buffer.from(input).toString('base64url');
}

function b64urlDecode(text) {
  return Buffer.from(text, 'base64url');
}

function parseArgs(argv) {
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) throw new UsageError(`unexpected argument: ${arg}`);
    const name = arg.slice(2);
    if (BOOLEAN_FLAGS.has(name)) {
      opts[name] = true;
    } else if (VALUE_FLAGS.has(name)) {
      if (i + 1 >= argv.length) throw new UsageError(`--${name} needs a value`);
      opts[name] = argv[++i];
    } else {
      throw new UsageError(`unknown flag: ${arg}`);
    }
  }
  return opts;
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (err) {
    throw new UsageError(`${label} is not valid JSON: ${err.message}`);
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

// ---------- config ----------

function loadConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    throw new UsageError(
      `config file not found: ${configPath}\n` +
      'Copy crm_api.example.json to crm_api.local.json in the tools folder and fill it in, or pass --config <path>.'
    );
  }
  const config = parseJson(fs.readFileSync(configPath, 'utf8'), `config file ${configPath}`);
  for (const key of ['accountId', 'clientId', 'script']) {
    if (!config[key] || typeof config[key] !== 'string') throw new UsageError(`config is missing "${key}"`);
  }
  if (!isPlainObject(config.mappings) || Object.keys(config.mappings).length === 0) {
    throw new UsageError('config "mappings" must be an object with at least one entry');
  }
  if (!isPlainObject(config.deployments)) throw new UsageError('config "deployments" must be an object');
  return config;
}

function resolveMapping(config, name) {
  const mapping = config.mappings[name];
  if (!mapping) {
    throw new UsageError(`unknown mapping "${name}". Known mappings: ${Object.keys(config.mappings).join(', ')}`);
  }
  if (!mapping.certId || !mapping.keyPath) throw new UsageError(`mapping "${name}" needs certId and keyPath`);
  return mapping;
}

function resolveDeployment(config, opts) {
  const key = opts.deploy ?? opts.as;
  if (config.deployments[key]) return { key, scriptId: config.deployments[key] };
  if (opts.deploy && opts.deploy.startsWith('customdeploy')) return { key: opts.deploy, scriptId: opts.deploy };
  const known = Object.keys(config.deployments).join(', ');
  if (!opts.deploy) {
    throw new UsageError(`no deployment named "${key}" (the --as default). Pass --deploy. Known deployments: ${known}`);
  }
  throw new UsageError(`unknown deployment "${key}". Known deployments: ${known}`);
}

function readPrivateKey(keyPath) {
  let pem;
  try {
    pem = fs.readFileSync(keyPath, 'utf8');
  } catch (err) {
    throw new UsageError(`cannot read key file ${keyPath}: ${err.code || err.message}`);
  }
  try {
    return crypto.createPrivateKey(pem);
  } catch {
    throw new UsageError(`key file ${keyPath} is not a readable PEM private key`);
  }
}

// ---------- JWT and token ----------

function tokenEndpoint(accountId) {
  return `https://${accountId}.suitetalk.api.netsuite.com/services/rest/auth/oauth2/v1/token`;
}

function restletUrl(accountId, script, deploy) {
  return `https://${accountId}.restlets.api.netsuite.com/app/site/hosting/restlet.nl` +
    `?script=${encodeURIComponent(script)}&deploy=${encodeURIComponent(deploy)}`;
}

function pssSign(data, privateKey) {
  return crypto.sign('sha256', Buffer.from(data), {
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    saltLength: PSS_SALT_LENGTH,
  });
}

function buildJwt({ certId, clientId, audience, privateKey, now = Math.floor(Date.now() / 1000) }) {
  const header = { alg: 'PS256', typ: 'JWT', kid: certId };
  const payload = { iss: clientId, scope: 'restlets', aud: audience, iat: now, exp: now + JWT_LIFETIME_S };
  const signingInput = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  return `${signingInput}.${b64url(pssSign(signingInput, privateKey))}`;
}

function readCache() {
  try {
    const parsed = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    return isPlainObject(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function writeCache(cache) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (err) {
    process.stderr.write(`warning: could not write token cache: ${err.message}\n`);
  }
}

async function getToken(config, mappingName, { noCache, verbose }) {
  const mapping = resolveMapping(config, mappingName);
  const identity = { accountId: config.accountId, clientId: config.clientId, certId: mapping.certId };

  if (!noCache) {
    const hit = readCache()[mappingName];
    if (hit && hit.accessToken && hit.expiresAt - Date.now() > REFRESH_MARGIN_MS &&
        hit.accountId === identity.accountId && hit.clientId === identity.clientId && hit.certId === identity.certId) {
      if (verbose) process.stderr.write(`token: cache hit for "${mappingName}" (${hit.accessToken.slice(0, 6)}...)\n`);
      return { accessToken: hit.accessToken, expiresIn: Math.round((hit.expiresAt - Date.now()) / 1000), cached: true };
    }
  }

  const endpoint = tokenEndpoint(config.accountId);
  const privateKey = readPrivateKey(mapping.keyPath);
  const assertion = buildJwt({ certId: mapping.certId, clientId: config.clientId, audience: endpoint, privateKey });
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    client_assertion: assertion,
  });
  if (verbose) process.stderr.write(`token: POST ${endpoint} (mapping "${mappingName}")\n`);

  let res;
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: body.toString(),
    });
  } catch (err) {
    throw new TokenError(`token request failed: ${err.message}`);
  }
  const text = await res.text();
  if (!res.ok) throw new TokenError(`token endpoint returned HTTP ${res.status}\n${text}`);

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new TokenError(`token endpoint returned HTTP ${res.status} with a non-JSON body\n${text}`);
  }
  if (!parsed.access_token) throw new TokenError(`token response has no access_token\n${text}`);
  const expiresIn = Number(parsed.expires_in) || 3600;
  if (verbose) process.stderr.write(`token: received ${parsed.access_token.slice(0, 6)}... expires_in=${expiresIn}\n`);

  if (!noCache) {
    const cache = readCache();
    cache[mappingName] = { ...identity, accessToken: parsed.access_token, expiresAt: Date.now() + expiresIn * 1000 };
    writeCache(cache);
  }
  return { accessToken: parsed.access_token, expiresIn, cached: false };
}

// ---------- RESTlet call ----------

function buildRequestBody(opts) {
  if (opts['raw-body'] !== undefined) return { body: opts['raw-body'], requestId: undefined, generated: false };

  if (!opts.action) throw new UsageError('--action is required (or use --token-only / --raw-body)');
  let payload = {};
  if (opts.payload !== undefined && opts['payload-file'] !== undefined) {
    throw new UsageError('use only one of --payload and --payload-file');
  }
  if (opts.payload !== undefined) payload = parseJson(opts.payload, '--payload');
  if (opts['payload-file'] !== undefined) {
    let text;
    try {
      text = fs.readFileSync(opts['payload-file'], 'utf8');
    } catch (err) {
      throw new UsageError(`cannot read payload file ${opts['payload-file']}: ${err.code || err.message}`);
    }
    payload = parseJson(text, `payload file ${opts['payload-file']}`);
  }

  const body = { action: opts.action };
  let requestId;
  let generated = false;
  if (!opts['no-request-id']) {
    if (opts['request-id']) {
      requestId = opts['request-id'];
    } else if (!NO_REQUEST_ID_ACTIONS.has(opts.action)) {
      requestId = crypto.randomUUID();
      generated = true;
    }
  }
  if (requestId !== undefined) body.requestId = requestId;
  body.payload = payload;

  if (opts.extra !== undefined) {
    const extra = parseJson(opts.extra, '--extra');
    if (!isPlainObject(extra)) throw new UsageError('--extra must be a JSON object');
    Object.assign(body, extra);
  }
  return { body, requestId, generated };
}

function appendLog(entry) {
  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n');
  } catch (err) {
    process.stderr.write(`warning: could not write runbook log: ${err.message}\n`);
  }
}

async function callRestlet(config, opts) {
  const verb = (opts.verb || 'POST').toUpperCase();
  if (!['GET', 'POST', 'PUT', 'DELETE'].includes(verb)) throw new UsageError(`unsupported --verb ${opts.verb}`);
  const deployment = resolveDeployment(config, opts);
  const { body, requestId, generated } = buildRequestBody(opts);

  const token = await getToken(config, opts.as, { noCache: opts['no-cache'], verbose: opts.verbose });
  const url = restletUrl(config.accountId, config.script, deployment.scriptId);
  if (generated) console.log(`requestId: ${requestId}`);
  if (opts.verbose) process.stderr.write(`restlet: ${verb} ${url}\n`);

  const wireBody = typeof body === 'string' ? body : JSON.stringify(body);
  const init = {
    method: verb,
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };
  if (verb !== 'GET') init.body = wireBody; // fetch refuses a body on GET

  let status = 0;
  let parsed;
  try {
    const res = await fetch(url, init);
    status = res.status;
    const text = await res.text();
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  } catch (err) {
    parsed = `network error: ${err.message}`;
  }

  appendLog({
    ts: new Date().toISOString(),
    mapping: opts.as,
    deployment: deployment.scriptId,
    verb,
    action: typeof body === 'string' ? null : body.action,
    requestId: requestId ?? null,
    httpStatus: status,
    body,
    response: parsed,
  });

  console.log(`HTTP ${status}`);
  console.log(typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2));
  return status >= 200 && status < 300 ? 0 : 3;
}

// ---------- self-test ----------

function selftest() {
  const assert = (cond, msg) => { if (!cond) throw new Error(`selftest failed: ${msg}`); };
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
  const certId = 'FAKECERT123';
  const clientId = 'fake-client-id-abc';
  const audience = tokenEndpoint('0000000');
  const now = 1_800_000_000;

  const jwt = buildJwt({ certId, clientId, audience, privateKey, now });
  const parts = jwt.split('.');
  assert(parts.length === 3, 'JWT must have three parts');
  assert(parts.every((p) => /^[A-Za-z0-9_-]+$/.test(p)), 'JWT parts must be base64url without padding');

  const header = JSON.parse(b64urlDecode(parts[0]).toString('utf8'));
  const payload = JSON.parse(b64urlDecode(parts[1]).toString('utf8'));
  assert(header.alg === 'PS256' && header.typ === 'JWT' && header.kid === certId, 'header fields');
  assert(payload.iss === clientId && payload.scope === 'restlets' && payload.aud === audience, 'payload fields');
  assert(payload.iat === now && payload.exp === now + JWT_LIFETIME_S, 'iat and exp');
  assert(b64url(JSON.stringify(header)) === parts[0], 'header base64url round trip');
  assert(b64url(JSON.stringify(payload)) === parts[1], 'payload base64url round trip');

  const signingInput = Buffer.from(`${parts[0]}.${parts[1]}`);
  const signature = b64urlDecode(parts[2]);
  assert(signature.length === 256, 'signature must be 256 bytes for RSA 2048');
  const pssOptions = { key: publicKey, padding: crypto.constants.RSA_PKCS1_PSS_PADDING, saltLength: PSS_SALT_LENGTH };
  assert(crypto.verify('sha256', signingInput, pssOptions, signature), 'signature does not verify');
  assert(!crypto.verify('sha256', Buffer.from(`${parts[0]}.x${parts[1]}`), pssOptions, signature), 'tampered input must not verify');

  console.log('selftest ok');
}

// ---------- main ----------

async function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (err) {
    process.stderr.write(`error: ${err.message}\nRun with --help for usage.\n`);
    return 1;
  }
  if (opts.help || process.argv.length <= 2) {
    process.stdout.write(HELP);
    return 0;
  }
  if (opts.selftest) {
    selftest();
    return 0;
  }

  try {
    if (!opts.as) throw new UsageError('--as <mapping> is required');
    const config = loadConfig(opts.config ? path.resolve(opts.config) : DEFAULT_CONFIG);
    resolveMapping(config, opts.as);

    if (opts['token-only']) {
      const token = await getToken(config, opts.as, { noCache: opts['no-cache'], verbose: opts.verbose });
      console.log(`ok expires_in=${token.expiresIn} mapping=${opts.as}${token.cached ? ' (cached)' : ''}`);
      return 0;
    }
    return await callRestlet(config, opts);
  } catch (err) {
    if (err instanceof TokenError) {
      process.stderr.write(`error: ${err.message}\n`);
      return 2;
    }
    if (err instanceof UsageError) {
      process.stderr.write(`error: ${err.message}\n`);
      return 1;
    }
    throw err;
  }
}

main().then((code) => { process.exitCode = code; }).catch((err) => {
  process.stderr.write(`${err.stack || err.message}\n`);
  process.exitCode = 1;
});
