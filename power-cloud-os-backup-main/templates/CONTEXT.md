# templates/ — the stamps

Blank starters. Copy one, fill it in. Nothing here is ever edited during an engagement.

## client-record/ — the client folder stamp

A new client folder is a **copy of `client-record/`**, not a set of folders created by hand. That is
what keeps every engagement the same shape and is why `source/` and `Source/` both exist in the older
records.

```
client-record/
├─ CONTEXT.md              the living fact sheet, fill in at session start
├─ .claude/settings.json   installs the four gates (render, scope, escalation, write) plus the
│                          session-memory hooks (capture, brief, memory gate) for that folder
├─ source/                 client-provided material, read-only
├─ working/                scratch, drafts, and the state surface
├─ deliverables/           finals only
└─ execution/              build work, active from the execution phase onward
```

To stamp a new client, from the Power Cloud OS root:

```powershell
Copy-Item -Recurse "templates\client-record" "{Client}"
```

The `.gitkeep` files exist only so the empty folders survive a copy or a backup. Delete them or leave
them, they do nothing.

What belongs in each of the four folders is defined once in the root `CLAUDE.md`, not repeated here.

`.claude/settings.json` has to live inside each client folder because Claude Code reads settings from
the folder the session started in and, unlike CLAUDE.md, skills and agents, does not look in parent
folders. It takes effect from the next session in that folder. The canonical copy is
`.claude/hooks/client-settings-template.json`; the two are kept identical (a test in
`.claude/hooks/test_hooks.py` checks). Each hook entry runs a one-line launcher that walks up from the
session's start folder to the OS root, so the same file works at client depth and one level deeper for
a custom project, and a `cd` inside a session no longer breaks it. To re-stamp existing folders after a
template change, replace the whole `hooks` block (PreToolUse, SessionStart, Stop, PreCompact,
SessionEnd since 2026-09-24) and keep every other key (`permissions`). First check that each
folder's current `hooks` equals the previous template, so a per-client hook is never overwritten
unseen.

Session-memory files (`working/sessions/`, `working/sessions/raw/`) are created by the hooks on
first use, so the stamp carries no empty folders for them.

A **custom project** stamps the same `client-record/` shape, one level deeper, at
`{Client}/{ProjectName}/`, because a client can run several of them at once alongside an assessment:

```powershell
Copy-Item -Recurse "templates\client-record" "{Client}\{ProjectName}"
```

## custom-dev/ — the two custom development documents

Required for **any net-new custom development**, whatever the engagement type: inside a rapid
assessment, an implementation, or a standalone custom project. Not custom-project-only, which is why
the folder is named for the work rather than the engagement.

```
custom-dev/
├─ use_case.md            signed by the client before build starts; doubles as the SOW
└─ handover_fdd_tdd.md    one document, two halves: FDD (what it does, customer language)
                          and TDD (how it is built, for whoever maintains it next)
```

Structure only, with the placeholders and the internal notes to delete before rendering. The rules
for filling them in live in the execution skill under "Custom development documentation", because
that is where all three engagement types converge to build.

## engagement/ — access_and_consent_pack.md

The standard access and consent lines for a new engagement.

## data/ — mapping specs

Starting points for data mapping work: QBO to NetSuite, Shopify to NetSuite.

## Rendered keepers

When a rendered deliverable is approved as a keeper, a copy is saved here as the gold-standard
example for future engagements.
