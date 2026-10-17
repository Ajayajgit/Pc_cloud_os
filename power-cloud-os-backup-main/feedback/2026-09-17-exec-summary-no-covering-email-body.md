---
date: 2026-09-17
from: mike
source: internal
area: .claude/skills/customer-exec-summary
type: request
cost: "-"
blocking: no
frequency: every-time
class: in-the-way
autonomy: expected-do
status: new
---

## What happened

[Verified] The customer-exec-summary skill produces two artifacts: the internal draft in
`working/` and the rendered client-facing document in `deliverables/`. It stops there. The
document then has to be sent to the client, and **the covering email is written by hand every
time**, by the consultant, from material the session has just finished assembling and no longer
has in front of anyone.

The skill does gesture at this. Its closing section offers "a Gmail draft to the client contacts"
as a follow-up, but that is an optional offer at the end rather than a produced artifact, and it
is not specified: no length, no content rules, and no statement of what may not cross over from
the internal draft.

[Reported] Mike, 2026-09-17: the summary should also produce the body text for the email that
carries it. One to two paragraphs at most, written as the body of an email with the full summary
attached.

## What I did instead

[Verified] On this run the covering email did not exist as an artifact at all. The client-facing
document was never reached, because the run stopped at the internal draft with two sources out of
scope, so the gap showed up as a missing step rather than as manual work.

## Suggested fix

- [Reported] Mike: the skill should generate the email body itself, capped at one to two
  paragraphs, framed as the body of an email with the summary attached.
- [Inferred] Claude: it belongs as a third artifact produced at the same moment as the
  client-facing markdown, not as an offer in the closing section, because that is the point where
  the human has just decided what is allowed to be client-facing. Three things worth specifying
  rather than leaving to each run:
  - **It inherits the two-document split.** The email is drafted from the client-facing version,
    never from the internal draft. This is the highest-risk artifact in the whole skill for
    candour leaking, because an email body is short, informal, and feels like conversation.
  - **It names the one thing needing the client's attention**, rather than recapping the document
    the reader is about to open. A covering note that summarizes the summary earns nothing.
  - **It states the reporting windows** when the hours window and the narrative window differ, in
    a single clause, since that mismatch is exactly what a client misreads when skimming an email
    rather than the document.
- [Inferred] Claude: worth deciding whether it writes a Gmail draft or just emits the text.
  Emitting text is safer and works regardless of which mailbox the Gmail connector is scoped to,
  which on this run would have mattered: the connector was pointed at a mailbox that carries none
  of this client's correspondence.

**Clusters with two other open entries on this skill**
(`2026-09-14-exec-summary-no-connector-preflight.md`,
`2026-09-17-exec-summary-cross-client-data-bleed.md`). All three are about the skill's edges
rather than its middle: what it checks before it starts, what it is allowed to include, and what
it hands over at the end.

## Disposition
