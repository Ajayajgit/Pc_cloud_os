# Lessons

## SDF: get the schema from the CLI jar, don't guess element names
`~/.suitecloud-sdk/cli/cli-<version>.jar` contains `sdf_metadata/sdf_metadata.xml`
(every recordtype, its exact fields, enums, feature dependencies) and
`sdf_metadata/list/*.xml` (every enum's valid values). Extract and grep it
BEFORE hand-writing object XML.

```bash
unzip -o -q ~/.suitecloud-sdk/cli/cli-2026.1.0.jar "sdf_metadata/*" -d /tmp/sdfmeta
# then grep for: <recordtype name="transactionbodycustomfield">
```

Two mistakes this would have caught immediately on the AF project:
- **`transactionbodycustomfield` applies-to elements are `bodysale`, `bodypurchase`,
  `bodyjournal`** — NOT `appliestosale`/`appliestopurchase`. The `appliesto*`
  naming belongs to `entitycustomfield`. SDF reports these as "invalid or not
  supported" warnings, not errors, so they silently do nothing.
- **`displaytype` valid values are HIDDEN, LOCKED, NORMAL, SHOWASLIST, STATICTEXT.**
  `DISABLED` and `INLINE` are both rejected. For a system-maintained field that
  should display but never be typed into, the value is **LOCKED**.

Also from the metadata: `custbody` scriptid max length is 38 chars.

## SDF: `suitecloud.config.js` is what defines `defaultProjectFolder`
`project.json` holds `defaultAuthId` only. Deleting `suitecloud.config.js`
makes every command look for `manifest.xml`/`Objects/` at the repo root and
fail with `"manifest.xml was not found in the project"`.

## SDF: verify account contents with `object:list`, not `object:import`
`object:import --destinationfolder` fails on this setup with
`"Objects must be placed under the Objects folder or any of its subfolders"`
for every path form tried (`/Objects`, `Objects`, `src/Objects`,
`/Objects/sub`), with the folder present and `suitecloud.config.js` correct.
Root cause not yet identified — do not burn time on path variants.

To answer "does this object exist in the account?", use:
```bash
suitecloud object:list --type customrecordtype
```
It is authoritative, fast, and needs no destination folder.

## The MCP NetSuite connection cannot query custom records in this account
Both new records returned `Record ... was not found` from SuiteQL and a 404
from the REST metadata-catalog, while `custbody_*` fields added in the SAME
deploy were immediately queryable. That asymmetry looked exactly like metadata
propagation lag, and I called it that twice. It was wrong.

**The control test settles it in one query**: pick a custom record that has
existed for a long time and query it through the same connection.

```
SELECT COUNT(*) AS n FROM customrecord_ach_config   -- long-predates this work
-> Record 'customrecord_ach_config' was not found
```

The MCP integration role cannot see ANY custom record here. Nothing was wrong
with the deploy, and no amount of waiting would have fixed it.

**Never diagnose "propagation lag" without a control query on something old.**
Verify deployed objects with `suitecloud object:list`, and expect scripts
running as Administrator to see records the MCP connection cannot.

## Prefer a date over a stored day-count
`custbody_pc_af_days_unapproved` would have been wrong every day after import.
Store `custbody_pc_af_first_unappr` (date) and compute days in the saved-search
formula. Any stored value that is a function of "now" decays silently.

## The Bash tool collapses backslashes in heredocs - use Write for code files
A heredoc containing \\uFEFF arrives in the script as \uFEFF, and a
JS file full of regexes (\d, \r, \n) is silently corrupted. One heredoc also
died outright with "unexpected EOF while looking for matching quote".

**Write JS/TS/regex-heavy files with the Write tool, not `cat <<EOF`.**
For surgical edits from Python-over-Bash, build escapes with `chr(92)` rather
than typing a backslash. Symptom to watch for: an edit that reports success but
reads back unchanged.

## SDF deploy.xml file paths are directory globs, not extension globs
`<path>~/FileCabinet/.../lib/*</path>` is valid.
`<path>~/FileCabinet/.../*.js</path>` fails local validation with
`the file ... referenced by object field "path" is missing`.

To keep a `tests/` folder in the repo but out of the File Cabinet, list the
deployable directories explicitly instead of globbing the feature root - `*`
recurses into subfolders and would sweep the tests in.

## Never guess `selectrecordtype`. Check for a purpose-built fieldtype first.
First live run died on:
`You have entered an Invalid Field Value 61898 for the following field: custrecord_pc_afil_file`

I had written a file-pointer field as `SELECT` + `<selectrecordtype>-10</selectrecordtype>`,
guessing -10 meant Document. It does not. Both local AND server validation
passed it - the code is structurally valid, it just points at the wrong record
type, and nothing catches that until a real save.

**There is a `DOCUMENT` fieldtype.** It references a File Cabinet file natively
with no `selectrecordtype` at all. Before reaching for SELECT, check the
fieldtype enum:

```bash
grep -oE "<value>[A-Z]+</value>" sdfmeta/sdf_metadata/list/generic_customfield_fieldtype.xml
# CHECKBOX CLOBTEXT CURRENCY DATE DATETIMETZ DOCUMENT EMAIL FLOAT HELP IMAGE
# INLINEHTML INTEGER MULTISELECT PASSWORD PERCENT PHONE RICHTEXT SELECT TEXT
# TEXTAREA TIMEOFDAY URL
```

`generic_customfield_selectrecordtype.xml` lists the legal codes but gives them
NO labels, so it cannot confirm a guess. It does confirm some via `feature`
attributes - that is how `-7` was verified as JOBS. Codes actually confirmed on
this project: **-7 Job, -30 Transaction**. Unverified and still in use: -4
(employee). Anything else, find a native fieldtype or verify against a real
record before deploying.

## An invalid field value surfaces at save(), not setValue()
Wrapping `setValue` in try/catch does nothing. To make an optional field
non-fatal, catch at `save()`, clear the field, and save again:

```js
try { return rec.save(); }
catch (e) {
    if (params.fileId) { rec.setValue({fieldId: FILE, value: ''}); return rec.save(); }
    throw e;
}
```

General rule: an audit convenience must never be able to abort the work it is
describing.

## Changing a custom field's fieldtype: deploy twice to confirm
SDF reported `WARNING -- potential issues were found during custom object
update` on the SELECT-to-DOCUMENT change. Re-running the deploy came back
clean, which is the signal the account now matches the XML. A warning that
persists across a second deploy is the one to worry about.

## Verify writes by querying them back. "It looks stamped" is not verification.
The first successful live import reported "9 invoices stamped" and looked
correct on screen. Querying the result showed three of four fields written
correctly and **`custbody_pc_af_ts_id` null on every single one.**

Cause: `buildDiff` built its entry object with the id only at `entry.row.afId`,
while four consumers read `entry.afId` - the invoice stamp, two error messages,
and both preview tables. `undefined` was passed to `submitFields`, which did not
error. The preview's AF ID column was blank the whole time and nobody noticed,
because the summary tiles were being checked instead.

Three things follow:
- **A silent write failure looks exactly like success.** Always read the record
  back and check EVERY field, not the ones you expect to be interesting.
- **Guard optional writes**: `if (afId) { values[FIELD] = afId; }`. Writing
  undefined blanks a field instead of failing, which is the worst outcome.
- **Prove a regression test fails without the fix.** Reintroduce the bug, watch
  it go red, restore. A test asserting a property that is always present is
  worthless and indistinguishable from a real one until you check.

Duplicating a key onto a parent object is a smell worth avoiding, but where
consumers already read it, make it exist rather than fixing four call sites.

## Closed accounting periods block body-field writes on historical transactions
Any backfill that stamps custom fields across transaction history will hit
closed / AR-locked periods and throw per record. Scope backfills to the OPEN
window from the start rather than discovering this from a wall of errors.

Anchor the window to real data (e.g. "the earliest record this feature has
already touched"), computed per run, rather than a hardcoded date that rots.

Note the MCP connection could not read `accountingperiod` at all, so a
period-close join could not be verified before writing it - which made the
data-anchored floor the right call over a smarter query built on a guess.
