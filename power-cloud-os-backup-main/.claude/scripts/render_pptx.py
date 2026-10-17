# -*- coding: utf-8 -*-
"""Render a presentation deck draft (slide markdown) into a branded .pptx.

Canonical renderer, consolidated 2026-08-16 from Teppermans Rapid Assessment/
working/render_pptx.py (the only deck renderer at the time), generalized: client
name, logo, and paths are parameters; logo dimensions come from PIL instead of
hardcoded pixel sizes. Brand values follow POWERCLOUD_BRAND_GUIDELINES.md.

Run from the client folder:

    python "../.claude/scripts/render_pptx.py" --md working/draft_proposal_deck.md ^
        --out "deliverables/Client_Presentation_2026-01-01.pptx" ^
        --client "Client Name" --client-logo source/Logo.png ^
        --engagement "NetSuite Rapid Assessment"

Slide markdown format (one block per slide):

    ## Slide 1 - Title
    Title: unused on the title slide; first bullets become the title lines
    - Client Name
    - NetSuite Rapid Assessment
    - Prepared by Power Cloud Consulting

    ## Slide 2 - What we heard
    Kicker: Discovery  ·  What we heard      (optional spaced-caps line above the title)
    Title: What we heard
    - First bullet
    - Second bullet
    Featured stat: 3,100 orders/day through a manual step
    Featured quote: "their words here"
    Speaker notes: narrative script for the presenter
    Layout: (ignored)

A content slide may also carry a markdown table (added 2026-09-08 for the
per-project timeline and investment slides on a sales deck). Rows start with
"|", the first row is the header, and the |---| separator row is ignored:

    | Phase | Weeks | Est. hours |
    |---|---|---|
    | Discovery | 2 | 20-30 |

Bullets on a table slide render as a compact strip above the table.

Visual blocks (added 2026-09-08, after a sales deck came back as "too text
heavy"): a content slide may carry any of these, laid out top to bottom in the
order they first appear, with bullets rendered compact when a visual is present.

    Flow: Email arrives | caption -> AI drafts the order | caption -> Rep approves | caption
    Stat: 96% | of freight is pallets on LTL        (one line per tile, 3 to 5 tiles)
    Card: Native first | Configure what NetSuite already does    (one line per card, 2 to 5)
    Gantt axis: 24
    Gantt: Executive assistant | 0 | 6 | Live week 4     (label | start week | end week | bar text)
    Gantt: Executive assistant | 0 | 8 | Live week 6 | 24   (optional fifth field: a lighter tail to that week)
    Gantt marker: 25 | All four live | Iteration, learning, new features   (green rule, shaded region to its right)

Flow steps are Deep Blue boxes joined by Sky Blue arrows with grey captions;
stats are Deep Blue tiles with a large number; cards are light panels with a
Sky Blue bar; the Gantt is Sky Blue bars on a week grid.

Everything under "## Notes for the renderer" is ignored. First slide renders as
the dark title slide, last slide as the dark closing slide, the rest as content
slides. Tier tags are colored but slides should be essentially tag-free
(WRITING_STANDARDS). After rendering, export slides to PNG (export_pdf.py --png)
and inspect visually before delivering.
"""
import argparse
import re
import sys
from pathlib import Path

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml.ns import qn

OS_ROOT = Path(__file__).resolve().parents[2]
PC_LOGO = OS_ROOT / "logos" / "Powercloud_Logo-01.png"

DEEP = RGBColor(0x00, 0x2F, 0x59)
SKY = RGBColor(0x31, 0xA4, 0xF3)
GREEN = RGBColor(0x41, 0xB9, 0x46)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
BLACK = RGBColor(0x1E, 0x1E, 0x1E)
GREY = RGBColor(0x70, 0x70, 0x70)
LIGHT = RGBColor(0xEA, 0xF4, 0xFC)
WATERMARK = RGBColor(0xD3, 0xE8, 0xF8)  # pale Sky Blue tint for numerals behind card text
SKY_TINT = RGBColor(0xA9, 0xD6, 0xF9)   # lighter Sky Blue for a Gantt continuation tail
HEAD, BODY = "Montserrat", "Barlow"
SW, SH = 13.333, 7.5

TIER_RE = re.compile(r'(\[(?:Verified|Reported|Inferred)[^\]]*\])')


def tier_color(t):
    if t.startswith('[Verified'):
        return GREEN
    if t.startswith('[Reported'):
        return SKY
    return GREY


