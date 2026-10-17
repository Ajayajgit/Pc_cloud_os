# A13 Migration Plan: Move to the Power Cloud OS Shared Drive

Written 2026-08-22. The new drive `G:\Shared drives\Power Cloud OS` exists and is empty. This is the execution plan for roadmap item A13 (decision 14, shape decided 2026-08-22: OS at the drive root, old drive legacied with a shortcut). Target: complete before the Sept 3 all-hands.

## Status (2026-08-22, post-move)

**Done:** contents moved; count verification passed exactly against the manifest (zero stragglers, old OS folder fully gone); path sweep applied (28 replacements across 19 files; only the `Power Cloud Project Folders\Power Cloud OS` segment rewritten, bare legacy-annex references deliberately kept; remaining hits are historical narrative only); root write-guardrail hook re-pointed; Teppermans RA render-gate hook converted to the template's relative form; Monday-job docs updated with the re-pointing requirement; `sync-backup.ps1` re-pointed, run, and pushed; Mike's auto-memory copied to the new project key; `build_engagement_log.py` runs clean from the new root; both guides re-rendered from the updated ONBOARDING.

**Still owed (Mike):** DLP incident review (see section below); per-consultant re-verification before Sept 3 (drive membership itself done 2026-08-22); `Internal/` restricted-access re-check with a non-admin account; the two cross-drive shortcuts (`MOVED` in the old drive, `Legacy - Power Cloud Project Folders` at the new root); distribute the re-rendered guide PDF. ~~Apps Script re-point~~ **done 2026-08-22, VERIFIED 2026-08-24** (property set to the new drive root, extracts live as web-app Version 4, `deliver_extracts` on; the Monday 08-24 run wrote 7 correct per-client files into the new drive with no duplicate run and no 429 storm).

**Still owed (fresh Claude Code session):** the write-guardrail live test (hooks load at session start, so this session cannot test its own re-pointed hook) and a normal session-start smoke test from a client folder.

## The call: MOVE, do not copy

1. **Move preserves Drive file IDs.** Every existing shared link, link pasted into an Asana task, and cross-doc reference keeps working. Copy mints new IDs and breaks all of them silently.
2. **Copy creates two live trees.** Someone edits the old one, the trees diverge, and there are two sources of truth: the exact failure class this workspace is built against.
3. **Move is a re-parent, not a data transfer.** Fast, nothing is deleted, no storage duplication, and rollback is "move it back."
4. **The safety net is not a duplicate tree.** It is the git backup (doctrine and root files), Drive's own revision history and trash (everything, client folders included), and the count verification below. A live copy is a liability dressed up as a backup.

**Mechanics caveat:** moving folders between shared drives requires Manager on both drives, and the Workspace admin setting that allows cross-shared-drive moves. Mike is the admin, so both are settable. If the web UI still refuses a folder move, the fallback is a Drive API re-parent script (still a move, still preserves IDs); ask Claude Code to write it rather than falling back to copy.

## Pre-move (Mike, ~30 min)

- [ ] **Membership:** add the team to the new drive with the same roles as the old one. Membership does NOT carry over from the old drive.
- [ ] **Internal/ restriction:** recreate the restricted access on `Internal/` in the new drive after it moves, and verify with a non-admin account that it is actually restricted.
- [ ] **Backup snapshot:** run `sync-backup.ps1` from `C:\Users\mpfly\source\repos\power-cloud-os-backup` for a fresh commit and push. (It covers root files, `.claude/`, `fonts/`, `logos/`, `templates/`, `Internal/`. Client folders are excluded by design; their protection is the non-destructive move plus Drive revisions.)
- [ ] **Freeze window:** pick an evening; announce no OS sessions and no edits during the move, Claude Code sessions included.

## The move (Mike, in the Drive web UI, during the freeze)

