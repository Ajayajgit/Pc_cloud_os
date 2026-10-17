# Convergence Notes from meetings-kb v1.5 Planning

**Companion to:** `power-cloud-unified-os-vision.md` v1.0
**Source:** first application of the vision document to a real roadmap (`meetings-kb` v1.5, finalized 2026-09-17)
**Date:** September 17, 2026
**Status:** Observations and recommendations for the unification effort. Not a decision record.

---

## Purpose

The vision document was applied end-to-end while writing the meetings-kb v1.5 roadmap. It answered
every open question that roadmap had. These are the observations that belong to the **platform**
rather than to the KB — places where applying the vision surfaced a gap, a timing problem, or evidence
worth feeding back.

Nothing here contradicts the vision. Most of it is about making it hold up under use.

---

## 1. The ID convention is the open decision with the nearest deadline

§4 requires IDs that "survive export, import, renaming, moves, and database migration" and says to
"select a common UUID-compatible convention when formalizing the contract." §15 lists the ID convention
as still open.

**meetings-kb v1.5 starts writing IDs onto every new durable object.** So of the nine open decisions in
§15, this is the only one with a live consequence in the next work cycle. The others (workspace schema,
client-role representation, permission inheritance, cross-org sharing, offboarding policy, event
transport, deployment, PostgreSQL timing) can wait without accruing cost. This one accrues cost per
object written.

The v1.5 roadmap handles it defensively — UUID-compatible, no prefixed non-UUID scheme, external
identity kept in separate `provider` / `provider_object_id` fields — but that is a hedge, not a
decision.

**Recommendation:** promote the ID convention out of the §15 list and settle it as a standalone
architecture decision before either product writes IDs at volume. It is cheap to decide and expensive
to retrofit, which is the worst combination to leave open.

---

## 2. Vocabulary drift is real, fast, and currently unguarded

Within a few days of the vision document being written, a review memo working from both codebases used
`visibility = project_internal`.

§5 defines a fixed four-value vocabulary: `private`, `internal`, `project_team`, `client_shared`.
`project_internal` is not one of them — it reads as a conflation of `internal` and `project_team`,
which are deliberately distinct because "internal" must identify *which organization* and
`project_team` identifies a project audience.

This is exactly the failure mode §12.1 ("one world model") exists to prevent, and it happened
immediately, in a document written by someone who had read the model.

The drift was caught by chance, during a line-by-line comparison. Prose in a shared reference cannot be
diffed, so nothing would have caught it systematically.

**Recommendation:** publish the controlled vocabularies — visibility presets, object type names, typed
relationship names (`assigned_to`, `relates_to`, `derived_from`, `fulfills`, `resolves`, `supersedes`),
and event names — as a **machine-readable file** alongside the prose, and have both codebases assert
against it in tests. The prose stays the explanation; the file is the contract. This is a small
artifact that converts a class of silent incompatibility into a failing build.

Note this is deliberately *not* the `system_manifest.yaml` idea that meetings-kb rejected — that one
proposed generating documentation from config to fix a stale README. This is the inverse: a
cross-repository vocabulary contract, which is the case where machine-readability actually earns its
keep.

---

## 3. The §14 checklist has no owner

§14 is a good checklist and §15 correctly asks that repository instructions point at it and require an
assessment for material changes. meetings-kb v1.5 adopts exactly that (roadmap item A-6).

But the checklist specifies *what* to assess and *when*, and never *who decides* when an item is marked
"no with rationale." A documented temporary compromise is acceptable per §14 — acceptable to whom?

With coding agents doing much of the implementation in both products, a checklist that any actor can
self-certify against will tend toward all-green. The failure will not be a refused assessment; it will
be a cheerfully completed one.

**Recommendation:** name a reviewer for "no with rationale" answers, or at minimum require that such
answers are recorded in a single shared location where both products' exceptions can be read together.
The exception log is more valuable than the checklist — it is the actual list of known divergences.

---

## 4. "No independent competing copies" deserves a sharper test

§14 asks: *"Could personal and project views display this record without independent competing
copies?"* §3 makes it concrete: a task assigned to Mike is the same task in both lenses, and completing
it changes one authoritative record.

meetings-kb v1.5 is deliberately building **isolated per-person** knowledge bases, which is compatible
with §13's first stage. But it produces exactly the competing-copies shape at the boundary: if two
Power Cloud users both attend a meeting, each ingests it into their own corpus and each may generate
their own task for the same real-world obligation.

The mitigation is real — provenance plus preserved external identity means the duplicates are
*recognizable* later — but "recognizable" is weaker than "not created."

