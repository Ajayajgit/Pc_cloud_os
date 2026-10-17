---
date: 2026-09-15
from: mike
source: Nation's Best Sports
area: POWERCLOUD_BRAND_GUIDELINES.md
type: bug
cost: -
blocking: no
frequency: every-time
class: wrong
autonomy: n-a
status: new
---

## What happened
[Verified] The Electric Blue hex value in `POWERCLOUD_BRAND_GUIDELINES.md` contains a **Cyrillic
capital DE (U+0414)** where the hex digit `D` belongs. It is not a valid hex color and will fail
in any tool that parses it.

Two occurrences, both wrong the same way:
- **Line 98**, Secondary Colors table: `` `#6EEAД8` ``
- **Line 272**, Quick Reference Cheatsheet: `ELECTRIC BLUE:    #6EEAД8`

Codepoints of the string are `23 36 45 45 41 0414 38`. The `0414` is the defect.

**The correct value is `#6EEAD8`**, confirmed by the RGB column on the same table row:
`R:110 G:234 B:216`, which is exactly `6E EA D8`. So the fix needs no design decision, just the
right character.

Not blocking this session. Electric Blue is a secondary accent and the deck did not use it, so the
bug was found by reading the palette rather than by a render failing. It would have surfaced as a
crash or a silently wrong color the first time anyone pasted that value into python-pptx,
python-docx, CSS, or a design tool.

Confirmed the bad value appears nowhere else in the OS: a recursive grep for `6EEA` across all
markdown returns only this file, so no other reference file has inherited it.

This is the kind of defect that survives indefinitely because it is invisible to a human reader.
The Cyrillic Д is visually near-identical to a Latin D at normal text size, and the file is
otherwise correct, so nobody proofreading it would catch it.

## What I did instead
Nothing was needed. The deck used Deep Blue, Sky Blue, Grass Green, Fresh Yellow, Matte Black and
the light-theme neutrals, none of which are affected. Flagged it rather than editing the file,
since brand guidelines are a shared reference and a silent fix to a color value is the kind of
change that should be visible.

## Suggested fix
- [Reported] Mike: not specified; agreed it was worth logging when Claude raised it.
- [Inferred] Claude: replace the Cyrillic Д with an ASCII `D` on both lines 98 and 272, giving
  `#6EEAD8`. One-line fix, no decision required, and the RGB triplet already in the file verifies
  it. Offered to make the edit in-session.
- [Inferred] Claude, prevention: this class of bug (a homoglyph inside a machine-readable value in
  a reference file) is cheap to catch and impossible to spot by eye. A validator over the root
  reference files that asserts every `#RRGGBB` is six ASCII hex digits, and that any accompanying
  RGB triplet agrees with it, would catch this one and any future paste of the same kind. It could
  live alongside the existing `.claude/scripts/` tooling and run with the index rebuilds. Worth it
  only if other reference files carry machine-readable values too; low priority otherwise.

## Disposition
