# Writing Standards (client-facing deliverables)

How every client-facing document and deck reads. Read this before drafting the assessment, the deck, or the onsite one-pager. The [rapid-assessment skill](.claude/skills/rapid-assessment/SKILL.md) and [CLAUDE.md](CLAUDE.md) both point here so the voice is the same regardless of who prompted the run.

The through-line: **a burned client wants brass tacks, not a novel.** By the time they read this they have done a pre-sale call, a kickoff, and discovery. They are past pleasantries. Tell them what is wrong and what we will do about it, in as few words as it honestly takes.

## Voice

- No em-dashes anywhere. Use commas, periods, or parentheses.
- Plain, direct, factual sentences. A NetSuite admin should nod along, not decode. An assessment delivered by professionals reads factual, not jovial or storytelling.
- Specifics over adjectives. "Order entry takes 4 minutes per line because items are keyed individually" beats "inefficient order entry."
- Confidence matches evidence. State verified findings flatly. Frame our analysis as our read.
- Banned filler: leverage, seamless, robust, delve, journey, empower, streamline, holistic, cutting-edge, best-in-class, unlock. (Verbatim brand copy from the guidelines, like the positioning statement, is exempt. The ban applies to prose we write.)
- **No storytelling register in written prose.** In the document body and on slide text, do not write "this is a story about...", "the through line is...", or narrate the client's situation like a case study. The failed vendor we passed on wrote "a thousand words that don't say anything"; that is the anti-target. The problem is the product of scale and layered growth, not client incompetence (a burned client needs a villain that is not them), but make that point once, plainly, and move on. Do not build the document around a scale-as-antagonist metaphor.
- **The exception is the deck's speaker notes.** Speaker notes are a spoken script, not something the client reads, and a narrative, conversational register there is good (the summit specifically praised the deck notes that talked the client through the story: "you rebuilt stories inside NetSuite, that decision is the through line"). Write the notes to be said aloud in the presenter's own words. This exception is only for speaker notes; slide text and the whole document stay concise and factual.
- **No editorial judgment and no flowery language.** State findings, recommendations, and effort. Nothing else. Do not characterize the build as mature, careful, careless, impressive, or "unusually" anything; do not call debt "overdue in the best sense"; do not write "two pieces of good news," "the story of this assessment," "real and fixable," or "unlocks disproportionate value." No connective sentence that tells the reader how to feel about a finding. A burned client hired us for a factual read, not reassurance or narrative. The scale-came-from-growth reassurance is off by default; include it only if the consultant asks for it, and then as a single plain clause, never in the opening.
- **Never frame by negation.** Do not raise a thing in order to deny it. "These are alternate options, not corrections" plants the word correction; "the design decisions are not the problem" plants the idea that they are. Assert the positive instead ("the design decisions hold up"). This is the same failure as the Shinesty leaving-NetSuite error in a smaller form, and it shows up most often when we are trying to be reassuring or diplomatic. Negations that describe *our own* scope or limits are fine ("this is a read on the work, not a quote"), because the thing being denied is ours to name.

## Dates

**US format everywhere a human reads a date: `August 31`, or `August 31, 2026` when the year matters.** Never day-first (`31 August`). Month-name abbreviation is fine inside a narrow table column (`Aug 31, 2026`), spelled out in prose.

Two deliberate exceptions, both machine-facing rather than reader-facing:

- **Filenames keep ISO**, because CLAUDE.md fixes the deliverable naming and ISO sorts correctly in Drive: `{Client}_Assessment_{YYYY-MM-DD}.docx`.
- **Internal working files keep ISO** (`working/`, `CONTEXT.md`, `verification.md`, `loe_log.md`, `ENGAGEMENT_LOG.md`). These are dated logs where sortability and unambiguous parsing beat readability, and they are never client-facing.

So the rule in one line: ISO for anything a machine sorts, US long form for anything a person reads.

## Spelling

