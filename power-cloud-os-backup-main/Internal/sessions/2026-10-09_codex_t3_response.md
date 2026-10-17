# Codex read-only second opinion on the T3 packet (2026-10-09)

> Run by the orchestrator (session bb920280) with `codex exec --sandbox read-only` on `Power Cloud NS/CRM/docs/T3_packet.md` plus PLAN.md. Advisory only; disposition in `CRM/build_log.md` (2026-10-09, T3 packet entry). The raw transcript is `2026-10-09_codex_t3_response_raw.md`.

Reviewed the packet, the existing local ledger/builder/readiness/user-event code, and Oracle documentation. No edits or account execution.

1. **Blocker — Channel mapping is writable by ordinary internal roles.**  
   **Text:** “`customrecord_pc_channel_map` (NONENEEDED).”  
   This grants internal users create/read/update/delete access, not merely reference-data visibility. A user could redirect billing or delete mappings; the existing duplicate check does not prevent that. **Fix:** use a permission list with VIEW for consumers and EDIT for designated maintainers; prohibit deletion. [Oracle permission model](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/bridgehead_N2879432.html)

2. **Blocker — Testing status does not enforce the T8 approval gate.**  
   **Text:** “Both deployments stay TESTING until T8”; disabled-actions parameter “blank by default.”  
   Oracle documents RESTlet Testing execution for the owner and specified audience. Authorized credentials could therefore mutate production before T8. **Fix:** deploy disabled, or default all mutations to disabled and enable them explicitly at T8. [Oracle RESTlet deployment behavior](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_160514060027.html)

3. **Should-fix — Permissions exceed the described operations.**  
   **Text:** “Permissions, exact keys and levels”; `FULL` record permissions; `LIST_TASK`; `ADMI_RESTWEBSERVICES`; travel ledger `VIEW`.  
   No action deletes records or uses ordinary CRM Tasks. Travel never reads the ledger. REST Web Services is separate from RESTlets. **Fix:** remove those unused grants; start mutable records/ledger at EDIT, create-only records at CREATE, and Perform Search at VIEW. Test whether SuiteScript VIEW is actually required for invocation; it grants script/deployment visibility. [RESTlet distinction](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_1529417663.html), [SuiteScript permissions](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_0403053450.html)

4. **Blocker — The RESTlet allowlist does not make this “the one write path.”**  
   **Text:** “the one write path for the sales process”; “No `recordrestrictions`”; sales role also assigned to the Suitelet audience.  
   Users holding this unrestricted role can change opportunities and ledger rows through other permitted interfaces, bypassing transitions and falsifying replay results. **Fix:** separate human and integration roles, restrict alternate access, and enforce critical status/UUID/ledger invariants at record level. Keep Web Services Only **F**: setting it to T would break RESTlets. [Oracle authentication restriction](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_157780293862.html)

5. **Should-fix — Runtime permission dependencies are incomplete.**  
   **Text:** “Nothing else on either role: no `customrecord_navan_config` access”; “No `N/https` (the RESTlet calls no host).”  
   The existing builder reads that configuration and calls HTTPS for non-test projects. It will lose refresh functionality under the proposed sales role. The ledger also searches `customlist_pc_ol_status`. **Fix:** provide sales-only configuration VIEW or move the URL into narrowly accessible configuration; authorize the calling scripts for the secret. Verify Custom Lists VIEW (`ADMI_CUSTLIST`) and CRM Lists VIEW (`ADMI_CRMLIST`) for the selected list-validation searches. Test real employee, item, customer and email-join access under each role.

6. **Should-fix — Suitelet audience changes are incomplete.**  
   **Text:** “audience `ADMINISTRATOR|[scriptid=customrole_pc_crm_sales_write]`.”  
   This omits the accountant role required by T2. The existing Suitelet also checks `custscript_pc_sl_allowed_roles`, which section 8 does not populate. **Fix:** reconcile deployment audience, that parameter, and the intended human callers; verify caller authorization when executing as the sales role.

