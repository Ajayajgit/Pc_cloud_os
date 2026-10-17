# -*- coding: utf-8 -*-
"""Build the Sept 3 2026 PowerCloud roll out all-hands deck.

Internal deck, Power Cloud brand (POWERCLOUD_BRAND_GUIDELINES.md), layouts
extended from .claude/scripts/render_pptx.py. Run from the OS root:

    python "Internal/sept3_deck/build_deck.py"

Output: Internal/PowerCloud OS Roll Out - All Hands 2026-09-03.pptx
Then:   python .claude/scripts/export_pdf.py "<that pptx>" --png
"""
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
OUT = OS_ROOT / "Internal" / "PowerCloud OS Roll Out - All Hands 2026-09-03.pptx"

DEEP = RGBColor(0x00, 0x2F, 0x59)
SKY = RGBColor(0x31, 0xA4, 0xF3)
GREEN = RGBColor(0x41, 0xB9, 0x46)
YELLOW = RGBColor(0xFF, 0xC8, 0x17)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
BLACK = RGBColor(0x1E, 0x1E, 0x1E)
GREY = RGBColor(0x70, 0x70, 0x70)
LIGHT = RGBColor(0xEA, 0xF4, 0xFC)
PALE = RGBColor(0xF5, 0xF5, 0xF5)
HEAD, BODY, MONO = "Montserrat", "Barlow", "Consolas"
SW, SH = 13.333, 7.5
FOOTER = "Power Cloud Consulting   |   PowerCloud roll out, all-hands, September 3, 2026   |   Internal"


def image_size(path):
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
    """**bold** segments supported."""
    import re
    for part in re.split(r'(\*\*.*?\*\*)', text):
        if not part:
            continue
        b, seg = bold, part
        if part.startswith('**') and part.endswith('**'):
            b, seg = True, part[2:-2]
        r = p.add_run()
        r.text = seg
        set_font(r, name, size, color, bold=b)