The vision defers `canonical_event_id` to "later, when a shared-event model exists." That ordering is
backwards relative to how the products will actually run: the duplicate records get written *now*, and
the shared-event model arrives *after*, at which point reconciliation is archaeology rather than
lookup.

**Recommendation:** specify `canonical_event_id` — or at least its derivation rule from
`provider` + `provider_object_id` — earlier than the shared-event model that consumes it. Writing a
resolvable key at ingestion costs nothing; deriving it retroactively across N corpora is the migration
the roadmap is otherwise avoiding.

---

## 5. A derived store becoming authoritative is a transition, not a state

§9 says it well: "As SQLite becomes authoritative for operational state, it is no longer entirely
disposable." Applying this to meetings-kb found a concrete instance worth generalizing.

Its search index is rebuilt from scratch into a temporary database and atomically swapped in at the end
of every sync. That is correct and safe *today*, because every row is derivable from evidence. It
becomes silently destructive the moment one user-authored value lands in the same store — no error, no
warning, just a value that disappears on the next scheduled run.

The v1.5 roadmap handles this by keeping the new task columns strictly derived and gating anything
user-authored behind a dedicated work item.

The general pattern is worth naming, because any product that starts with a rebuildable projection and
gradually migrates state into it will pass through the same window, and the failure is invisible in
testing that does not include a rebuild cycle.

**Recommendation:** add a §14 checklist item along the lines of —

> **Durability:** If this writes to a store that is ever rebuilt or regenerated, is every value either
> derivable from evidence or explicitly protected from the rebuild? Is that proven by a test that
> performs a full rebuild?

The existing "Authority" item asks which store owns live state. It does not ask whether that store
destroys it on a schedule.

---

## 6. meetings-kb already has two convergence assets worth knowing about

Feeding these back because they are further along than a "personal KB" label suggests, and may reduce
what the platform has to build.

**A working proto-outbox.** `state/pending_actions.jsonl` is an append-only event log with UUID-keyed
deduplication at drain time. That is structurally close to the durable-outbox pattern §10 recommends —
committed state change, durable record, consumer that tolerates retries and deduplicates by identity.
It is not a general event bus and should not be promoted into one, but the semantics are already
proven in production rather than theoretical.

**An explicit-promotion workflow, already enforced.** §7 describes promotion as deliberate publication
requiring authority, with AI proposing and humans confirming. meetings-kb's email drafter is exactly
that shape and has been for a year: Claude drafts, drafts are staged with a label, nothing is ever
auto-sent, and a static guard test forbids any `.send(` call in the Gmail client. The invariant is
enforced by the build, not by convention.

When the platform specifies the promotion workflow, the KB's drafter is a working reference
implementation of the hardest part — the refusal to act without confirmation — rather than a
green-field design.

---

## 7. Sequencing observation

The vision document is written as a north star for two products that evolve independently. In practice
the first real use of it was a one-directional dependency: meetings-kb needed answers about the OS
model to write its own roadmap, and the OS needed nothing from the KB.

That asymmetry will hold for a while, because the KB is making persistent-data decisions now and the OS
model is more settled. The practical consequence is that the KB's roadmap is the near-term forcing
function for closing §15's open decisions — the ID convention first, then workspace/tenancy schema when
tenant provisioning lands.

**Recommendation:** treat the KB roadmap's convergence checks as the prioritization signal for §15
rather than resolving those decisions in list order. The open decisions with a consumer should close
first.

---

## Summary of recommendations

| # | Recommendation | Cost | Urgency |
|---|---|---|---|
| 1 | Settle the ID convention as a standalone decision, ahead of §15's other items | Low | **Before either product writes IDs at volume** |
| 2 | Publish controlled vocabularies as a machine-readable contract both repos test against | Low | Near-term — drift already observed |
| 3 | Name an owner for §14 "no with rationale" answers; keep a shared exception log | Low | Before multi-agent implementation scales |
| 4 | Specify `canonical_event_id` (or its derivation rule) earlier than the shared-event model | Low | Before a second tenant corpus exists |
| 5 | Add a **Durability** item to the §14 checklist covering rebuilt/regenerated stores | Low | Next revision |
| 6 | Review the KB's action queue and drafter as reference implementations before designing equivalents | None | Opportunistic |
| 7 | Prioritize §15 open decisions by which have a live consumer | None | Ongoing |

---

*Written while finalizing `meetings-kb/.planning/v1.5-PLAN.md`. Every code-level claim about meetings-kb
in this note was verified against that repository at `file:line` and is cited in the roadmap.*
