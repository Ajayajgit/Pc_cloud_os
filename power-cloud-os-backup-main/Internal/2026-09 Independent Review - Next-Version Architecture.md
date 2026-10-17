# Power Cloud OS: Next-Version Architecture & Technology Stack

A proposed path from the current filesystem-based operating system to a
collaborative, AI-native project platform while preserving the existing
methodology and Google Drive knowledge base.

Power Cloud Consulting \| Independent review \| September 2026

## Design objective

Build a thin internal Power Cloud product around the existing OS rather
than replacing it. The next version should introduce a real application
layer for identity, project state, collaboration, permissions,
auditability, and agents while leaving the proven methodology and
existing client files usable from day one.

## Recommended stack

| Layer \| Recommended technology \| Role \|

| --- \| --- \| --- \|

| Web application \| Next.js + React + TypeScript \| Internal and future
  client UI \|

| Operational database \| PostgreSQL via Supabase \| Projects, tasks,
  approvals, decisions, messages, events, permissions \|

| Authentication & realtime \| Supabase Auth + Realtime + Row Level
  Security \| Identity, tenant/project isolation, live collaboration \|

| Agent runtime \| Separate Python service \| Context assembly, model
  calls, tools, approvals, background agents \|

| Primary AI orchestration \| OpenAI Agents SDK / Responses API \| Tool
  use, agent loops, handoffs, tracing, MCP \|

| Secondary AI provider \| Anthropic API \| Provider portability and
  model choice \|

| Files \| Google Drive initially \| Existing Power Cloud OS, source
  documents, working artifacts, deliverables \|

| Integration boundary \| MCP where appropriate + direct APIs/functions
  \| NetSuite and external enterprise systems \|

| Background work \| Postgres-backed queue initially \| Async agent jobs
  and event handling \|

| Advanced workflow engine \| Temporal later, only if needed \|
  Long-running durable workflows with waits/resumes \|

| Hosting \| Vercel + Supabase + Railway/Fly.io/AWS for Python \| Simple
  managed deployment without premature infrastructure complexity \|

## Target architecture

The key architectural boundary is a Power Cloud application/API layer
between users and external systems. The frontend should not directly own
model calls, Drive operations, or NetSuite mutations. The service layer
becomes the place where permissions, approval gates, audit logging,
model selection, client visibility, and tool authorization are enforced.

> Users / Web UI / Codex / Claude → Power Cloud API → Operational DB +
> Agent Runtime + File Gateway → Drive / NetSuite / external tools

## Core data model

Start small but establish the right boundaries immediately:

-   organizations, users, organization_memberships

-   customers, customer_contacts

-   projects, project_memberships

-   tasks, task_dependencies, milestones

-   threads, messages, comments

-   files, file_links

-   requirements, decisions, approvals

-   events

-   agent_runs, agent_steps, agent_artifacts

-   audit_events

Important records should carry organization/project ownership, creator,
timestamps, and a visibility classification such as internal, client, or
restricted. Tenant and project isolation should exist in the database
from the beginning even if Power Cloud is the only tenant for a long
time.

## Files versus structured state

| Keep file-native \| Make database-native \|

| --- \| --- \|

| Skills and methodology \| Project/task status \|

| NetSuite playbooks and reusable knowledge \| Owners and due dates \|

| SOWs, transcripts and source evidence \| Dependencies and milestones
  \|

| Research and working artifacts \| Requirements and decisions \|

| Templates and examples \| Approval state \|

| Generated deliverables \| Membership and permissions \|

| Human-readable project context/snapshots \| Messages, events, agent
  state and notifications \|

Google Drive should remain the canonical file store initially. The
database should store provider file IDs, metadata, project linkage,
visibility, and semantic type rather than duplicating all files. A file
gateway can later hide whether the underlying storage remains Drive or
moves elsewhere.

## Context service

Do not make each agent recursively browse the entire Drive. Build a
context service that assembles the minimum appropriate context for a
workflow.

1.  Load Power Cloud core rules and the relevant skill/stage contract.

2.  Load the current customer/project state from Postgres.

3.  Load durable client context and selected project files from Drive.

4.  Retrieve only the institutional knowledge relevant to the task.

5.  Apply user/agent permissions before anything enters model context.

6.  Send the assembled context package to the selected model.

This preserves the hierarchical-context strengths of the current OS
while reducing context waste and preventing unauthorized information
from being exposed to customer-facing agents.

