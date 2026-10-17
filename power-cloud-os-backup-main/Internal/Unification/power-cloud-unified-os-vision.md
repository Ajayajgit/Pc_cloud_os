# Power Cloud Unified OS: Architecture and Vision

**Shared north-star reference for Personal Knowledge Base (`meetings-kb`) and Power Cloud OS**  
**Version:** 1.0 · **Date:** September 17, 2026  
**Status:** Agreed strategic direction; architectural contracts below are proposed guidance for implementation.

## 1. The direction

Personal Knowledge Base and Power Cloud OS should eventually become **one knowledge-and-work platform with a unified object and workspace model**. Personal, project, client, and organization experiences are scoped lenses over that model. Each person also has a private layer that remains under explicit access controls.

The platform should answer two equally natural questions:

- **For a person:** Given everything I can access, what do I need to know, remember, decide, or do now?
- **For a team:** What have we learned, decided, promised, delivered, and approved in this project or relationship?

The personal experience preserves the strengths of meetings-kb: cross-project memory, meeting preparation, Briefs, commitments, waiting-on tracking, drafts, and proactive attention. The shared experience adds durable project history, collaboration, requirements, deliverables, approvals, and controlled client participation.

**Keep both products separate for now. Make architectural decisions in both convergence-compatible.** A common conceptual model is an immediate commitment; a combined application, repository, runtime, or database is a later decision.

## 2. Purpose and authority

This document guides feature design, data modeling, integration work, and architecture reviews in both codebases. It should be available to human contributors and coding agents as a shared reference.

