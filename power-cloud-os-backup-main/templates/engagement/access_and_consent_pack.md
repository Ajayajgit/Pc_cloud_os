# Access & Consent Pack

> DRAFT built overnight 2026-08-12, pending Mike's review. Client-facing email language: run through the humanizer standards before sending, and check WRITING_STANDARDS.md. MSA methodology language is a separate item pending the current MSA handoff.

Send at engagement start, all requests in one email, so lead-time items start immediately. Copy the blocks that apply, fill `{placeholders}`, delete the rest. Log the sent date and each approval in the client's CONTEXT.md.

---

## Block 1: AI and MCP disclosure (always)

Subject: {Client} / Power Cloud: system access for the {engagement name}

Hi {contact},

As we prepare for {the assessment / kickoff}, a note on how we work and what we need from your team.

Power Cloud uses AI tooling as part of our delivery process. In practice that means we connect to your NetSuite account through NetSuite's own MCP interface (an Oracle-supported, read-only connection during discovery) and use AI to verify what we hear on calls against how the account is actually configured. Your data is used only for this engagement's analysis. If you share call recordings with us, we may transcribe them using AssemblyAI, a speech-to-text service; the audio and transcript are deleted from that service as soon as our copy is saved. We are asking for your approval before anything is connected.

To set this up we need:

1. Your approval of the connection described above (a reply to this email works).
2. NetSuite's free "MCP Standard Tools" SuiteApp installed in the account by your admin (takes a few minutes; we will send instructions).
3. Access to your **sandbox** account rather than production where possible.

## Block 2: ScriptReader notice (when installing our toolset)

As part of setup we also deploy Power Cloud's Script Reader toolset into the account. It is read-only tooling that lets us review the actual source of existing scripts rather than guessing from names, which materially improves the quality of the findings. It installs like any account customization and we remove it at engagement close if you prefer. Please confirm you are comfortable with this install.

## Block 3: Environment access (ask for both up front)

For the assessment we work read-only against **production**, which gives us the most current picture of your configuration and activity. For any build work that follows, we test everything in your **sandbox** first before anything touches production. Could your admin set us up with access to both, and confirm which sandbox (SB1/SB2) we should use? If the sandbox needs a refresh, starting that now avoids delays later.

## Block 4: QuickBooks Online connection (when QBO is in the stack)

Part of our review covers your QuickBooks data. The connection is authorized by you: we will send a link, and whoever administers your QuickBooks clicks Approve once in the browser. The access is read-only on our side, used to profile your data (customers, items, chart of accounts, balances) ahead of {verification / migration planning}. Nothing in QuickBooks is changed.

`[to verify before first use: Intuit production-key unlock on our developer app; see DATA_CONNECTORS.md]`

## Block 5: Shopify connection (when Shopify is in the stack)

Part of our review covers your Shopify store data. The safest way to grant this is an app your admin creates in your own store admin, scoped read-only, in about three minutes:

1. In Shopify admin: **Settings > Apps > Develop apps** > **Allow custom app development** (if prompted) > **Create an app**.
2. Name it **Power Cloud Data Connector (read-only)**.
3. Under **Configure Admin API scopes**, check only: `read_products`, `read_customers`, `read_orders`{, `read_all_orders` if order history beyond 60 days is in scope}.
4. **Install app**, then under API credentials **reveal the Admin API access token** (shown once).
5. Send us the token via {secure channel: password-manager share or one-time link}, not regular email.

You can uninstall the app at any time, which immediately revokes our access.

`[to verify on a real merchant store before first client use; see DATA_CONNECTORS.md]`

## Block 6: Celigo access (when Celigo is in the stack)

Your integration layer is part of the review. Read-only access to your integrator.io account (or an API token scoped to read) lets us verify flow states, schedules, and error history directly rather than working from descriptions. Could you {invite {consultant email} with monitor-level access / generate a read API token}?

---

## CONTEXT.md logging lines (copy into the client's CONTEXT.md when answers arrive)

```
## Access & consent
- AI/MCP disclosure sent {date}, approved by {name} on {date}
- ScriptReader install approved {date} / declined / n-a
- Sandbox access: {granted date / requested, waiting since date}
- QBO connection: {approved by, date} / n-a; scopes verified read-only: {date}
- Shopify connector: {token received via, date} / n-a; granted scopes checked: {date}
- Celigo access: {granted, level, date} / n-a
- Recording transcription (AssemblyAI): approved by {name} on {date} / n-a
- Teardown/revocation at close: {date, what was revoked}
```
