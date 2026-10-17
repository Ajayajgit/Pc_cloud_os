# Task to Invoice — Surface Time Entry Task (`casetaskevent`) on Invoices

**Goal:** Get the Task from each billable time entry onto the resulting invoice line
as a column, without changing the "Invoice Billable Customers" workflow.

**Account:** 5641465 (PRODUCTION, NetSuite 2026.1) — verified via `getAccountInfo`.
All findings below are from live read-only queries against production.

---

## HEADLINE

**The plumbing is already solved and needs no code — NetSuite natively copies a custom
transaction column field from billable Time onto the invoice line it generates, and
`custcol_pc_emp_name` already proves it in production.**

Task naming is mostly healthy: 96 distinct names in the last 3 months, with a good
specific tail. Two caveats:

1. **~44% of billable hours** sit on tasks named some casing of "NetSuite
   Implementation", where the column adds nothing. Not fixable by config — it is a
   task-creation practice question.
2. **10 task records have mechanically broken titles** (truncated mid-word, an HTML
   entity leak, a suffix artifact). These are the gate — see 3.1b.

Commercial wording for `Out of Scope` / `Contract Hours for AF (DO NOT USE)` was
**decided: print as-is** (3.1a). Settled.

---

## 1. Verified findings

### 1.1 The transfer mechanism already exists (proven)

`custcol_pc_emp_name` is an existing custom transaction column field that holds the
consultant name. It is populated **on the Time record**:

```
TimeBill 420513 | 8/23/2026 | employee 748 | custcol_pc_emp_name = "Irfan Karim"
```

...and the identical values appear on the **invoice item lines** of INV8970 (txn 261312),
all 12 of them. So:

> **NetSuite natively copies a custom Transaction Column Field from a billable Time
> record onto the invoice item line it generates.**

This is the rail. Task rides it the same way. No mapping logic, no Map/Reduce,
no User Event on Invoice, no memo manipulation.

### 1.2 Nothing in code populates it (proven by elimination)

Only two candidate scripts touch time:
- `customscript_validate_time_entry_cs` (`pc_timeentry_validation_cs.js`) — only blocks
  time entry dated >9 days back. Does not set the field.
- `customscript_update_time_costs_mr` (`time_entry_cost_updater_mr.js`) — clears and
  re-sets `casetaskevent` to the same value to force **cost/rate re-sourcing**. Does not
  set the field. (Useful precedent: a "touch to re-source" pattern already exists.)

Conclusion: `custcol_pc_emp_name` is populated by **NetSuite field sourcing —
configuration, not code.**

### 1.3 Weekly Timesheets are a non-issue (proven)

This was flagged as the top risk. It is resolved: all 207 billable entries queried for
8/23–8/31 were populated with `custcol_pc_emp_name`, and the team enters time via
Weekly Timesheet. Sourcing on a transaction column field works through the timesheet UI.

**The earlier concern about a User Event not firing on timesheets no longer applies,
because no User Event is needed.**

### 1.4 Task field coverage is perfect (Q1 gate — PASSED)

```
Billable time entries since 2026-06-01 : 2,356
With casetaskevent populated           : 2,356  (100.0%)
```

No data-entry gap. Every billable entry has a task.

### 1.5 Line granularity is already 1:1

INV8970 = 12 item lines + 1 sales tax line, one per time entry. Detail is not being
combined, so one task per line is unambiguous. Nothing to change.

---

## 2. The actual technical change (small)

### 2.0 Why a custom field is unavoidable

The native Time -> invoice-line copy applies **only to custom transaction column
fields**. Standard fields are not carried over — which is exactly why `casetaskevent`
does not reach the invoice today despite being present on the time record. That is the
root cause of this whole request.

So the task value has to be captured into a *custom* column field on Time first.
Two hops, and `custcol_pc_emp_name` already proves both of them:

| Hop | Mechanism | Status |
|---|---|---|
| `Time.employee` (standard) -> `Time.custcol_pc_emp_name` (custom) | field sourcing | **proven in prod** |
| `Time.custcol_pc_emp_name` -> invoice item line | native copy | **proven in prod** |
| `Time.casetaskevent` (standard) -> `custcol_powercloud_task` (custom) | field sourcing | **THE UNKNOWN** |
| `custcol_powercloud_task` -> invoice item line | native copy | proven by the above |

`employee` is a clean single-record reference. `casetaskevent` is a union of Project
Task / CRM Task / Case / Calendar Event, so whether it can act as a Source List at all
is the one thing to test.