## Shared AI conversation

Conversation should belong to the project, not to a model provider's
private thread. Store threads and messages in the Power Cloud database.
Users and agents are simply authors. Realtime delivery lets several
employees - and eventually clients - participate in the same working
discussion.

Provider conversation/session IDs may still be stored for optimization,
but they should be implementation details rather than the authoritative
record.

## Event-driven agents

Make meaningful state changes produce events from the beginning:

-   project.created

-   task.created / task.updated / task.completed / task.overdue

-   file.added

-   message.created

-   decision.created

-   approval.requested / approval.granted

-   milestone.changed

-   agent.completed

Initially, events can enqueue simple background jobs. Later, agents can
subscribe to events to perform validations, identify risks, draft
reminders, update project summaries, or propose follow-on work. This
avoids building 'proactive AI' as a periodic crawl of unstructured
folders.

## Agent runtime

Keep agent execution in a separate Python service rather than embedding
it deeply in Next.js route handlers. The Python service should build
context, select a provider/model, invoke approved tools, persist run
state, pause for human approval when required, and write outputs back to
the project.

Use OpenAI as an orchestration backbone if it is the best fit, but
define a provider abstraction so Anthropic and future providers can be
used without changing the project model. The application owns state; the
model provider supplies reasoning and tool-use capability.

## Integration strategy

Use MCP as an integration boundary where it provides leverage -
particularly for external enterprise systems and reusable tool servers -
but do not force every internal operation through MCP. Native Power
Cloud state is simpler and safer to expose through direct service
functions with explicit authorization.

NetSuite mutations should always pass through Power Cloud authorization
and audit logic. An agent's ability to call a NetSuite tool should be
determined by project state, environment, user permissions, and approval
gates, not only by prompt instructions.

## Audit and observability

Every consequential state-changing action should produce an
application-owned audit event containing actor, project, action,
affected object, before/after state where appropriate, timestamp, and
agent-run linkage. Vendor tracing is useful for debugging model
behavior, but it should not be the system of record for Power Cloud's
audit history.

## Suggested build sequence

### Sprint 1 - Project shell

-   Google/Workspace login

-   Customers and projects

-   Project memberships and basic visibility

-   Project homepage

-   Read-only Drive file listing

### Sprint 2 - Shared conversation

-   Project threads and messages

-   Realtime updates and mentions

-   AI participant

-   First version of the context builder

### Sprint 3 - Work model

-   Tasks, owners, status, due dates and dependencies

-   Comments

-   Decisions and approvals

-   Activity timeline and audit events

### Sprint 4 - One useful agent

Build a Project Review Agent rather than a generic chatbot. It should
inspect current project state, recent discussion, decisions, selected
files, and the applicable Power Cloud methodology, then report what is
happening, what changed, what is blocked, what is at risk, and what
should happen next.

Run a small number of real Power Cloud projects through this version
before attempting to replace Asana wholesale or expose the system
broadly to customers.

## New Project as the first end-to-end workflow

The strongest vertical slice is likely New Project because it exercises
identity, project creation, file intake, methodology selection, AI
analysis, task generation, approvals, and collaboration.

1.  Select or create the customer.

2.  Choose engagement/project type.

3.  Drop the SOW and discovery/source files.

4.  Assign the internal team.

5.  Create the project and Drive linkage.

6.  Run intake analysis using the relevant Power Cloud methodology.

7.  Propose milestones, tasks, customer dependencies, approvals, and
    unresolved scope questions.

8.  Require a human to review and approve the proposed plan before it
    becomes live project state.

## What not to build yet

-   A complete Asana clone.

-   A generic vector-database chat application presented as the OS.

-   Kubernetes or a large microservice estate.

-   A complex workflow engine before long-running workflows actually
    require it.

-   A wholesale migration of Drive files into a new storage system.

-   A provider-specific data model tied to one AI vendor.

-   Autonomous consequential actions without explicit state-based
    authorization and auditability.

## Recommended technical principle

> The backbone should be DATA MODEL + EVENTS + PERMISSIONS + WORKFLOWS +
> AI - not CHAT + RAG.

That distinction is what gives Power Cloud a path from today's effective
filesystem-based methodology to a true delivery operating platform. The
existing OS remains valuable and usable throughout the transition; the
new software progressively takes ownership of the parts that require
concurrency, structured state, security, collaboration, and proactive
automation.
