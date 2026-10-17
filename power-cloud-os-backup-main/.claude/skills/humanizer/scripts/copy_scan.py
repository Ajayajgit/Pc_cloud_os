#!/usr/bin/env python3
"""copy_scan.py - deterministic scan for surface copy tells in prose.

Ported from devibe_scan.py in jcarterjohnson/vibecoded-design-tells (MIT),
narrowed to the four mechanical copy rules and adapted for prose files
(markdown, plain text, HTML) rather than web source. The fifth rule,
spelling-en-us, is a Power Cloud house rule, not part of the upstream port.

Catches the pattern-matchable slice of the surface layer:

  copy-em-dash      em dash in visible copy (the #1 cited writing tell, 7.1%)
  copy-antithesis   "it's not just X, it's Y" / "not only X but Y" (2.8%)
  hype-copy         marketing cliche vocabulary
  copy-servile      sycophantic openers and signposted wrap-ups
  spelling-en-us    British spelling where the house voice is US English

The cadence tells (uniform sentence rhythm, formulaic shape, polished-but-empty)
are NOT catchable here. See references/copy-tells.md and run the structural pass.

Usage:
  python3 copy_scan.py FILE [FILE ...]
  python3 copy_scan.py --html page.html       # strip tags first
  cat draft.md | python3 copy_scan.py -
  python3 copy_scan.py --json draft.md        # machine-readable output
  python3 copy_scan.py --strict draft.md      # exit 1 on any hit (hook-friendly)

Mark a line with `copy-ignore` to suppress it (intentional usage).
"""

import argparse
import html as html_mod
import json
import re
import sys

# --- US spelling: Power Cloud house rule, not part of the upstream port ---
# WRITING_STANDARDS.md fixes US English for everything client-facing. The -ise family is
# matched by shape and then filtered against an allowlist, rather than listed word by word,
# because the ones that actually leak are the words a model coins on the spot ("tokenise",
# "modularise"). The other families are short enough to list.

_ISE_OK_WORDS = """
advertise advise apprise arise chastise comprise compromise concise demise despise devise
disguise enterprise excise exercise expertise franchise improvise imprecise incise liaise
merchandise paradise precise premise promise reprise revise supervise surmise surprise
televise treatise
""".split()
# Any word ending in one of these is fine: otherwise, fundraising, freightwise, appraised.
_ISE_OK_TAILS = "wise raise guise cruise noise poise bruise".split()
_ISE_FORMS = "(?:e|es|ed|ing|er|ers|ement|ements)"
_ISE_ALLOW = "(?:%s)%s" % (
    "|".join([w[:-1] for w in _ISE_OK_WORDS] + ["[a-z]*" + t[:-1] for t in _ISE_OK_TAILS]),
    _ISE_FORMS,
)

_OUR_WORDS = """
colour behaviour favour labour honour harbour neighbour rumour humour odour vapour
endeavour flavour savour saviour demeanour candour clamour rigour vigour parlour tumour
armour valour splendour
""".split()
_RE_WORDS = "centre metre theatre fibre litre calibre lustre spectre sombre".split()
# "cancelled" is deliberately absent: it is an accepted US variant and a NetSuite UI label.
_MISC_WORDS = """
licence licences defence defences offence offences pretence practise practises practised
practising catalogue catalogues catalogued cataloguing analogue analogues programme
programmes grey whilst amongst learnt cheque cheques ageing judgement judgements
acknowledgement acknowledgements enrolment enrolments fulfil fulfils fulfilment fulfilments
instalment instalments skilful wilful travelled travelling traveller travellers modelling
modelled labelled labelling marvellous counsellor counsellors fuelled fuelling signalled
signalling totalled totalling levelled levelling speciality specialities artefact artefacts
aluminium sulphur jewellery storey storeys tyre tyres kerb kerbs draught draughts plough
mould moulds moulding manoeuvre manoeuvres sceptic sceptical scepticism focussed focussing
maths
""".split()

