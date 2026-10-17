# -*- coding: utf-8 -*-
"""Fetch NetSuite time entries and split them per client folder.

WHY THIS EXISTS
---------------
The customer exec summary needs `timebill` rows from Power Cloud's own NetSuite
account. An MCP connection consumes a full user license and cannot be carried by
an Employee Center role (CAPABILITIES.md, verified twice), and consultants stay on
Employee Center. So the MCP path is available to full-seat holders only.

A token-based integration is not a user seat. It authenticates as an integration
record over SuiteTalk REST, the same posture SDF already uses for deploys. One
integration, one role, pulled centrally; consultants read the artifact this script
writes and never authenticate to NetSuite at all.

CREDENTIALS NEVER LIVE ON THE SHARED DRIVE (DATA_CONNECTORS.md rule 1). They come
from environment variables on the machine running the pull:

    NS_ACCOUNT          e.g. 1234567 (or 1234567_SB1 for sandbox)
    NS_CONSUMER_KEY     integration record
    NS_CONSUMER_SECRET
    NS_TOKEN_ID         access token for the integration user + role
    NS_TOKEN_SECRET

TIMING MATTERS. Time entries are not reliably submitted until the Monday after the
week they cover, so the default window stops at the most recent completed Sunday.
Run the pull on a Monday or later and both weeks in the window are settled. Running
it more than once for the same window is fine and is how late submissions get picked
up: the extract for a given period end is simply rewritten.

Usage, from the Power Cloud OS root:

    python .claude/scripts/fetch_time_entries.py --dry-run     # match report only, writes nothing
    python .claude/scripts/fetch_time_entries.py               # trailing two full weeks
    python .claude/scripts/fetch_time_entries.py --days 30
    python .claude/scripts/fetch_time_entries.py --client "MH Crane"

MAPPING NETSUITE CUSTOMERS TO CLIENT FOLDERS
--------------------------------------------
NetSuite customer names and folder names drift ("44 Pro Gloves" vs "44 Pro"). The
reliable fix is an explicit line in the client's CONTEXT.md:

    - NetSuite customer: 44 Pro Gloves

A client that bills to more than one job repeats the line, one job per line:

    - NetSuite customer: Harvest Hope Task Work
    - NetSuite customer: Harvest Hope Managed Services

Every declared name routes to that folder. Write the bare job name with nothing after
it; trailing prose becomes part of the match key and only works by containment luck.

Without it the script falls back to a conservative normalized match and REPORTS what
it could not place rather than guessing. Unmatched customers are printed so a human
can add the mapping; their rows are never written anywhere.

A client folder only ever receives its own rows. Firm-wide data is never written to
any client folder.

STATUS: authored 2026-08-18, NOT yet run against a live account. The OAuth 1.0a
signing and the SuiteQL pagination need first-run verification, and the result
belongs in CAPABILITIES.md either way.
"""
import argparse
import base64
import hashlib
import hmac
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

NOT_CLIENTS = {
    ".claude", "fonts", "logos", "templates", "Internal", "Archive",
    ".playwright-mcp", "execution",
}
RECORD_SUBFOLDERS = {"source", "working", "deliverables", "execution"}
PAGE_SIZE = 1000

SUITEQL = """
SELECT tb.id, tb.trandate, tb.hours, tb.memo, tb.isbillable,
       BUILTIN.DF(tb.employee) AS employee_name,
       BUILTIN.DF(tb.customer) AS customer_name,
       BUILTIN.DF(tb.item) AS item_name
FROM timebill tb
WHERE tb.trandate >= TO_DATE('{start}','YYYY-MM-DD')
  AND tb.trandate <= TO_DATE('{end}','YYYY-MM-DD')
ORDER BY tb.trandate
"""


# ---------------------------------------------------------------- credentials

def credentials():
    missing = [k for k in (
        "NS_ACCOUNT", "NS_CONSUMER_KEY", "NS_CONSUMER_SECRET",
        "NS_TOKEN_ID", "NS_TOKEN_SECRET") if not os.environ.get(k)]
    if missing:
        sys.exit(
            "Missing credentials in the environment: " + ", ".join(missing) +
            "\nThese are per-machine and never stored on the shared drive."
            "\nWithout them, run with --dry-run to see the folder match report only."
        )
    return {k: os.environ[k] for k in (
        "NS_ACCOUNT", "NS_CONSUMER_KEY", "NS_CONSUMER_SECRET",
        "NS_TOKEN_ID", "NS_TOKEN_SECRET")}


# ------------------------------------------------------------------ oauth 1.0a

def _quote(value):
    return urllib.parse.quote(str(value), safe="~")