It captures the direction discussed in [Review Second Brain Efficiency](chatgpt-conversation://6aabf1bd-8f2c-83ea-b375-ac570f22446c), including the accepted Markdown-evidence / SQLite-state direction for meetings-kb and the subsequent convergence discussion. The present request adds explicit requirements for a durable north star and future-viability checklist.

This is a synthesis of that conversation, not a fresh audit of either repository. Descriptions of current architecture reflect the discussion. Detailed contracts and safeguards below make the vision actionable; they are recommendations, not claims that either product already implements them. Illustrative examples are not live project records.

When a local implementation needs to diverge, record why, the migration impact, and the condition for revisiting it. Update this reference deliberately when the strategic direction changes.

## 3. One model, multiple lenses

```text
      Personal          Project          Client          Organization
      workspace         workspace        portfolio       workspace
          \                 |                |                /
           +-------- Permission-aware views and queries ------+
                                    |
                  Domain services and scoped agent tools
                                    |
                  Shared objects, relationships, policies
                                    |
                  Operational state + durable event history
                                    |
                      Markdown / files / source evidence
```

| Lens | Primary question | Typical experience |
| --- | --- | --- |
| Personal / Me | What needs my attention across my work? | Today, Brief, my tasks, commitments, waiting on, meeting prep, inbox, drafts, private knowledge |
| Project | What is happening and what must happen next? | Work, timeline, decisions, requirements, questions, risks, files, deliverables, approvals, people |
| Client | What is the state of this relationship across projects? | Projects, contacts, activity, commitments, deliverables, relationship history, permitted commercial context |
| Organization | How is work progressing across the business? | Portfolio, people, operations, sales, shared methodology, organizational knowledge |

A client lens used by an internal employee and a client-facing portal may show different subsets of the same relationship. “Client view” does not itself grant client access.

A workspace supplies navigation, membership, and policy context. It does not require duplicate copies of every object it displays. A project task assigned to Mike is the same task in Mike's personal dashboard and the project dashboard; completing it changes one authoritative record.

Objects may relate to multiple projects, people, or organizations. Relationships support discovery without automatically granting access. Cross-project and cross-organization queries must respect each underlying boundary.

## 4. Shared domain vocabulary

Align meanings before sharing implementations. Existing names can be mapped through adapters while each product evolves.

| Concept | Shared meaning |
| --- | --- |
| User | An authenticated platform identity; distinct from a person mentioned in evidence |
| Person | A real-world individual, whether or not they have a login |
| Organization | A company or group; distinguish its business identity from its platform tenancy and memberships |
| Client | An account relationship to a person or organization; avoid a duplicate company identity just to represent this role |
| Workspace | An operating context with membership and access policies, associated with a person, project, client, or organization |
| Project | A bounded body of work with participants, goals, and lifecycle |
| Source | A registered evidence item with origin, identity, version, and access policy |
| Meeting, Email, Message, File | Typed activities or content objects linked to their source evidence; one meeting can have several evidence items |
| Note / Observation | Authored interpretation or captured insight, potentially private |
| Task | Executable work with status, responsibility, and optional due date |
| Commitment | A promise by someone to someone; may be fulfilled through one or more tasks |
| Decision | An adopted conclusion with status, rationale, evidence, and possible supersession |
| Question | An unresolved issue with a lifecycle and eventual resolution |
| Requirement | A stated need or constraint with validation and approval context |
| Risk | A potential adverse outcome with ownership and treatment |
| Approval | An authorized judgment about a specific action or artifact version |
| Deliverable | An expected or produced outcome, linked to its artifact versions |
| Thread, Comment | Conversation and discussion associated with permitted objects |
| Agent, AgentRun | A configured capability and a traceable execution of that capability |
| Event | A durable record that a meaningful domain change occurred |
| Relationship | A typed connection between objects, with provenance and access considerations |

Keep entities, activities/evidence, and operational state distinct. A transcript records what was said; a commitment records what is currently owed. An AI-extracted suggestion is not automatically a confirmed decision. A task and the promise motivating it can be linked without collapsing their different meanings.

### Stable identity and relationships

- Assign immutable, globally unique IDs that survive export, import, renaming, moves, and database migration. Select a common UUID-compatible convention when formalizing the contract.
- Keep display names, slugs, paths, and provider IDs separate from canonical identity.
- Map external identities by provider, account/tenant, and external ID. Preserve legacy mappings during migration.
- Use typed relationships such as `assigned_to`, `relates_to`, `derived_from`, `fulfills`, `resolves`, and `supersedes`.
- Resolve duplicates explicitly; retain aliases or redirects so historical links continue to work. Do not merge people or organizations on a name match alone.
- Version schema and interchange contracts independently of user-facing labels.

“One object graph” means a coherent domain and relationship model. It does not prescribe a graph database, a single generic object table, or unrestricted identity matching across tenants.

## 5. Ownership, context, and visibility

Treat these as separate dimensions:

| Dimension | Question |
| --- | --- |
| Author / creator | Who authored or recorded this? |
| Responsible party | Who must act, fulfill, or maintain it? |
| Custody / tenancy | Which account or organization governs its storage and lifecycle? |
| Home scope | Where is it primarily managed? |
| Relationships | Which projects, people, clients, or organizations does it concern? |
| Access policy | Who can read, change, share, approve, or execute against it? |

For example, Mike can be responsible for a project-visible commitment. He can also author a private note related to the same project. Assignment to Mike does not make the commitment private, and linking his note to a project does not share the note.

Use a small vocabulary of visibility presets—`private`, `internal`, `project_team`, and `client_shared`—backed by explicit audience IDs and action permissions. “Internal” must identify which organization; “client_shared” must identify which client audience. A label alone is insufficient authorization.

Enforce policy in services and data access, including search, exports, notifications, event subscriptions, and agent retrieval. UI filtering is a presentation feature, not the security boundary. Membership changes must affect subsequent reads and actions, including cached and indexed results.

Organization membership must not implicitly expose private notes. Administrative access, offboarding, retention, and deletion rules need explicit product policy before multi-user rollout; resolve them without silently redefining “private.”

## 6. Private overlays

A private overlay is a separately permissioned object linked to shared context. It can contain personal annotations, preparation notes, reminders, or interpretations.

```text
Mike's project experience
  = project objects Mike may access
  + Mike's private objects related to that project
```

Another consultant sees the permitted shared record plus their own overlay. A client sees only the client's permitted record. Personal annotations do not overwrite shared facts.

Keep private content out of shared summaries, counts, search snippets, activity feeds, and exports. The existence or title of a restricted note may itself be sensitive. Public-facing projections should not reveal restricted relationships accidentally.

A personal reminder attached to a shared task can remain private while the task status remains shared. This preserves personal workflow without creating competing task records.

## 7. Promotion from insight to shared knowledge

Promotion is a deliberate publication of selected knowledge to a specified audience. It can create a new domain object derived from a private note while retaining the original note and its policy.

```text
Private observation
    -> proposed internal risk
    -> confirmed project decision
    -> assigned task
```

These are related objects with different meanings and lifecycles. Promotion should:

1. Identify the selected content, destination scope, audience, and intended object type.
2. Present the shareable wording, excluding unrelated private context.
3. Check the actor's authority and any applicable publication policy.
4. Create or update the shared object, preserving lineage and recording who promoted it.
5. Emit an event so authorized views and workflows can refresh.

Extraction and publication are distinct steps. AI may propose classifications and objects; confidence that something concerns a project is not permission to share it. Automatic publication requires an explicit, preauthorized rule for that source and audience. Sensitive or ambiguous cases stay private or enter review.

### Example: one meeting, several audiences

| Information | Intended audience |
| --- | --- |
| Mike's original recording and transcript | Mike private |
| Personal concern about margin | Mike private |
| Approved UAT scheduling decision | Project team |
| Task for Mike to confirm an integration timeline | Project team; also visible in Mike's task lens |
| Internal staffing risk | Specified internal organization/team |
| Approved client requirement | Explicit client audience and authorized internal participants |

The shared decision may cite restricted evidence internally without granting access to the transcript. Other readers receive only an authorized citation or approved supporting excerpt. Publication does not automatically expose the source, its title, or private annotations.

## 8. Provenance and evolving truth

Every derived object should be able to explain where it came from and how it became accepted state. Preserve:

- Source ID and version, with a precise locator where available: timestamp, message ID, page, or section.
- Derivation relationships, including multiple supporting or conflicting sources.
- Creating actor or agent run, extraction time, and relevant extraction/model configuration version.
- Confidence or uncertainty separately from human confirmation and formal approval.
- Promotion, confirmation, correction, and supersession history, including actors and timestamps.

A decision can supersede an earlier decision without rewriting the old meeting record. Resolving a question should point to its answer and supporting evidence. Re-extraction must reconcile existing objects rather than recreate confirmed work or erase human edits.

Preserve source versions as durable evidence, subject to explicit retention and deletion policy. Record corrections through versions or amendments. If evidence is removed, retain a permitted tombstone or explanation where appropriate; do not present a broken link as verifiable support.

Provenance links obey access control. Being allowed to read a conclusion does not imply permission to read all its supporting material.

## 9. Storage architecture

Maintain a clear separation of responsibilities:

| Layer | Authority and purpose |
| --- | --- |
| Markdown and files | Portable evidence, source content, methodology, and artifact versions |
| Operational database | Current task and object state, relationships, memberships, policies, approvals, agent jobs, and lifecycle history |
| Search indexes and projections | Rebuildable discovery and presentation derived from authorized content |

For meetings-kb, the accepted direction remains **Markdown evidence → SQLite object/state layer → dashboard and AI views**. Add stable source IDs and versioned YAML metadata to evidence files. File paths are locators, not identities. Obsidian compatibility can remain optional; the platform's domain model should stand independently.

As SQLite becomes authoritative for operational state, it is no longer entirely disposable. Rebuilding a search index from Markdown must not erase task completion, approvals, edits, or other state absent from source evidence. Back up and migrate operational state explicitly. Generated Markdown ledgers are exports unless a specific import/edit contract says otherwise.

For the eventual unified multi-user platform, **PostgreSQL is the intended operational database**. The motivation is concurrent work, membership and permission modeling, transactional state changes, jobs, events, audit history, and collaboration. Markdown and files remain first-class evidence and artifacts, stored behind equivalent access policies wherever hosted.

Use domain service boundaries and versioned migrations to make the transition practical. Preserve IDs and relationships. Evaluate database row-level controls as defense in depth alongside service authorization. Neither product needs an immediate database rewrite to honor this direction.

Do not assume one shared model requires one physical deployment or unrestricted pooling of personal and organizational data. Physical tenancy, regional hosting, and optional local storage remain implementation decisions.

## 10. Event-driven work

Meaningful domain changes should emit durable events with shared names and versioned payloads. Initial examples:

```text
meeting.ingested       decision.created       task.assigned
task.completed         question.opened        file.uploaded
approval.requested     approval.granted       email.received
commitment.overdue     project.status_changed knowledge.promoted
```

Each event should identify the event and schema version, affected object/version, actor, timestamp, tenant/scope, and correlation or causation chain. Include only the payload needed by permitted consumers; avoid broadcasting private source text.

```text
meeting.ingested
    -> extraction job
    -> private proposals or policy-authorized shared objects
    -> domain events
    -> permitted project timeline and personal Brief updates
```

A durable outbox or equivalent transactional mechanism should couple committed state changes to event delivery. Consumers must tolerate retries, deduplicate by identity, and handle stale or out-of-order updates. External actions need their own idempotency safeguards. Failed jobs should be observable and recoverable.

Start with local event records and background jobs where sufficient. A distributed broker and full event sourcing are not prerequisites. The operational database remains the authority for current state unless a later design explicitly changes that contract.

## 11. AI agents with scoped context and capabilities

Build toward one agent platform with different authorized operating contexts.

| Agent context | Permitted knowledge envelope | Typical work |
| --- | --- | --- |
| Personal | The user's private knowledge plus accessible shared objects, narrowed to the task | Prepare meetings, find forgotten commitments, draft a personal Brief |
| Project | Authorized project objects and explicitly approved organizational knowledge | Identify blockers, draft status updates, reconcile requirements |
| Client-facing | Objects explicitly shared with that client audience | Explain deliverables, approvals, and remaining activities |
| Organization | Authorized organization and portfolio information | Summarize work, identify operational follow-ups |

The service layer selects authorized context **before** it reaches the model and checks each tool call before execution. Effective capability is the intersection of the acting identity's permissions, the agent's configured permissions, the selected scope, and the current action policy. Access to a document does not grant authority to send it or modify related records.

Retrieved evidence is data, not authority to expand permissions. Agent memory, caches, conversations, and generated outputs also need scope and audience controls. A personal agent must not place private context in a shared project answer simply because it can read both.

Record agent runs with their initiating actor, authorized context references, tool actions, outcomes, and approvals. Prefer deterministic rules for clear lifecycle transitions, AI for interpretation, and human review for consequential ambiguity. Where an action requires approval, bind that approval to the concrete action, audience, and artifact version; recheck permissions at execution time.

## 12. Design principles

1. **One world model.** Reuse domain meanings and identities across views and products.
2. **People and projects are equal entry points.** Preserve cross-project personal work alongside project history.
3. **Context does not grant access.** Relationships, responsibility, and visibility remain separate.
4. **Private knowledge is first-class.** Preserve overlays through summaries, sharing, migration, and agent work.
5. **Promotion is explicit and traceable.** Share selected knowledge with a defined audience while preserving source boundaries.
6. **Evidence and live state have different jobs.** Keep portable history and authoritative operational state coherent.
7. **Derived claims have lineage.** Distinguish extraction, confirmation, approval, correction, and supersession.
8. **Services enforce authority.** Apply the same boundaries to people, agents, tools, indexes, and exports.
9. **Events enable proactivity.** Use observable, retryable workflows for meaningful changes.
10. **Convergence begins with contracts.** Align vocabulary, identity, provenance, policy concepts, and events before merging implementations.
11. **Portability includes meaning.** Preserve relationships, state, versions, and permissions alongside file content.
12. **Build what current workflows justify.** Choose reversible steps and document decisions that increase future migration cost.

## 13. Staged convergence

| Stage | Work | Evidence needed to advance |
| --- | --- | --- |
| Now: independent products, aligned concepts | Adopt this reference; map vocabulary and IDs; separate evidence from state; introduce scope and provenance fields as features touch them | Both teams can describe equivalent objects and identify known mismatches |
| Next: compatible contracts | Version interchange formats and events; test identity preservation, policy mapping, promotion, and duplicate handling | A bounded exchange preserves state, lineage, and privacy |
| Later: shared platform capabilities | Pilot common identity/membership, domain services, event processing, or agent capabilities where useful | A real workflow works across the products with explicit authority and reliable recovery |
| Eventually: unified experience | Move suitable operational state to PostgreSQL; expose personal, project, client, and organization lenses over shared services | Multi-user permissions, private overlays, migrations, and end-to-end workflows are validated |

meetings-kb should continue learning what one person needs to remember and act on. Power Cloud OS should continue learning how teams and clients collaborate with AI. Neither product must wait for the other's roadmap.

Avoid bidirectional synchronization without a stated authority model. During an integration pilot, designate the authoritative system for each exchanged object or field, define conflict handling, and retain migration mappings. Read-only projections can provide value before shared writes.

Before consolidating, validate a representative path: private meeting capture → extraction → reviewed promotion → shared decision/task → personal and project views → scoped agent action. Verify that retries do not duplicate work and that clients never receive private overlays or restricted evidence.

## 14. Future-viability decision checklist

Use this checklist for material features, schema changes, integrations, and architecture decisions in either codebase. Mark items **yes**, **no with rationale**, or **not applicable**. A documented temporary compromise is acceptable; an invisible incompatibility is not.

- [ ] **Vocabulary:** Does this use an existing domain concept correctly, or define and map a genuinely new one?
- [ ] **Identity:** Will IDs survive rename, export, re-ingestion, deduplication, and migration?
- [ ] **Shared objects:** Could personal and project views display this record without independent competing copies?
- [ ] **Cross-context work:** Can it relate to multiple people or projects without being trapped in a folder or single-user assumption?
- [ ] **Ownership and access:** Are creator, responsibility, tenancy, relationships, and visibility distinguished?
- [ ] **Privacy:** Can a private overlay remain private in retrieval, summaries, counts, notifications, exports, and agent memory?
- [ ] **Promotion:** Can selected knowledge be shared to a defined audience without exposing its entire source?
- [ ] **Provenance:** Can a person trace the claim to evidence, derivation, confirmation, and later correction?
- [ ] **Authority:** Is it clear which store or service owns live state and how edits or synchronization conflicts are resolved?
- [ ] **Portability:** Can evidence, state, relationships, and policy semantics move toward PostgreSQL without identity loss?
- [ ] **Events:** Does the relevant change produce a useful event, and are retries or duplicate actions handled?
- [ ] **Agent boundaries:** Are context access and tool permissions enforced outside the model and checked for the output audience?
- [ ] **Migration:** Are schema versions, legacy mappings, backfill, and recovery needs understood?
- [ ] **Proportion:** Does this solve a present need while keeping the future path reasonably open?

For significant decisions, retain a short record:

```text
Decision and present problem:
Chosen approach:
Affected shared concepts/contracts:
Future-viability exceptions and rationale:
Migration or recovery path:
Validation performed:
Owner and revisit trigger:
```

## 15. Open decisions and use in both codebases

The strategic direction is settled; these implementation choices remain open: exact workspace/tenancy schema, ID convention, client-role representation, permission inheritance, cross-organization sharing, personal-data offboarding policy, event transport, physical deployment, and timing of PostgreSQL adoption. Resolve each through a focused architecture decision when needed.

Place this document in each repository's architecture references, or link both repositories to one maintained canonical copy. Repository-level contributor and coding-agent instructions should point to it and require a future-viability assessment for material changes. If copies are used, retain the version and source so they can be kept aligned.

The enduring commitment is **one shared knowledge-and-work platform that supports both institutional memory and a private, personal understanding of work**. Every near-term architecture decision should preserve a credible path to that outcome.
