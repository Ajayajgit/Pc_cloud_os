# Provisioning Roster & Gate Checklist

> DRAFT 2026-08-12, pending Mike's review. Audience: whoever runs the rollout (Mike, Taha, or any checked-off consultant), not the new consultant; their guide is ONBOARDING.md.

Why this exists: documentation-only rollout fails. A colleague lost a week to a missing license nobody noticed. So onboarding is run live, with a buddy: a provisioned person walks the new person through the checklist in one sitting, and nobody counts as rolled out until their row below is complete.

## The gate checklist (per consultant, once)

- [ ] Claude **seat granted** in the Power Cloud org, and any personal account merged or kept cleanly separate (they know which account they are in)
- [ ] **$25/month usage-credit limit set** by the org admin (no bulk default exists; set per member in Organization Settings > Usage)
- [ ] **Google Drive access**: they can open `G:\Shared drives\Power Cloud OS` in File Explorer
- [ ] **Machine setup** from ONBOARDING.md Part 1 complete: Drive for desktop, Git, Python + rendering libraries, brand fonts installed for all users
- [ ] **Claude Code opens** and can browse to a client folder
- [ ] **Project plugins accepted** (the trust prompt on first workspace open)
- [ ] **MCP visibility**: the team's NetSuite connectors appear in their session's server list
- [ ] **Smoke test**: in a client folder, they run "Run session start" and watch it read CONTEXT.md and inventory the folder
- [ ] **Session basics walked through with the buddy**: one task per session, review-before-send, what a guardrail prompt means (the reference material lives in SESSION_NORMS.md and PROMPT_PATTERNS.md for whoever runs the walkthrough; end users don't study MD files)
- [ ] Roster row below updated with date and buddy

## Roster

| Person | Seat | $25 limit set | Drive access | Machine setup | Plugins accepted | MCP visible | Smoke test | Buddy | Date | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Mike Flynn | Premium (proposed) | n/a (owner) | yes | yes | yes | yes | yes | n/a | 2026-08-11 | Baseline machine; QBO/Shopify connectors held here |
| Taha Raja | Premium (proposed) | [ ] | yes | yes | [ ] | yes | yes | n/a | | Confirm plugin prompt on his machine |
| Justin Lombardi | Premium (proposed) | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | | | Capped mid-exercise at summit; premium candidate |
| Imran Shabbir | Premium (proposed) | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | | | |
| Ron Shaw | Standard | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | | | |
| {name} | Standard | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | | | Blocked all summit week: verify seat + Drive first |
| {add rows per team member} | | | | | | | | | | |
