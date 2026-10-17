# CRM RESTlet driver

`crm_api_driver.mjs` calls the Power Cloud CRM RESTlet using the NetSuite OAuth 2.0 client
credentials flow (PS256 signed JWT). Node 18+, no npm install.

## Setup
1. Copy `crm_api.example.json` to `crm_api.local.json` (git-ignored) and fill in the Client ID,
   the Certificate ID per mapping, and the private key path per mapping.
2. Add as many mappings as you have certificates (sales, travel, admin). Each mapping name needs
   a matching entry under `deployments`, or pass `--deploy` explicitly.
3. Keep key files outside the repo. `*.key` and `*.pem` under `tools/` are git-ignored as a backstop.

## Usage
```
node crm_api_driver.mjs --selftest
node crm_api_driver.mjs --as sales --token-only
node crm_api_driver.mjs --as sales --action resolveClient --payload '{"name":"Acme"}'
node crm_api_driver.mjs --as travel --action listTravelProjects
node crm_api_driver.mjs --as sales --action createEndClient --payload-file client.json
node crm_api_driver.mjs --as sales --action createEndClient --payload-file client.json --request-id <uuid>
```
`--help` lists every flag. Test helpers: `--verb GET|PUT|DELETE`, `--raw-body '<string>'`,
`--extra '{"junk":1}'`, `--no-request-id`, `--deploy <key>` (cross-mapping tests).

## Behavior
- A requestId is generated for every action except `resolveClient` and `listTravelProjects`
  and printed as `requestId: <uuid>`. Reuse it with `--request-id` to test replay.
- Tokens are cached per mapping in `.token_cache.json`; `--no-cache` bypasses it.
- Every RESTlet call appends one line to `runbook_log.jsonl` (no tokens, keys or headers).
- GET requests are sent without a body, because `fetch` does not allow one.
- Exit codes: 0 HTTP 2xx, 1 usage or config error, 2 token failure, 3 RESTlet non-2xx or network error.

## Git-ignored
`crm_api.local.json`, `*.key`, `*.pem`, `runbook_log.jsonl`, `.token_cache.json`