**US English everywhere.** Power Cloud is a US practice writing for US and Canadian clients, and a document that mixes locales reads as machine-written, which is the one impression a paid assessment cannot afford. The families that drift:

| Write | Not |
|---|---|
| optimize, stabilize, organization, customization, authorization, prioritize | optimise, stabilise, organisation, customisation, authorisation, prioritise |
| analyze, paralyze | analyse, paralyse |
| color, behavior, labor, favor | colour, behaviour, labour, favour |
| center, meter, fiber, theater | centre, metre, fibre, theatre |
| license, defense, offense, practice (noun and verb) | licence, defence, offence, practise |
| catalog, program, gray, aging, judgment, fulfillment, enrollment, installment | catalogue, programme, grey, ageing, judgement, fulfilment, enrolment, instalment |
| modeling, labeled, traveled, canceled, while, among | modelling, labelled, travelled, cancelled, whilst, amongst |

Three exemptions, all of them cases where the spelling belongs to someone else:

- **Proper nouns and legal entity names.** A Canadian client's registered "Centre" or "Harbour" is their name, not our prose. Spell it the way they spell it.
- **Verbatim quotes.** A client who wrote "organisation" in an email keeps it in the quote. The cleanup rule for quotes covers fillers and transcription artifacts, not spelling.
- **Vendor and NetSuite UI labels quoted as they appear.** Name the field the way the screen names it.

This is mechanically checked. The humanizer scanner's `spelling-en-us` rule flags British spellings, and the render gate blocks a deliverable render while any remain. An exempt hit is cleared by marking that line `copy-ignore`, the same marker the other copy rules use, and raising it at draft review.

Apply the rule to working notes too, not only the deliverable. A draft inherits the vocabulary of the evidence log it was built from.

## Length

Shorter is the goal, not a longer document that happens to be thorough. Longer does not mean higher quality; a 20-plus-page document does not get read.

- **Company understanding:** a short, factual overview of who they are and how they operate, then dive into the issues. One paragraph is the ceiling; describe the company, do not editorialize about the system.
- **Each pain point / work item:** two to three sentences of pain, then the recommendation. This is the historical Power Cloud house style: a comprehensive list of issues, each summarized tightly, not an essay per issue.
- **No repetition across sections.** The same problem must not be described in the executive summary, then the pain points, then the work items, then the phasing, each time re-explained. Say it once at full detail (in the work item), reference it elsewhere. If the reader meets the same problem three times, cut two.
- **Requested vs Identified must not duplicate.** The split is good commercial instinct, but if an item appears on both lists the reader meets it twice. De-duplicate: each concern appears once, labeled Requested or Identified, never both.

## Business overview (leads the document)

The document opens with this section. Research the client's public website first; this section is built from it, and it is required, not optional. Keep it factual: describe the company, not our opinion of their system. Structure:

- A "Who {Client} is" paragraph from their own site: founding year, founders/ownership, origin story, stated values (a short values quote is fine). The client should see themselves accurately described before they see their problems described.
- "How they operate today" as tight, tagged bullets: channels, fulfillment, integration layer, accounting.
- A short "verified scale" block: the few real numbers that land (order/customer/item counts, orders per day), tagged [Verified {date}].
- At most one plain clause noting the debt came from fast growth rather than a team that did not know what it was doing, and only if the section reads better with it. Not a paragraph, not the frame.

There is no narrative executive summary. The document order is: this Customer Summary, then a high-level NetSuite environment and tech-stack overview, then straight into the tasks (a table per process area, see Layout). The commercial roll-up (the phasing table, which carries per-phase hours as its own effort summary, the recommended first phase, and the single decision to start) comes after the tasks, not before them, so the reader reaches the work quickly. There is no separate consolidated per-item hours table; per-item LOE lives in the section tables and rolls up into the phasing table.

## Layout: a table per section, detail in a linked appendix

The body is a scannable menu; the detail is one click away. Do not write long prose per task in the body.

