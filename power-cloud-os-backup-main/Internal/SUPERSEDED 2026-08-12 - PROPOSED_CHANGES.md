# Proposed Changes for Morning Review: 2026-08-12

Overnight build staged everything it safely could; these are the items that change shared live behavior and therefore wait for Mike's explicit yes. Approve, edit, or reject each; I apply approved ones and log them in `.claude/skills/CHANGELOG.md`.

## P1. CLAUDE.md additions (the constitution; edits only with approval)

**a) Pointer lines** so sessions and consultants find the new docs (add to the reference-files section):

```
- **`SESSION_NORMS.md`**: how to run sessions: one task one session, model/effort discipline, the $25 credit policy, delegation habits.
- **`PROMPT_PATTERNS.md`**: the prompting techniques that work; use by hand until they are baked into skills.
- **`DATA_CONNECTORS.md`**: the engagement process when Shopify/QuickBooks are in a client's stack. Credentials never in this Drive.
- **`SALES_TO_DELIVERY.md`**: the pre-sales-to-delivery handoff; what must exist before a kickoff.
- **`ASANA_CONVENTIONS.md`**: interim task hygiene the exec-summary flow depends on.
```

**b) Naming and versioning conventions** (new Gotchas bullets):

```
- Generated deliverables carry a version suffix when regenerated same-day ({Client}_Assessment_{YYYY-MM-DD}_v2.docx); never two identical filenames with different content.
- Session titles carry client + environment ("Teppermans SB - suitelet fix"). Meeting titles follow {Client} | {topic}.
```

**c) CONTEXT.md template additions** (three blocks appended to the template):

```
## Access & consent
- {see templates/engagement/access_and_consent_pack.md for the standard lines}

## Deliverables & scope ledger
- {date}: {what was delivered/tested/communicated; explicit out-of-scope notes}

## Stakeholders
- {name, role, Asana access y/n, tag-for topics}
```

**d) Two-offering naming** (per the Aug 11 decision): note in the engagement-type line that client-facing names are **Rapid Assessment** (on-site, two full days) and **Fast Track Discovery** (remote, ~2-hour chunks).

## P2. WRITING_STANDARDS.md line (same decision)

Rename the remote framing: "fast discovery" becomes **Fast Track Discovery** wherever client-facing; on-site engagements are **Rapid Assessments**.

## P3. The write guardrail (A8, v3): ACTIVATED 2026-08-12 per Mike's go-ahead

> Status: wired into the shared `.claude/settings.json` (exec-form command, so the path's space and ampersand never touch a shell). Unit-tested against all seven connector cases including a BOM-robustness fix. Takes effect in NEW sessions (hooks load at session start; running sessions are unaffected). First-live verification still worth doing: from a fresh session, attempt a sandbox write (expect normal flow) and a prod-connector write (expect the forced confirmation with the gate message). Original proposal kept below for the record.

Design settled with Mike (2026-08-12) after two corrections: enforcement keys off the **connection**, not the session folder (everyone starts sessions in the client folder for every phase), and production writes are a **legitimate gated step** (sandbox-verified changes promote to production), so the guardrail's guarantee is "no silent production write," not "no production write."

Script at `.claude/hooks/block-netsuite-writes.py`, for `ns_createRecord/ns_updateRecord/ns_deleteRecord`:
- **Sandbox/demo-named connector**: normal flow (permission prompts + execution-skill gates).
- **Production-named connector**: forced explicit confirmation on EVERY write, even if allowlisted, with a reason restating the gate ("sandbox-verified execution work? If discovery: decline, read-only, no exceptions"). This mechanizes execution gate 2 for MCP data-writes.
- **Environment not identifiable from the connector name**: forced confirmation with a rename instruction (naming convention: every NetSuite connector carries Prod or SB/Sandbox).

Honest boundary, unchanged: hooks cover Claude Code sessions only, and the discovery hard-guarantee ("cannot write at all") is now a human-decline rather than a machine block. The durable fix for both remains the **read-only role variant on discovery connections** (ScriptReader project), enforcing inside NetSuite for every surface including claude.ai. Recommend both: hook now, role variant as the follow-up.

To activate, this goes in `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "ns_createRecord|ns_updateRecord|ns_deleteRecord",
        "hooks": [
          {
            "type": "command",
            "command": "python \"G:\\Shared drives\\Power Cloud Project Folders\\Power Cloud OS\\.claude\\hooks\\block-netsuite-writes.py\""
          }
        ]
      }
    ]
  }
}
```

Recommendation: test on YOUR machine first (attempt a write against a prod-named connector, confirm the forced confirmation with the gate message appears; against a sandbox-named one, confirm normal flow), then merge into the shared settings. Two caveats: it assumes `python` on PATH (true per ONBOARDING Part 1), and the path quoting must survive the spaces (the exec-form config avoids shell parsing entirely).

**Coupled docs:** ONBOARDING.md Part 3.2 and SESSION_NORMS.md now say sessions start in the client folder for every phase and that production writes always require an explicit per-write confirmation. That text assumes P3 goes live. If you reject or delay P3, soften those passages at the same time so the docs never claim protection that is not wired in.

## P3a. CLAUDE.md environment line (new, from Mike's 2026-08-12 guidance)

Session start in CLAUDE.md currently says connections are "normally to the client's **sandbox**." Mike's direction: ask for **both**; production reads are preferred for assessment work (freshest data; read-only so no write risk), sandbox is for execution builds. Propose revising that CLAUDE.md line and the sandbox-caveats emphasis accordingly when P1 is applied. ONBOARDING.md 2.2 and the consent pack's Block 3 already carry the new posture.

## P4. Roster completion

`provisioning/roster.md` has placeholder rows and my best-guess seat assignments (the four premium candidates). Fill real names/status before the meeting; I could not know the full team list.

## P5. Small confirmations

- SALES_TO_DELIVERY.md carries five `[confirm]` items only you/Taha can answer.
- The consent-pack QBO/Shopify blocks carry the two `[to verify]` markers from DATA_CONNECTORS.md; fine to leave until first client use.
- ONBOARDING.md Part 0a and all new root files carry DRAFT banners; strip them as you approve each.