def oauth_header(creds, method, url, query):
    """TBA (OAuth 1.0a, HMAC-SHA256). The JSON body is not signed; query params are."""
    params = {
        "oauth_consumer_key": creds["NS_CONSUMER_KEY"],
        "oauth_token": creds["NS_TOKEN_ID"],
        "oauth_signature_method": "HMAC-SHA256",
        "oauth_timestamp": str(int(time.time())),
        "oauth_nonce": base64.urlsafe_b64encode(os.urandom(24)).decode().rstrip("="),
        "oauth_version": "1.0",
    }
    signing = dict(params)
    signing.update({k: str(v) for k, v in query.items()})
    normalized = "&".join(
        "{}={}".format(_quote(k), _quote(signing[k])) for k in sorted(signing)
    )
    base = "&".join([method.upper(), _quote(url), _quote(normalized)])
    key = "{}&{}".format(
        _quote(creds["NS_CONSUMER_SECRET"]), _quote(creds["NS_TOKEN_SECRET"])
    ).encode()
    params["oauth_signature"] = base64.b64encode(
        hmac.new(key, base.encode(), hashlib.sha256).digest()
    ).decode()
    # realm is the account id, uppercased, and is not part of the signature
    parts = ", ".join(
        '{}="{}"'.format(k, _quote(v)) for k, v in sorted(params.items())
    )
    return 'OAuth realm="{}", {}'.format(creds["NS_ACCOUNT"].upper(), parts)


def run_suiteql(creds, sql):
    """POST the query, following NetSuite's offset pagination until exhausted."""
    host = creds["NS_ACCOUNT"].lower().replace("_", "-")
    url = "https://{}.suitetalk.api.netsuite.com/services/rest/query/v1/suiteql".format(host)
    rows, offset = [], 0
    while True:
        query = {"limit": PAGE_SIZE, "offset": offset}
        full = "{}?{}".format(url, urllib.parse.urlencode(query))
        body = json.dumps({"q": sql}).encode()
        req = urllib.request.Request(full, data=body, method="POST")
        req.add_header("Content-Type", "application/json")
        req.add_header("Prefer", "transient")
        req.add_header("Authorization", oauth_header(creds, "POST", url, query))
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                payload = json.loads(resp.read().decode())
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode(errors="replace")[:800]
            sys.exit("NetSuite returned {}: {}\n{}".format(exc.code, exc.reason, detail))
        items = payload.get("items", [])
        rows.extend(items)
        if not payload.get("hasMore") or not items:
            break
        offset += PAGE_SIZE
    return rows


# ------------------------------------------------------------------- matching

def normalize(name):
    return re.sub(r"[^a-z0-9]", "", (name or "").lower())


def client_folders(root):
    """Client records, including custom projects nested one level down.

    Returns (folder, [names it may be known by in NetSuite]). A nested project also
    carries its PARENT client's name, because NetSuite bills the client, not the
    project: "Promotions Issues" is never a customer, "Teppermans" is.
    """
    found = []
    for child in sorted(root.iterdir(), key=lambda p: p.name.lower()):
        if not child.is_dir() or child.name in NOT_CLIENTS or child.name.startswith("."):
            continue
        if (child / "CONTEXT.md").is_file():
            found.append((child, [child.name]))
        for sub in sorted(child.iterdir(), key=lambda p: p.name.lower()):
            if (sub.is_dir() and not sub.name.startswith(".")
                    and sub.name.lower() not in RECORD_SUBFOLDERS
                    and (sub / "CONTEXT.md").is_file()):
                found.append((sub, [child.name, sub.name]))
    return found


def declared_customers(folder):
    """Every `- NetSuite customer:` name declared in a CONTEXT.md, as a list.

    A client can bill to several jobs (`Harvest Hope Task Work` and `Harvest Hope
    Managed Services` are one client), so the line may repeat, and one line may list
    several comma separated. This mirrors readNetsuiteCustomer_() in the Apps Script
    that does the real Monday delivery; the two must agree or the manual fallback
    routes differently from the server.
    """
    try:
        text = (folder / "CONTEXT.md").read_text(encoding="utf-8", errors="replace")
    except OSError:
        return []
    names = []
    for raw in re.findall(r"^\s*[-*]\s*NetSuite customer:\s*(.+?)\s*$", text, re.I | re.M):
        value = raw.strip()
        if not value or value.startswith("{"):
            continue
        for part in value.split(","):
            part = part.strip()
            if part and part not in names:
                names.append(part)
    return names