- **Tasks are presented as one table per process area** (Order to Cash, Procure to Pay, WMS, Record to Report, e-commerce, platform/cross-cutting), the taxonomy the client's NetSuite team thinks in. One section, one table.
- Each row is one task, short fields only: **ID, Issue (one line), Recommendation (one line), Priority (Immediate / Near-term / Planned), LOE**, plus the Requested/Identified and In-motion/Aligned tags where they apply. Every cell is a phrase or a single sentence; a table that tries to hold a paragraph gets jumbled, which is why the detail moves out.
- **The verbose description of each task lives in a linked appendix, not the body.** The row's ID links to its appendix entry. That entry carries the two-to-three-sentence pain, the proposed solution, the evidence, and any product-fit reasoning, and repeats the bolded **LOE: X hours** (or **LOE: TBD** with a scoped discovery number where the build is unconfirmed).
- This keeps the main document a scannable, actionable menu (a 20-plus-page wall of prose does not get read) while preserving full detail for anyone who wants it.

## Two deliverable modes (assessment vs implementation)

The engagement type (in CONTEXT.md) decides whether the document is commercial or a technical roadmap. The skill's Route first step is authoritative; the writing implication:
- **Commercial rapid assessment** (not yet under agreement for the work): includes the LOE column, the phasing table with hours, the recommended first phase and the single decision to start, and the billing section. Everything in these standards about LOE and the commercial roll-up applies.
- **Implementation roadmap / project plan** (customer already under agreement): omit LOE/pricing, the hours roll-up, the funding decision, and the billing section entirely, nothing here is being sold. Phasing is a project plan (milestones, sequencing, dependencies, target state each phase delivers). Same factual voice, same table-per-section-plus-linked-appendix layout, same no-judgment rules.

## Verification stays internal

Full evidence-tier discipline ([Verified] / [Reported] / [Inferred]) lives in `working/verification.md`, `working/evidence.md`, and the execution plan. It is how we know what we know; it is not client-facing furniture.

- **Do not** include a "what we could not verify and why" section in the client document. A catalog of what our tooling could not query reads as a limitation of us, not an insight for them, and it is often wrong (a bad query, not a real gap). Where a real gap exists, frame it as a next-step ("confirm X once we have production access"), not as a disclosure of tool blindness.
- In the client document, surface only the **three to five verified stats that land hardest** (e.g., "988,000 sales orders and roughly 1M cash sales in FY25," "returns are 7% of orders in NetSuite against 25-30% reported, because returns record in Loop and Amazon"). Those carry the credibility; the rest of the tier tags do not need to appear in the body.
- Keep the executive summary and all slides essentially tag-free.
- If the reviewer wants the full tier mapping in the client doc, it goes in an internal-style appendix, not the body. Default is: not in the client doc at all.

## No overreach; attribute the source

The failure that can blow up a deal: stating an inferred business conclusion as fact. On Shinesty the draft asserted the client was weighing **leaving NetSuite**, inferred from a pre-sale note about a renewal. It was never on the table, and it appeared on both the document and the deck. That sentence in front of the client backfires.

This section applies to **everything the client sees**: the document, the slides, and the deck speaker notes. The narrative liberty that speaker notes get on tone does not extend to inventing facts.

