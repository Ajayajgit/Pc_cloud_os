# Rollout Punchlist

> Working list, live. Started as `PROPOSED_CHANGES_2026-08-12.md` (the overnight build's morning-review staging doc) and became the burn-down for what that build left open. Check items off as they land; add new ones at the bottom of the relevant section. Anything applied gets a dated line in `.claude/skills/CHANGELOG.md`.
>
> Last reconciled against the actual files: 2026-08-12.

## Needs your decision

These were staged pending your yes and have not been applied.

- [ ] **Pointer lines in CLAUDE.md.** Add three files to the reference-files section so sessions and consultants find them. Two of the original five (`SESSION_NORMS.md`, `SALES_TO_DELIVERY.md`) moved to `Internal/` on 2026-08-12 and no longer belong in a root reference list.
  ```
  - **`PROMPT_PATTERNS.md`**: the prompting techniques that work; use by hand until they are baked into skills.
  - **`DATA_CONNECTORS.md`**: the engagement process when Shopify/QuickBooks are in a client's stack. Credentials never in this Drive.
  - **`ASANA_CONVENTIONS.md`**: interim task hygiene the exec-summary flow depends on.
  ```

- [ ] **Deliverable version-suffix rule.** Proposed as a CLAUDE.md gotcha; currently exists nowhere in CLAUDE.md, the skills, WRITING_STANDARDS, or QA_CHECKLIST.
  ```
  - Generated deliverables carry a version suffix when regenerated same-day
    ({Client}_Assessment_{YYYY-MM-DD}_v2.docx); never two identical filenames
    with different content.
  ```

- [ ] **Meeting-title convention.** `{Client} | {topic}`. The session-title half of this proposal is already handled (CLAUDE.md session start item 8, plus the guide's best practices), so only meeting titles remain, and only if you want it written down as a rule.

- [ ] **CONTEXT.md template additions.** Three blocks appended to the template, which moved on 2026-08-16 from the bottom of CLAUDE.md to `templates/client-record/CONTEXT.md`:
  ```
  ## Access & consent
  - {see templates/engagement/access_and_consent_pack.md for the standard lines}

  ## Deliverables & scope ledger
  - {date}: {what was delivered/tested/communicated; explicit out-of-scope notes}

  ## Stakeholders
  - {name, role, Asana access y/n, tag-for topics}
  ```

## Needs you or Taha

- [ ] **Five sales-process questions** in `SALES_TO_DELIVERY.md`, all marked `[confirm]`. They were reconstructed from the AI Summit Day 3 transcript and are best-effort reads of how things work today:
  1. Who exactly creates the Asana project / email group / folder today, and is it consistent?
  2. Folder location at pre-sales time: does it start in this workspace or migrate in at turnover?
  3. Does an introduction-email template exist, or should one join `templates/engagement/`?
  4. Where do signed SOWs live, and does a redacted copy (per the Day 1 decision) go into `source/`?
  5. When in the sequence does the MCP-access commitment get written into the quote/SOW language?

- [ ] **Roster completion** in `provisioning/roster.md`. Real names are in for Mike, Taha, Justin, Imran, and Ron. Still open: the `{name}` placeholder row (the person blocked all summit week; verify seat and Drive access first), the `{add rows per team member}` row, and most gate checkboxes.

- [ ] **Seat tiers.** The four premium candidates are marked "(proposed)". Confirm or change before anyone is provisioned.

## From the 2026-08-21 Mike + Taha discussion (Sept 3 rollout)

Full write-up and rationale in `POWERCLOUD_OS_ROADMAP.md` section 6a. These are the pieces with a date attached.

- [x] **Shared-drive migration (A13)** (2026-08-22). New dedicated `Power Cloud OS` shared drive, OS at the drive root; contents moved (IDs preserved), zero stragglers against the pre-move manifest; 28-replacement path sweep applied (only the `Power Cloud Project Folders\Power Cloud OS` segment; bare legacy-annex references deliberately kept). **Still owed** (tracked in `Internal/A13_MIGRATION_PLAN.md`): team membership + per-consultant re-share verification before Sept 3, DLP incident review, Monday hours job re-pointed (`POWER_CLOUD_OS_FOLDER_ID` + script identity membership) and verified next run, cross-drive shortcuts, guide re-render distribution.
- [x] **"Proposal" becomes "Presentation" (A14)** (2026-08-22). Applied to the `{Client}_Presentation_{date}.pptx` filename, CLAUDE.md, ONBOARDING, WRITING_STANDARDS, PRODUCTS, stage 04, and the render/export script examples. Deliberately untouched: an inbound sales proposal in `source/`, ONBOARDING's historical title note, the internal `working/draft_proposal_deck.md` filename, and shipped client records. Detail in `.claude/skills/CHANGELOG.md`.
- [x] **Per-client hours log (A16)** — **verified live 2026-08-24.** The Monday run wrote 7 per-client files (44 Pro, American Barbell, Shinesty RA, ACFB, Upward Projects/Bulk AP, Teppermans RA + Teppermans/Promotions Issues both via the shared N. Teppermans Limited job). The mapping lines added Friday (ACFB, both Teppermans, Shinesty Redo=none) all resolved correctly; Shinesty Redo correctly excluded; MH Crane had no in-window hours. Duplicate-run gone: single run, 490s (vs ~815s doubled), one transient 429 that self-healed (vs the 10-13 collision storms before). **Remaining: repoint the exec-summary skill's hours source to the per-client log** (now unblocked). Announce the one-week lag at the all-hands.
- [x] **Feedback and ideas capture (A17)** (2026-08-22). `feedback/` inbox (one file per entry), the `feedback` skill for capture and triage, `build_feedback_index.py` generating `FEEDBACK.md`, and the proactive-offer rule in CLAUDE.md. **Still owed: announce it at the all-hands**, and decide whether the session-end learnings interview always asks the OS-feedback question or only when something visibly went wrong (recommendation: always for the first month, then conditional).
- [ ] **Client-approval and dev-review gate (A15).** Execution skill will not start a build task without a verified Asana approval; scripted work carries a dev review before it returns to the consultant. Design first, since it changes the execution workflow.
- [x] **Both guides updated for A14 and A17** (2026-08-22). `ONBOARDING.md` gained function 11 (feedback), a quick-reference line, and the Presentation rename, then re-rendered to `How to Work in the Power Cloud OS.docx` and `.pdf` (8 pages). The capabilities artifact was updated in place at the same URL, so anyone it was shared with sees the new version immediately. Its HTML source now lives at the root as `The Power Cloud OS.html` rather than only in a session temp folder.
- [ ] **Rollout program (A18).** How-to PDF and capabilities guide distributed, step zero mandated with Mike's calendar open, end-to-end narrative prepared, presenter brief sent to Imran, Justin, and Ron, pre-vet session held, India attendance confirmed with Besh.

## Verification owed

- [x] **First live test of the write guardrail** (fired live on MH Crane from 2026-09-25; v4 behavior confirmed, then replaced). **Owed instead: first live run of gate v5** (installed 2026-10-06): from a fresh MH Crane execution session, one production create alone (expect the plain-English session prompt once), then a parallel-agent batch (expect no further prompts), then a delete (expect its own prompt once). Original note:  The hook is wired into the shared `.claude/settings.json` and unit-tested against all seven connector cases, but has never fired in a real session. From a fresh session: attempt a write against a sandbox-named connector (expect normal flow), then against a production-named connector (expect a forced confirmation carrying the gate message). Hooks load at session start, so this needs a new session, not this one.

- [ ] **Read-only role variant on discovery connections.** The durable fix the hook only approximates. A hook covers Claude Code sessions only; a role enforces inside NetSuite for every surface including claude.ai. Recommended as the follow-up to the hook, via the ScriptReader project.

## DRAFT banners to strip as you approve each

- [ ] `PROMPT_PATTERNS.md`
- [ ] `ASANA_CONVENTIONS.md`
- [ ] `.claude/skills/CHANGELOG.md`
- [ ] `templates/engagement/access_and_consent_pack.md`
- [ ] `templates/data/mapping_spec_qbo_to_netsuite.md`
- [ ] `templates/data/mapping_spec_shopify_to_netsuite.md`

## Done

- [x] **Write guardrail activated** (2026-08-12). PreToolUse hook on `ns_createRecord|ns_updateRecord|ns_deleteRecord` at `.claude/hooks/block-netsuite-writes.py`, exec-form so path spaces never touch a shell. Sandbox/demo connectors flow normally; production connectors force a per-write confirmation restating the gate; unidentifiable connectors force confirmation plus a rename instruction. Enforcement keys off the connection, not the session folder, and the guarantee is "no silent production write," not "no production write." Live test still owed, above.
- [x] **Two-offering naming applied** (2026-08-12). **Rapid Assessment** for on-site (two full days), **Fast Track Discovery** for remote (roughly two-hour chunks), per the Aug 11 decision. Landed in CLAUDE.md's engagement-type line, `WRITING_STANDARDS.md`, and the rapid-assessment skill. The new-engagement skill already carried it.
- [x] **Production-preferred environment posture applied** (2026-08-12). CLAUDE.md session start now says ask for both environments, production preferred for assessment and discovery (current data, and the read-only rule means no write risk), sandbox for execution builds. The sandbox-caveats bullet now reads as the reason for that preference. ONBOARDING 2.2 and the consent pack's Block 3 already carried the posture.
- [x] **Consent-pack `[to verify]` markers resolved.** Zero remain in `templates/engagement/access_and_consent_pack.md`.
- [x] **ONBOARDING Part 0a** dropped entirely rather than de-drafted, per your call that engagement pre-reqs come after the one-time software setup.