7. **Blocker — Failed-row retries can repeat committed mutations.**  
   **Text:** “`failed`: … run the action again; every action is idempotent by external id.”  
   `updateOpportunity` and `closeOpportunity` have no external-ID mutation claim. If close succeeds but `done()` fails, retry refuses the now-closed record. Retrying an older update or `logTouch.nextContact` can overwrite newer changes. **Fix:** persist operation-specific intent/checkpoints and a request marker with the target mutation, then recover committed results without rewriting them. Test failure immediately after every business save and before every ledger update.

8. **Blocker — Reopening a ledger row is not an atomic execution claim.**  
   **Text:** “`ledgerLib.reopen(rowId)`”; “`pending`: `PC_API_IN_PROGRESS`.”  
   The current `reopen()` blindly submits pending. Two retries can both resume; a process killed before `fail()` leaves pending forever. Initial external-ID uniqueness solves neither problem. **Fix:** introduce exclusive recovery ownership and stale-pending reconciliation, preferably through a serialized worker or another proven locking mechanism. Never reclaim merely because a timeout elapsed while another worker may still run.

9. **Blocker — `createProject` cannot meet the common replay response contract.**  
   **Text:** “The RESTlet never claims a ledger row for `createProject`”; “`refused` maps to `PC_API_NOT_READY`.”  
   The builder returns indistinguishable refusals for hash mismatch, pending, and readiness; a stored success has no replay metadata. Consequently A10 and `replayed: true` cannot be implemented reliably. **Fix:** retain one claim owner, but extend the builder return contract with typed outcomes, replay metadata, row ID and step. Do not infer codes from human-readable reasons.

10. **Should-fix — Project hashing does not freeze the work being resumed.**  
    **Text:** “hash `sha256("{action}:{oppId}")`.”  
    This covers the current API payload, but project/task creation actually consumes mutable opportunity fields. A partial retry can combine old project values with new staffing/tasks. Suitelet `create` versus `resume` also changes the hash for the same logical operation. **Fix:** define one versioned project-operation identity and persist its source snapshot, or explicitly reject source changes during incomplete setup.

11. **Should-fix — Canonicalization and replay precedence are underspecified.**  
    **Text:** “`sha256Hex(action + ':' + canonicalJson(payload))`”; payload validation precedes claim.  
    Accepted equivalents such as numeric/string IDs and UUID case can hash differently. Revalidating live references before replay can reject a completed request after a referenced employee becomes inactive. **Fix:** normalize into a versioned command before hashing; perform structural validation first, inspect existing replay state next, and perform mutable reference/business validation only for new or resumed work. Persist defaults such as “today” once.

12. **Should-fix — Business UUID reuse silently accepts conflicting intent.**  
    **Text:** “if found return `{opportunityId, created: false}` without writing”; contacts use `pc_contact_{clientUUID}_{i}`.  
    Another request can reuse a deal/client UUID with different entity, company or contact data. Reordering contacts makes index-based identity attach the wrong existing contact. **Fix:** bind each business UUID to immutable creation intent; reject conflicts. Preserve an immutable contact array or use stable contact UUIDs. Verify existing contacts belong to the expected customer.

13. **Should-fix — Errors before action execution escape the response contract.**  
    **Text:** step 5 performs claim/reopen; step 6 says “Run the action inside try/catch.”  
    Lookups, claim, reopen and parameters can throw before that catch. `fail()` can itself throw and replace the original error. **Fix:** wrap the entire entry point, track ledger ownership, and protect failure recording separately. Locate existing ledger rows by immutable `externalid`, rather than the current library’s mutable `name`.

