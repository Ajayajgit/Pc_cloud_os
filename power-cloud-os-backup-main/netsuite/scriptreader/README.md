# Power Cloud Script Reader

> Read and evaluate real SuiteScript source straight through the NetSuite AI Connector (MCP) — no downloads, no guesswork, no reliance on memory of why a script was built.

![SuiteScript 2.1](https://img.shields.io/badge/SuiteScript-2.1-31A4F3)
![NetSuite 2026.1](https://img.shields.io/badge/NetSuite-2026.1-002F59)
![SDF ACP](https://img.shields.io/badge/SDF-Account%20Customization-6EEAD8)
![Read only](https://img.shields.io/badge/access-read--only-41B946)

---

## Why this exists

The NetSuite MCP server is excellent at returning records, metadata, and query results — but it **cannot open the body of a script file**. The built-in SuiteQL tools can tell you a script's name, type, and file size, yet never a single line of its **code**, because the File Cabinet's content isn't exposed to SuiteQL.

Script Reader closes that gap. It deploys four read-only custom tools into a NetSuite account that surface inside the **same MCP connection** you already use (alongside `ns_getRecord`, `ns_runCustomSuiteQL`, …). With them, an assistant can open an existing customization, understand exactly what it does, and flag mistakes or inefficiencies — in conversation.

## The tools

| Tool | What it does |
| --- | --- |
| `readScriptSource` | Return the real source of a script by custom id, internal id, name, File Cabinet file id, or path. Line-range paging for large/minified files. |
| `listScripts` | Discover scripts (metadata only) with optional name substring and script-type filters. |
| `readFile` | Read any File Cabinet **text** file (XML, JSON, CSV, templates). Binary files are refused, not dumped as base64. |
| `getScriptDeployments` | Return a script's deployment records — status, execution context, log level — i.e. how and when it actually runs. |
| `getAccountInfo` | The account identifies itself: account id, environment (production/sandbox), NetSuite release version, NetSuite Next API availability, and Company Information fields when the role permits. Call it first on any engagement to confirm what you are connected to. |

All five are **read-only** and never modify the account. `listScripts` and `getScriptDeployments` return their rows as a JSON-encoded string (`scriptsJson` / `deploymentsJson`), per NetSuite's custom-tool guidance to stringify structured output. `getAccountInfo` needs no permission for its `N/runtime` facts (account id, environment, release); the Company Information fields additionally need the Set Up Company permission and degrade gracefully without it — the toolset's permission gate is deliberately left at file-cabinet view only so adding this tool cannot lock any existing role out.

## How it works

A NetSuite AI Connector custom tool is **not** a RESTlet. It is three artifacts deployed together via SuiteCloud Development Framework (SDF):

1. **A SuiteScript 2.1 file** (`@NScriptType CustomTool`) whose exported `async` methods *are* the tools. It reads source with `N/file.load().getContents()` and resolves scripts via SuiteQL (`N/query`) — the only server-side path to file content.
2. **A JSON tool schema** declaring each tool's `name`, `description`, `inputSchema`, `outputSchema`, and `annotations`. This is what makes them appear in the MCP connection.
3. **An SDF `toolset` object** wiring the script + schema together, exposing them to the AI Connector, and gating which roles can see them.

This project ships as a SuiteCloud **Account Customization Project (ACP)**, so it deploys straight into any account you administer — no SDN publisher id required.

## Repository layout

```
.
├─ src/
│  ├─ manifest.xml                              # ACCOUNTCUSTOMIZATION project
│  ├─ deploy.xml
│  ├─ FileCabinet/SuiteScripts/PowerCloud/scriptreader/
│  │  ├─ scriptreader_tools.js                  # CustomTool — 4 async tools
│  │  └─ scriptreader_schema.json               # tool schema
│  └─ Objects/
│     ├─ custtoolset_pc_scriptreader.xml        # toolset object (exposetoaiconnector=T)
│     └─ customrole_pc_mcp_ai_connection.xml    # MCP connection role (GENERATED — do not edit)
├─ roles/
│  └─ customrole_pc_mcp_ai_connection.master.xml  # role source of truth (full OneWorld)
├─ scripts/
│  └─ set-role-variant.js                       # writes the deployable role variant
├─ docs/
│  ├─ ScriptReader-Tools-Guide.html             # brand-styled usage guide (self-contained)
│  ├─ ScriptReader-Tools-Guide.pdf              # printable version
│  └─ assets/powercloud-logo.png
├─ package.json                                 # SuiteCloud CLI (2026.1) + docs tooling
└─ suitecloud.config.js
```

## Prerequisites

- **NetSuite account on 2026.1** (this project uses the `toolset` object). On 2025.2 the object type is `tool` and the CLI is 3.1.x — see [Versioning](#versioning).
- Account features: **Server SuiteScript**, **OAuth 2.0**, **SuiteCloud Development Framework**.
- **SuiteCloud CLI for Node** — pinned locally to 2026.1; run it via `npx suitecloud` (no global install needed).

```bash
npm install        # installs @oracle/suitecloud-cli ^3.2.0 locally
```

## Deploy

```bash
# 1. Authenticate with a DEPLOY role (Administrator or a role with "SuiteApp Deployment")
npx suitecloud account:setup

# 2. Pick the MCP-role variant for the target account (see below)
npm run role:oneworld-notax    # OneWorld + SuiteTax-style account (most new accounts)
npm run role:oneworld-notax-mfg # as above, on a Manufacturing / inventory-ops account
npm run role:oneworld          # OneWorld + legacy tax
npm run role:standard-notax    # non-OneWorld (single subsidiary) + SuiteTax-style
npm run role:standard          # non-OneWorld + legacy tax

# 3. Validate against the account
npx suitecloud project:validate --server

# 4. Deploy
npx suitecloud project:deploy
```

Then grant the **role used for the MCP connection** the **File Cabinet (View)** permission (the toolset's visibility gate) and connect your AI client to the account's NetSuite AI Connector. Confirm the toolset under **Customization → Scripting → Custom Tools**.

> **Two roles, two jobs.** Deployment needs a role with *SuiteApp Deployment* (Administrator or an SDF-developer role). The live AI Connector connection uses a **non-Administrator** role (the AI Connector does not support Administrator) — keep it minimal, with just the permissions the tools need to read. Don't reuse the deploy role for the connection, or grant deploy rights to the connection role.

## The MCP connection role

The project ships the connection role itself: **PC MCP AI Connection Role** (`customrole_pc_mcp_ai_connection`), including the AI Connector gates (`ADMI_MCP_SERVER`, `ADMI_LOGIN_OAUTH2`, `ADMI_RESTWEBSERVICES` at Full). After deploying, assign it to the connection employee(s) — permission changes apply on the next tool call, no reconnect needed.

> **2026.2:** the role must NOT have **Core Administration Permissions** checked (`coreadminpermission` is `F` in the master). As of 2026.2 NetSuite enforces its documented rule that "full permissions" roles cannot use the AI Connector — a core-admin role gets "Your role does not support OAuth2 login" at the MCP OAuth2 handshake (unannounced tightening; worked on 2026.1). If a connection breaks after an account's 2026.2 upgrade: redeploy this role (or uncheck the box manually), then revoke the client's entry under **Setup → Integration → OAuth 2.0 Authorized Applications** and reconnect.

**The deployable XML in `src/Objects/` is generated — edit only the master** at `roles/customrole_pc_mcp_ai_connection.master.xml`, then regenerate:

| Command | Use for | What it does |
| --- | --- | --- |
| `npm run role:oneworld` | OneWorld accounts | Copies the master minus the opt-in mfg set (below) |
| `npm run role:standard` | Non-OneWorld accounts | Strips SUBSIDIARIES-gated content (`subsidiaryoption`, `subsidiaryviewingallowed`, `LIST_CONTACTSUBSIDIARYRELATION`, `LIST_ENTITYSUBSIDIARYRELATION`, `REPO_CONSOLIDATED_REPORTING`) — deploying those to a non-OneWorld account fails server validation |
| `npm run role:oneworld-notax` / `npm run role:standard-notax` | Either of the above on a SuiteTax-style account | Additionally strips the legacy-tax permission `TRAN_TAXLIAB` (Pay Sales Tax), which those accounts reject at role creation with `Invalid permkey1 reference key TRAN_TAXLIAB`. Server validation does **not** catch this — only the deploy does. Every new account since mid-2026 has rejected it, so start with a `-notax` variant and fall back to the plain one only for accounts known to run legacy tax |
| `--mfg` modifier (`npm run role:oneworld-notax-mfg`, or pass `--mfg` to the script) | Accounts running Manufacturing / advanced inventory | **Opt-in:** every variant strips the 18 mfg/inventory permkeys (BOMs, BOM revisions + inquiries, work orders, assembly builds/unbuilds, locations, bins, inbound shipments, inventory adjustments/transfers/counts/worksheets, transfer orders, bin transfers/worksheets, inventory reports — all View) unless `--mfg` is passed. They are feature-gated, so they'd break accounts without those features. WMS SuiteApp custom records are not included |

Two things to know before validating against a new account:

1. **Local `project:validate` always exits 1 on this project** — the CLI's bundled schema doesn't know several newer permkeys (`ADMI_MCP_SERVER`, `LIST_GIFT_CERTIFICATE`, …) that every account accepts. Only `project:validate --server` is authoritative.
2. If server validation or the deploy rejects a permkey/permlevel for a specific account (feature-gated permissions vary), trim it in `src/Objects/` for that deploy — and only update the master if the rejection is a platform rule (e.g. `REPO_RECONCILE` only accepts View anywhere). If the same key keeps recurring across accounts, add it to a variant in `scripts/set-role-variant.js` (as was done for `TRAN_TAXLIAB`) rather than hand-trimming each time.

## Connect &amp; use

Once deployed and connected, just ask in plain language — the assistant picks the tool:

```
Read the source of customscript_cl_validate_email and tell me what it does.
List the Map/Reduce scripts with "commit" in the name.
Evaluate script 458 for errors and efficiency.
Show the deployments for customscript_qm_wf_admin_assignqueue — is it scheduled?
Open /SuiteScripts/PowerCloud/config.json and explain it.
```

### For colleagues already connected

The tools deploy at the **account** level, so anyone whose role already has the gating permission is immediately authorized — no per-user setup. They only need to **reconnect their MCP connection once** so the client re-fetches the (now-updated) tool list.

## Behaviour &amp; limits

- **Read-only** — nothing is created, edited, or deleted.
- **Plain-text source** — `.js` comes back verbatim, never base64.
- **Paging** — use `startLine` / `maxLines`; the `truncated` flag signals more. Default window 2,000 lines; files over 10 MB are reported, not loaded.
- **Binary refused** — `readFile` returns `isBinary: true` instead of unreadable base64.
- **Graceful errors** — each tool returns a human-readable `error` field rather than throwing.
- **Visibility follows permissions** — the connecting role only sees what it may view.

## Versioning

| NetSuite release | SDF object | SuiteCloud CLI | AI-exposure flag |
| --- | --- | --- | --- |
| **2026.1** (this repo) | `toolset` (`custtoolset_*`) | 3.2.x | `exposetoaiconnector` |
| 2025.2 | `tool` (`customtool_*`) | 3.1.x | `exposeto3rdpartyagents` |

The SuiteScript and JSON schema are identical across both; only the SDF object differs. Match the CLI to the **account's** release.

## Documentation

A full, brand-styled usage guide lives in [`docs/`](docs/) — open [`ScriptReader-Tools-Guide.html`](docs/ScriptReader-Tools-Guide.html) or the [PDF](docs/ScriptReader-Tools-Guide.pdf). Regenerate the PDF from the HTML with the local `playwright` dev dependency.

## License

Internal — © Power Cloud Consulting. Not for external distribution.