- [ ] Move the **contents** of `Power Cloud Project Folders/Power Cloud OS/` to the **root** of the new `Power Cloud OS` drive, top-level item by top-level item (17 folders + 17 root files, manifest below). The OS root becomes the drive root; that is the point of the migration.
- [ ] Leave the now-empty `Power Cloud OS` folder in the old drive containing only a shortcut named `MOVED - see Power Cloud OS shared drive`.
- [ ] Add a shortcut at the new drive root pointing back to the old drive, named `Legacy - Power Cloud Project Folders` (decision 14's "shortcut back"). Legacy client material outside the OS folder stays where it is.

## Verification manifest (counts taken 2026-08-22, pre-move)

| Folder | Files | | Folder | Files |
|---|---|---|---|---|
| Teppermans | 2065 | | Shinesty Redo | 28 |
| Teppermans Rapid Assessment | 125 | | ACFB | 23 |
| Upward Projects | 103 | | Internal | 23 |
| .claude | 49 | | American Barbell | 18 |
| 44 Pro | 46 | | Brixton | 14 |
| MH Crane | 37 | | templates | 12 |
| Shinesty RA | 33 | | Archive | 11 |
| fonts | 10 | | ABSCI | 4 |
| logos | 3 | | feedback | 1 |

Plus 17 root files: CLAUDE.md, ONBOARDING.md, the 10 reference files (LOE_BASELINES, POWERCLOUD_BRAND_GUIDELINES, PRODUCTS, QA_CHECKLIST, NETSUITE_PLAYBOOK, WRITING_STANDARDS, CAPABILITIES, DATA_CONNECTORS, PROMPT_PATTERNS, ASANA_CONVENTIONS), the 2 generated indexes (ENGAGEMENT_LOG.md, FEEDBACK.md), the 2 rendered guides (How to Work in the Power Cloud OS .docx/.pdf), and The Power Cloud OS.html.

- [ ] After the move: re-run the count in the new drive and compare per folder. Counts within a file or two of the manifest (desktop.ini noise) pass; a short folder means stragglers left behind in the old drive, so check there before anything else.

## DLP detections (observed during the move, 2026-08-22)

The bulk move triggered Google Workspace DLP re-scans; some files matched sensitive-data detectors. Expected given the content (client NetSuite/QBO exports, financial documents in `source/`). Not a leak; an internal policy re-evaluation.

- [ ] Admin console → Security → Data protection: review the incidents. Record which rule, which detectors, which files, and the rule's action (audit / warn / block).
- [ ] If the action was **block**, the flagged files are stragglers: resolve per file (exception for legitimate client data, then re-move), and re-run the count verification.
- [ ] Confirm the new `Power Cloud OS` drive is inside the DLP rule scope at least as strictly as the old drive; adjust scoping if the rule was drive- or OU-specific.
- [ ] Export or screenshot the incident list: it is a map of where regulated data lives in the client folders, useful for the portal service-account scoping and the MSA data-handling language.
- [ ] **Credential-type detections are a house-rule violation** (credentials never touch the shared Drive) independent of the move: pull the file, rotate the credential, note the source.

## Post-move path sweep (Claude Code, from a NEW session started in the new drive)

This session anchoring matters: sessions are keyed to the folder they start in, so the sweep runs from `G:\Shared drives\Power Cloud OS`, not from the old path.

Known references to the old root: **44 occurrences across 26 files** (grep taken 2026-08-22). The sweep:

- [ ] Root `.claude\settings.json` (1 ref, includes the write-guardrail hook wiring) and `.claude\scripts\render_os_guide.py`.
- [ ] `ONBOARDING.md` (6 refs), then re-render both guides (`How to Work in the Power Cloud OS.docx`/`.pdf`).
- [ ] `The Power Cloud OS.html` carries no path refs (verified 2026-08-22) but gets a content review and republish to the same artifact URL if anything changed.
- [ ] Skills: `.claude\skills\new-engagement\SKILL.md` (1 ref).
- [ ] Internal: `POWERCLOUD_OS_ROADMAP.md`, `PORTAL_BETA_PLAN.md`, `provisioning\roster.md`, `provisioning\netsuite_time_integration.md`, `provisioning\apps_script_client_extracts.gs` (the Monday job and ingest scripts point at client folders; re-point and re-test the next Monday run), `SUPERSEDED 2026-08-12 - PROPOSed_CHANGES.md` (skip: superseded files are history, do not edit).
- [ ] Client-folder stragglers: per-client `.claude\settings.json` / `settings.local.json` (Teppermans RA, Shinesty RA/Redo, Brixton, Upward Projects, American Barbell, Teppermans LCT), working files with absolute paths (44 Pro config_backlog, ACFB render/export scripts, American Barbell notes, Teppermans DEPLOY_SETUP, Promotions evidence), `fonts\README.md`.
- [ ] `sync-backup.ps1` at `C:\Users\mpfly\source\repos\power-cloud-os-backup`: update its source path to the new drive, run it, and confirm the diff shows only the sweep edits.
- [ ] **Claude Code project state:** copy `C:\Users\mpfly\.claude\projects\G--Shared-drives-Power-Cloud-Project-Folders-Power-Cloud-OS\memory\` into the new project key folder (created on first session from the new path, `G--Shared-drives-Power-Cloud-OS`), then update path references inside the memory files. Without this, auto-memory starts blank. Same applies per consultant machine; most have little memory, so it is a note in the re-verification, not a task.

## Verification session (Claude Code, same new session)

- [ ] Session start from a client folder on the new drive: CLAUDE.md loads via parent traversal, skills list, render gate present.
- [ ] The write-guardrail hook fires in a fresh session (this doubles as the live test the rollout punchlist still owes).
- [ ] `python .claude/scripts/build_engagement_log.py` runs clean from the new root.
- [ ] Team re-verification before Sept 3, per the provisioning roster: each consultant can open both drives and start a session in the new path.

## Aftercare

- [ ] Old drive is legacy: nothing OS-related is ever created there again; the OS folder there holds only the MOVED shortcut.
- [ ] Check off A13 in `ROLLOUT_PUNCHLIST.md` with a dated line in `.claude\skills\CHANGELOG.md`; mark A13 executed in `PORTAL_BETA_PLAN.md` section 8.
- [ ] The portal's Drive service account, when created in phase 0, gets membership on the new drive scoped to client folders and is never added to `Internal/`.