14. **Blocker — Status checks race with status writes.**  
    **Text:** “read the current `entitystatus` with lookupFields first”; “One `submitFields`.”  
    Concurrent won/lost or update/close requests can both pass an open-state check and then overwrite each other, including moving out of a terminal status. `submitFields` supports opportunity `entitystatus`; it simply provides no compare-and-set condition. **Fix:** serialize mutations per opportunity and recheck under that ownership, with record-level protection for other writers. [Opportunity field support](https://system.netsuite.com/help/helpcenter/en_US/srbrowser/Browser2026_1/script/record/opportunity.html)

15. **Blocker — The status machine has an unreachable completion and an invalid-type escape.**  
    **Text:** “`noProject` sets `entitystatus` 13, otherwise 24”; createProject calls the creation builder.  
    `{unmapped:true}` incorrectly becomes 24. Nothing implements the convention’s builder-owned 23→13 transition; the existing builder stops at 25. **Fix:** reject missing/unmapped engagement types and specify the authorized completion trigger for 23→13. Explicitly permit recovery at 25 when setup committed but its ledger did not finish—the existing readiness library already does this.

16. **Should-fix — Creation depends on undocumented defaults and a fail-open user event.**  
    **Text:** “`entityStatusId` (optional…)”; “the user event sets Billing Party”; “No subsidiary is set.”  
    An omitted status is not guaranteed to be in the open set. The existing UE logs most failures and continues saving. Connector visibility does not establish whether subsidiary, currency or other mandatory defaults are valid. **Fix:** set an explicit open default, validate account-specific mandatory/default behavior, and make billing resolution failures reject API creation or verify the invariant before reporting success.

17. **Blocker — The opportunity search uses an unsupported filter contract.**  
    **Text:** “look up `opportunity` … `(filter mainline is T)`.”  
    The Opportunity search schema does not list `mainline`; the Transaction search schema does. The existing UUID-checking UE repeats this assumption. **Fix:** remove it from Opportunity searches, or use a Transaction search with explicit Opportunity type and mainline filters. Verify the chosen search in 2026.2. External IDs are unique across the transaction family, not just opportunities. [Opportunity search fields](https://system.netsuite.com/help/helpcenter/en_US/srbrowser/Browser2026_1/script/record/opportunity.html), [shared external IDs](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_N3436356.html)

18. **Blocker — Sorting after pagination cannot prevent missing rows.**  
    **Text:** “`search.load({id})`, then `runPaged`”; “Sort the remaining rows by `projectId` ascending.”  
    NetSuite requires a unique, unambiguous sort **in the search definition before paging**. **Fix:** establish internal-ID ordering on the loaded search before `runPaged`, preserving criteria and column metadata. Require one row per project or add a unique tie-breaker for joined rows. Account for results changing during traversal. [Oracle pagination requirements](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4486596158.html)

19. **Should-fix — Exclusion silently fails beyond 1,000 projects.**  
    **Text:** exclusion search “bounded to 1000 rows.”  
    Flagged projects outside that result window leak into travel output. **Fix:** page the exclusion search or query exclusion flags in batches for the returned project IDs. Define `excluded` as removed output rows versus distinct projects.

20. **Should-fix — Search-column guessing can return the wrong approver.**  
    **Text:** Email fallback is “the first column whose `name` contains `email`”; blank becomes null.  
    A missing, duplicate or inaccessible Email column becomes indistinguishable from a genuinely empty email; an unrelated joined email may be selected. **Fix:** require one validated Name and Email column, retain their complete `search.Column` objects for `getValue(column)`, and reject schema ambiguity. Freeze Email’s join/formula and verify permissions. Amend the plan’s “Internal ID” label to the confirmed “ID.”

21. **Should-fix — Phone-call validation exceeds the documented subject limit.**  
    **Text:** “`title` (text 1..300)”; phone-call fields confirmed through SuiteQL.  
    Phone Call subject is documented as at most 100 characters. SuiteQL columns do not establish SuiteScript setters, defaults or value enums. **Fix:** cap title at 100; verify message capacity and `'COMPLETE'` through SuiteScript; establish required organizer/defaults; set completion date for historical completed calls; validate contact/company association. `externalid` and `transaction` are documented fields. [Phone Call Records Browser](https://system.netsuite.com/help/helpcenter/en_US/srbrowser/Browser2025_2/script/record/phonecall.html)

22. **Should-fix — Generic select validation is not implementable as written.**  
    **Text:** “Select ids are checked … on the record type named in 4.4 (`isinactive` must be F).”  
    Several list types are unnamed; opportunity does not expose a generic inactive flag; lookup checkbox values are booleans. **Fix:** provide a per-field validator table covering record/list type, allowed values, active semantics and returned shapes. Include engagement type, commercial model, win/loss reason, eligible project resources and contact relationships. Distinguish inaccessible records from broken search/schema permissions internally.

23. **Should-fix — Numeric, URL and matching validation remains ambiguous.**  
    **Text:** money has “two decimals or fewer after rounding”; hours are “number at or above 0”; URLs are text; domain matching uses `contains`.  
    Rounding first accepts excessive precision; hours lack finite/max checks; substring matching accepts lookalike domains. **Fix:** define finite bounds and decimal policy before conversion, accepted URL schemes, exact parsed domain/subdomain rules, and explicit grouping `active AND (name-match OR domain-match)`. Apply length checks to the actual stored normalized strings.

24. **Should-fix — RESTlet XML must not copy Suitelet-only fields.**  
    **Text:** “same element shape as `customscript_pc_crm_create_project_sl.xml`”; “`runasrole` empty.”  
    The RESTlet deployment schema has no `runasrole`; an empty element is still an unsupported element. **Fix:** omit it and validate against the RESTlet schema. The `<role>` object, `BASIC` center and record-side custom-record permissions are valid patterns; ensure any permissions represented on both sides agree, and verify UI-only subsidiary/form restrictions separately. [RESTlet schema](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/SDFxml_3594042655.html), [role XML limitations](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4731154857.html)

25. **Should-fix — Error logging can violate the no-PII promise.**  
    **Text:** “No PII in logs”; “stack”; `fail(rowId, {name, message, step})`.  
    NetSuite error messages and stack strings can contain submitted values; putting them in `log.error` or the ledger does not sanitize them. **Fix:** log allowlisted codes, identifiers and sanitized diagnostics; keep raw messages out of replayable results and ledger errors.

26. **Should-fix — Several acceptance assertions contradict the specified execution order.**  
    **Text:** A4 “nothing is written”; A2/A3 “refused with PC_API_REFUSED”; A12 “malformed body … returns PC_API_BAD_REQUEST.”  
    A4 requires a ledger claim and refusal write. Malformed unauthorized requests currently receive BAD_REQUEST before allowlist evaluation. Some malformed JSON/authentication failures occur before the entry point and cannot use its envelope. **Fix:** say “no opportunity write” for A4, use structurally valid requests for authorization tests, and distinguish handler responses from platform HTTP failures. Store refusal codes explicitly instead of reconstructing them from reason text.

27. **Should-fix — Twelve mocked tests cannot establish the stated acceptance.**  
    **Text:** “one `it` per line”; A1–A12.  
    Unit tests can verify branching, normalization and mocked calls. They cannot prove actual role restrictions, OAuth audiences, SDF deployment, saved-search joins, field setters, external-ID uniqueness, concurrent saves or UE behavior. **Fix:** separate unit and controlled account acceptance. Add createProject replay/mismatch/pending tests, simultaneous failed resumes, failures after committed writes, won/lost races, logTouch recovery, conflicting business UUIDs, >1,000 exclusions, and missing/duplicate search labels. A8 needs genuinely concurrent account calls, not two sequential mocked invocations.

The custom-role `runtime.getCurrentUser().roleId` string comparison and `runtime.getCurrentScript().deploymentId` comparison are appropriate; replacing either with guessed numeric IDs would introduce a defect. [Oracle roleId](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4296670260.html), [Oracle deploymentId](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4439939144.html)