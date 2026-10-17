# Stage 06 — After finals ship: retro and learnings triage

One job: harvest what this engagement taught the practice, and let the user decide what becomes doctrine.

- Working inputs: `working/loe_log.md`, `working/learnings.md`, the delivered finals
- Reference: `../LOE_BASELINES.md`, `../PRODUCTS.md`, `../NETSUITE_PLAYBOOK.md`, `../QA_CHECKLIST.md`, `../CAPABILITIES.md`, `../DATA_CONNECTORS.md` (teardown)
- Outputs: `working/retro.md`, user-approved updates to root files, optionally a keeper copy in `../templates/`
- Human check: the learnings triage is itself the human gate; every entry gets a user decision.

## Retro

Write `working/retro.md`: what the user corrected and why, what took more than one attempt, baseline proposals from `working/loe_log.md`, product fits for `PRODUCTS.md`, playbook patterns/misses for `NETSUITE_PLAYBOOK.md`, QA misses for `QA_CHECKLIST.md`, and any proposed CLAUDE.md / skill / standards change with its reason. Present the proposals; the user decides what gets committed to the root files. Harvest only from human-approved finals, never from Claude's own drafts. If a rendered deliverable is approved as a keeper, offer to save a copy to `templates/` as the gold-standard example for future engagements.

## Learnings triage (part of the retro, never skipped)

Walk `working/learnings.md` with the user; every entry gets a disposition the user decides (use AskUserQuestion for the promotions):

- **Capability entries:** confirm or correct the `[unreviewed]` entries appended to `CAPABILITIES.md` this engagement (drop the marker on confirmation).
- **Decision entries:** for each notable business/design decision, ask explicitly: promote to `NETSUITE_PLAYBOOK.md` as a Power Cloud best practice, keep as engagement-specific (record in CONTEXT.md, not doctrine), or discard. A decision never becomes a playbook pattern without the user saying so, and never silently disappears either.