def image_size(path):
    """Pixel dimensions via PIL; deck logos scale by aspect ratio."""
    from PIL import Image
    with Image.open(path) as im:
        return im.size


def set_font(run, name, size, color, bold=False, italic=False):
    run.font.name = name
    run.font.size = Pt(size)
    run.font.color.rgb = color
    run.font.bold = bold
    run.font.italic = italic
    rPr = run._r.get_or_add_rPr()
    for tag in ('a:latin', 'a:cs'):
        e = rPr.find(qn(tag))
        if e is None:
            e = rPr.makeelement(qn(tag), {})
            rPr.append(e)
        e.set('typeface', name)


def add_runs(p, text, name, size, color, bold=False):
    for part in re.split(r'(\*\*.*?\*\*)', text):
        if not part:
            continue
        b, seg = bold, part
        if part.startswith('**') and part.endswith('**'):
            b, seg = True, part[2:-2]
        for t in TIER_RE.split(seg):
            if not t:
                continue
            r = p.add_run()
            r.text = t
            if TIER_RE.match(t):
                set_font(r, name, size * 0.8, tier_color(t), bold=True)
            else:
                set_font(r, name, size, color, bold=b)


class DeckBuilder:
    def __init__(self, args):
        self.args = args
        self.prs = Presentation()
        self.prs.slide_width = Inches(SW)
        self.prs.slide_height = Inches(SH)
        self.blank = self.prs.slide_layouts[6]
        self.footer_text = (f"Power Cloud Consulting   |   {args.client} "
                            f"{args.engagement}   |   Confidential")
        self.client_logo = Path(args.client_logo) if args.client_logo else None
        if self.client_logo and not self.client_logo.exists():
            print(f"warning: client logo not found at {self.client_logo}; omitting")
            self.client_logo = None

    def rect(self, slide, l, t, w, h, fill, rounded=False):
        shp = slide.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE if rounded else MSO_SHAPE.RECTANGLE,
            Inches(l), Inches(t), Inches(w), Inches(h))
        shp.fill.solid()
        shp.fill.fore_color.rgb = fill
        shp.line.fill.background()
        shp.shadow.inherit = False
        return shp

    def textbox(self, slide, l, t, w, h, anchor=MSO_ANCHOR.TOP):
        tb = slide.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(h))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.vertical_anchor = anchor
        tf.margin_left = Inches(0.05)
        tf.margin_right = Inches(0.05)
        tf.margin_top = Inches(0.02)
        tf.margin_bottom = Inches(0.02)
        return tf

    def img(self, slide, path, l, t, w):
        pw, ph = image_size(path)
        h = w * ph / pw
        slide.shapes.add_picture(str(path), Inches(l), Inches(t), Inches(w), Inches(h))
        return h

    def footer(self, slide, n):
        self.rect(slide, 0, SH - 0.42, SW, 0.42, LIGHT)
        tf = self.textbox(slide, 0.5, SH - 0.42, 9, 0.42, MSO_ANCHOR.MIDDLE)
        add_runs(tf.paragraphs[0], self.footer_text, BODY, 8.5, GREY)
        tf2 = self.textbox(slide, SW - 1.2, SH - 0.42, 0.7, 0.42, MSO_ANCHOR.MIDDLE)
        p = tf2.paragraphs[0]
        p.alignment = PP_ALIGN.RIGHT
        add_runs(p, str(n), BODY, 9, GREY)

    def logo_band(self, s):
        """White band along the bottom of dark slides: client left, Power Cloud right."""
        self.rect(s, 0, SH - 1.2, SW, 1.2, WHITE)
        if self.client_logo:
            # scale to band height, capped at 2.7in wide
            pw, ph = image_size(self.client_logo)
            w = min(2.7, 0.6 * pw / ph)
            self.img(s, self.client_logo, 0.9, SH - 0.6 - (w * ph / pw) / 2, w)
        if PC_LOGO.exists():
            pw, ph = image_size(PC_LOGO)
            w = min(1.9, 0.9 * pw / ph)
            self.img(s, PC_LOGO, SW - w - 0.8, SH - 0.6 - (w * ph / pw) / 2, w)

    def title_slide(self, lines):
        s = self.prs.slides.add_slide(self.blank)
        self.rect(s, 0, 0, SW, SH, DEEP)
        self.rect(s, 0, 0, SW, 0.28, GREEN)
        tf = self.textbox(s, 1.0, 1.9, 11.3, 3.0)
        add_runs(tf.paragraphs[0], lines[0], HEAD, 42, WHITE, bold=True)
        if len(lines) > 1:
            p = tf.add_paragraph()
            p.space_before = Pt(12)
            add_runs(p, lines[1], HEAD, 22, SKY, bold=True)
        for extra in lines[2:]:
            p = tf.add_paragraph()
            p.space_before = Pt(8)
            add_runs(p, extra, BODY, 16, WHITE)
        self.logo_band(s)
        return s

    def closing_slide(self, title, bullets, featured):
        s = self.prs.slides.add_slide(self.blank)
        self.rect(s, 0, 0, SW, SH, DEEP)
        self.rect(s, 0, 0, 0.28, SH, GREEN)
        tf = self.textbox(s, 1.0, 0.9, 11.2, 4.9)
        add_runs(tf.paragraphs[0], title, HEAD, 28, WHITE, bold=True)
        for b in bullets:
            p = tf.add_paragraph()
            p.space_before = Pt(8)
            r = p.add_run()
            r.text = "▪  "
            set_font(r, BODY, 16, SKY, bold=True)
            add_runs(p, b, BODY, 16, WHITE)
        if featured:
            p = tf.add_paragraph()
            p.space_before = Pt(12)
            add_runs(p, featured[1], HEAD, 14, GREEN, bold=True)
        self.logo_band(s)
        return s

    def table(self, slide, rows, l, t, w, max_h):
        """Branded table: Deep Blue header row, zebra body, Barlow text.

        rows[0] is the header. Column widths follow the header's relative
        text length, floored so narrow numeric columns stay readable. Font
        size steps down as the row count grows so the table stays inside
        max_h; the caller decides where it sits relative to the bullets.
        """
        n_rows, n_cols = len(rows), max(len(r) for r in rows)
        rows = [r + [""] * (n_cols - len(r)) for r in rows]
        size = 13 if n_rows <= 5 else 12 if n_rows <= 7 else 11
        row_h = min(0.42, max_h / n_rows)
        shp = slide.shapes.add_table(n_rows, n_cols, Inches(l), Inches(t),
                                     Inches(w), Inches(row_h * n_rows))
        tbl = shp.table
        # column widths: weight by the longest cell in each column, floor 1.1in;
        # the first column (labels) may take up to 4in, the rest cap at 2.6in so
        # one long cell does not swallow the row
        weights = [max(1.1, min(4.0 if c == 0 else 2.6, max(len(r[c]) for r in rows) * 0.11))
                   for c in range(n_cols)]
        scale = w / sum(weights)
        for c in range(n_cols):
            tbl.columns[c].width = Inches(weights[c] * scale)
        for ri, row in enumerate(rows):
            tbl.rows[ri].height = Inches(row_h)
            for ci, val in enumerate(row):
                cell = tbl.cell(ri, ci)
                cell.margin_left = cell.margin_right = Inches(0.08)
                cell.margin_top = cell.margin_bottom = Inches(0.03)
                cell.vertical_anchor = MSO_ANCHOR.MIDDLE
                cell.fill.solid()
                if ri == 0:
                    cell.fill.fore_color.rgb = DEEP
                else:
                    cell.fill.fore_color.rgb = LIGHT if ri % 2 == 0 else WHITE
                tf = cell.text_frame
                tf.word_wrap = True
                p = tf.paragraphs[0]
                if ri == 0:
                    add_runs(p, val, HEAD, size - 1, WHITE, bold=True)
                else:
                    total = row[0].strip().lower().startswith("total")
                    add_runs(p, val, BODY, size, BLACK, bold=total)
        return shp

    # ---- visual blocks (added 2026-09-08: sales decks need diagrams, not bullet stacks)

    def _label(self, slide, text, l, t, w, h, font, size, color, bold=False,
               align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE):
        tf = self.textbox(slide, l, t, w, h, anchor)
        p = tf.paragraphs[0]
        p.alignment = align
        add_runs(p, text, font, size, color, bold=bold)
        return tf

    def flow(self, slide, steps, l, t, w, h):
        """Horizontal process flow in the deck's panel language: light panels
        (Sky Blue top bar, Deep Blue step title, accent rule, grey caption, a
        pale step numeral watermarked at the foot) joined by Sky Blue arrows.
        steps = [(label, caption), ...]."""
        n = len(steps)
        arrow_w, gap = 0.34, 0.1
        box_w = (w - (n - 1) * (arrow_w + 2 * gap)) / n
        box_h = h
        scale = min(1.25, max(1.0, h / 2.4))
        t_size = (14 if n <= 4 else 13) * scale
        c_size = (12 if n <= 4 else 11.5) * scale
        pad = 0.14
        # one title height for the whole flow, sized to the longest label, so the
        # accent rules and captions line up across the steps
        title_h = 0.62 * scale + (0.3 if max(len(s[0]) for s in steps) > 18 else 0)
        # caption type steps down (to 9.5pt) until the longest caption fits the
        # room under the title, so a squeezed flow shrinks its type, not the panel
        cap_room = h - title_h - 0.62
        longest = max((len(c) for _, c in steps), default=0)
        while c_size > 9.5:
            cpl = max(10, int((box_w - 0.28) * 114 / c_size))
            if -(-longest // cpl) * (c_size * 1.3 / 72) <= cap_room:
                break
            c_size -= 0.5
        for i, (label, caption) in enumerate(steps):
            x = l + i * (box_w + arrow_w + 2 * gap)
            self.rect(slide, x, t, box_w, box_h, LIGHT, rounded=False)
            self.rect(slide, x, t, box_w, 0.09, SKY)
            if h > 2.4:
                wm_h = min(1.9, h * 0.42)
                self._label(slide, str(i + 1), x - 0.02, t + h - wm_h + 0.3, box_w - 0.05, wm_h,
                            HEAD, int(wm_h * 64), WATERMARK, bold=True,
                            align=PP_ALIGN.RIGHT, anchor=MSO_ANCHOR.BOTTOM)
            self._label(slide, label, x + pad, t + 0.2, box_w - 2 * pad, title_h, HEAD,
                        t_size, DEEP, bold=True, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP)
            self.rect(slide, x + pad, t + 0.32 + title_h, 0.5, 0.045, SKY)
            if caption:
                self._label(slide, caption, x + pad, t + 0.5 + title_h, box_w - 2 * pad,
                            h - title_h - 0.6, BODY, c_size, GREY, align=PP_ALIGN.LEFT,
                            anchor=MSO_ANCHOR.TOP)
            if i < n - 1:
                ar = slide.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW,
                                            Inches(x + box_w + gap), Inches(t + box_h / 2 - 0.16),
                                            Inches(arrow_w), Inches(0.32))
                ar.fill.solid()
                ar.fill.fore_color.rgb = SKY
                ar.line.fill.background()
                ar.shadow.inherit = False

    def stats(self, slide, tiles, l, t, w, h):
        """Row of Deep Blue tiles: a big Montserrat number over a short caption.
        tiles = [(number, caption), ...]."""
        # Same panel language as cards: light panel, Sky Blue top bar, the number
        # as the hero in Deep Blue, a short accent rule, then a grey caption.
        n = len(tiles)
        gap = 0.2
        tile_w = (w - (n - 1) * gap) / n
        scale = min(1.3, max(1.0, h / 1.6))
        num_size = (34 if n <= 4 else 28) * scale
        cap_size = (12.5 if n <= 4 else 11.5) * min(scale, 1.15)
        pad = 0.15
        for i, (num, cap) in enumerate(tiles):
            x = l + i * (tile_w + gap)
            self.rect(slide, x, t, tile_w, h, LIGHT, rounded=False)
            self.rect(slide, x, t, tile_w, 0.09, SKY)
            num_h = 0.36 * h + 0.2
            # a long "number" such as "5 to 7 days" steps down so it stays on one line
            fit = num_size if len(num) <= 5 else num_size * max(0.55, 5.5 / len(num))
            self._label(slide, num, x + pad, t + 0.15, tile_w - 2 * pad, num_h, HEAD,
                        fit, DEEP, bold=True, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.BOTTOM)
            self.rect(slide, x + pad, t + 0.22 + num_h, 0.55, 0.045, SKY)
            self._label(slide, cap, x + pad, t + 0.38 + num_h, tile_w - 2 * pad,
                        h - num_h - 0.45, BODY, cap_size, GREY, align=PP_ALIGN.LEFT,
                        anchor=MSO_ANCHOR.TOP)

    def cards(self, slide, cards, l, t, w, h):
        """Row of light cards with a Sky Blue top bar, a Montserrat title and a
        short Barlow description. cards = [(title, text), ...]."""
        n = len(cards)
        gap = 0.2
        card_w = (w - (n - 1) * gap) / n
        # type scales with the room the card has: a lone card row on a slide
        # (h around 4.5in) reads at 18/15pt, a strip under a flow at 13/12pt
        scale = min(1.4, max(1.0, h / 2.2))
        t_size = (13 if n <= 4 else 12) * scale
        b_size = (12 if n <= 4 else 11) * scale
        pad = 0.12 * scale
        title_h = 0.5 * scale
        # fit check: shrink the body type (and then the scale) until the longest
        # card text fits under its title, so styled cards never spill their panel
        longest = max((len(t_) for _, t_ in cards), default=0)
        max_title_lines = max((-(-len(ti) // max(8, int((card_w - 2 * pad) * 114 / t_size)))
                               for ti, _ in cards), default=1)
        while b_size > 10:
            title_block = 0.2 + max_title_lines * (t_size * 1.25 / 72) + 0.45
            cpl = max(10, int((card_w - 2 * pad) * 114 / b_size))
            if -(-longest // cpl) * (b_size * 1.32 / 72) <= h - title_block - 0.2:
                break
            b_size -= 0.5
            if b_size < 12 * scale * 0.85 and t_size > 12:
                t_size -= 0.5
        title_h = max(0.5, max_title_lines * (t_size * 1.25 / 72)) + 0.05
        tall = h > 2.3  # enough room for the styled treatment (accent rule, bold rule)
        watermark = h > 2.9  # and for the numeral behind the text
        for i, (title, text) in enumerate(cards):
            x = l + i * (card_w + gap)
            self.rect(slide, x, t, card_w, h, LIGHT, rounded=False)
            self.rect(slide, x, t, card_w, 0.09, SKY)
            if watermark:
                # watermark step number: oversized, pale, behind the text
                # Montserrat numerals carry internal leading, so the box runs past
                # the card foot to sit the glyph on the bottom edge
                wm_h = min(2.2, h * 0.45)
                self._label(slide, str(i + 1), x - 0.02, t + h - wm_h + 0.35, card_w - 0.05, wm_h,
                            HEAD, int(wm_h * 64), WATERMARK, bold=True,
                            align=PP_ALIGN.RIGHT, anchor=MSO_ANCHOR.BOTTOM)
            self._label(slide, title, x + pad, t + 0.18, card_w - 2 * pad, title_h + 0.3, HEAD,
                        t_size, DEEP, bold=True, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP)
            body_top = t + 0.5 + title_h
            if tall:
                # short accent rule under the title, then the body starts lower
                self.rect(slide, x + pad, body_top - 0.02, 0.55, 0.045, SKY)
                body_top += 0.25
            if text and tall:
                # first sentence is the rule (bold, Deep Blue), the rest is the
                # reason (regular, grey)
                first, sep, rest = text.partition('. ')
                tf = self.textbox(slide, x + pad, body_top, card_w - 2 * pad,
                                  h - (body_top - t) - 0.2)
                p = tf.paragraphs[0]
                p.line_spacing = 1.12
                add_runs(p, first + ('.' if sep else ''), BODY, b_size, DEEP, bold=True)
                if rest:
                    p2 = tf.add_paragraph()
                    p2.space_before = Pt(6)
                    p2.line_spacing = 1.12
                    add_runs(p2, rest, BODY, b_size - 1, GREY)
            elif text:
                self._label(slide, text, x + pad, body_top, card_w - 2 * pad,
                            h - (body_top - t) - 0.1, BODY, b_size, BLACK,
                            align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP)

    def gantt(self, slide, rows, l, t, w, h, axis_weeks=None, marker=None):
        """Week-based timeline bars. rows = [(label, start, end, note[, tail]), ...];
        weeks are ints, the axis runs from week 0 to axis_weeks (default: the
        latest end, rounded up to a multiple of 4). marker = (week, label,
        region_label) draws a Grass Green rule at that week with the label above
        it and lightly shades everything to its right (the region label sits in
        the shaded area), for "all live, iteration from here" moments."""
        ends = [int(r[2]) for r in rows]
        axis = axis_weeks or (-(-max(ends) // 4) * 4)
        label_w = 2.6
        chart_l, chart_w = l + label_w, w - label_w
        head = 0.38 if marker else 0.0  # room for the marker label above the rows
        row_h = min(0.7, (h - 0.45 - head) / len(rows))
        rows_h = row_h * len(rows)
        t = t + head
        if marker:
            m_week, m_label, m_region = marker
            mx = chart_l + chart_w * int(m_week) / axis
            # shaded iteration region behind everything to the right of the rule
            self.rect(slide, mx, t - 0.05, chart_l + chart_w - mx, rows_h + 0.1, LIGHT)
        # grid and axis labels every 4 weeks
        for wk in range(0, axis + 1, 4):
            x = chart_l + chart_w * wk / axis
            self.rect(slide, x, t, 0.01, rows_h, WATERMARK)
            self._label(slide, f"Wk {wk}", x - 0.4, t + rows_h + 0.05, 0.8, 0.3,
                        BODY, 10, GREY)
        if marker:
            self.rect(slide, mx - 0.015, t - 0.05, 0.03, rows_h + 0.1, GREEN)
            # marker label ends just left of the rule; region label starts just right of it
            self._label(slide, m_label, mx - 3.3, t - head - 0.02, 3.2, 0.34, HEAD, 10.5, GREEN,
                        bold=True, align=PP_ALIGN.RIGHT)
            if m_region:
                self._label(slide, m_region, mx + 0.1, t - head - 0.02,
                            max(1.0, chart_l + chart_w - mx - 0.1 + 0.4), 0.34, BODY, 10.5, GREY,
                            align=PP_ALIGN.LEFT)
        for i, row in enumerate(rows):
            label, start, end = row[0], int(row[1]), int(row[2])
            note = row[3] if len(row) > 3 else ""
            tail = int(row[4]) if len(row) > 4 and str(row[4]).strip() else None
            y = t + i * row_h
            self._label(slide, label, l, y, label_w - 0.15, row_h, BODY, 12.5, BLACK,
                        bold=True, align=PP_ALIGN.LEFT)
            bx = chart_l + chart_w * start / axis
            bw = max(0.25, chart_w * (end - start) / axis)
            if tail and tail > end:
                # lighter continuation: the work keeps going (learning, expansion)
                # after the build is live, drawn under the main bar so it reads as a tail
                tx = chart_l + chart_w * end / axis
                tw_ = chart_w * (min(tail, axis) - end) / axis
                self.rect(slide, tx - 0.1, y + row_h * 0.3, tw_ + 0.1, row_h * 0.4, SKY_TINT,
                          rounded=True)
            bar = self.rect(slide, bx, y + row_h * 0.22, bw, row_h * 0.56, SKY, rounded=True)
            if note:
                tf = bar.text_frame
                tf.margin_left = Inches(0.08)
                tf.vertical_anchor = MSO_ANCHOR.MIDDLE
                p = tf.paragraphs[0]
                p.alignment = PP_ALIGN.LEFT
                add_runs(p, note, BODY, 10.5, WHITE, bold=True)

    def content_slide(self, title, bullets, featured, n, blocks=None, kicker=None):
        """Content slide: title band (optional spaced-caps kicker over the
        headline), then the blocks in draft order (bullets, table, flow, stats,
        cards, gantt), then the optional featured box."""
        s = self.prs.slides.add_slide(self.blank)
        self.rect(s, 0, 0, SW, SH, WHITE)
        self.rect(s, 0, 0, SW, 1.15, DEEP)
        self.rect(s, 0, 1.15, SW, 0.10, SKY)
        if kicker:
            # letterspaced caps in Sky Blue, echoing the "CONSULTING" mark
            ktf = self.textbox(s, 0.55, 0.13, 12.2, 0.32, MSO_ANCHOR.MIDDLE)
            add_runs(ktf.paragraphs[0], kicker.upper(), HEAD, 11, SKY, bold=True)
            for r in ktf.paragraphs[0].runs:
                r._r.get_or_add_rPr().set('spc', '300')
            tf = self.textbox(s, 0.55, 0.42, 12.2, 0.68, MSO_ANCHOR.MIDDLE)
            add_runs(tf.paragraphs[0], title, HEAD, 24, WHITE, bold=True)
        else:
            tf = self.textbox(s, 0.55, 0.12, 12.2, 0.95, MSO_ANCHOR.MIDDLE)
            add_runs(tf.paragraphs[0], title, HEAD, 26, WHITE, bold=True)
        blocks = list(blocks or [])
        if bullets and not any(b[0] == 'bullets' for b in blocks):
            blocks.insert(0, ('bullets', bullets))
        visual = any(b[0] != 'bullets' for b in blocks)
        top, bottom = 1.55, (5.85 if featured else SH - 0.6)
        gap = 0.25

        # natural height per block; the table absorbs whatever is left
        def natural(kind, data):
            if kind == 'bullets':
                if not visual:
                    return bottom - top
                lines = sum(max(1, -(-len(b) // 135)) for b in data)
                return 0.28 * lines + 0.16 * len(data) + 0.1
            if kind == 'stats':
                return 1.45
            if kind == 'cards':
                n_c = len(data)
                cpl = max(18, int(((11.9 - (n_c - 1) * 0.2) / n_c - 0.24) * 10.5))
                lines = max(-(-len(t) // cpl) for _, t in data) if data else 1
                return min(2.6, 0.85 + 0.22 * lines)
            if kind == 'flow':
                # size from the longest caption: about 19 characters per line in
                # a five-step panel at 12pt, 0.23in per line, under a title band
                n_s = len(data)
                panel_w = (11.9 - (n_s - 1) * 0.54) / n_s
                cpl = max(14, int((panel_w - 0.28) * 9.5))
                lines = max((-(-len(c) // cpl) for _, c in data), default=1)
                two_line_title = max(len(s[0]) for s in data) > 18
                return max(2.0, 1.0 + (0.3 if two_line_title else 0) + 0.23 * lines + 0.35)
            if kind == 'gantt':
                return 0.5 * len(data[0]) + 0.5 + (0.4 if data[2] else 0)
            return None  # table: flexible

        heights = [natural(k, d) for k, d in blocks]
        fixed = sum(h for h in heights if h is not None)
        avail = bottom - top - gap * (len(blocks) - 1)
        if None in heights:
            rest = max(1.0, avail - fixed)
            heights = [rest if h is None else h for h in heights]
        elif fixed > avail and fixed > 0:
            scale = avail / fixed
            heights = [h * scale for h in heights]
        elif visual and len(blocks) == 1:
            # a lone visual block owns the slide: fill the canvas
            heights = [avail]
        elif visual and fixed < avail:
            # spread the slide: visual blocks grow up to 1.7x their natural
            # height, then whatever is left widens the gaps, so a slide with one
            # flow and one line does not hug the top band
            spare = avail - fixed
            grow_idx = [i for i, (k, _) in enumerate(blocks) if k != 'bullets']
            grow_by = {'flow': 0.9, 'stats': 1.0, 'gantt': 1.3, 'cards': 1.8, 'table': 0.0}
            room = [heights[i] * grow_by.get(blocks[i][0], 0.5) for i in grow_idx]
            use = min(spare, sum(room))
            for i, r in zip(grow_idx, room):
                heights[i] += use * (r / sum(room)) if room else 0
            spare -= use
            if len(blocks) > 1:
                gap += min(spare / (len(blocks) - 1), 0.6)

        y = top
        bullet_size = 15 if visual else 17
        for (kind, data), h in zip(blocks, heights):
            if kind == 'bullets':
                tb = self.textbox(s, 0.7, y, 11.9, max(h, 0.1))
                first = True
                for b in data:
                    p = tb.paragraphs[0] if first else tb.add_paragraph()
                    first = False
                    p.space_after = Pt(4 if visual else 8)
                    p.line_spacing = 1.06
                    r = p.add_run()
                    r.text = "▪  "
                    set_font(r, BODY, bullet_size, SKY, bold=True)
                    add_runs(p, b, BODY, bullet_size, BLACK)
            elif kind == 'table':
                self.table(s, data, 0.7, y, 11.9, h)
            elif kind == 'flow':
                self.flow(s, data, 0.7, y, 11.9, h)
            elif kind == 'stats':
                self.stats(s, data, 0.7, y, 11.9, h)
            elif kind == 'cards':
                self.cards(s, data, 0.7, y, 11.9, h)
            elif kind == 'gantt':
                rows, axis, marker = data
                self.gantt(s, rows, 0.7, y, 11.9, h, axis, marker)
            y += h + gap
        if featured:
            ftype, ftext = featured
            box = self.rect(s, 0.7, 5.95, 11.9, 0.95, DEEP if ftype == 'stat' else LIGHT,
                            rounded=True)
            ftf = box.text_frame
            ftf.word_wrap = True
            ftf.vertical_anchor = MSO_ANCHOR.MIDDLE
            ftf.margin_left = Inches(0.2)
            ftf.margin_right = Inches(0.2)
            p = ftf.paragraphs[0]
            if ftype == 'stat':
                add_runs(p, ftext, HEAD, 17, WHITE, bold=True)
            else:
                add_runs(p, ftext, BODY, 15, DEEP)
        self.footer(s, n)
        return s


def parse_deck(md):
    md = md.split("## Notes for the renderer")[0]
    blocks = re.split(r'^## Slide\s+\d+.*$', md, flags=re.M)[1:]
    slides = []
    for blk in blocks:
        title, bullets, featured, notes, kicker = None, [], None, None, None
        table, flow, stats, cards, gantt, gantt_axis, gantt_marker = [], [], [], [], [], None, None
        order = []  # block kinds in order of first appearance

        def seen(kind):
            if kind not in order:
                order.append(kind)

        def split_pipe(text, n):
            parts = [p.strip() for p in text.split("|")]
            return (parts + [""] * n)[:n]

        for ln in blk.split("\n"):
            s = ln.strip()
            if not s:
                continue
            if s.startswith("Title:"):
                title = s[6:].strip()
            elif s.startswith("Kicker:"):
                kicker = s[7:].strip()
            elif s.startswith("|"):
                # markdown table row; the |---| separator row is skipped
                cells = [c.strip() for c in s.strip("|").split("|")]
                if not all(re.fullmatch(r':?-{2,}:?', c or '--') for c in cells):
                    table.append(cells)
                    seen('table')
            elif s.startswith("- "):
                bullets.append(s[2:].strip())
                seen('bullets')
            elif s.startswith("Flow:"):
                flow = [tuple(split_pipe(step, 2)) for step in s[5:].split("->") if step.strip()]
                seen('flow')
            elif s.startswith("Stat:"):
                stats.append(tuple(split_pipe(s[5:], 2)))
                seen('stats')
            elif s.startswith("Card:"):
                cards.append(tuple(split_pipe(s[5:], 2)))
                seen('cards')
            elif s.startswith("Gantt axis:"):
                gantt_axis = int(s[len("Gantt axis:"):].strip())
            elif s.startswith("Gantt marker:"):
                gantt_marker = tuple(split_pipe(s[len("Gantt marker:"):], 3))
            elif s.startswith("Gantt:"):
                gantt.append(split_pipe(s[6:], 5))  # label | start | end | text | optional tail end
                seen('gantt')
            elif s.startswith("Featured stat:"):
                featured = ('stat', s[len("Featured stat:"):].strip())
            elif s.startswith("Featured quote:"):
                featured = ('quote', s[len("Featured quote:"):].strip())
            elif s.startswith("Speaker notes:"):
                notes = s[len("Speaker notes:"):].strip()
            elif s.startswith("Layout:"):
                pass
        data = {'bullets': bullets, 'table': table, 'flow': flow, 'stats': stats,
                'cards': cards, 'gantt': (gantt, gantt_axis, gantt_marker)}
        blocks_out = [(k, data[k]) for k in order]
        slides.append((title, bullets, featured, notes, blocks_out or None, kicker))
    return slides


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--md', required=True, help='slide markdown draft')
    ap.add_argument('--out', required=True, help='output .pptx path')
    ap.add_argument('--client', required=True, help='client display name for the footer')
    ap.add_argument('--engagement', default='NetSuite Rapid Assessment',
                    help='engagement name in the footer (default: NetSuite Rapid Assessment)')
    ap.add_argument('--client-logo', default=None, help='client logo image (optional)')
    args = ap.parse_args()

    slides_raw = parse_deck(Path(args.md).read_text(encoding='utf-8'))
    if not slides_raw:
        print("error: no '## Slide N' blocks found in the draft", file=sys.stderr)
        return 1

    deck = DeckBuilder(args)
    last = len(slides_raw) - 1
    for idx, (title, bullets, featured, notes, blocks, kicker) in enumerate(slides_raw):
        if idx == 0:
            s = deck.title_slide(bullets if bullets else [title or args.client])
        elif idx == last:
            s = deck.closing_slide(title or "", bullets, featured)
        else:
            s = deck.content_slide(title or "", bullets, featured, idx + 1, blocks=blocks,
                                   kicker=kicker)
        if notes:
            s.notes_slide.notes_text_frame.text = notes

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    deck.prs.save(str(out))
    print(f"Saved: {out}  slides: {len(deck.prs.slides._sldIdLst)}")
    print("Export slides to PNG (export_pdf.py --png) and inspect before delivering.")
    return 0


if __name__ == '__main__':
    sys.exit(main())