class Deck:
    def __init__(self):
        self.prs = Presentation()
        self.prs.slide_width = Inches(SW)
        self.prs.slide_height = Inches(SH)
        self.blank = self.prs.slide_layouts[6]
        self.n = 0

    # ---- primitives -------------------------------------------------------
    def rect(self, s, l, t, w, h, fill, rounded=False, line=None):
        shp = s.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE if rounded else MSO_SHAPE.RECTANGLE,
            Inches(l), Inches(t), Inches(w), Inches(h))
        shp.fill.solid()
        shp.fill.fore_color.rgb = fill
        if line is None:
            shp.line.fill.background()
        else:
            shp.line.color.rgb = line
            shp.line.width = Pt(1)
        shp.shadow.inherit = False
        if rounded:
            shp.adjustments[0] = 0.08
        return shp

    def textbox(self, s, l, t, w, h, anchor=MSO_ANCHOR.TOP):
        tb = s.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(h))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.vertical_anchor = anchor
        for m in ('margin_left', 'margin_right'):
            setattr(tf, m, Inches(0.05))
        for m in ('margin_top', 'margin_bottom'):
            setattr(tf, m, Inches(0.02))
        return tf

    def img(self, s, path, l, t, w):
        pw, ph = image_size(path)
        h = w * ph / pw
        s.shapes.add_picture(str(path), Inches(l), Inches(t), Inches(w), Inches(h))
        return h

    def notes(self, s, text):
        if text:
            s.notes_slide.notes_text_frame.text = text.strip()

    def footer(self, s):
        self.n += 1
        self.rect(s, 0, SH - 0.42, SW, 0.42, LIGHT)
        tf = self.textbox(s, 0.5, SH - 0.42, 10.5, 0.42, MSO_ANCHOR.MIDDLE)
        add_runs(tf.paragraphs[0], FOOTER, BODY, 8.5, GREY)
        tf2 = self.textbox(s, SW - 1.2, SH - 0.42, 0.7, 0.42, MSO_ANCHOR.MIDDLE)
        p = tf2.paragraphs[0]
        p.alignment = PP_ALIGN.RIGHT
        add_runs(p, str(self.n), BODY, 9, GREY)

    def logo_band(self, s):
        self.rect(s, 0, SH - 1.2, SW, 1.2, WHITE)
        if PC_LOGO.exists():
            pw, ph = image_size(PC_LOGO)
            w = min(1.9, 0.9 * pw / ph)
            self.img(s, PC_LOGO, SW - w - 0.8, SH - 0.6 - (w * ph / pw) / 2, w)

    def header(self, s, title, kicker=None):
        self.rect(s, 0, 0, SW, SH, WHITE)
        self.rect(s, 0, 0, SW, 1.15, DEEP)
        self.rect(s, 0, 1.15, SW, 0.10, SKY)
        tf = self.textbox(s, 0.55, 0.12, 12.2, 0.95, MSO_ANCHOR.MIDDLE)
        if kicker:
            add_runs(tf.paragraphs[0], kicker.upper(), BODY, 11, SKY, bold=True)
            p = tf.add_paragraph()
            add_runs(p, title, HEAD, 24, WHITE, bold=True)
        else:
            add_runs(tf.paragraphs[0], title, HEAD, 26, WHITE, bold=True)

    def bullet_list(self, tf, bullets, size=16, color=BLACK, mark_color=SKY, space=8, first=True):
        for b in bullets:
            p = tf.paragraphs[0] if first else tf.add_paragraph()
            first = False
            p.space_after = Pt(space)
            p.line_spacing = 1.06
            r = p.add_run()
            r.text = "\u25aa  "
            set_font(r, BODY, size, mark_color, bold=True)
            add_runs(p, b, BODY, size, color)

    def featured(self, s, kind, text, top=5.95, l=0.7, w=11.9, h=0.95):
        box = self.rect(s, l, top, w, h, DEEP if kind == 'stat' else LIGHT, rounded=True)
        tf = box.text_frame
        tf.word_wrap = True
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        tf.margin_left = Inches(0.25)
        tf.margin_right = Inches(0.25)
        p = tf.paragraphs[0]
        if kind == 'stat':
            add_runs(p, text, HEAD, 16, WHITE, bold=True)
        else:
            add_runs(p, text, BODY, 15, DEEP)

    # ---- layouts ----------------------------------------------------------
    def title_slide(self, lines, notes=None):
        s = self.prs.slides.add_slide(self.blank)
        self.rect(s, 0, 0, SW, SH, DEEP)
        self.rect(s, 0, 0, SW, 0.28, GREEN)
        tf = self.textbox(s, 1.0, 1.7, 11.3, 3.4)
        add_runs(tf.paragraphs[0], lines[0], HEAD, 44, WHITE, bold=True)
        if len(lines) > 1:
            p = tf.add_paragraph()
            p.space_before = Pt(14)
            add_runs(p, lines[1], HEAD, 22, SKY, bold=True)
        for extra in lines[2:]:
            p = tf.add_paragraph()
            p.space_before = Pt(8)
            add_runs(p, extra, BODY, 16, WHITE)
        self.logo_band(s)
        self.notes(s, notes)
        self.n += 1
        return s

    def section(self, num, title, sub, notes=None):
        s = self.prs.slides.add_slide(self.blank)
        self.rect(s, 0, 0, SW, SH, DEEP)
        self.rect(s, 0, 0, 0.28, SH, GREEN)
        tf = self.textbox(s, 1.0, 1.6, 11.0, 1.0)
        add_runs(tf.paragraphs[0], num, HEAD, 60, SKY, bold=True)
        tf = self.textbox(s, 1.0, 2.9, 11.0, 2.5)
        add_runs(tf.paragraphs[0], title, HEAD, 40, WHITE, bold=True)
        p = tf.add_paragraph()
        p.space_before = Pt(14)
        add_runs(p, sub, BODY, 18, WHITE)
        if PC_LOGO.exists():
            # small white card with the logo, bottom right
            self.rect(s, SW - 2.6, SH - 1.15, 2.2, 0.85, WHITE, rounded=True)
            pw, ph = image_size(PC_LOGO)
            w = 1.8
            self.img(s, PC_LOGO, SW - 2.4, SH - 0.725 - (w * ph / pw) / 2, w)
        self.notes(s, notes)
        self.n += 1
        return s

    def bullets(self, title, bullets, featured=None, notes=None, kicker=None, size=16):
        s = self.prs.slides.add_slide(self.blank)
        self.header(s, title, kicker)
        body_h = 4.2 if featured else 5.0
        tb = self.textbox(s, 0.7, 1.5, 11.9, body_h)
        self.bullet_list(tb, bullets, size=size)
        if featured:
            self.featured(s, featured[0], featured[1])
        self.footer(s)
        self.notes(s, notes)
        return s

    def two_col(self, title, left, right, bottom=None, notes=None, kicker=None, size=14.5):
        """left/right = (header, [bullets])."""
        s = self.prs.slides.add_slide(self.blank)
        self.header(s, title, kicker)
        col_h = 4.0 if bottom else 4.9
        for i, (hdr, items) in enumerate((left, right)):
            l = 0.7 + i * 6.05
            self.rect(s, l, 1.55, 5.85, col_h, LIGHT, rounded=True)
            self.rect(s, l, 1.55, 5.85, 0.6, DEEP, rounded=True)
            self.rect(s, l, 1.85, 5.85, 0.3, DEEP)  # square off the lower edge of the header
            tf = self.textbox(s, l + 0.2, 1.55, 5.5, 0.6, MSO_ANCHOR.MIDDLE)
            add_runs(tf.paragraphs[0], hdr, HEAD, 15, WHITE, bold=True)
            tb = self.textbox(s, l + 0.2, 2.3, 5.45, col_h - 0.85)
            self.bullet_list(tb, items, size=size, space=6)
        if bottom:
            self.featured(s, bottom[0], bottom[1], top=5.8, h=1.0)
        self.footer(s)
        self.notes(s, notes)
        return s

    def cards(self, title, cards, bottom=None, notes=None, kicker=None, body_size=13.5):
        """cards = [(header, body_text_or_list, header_color)]; 3 or 4 across."""
        s = self.prs.slides.add_slide(self.blank)
        self.header(s, title, kicker)
        n = len(cards)
        gap = 0.3
        w = (11.9 - gap * (n - 1)) / n
        h = 3.9 if bottom else 4.9
        for i, (hdr, body, col) in enumerate(cards):
            l = 0.7 + i * (w + gap)
            self.rect(s, l, 1.55, w, h, LIGHT, rounded=True)
            self.rect(s, l, 1.55, w, 0.7, col, rounded=True)
            self.rect(s, l, 1.9, w, 0.35, col)
            tf = self.textbox(s, l + 0.15, 1.55, w - 0.3, 0.7, MSO_ANCHOR.MIDDLE)
            add_runs(tf.paragraphs[0], hdr, HEAD, 15, WHITE, bold=True)
            tb = self.textbox(s, l + 0.18, 2.4, w - 0.36, h - 0.95)
            if isinstance(body, str):
                add_runs(tb.paragraphs[0], body, BODY, body_size, BLACK)
                tb.paragraphs[0].line_spacing = 1.1
            else:
                self.bullet_list(tb, body, size=body_size, space=5)
        if bottom:
            self.featured(s, bottom[0], bottom[1], top=5.7, h=1.1)
        self.footer(s)
        self.notes(s, notes)
        return s

    def stats(self, title, stats, bottom=None, notes=None, kicker=None):
        """stats = [(big, label)] up to 4 across."""
        s = self.prs.slides.add_slide(self.blank)
        self.header(s, title, kicker)
        n = len(stats)
        gap = 0.3
        w = (11.9 - gap * (n - 1)) / n
        h = 3.6 if bottom else 4.6
        for i, (big, label) in enumerate(stats):
            l = 0.7 + i * (w + gap)
            self.rect(s, l, 1.6, w, h, DEEP, rounded=True)
            tf = self.textbox(s, l + 0.2, 1.75, w - 0.4, 1.5, MSO_ANCHOR.MIDDLE)
            p = tf.paragraphs[0]
            p.alignment = PP_ALIGN.CENTER
            add_runs(p, big, HEAD, 40 if len(big) <= 6 else 30, SKY, bold=True)
            tf = self.textbox(s, l + 0.2, 3.15, w - 0.4, h - 1.6)
            p = tf.paragraphs[0]
            p.alignment = PP_ALIGN.CENTER
            p.line_spacing = 1.1
            add_runs(p, label, BODY, 13, WHITE)
        if bottom:
            self.featured(s, bottom[0], bottom[1], top=5.5, h=1.3)
        self.footer(s)
        self.notes(s, notes)
        return s

    def flow(self, title, steps, notes=None, kicker=None, per_row=5, bottom=None, card_h=None, bottom_top=5.7, bottom_h=1.1, sub_size=12):
        """steps = [(label, sub)] laid out as numbered cards in rows."""
        s = self.prs.slides.add_slide(self.blank)
        self.header(s, title, kicker)
        rows = (len(steps) + per_row - 1) // per_row
        gap = 0.25
        w = (11.9 - gap * (per_row - 1)) / per_row
        avail = (3.9 if bottom else 5.0)
        h = card_h if card_h else (avail - gap * (rows - 1)) / rows
        for i, (label, sub) in enumerate(steps):
            r, c = divmod(i, per_row)
            l = 0.7 + c * (w + gap)
            t = 1.55 + r * (h + gap)
            self.rect(s, l, t, w, h, LIGHT, rounded=True)
            circ = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(l + 0.15), Inches(t + 0.15), Inches(0.5), Inches(0.5))
            circ.fill.solid()
            circ.fill.fore_color.rgb = SKY
            circ.line.fill.background()
            circ.shadow.inherit = False
            ctf = circ.text_frame
            ctf.margin_left = ctf.margin_right = Inches(0)
            ctf.margin_top = ctf.margin_bottom = Inches(0)
            p = ctf.paragraphs[0]
            p.alignment = PP_ALIGN.CENTER
            add_runs(p, str(i + 1), HEAD, 13, WHITE, bold=True)
            tf = self.textbox(s, l + 0.15, t + 0.75, w - 0.3, h - 0.85)
            add_runs(tf.paragraphs[0], label, HEAD, 13, DEEP, bold=True)
            if sub:
                p = tf.add_paragraph()
                p.space_before = Pt(4)
                p.line_spacing = 1.05
                add_runs(p, sub, BODY, sub_size, BLACK)
        if bottom:
            self.featured(s, bottom[0], bottom[1], top=bottom_top, h=bottom_h)
        self.footer(s)
        self.notes(s, notes)
        return s

    def table(self, title, header, rows, widths, notes=None, kicker=None, size=12.5, bottom=None, top=1.55):
        s = self.prs.slides.add_slide(self.blank)
        self.header(s, title, kicker)
        nrows = len(rows) + 1
        avail = (3.9 if bottom else 5.05)
        row_h = min(0.9, avail / nrows)
        shape = s.shapes.add_table(nrows, len(header), Inches(0.7), Inches(top), Inches(11.9), Inches(row_h * nrows))
        tbl = shape.table
        tblPr = tbl._tbl.tblPr
        tblPr.set('firstRow', '1')
        tblPr.set('bandRow', '0')
        # remove the default style so our fills win
        for el in tblPr.findall(qn('a:tableStyleId')):
            tblPr.remove(el)
        total = sum(widths)
        for i, wdt in enumerate(widths):
            tbl.columns[i].width = Inches(11.9 * wdt / total)
        for r in range(nrows):
            tbl.rows[r].height = Inches(row_h)
        for c, txt in enumerate(header):
            cell = tbl.cell(0, c)
            cell.fill.solid()
            cell.fill.fore_color.rgb = DEEP
            cell.margin_left = cell.margin_right = Inches(0.1)
            cell.margin_top = cell.margin_bottom = Inches(0.04)
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            p = cell.text_frame.paragraphs[0]
            add_runs(p, txt, HEAD, size, WHITE, bold=True)
        for r, row in enumerate(rows, start=1):
            for c, txt in enumerate(row):
                cell = tbl.cell(r, c)
                cell.fill.solid()
                cell.fill.fore_color.rgb = LIGHT if r % 2 else WHITE
                cell.margin_left = cell.margin_right = Inches(0.1)
                cell.margin_top = cell.margin_bottom = Inches(0.04)
                cell.vertical_anchor = MSO_ANCHOR.MIDDLE
                p = cell.text_frame.paragraphs[0]
                p.line_spacing = 1.05
                add_runs(p, txt, BODY, size, BLACK, bold=(c == 0))
        if bottom:
            self.featured(s, bottom[0], bottom[1], top=5.75, h=1.05)
        self.footer(s)
        self.notes(s, notes)
        return s

    def prompt(self, title, bullets, prompts, notes=None, kicker=None, size=15, caption="What you say"):
        """Bullets left, dark prompt card right."""
        s = self.prs.slides.add_slide(self.blank)
        self.header(s, title, kicker)
        tb = self.textbox(s, 0.7, 1.5, 7.0, 5.0)
        self.bullet_list(tb, bullets, size=size, space=7)
        l, t, w, h = 8.0, 1.6, 4.6, 4.9
        self.rect(s, l, t, w, h, DEEP, rounded=True)
        tf = self.textbox(s, l + 0.25, t + 0.2, w - 0.5, 0.4)
        add_runs(tf.paragraphs[0], caption.upper(), BODY, 10.5, SKY, bold=True)
        tf = self.textbox(s, l + 0.25, t + 0.65, w - 0.5, h - 0.8)
        first = True
        for pr in prompts:
            p = tf.paragraphs[0] if first else tf.add_paragraph()
            first = False
            p.space_after = Pt(14)
            p.line_spacing = 1.1
            r = p.add_run()
            r.text = "> "
            set_font(r, MONO, 13, GREEN, bold=True)
            r = p.add_run()
            r.text = pr
            set_font(r, MONO, 13, WHITE)
        self.footer(s)
        self.notes(s, notes)
        return s

    def tree(self, title, tree_text, bullets, notes=None, kicker=None, bottom=None):
        s = self.prs.slides.add_slide(self.blank)
        self.header(s, title, kicker)
        h = 3.95 if bottom else 4.9
        self.rect(s, 0.7, 1.6, 5.6, h, DEEP, rounded=True)
        tf = self.textbox(s, 0.95, 1.8, 5.2, h - 0.4)
        first = True
        for ln in tree_text.split("\n"):
            p = tf.paragraphs[0] if first else tf.add_paragraph()
            first = False
            p.line_spacing = 1.15
            name, _, desc = ln.partition("  ")
            r = p.add_run()
            r.text = name
            set_font(r, MONO, 12.5, WHITE, bold=True)
            if desc:
                r = p.add_run()
                r.text = "  " + desc.strip()
                set_font(r, MONO, 11, SKY)
        tb = self.textbox(s, 6.7, 1.55, 5.9, h)
        self.bullet_list(tb, bullets, size=14.5, space=7)
        if bottom:
            self.featured(s, bottom[0], bottom[1], top=5.75, h=1.05)
        self.footer(s)
        self.notes(s, notes)
        return s

    BADGE = {
        'tool': ('TOOL', SKY, WHITE),
        'human': ('HUMAN', YELLOW, BLACK),
        'client': ('CLIENT', GREEN, WHITE),
    }

    def chip(self, s, l, t, key, w=0.62, h=0.24, size=7.5):
        label, fill, ink = self.BADGE[key]
        box = self.rect(s, l, t, w, h, fill, rounded=True)
        box.adjustments[0] = 0.3
        tf = box.text_frame
        tf.margin_left = tf.margin_right = Inches(0)
        tf.margin_top = tf.margin_bottom = Inches(0)
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        add_runs(p, label, BODY, size, ink, bold=True)

    def timeline(self, title, steps, start_num=1, notes=None, kicker=None):
        """steps = [(badges, headline, description, artifacts)]. Who-acts timeline."""
        s = self.prs.slides.add_slide(self.blank)
        self.header(s, title, kicker)
        top, bottom_edge = 1.45, 6.6
        n = len(steps)
        h = (bottom_edge - top) / n
        for i, (badges, headline, desc, out) in enumerate(steps):
            t = top + i * h
            if i:
                self.rect(s, 0.7, t, 11.95, 0.015, RGBColor(0xD8, 0xE2, 0xEA))
            circ = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(0.7), Inches(t + 0.1), Inches(0.36), Inches(0.36))
            circ.fill.solid()
            circ.fill.fore_color.rgb = DEEP
            circ.line.fill.background()
            circ.shadow.inherit = False
            ctf = circ.text_frame
            ctf.margin_left = ctf.margin_right = Inches(0)
            ctf.margin_top = ctf.margin_bottom = Inches(0)
            p = ctf.paragraphs[0]
            p.alignment = PP_ALIGN.CENTER
            add_runs(p, str(start_num + i), HEAD, 10.5, WHITE, bold=True)
            for j, b in enumerate(badges):
                self.chip(s, 1.2 + j * 0.68, t + 0.16, b)
            tf = self.textbox(s, 2.65, t + 0.04, 6.45, h - 0.06)
            p = tf.paragraphs[0]
            add_runs(p, headline, HEAD, 12, DEEP, bold=True)
            p = tf.add_paragraph()
            p.space_before = Pt(1)
            p.line_spacing = 1.0
            add_runs(p, desc, BODY, 10, BLACK)
            tf = self.textbox(s, 9.25, t + 0.04, 3.4, h - 0.06, MSO_ANCHOR.MIDDLE)
            p = tf.paragraphs[0]
            p.line_spacing = 1.05
            r = p.add_run()
            r.text = out
            set_font(r, MONO, 8.5, GREY)
        # legend
        lt = 6.72
        tf = self.textbox(s, 0.7, lt - 0.02, 1.2, 0.28, MSO_ANCHOR.MIDDLE)
        add_runs(tf.paragraphs[0], "Who acts:", BODY, 9, GREY, bold=True)
        legend = [('tool', "Claude does the work"), ('human', "a person decides or signs"), ('client', "the customer has to act")]
        x = 1.6
        for key, text in legend:
            self.chip(s, x, lt, key)
            tf = self.textbox(s, x + 0.68, lt - 0.02, 2.4, 0.28, MSO_ANCHOR.MIDDLE)
            add_runs(tf.paragraphs[0], text, BODY, 9, GREY)
            x += 3.1
        self.footer(s)
        self.notes(s, notes)
        return s

    def closing(self, title, bullets, featured=None, notes=None):
        s = self.prs.slides.add_slide(self.blank)
        self.rect(s, 0, 0, SW, SH, DEEP)
        self.rect(s, 0, 0, 0.28, SH, GREEN)
        tf = self.textbox(s, 1.0, 0.9, 11.2, 4.9)
        add_runs(tf.paragraphs[0], title, HEAD, 30, WHITE, bold=True)
        for b in bullets:
            p = tf.add_paragraph()
            p.space_before = Pt(9)
            r = p.add_run()
            r.text = "\u25aa  "
            set_font(r, BODY, 16, SKY, bold=True)
            add_runs(p, b, BODY, 16, WHITE)
        if featured:
            p = tf.add_paragraph()
            p.space_before = Pt(16)
            add_runs(p, featured, HEAD, 15, GREEN, bold=True)
        self.logo_band(s)
        self.notes(s, notes)
        self.n += 1
        return s

    def save(self, path):
        path.parent.mkdir(parents=True, exist_ok=True)
        self.prs.save(str(path))
        return path