def build_index(records):
    """normalized name -> list of folders. A declared name replaces the guesses."""
    index, declared = {}, {}
    for folder, names in records:
        stated = declared_customers(folder)
        keys = [normalize(n) for n in stated] if stated else [normalize(n) for n in names]
        if stated:
            declared[folder] = stated
        for key in keys:
            if key:
                index.setdefault(key, [])
                if folder not in index[key]:
                    index[key].append(folder)
    return index, declared


def match(customer, index):
    """Exact normalized match, else conservative containment. Returns a list.

    Several folders legitimately share one customer (an assessment record plus that
    client's custom projects), so every match is written rather than treated as an
    ambiguity.
    """
    key = normalize(customer)
    if not key:
        return []
    if key in index:
        return list(index[key])
    hits = []
    for k, folders in index.items():
        if len(k) >= 5 and (k in key or key in k):
            for f in folders:
                if f not in hits:
                    hits.append(f)
    return hits


# --------------------------------------------------------------------- output

def trailing_two_full_weeks(today):
    """Through the most recent completed Sunday, back 14 days.

    This is the boundary of trustworthy data, not a formatting choice. Time entries
    are not reliably submitted until the Monday after the week they cover, so any
    window running past the last completed Sunday includes a partially-submitted
    week and understates hours while looking like a real total.
    """
    end = today - timedelta(days=(today.weekday() + 1) % 7 or 7)
    return end - timedelta(days=13), end


def write_extract(folder, rows, meta):
    out = folder / "working"
    out.mkdir(exist_ok=True)
    path = out / "time_entries_{}.json".format(meta["period_end"])
    payload = dict(meta)
    payload["client_folder"] = folder.name
    payload["entry_count"] = len(rows)
    payload["total_hours"] = round(sum(float(r.get("hours") or 0) for r in rows), 2)
    payload["entries"] = rows
    path.write_text(json.dumps(payload, indent=2, default=str), encoding="utf-8")
    return path


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[2])
    ap.add_argument("--days", type=int, help="rolling window instead of trailing two full weeks")
    ap.add_argument("--since", help="explicit start date, YYYY-MM-DD")
    ap.add_argument("--client", help="write only this client folder")
    ap.add_argument("--dry-run", action="store_true",
                    help="report folder matching and write nothing (works without credentials)")
    args = ap.parse_args()

    today = date.today()
    if args.since:
        start, end = datetime.strptime(args.since, "%Y-%m-%d").date(), today
    elif args.days:
        start, end = today - timedelta(days=args.days), today
    else:
        start, end = trailing_two_full_weeks(today)

    records = client_folders(args.root)
    if args.client:
        records = [(f, n) for f, n in records if f.name.lower() == args.client.lower()]
        if not records:
            sys.exit("No client folder named {!r}".format(args.client))
    index, declared = build_index(records)
    folders = [f for f, _ in records]

    print("Window: {} to {}".format(start, end))
    print("Client folders: {} ({} with an explicit NetSuite customer line)".format(
        len(folders), len(declared)))

    if args.dry_run:
        print("\nDry run. Folders and how they will be matched:")
        for folder, names in records:
            stated = declared.get(folder)
            how = ("declared: " + ", ".join(repr(n) for n in stated) if stated
                   else "guessing from: " + ", ".join(repr(n) for n in names))
            print("  {:<34} {}".format(folder.name[:34], how))
        return

    creds = credentials()
    rows = run_suiteql(creds, SUITEQL.format(start=start, end=end))
    print("Pulled {} time entries.".format(len(rows)))

    meta = {
        "pulled_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "period_start": str(start),
        "period_end": str(end),
        "netsuite_account": creds["NS_ACCOUNT"],
        "source": "fetch_time_entries.py (SuiteTalk REST SuiteQL, token auth)",
    }

    grouped, unmatched = {}, {}
    for row in rows:
        targets = match(row.get("customer_name"), index)
        if not targets:
            key = row.get("customer_name") or "(no customer)"
            unmatched[key] = unmatched.get(key, 0) + 1
            continue
        for folder in targets:
            grouped.setdefault(folder, []).append(row)

    for folder, client_rows in sorted(grouped.items(), key=lambda kv: kv[0].name.lower()):
        m = dict(meta)
        m["customer_names_matched"] = sorted(
            {r.get("customer_name") for r in client_rows if r.get("customer_name")})
        path = write_extract(folder, client_rows, m)
        print("  {:<45} {:>4} entries -> {}".format(
            folder.name, len(client_rows), path.relative_to(args.root)))

    if unmatched:
        print("\nNOT written, no client folder matched. Add a `- NetSuite customer:` line")
        print("to the right CONTEXT.md and rerun:")
        for name, count in sorted(unmatched.items(), key=lambda kv: -kv[1]):
            print("  {:>4} entries  {}".format(count, name))


if __name__ == "__main__":
    main()
