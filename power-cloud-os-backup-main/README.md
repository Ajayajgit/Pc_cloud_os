# Power Cloud OS - backup

The Power Cloud OS as source: the methodology, skills, scripts, reference files and the Paco
service, under version control so it can be branched, reviewed and evolved as a product.

The live copy runs from Google Drive at `G:\Shared drives\Power Cloud OS`. That is where
consultants work and where sessions read from, and today it is still the working copy: this repo
is populated one way, from the Drive, by `sync-backup.ps1`. Recoverability is a side benefit
rather than the point, since Drive keeps its own revisions.

**What branching is for** (Mike, 2026-09-14): the platform. When the portal replaces the folder
structure, this repo is what the methodology is carried across from. It is not for round-tripping
edits back into the Drive, so the one-way sync is the intended design rather than half of one.

## Client information

No client folders and no client material: not a transcript, deliverable, working file or client
`CONTEXT.md`. That is structural, from the allowlist in `sync-backup.ps1` plus belt-and-braces
rules in `.gitignore`, so a new client cannot arrive by accident.

Client **names** do appear throughout, because the methodology is taught through real examples:
the initialism that silently dropped a client's hours, the returns discrepancy found in an
account, the space that turned out to hold an outside consultancy. A handful of named individuals
appear alongside them. That is appropriate for a private repo and would need a scrub before this
was ever shared outside Power Cloud.

## Working in a branch

`sync-backup.ps1` only runs Drive to repo, and it refuses to run unless you are on `main` with a
clean tree, because `/MIR` would otherwise commit Drive state onto your branch or overwrite
uncommitted work.

Nothing carries a merged branch back to the Drive, and that is deliberate. While the OS runs from
folders, the Drive is the working copy and edits belong there. Branches here are for the platform
work, where the folder structure is being left behind rather than kept in step. **Do not build a
repo-to-Drive publish direction without checking that decision has changed**; it would mean two
writable copies of the same methodology and a merge problem nobody asked for.

The practical consequence: the repo is only as current as the last sync from `main`. Run it before
branching, so what you branch from is what the practice is actually running.

## What is backed up

Root reference files (`CLAUDE.md`, `NETSUITE_PLAYBOOK.md`, `WRITING_STANDARDS.md`, `PRODUCTS.md`,
`LOE_BASELINES.md`, `QA_CHECKLIST.md`, `CAPABILITIES.md`, and the rest), the how-to guide in .docx
and .pdf, plus:

| Folder      | What it holds                                    |
|-------------|--------------------------------------------------|
| `.claude/`  | Skills, hooks, settings, render scripts          |
| `fonts/`    | Montserrat and Barlow, both OFL                  |
| `logos/`    | Power Cloud, vendor, and platform marks          |
| `templates/`| Approved deliverable templates                   |
| `Internal/` | Roadmap, session norms, sales-to-delivery, roster|
| `tasks/`    | Plans and `lessons.md`, the correction log             |
| `feedback/` | The OS feedback inbox, one file per entry              |
| `paco/`     | Paco service source. **Canonical here, not a mirror**  |

## What is not

**Client folders.** No client's material is in this repo and none should ever be. `sync-backup.ps1`
copies a hardcoded allowlist rather than excluding a blocklist, so a new client folder on the Drive
is invisible to it. The script also aborts if an unexpected top-level folder shows up here.

**`Archive/`.** Superseded documents, about 8 MB, deliberately out of scope. They remain on the
Drive; they are just not versioned here.

## Taking a snapshot

From this folder:

```powershell
.\sync-backup.ps1
```

That mirrors the Drive into this repo, commits the changes as `Snapshot YYYY-MM-DD HH:mm`, and
pushes to GitHub. Run it after any meaningful change to the OS: a skill edit, a playbook update, new
LOE baselines. Nothing happens if nothing changed.

Two flags when you want a closer look:

```powershell
.\sync-backup.ps1 -NoCommit   # sync only, then review with git diff
.\sync-backup.ps1 -NoPush     # commit locally, push later
```

If the Drive is unmounted or Google Drive for Desktop is not running, the script stops with a clear
error rather than committing an empty snapshot.

## Restoring

**One file, previous version:**

```powershell
git log --oneline -- WRITING_STANDARDS.md     # find the snapshot you want
git show <commit>:WRITING_STANDARDS.md > restored.md
```

Read `restored.md`, then copy it over the Drive copy once you are satisfied.

**Everything, after a disaster:** clone this repo, delete `sync-backup.ps1`, `README.md`, and
`.gitignore` from the clone, and copy what is left back into the Power Cloud OS folder on Drive. The
repo layout mirrors the Drive layout exactly, so it drops straight in.

## Why not run git directly on the Drive folder

Google Drive for Desktop syncs the thousands of small files inside `.git`, can capture them
mid-write, and offers no locking between machines. Two computers with the Shared Drive mounted can
corrupt the object store. Keeping the repo on a local disk and copying into it sidesteps all of that.
