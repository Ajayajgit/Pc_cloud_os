# Stage 01 — Pre-onsite prep

One job: walk in with a targeted, account-grounded question list and a time-boxed agenda, not a generic checklist.

- Working inputs: `CONTEXT.md`, any intro/discovery transcripts in `source/`
- Reference (read at the step that needs it): `../NETSUITE_PLAYBOOK.md`, `../QA_CHECKLIST.md` section 1, `../POWERCLOUD_BRAND_GUIDELINES.md`
- Outputs: `working/onsite_prep.md`, `working/verification.md`, `working/evidence.md` (if transcripts exist), `deliverables/{Client}_Onsite_Agenda_{YYYY-MM-DD}.docx`
- Human check: checkpoint 1 before the one-pager goes to the client.

## Procedure

1. Confirm the MCP connection is this client; record account ID, sandbox refresh estimate, NetSuite release in CONTEXT.md.
2. Full verification pass (see `03_verification.md`), not a light scan. Log every query in `working/verification.md` (carries forward to the assessment).
3. If any intro/discovery transcripts exist (a recording without one goes through the transcribe skill first), mine them into `working/evidence.md` (evidence tiers, quote/attribution rules per `02_evidence-mining.md`). Transcripts optional at this stage; work from verification alone if none.
4. Cross-reference transcript claims against verification; tag [Verified]/[Reported]/[Inferred]; flag disagreements (a mismatch is a strong onsite-agenda candidate, not something to resolve quietly).
5. Draft the discovery question list in `working/onsite_prep.md`, grouped by process area, prioritizing [Reported]-vs-[Verified] gaps, missing scale numbers, and things only a human can explain.
6. Draft a time-boxed agenda in the same file, leading with the areas of most disagreement/ambiguity.
7. Two outputs: `working/onsite_prep.md` (full list + rationale + agenda, internal only) and `deliverables/{Client}_Onsite_Agenda_{YYYY-MM-DD}.docx` (light one-pager, agenda skeleton only, no findings/tags/verification specifics; brand per guidelines).
8. **Checkpoint** (QA_CHECKLIST section 1) before sending the one-pager to the client.
9. Update CONTEXT.md: status, date, open questions the onsite must resolve.

`working/evidence.md` and `working/verification.md` carry forward as-is into assessment production.