- Never state or imply a strategic conclusion about the client (considering leaving the platform, planning to replace a system, unhappy with a vendor) unless it was said explicitly. If it is an inference, it does not go in front of the client, on any surface.
- This includes importing the frame by negation. "We found nothing that requires leaving NetSuite" raises leaving unprompted even though it reassures; unless the client actually put staying-vs-leaving on the table, cut it or reframe positively without the counterfactual ("the custom build is worth keeping, and the work here makes it cheaper to run"). Same for "you are not a simple furniture store" style lines: assert what is true, do not smuggle in the thing you are denying.
- Every characterization of the client's situation must be traceable to a source: a transcript line, a verification query, or the public website. If asked "where did this come from," the answer cannot be "the model inferred it."
- When drafting and a claim rests on a thin inference, that is a cue to interview the consultant (see the skill's interview step), not to write it down and hope.
- Do not let two statements about the same fact contradict each other across the document or between the document and the deck (e.g., "RF-Smart is not used" in one place and "both systems actively maintained" in another). Resolve it or ask.

## Fast-follow / supplemental items

Not everything discussed belongs in the main work-item menu, and not everything is worth a full LOE. But a real item that is genuinely low priority should not vanish; it is future work and future revenue.

- Capture low-priority or "noted but not urgent" items in a short **fast-follow** section: a brief sentence each, no full detail, often no LOE. "We also noted X; worth revisiting once the foundation work lands."
- This keeps the main document focused on the big issues the client actually cares about now, while preserving the smaller ones to resurface later ("now that the priorities are done, here are the ten we flagged").
- A passing mention that may not be material is a fast-follow candidate, not a full work item, and not a silent omission.

## Quotes

- Quotes are verbatim in substance. Silently clean fillers and transcription artifacts (um, uh, repeated words, "Netswuite"); note once in the appendix that quotes are lightly edited for clarity. If a passage is garbled, paraphrase and mark it as a paraphrase.
- **Cap the quotes and never echo them back.** Reflecting a stack of the client's own quotes at them, one per slide or paragraph, is the failed-vendor pattern. Use a quote only where it adds something the paraphrase cannot: pain in the client's own words, tied to the finding on that slide/section. Two or three strong quotes across the whole deck; a handful across the document. A quote that just restates the heading is cut.
- Watch for quote drift in our own drafting: one person's "70% of my day" on one task must not become "staff spend 70% of their time" anywhere.
- Print quotes that describe system pain ("we are giving away money that we shouldn't be"). Never print a named executive criticizing their own past decisions, even when accurate; mirror that back in conversation, not in writing.

## Remote engagements: name it, and hedge the LOE honestly

When the engagement was remote rather than a multi-day onsite, say so and set expectations, rather than implying the same depth.

- The two offerings have fixed client-facing names: **Rapid Assessment** for the on-site format (two full days) and **Fast Track Discovery** for the remote one (roughly two-hour chunks). Never call remote work a Rapid Assessment. Use the right name, and state up front that some LOEs are non-final and several items are discovery-led. (This is true even after a full onsite, but it is more true remote.)
- This is a sales-conversation point too, but the document should not present remote-derived, discovery-led estimates as firm.

## Deck-specific (the presentation .pptx)

- **The two deliverables emphasize different things.** The deck is selective: it highlights the two or three most critical points and leads with impact. The document is complete and straightforward, and its emphasis is the phasing and recommended start, developed as a real plan of attack (phases with their tasks, the outcome each buys, dependencies, a named first phase and the single decision), not a terse roll-up. Do not make the deck exhaustive or the document punchy; each has its job.
- The deck is the meeting vehicle, not the document in slide form. One idea per slide, 10 to 15 slides.
- Put the real talking points in the **speaker notes**, not on the slide. Slides are concise bullets; the notes carry the rich detail so the presenter has a conversation, not a read-aloud. (Reading slides verbatim reads as low value and, worse, invites getting caught if a slide is wrong. The notes are there to be internalized and said in the presenter's own words.)
- Keep the deck tight: too many slides and multiple full pages of quotes are the two things to cut first.
- The cross-cutting rules above apply to the deck, not just the document: no overreach (the leaving-NetSuite error was a slide), verification stays internal (slides essentially tag-free, only the few verified stats that land), the quote cap (two or three across the whole deck), no banned filler, no em-dashes. The single deck-specific liberty is that speaker notes may be narrative; everything else holds.
- The deck follows the beat order who they are, what we heard, what we verified, what the status quo costs them, what we propose, how the engagement works, next steps. The "status quo costs" beat is a stack of the client's own reported incidents with real dollar figures; never invent an annualized cost number. The final slide makes exactly one ask (approve the first phase, grant production access); a list of ten open questions is homework, one decision is a close.