**Update — the polymorphism risk is smaller than first assessed.** Verified:

```
Billable time since 2026-06-01 : 2,356
Task is NOT a Project Task     :     0
```

Every billable task in the last 3 months is a Project Task. The union is theoretical in
this data. Two consequences:

- The `labelFromRecord()` fallback in the Map/Reduce is effectively dead code. Kept
  deliberately as a safety net — a Case or Calendar Event could be billed in future.
- **Native sourcing may well work.** The reason to prefer the script is therefore *not*
  polymorphism — it is that sourcing cannot express the 5 label overrides or the
  ` (Project Task)` suffix strip. If those requirements were ever dropped, native
  sourcing becomes a legitimate no-code option worth re-testing.

Still untested: whether NetSuite's Sourcing & Filtering UI *offers* `casetaskevent` as a
Source List. Being a union field, it may refuse regardless of what the data contains.

### 2.0a Sourcing is stored at save time, not a live lookup

Consequences:

- Time entries created **before** the field exists will be blank until re-saved.
- Invoices **already generated** will never backfill — the copy happens at invoice
  creation time.

**This change is forward-only by default.** Backfilling historical time would need a
variant of `Update_Time_Cost_MR` (which already does a clear-and-re-set on
`casetaskevent` for exactly this re-sourcing purpose). Only worth it if old invoices
might be re-issued.

### 2.0b Population: save-time User Event + nightly Map/Reduce

Mike asked for on-save population. Both are built; they are complementary, not
alternatives.

**Which record to hook — verified, and it matters:**

```
Billable time entries since 2026-06-01 : 2,356
Entered via Weekly Timesheet           : 2,356  (100%)
Entered directly on Time Tracking      :     0
```

A User Event on `timebill` alone would have caught **nothing**. The primary deployment
is on **TIMESHEET**; the Time Tracking deployment is a cheap safety net for the 0% case.

| Component | Role |
|---|---|
| `customscript_pc_task_to_invoice_ue` (beforeSubmit, TIMESHEET + TIMEBILL) | Primary. Stamps each time line in memory as the record saves — no second save, no save loop. |
| `customscript_pc_task_to_invoice_mr` (nightly) | Safety net. Catches pre-deployment records, UE failures, and anything bypassing the UI. |
| `lib/pc_task_label.js` | Shared label logic so the two cannot drift apart. |

**The UE is deliberately fail-open.** It runs on every timesheet save, so nothing in it
is permitted to stop a consultant submitting time. All errors are logged and swallowed,
and the nightly sweep reconciles whatever was missed. This is why the M/R is kept rather
than retired once the UE is live.

**Sandbox verification required:** the timesheet time sublist id (`timeitem`) and its
task column id (`casetaskevent`). If either is wrong, `setSublistValue` throws, the
error is logged, the timesheet still saves, and the M/R picks it up that night —
so a wrong guess degrades rather than breaks. Confirm before promoting past TESTING.

### 2.1 Build steps

- [ ] Inspect `custcol_pc_emp_name` at Customization > Lists, Records, & Fields >
      Transaction Line Fields. Record its exact **Applies To** boxes and its
      **Sourcing & Filtering** config. This is the template to clone.
- [ ] Create `custcol_powercloud_task`, Free-Form Text, cloning that config:
      Applies To must include **Time** *and* the invoice item sublist.
- [ ] Sourcing: Source List = `casetaskevent`, Source From = the task's
      customer-facing label (see 3.2).
- [ ] **Open question — the one real unknown:** `casetaskevent` is polymorphic
      (Project Task / CRM Task / Case / Calendar Event). Whether NetSuite sourcing
      resolves through it is untested. Verify in sandbox first.
      - Fallback if sourcing fails: extend `Update_Time_Cost_MR`, which already loads
        and re-saves time records, to also set the text field. Small, and reuses a
        proven deployment.
- [ ] Add the column to the invoice Advanced PDF/HTML template.
      **Render it as a bold header above the description, not a 7th column** — the
      existing layout is already width-saturated (visible in the PDF where
      "Mukula Kale" and "Development" collide with no space).

---

## 3. Task name quality — measured over the last 3 months

Window: billable time since 2026-06-04. **96 distinct task names, ~3,984 billable hours.**

