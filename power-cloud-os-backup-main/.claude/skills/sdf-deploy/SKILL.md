---
name: sdf-deploy
description: Validate and deploy a SuiteCloud SDF project to a NetSuite account, sandbox-first with a human-gated production step. Use when execution has authored or updated SDF objects/scripts and needs to deploy them, when a task's build phase is ready for sandbox testing, or when a sandbox-tested task is signed off and ready to promote to production. Wraps suitecloud project:validate and project:deploy with the account-identity check, the desktop.ini sweep, and the two-gate approval discipline from the execution skill's guardrails.
---

# SDF deploy

Takes an authored SDF project (scaffolded by `sdf-scaffold`, objects written per `netsuite-sdf` standards) and gets it into an account safely. Never authors objects itself.

## The non-negotiable rule

**Sandbox first, always. Production is a separate, explicitly human-approved step, every single time** — not just the first time a task deploys. Never chain a sandbox deploy straight into a production deploy without a human saying so for that specific deploy.

## Before any deploy

1. **Confirm which auth ID targets which account.** Run `suitecloud account:manageauth --list` and read the account name/type next to the auth ID you're about to use (`--authid` flag, or whatever's set as `defaultAuthId` in `project.json`). If the name is ambiguous or you haven't seen this account confirmed earlier in the session, stop and ask rather than assume sandbox vs production from the ID string alone (`-sb1` suffixes are a strong hint but not a guarantee someone didn't rename or mislabel an auth ID).
2. **Sweep `desktop.ini`.** Windows Explorer seeds these into `src/FileCabinet/` and SDF will happily upload them to the File Cabinet. Run `find src -name "desktop.ini" -delete` (or the PowerShell equivalent) before every deploy, not just the first.
3. **Validate before deploying.** Run `suitecloud project:validate` (check `--help` for the current flags — server-side vs local validation options vary by CLI version) against the target account and fix everything it flags. A clean validate doesn't guarantee a clean deploy, but a dirty one guarantees problems. **Delegate:** when validate returns more than a handful of items, run `python "../.claude/scripts/parse_validate_log.py"` over the saved output for the table, hand the mechanical items (missing dependency entry, malformed element, bad scriptid format) back to `pc-sdf-author` for a fix pass, and keep every item that needs a decision here. After the sandbox test pass, the `build_log.md` entry from the captured output is `pc-code-chores` work; the pass or fail call is yours.

## Sandbox deploy and test

1. Deploy: `suitecloud project:deploy --authid {sandbox-authid}` (confirm exact current flags via `--help`; older/newer CLI versions vary on `--accountspecificvalues`, `--applyinstallprefs`, and dry-run options).
2. Run the task's acceptance criteria and test plan — both should already be written in the execution-plan block for this task. Don't invent new acceptance criteria at deploy time; if the written ones don't actually cover what changed, that's a planning gap to flag, not something to paper over.
3. Record the result in `execution/build_log.md`: what was deployed, when, against which account, pass/fail against each acceptance criterion, anything that needed a fix-and-redeploy loop.
4. Iterate (author → validate → sandbox deploy → test) until acceptance criteria pass clean.

## Review / UAT

Consultant (and client, where the task calls for it) reviews the sandbox result before production is even discussed. This is a distinct step from the sandbox test pass above — a green test run is not the same as sign-off.

## Production deploy (gate 2 — always ask)

Never deploy to production as a natural next step after a sandbox pass. Stop and ask explicitly, stating:
- which task/objects are about to deploy,
- which production account (name, not just ID),
- that sandbox testing passed and who reviewed it,
- the rollback note for this task (should already exist per the execution-plan block; if it doesn't, that's a blocker, not a detail to skip).

Only on an explicit yes: `suitecloud project:deploy --authid {production-authid}`.

## After production deploy

1. Verify against the acceptance criteria in production itself, not just trust the sandbox result — configuration can drift between accounts (different feature states, different existing data).
2. If an MCP connection with read access exists for this account, use it to confirm the deployed state matches spec (e.g., a feature is actually enabled, a role's permissions actually landed) rather than assuming the deploy succeeded because the CLI exited 0.
3. Update the execution plan's task status and the Asana ticket (if standing).
4. Record actual hours against the task and log the estimate-vs-actual delta for `../../LOE_BASELINES.md` — propose, don't auto-commit; the user owns that file.
5. Confirm the rollback path is still accurate (sometimes what you'd roll back to has itself changed by the time you'd need it).

## If something goes wrong mid-deploy

Don't reach for `--force` flags or skip validation errors to push through. If a deploy partially applies and fails partway, treat the account as needing inspection before any retry — check what actually landed (via MCP read or the UI) before assuming the retry starts from a clean slate.
