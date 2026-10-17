---
name: custom-project
description: Run a Power Cloud custom project, the engagement type where we are hired for one specific thing (usually custom development) rather than a whole-account assessment or an implementation. Use when the user says "custom project", "new dev request", "we're building X for {client}", or is working inside a {Client}/{ProjectName}/ project folder. Covers the folder shape and the scoped discovery that replaces the six-stage assessment; the Use Case and handover come from the customization-docs skill, and the build from the execution skill.
---

# Custom Project

The engagement type where we are hired for one named function: a Suitelet, a Map/Reduce job, a workflow fix, a report, an integration piece. Scope is narrow and known at the start, so this skill does **not** run the six-stage assessment.

It is a thin skill on purpose. The two documents belong to **`customization-docs`** (they apply to any customization, in any engagement type) and the build belongs to **`execution`**. What is genuinely specific to this type is the folder shape and the scoped discovery below.

Root reference files sit two levels up (`../../WRITING_STANDARDS.md` and so on), because custom projects nest one level deeper than assessments.

## Folder shape

`{Client}/{ProjectName}/`, with the full client-record shape inside it, so one client can run several projects at once alongside an assessment:

```
{Client}/{ProjectName}/
├── CONTEXT.md       engagement type "custom project", plus the parent client
├── source/          the request, SOW, call transcripts, client-supplied specs
├── working/         scoped_discovery.md, drafts, testing plan
├── deliverables/    the Use Case, then the FDD & TDD handover
└── execution/       the SDF project and build log
```

If the folder is bare, stamp it from `../../templates/client-record/` as any client folder is stamped, then set `Engagement type: custom project` and `Parent client: {Client}` in CONTEXT.md.

## The sequence

1. **Scoped discovery** (below) -> `working/scoped_discovery.md`
2. **Use Case** -> the `customization-docs` skill. Client signs before build.
3. **Build** -> the `execution` skill, custom-project mode. Sandbox-first, both gates.
4. **Handover** -> the `customization-docs` skill, before the work closes.

## Scoped discovery

One job: understand the affected function well enough to commit to an approach and an hours number. Deliberately narrower than an assessment. Do not sweep the whole account, and do not build a candidate register; the scope is already named.

Verify read-only against the live account:

- **What exists today in the affected area**, and how it currently behaves. Read the body of any in-scope script with Script Reader (`readScriptSource`), not just its name.
- **What else touches the same records.** Competing workflows, other scripts, saved searches, and integrations firing on the same record type. This is the step that catches the surprise, for example a second approval workflow intercepting a record before the one being targeted.
- **The exact identifiers the build will depend on**: script, workflow and action IDs, saved search internal IDs, custom record and field IDs. The Use Case and the handover both need them.
- **Volumes and governance**, and whether a typical batch fits inside the limits.
- **Environment differences.** Where sandbox and production disagree on the objects in scope, say so now rather than discovering it mid-build.

Check Oracle's documentation for the API or feature the approach depends on, and `../../CAPABILITIES.md` before assuming what the tooling can do. Interview the consultant to close design gaps rather than guessing.

Log it with evidence tiers in `working/scoped_discovery.md`, so the Use Case's claims are traceable. **Where the approach depends on behavior nobody has confirmed in this account, prove it against a single test record before any hours are quoted.**

## Learning capture

As everywhere else, captured in the moment. Log capability findings to `../../CAPABILITIES.md` as dated `[unreviewed]` entries and note them in `working/learnings.md`, along with reusable patterns and the estimate-versus-actual delta once the work ships. Walk the file with the user afterwards; every entry gets a disposition, nothing promotes or vanishes on its own.