**What is healthy:** the long tail is good. `P0 - System Performance & Technical Debt`,
`1045 : Meal Connect Integration Gap with NetSuite`, `1030 : Multi-Book LIFO`,
`Celigo - NetSuite Field Fix`, `Shopify Integration`, `1001 - Subsidiary Restructure`
and dozens more are exactly what you would want a customer to read.

**Duplication is a non-issue** — same-name tasks live on different projects and never
collide on one invoice. (Earlier draft of this doc treated this as a problem; it isn't.)

**Two real problems remain:**

### 3.0 Hours are concentrated on generic names

| Task name | Entries | Hours | Share |
|---|---|---|---|
| `Netsuite Implementation` | 654 | 1,183.5 | 30% |
| `NetSuite Implementation` | 373 | 582.75 | 15% |
| **Subtotal** | **1,027** | **1,766.25** | **~44%** |

Add `Netsuite/NetSuite Configuration`, `NetSuite Support`, `General Admin & Customer
Calls`, `Project Management`, `Meetings / Q&A` variants and the generic bucket is
roughly **60% of billable hours**.

This is **current usage, not stale data** — 654 entries were booked to
`Netsuite Implementation` in the last 3 months. The task *records* are old; the
*billing to them* is live. For those lines the new column will read
"NetSuite Implementation", which tells the customer nothing they don't already know
from the invoice header. The memo already carries the real detail.

Not a blocker, and not fixable by configuration. It is a task-creation practice
question: granular tasks going forward.

### 3.1 Seventeen task records must not print as-is (GATE)

17 records, 309 billable hours in the window:

| Task ID | Title | Hrs | Issue |
|---|---|---|---|
| 5961, 6094, 5891, 5738 | `Out of Scope` | 194.25 | **Billing-dispute trigger — all `billed = T`, see 3.1a** |
| 6169 | `Out of Scope (Project Task)` | 3.5 | Same, plus suffix. Project: AbilityFirst |
| 1433, 6201 | `Contract Hours for AF (DO NOT USE)` | 40.0 | **`billed = T`. "AF" is NOT AbilityFirst — task 1433 belongs to Chalk Couture, 6201 to Grinds.** |
| 6147 | `1004 : Allocation : Shared service costs (…) limiting true program cost visibility, functio` | 24.5 | Internal requirement text, truncated mid-word |
| 6071 | `1031: Purchasing contract : … and makin` | 9.5 | Same |
| 6065 | `1025: Vendor Bill AR items : … and a subseq` | 7.0 | Same |
| 6072 | `1032: Purchasing contract approval : Clenera's current process … creating appr` | 2.0 | Same, **plus contains a client name — verify task 6072 belongs to Clenera before it can print anywhere** |
| 6144 | `1001 : Location : NetSuite uses the Department segment as a proxy…` | 0.75 | Requirement text, not a label |
| 6170, 6229 | `Meetings, Q&A sessions, and brainstorming discussions (Project Task)` | 17.75 | Suffix artifact |
| 6171, 6257 | `Project Management (Project Task)` | 3.75 | Suffix artifact |
| 1549 | `Amazon FBA &lt;&gt; Netsuite Integration` | 6.5 | **HTML entity leak in the stored title** — would print literally |

This is a finite, one-afternoon list — not a general cleanup.

### 3.1a These hours are already invoiced to named customers (verified)

Queried 2026-06-04 onward. Every block below is `billed = T`:

| Task | Project | Hrs | Billed |
|---|---|---|---|
| 5961 `Out of Scope` | Mid-Ohio Farming Collective | 84.25 | T |
| 6094 `Out of Scope` | Clenera - Rapid Assessment | 60.5 | T |
| 5891 `Out of Scope` | Spinelli Kilcollin | 30.75 | T |
| 5738 `Out of Scope` | Appalachian Trail Conservancy | 16.5 | T |
| 6169 `Out of Scope (Project Task)` | AbilityFirst | 3.5 | T |
| 1433 `Contract Hours for AF (DO NOT USE)` | Chalk Couture NetSuite Consulting P0190430 | 28.25 | T |
| 6201 `Contract Hours for AF (DO NOT USE)` | Grinds | 11.75 | T |

Nothing has leaked to date because there is no task column on the invoice today — the
memo is the only per-line detail a customer sees. **This project is what changes that.**

Note: "AF" in `Contract Hours for AF` does not refer to AbilityFirst. AbilityFirst is
project 4037 and does receive invoices (see `CustInvc_261312.pdf`).

**What this task actually is** (per Mike): the contract-minimum true-up for
minimum-hours customers. When a customer's consulting hours fall below their contracted
minimum, the in-house bookkeeper books time here to bring billing up to the minimum.
`DO NOT USE` is an instruction to consultants, not a defect. The `billed = T` values
above are therefore correct and intentional.

Implication for printing: these lines represent a contract-minimum true-up — the most
scrutinised line on such an invoice — and the task name is internal staff instruction.
Mike's decision to print raw names stands. If that is ever revisited, a one-word
Invoice Label of `Contract Hours` on tasks 1433 and 6201 resolves it with no wording
debate and no downside.

**DECIDED (Mike, 2026-09-04): print the raw task names.** `Out of Scope` and
`Contract Hours for AF (DO NOT USE)` will appear on customer invoices as written.
Confirmed after the billed/project facts above were presented. No label, no suppression,
no further discussion — treat as settled scope.

These 7 records are therefore **out of the gate**. The gate is now the 10 records in 3.1b.

### 3.1b Remaining gate — 10 records with broken strings

Distinct from 3.1a: these are not commercial-wording calls, they are titles that are
mechanically unusable as printed output.

**Group A — truncated requirement text (5 records, ~44 hrs).** Titles are requirement
paragraphs cut off mid-word by a length limit. Each needs a short label.

| Task | Title ends... | Hrs |
|---|---|---|
| 6147 | `…limiting true program cost visibility, functio` | 24.5 |
| 6071 | `…how multiple POs relate to a single contract and makin` | 9.5 |
| 6065 | `…create a reimbursement invoice and a subseq` | 7.0 |
| 6072 | `…for the same underlying vendor agreement, creating appr` | 2.0 |
| 6144 | `1001 : Location : NetSuite uses the Department segment as a proxy for physical sites…` | 0.75 |

Suggested labels (derived from the `NNNN :` prefix each already carries):
`1004 : Allocation`, `1031 : Purchasing Contract`, `1025 : Vendor Bill AR Items`,
`1032 : Purchasing Contract Approval`, `1001 : Location`.

**Group B — corrupted stored title (1 record).** Task 1549 is
`Amazon FBA &lt;&gt; Netsuite Integration`. The literal HTML entity is in the stored
data. Fix the title at source to `Amazon FBA <> Netsuite Integration` — this is a data
bug worth correcting whether or not it ever prints.

**Group C — `(Project Task)` suffix artifact (4 records, ~21 hrs).** Tasks 6170, 6229,
6171, 6257. Handle mechanically by stripping a trailing ` (Project Task)`; no
per-record curation needed. Root cause worth a look — likely a task-creation or sync
artifact.

### 3.2 Fix mechanism: a dedicated customer-facing label

Default is now **print `projecttask.title` as-is** (per 3.1a). A label is needed only
as an override for the 10 records in 3.1b.

- [ ] Add an **"Invoice Label"** custom field on Project Task.
- [ ] Source `custcol_powercloud_task` from the label, falling back to the title when
      the label is empty. If sourcing cannot express a fallback, the simpler route is to
      populate the label for all in-use tasks via one mass update (title by default,
      corrected value for the 10).
- [ ] Populate labels for Group A (5 suggested values already drafted in 3.1b).
- [ ] Fix task 1549's title at source (Group B).
- [ ] Strip ` (Project Task)` for Group C.

Why a label rather than editing titles directly: Group A's titles are the requirement
text the delivery team works from. Overwriting them to suit invoicing loses internal
information. A label decouples the two audiences.

### 3.3 Separate follow-ups (not blockers)

- ~~`Contract Hours for AF (DO NOT USE)` is receiving billable time — a process problem.~~
  **Retracted.** Per Mike: this is the contract-minimum true-up task for minimum-hours
  customers. The in-house bookkeeper uses it to bring billing up to the contracted
  minimum when consulting hours fall short. `DO NOT USE` is a deliberate guardrail
  aimed at consultants, not a data error. Working as designed — no action.
- Task 1549's title contains a literal `&lt;&gt;` HTML entity — stored data is corrupted,
  worth fixing at source.
- Verify task 6072 (`…Clenera's current process…`) belongs to Clenera.
- The `(Project Task)` suffix on 5 records suggests a task-creation or sync artifact.

---

## 4. Options considered and rejected

| Option | Verdict |
|---|---|
| Custom column + Map/Reduce to map lines back to time entries | **Rejected — unnecessary.** Native Time -> invoice-line copy already does this (1.1). This was my original recommendation before discovery. |
| UE `afterSubmit` on Invoice + reload/save | Rejected. Re-saving a billable-time invoice for data the platform already copies. |
| UE `beforeSubmit` on Time to prefix the memo with the task | Rejected. Mutates time data, pollutes the description, and would have failed on Weekly Timesheets. Also now redundant. |
| Source column directly from `projecttask.title` | **Rejected — this is the trap.** Section 3 shows what it would print. |
| List/Record column to Project Task | Rejected as the printable field (`casetaskevent` is polymorphic). Worth adding as a *secondary* field for saved-search grouping ("hours billed by task"). |
| Turn off line combining | Already off (1.5). |
| Charge-Based Project Billing | Right long-term model, but a billing-model migration. Do not bundle. |

---

## 5. Separate issue found

**The SuiteQL metadata catalog for `TimeBill` is broken in production.**

```
GET /services/rest/query/v1/suiteql/metadata-catalog/timebill
HTTP 500 — Field match custcol_pc_emp_name not found on record type <TimeBill>
```

`custcol_pc_emp_name` is registered against TimeBill but does not resolve there. Any
REST/SuiteQL metadata introspection on TimeBill fails. Worth fixing — likely a stale
Applies To box on the field. Flagging only; out of scope here.

---

## 6. Sequencing

1. Inspect `custcol_pc_emp_name` config (section 2) — the template for everything else
2. Sandbox: create `custcol_powercloud_task`, then **test whether sourcing resolves
   through the polymorphic `casetaskevent`**. This is the only real technical unknown;
   everything downstream assumes it works. Fallback = extend `Update_Time_Cost_MR`.
3. Fix the 10 broken records (3.1b): 5 labels, 1 title correction, 4 suffix strips
4. Sandbox: generate an invoice via **Invoice Billable Customers** (not the invoice page)
   and diff line-for-line against INV8970
5. Template change — task as a bold header above the description, not a 7th column
6. Production deploy

Steps 1–2 are the whole technical risk and can be done in an afternoon. Step 3 is
small and independent — it can proceed in parallel or after.

## 7. Deployment record

**Deployed to PRODUCTION 5641465 on 2026-09-04.** Mike chose full deploy (Option 2);
Power Cloud has no sandbox available, so the CLAUDE.md sandbox-first standard could not
be applied. Validation: 21/21 steps, 0 errors, 0 warnings. Deploy: 38/38 steps.

Objects created:
- `custcol_powercloud_task` (transactioncolumncustomfield) — verified queryable on both
  `TimeBill` and `transactionLine`, so coltime and colsale both took effect.
- `customscript_pc_task_to_invoice_mr` + deployment (SCHEDULED, 02:00 UTC daily)
- `customscript_pc_task_to_invoice_ue` + 2 deployments (TESTING — owner-only execution)
- Script params `custscript_pc_t2i_since_days`, `custscript_pc_t2i_cutoff_date`

Validation fixes required along the way (all resolved):
- manifest needed `<dependencies><features>` declaring SERVERSIDESCRIPTING and TIMETRACKING
- `<setting>SCRIPT</setting>` is invalid on a scriptcustomfield — omit the element
- `<mandatory>` and `<isparent>` unsupported and ignored
- empty XML elements rejected by SDF

Also created: `suitecloud.config.js` (the missing file behind the original
"no valid project folder" error) and `package.json`.

### 7.1 Backward-reach guards on the Map/Reduce

Raised by Mike: the sweep must not reach into billed or closed-period time.
Measured first — with **no** lookback filter at all there were only 103 unbilled
billable entries spanning 28 days (2026-08-07 to 2026-09-04), so `billed = 'F'` was
already doing the real work. Guards now in place:

1. `billed = 'F'` — billed time is never touched, so no existing invoice can change.
2. Rolling window — default reduced 120 -> 45 days, hard-capped at 180 in code so a
   mis-set parameter cannot trigger a multi-year scan.
3. `custscript_pc_t2i_cutoff_date` — hard date floor. **Set this to your last closed
   period end date and advance it at each close.**

The `accountingperiod` record is not exposed to this integration role, so period status
cannot be filtered in SQL. The explicit cutoff date is the substitute, and is a harder
guarantee than a period join would be.

## 8. Outstanding

- [ ] Set `custscript_pc_t2i_cutoff_date` on the M/R deployment (last closed period end)
- [ ] Verify the UE: save one of your own timesheets, confirm the field populates and
      check the DEBUG log for the sublist ids (`timeitem`, `casetaskevent`)
- [ ] Promote both UE deployments TESTING -> RELEASED once verified
- [ ] Add the column to the invoice Advanced PDF/HTML template — bold header above the
      description, not a 7th column
- [ ] Fix task 1549's corrupted title (`Amazon FBA &lt;&gt; Netsuite Integration`)
- [ ] Import `custcol_pc_emp_name` and diff its `col*` flags against the new field
- [ ] Unrelated: `TimeBill` REST metadata catalog returns HTTP 500 (stale
      `custcol_pc_emp_name` Applies To) — breaks integration introspection

## 9. Anderson Frank — the dominant channel (raised 2026-09-11)

For Anderson Frank work, Power Cloud manually copies **description + hours** into AF's
portal. No API, no CSV. A separate Task column is useless there — the task has to be
inside the text being copied.

### 9.1 Scale — this is not an edge case

Billable time since 2026-06-01:

| Channel | Entries | Hours | Share | Active projects |
|---|---|---|---|---|
| **Anderson Frank** (parent customer 136) | 2,114 | 3,830.25 | **87%** | 33 |
| Direct / other | 385 | 572 | 13% | 11 |

Customer 136 "Anderson Frank" is the parent of **159 projects**, including Clenera,
Mid-Ohio Farming Collective, Chalk Couture, Grinds and Appalachian Trail Conservancy.
AbilityFirst is **not** among them, which is why it receives a direct invoice.

Invoicing since 2026-06-01: 335 invoices to Anderson Frank ($494,189) vs 69 direct
($1,853,267). AF work **is** invoiced in NetSuite, so an invoice-level solution is
reachable — this is not portal-only.

**This resolves the earlier "AF" ambiguity** (see 3.1a): `Contract Hours for AF
(DO NOT USE)` means Anderson Frank, not AbilityFirst.

### 9.2 Decision: derived concatenated field, NOT memo mutation

Add `custcol_powercloud_task_desc` = `task label + separator + memo`, populated by the
existing UE and M/R and carried to the invoice line by the same native copy.

Why not prefix the time entry memo:

- Permanent edit to source data at ~2,114 entries per quarter. Rename a task and every
  historical memo is stale, with no way to separate prefix from the consultant's words.
- Prefix-detection for idempotency will eventually mis-fire on a legitimate memo.
- A derived field self-corrects on the nightly sweep.

Why a second field rather than reusing the existing one:

- No per-customer branching. Both fields populate for everyone; AF copies from the
  concatenated one, direct invoices print the standalone Task column in the template.
  Nothing needs to track which of the 159 AF projects is which.

Marginal cost is small — the label resolution already exists in `lib/pc_task_label.js`.

### 9.2a BUILT AND DEPLOYED 2026-09-11

`custcol_powercloud_task_desc` — **TEXTAREA**, applies to Time + Sale Item.
Validation 0/0, deploy SUCCESS (40 steps). Format logic in `lib/pc_task_label.js`,
written by both the UE and the M/R.

**Format decided: task, pipe, memo with the date prefix stripped and newlines collapsed.**

```
Celigo - NetSuite Field Fix|Call with Customer for Weekly Check Ins.
```

Three measurements drove the decisions, all against the 2,114 AF entries since June:

| Finding | Consequence |
|---|---|
| Longest memo **1,740 chars**; 183 entries exceed 300 | Field **must** be TEXTAREA. TEXT caps at 300 and would silently truncate ~9% mid-sentence. |
| 2,093 of 2,114 memos (99%) already begin `MM-DD-YYYY - ` | Date lives in the memo, not added by NetSuite. Stripping it saves **13 chars/entry** — 6x more than removing spaces around the separator. |
| Task titles frequently contain hyphens (`Celigo - NetSuite Field Fix`, `1003 - Fixed Asset Configuration`) | Pipe separator, not a bare hyphen — otherwise the separator is lost among the title's own hyphens. |

Also handled: memos containing CR/LF (the SCA Development entries) are collapsed to
`; ` so a paste into a single-line portal field does not break.

**Unexpected win:** the 27 AF entries whose memo is only a date stub (`08-24-2026 -`,
54.25 hrs) now carry the task name as their only content. Previously the portal got
nothing usable for those.

`SEPARATOR` and `DATE_MODE` in `lib/pc_task_label.js` control the format; `DATE_MODE`
supports STRIP (current), KEEP_FIRST and KEEP_INNER. One-line change.

### 9.2b Pipeline verified in production

The nightly M/R ran 2026-09-10 22:00 EDT and populated 43 distinct task values.
Confirms end to end:

- `1004 : Allocation` written — the Group A override replaced the truncated
  requirement paragraph correctly.
- `Meetings, Q&A sessions, and brainstorming discussions` and `Project Management`
  written **without** the `(Project Task)` suffix — the strip works.
- No truncated requirement text in any of the 43 values.
- `Out of Scope` written as-is, per the decision in 3.1a.

### 9.3 Open questions

- [ ] **What is the actual AF character limit?** Still unknown, and it is the one open
      risk. Against the 2,114 AF entries: 246 exceed 255 chars and 183 exceed 300, with
      a maximum of 1,764. If AF enforces a hard cap, stripping the date (13 chars) will
      not be enough for that tail — the answer would be shorter memos on AF work, not a
      formatting change. Nothing is truncated in NetSuite; trim at the point of paste.
- [x] ~~Does the portal take a date separately?~~ Assumed yes; `DATE_MODE = 'STRIP'`.
      Flip to `KEEP_FIRST` in `lib/pc_task_label.js` if that assumption is wrong.
- [x] ~~Separator~~ — pipe, no spaces.

### 9.4 Also worth building

A saved search on Time filtered to `parent = Anderson Frank`, showing the concatenated
field plus hours — a purpose-built work surface for the portal copy-paste, rather than
reading off an invoice PDF. Zero extra code once the field exists.

## 10. The AF bot changes the channel (raised 2026-09-11)

**New constraint:** an existing bot performs AF time entry and reads the *memo*. The
barrier to changing it is high. A custom column field is invisible to it — so for the
AF path, the memo is the only channel that reaches the consumer.

This reverses the 9.2 decision **for AF only**. `custcol_powercloud_task_desc` still
serves the invoice and saved searches, but it cannot help the bot.

### 10.1 Risk assessment — what was checked

| Risk | Finding |
|---|---|
| Does memo change break the AF reconciliation? | **No.** `lib/pc_af_match.js` (Unapproved Hours Monitor) keys on AF id tokens in the invoice `otherrefnum`, pay amounts and period-ending dates. It never reads memo text. Verified by reading the matcher. |
| Is something already writing memos? | **Almost certainly yes.** `custcol_memo_updated = T` on 3,028 entries, of which 2,992 (98.8%) carry the `MM-DD-YYYY - ` prefix; every `F` entry has no memo at all. **Unidentified — not in the script list under any memo/time name. Could be a workflow.** |
| Does the bot parse the memo? | **Unknown, and only Mike can answer.** Determines whether the leading date is load-bearing. |

### 10.2 Design if we proceed

- **Never modify the front of the memo.** Insert the task *after* the `MM-DD-YYYY - `
  prefix, so anything parsing the leading date is unaffected:
  `08-25-2026 - Celigo - NetSuite Field Fix|Call with Customer for Weekly Check Ins.`
- **Add `custcol_powercloud_memo_orig`** holding the pre-modification memo. This turns
  an irreversible mutation into a derived, reversible one: rebuild the memo from
  original + current task label on every run. Fully idempotent, self-corrects when a
  task is renamed, and restorable if the whole thing is backed out. This removes every
  objection raised in 9.2 except the fact of mutation itself.
- ~~Scope to AF projects only~~ — **superseded. Apply to everyone** (Mike, 2026-09-11).
  Consistency, and `job.parent = 136` is a moving target across 159 projects: scoping
  would mean behaviour silently changes whenever a project is re-parented. One rule,
  no branching, no test to maintain. Blast radius goes from 87% to 100% of billable
  time, which is not a meaningful difference in risk given `memo_orig` makes it
  reversible.

  Knock-on effects of applying it universally:
  1. **Direct clients will now see the separator on their printed invoices.** The pipe
     was chosen for AF's character limit; on a PDF to a direct client
     `Multi-Book LIFO|Reviewed the allocation logic` reads a little technical. One
     constant (`SEPARATOR`) if a softer render is wanted — at a cost of characters
     against the AF limit. Genuine trade-off between the two audiences.
  2. **The Task column no longer needs to print on the invoice template.** The
     description now carries the task for every customer, so the planned bold header
     above the description would just duplicate it. Keep `custcol_powercloud_task` as a
     field for saved searches and grouping; drop it from the PDF.
  3. **`custcol_powercloud_task_desc` becomes redundant.** It holds
     `task|description`, which is what the memo itself will now contain minus the date.
     Recommend removing it once the memo change is live rather than leaving cruft.
     It was built before the bot was known about.
- **Keep the existing UE + M/R split.** The UE fires at timesheet save, so the memo is
  correct before any bot run; the M/R is the backstop.

### 10.2a IDENTIFIED: the date-prepender is a User Event script

System Note on a time entry, 2026-09-10 06:01, user Irfan Karim:

```
Context: Script (User Event)   Change: Memo
old: Performed a detailed review of ACFB's existing Program, Department, ...
new: 09-10-2026 - Performed a detailed review of ACFB's existing Program, ...
```

So it is a **User Event**, not a workflow — findable and readable, and it was never
checked into source control (confirmed: no local project writes a Time memo).

**`custcol_memo_updated` is almost certainly its idempotency marker.** That finally
explains the 98.8% correlation: the flag means "the date has already been prepended."
`T` ⟺ has date prefix; `F` ⟺ no memo at all.

**Our UE and theirs will both run on the same record.** Working through the orderings:

| Order | Their state | Result |
|---|---|---|
| Theirs first | memo = `09-10-2026 - desc`, flag T | We insert after the date -> `09-10-2026 - Task\|desc` |
| Ours first | memo = `Task\|desc`, flag still F | They see flag F, prepend -> `09-10-2026 - Task\|desc` |

**Identical output either way.** The design is order-independent, which removes the
need to fight over UE execution order. This holds provided their skip condition is the
flag (or a leading-date test) and they *prepend* rather than reformat — the one thing
still to confirm by reading the script.

Re-saves are handled by `custcol_powercloud_memo_orig`: rebuild from the original each
time rather than trying to detect an existing prefix.

### 10.3 Blocking before any memo write

- [x] ~~Identify what sets `custcol_memo_updated` and prepends the date.~~ **Done** —
      it is a User Event script (System Note, 2026-09-10). See 10.2a.
- [ ] **Read that script** to confirm two things: its skip condition (flag vs.
      leading-date test) and that it *prepends* rather than reformats. Everything in
      10.2a rests on those. Blocked on the NetSuite connector reissuing a token.
- [ ] **Confirm what the bot parses out of the memo**, particularly the leading date.

## 10.4 UE verified in production, and a bug it exposed (2026-09-11)

Mike created test time entry **420986**. Result:

```
memo  : 09-10-2026 - Test
task  : Status Update (Task)     <- our UE ran and populated the field
```

**First production confirmation that the User Event works**, and it exercised the
polymorphic fallback: the task is a CRM Task, not a Project Task, so the title lookup
missed and `getText()` supplied the label. That path was written as a safety net on the
assumption it would never fire — it fired on the first real test.

**Bug found and fixed:** NetSuite appends a record-type disambiguator to the display
text of the `casetaskevent` union field, so `getText()` returned `Status Update (Task)`.
The suffix regex only stripped ` (Project Task)`. Now covers Project Task, Task, Case,
Support Case, Event, Calendar Event, Phone Call and Milestone. Unit-tested against all
variants, deployed.

Note this means the `(Project Task)` suffixes seen in section 3.1b have **two** sources,
not one: literally stored in some `projecttask.title` values, *and* appended by NetSuite
at display time. Same fix handles both.

### 10.4a The date-prepender: still unresolved, and the theory has weakened

Script Execution Log shows nothing, even for a freshly created timesheet. Format
analysis of 3,029 memos since June:

| Variant | Count |
|---|---|
| `NN-NN-NNNN - ` (standard) | 2,937 |
| `NN-NN-NNNN` other separator | 56 |
| No date prefix | 35 |
| Slashes (`09/10/2026 –`) | 1 |

97% uniform. Consistent with a script that prepends only when no date is present — but
equally consistent with a well-drilled team convention. Entry 420977 (`09/10/2026 –`,
slashes and an en-dash) is the kind of variation a script would never produce.

**One fact settles it: did Mike type the date on 420986, or did something add it?**
Pending.

If it turns out consultants type the date, the whole "competing memo writer" concern
evaporates and the memo change is unblocked immediately.

## 11. Review
_To be completed once the first invoice prints with a Task column._
