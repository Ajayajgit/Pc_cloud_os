# Lessons — Task to Invoice

Patterns to avoid repeating. Written after corrections from Mike during the
2026-09-04 / 2026-09-11 sessions.

---

## 1. Establish the account before running discovery

**What happened:** Burned six queries probing three different NetSuite MCP connections
looking for invoice 261312, guessing from hashed server UUIDs. Mike: *"You're looping
thru other accounts for no reason."*

**Rule:** MCP connections are opaque UUIDs with no visible names. Before any discovery,
either call `getAccountInfo` on each candidate, or just ask for the account ID. Do not
probe by guessing at customer names.

---

## 2. Never infer meaning from an abbreviation

**What happened:** Saw a task named `Contract Hours for AF (DO NOT USE)` on an invoice
to AbilityFirst and concluded AF = AbilityFirst. It is **Anderson Frank** — a
subcontracting channel that is the parent of 159 projects and 87% of billable hours.
The wrong expansion made me flag a false customer-facing risk.

**Rule:** An abbreviation is a hypothesis. Resolve it by querying the actual parent,
project, or entity before building an argument on it.

---

## 3. Measure the real population before designing a guard

**What happened:** Set a 120-day lookback on the Map/Reduce without checking. Mike
asked how far back it reaches. Measured: **all** unbilled billable time spans 28 days,
103 records. The parameter was solving nothing; `billed = 'F'` was doing the work.

**Rule:** Query the actual distribution before choosing a threshold. A default picked
from intuition is usually either useless or dangerous.

---

## 4. Find the dominant case before designing for the exception

**What happened:** Designed and deployed the separate Task column as the primary
solution. Only when Mike raised Anderson Frank did I measure the split: **AF is 87% of
billable hours**; the "normal" case the column was built for is 13%.

**Rule:** Before committing to a design, quantify which case is actually the majority.
"For some customers we do X" deserves a query, not an assumption.

---

## 5. "Wrong-looking" data often encodes deliberate intent

**What happened:** Flagged `Contract Hours for AF (DO NOT USE)` receiving billable time
as a process problem. It is the contract-minimum true-up task; `DO NOT USE` is a
guardrail aimed at consultants, and the bookkeeper uses it on purpose.

**Rule:** Before calling data a defect, ask what workflow would make it correct.
Especially when the oddity looks intentional (an all-caps instruction in a name).

---

## 6. Same name under different parents is not duplication

**What happened:** Flagged four tasks named `Netsuite Implementation` as a duplication
problem. Mike: they are on different projects and never collide on one invoice.

**Rule:** Check the grouping key before calling something a duplicate. Ask "would these
two ever appear in the same output?"

---

## 7. Prefer derived fields over mutating source data

**Standing principle**, reinforced repeatedly on this project. Every time the choice
came up — task into memo vs. a derived column — the derived field won: it recomputes,
self-corrects, needs no idempotency guard, and never destroys what a person wrote.
Reach for mutation only when there is no rail to carry a derived value.
