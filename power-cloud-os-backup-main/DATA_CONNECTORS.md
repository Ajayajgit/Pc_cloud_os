# Data Connectors: Shopify / QuickBooks on a Client's Stack

The engagement process when discovery reveals Shopify or QuickBooks (or both) in a client's tech stack. Companion to CAPABILITIES.md (which records what is proven) and the B12 data workstream in POWERCLOUD_OS_ROADMAP.md. Written 2026-08-11 from the A12 spike; items marked `[to verify]` have not been run against a real client yet.

## The rules that never bend

1. **Credentials never touch the shared Drive.** Tokens, client IDs, secrets live on the connection holder's machine under `C:\Development\Connections\{Client}\` (or equivalent), one folder per client. The client subfolder in this workspace gets the *artifacts* (profiles, extracts, mapping specs), never the keys.
2. **Read-only during discovery, mechanically enforced.** QBO: the MCP server's `QUICKBOOKS_DISABLE_WRITE/UPDATE/DELETE=true` flags, always. Shopify: the scope list we request is read-only; treat any credential whose granted scopes include `write_*` as a write-capable key and get it re-scoped before use (the spike proved unconfigured apps default to full write access).
3. **Consent is a record.** The disclosure email, who approved, the date, and the granted scopes go in the client's CONTEXT.md before the first query. Same posture as the NetSuite MCP connection.
4. **Identity check before first query.** Confirm the connected company/store actually belongs to this client (QBO CompanyInfo name; Shopify shop name and domain) and record it in CONTEXT.md. Same rule as the NetSuite account check, same reason.
5. **One holder per connection.** The engagement lead holds the credential and runs the pulls; teammates work from the artifacts in the client folder. Connections are per-machine today (unlike the org-level NetSuite connectors); the portal centralizes this later.

## Process, end to end

**0. Trigger.** Discovery (sales call, kickoff, tech-stack review) reveals Shopify/QB. Record it in CONTEXT.md's tech stack and add the connector request to the engagement's access-and-consent pack alongside the NetSuite MCP and sandbox requests, so it rides the same email and the same lead time.

**1. Disclosure and consent.** Send the standard request: what we connect to, read-only, what we will look at (catalog, customers, order history, chart of accounts), and why (verify what we heard on calls; profile data ahead of any migration work). Get the written yes. Log it.

**2. Access acquisition (differs by source).**

- **QuickBooks Online.** The client's QBO admin approves our app's OAuth request in their browser; that click-through IS the authorization artifact. One-time handshake needs our production Intuit app and a public HTTPS redirect for that single approval; after it, a refresh token operates locally with no further client action (rotates automatically, ~100-day idle ceiling). Store the token in a per-client file via `QUICKBOOKS_TOKEN_STORE_PATH` (the server supports one isolated token file per client for exactly this). `[to verify: Intuit production-key unlock requirements on our developer app; the sandbox leg is proven]`
- **Shopify.** The client's store admin creates a custom app in their own admin (Settings > Apps > Develop apps), grants exactly the scopes we specify (`read_products`, `read_customers`, `read_orders`; add `read_all_orders` only when history beyond 60 days matters), installs it, and reveals the one-time `shpat_` admin token. We send click-by-click instructions with the scope list; naming convention for the app: **Power Cloud Data Connector (read-only)**, so what they see in their app list says what it is. Token handoff over a secure channel (password-manager share or read-once link, never plain email). Note: the client-credentials grant we proved on our own dev store does NOT apply to client stores (same-organization only). `[to verify: the in-admin custom app flow on a real merchant store; our dev store redirected to the Dev Dashboard, which is dev-store behavior]`

**3. Register and name.** Wire the credential on the holder's machine with the client's name in it (`{client}-qbo`, `{client}-shopify`), never a bare "quickbooks." Session titles and MCP server names carry client + environment, per the naming conventions. Then run the identity check (rule 4).

**4. Profile.** Run the standard read-only data profile from inside the client's subfolder. Output lands in `{Client}/working/data_profile_qbo.md` / `data_profile_shopify.md`: entity counts, field fill rates, CoA type distribution, variant/option structure, parent/child usage. The profile's job is to surface the design decisions (matrix vs attributes, customer hierarchy, item identity when SKUs are sparse, CoA consolidation) as explicit items in `working/candidates.md`, tiered like any other finding. This replaces "send us a spreadsheet and we'll see."

**5. Use in the deliverable.** Profile findings feed the assessment's tech-stack section and the candidate register with [Verified] tier (we read the system, not the call). Where a call claim and the source system disagree, that is a finding, same as NetSuite.

**6. Migration/execution use (B12 pipeline).** Design decisions first, then the mapping spec as the human-gated contract, dry run into sandbox, MCP-verified reconciliation, gated production load. Extracts are pulled fresh at each load; the pipeline is re-runnable; external-ID discipline throughout.

**7. Teardown.** At engagement close (or pause), the client revokes the app / connection on their side, and we delete the local credential folder. Note the revocation date in CONTEXT.md. A dormant credential to a client system is risk with no revenue attached.

## Consultant quick reference

| | QuickBooks Online | Shopify |
|---|---|---|
| Client does | Admin clicks Approve on our OAuth request (browser, one time) | Admin creates read-only custom app from our instructions, sends token securely |
| We hold | Refresh token, per-client token file, local machine | `shpat_` admin token, per-client env file, local machine |
| Read-only by | Server disable flags (write tools never register) | Requested scope list; verify granted scopes on first token use |
| Identity check | CompanyInfo name matches client | Shop name/domain matches client |
| Artifacts in folder | `working/data_profile_qbo.md` | `working/data_profile_shopify.md` |
| Renewal reality | Refresh token rotates on use; ~100-day idle expiry re-requires the handshake | Token is static until the client uninstalls the app |
