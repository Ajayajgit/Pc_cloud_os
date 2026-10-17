---
name: sdf-scaffold
description: Scaffold a new SuiteCloud SDF (SDF) account customization project to Power Cloud standards, or extend an existing one with a new object folder. Use when execution needs a project to deploy into and none exists yet, when starting a new client engagement's first build, or when suitecloud account:setup/project:deploy fail because no valid project (manifest.xml) is present. Produces project.json, suitecloud.config.js, src/manifest.xml, src/deploy.xml, and the src/Objects and src/FileCabinet folders, following the pattern used across Power Cloud's existing client SDF projects.
---

# SDF scaffold

Bootstraps an empty, valid SuiteCloud SDF account customization project so that `suitecloud account:setup`, `project:validate`, and `project:deploy` have something to run against. Does not author any objects or scripts; that's `netsuite-sdf`'s job. Does not deploy; that's `sdf-deploy`'s job.

## When to use

- The `execution` skill's setup step needs a project folder for a client and none exists.
- `suitecloud account:setup` or `project:deploy` failed with "No manifest.xml file was found."
- A client's execution needs a second, logically separate SDF project (rare — prefer one project per client unless there's a real reason to split, e.g. a distinct account/subsidiary target).

## Where the project lives

`{Client}/execution/sdf/` — a subfolder of the client's execution folder, sibling to `build_log.md`, `setup_checklist.md`, `design/`. One project per client by default (matches "simplify over future-proof"); only create a second project if the client genuinely has two SDF-deployable targets (e.g., two separate NetSuite accounts).

## Files to create

### `project.json`

```json
{
	"defaultAuthId": ""
}
```

Leave `defaultAuthId` empty. `suitecloud account:setup`, run by the human (it's an interactive browser OAuth login — never attempt this yourself, you don't have and shouldn't enter anyone's NetSuite credentials), fills this in. Don't pre-fill it with a guessed auth ID.

### `suitecloud.config.js`

```js
module.exports = {
    defaultProjectFolder: 'src',
};
```

### `src/manifest.xml`

```xml
<manifest projecttype="ACCOUNTCUSTOMIZATION">
    <projectname>PC | {Client} {Purpose}</projectname>
    <frameworkversion>1.0</frameworkversion>
    <dependencies>
        <features>
        </features>
    </dependencies>
</manifest>
```

- `projectname` gets the `PC | ` prefix, same brand convention as script records (see the global CLAUDE.md), even though the 40-char script-name limit doesn't technically apply here — keep it short anyway.
- `<dependencies><features>` lists features that must **already be enabled** in the target account for this project's objects to validate/deploy. This is a prerequisite check, not a way to enable features — that's a separate `AccountConfiguration/features.xml` object deployed like any other SDF object. Leave it empty at scaffold time; add entries as objects that need specific features get authored.
- `<dependencies><objects>` (add it beside `<features>` when first needed) lists account objects this project **references but does not own**: roles such as `customrole_pc_mcp_ai_connection`, records built in the UI, locked bundle objects. Declared objects are checked for existence and never deployed or modified. This is how a record type grants the MCP role or a field points at a locked List/Record; never import or stub those objects instead. See `netsuite-sdf` section 6.

### `src/deploy.xml`

```xml
<deploy>
    <files>
        <path>~/FileCabinet/*</path>
    </files>
    <objects>
        <path>~/Objects/*</path>
    </objects>
</deploy>
```

### Folders

- `src/Objects/` — SDF custom objects (scripts, roles, forms, saved searches, workflows, `AccountConfiguration/`, etc.)
- `src/FileCabinet/` — file cabinet assets (logo images, HTML/PDF templates referenced by scripts, etc.)

## After scaffolding

1. Tell the user the project is ready and give them the exact `cd` + `suitecloud account:setup` command to run themselves. Explain *why* it has to be them: the command opens a browser for NetSuite login/OAuth consent, and entering credentials or granting OAuth on someone's behalf is not something to do even if asked — direct them to run it.
2. Once they report the auth ID they chose, verify it yourself with `suitecloud account:manageauth --list` and confirm the account identity (company name shown alongside the auth ID) actually matches the intended target before anything gets built against it. Don't assume; a mismatched or stale auth ID pointed at the wrong account is exactly the kind of mistake this check exists to catch.
3. Record the confirmed auth ID and account identity in the client's `execution/CLAUDE.md` connection posture section.

## Gotchas carried over from the global conventions

- **Account prerequisites**: `account:setup`'s browser OAuth flow needs OAUTH 2.0 checked under Setup → Company → Enable Features → SuiteCloud tab in the target account, alongside SUITECLOUD DEVELOPMENT FRAMEWORK, TOKEN-BASED AUTHENTICATION, and REST WEB SERVICES. If setup fails with an OAuth2-feature error, that's the fix — someone with admin access needs to check those boxes manually first (both TBA and the SuiteCloud framework toggle are themselves outside SDF's own reach, so this is unavoidably a manual first step).
- **`desktop.ini` files**: Windows Explorer can seed these into `src/FileCabinet/` once real files start landing there. They're harmless but SDF uploads them to the File Cabinet on deploy. Not a scaffold-time concern, but worth a mention in the project's notes so whoever builds later remembers to sweep them (`find src -name "desktop.ini" -delete`) before each deploy.
