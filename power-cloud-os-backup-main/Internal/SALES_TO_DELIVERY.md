# Sales-to-Delivery Handoff

> DRAFT built overnight 2026-08-12, reconstructed from the AI Summit transcripts (Day 3 mostly). Items marked `[confirm]` are best-effort reads of how it works today; Mike/Taha to correct before this becomes doctrine. The duplicate-Asana-project incident happened precisely because this process lived in heads, not files.

The point: by the time a consultant starts the engagement, the tool must know what already exists and what was already promised. "It's important that the tool understands the process that happens before we even start."

## The sequence

**1. Pre-sales (before any consultant is assigned).**
Sales runs discovery calls with the prospect; every call is recorded (standing rule since Day 1 of the summit). Pre-sales creates: the **Asana project** `[confirm: always? who: Jason Kramer role]`, the **email group/alias** `[confirm: naming convention]`, and a **project folder** `[confirm: where, and does it move into this workspace or start here]`. Sales notes and the proposal live with these.

Two commercial expectations get set here, per the summit decisions:
- **Pricing assumes AI-assisted execution.** Quotes are contingent on the client committing to MCP access; a client that restricts tooling does not get the same number.
- Remote-only discovery yields non-firm LOEs with discovery-led items deferred (Fast Track Discovery framing).

**2. Assignment and electronic introduction.**
The engagement lead is assigned; sales makes the email introduction to the client `[confirm: template exists?]`. From this moment the lead owns the relationship.

**3. Internal turnover (sales → delivery).**
A working session, not a document dump. The lead receives: sales notes and call recordings, the proposal/SOW with any engagement-specific commitments, the Asana project link, the email group, and the client's stated tech stack. **The tool's job**: everything from this handoff lands in the client folder (`source/` for client-words material, CONTEXT.md for facts and commitments) via the `new-engagement` scaffolder, so the folder, not the lead's memory, carries the context.

**4. Internal kickoff (delivery side).**
The lead, with the tool: read all pre-sales material, run the access & consent pack (MCP disclosure, sandbox request, ScriptReader notice, source-system connectors per stack), send Mike/Taha the account ID for the MCP connector, and start MCP discovery the moment access lands.

**5. Kickoff prep (the A5 upgrade, the summit's flagship pre-sales request).**
Before the client kickoff call, the tool produces from sales notes + MCP discovery + website research: a **draft agenda**, and **targeted questions sent to the client in advance**. "The thing the customers hate most is repeating themselves"; the kickoff must demonstrate we already know their world. This shortens the assessment itself.

**6. Client kickoff call.**
Runs on the prepared agenda. Recording lands in `source/` (title convention `{Client} | {topic}` so auto-filing works). From here the rapid-assessment skill owns the process.

## Rules this process enforces

- **Check before create, always**: Asana projects, folders, email groups. Pre-sales artifacts exist; find them, link them, never duplicate them.
- **No consultant walks into a kickoff cold.** If the folder cannot brief you, the handoff did not happen; push back before the call, not after.
- **Commitments are recorded where the tool reads them**: engagement-specific promises from sales (deliverable names, dates, scope beyond standard) go in CONTEXT.md's promised-deliverable line at turnover, not remembered.

## Open items `[confirm]`

1. Who exactly creates the Asana project / email group / folder today, and is it consistent?
2. Folder location at pre-sales time: does it start in this workspace or migrate in at turnover?
3. Does an introduction-email template exist, or should one join `templates/engagement/`?
4. Where do signed SOWs live, and does a redacted copy (per the Day 1 decision) go into `source/`?
5. When in this sequence does the MCP-access commitment get written into the quote/SOW language?
