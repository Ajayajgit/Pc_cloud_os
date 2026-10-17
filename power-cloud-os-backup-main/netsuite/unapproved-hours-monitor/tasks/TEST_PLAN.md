# Test plan — Friday morning

Account 5641465, Power Cloud Consulting, LLC. Everything below is deployed.
49 offline tests passing; local and server validation clean.

---

## The three things

| | Where | What it does |
|---|---|---|
| **Import** | Customers → Custom → **AF Unapproved Hours Import** | Upload the AF CSV, preview, confirm |
| **Review** | Customers → Custom → **AF Unapproved Hours Review** | The Friday screen. Per-rep drafts |
| **Sweep** | Customization → Scripting → Scripts → **PC AF Invoice Status Sweep** | Runs itself after a clean import |

Direct URLs if the menu has not refreshed (log out and back in usually fixes it):

- Import — https://5641465.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2605&deploy=1
- Review — https://5641465.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2607&deploy=1

Both are Administrator + `customrole1000`, and both `runasrole=ADMINISTRATOR`,
so the accountant needs no permission on invoices, custom records or the File
Cabinet.

---

## 1. Review screen — start here (read-only until you click something)

Open it. Nothing on this screen writes except **Mark as Sent** and **Snooze**.

Expected from current data:

- **16 timesheets**, **$46,080.00 at stake**, oldest **0 days**
- Everything is "first ask" tone, because every row has
  `first_unappr = 9/1/2026`. Aging only becomes meaningful as weeks accumulate
- **Only 2 of the client groups are sendable** — Alastin (Erin Pryce) and
  Harvest Hope (Jared Brownstein). The rest land in **Blocked — no AF contact
  email**
- A **Projects missing an AF contact email** worklist of about **30** rows

Check specifically:

- [ ] Cards are ordered oldest first
- [ ] A rep covering several clients gets **one** card, not one per client
- [ ] The draft reads as prose — "the 8/15 and 8/22 weeks for Alastin are still
      showing as unapproved" — not a table
- [ ] No dollar figure anywhere in the draft body
- [ ] **Copy draft** puts the text on your clipboard
- [ ] Blocked cards show the timesheets but no draft and no send button

### Then exercise the two writes
- [ ] **Snooze 7 days** on one group → it disappears from the list. Re-open the
      screen; it stays gone. That is the point — snooze is what stops the
      screen nagging about something you have consciously parked
- [ ] **Mark as Sent** on another → confirmation names how many timesheets were
      recorded. Re-open; that group now shows **asked: 1** and an
      "Already said" history block. Next week it will draft as a *second ask*,
      in different words

---

## 2. Import — the weekly path

Upload `tasks/../src/FileCabinet/SuiteScripts/PowerCloud/af_unapproved_hours/tests/fixtures/report_sample.csv`
(or a fresh AF export saved as **CSV**), Report As Of **9/1/2026**.

- [ ] Preview shows **16 rows, 16 matched, 0 exceptions**, and the **AF ID
      column is populated** (it was blank before the fix — worth a glance)
- [ ] Confirm & Apply succeeds
- [ ] Result says the **invoice status sweep was queued**
- [ ] Re-running the same file is safe and idempotent

Because nothing has changed since your last import, expect **0 invoices
stamped** on a repeat run. That is correct, not a failure — the import now
writes only when a status actually changes.

---

## 3. Sweep — should need no attention

It queues itself after a clean import. To watch:
**Customization → Scripting → Map/Reduce Script Status**

The audit log line prints `asOf`, `from`, `considered`, `toWrite`,
`alreadyCorrect`, `notTimesheet`.

- [ ] `from` is the tracked floor (earliest stamped invoice), not 2019
- [ ] `considered` is a few dozen, not thousands
- [ ] **`SKIPPED_CLOSED_PERIOD` is 0**

Current state for comparison:

| Status | Invoices | Value |
|---|---|---|
| Approved | 746 | $1,044,751.75 |
| Awaiting Status | 36 | $36,804.38 |
| Unapproved | 16 | $46,080.00 |

---

## What is NOT ready, and needs your judgement

**The draft wording is a placeholder written by me.** It follows the agreed
rules — three genuinely different messages by age, prose under four items,
hours and weeks rather than dollars, no machine footer — but it is not Steve's
voice. He should rewrite the base text before any of it goes to a rep. It lives
in one place: `lib/pc_af_draft.js`, `composeDraft`.

**Nothing sends.** By design. NetSuite would send from its own servers, leave no
copy in Steve's Sent folder, and start a new thread every week instead of
continuing one chase conversation. Steve copies the draft into his own client.
"Mark as Sent" only records that it happened.

**26 of 30 active AF projects still have no contact email.** That is the real
blocker on the whole point of this. The address cannot be derived —
`m.mihaylov1@andersonfrank.com` has a collision suffix, and two domains are in
use (`andersonfrank.com` and `tenthrevolution.com`). Several rows also need a
name, not just an address: "Adam" is a first name only, and Teppermans has
neither.

The review screen shows this worklist at the bottom so it stays in front of you
rather than in a document nobody opens.