# ==========================================================================
# CONTENT
# ==========================================================================

def build():
    d = Deck()

    # ---------------------------------------------------------------- open
    d.title_slide([
        "PowerCloud Roll Out",
        "How the practice works now: the Power Cloud OS",
        "All-hands, Thursday, September 3, 2026",
        "Internal. Client names are fine in this room.",
    ], notes="""
Open. Why this meeting is mandatory, what changes today: the OS is now how the practice works, not a pilot.
One slide, no history lesson. Taha may be listening from a flight; do not hold for him.
""")

    d.bullets("Why this meeting is mandatory", [
        "Today the OS stops being a pilot. From here on it is how Power Cloud does client work: assessments, implementations, builds, support tickets, status reporting, data work.",
        "You leave knowing what it does end to end, having watched colleagues show real work with it, and knowing exactly what you are expected to do next week.",
        "What stays with you: judgment, proofreading, the numbers, the client relationship. What moves to the tool: the typing and the memory.",
    ], featured=('stat', "90 minutes: the system, one engagement end to end, the case studies, six announcements, one ask."),
        size=18, notes="""
Brass tacks. No vision statement; the vision lands through the narrative walk and the case studies.
The third bullet is the frame for the whole session: the human owns what reaches a client.
""")

    d.table("Run of show", ["Time", "Segment", "Who"], [
        ["0:00", "Open. What changes today.", "Mike"],
        ["0:05", "What the OS is, how you get in, and your first session in Claude Code. Live on screen.", "Mike"],
        ["0:17", "What it has already done, then one engagement end to end with a real folder on screen.", "Mike"],
        ["0:40", "Case studies, ten minutes each. Real PS work, one client, one problem. Mike hands off.", "Imran, Justin"],
        ["1:10", "Six announcements.", "Mike"],
        ["1:22", "The ask, then open floor.", "Mike"],
    ], widths=[1.2, 8.2, 2.5], notes="""
Mike timekeeps. Hard 10-minute cap on each case study.
""")

    # ------------------------------------------------ what it is, how you get in
    d.section("01", "What the Power Cloud OS is, and how you get in",
              "For anyone opening Claude Code for the first time. The how-to PDF covered setup; this is the part after setup.",
              notes="""
Assume nobody in the room has used Claude Code before, even if they have used Claude in a browser. Skip prerequisites; the PDF covered them and step zero was mandated.
""")

    d.cards("The OS is three things. You touch two of them.", [
        ("A shared drive of client folders", [
            "G:\\Shared drives\\Power Cloud OS. One folder per client, the same shape every time.",
            "Everything about a client lives in their folder. That folder is the memory.",
            "You work here every day.",
        ], DEEP),
        ("Claude Code, opened inside a folder", [
            "The Code tab of the Claude desktop app. A chat attached to a folder: it reads and writes the files there, runs tools, and connects to NetSuite, Asana, Gmail and Drive.",
            "You talk to it in plain English. It does the typing and the digging.",
            "You work here every day.",
        ], DEEP),
        ("The written-down way we work", [
            "Playbooks, writing standards, checklists, skills: markdown files at the root of the drive.",
            "Claude reads them automatically at the start of every session and stays inside their rules on its own.",
            "You never need to open them.",
        ], SKY),
    ], bottom=('stat', "Plainly: open Claude Code in a client's folder and say what you need. Everything else is machinery to make that safe and consistent."),
        body_size=13, notes="""
Three parts, one sentence each. The third one is what makes this different from "everyone gets a chatbot": the process is written down and the tool follows it, so the output comes up the same way regardless of who runs it.
""")

    d.flow("At the workbench: the habit is the same every time", [
        ("Brainstorm", "Bring the problem and the constraint, not a preferred answer. Naming a solution up front is how you lose the second option."),
        ("Plan", "Nothing gets built without a written plan: approach, assumptions, and what will be tested to prove them. House policy, not preference."),
        ("Execute", "Sandbox first, version-controlled, with a human at the plan and again at production."),
        ("Deliver", "The artifact renders from the same folder, branded, and every client-facing sentence gets human eyes before it leaves."),
    ], per_row=4, card_h=2.55, sub_size=13, bottom_top=4.4, bottom_h=1.5,
        bottom=('quote', "Anything to be strategized, planned or executed starts by opening Claude inside that customer's folder. Brainstorm there, plan there, build and deliver from there. There is no thinking tool and a separate doing tool, and no point where work leaves the folder to happen somewhere else. That is what makes the folder worth treating as the memory."),
        notes="""
Engagement types describe how work gets shaped. Most of the actual week is spent here, at the bench, with one specific piece of work in hand: a ticket, a draft, a question, a build.
The four steps are the same whether the piece of work is a two-day assessment or a one-hour fix. The first one is the one people skip: bring the problem, not your answer.
""")

    d.bullets("If this is your first time in Claude Code", [
        "It is a chat window attached to a folder. What makes it different from Claude in a browser: it can read and write the files in that folder, run scripts and connectors, and it loads the workspace rules automatically.",
        "You type plain English. There are no commands to learn. The prompts on these slides are starting points; say it your way.",
        "It works in the open. You watch it read files, run queries and write drafts, one step at a time in the conversation. You can interrupt and redirect at any point.",
        "It asks before anything with consequences. A permission prompt is a question, not an error. Allow file edits in the client's working/ folder. Decline a production write during discovery, every time.",
        "A session is one conversation. Start a new one for each task. Nothing is lost when you do: everything it wrote is in the folder, and the next session reads it.",
    ], featured=('stat', "You are managing, not typing. Give it the job, check its work, own what goes out."),
        size=15, notes="""
This is the slide for the person who has only ever used Claude or ChatGPT in a browser tab. The three differences that matter: it acts on files, it runs connectors, and it follows our written rules without being told.
""")

    d.flow("How you get in", [
        ("Open Claude", "The Claude desktop app, then the Code tab at the top of the window."),
        ("Open the client's folder", "G:\\Shared drives\\Power Cloud OS\\{Client}. Always a client folder. Never the root, never a personal folder."),
        ("Run session start", "\"This is the {Client} engagement. Run session start.\" It reads the fact sheet, checks the NetSuite account, lists its tools."),
        ("Name the session", "Paste the /rename line it suggests: client plus environment."),
        ("Say what you need", "A question, a draft, the exec summary, a ticket, the assessment. The menu is in the appendix."),
    ], per_row=5, bottom=('quote', "Check you are signed into your Power Cloud account, not a personal one. The wrong account loses the team's context and connections."),
        notes="""
LIVE DEMO CUE: do exactly these five steps on screen, slowly, in a client folder where session start has already been run once today so the second run is quick and predictable.
Narrate what it reads while it runs: CONTEXT.md, the folder inventory, the account identity check, the tool check, the /rename suggestion.
Fallback: walk CONTEXT.md in Explorer and describe what session start would have confirmed.
""")

    d.two_col("What you will see on screen, and how to work with it",
              ("While it works", [
                  "Your message, then Claude's steps as it works: the files it reads, the queries it runs, the drafts it writes. Collapsed by default; expand any step to see exactly what it did.",
                  "Permission prompts when it wants to do something with consequences. Read them before you answer. Auto-accepting file edits in a working session is fine; bypassing permissions never is.",
                  "Its answer, and the files it produced, which appear in the client folder in Explorer as it goes.",
              ]),
              ("Treat it like an assistant you just hired", [
                  "**Do not sit and watch.** You did not bring on an assistant to watch them work; you brought one on so you could do other things while they take tasks off your plate. Hand over the job, then go do the next thing. Waiting is not billable.",
                  "**Do not give up on the first draft.** When an assistant comes back with something that needs changes, you do not say \"forget it\" and do it yourself. You explain what is wrong and why, and send them back. Same here: the second pass is usually the one that lands, and telling it to remember makes the correction stick.",
                  "**Answer when it asks.** It interviews you when it hits a gap instead of guessing.",
                  "**Read everything before you trust it.** Polished output at speed is exactly what makes skipping review tempting.",
              ]),
              bottom=('stat', "Delegate, go do something else, come back, correct, send it back. That is the whole rhythm."),
              size=13, notes="""
Point at the actual session on screen for each of the left-hand items while the demo from the previous slide is still running or just finished.
The right-hand column is the mindset shift, and it is the one that decides who gets value out of this. Two failure modes to name out loud: the person who stares at the screen while it works, and the person who abandons the tool the first time a draft needs changes and does it by hand instead.
""")

    d.prompt("Your first session: bring one of your own clients in", [
        "Pick a client you work with who has no folder here yet. Most of yours will not, and you know them better than anything already on the drive.",
        "In Explorer, create a folder named for them under G:\\Shared drives\\Power Cloud OS. Plain client name, no \"RA\" or engagement suffix; the folder outlives the engagement.",
        "Drop in whatever you have: sales notes, a transcript, an export, the SOW. Loose is fine.",
        "Open Claude Code in that folder and say the line. It files what you dropped in, checks for an existing Asana project before creating anything, interviews you for the fact sheet, and drafts the access & consent pack for you to review.",
        "Then ask it something only someone who had read those documents could answer, and challenge one claim with \"what's your source?\"",
        "Nothing here reaches the client or touches NetSuite. The consent pack is a draft until you decide to send it.",
    ], prompts=[
        "New client. Run session start.",
        "This is new work for {Client}, an old client. Set them up.",
        "Based on what's in this folder, what should I know before my next call with them?",
        "What's your source for that?",
    ], size=14, notes="""
This is the homework. Everyone brings one of their own clients into the OS by end of next week, which is also how the drive fills up with the practice's real book of work.
For an old client, the setup interview asks about their historical folder under Power Cloud Project Folders and links it as read-only history rather than copying it over.
The "what's your source" habit is the one that makes the answers trustworthy.
""")

    # ------------------------------------------------ what it is, proof
    d.tree("The one idea: the folder is the memory",
           "{ClientName}/\n"
           "├── CONTEXT.md  living fact sheet\n"
           "├── .claude/  settings, render gate\n"
           "├── source/  client material, read-only\n"
           "├── working/  evidence, drafts, LOE log\n"
           "├── deliverables/  finals only\n"
           "└── execution/  build work, sandbox first",
           [
               "Everything about a client lives in that client's folder: source material, working evidence, finals, build work.",
               "Nothing important lives in a chat history, in a consultant's head, or in the model's context.",
               "Any consultant who opens the folder and starts a session is talking to something that already understands the engagement.",
               "Clear a session, swap a machine, let a week pass. The state survives because it is on disk.",
               "Every client folder has the identical shape. The separation does real work: it keeps the client's words untouched, keeps half-finished thinking out of finals, and walls write-enabled build off from read-only discovery.",
           ], notes="""
"Anybody continuing a conversation in that same folder will be talking to a being that understands it."
CONTEXT.md is what makes a folder self-explaining: account IDs, sandbox refresh estimate, which connection was verified and when,
engagement type, what was promised, contacts, dated decisions, open questions. A session reads it first, every time.
working/ is not scratch paper. It is the record of how a conclusion was reached, and what makes a finding defensible months later.
""")

    d.two_col("What we own, and what we rent",
              ("Layer one: the methodology. Ours.", [
                  "The folder structure, the skills, the reference files, the checkpoints, the evidence tiers.",
                  "Written down, versioned, improved after every engagement.",
                  "The reason the output comes up the same way regardless of who runs it.",
                  "This layer is the asset.",
              ]),
              ("Layer two: the engine. Rented.", [
                  "Claude Code, plus the MCP connections into NetSuite, Celigo, Asana, Gmail and Drive.",
                  "Swappable and model-portable on purpose.",
                  "If a better engine appears, the methodology moves onto it without being rewritten.",
                  "Nothing client-specific is hard-coded into a shared skill. It lives in that client's CONTEXT.md.",
              ]),
              bottom=('quote', "The competitive position is not \"we use AI.\" Anyone can rent the engine. The position is a discovery process a machine executes the same way every time, with evidence discipline most firms do not apply even by hand."),
              notes="""
Keep this short. The point for the room: the rules and the process are the thing we built. The model underneath will change.
""")

    d.table("The skills, and when each one fires", ["Skill", "What it does", "Fires when"], [
        ["new-engagement", "Stands a client up: files loose documents, interviews you, checks for an existing Asana project and folder, pre-fills CONTEXT.md, drafts the consent pack.", "A bare or unfiled folder"],
        ["rapid-assessment", "The discovery engine for Recovery and Implementation: prep, evidence mining, verification, solution research, three deliverables. Six stages.", "Transcripts are in source/"],
        ["custom-project", "The third engagement type. The folder shape and the scoped discovery that replaces a full assessment.", "Type is Custom Project"],
        ["customization-docs", "The Use Case before build and the FDD & TDD handover at ship, for any net-new customization in any engagement type.", "Custom dev is scoped or shipping"],
        ["execution", "The build phase after sign-off: backlog sync, per-task planning, routing, sandbox-first build, production gates, actuals back to baselines.", "Work is approved to build"],
        ["celigo", "The client's integration layer: read-only flow inventory in discovery, error triage, flow changes under the production gate.", "Celigo is in the stack"],
        ["customer-exec-summary", "The recurring status document from Asana, hours, email, Drive and meeting notes, plus the cross-reference that catches what slipped.", "Someone asks for a status update"],
        ["sdf-scaffold", "Creates a SuiteCloud project to Power Cloud standards.", "First build on an engagement"],
        ["sdf-deploy", "Validates and deploys to NetSuite, sandbox first, with the account identity check and a human-gated production step.", "A build is ready to land"],
        ["humanizer", "Strips the mechanical tells out of client-facing drafts. Numbers, LOE, billing language and quotes are untouchable.", "Before every draft review"],
        ["feedback", "Captures what got in your way into the root inbox, from what just happened in the session, and triages what has collected.", "\"Log this as feedback\" or /feedback"],
    ], widths=[2.2, 7.0, 2.7], size=10, notes="""
A skill is a written procedure that loads only when the work matches it, so the always-on rules stay short and the detailed procedure is in front of Claude exactly when it is needed.
You never invoke one by name. Say what you need in plain English and the right one fires; the "fires when" column is what it is listening for.
They live in one place at the root, carry a changelog, and anything several consultants run gets reviewed before it changes. Nothing client-specific is hard-coded into a skill; that lives in the client's CONTEXT.md.
Developers: sdf-scaffold, sdf-deploy, execution and customization-docs are yours. Shopify's own seventeen skills are installed alongside rather than rewritten.
""")

    d.stats("What it has already done", [
        ("10 to 4", "hours to generate a client report."),
        ("8 to 2", "hours to produce a rapid assessment: from a transcript instead of from a consultant's notes."),
        ("Under 1%", "Shinesty's actual return rate, against the 25 to 30% the client reported. Script-level proof nobody would have dug up by hand."),
        ("1 day", "Teppermans: a suitelet fix went from call transcript to sandbox-deployed. Nobody touched the script but Claude."),
    ], bottom=('quote', "The standout after several weeks of use has been data handling: messy conversation plus raw exports, landed in NetSuite in the right shape, better than expected. And the case studies coming up are all work that happened inside the OS."),
        notes="""
Two proof points fast, then move on. All four happened inside the OS, in client folders that exist on the drive today.
The Shinesty discrepancy is the one that shows why we query the account instead of taking the call at face value.
""")

    d.stats("Not a pilot: what is on the shelf today", [
        ("10", "clients with engagement records in the OS"),
        ("18", "engagement records, including nested custom projects"),
        ("31", "finals shipped from deliverables/ folders"),
        ("8", "engagements with execution work in progress"),
    ], bottom=('quote', "From ENGAGEMENT_LOG.md at the root, generated September 2 from what each folder actually wrote to disk. Nobody maintains it by hand, so it reflects work done rather than a field someone remembered to update."),
        notes="""
Open ENGAGEMENT_LOG.md live if time allows: it answers "what is in flight" without opening ten folders.
The counts are from the September 2 build; rerun python .claude/scripts/build_engagement_log.py before the meeting if you want them current.
""")

    # ------------------------------------------------ narrative walk
    d.section("02", "One engagement, end to end",
              "Sales handover to retro. Walked from the how-to guide's own arc, with a real folder on screen.",
              notes="""
25 minutes. This is the segment that hits home the most. Have the demo folder open in Explorer and a Claude Code session ready in it before this slide.
""")

    d.timeline("The arc, part one: from handover to finals", [
        (['tool', 'human'], "Sales hands over a client in trouble",
         "The consultant creates the folder and opens Claude in it. No CONTEXT.md yet, so setup takes over: checks for an existing folder or Asana project, interviews the consultant, files the sales material.",
         "CONTEXT.md · source/ working/ deliverables/ execution/ · working/access_pack_draft.md"),
        (['human', 'client'], "One email starts every clock at once",
         "The access and consent pack: AI and MCP disclosure, production and sandbox access, the reader-tool install, the connector role. All have lead time, so they leave together. The yes is logged, dated.",
         "CONTEXT.md: Access & consent block, dated"),
        (['tool', 'human'], "Before anyone flies out",
         "A full read-only pass over the account: features, the script estate read at source, the integration layer, volumes. Where the sales call and the configuration disagree goes to the top of the agenda.",
         "working/onsite_prep.md · Onsite_Agenda.docx · checkpoint 1"),
        (['human'], "Two days on site",
         "The consultant runs the room. Recordings become transcripts and land in source/, read-only from that moment: the client's words are never edited, only copied from.",
         "source/*.txt"),
        (['tool'], "Mining, at a deliberately low threshold",
         "Every material claim logged with file, timestamp and speaker. Then the sweep for candidates: pain points, passing complaints, workarounds, and the anomalies nobody mentioned that turned up in the account.",
         "working/evidence.md · working/candidates.md"),
        (['tool', 'human'], "Verify, then walk the whole list",
         "Read-only queries confirm or refute each claim, every query logged. Then the consultant rules on every candidate. Materiality is a human judgment applied to a complete list.",
         "working/verification.md · a disposition on every candidate · checkpoint 2"),
        (['tool', 'human'], "Three drafts, humanized, the numbers line by line, then render",
         "The assessment as the record, the deck as the meeting vehicle, the execution plan as the build spec. The scanner blocks the render while copy tells remain. Every hours figure confirmed. Only then a branded file.",
         "working/loe_log.md · deliverables/*.docx *.pptx *.pdf · checkpoints 3 and 4"),
    ], notes="""
Walk the arc at this altitude first, then step through the stops on the following slides. Read the badges as who is acting: tool where Claude does the work, human where a person decides or signs, client where the customer has to act.
The client here is a composite; the artifacts named in the right-hand column are the real ones the system writes. Put the demo folder's working/ on screen if you want to show those files exist.
""")

    d.timeline("The arc, part two: from sign-off to the next engagement", [
        (['client', 'human'], "They fund the first phase",
         "Work moves into execution/, a subfolder of the same client folder, so discovery history stays one level up. Approved items sync to Asana for status; the execution plan stays the source of truth for the build.",
         "execution/ · Asana tasks linked to their plan blocks"),
        (['tool', 'human'], "Building, one task at a time",
         "Each task is planned before it is built, with three honest exits: build, a targeted question list for the client, or a sandbox spike. Routes prefer version-controlled objects. Sandbox first, a human at the plan and again at production.",
         "execution/build_log.md · SDF objects in git · two gates per task"),
        (['tool', 'client'], "One item turns out to be real development",
         "Before any code, a Use Case is written and the client signs it: problem, approach, objects, assumptions, effort. It doubles as the SOW. When the build ships, the FDD & TDD handover follows for whoever maintains it later.",
         "deliverables/Use_Case_....docx · FDD & TDD ....docx"),
        (['tool', 'human'], "Then it becomes an ongoing relationship",
         "Every Monday the hours job drops this client's slice into their folder. Before each status call the exec summary assembles from Asana, hours, email, Drive and meetings, and cross-references meetings against Asana. Candid version internal, reviewed version to the client.",
         "working/time_entries_*.json · working/exec_summary_*.md · Executive_Summary.docx"),
        (['human'], "What the engagement taught the practice",
         "At the retro every learning captured along the way gets a decision: promoted to the playbook, kept engagement-specific, or discarded. Actual hours feed the baselines. Nothing becomes doctrine without someone saying so.",
         "working/retro.md → NETSUITE_PLAYBOOK.md · LOE_BASELINES.md · CAPABILITIES.md"),
    ], start_num=8, notes="""
Steps 8 to 12. Step 12 is the retro, and it is what stops the whole thing being twelve steps that produce the same quality forever.
The next slides walk the stops in detail; if time is short, this pair of slides plus the six gates is the minimum.
""")

    d.prompt("It starts with the sales handover", [
        "Create a plain-name folder under G:\\Shared drives\\Power Cloud OS. No \"RA\" suffix; the folder outlives any one engagement.",
        "Drop whatever you have in it, loose is fine: sales notes, transcripts, exports, the SOW.",
        "Open Claude Code in that folder and say the line.",
        "Claude files the documents into source/, checks for an existing Asana project and folder-name variants before creating anything, interviews you (engagement type, contacts, stack, billing channel), pre-fills CONTEXT.md, links the legacy folder as read-only history, and drafts the access & consent pack for you to send.",
        "Old client, new work: same line, and it asks about their historical folder instead of copying it over.",
    ], prompts=[
        "New client. Run session start.",
        "This is new work for Lulus, an old client. Set them up.",
        "Foundrae is an in-flight project we're bringing into the workspace. Set them up.",
    ], notes="""
Live option: show the folder you created for the demo client and the CONTEXT.md the setup interview produced.
Adopting an in-flight project should take an hour, not a day.
""")

    d.bullets("The access & consent pack goes out on day one", [
        "**Disclosure.** We use AI and connect to their NetSuite through MCP, read-only during discovery. A conversation and a written yes, logged in CONTEXT.md with the date.",
        "**Both environments, up front.** Production for discovery: current data, and the read-only rule means no write risk. Sandbox for the build later; it has lead time.",
        "**Script Reader install**, with the client's go-ahead (Mike, Taha or Dev). Without it, any claim about what a script does stays Reported, never Verified.",
        "**MCP connection added centrally.** Send Mike or Taha the account ID. Connections carry the environment in their name (\"- Prod\", \"- SB\"), and the write guardrail reads that name.",
        "**Shopify or QuickBooks in the stack?** The pack has blocks for those too. Credentials never land in this Drive.",
    ], featured=('stat', "Before real work: disclosure approved, access granted, Script Reader installed, connection live, identity check passed."),
        notes="""
Several of these involve other people and have lead time, which is why they all go out in one email at engagement start.
Template: templates/engagement/access_and_consent_pack.md. The setup interview drafts it for you.
""")

    d.prompt("Every session starts the same way", [
        "Open the client's folder and say the line. Same starting point for every phase, discovery through execution.",
        "It reads CONTEXT.md, inventories the folder, confirms the connected NetSuite account actually belongs to this client, and checks which tools are present.",
        "If the account does not match, it stops and asks. Do not override; fix the connection.",
        "It ends by suggesting a session name. Paste it. Generic titles have already caused production and sandbox confusion.",
        "Then say what you need: prep, the assessment, execution, a ticket, the exec summary, a question with the client's full context behind it.",
    ], prompts=[
        "This is the Teppermans engagement. Run session start.",
        "/rename Teppermans SB - suitelet fix",
        "Pick up where you left off.",
    ], notes="""
You already ran session start live in section 01. Here, just recap what it confirmed and why the identity check matters: a connector has pointed at the wrong account before.
""")

    d.prompt("Kickoff prep happens before the client call", [
        "Mines the sales notes and any transcripts, runs read-only MCP discovery against the account, and researches the client's public website.",
        "Produces a question list grounded in what the account shows, not a generic checklist, plus a time-boxed agenda.",
        "Gaps between what was said on the sales call and what is actually configured go to the top of the agenda.",
        "Checkpoint 1: the client-facing one-pager waits for your review before it goes anywhere.",
        "Taha's line from the summit: \"Before the kickoff, they're asking you questions which nobody even asked.\"",
    ], prompts=[
        "We got the handoff from sales. Prep me for the kickoff call, and draft the questions we should send the client in advance.",
        "Prep for the onsite.",
    ], notes="""
This is the priority gap the roadmap keeps coming back to: discovery before the kickoff, not after.
""")

    d.bullets("Discovery lands in source/, and source/ is sacred", [
        "Transcripts, recordings, exports, client documents go into source/. That folder is the client's words and data.",
        "Never edit it. Transform via copies in working/. Never Explorer-copy a .gdoc; export it properly.",
        "Read-only during discovery, no exceptions, even on a live production account. Queries, record reads and metadata only.",
        "If a production-write confirmation ever appears during discovery work, the answer is decline. The guardrail is protecting a client account, not throwing an error.",
        "Two offerings, same machinery: **Rapid Assessment** onsite over two full days, **Fast Track Discovery** remote in two-hour chunks.",
    ], featured=('stat', "Read-only during discovery. No exceptions, even on a live production account."), notes="""
Short slide. The read-only rule is the one that lets us ask for production access with a straight face.
""")

    d.table("The assessment: six stages, each with a human check", ["Stage", "What it does", "Produces", "Human"], [
        ["01 Pre-onsite prep", "Full read-only pass over the account so the questions are grounded in what it shows.", "working/onsite_prep.md, one-page client agenda", "Checkpoint 1"],
        ["02 Evidence mining", "Every material claim logged with file, timestamp, speaker. Then an exhaustive sweep for candidate work items at a low threshold.", "working/evidence.md, working/candidates.md", ""],
        ["03 Verification", "Read-only queries confirm or refute each claim. Findings map to Power Cloud products, always with a native or third-party alternative named.", "working/verification.md", "Checkpoint 2, findings review"],
        ["04 Drafting", "Approved findings become three markdown drafts. Nothing renders yet.", "Three drafts in working/", ""],
        ["05 Humanize, review, render", "Copy scan first, so you review finished prose. Draft review, then the LOE review line by line. Only then the branded finals.", "working/loe_log.md, finals in deliverables/", "Checkpoints 3 and 4"],
        ["06 Retro", "What the engagement taught the practice, walked with a human. Promote, keep local, or discard.", "working/retro.md, updates to the shared library", "Decision on every entry"],
    ], widths=[2.2, 5.3, 3.0, 1.9], size=11.5, notes="""
What you say when the interviews are done: "The interviews are complete. Produce the handover docs."
Stage files load one at a time; the skill never works a stage without its file open. That is why the output is consistent across consultants.
""")

    d.cards("Every claim is tiered", [
        ("Verified", "Confirmed by a read-only query against the account. The query and its result are logged in working/verification.md.", GREEN),
        ("Reported", "Stated on a call or in a client document. Not confirmed. Never presented as fact, no matter how confidently it was said.", SKY),
        ("Inferred", "Our analysis, or an industry pattern applied. Reasoning, not evidence. A health verdict is Inferred and says so.", GREY),
    ], bottom=('quote', "The disagreement rule: where a call claim and the account disagree, the gap is itself a finding and gets called out rather than quietly reconciled. People misremember their own configurations. Tiers stay internal; they never clutter the client's document."),
        notes="""
This is the discipline that separates a consultant's document from a transcription.
Any number a person repeated casually (script counts, volumes, percentages) gets checked before it ships. The client's admin can check ours.
""")

    d.bullets("Nothing falls off the list silently", [
        "Surfacing every potential work item is the top priority of the whole process. It never depends on you remembering an item, or on a transcript being complete.",
        "Candidates are captured at a deliberately low threshold from every source into working/candidates.md: every pain point, passing complaint, manual workaround, and every anomaly found in the account itself.",
        "A candidate leaves the register in exactly three ways: it becomes a work item, it moves to fast-follow, or it is dropped with a written reason. Never by silent omission.",
        "Materiality is your call at the findings review, applied to a complete list, instead of a silent judgment made during extraction.",
        "Behind it, a per-process-area completeness checklist forces an explicit \"not discussed\" or \"not applicable\" for anything the sources never covered.",
    ], featured=('quote', "A candidate may never simply be absent. If it was said on a call or seen in the account, it stays on the list until a human decides otherwise."), notes="""
Checkpoint 2 is where you do this: the complete candidate register, evidence log and verification log, before a word is drafted.
""")

    d.table("What always ships on a Recovery or an Implementation", ["Deliverable", "Job", "Shape"], [
        ["{Client}_Assessment_{date}.docx", "The source of truth. Findings, evidence, the complete work-item menu with effort and priorities, phasing, and the commercial framing. On an Implementation this is the roadmap: same evidence work, framed as milestones toward a target state.", ".docx and PDF"],
        ["{Client}_Presentation_{date}.pptx", "The meeting vehicle. A twenty-page PDF cannot be reviewed live. Leads with the two or three highest-impact issues; talking points live in speaker notes.", ".pptx and PDF"],
        ["{Client}_Execution_Plan.md", "The technical artifact a future session builds from. Per task: problem, affected objects, build classification, steps, acceptance criteria, sandbox test plan, rollback.", ".md, internal, updated in place"],
    ], widths=[3.0, 6.9, 2.0], size=12,
        bottom=('stat', "Any net-new custom development, in any engagement type, also carries a Use Case the client signs before build and an FDD & TDD handover when it ships. A Custom Project ships those two instead of the three above."),
        notes="""
A "Sprint Document" or "Work Item Document" promised to a client is the Assessment, not a fourth file.
Triggers for the Use Case pair: new SuiteScripts, new custom applications, new integrations or flows. Not a custom field inside a larger configuration project.
""")

    d.bullets("Checkpoint 4: the numbers are yours", [
        "Claude drafts every LOE figure. You own it, line by line, before anything renders. The hours review is called out explicitly, never assumed inside the draft review.",
        "Every line is logged in working/loe_log.md: the drafted figure, the approved figure, and a one-line reason for any change. That log is the calibration feed for LOE_BASELINES.md.",
        "Figures marked [no prior basis] get first attention.",
        "Commercial posture is a separate field from engagement type. **Pre-agreement**: LOE, phasing with hours, a recommended first phase, billing terms. **Under agreement**: none of that reaches the client; effort tracks internally only.",
    ], featured=('stat', "LOE numbers are commercially binding once sent. Claude drafts them, a human owns them."),
        notes="""
Rule 5 of the rules that never bend. This is also where the two-document pattern matters: the internal working files carry everything, the client file carries what you approved.
""")

    d.prompt("Client signs off. Execution builds sandbox first.", [
        "Execution runs from {Client}/execution/, write-enabled, under its own guardrails. Discovery history sits one level up and stays reachable.",
        "**Gate 1, the plan.** A written plan per task, approved before any build. Three honest exits: build, a targeted question list for the client, or a throwaway sandbox spike. Guessing a design decision is not one of them.",
        "**Routes**, in preference order: SDF object (versioned, diffable, revertible), config script, integration change, data fix, and manual as the small residue that gets a click-by-click checklist.",
        "**Gate 2, production.** One human approval per deploy. A production write can never happen silently.",
        "**New policy.** No build starts until client approval is verified on the referenced Asana task. Scripted work gets a dev-team review before it comes back to you for testing.",
    ], prompts=[
        "Let's start execution. Work on tasks O2C.3 and W.1.",
        "Do Phase 1.",
        "Pull the Asana task 'Price tag reprint bug' and plan the fix.",
    ], size=13.5, notes="""
Developers: this is your slide. SDF by default, sdf-scaffold and sdf-deploy skills, ScriptReader for reading actual script bodies. Appendix has the detail.
Announce the approval and dev-review gate as policy in effect by convention. Do NOT present it as mechanically enforced yet; the gate is not built.
Support tickets run the same discipline in miniature: investigate, plan, approval, sandbox first.
""")

    d.bullets("Retro at close: the learning loop", [
        "Finals shipped, phase done: \"Run the retro.\" Every learning gets walked with you and gets a decision: promote to doctrine, keep engagement-specific, or discard.",
        "Actual hours go back to LOE_BASELINES.md. Patterns go to NETSUITE_PLAYBOOK.md. Tool findings go to CAPABILITIES.md. Products and fit signals go to PRODUCTS.md.",
        "A business decision never becomes playbook best practice unless you promote it at the triage.",
        "Same habit at end of day: \"Wrap up: update CONTEXT.md with today's decisions and what's open for next session.\"",
        "If deliverables/ holds finals and working/retro.md does not exist, the engagement owes its retro and the next session will offer it first.",
    ], notes="""
This is why the process gets better every engagement instead of drifting. ENGAGEMENT_LOG shows the retro debt per client.
""")

    d.table("Six human gates, one screen", ["#", "Gate", "What is being approved", "Why here"], [
        ["1", "Agenda", "The onsite one-pager, before it reaches the client.", "First thing the client sees"],
        ["2", "Findings", "The complete candidate register, evidence log and verification log, before a word is drafted.", "Materiality is a human judgment"],
        ["3", "Draft", "The humanized drafts, reconciled against the candidate register so nothing captured has quietly vanished.", "Last look before it becomes a file"],
        ["4", "LOE and commercial", "Every hours figure, every priority, and the billing language, line by line.", "Numbers become binding once sent"],
        ["5", "Execution: plan", "The implementation plan for a task, before any build starts.", "Design risk"],
        ["6", "Execution: production", "Each production deploy, individually.", "Live-account risk"],
    ], widths=[0.5, 2.4, 6.0, 3.0], size=12.5, notes="""
The gates sit where the liability sits. Four in discovery, two per task in execution.
The consultant is also in the loop between gates: the skill pauses and interviews you when it hits a material gap rather than writing a plausible sentence.
""")

    d.bullets("What the arc is actually doing", [
        "Read it as a whole and one pattern repeats at every stage: **capture exhaustively and cheaply, then put a human at the point where judgment or liability sits.**",
        "The machine's job is to make sure nothing is missing. The person's job is to decide what matters, what it costs, and what goes to the client.",
        "The same shape governs candidate work items, LOE figures and practice learnings alike. Nothing is dropped silently; a human disposes of a complete list.",
        "The retro at the end is what stops the whole thing being a dozen steps that produce the same quality forever.",
    ], featured=('stat', "Capture everything. Then a human decides."), size=17, notes="""
This is the one-sentence version of the whole system, and it is the thing to say if someone asks "so what is actually different about this?"
""")

    d.table("Enforced, not trusted", ["Mechanism", "What it does"], [
        ["Write guardrail", "Intercepts every NetSuite create, update and delete. A sandbox connection passes. A production connection forces an explicit human confirmation on every single write. A connection whose environment cannot be read from its name also stops. No production write happens silently."],
        ["Render gate", "Blocks a deliverable from rendering while the client-facing drafts still carry mechanical copy tells. Installed per client folder. Fails open, because a broken gate must never stop a delivery."],
        ["Copy scanner", "A deterministic scan behind the humanize pass. Every hit is cleared or consciously waived with a reason, and waived hits get raised at the review."],
        ["Engagement log", "Generated from what each engagement actually wrote to disk. Status reflects work done, and folders that drift from the standard shape get flagged."],
    ], widths=[2.3, 9.6], size=12.5, notes="""
Some rules are too important to leave as written instructions a session could talk itself past. These have mechanical backstops.
The write guardrail keys off the connection name, not the session folder. That is why the "- Prod" / "- SB" naming matters.
""")

    # ------------------------------------------------ exec summary
    d.section("03", "The weekly executive summary",
              "The status document that catches what slipped. Run before every status call, from the client's folder. Narrative live to the minute; hours as of the Monday morning pull.",
              notes="""
Called out on its own because it is the OS feature most of the room will use most weeks. Five to seven minutes.
""")

    d.prompt("What it is", [
        "Run from the client's folder, on the client's cadence, before every status call.",
        "Five sources: Asana, NetSuite hours, Gmail, the client's Drive folder, and meeting notes. Ask for a summary and it goes and gets all five.",
        "The recap is not the point. **The cross-reference is**: every meeting action item checked against the Asana open-task list, and the commitments that never became tasks listed with owner and meeting date. That is consistently where work slips.",
        "Output: a client-ready summary you review, plus the two follow-ups that turn it into action: a Gmail draft to the client contacts, and the missing Asana tasks created.",
        "No client folder, no summary. It says so and offers to set the client up rather than inventing a record.",
    ], prompts=[
        "Run the weekly executive summary for Teppermans.",
        "What happened on 44 Pro in the last two weeks?",
    ], size=14, notes="""
It also triggers on "exec summary", "client status report", "biweekly customer update", or a customer name plus "what happened".
""")

    d.two_col("Two windows, both stated on the page",
              ("Narrative window: through today", [
                  "Asana, Gmail, Drive and meeting notes are live to the minute.",
                  "What happened, up to the moment of writing.",
                  "Decisions, blockers, per-person action items, correspondence, documents delivered.",
              ]),
              ("Hours window: the trailing two full weeks", [
                  "Monday through the most recent completed Sunday.",
                  "**Where the hours come from.** A scheduled job reads Power Cloud's own NetSuite every **Monday at 09:30 ET** and writes each client's time entries into that client's folder. The summary reads that file, never NetSuite live.",
                  "**So the hours are only as current as what was logged in NetSuite when that Monday job last ran.** Time entered on Tuesday shows up the following Monday. Time never entered shows up never.",
                  "Every summary states its hours as-of date on the page. Never extend the window to today: a partial week reads as a real number while being understated.",
              ]),
              bottom=('stat', "Hours are stamped at the Monday 09:30 ET pull, and only what was in NetSuite by then. Never read a Friday summary's hours as current."),
              size=13.5, notes="""
Be explicit here: the hours are not live. They are a snapshot taken Monday morning of whatever the team had logged in NetSuite by then. Two consequences to say out loud: log your time before Monday morning or it is invisible for a week, and read the as-of date on the page before quoting an hours number to a client.
Announcement 4 lives here too. The per-client hours log was verified live on the August 24 Monday run, so say "live", not "rolling out".
Full weeks beat a rolling fourteen days because consecutive summaries stay comparable and nothing falls in a gap between them.
""")

    d.two_col("Two documents, not one",
              ("working/exec_summary_{date}.md: internal, never sent", [
                  "The full picture: the blunt health assessment, anything mined from internal-only meetings, every gap the cross-reference found.",
                  "Every material claim tiered: Verified, Reported, Inferred. The health verdict is Inferred and says so.",
                  "States which hours path was used and the data's as-of date, every time.",
                  "Drafted first and reviewed with you before anything renders.",
              ]),
              ("deliverables/{Client}_Executive_Summary_{date}.docx: client-facing", [
                  "Drafted from the internal one after you decide what carries: the health assessment as written, softened, or out.",
                  "Rendered branded through the OS toolchain, humanized, QA'd before delivery.",
                  "Safe by construction: separating the two means nothing candid reaches a client by accident.",
              ]),
              bottom=('stat', "No exec summary reaches a client without a consultant reading and approving it first. Permanent policy, not a training-wheels phase."),
              notes="""
Announcement 2. The two-document split is the same pattern as an assessment: working/ carries everything, deliverables/ carries what you approved.
""")

    d.bullets("It also shows you your own data quality", [
        "\"No next steps recorded\" is the Asana hygiene talking, not the client's project. Absence in Asana is verified absence in Asana, nothing more, and the summary says so instead of reporting an artifact.",
        "A blank status update reads as stalled and produces a false at-risk health call. Post the update.",
        "A completed week inside the hours window with no entries from someone who normally logs to that client is a finding, flagged by name, before anyone invoices. An absent current week is not; that is the submission rhythm.",
        "The cross-reference is unflattering on purpose. A commitment made in a meeting and never logged as a task is exactly what it exists to catch.",
        "ASANA_CONVENTIONS.md is the minimum hygiene the summary depends on: a task per commitment, an owner, a due date, a status update posted.",
    ], featured=('stat', "The summary is only as good as what you logged that week."),
        notes="""
Asana stays the interim system of record until the work layer replaces it. The hygiene conventions are short; read them once.
""")

    d.flow("How a run goes", [
        ("Say the line", "From inside the client's folder, in a named session."),
        ("It gathers", "Five sources. States the hours path and the as-of date."),
        ("Internal draft", "working/exec_summary_{date}.md, tiered, with the cross-reference."),
        ("You review", "Health verdict as written, softened, or out. What carries to the client."),
        ("Client version renders", "Branded .docx to deliverables/, humanized, QA'd."),
        ("Send, then act", "Gmail draft to the client. Missing Asana tasks created."),
    ], per_row=3, bottom=('quote', "Live option: open a recent internal draft in working/ next to its client-facing .docx in deliverables/ and show what did and did not carry across."),
        notes="""
LIVE DEMO CUE (optional): Teppermans Rapid Assessment has working/exec_summary_2026-08-28.md and deliverables/Teppermans_Executive_Summary_2026-08-28.docx.
Do not run the summary live; it takes several minutes across five connectors. Show the pre-run pair instead.
""")

    # ------------------------------------------------ case studies
    d.section("04", "Case studies",
              "Real professional-services work, one client, one problem, ten minutes each. Handed off to the presenters. Four questions each story answers: the customer problem, how Claude helped solve it, how it helped implement, what was better than before.",
              notes="""
Hand off here. Presenters talk over their own client folder or deliverable; slides optional. Hard 10-minute cap, Mike timekeeps, two-minute warning at 8:00.
Number 4 of the four questions is the one the room remembers: hours, days, the thing that would not have been caught, the client's reaction.
""")

    # ------------------------------------------------ announcements
    d.section("05", "Six announcements",
              "One or two sentences each. The how-to guide carries the detail.",
              notes="12 minutes for all six, in this order. The move to the new shared drive is not announced: nobody outside the pilot team knew the old location, and the pilot team already knows.")

    d.bullets("What changed", [
        "**1. The deck is the Presentation, not the Proposal.** We already have the work; the deck walks the client through findings. Filenames and documents now say Presentation.",
        "**2. Exec summaries are always human-reviewed.** No exec summary reaches a client without a consultant reading and approving it first. Permanent policy, not a training-wheels phase.",
        "**3. Client approval before build, dev review before testing.** No build starts until client approval is verified on the referenced Asana task; an email approval gets pasted onto the task with the source cited. Scripted work gets a dev-team review before it comes back to you for testing. Policy in effect now; the tool will enforce the gate soon.",
    ], size=14.5, notes="""
Item 3: announce as policy by convention. Do NOT present it as mechanically enforced; the gate is not built yet.
""")

    d.bullets("What changed, continued", [
        "**4. Hours in exec summaries are stamped Monday morning.** A job reads our NetSuite every Monday at 09:30 ET and writes each client's hours into their folder; summaries read that file. So the hours are only as current as what was logged in NetSuite by that Monday pull, and the window stops at the last completed Sunday. The narrative is live to the minute. Never read a Friday summary's hours as current, and log your time before Monday.",
        "**5. Feedback: when the tool annoys you, say so.** Type /feedback or say \"log this as feedback\" in any session; Claude writes the entry from what just happened and asks only what it cannot work out: time cost, blocked or not, every time or once. Everything gets triaged; nothing is silently deleted.",
        "**6. Session norms, the three that matter most.** One task, one session, started inside the client's folder. Name sessions client plus environment; paste the /rename line. You do not need the frontier model to write a PDF: escalate only when the default fails, and check your effort setting when a session feels slow. Hitting the $25 monthly credit limit is a signal, not a failure. Tell Mike.",
    ], size=14.5, notes="""
Item 4: the per-client hours log was verified live on the Aug 24 run, so "live" is accurate.
Item 5: FEEDBACK.md at the root currently shows two open entries, both from Justin. A folder dominated by one name says more about who is not reporting than about what is broken.
""")

    # ------------------------------------------------ the ask
    d.bullets("The ask: by end of next week, every consultant", [
        "**Step zero verified on your machine.** Drive for desktop opening the new path, Git, Python with the four packages, brand fonts installed for all users, Claude Code signed into your Power Cloud account with the workspace opened once. Already a prerequisite for today; if it is not done, grab time on my calendar and we do it together.",
        "**One of your own clients brought into the OS**: create the folder, drop in what you have, run session start, review the fact sheet and the consent pack it drafts. Then one real task in that folder, in a properly named session. An exec summary before your next status call is the natural one.",
        "**At least one /feedback entry** if anything got in the way. The tool only improves from what gets reported.",
    ], featured=('quote', "\"Proofread everything before it leaves the building. 'The AI wrote it' is the failure, not the defense.\""),
        size=16, notes="""
End on the ask, not on questions trailing off. Then open the floor.
""")

    d.closing("Questions", [
        "The workspace: G:\\Shared drives\\Power Cloud OS. Every session starts inside a client's folder there.",
        "The how-to guide: \"How to Work in the Power Cloud OS\" (PDF at the root). Part 5 is the menu of what to say.",
        "The longer capabilities guide: \"The Power Cloud OS\", linked from the how-to email.",
        "What is in flight: ENGAGEMENT_LOG.md. What is wrong with the tool: FEEDBACK.md. Both generated, read them, never edit them.",
        "Blocked on setup or access: Mike's calendar is open.",
    ], featured="The folder is the memory. You own what reaches the client.", notes="""
Open floor. Appendix slides follow for anything that comes up: the function menu, session habits, prompting patterns, the developer view, gotchas, the rules.
""")

    # ------------------------------------------------ appendix
    d.section("A", "Appendix", "Reference slides for the open floor and for reading later.")

    d.table("The menu, functions 1 to 6: what to say", ["Function", "When", "What you say"], [
        ["1. Set up a client", "No folder here yet; new client or first new work for an old one.", "\"New client. Run session start.\""],
        ["2. Prep a kickoff or onsite", "After the sales handoff, before you are in front of the client.", "\"Prep me for the kickoff call, and draft the questions we should send in advance.\""],
        ["3. Run the assessment", "Discovery sessions done, transcripts in source/.", "\"The interviews are complete. Produce the handover docs.\""],
        ["4. Execute approved work", "The client signed off; time to build.", "\"Let's start execution. Work on tasks O2C.3 and W.1.\""],
        ["5. Work a support ticket", "Ongoing clients, one-off fixes, the daily queue.", "\"Pull the Asana task 'Price tag reprint bug' and plan the fix.\""],
        ["6. Generate the exec summary", "Before every status call, on the client's cadence.", "\"Run the weekly executive summary for Teppermans.\""],
    ], widths=[2.6, 4.2, 5.1], size=12, notes="Say it your way; the skills carry the process. These are starting points.")

    d.table("The menu, functions 7 to 11", ["Function", "When", "What you say"], [
        ["7. Draft client communications", "Status updates, proceed-gates, billable-rework notices: wording with commercial weight. You send; it drafts.", "\"Draft a billable-rework notice for the reprint change. Factual, not apologetic.\""],
        ["8. Do data work", "Shopify or QuickBooks in the stack, or a migration on the table. Profile, design decisions, mapping spec, dry run, gated load.", "\"They sent their item master export. Profile it and flag the design decisions before we map anything.\""],
        ["9. Ask anything with full context", "Constantly. This is what folder-as-memory exists for.", "\"Based on everything in this folder, what should I know before tomorrow's call with their CFO?\""],
        ["10. Close out and learn", "Finals shipped, phase done, or end of day.", "\"Finals shipped. Run the retro.\""],
        ["11. Tell us the tool got in your way", "The moment it happens. The annoyance is forgotten by end of day.", "\"Log this as feedback.\"  or  /feedback"],
    ], widths=[2.6, 4.6, 4.7], size=12, notes="Function 9's habit: when a claim smells off, ask \"what's your source?\" and make it trace the answer back.")

    d.bullets("Session habits that separate the people who get a lot out of it", [
        "**One task, one session.** Files always survive; clearing erases conversation memory, never work.",
        "**Name your sessions** and **run several at once**: different clients, one task each. Named sessions are what make that manageable.",
        "**Brainstorm and plan together first.** Talk through the problem, challenge its approach, let it interview you. Your judgment matters most in the plan.",
        "**Then give it a chunk and walk away.** \"I'm away for two hours; work the plan, and where you'd normally ask me, use your best judgment and log the decision.\" Never watch it type; waiting is not billable.",
        "**Correct it out loud** and tell it to remember. That is how a correction becomes a rule instead of next week's repeat.",
        "**Read everything before you trust it.** Polished output at speed is exactly what makes skipping review tempting. When a guardrail prompt appears, read it.",
    ], size=14.5, notes="From Part 4 of the how-to guide.")

    d.bullets("Asking in a way that gets honest answers", [
        "**Context without leading.** Give everything you know, but not your preferred answer. Once your idea is in the prompt, the objectivity is gone.",
        "**Current state before design.** Make it explain how the thing works today before it proposes anything.",
        "**\"What's your source?\"** for any claim that smells off. Never \"are you sure?\", which just invites an apologetic reversal.",
        "**Do not hand it the escape hatch.** Say \"we can always check with the customer\" and it will take that exit instead of reasoning. Make it commit; you decide afterward whether the client weighs in.",
        "**Steelman the alternative.** After it proposes one approach, ask for the strongest case for a completely different one.",
    ], size=15, notes="PROMPT_PATTERNS.md at the root. Written down because they were expensive to learn.")

    d.bullets("For the developers in the room", [
        "Same folder, same guardrails. Build work lives in {Client}/execution/, sandbox first, SDF objects by default because they are versioned, diffable and revertible.",
        "**sdf-scaffold** stands up a SuiteCloud project to house standards; **sdf-deploy** validates and deploys with the account identity check and the two gates. SDF deploys on its own token, separate from the MCP connection.",
        "**ScriptReader**: four read-only tools (readScriptSource, listScripts, getScriptDeployments, readFile) plus the standardized MCP connection role. Standard install on every engagement, with the client's go-ahead, never deployed without it.",
        "Any net-new script, application or integration owes a **Use Case** before build and an **FDD & TDD** handover at ship. The customization-docs skill writes both, from any engagement type.",
        "**Dev review.** Scripted work gets a build-quality review before it returns to the consultant for testing. Policy now, tooling to follow.",
        "**Celigo** has its own skill: read-only flow inventory in discovery, error triage, and flow changes under the production gate. Shopify's own seventeen skills are installed rather than rewritten.",
    ], size=13.5, notes="Scripting is worth mentioning, not the focus. Point developers to the execution, sdf-scaffold, sdf-deploy and customization-docs skills.")

    d.bullets("Gotchas and quick fixes", [
        "**Paths**: quote them; the workspace path has spaces.",
        "**File looks empty**: Drive has not synced. Right-click, \"Available offline\".",
        "**python or git not recognized**: PATH issue; new PowerShell window or reinstall with the PATH box checked.",
        "**Wrong fonts in a render**: fonts installed per-user only. Install for all users; the variable Montserrat font substitutes unreliably, use the static weights.",
        "**Wrong NetSuite account**: Claude stops and asks. Do not override; fix the connection.",
        "**Sandbox looks quiet**: sandbox data is frozen at the last refresh. Not evidence of a production problem.",
        "**Never put client data in a web search.** Public identity (their website, history) is fine and expected; account data, configs and financials are not.",
        "**Usage limit reached**: tell Mike. Not a failure; it is how seat sizes get right-sized.",
    ], size=14, notes="Part 8 of the how-to guide.")

    d.bullets("The rules that never bend", [
        "**1. Read-only during discovery.** No writes to any client system during assessment or discovery. Writes happen in execution, sandbox first, human-gated.",
        "**2. No production write ever happens silently.** Every prod write forces an explicit confirmation. During discovery, the answer is decline.",
        "**3. Credentials never touch this Drive.** Tokens and secrets live on the connection holder's machine.",
        "**4. Everything client-facing gets human eyes before it ships.** You own what you send.",
        "**5. LOE numbers are commercially binding once sent.** Claude drafts them, a human owns them, line by line.",
        "**6. Consent is a record.** AI/MCP disclosure, installs and write authorizations get logged in CONTEXT.md with dates.",
        "**7. Check before create.** Folders, Asana projects, email groups: look for the existing one first.",
    ], size=14.5, notes="Part 6 of the how-to guide.")

    return d


if __name__ == "__main__":
    deck = build()
    out = deck.save(Path(sys.argv[1]) if len(sys.argv) > 1 else OUT)
    print(f"wrote {out} ({len(deck.prs.slides)} slides)")