RULES = [
    {
        "id": "copy-em-dash",
        "label": "Em dash in copy (the #1 'AI wrote this' writing tell)",
        "fix": "Use a comma, a period, or parentheses. Not a colon; that gets flagged too.",
        "pats": [r"\w\s*—\s*\w", r"\w\s*&mdash;\s*\w"],
        # Skip code, code comments, and fenced blocks: not user-facing copy.
        "suppress": r"^\s*(\*|//|/\*|<!--|#|>|\||```)|`[^`]*—[^`]*`",
    },
    {
        "id": "copy-antithesis",
        "label": 'The "it\'s not just X, it\'s Y" sentence (the AI accent)',
        "fix": "State the thing plainly. Lead with the real claim and drop the negation.",
        "pats": [
            r"(it'?s |it |that'?s )?\bnot just\b[^.,;!?]{1,40},?\s*(it'?s|but)\b",
            r"\b(?:isn'?t|aren'?t|wasn'?t|weren'?t)\s+just\b[^.,;!?]{1,40},?\s*(?:it'?s|they'?re|but)\b",
            r"\bnot only\b[^.,;!?]{1,40},?\s*but\b",
        ],
    },
    {
        "id": "hype-copy",
        "label": "AI marketing-copy cliche",
        "fix": "Write what the thing literally does, in plain words, with a checkable claim.",
        "pats": [
            r"\bTransform your\b", r"\bSupercharge\b", r"\bUnleash\b",
            r"\bEffortlessly\b", r"\breimagined\b",
            r"take (your |it |things )?[^.]{0,30}to the next level",
            r"\bGame-?changer\b", r"\bunlock (your |the )?(full )?potential\b",
            r"\b(deep[- ]dive|dive in|let'?s dive)\b", r"\bdelve\b",
            r"\belevate your\b", r"\bin today'?s (fast-paced|digital) world\b",
            r"\bworld-class\b", r"\bcutting-edge\b", r"\brevolutionary\b",
            r"\bbest-in-class\b",
        ],
    },
    {
        "id": "copy-servile",
        "label": "Sycophantic opener / signposted wrap-up",
        "fix": "Start on the real point and end on the real point. Cut the framing.",
        "pats": [
            r"\bGreat question\b", r"\bI hope this helps\b",
            r"\bIn conclusion\b", r"\bIn summary\b",
        ],
    },
    {
        "id": "spelling-en-us",
        "label": "British spelling (the house voice is US English)",
        "fix": ("Use the US form: -ize / -ization, -yze, -or, -er, -ense, single-l past tense. "
                "Proper nouns and legal entity names, verbatim client quotes, and vendor UI "
                "labels quoted as they appear are exempt: mark that line `copy-ignore`."),
        "pats": [
            r"\b[A-Za-z]{3,}is(?:e|es|ed|ing|ation|ations|er|ers|able)\b",
            # analyse, paralyse. Not "analyses", which is also the US plural of "analysis".
            r"\b[A-Za-z]{2,}lys(?:e|ed|ing|er|ers)\b",
            r"\b[A-Za-z]*(?:%s)[a-z]*\b" % "|".join(_OUR_WORDS),
            r"\b[A-Za-z]*(?:%s)[a-z]*\b" % "|".join(_RE_WORDS),
            r"\b(?:%s)\b" % "|".join(_MISC_WORDS),
            r"\bper cent\b",
        ],
        "allow": _ISE_ALLOW,
    },
]

TAG_RE = re.compile(r"<[^>]+>")


def compile_rules():
    out = []
    for r in RULES:
        out.append({
            **r,
            "re": [re.compile(p, re.I) for p in r["pats"]],
            "suppress_re": re.compile(r["suppress"], re.I) if r.get("suppress") else None,
            "allow_re": re.compile(r["allow"], re.I) if r.get("allow") else None,
        })
    return out


def strip_html(text):
    text = re.sub(r"(?is)<(script|style)\b.*?</\1>", " ", text)
    return html_mod.unescape(TAG_RE.sub(" ", text))


def scan(text, rules, path):
    hits = []
    for lineno, line in enumerate(text.splitlines(), 1):
        if "copy-ignore" in line:
            continue
        for rule in rules:
            if rule["suppress_re"] and rule["suppress_re"].search(line):
                continue
            hit = None
            for pat in rule["re"]:
                # finditer, not search: an allowed word must not mask a real hit later on
                # the same line ("otherwise we authorise it").
                for m in pat.finditer(line):
                    if rule["allow_re"] and rule["allow_re"].fullmatch(m.group(0)):
                        continue
                    hit = m
                    break
                if hit:
                    break
            if hit:
                hits.append({
                    "file": path,
                    "line": lineno,
                    "id": rule["id"],
                    "label": rule["label"],
                    "fix": rule["fix"],
                    "match": hit.group(0).strip()[:80],
                    "text": line.strip()[:120],
                })
    return hits


def main():
    ap = argparse.ArgumentParser(description="Scan prose for surface copy tells.")
    ap.add_argument("files", nargs="+", help="files to scan, or - for stdin")
    ap.add_argument("--html", action="store_true", help="strip HTML tags before scanning")
    ap.add_argument("--json", action="store_true", help="machine-readable output")
    ap.add_argument("--strict", action="store_true", help="exit 1 if any tell is found")
    args = ap.parse_args()

    rules = compile_rules()
    all_hits = []

    for path in args.files:
        if path == "-":
            text, label = sys.stdin.read(), "<stdin>"
        else:
            try:
                with open(path, encoding="utf-8") as fh:
                    text = fh.read()
            except OSError as exc:
                print(f"skip {path}: {exc}", file=sys.stderr)
                continue
            label = path
        if args.html or path.endswith((".html", ".htm")):
            text = strip_html(text)
        all_hits.extend(scan(text, rules, label))

    if args.json:
        print(json.dumps({"hits": all_hits, "count": len(all_hits)}, indent=2))
    elif not all_hits:
        print("clean: no mechanical copy tells found.")
        print("Cadence tells still need your eyes. See references/copy-tells.md.")
    else:
        by_rule = {}
        for h in all_hits:
            by_rule.setdefault(h["id"], []).append(h)
        for rid, hits in sorted(by_rule.items(), key=lambda kv: -len(kv[1])):
            print(f"\n{rid}  ({len(hits)} hit{'s' if len(hits) != 1 else ''})")
            print(f"  {hits[0]['label']}")
            print(f"  fix: {hits[0]['fix']}")
            for h in hits[:12]:
                print(f"    {h['file']}:{h['line']}  [{h['match']}]  {h['text']}")
            if len(hits) > 12:
                print(f"    ... and {len(hits) - 12} more")
        print(f"\ntotal: {len(all_hits)} hits across {len(by_rule)} categories")
        print("Cadence tells are not scannable. See references/copy-tells.md.")

    if args.strict and all_hits:
        sys.exit(1)


if __name__ == "__main__":
    main()
