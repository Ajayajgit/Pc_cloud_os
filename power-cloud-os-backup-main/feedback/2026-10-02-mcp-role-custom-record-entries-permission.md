---
date: 2026-10-02
from: ron
source: Bomb Party
area: CAPABILITIES.md MCP role guidance, CLAUDE.md session start step 5, customrole_pc_mcp_ai_connection role template
type: friction
cost: 30m
blocking: no
frequency: first-time
class: wrong
autonomy: n-a
status: new
---

## What happened
[Verified] SuiteApp configuration records are unreadable through the MCP connector, with a
misleading error, because the permission that grants them sits on a different role subtab than the
obvious one.

The task was ordinary verification work: read the WMS SuiteApp's own configuration records in the
client's production account, to confirm whether the Enable Warehouse Management system rule was
active and to settle a NetSuite behavior claim made on a call.

Every WMS custom record returned the same error: `Record 'customrecord_wmsse_sysrules' was not
found`. The record types were plainly present, because querying the `customrecordtype` catalog
listed all 62 of them by script id and name. So the catalog said the records exist and the data
query said they do not.

Ron added permissions for the WMS records under the role's **Permissions > Custom Records** subtab.
No change. Disconnected and reconnected the connector, which ruled out a cached role context since
the account id, environment and role id all came back identical. Still no change.

Root cause, found by reading the record type definition itself: all 62 WMS record types carry
`usepermissions = F` and `nopermissionrequired = F`, which is NetSuite's third access model,
**Require Custom Record Entries Permission**. Oracle is explicit that the Custom Records subtab on a
role only takes effect when a record type's Access Type is "Use Permission List". For these record
types the access is granted instead by the **Custom Record Entries** permission on the role's
**Lists** subtab. Per-record grants under Permissions > Custom Records do nothing at all for them.

This is not specific to this client or to WMS. Bundled SuiteApp record types commonly ship with the
default access model, so the same wall is waiting on any engagement that needs to read a SuiteApp's
configuration records through MCP.

**Two things made this cost more than it should have.**

First, the failure is silent and misreported. "Record was not found" reads as missing data, not as a
permission wall, and the natural next move is to doubt the record name, the query, or whether the
SuiteApp is really installed. CAPABILITIES.md already documents this exact failure signature for
ad-hoc connector roles against **standard** tables, but says nothing about the custom record case or
about which subtab grants it.

Second, nothing in the guidance names the Custom Record Entries permission. A consultant who reads
the error correctly as a permission problem still lands on the wrong subtab, because Permissions >
Custom Records is the obvious place to grant access to custom records.

Related, same role template, different symptom:
`2026-09-17-scriptreader-coreadminpermission-blocks-oauth2.md`.

**The diagnostic that worked**, and that would have saved the whole detour if it were written down:

```sql
SELECT scriptid, usepermissions, nopermissionrequired
FROM customrecordtype WHERE LOWER(scriptid) LIKE '%<suiteapp prefix>%'
```

`usepermissions = T` means grant it on Permissions > Custom Records. Both `F` means grant Custom
Record Entries on Permissions > Lists. This is readable without any custom record permission at all,
so it works from exactly the position a blocked consultant is in.

A second gap surfaced alongside it: the connector role also lacks **Set Up Company**, so
`getAccountInfo` returns a blank company name and legal name. That is the field CLAUDE.md has us
pull at session start to confirm the connected account belongs to this client. Without it the check
falls back to recognizing the location list by eye, which is slower and weaker. Worth noting that
the identity check had already caught a wrong-account connection earlier in the same session, so it
is not a theoretical concern.

## What I did instead
Diagnosed it to the Custom Record Entries permission on the Lists subtab, which Ron had not yet
applied at the time of writing. The WMS feature verification was completed by other means, inferring
enabled features from transaction and configuration data rather than from the SuiteApp's own records,
so the engagement was not blocked. The Enable Warehouse Management system rule value remains
unconfirmed.

## Suggested fix
- [Reported] Ron: raise the MCP role setup with Mike and Ali; agreed it was worth logging here so the
  guidance improves rather than being solved once per person.
- [Inferred] Claude, three options, not mutually exclusive:
  1. **Add the Custom Record Entries requirement to CAPABILITIES.md**, next to the existing ad-hoc
     role signature, with the `customrecordtype` diagnostic query above. Cheapest, and it targets the
     document a blocked consultant already reaches for.
  2. **Confirm `customrole_pc_mcp_ai_connection` grants Custom Record Entries (View) and Set Up
     Company**, and add both to the template if not. The standard role is supposed to make
     hand-tuning unnecessary; this engagement hand-tuned because the connection was on an ad-hoc role,
     and the fix is only durable if the template already covers it.
  3. **Have session start surface it.** CLAUDE.md step 5 already checks for the Script Reader
     toolset; it could also check that company info resolves and that a custom record read succeeds,
     so the gap is found at session start rather than mid-verification.

  Worth flagging for whoever triages: Custom Record Entries is a **broad** permission. It covers
  every record type using the default access model, not just the ones intended. View level is
  sufficient for read-only discovery and nothing in the workflow needs Edit or Full on a production
  connector role, so whatever lands here should say that explicitly.

## Disposition
