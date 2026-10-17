# Power Cloud CRM: FDD and TDD tables

Generated 2026-10-15 from code and object XML by pc-code-chores; reviewed by the orchestrator.

## 1. Files

| File | Script Type | Script ID | Deployment ID(s) | Status in XML |
|---|---|---|---|---|
| src/FileCabinet/SuiteScripts/PC/pc_crm_api_rl.js | RESTlet | customscript_pc_crm_api | customdeploy_pc_crm_api_sales (audience customrole_pc_crm_sales_write); customdeploy_pc_crm_api_travel (audience customrole_pc_crm_travel_read) | Both TESTING, isdeployed T |
| src/FileCabinet/SuiteScripts/PC/pc_crm_channel_map_ue.js | User Event | customscript_pc_crm_channel_map_ue | customdeploy_pc_crm_channel_map_ue (customrecord_pc_channel_map) | RELEASED, isdeployed T |
| src/FileCabinet/SuiteScripts/PC/pc_crm_class_propagate_ue.js | User Event | customscript_pc_crm_class_propagate_ue | customdeploy_pc_crm_class_prop_inv (INVOICE); customdeploy_pc_crm_class_prop_cm (CREDITMEMO); customdeploy_pc_crm_class_prop_tb (TIMEBILL) | All three TESTING, isdeployed T |
| src/FileCabinet/SuiteScripts/PC/pc_crm_create_project_sl.js | Suitelet | customscript_pc_crm_create_project_sl | customdeploy_pc_crm_create_project_sl (audience ADMINISTRATOR and customrole_pc_crm_sales_write; runAs customrole_pc_crm_sales_write; isonline F) | TESTING, isdeployed T |
| src/FileCabinet/SuiteScripts/PC/pc_crm_opp_ue.js | User Event | customscript_pc_crm_opp_ue | customdeploy_pc_crm_opp_ue (OPPORTUNITY) | TESTING, isdeployed T |
| src/FileCabinet/SuiteScripts/PC/pc_crm_opp_cs.js | Client Script (form-attached module) | [unconfirmed] (no script object in XML) | none | No object XML; attached to the opportunity form by pc_crm_opp_ue beforeLoad |
| src/FileCabinet/SuiteScripts/PC/pc_crm_search_installer_sl.js | Suitelet (retired one-off installer) | customscript_pc_crm_search_installer_sl | customdeploy_pc_crm_search_installer_sl | TESTING, isdeployed F; XML comment says retired 2026-10-13 and not deployed on purpose |
| src/FileCabinet/SuiteScripts/PC/pc_crm_types_lib.js | Library (no deployment) | none | none | n/a |
| src/FileCabinet/SuiteScripts/PC/pc_crm_channel_lib.js | Library (no deployment) | none | none | n/a |
| src/FileCabinet/SuiteScripts/PC/pc_crm_ledger_lib.js | Library (no deployment) | none | none | n/a |
| src/FileCabinet/SuiteScripts/PC/pc_crm_readiness_lib.js | Library (no deployment) | none | none | n/a |
| src/FileCabinet/SuiteScripts/PC/pc_crm_project_builder_lib.js | Library (no deployment) | none | none | n/a |

## 2. Script parameters

| Parameter ID | Label | Type | Script | Purpose |
|---|---|---|---|---|
| custscript_pc_api_support_type_id | PC \| Support Type ID | INTEGER | customscript_pc_crm_api | PC \| Internal id of the Support value in the engagement type list, created in the UI. |
| custscript_pc_api_fail_after_step | PC \| Fail After Step (Test) | INTEGER | customscript_pc_crm_api | PC \| Test only. Throws a fault after this step of createEndClient or createProject, for ZZ TEST records only. |
| custscript_pc_travel_search_id | PC \| Travel Search ID | TEXT | customscript_pc_crm_api | PC \| Script id or internal id of the saved search behind the travel project list. |
| custscript_pc_api_subsidiary_id | PC \| End Client Subsidiary ID | INTEGER | customscript_pc_crm_api | PC \| Internal id of the subsidiary new end clients belong to (OneWorld). Power Cloud Consulting, LLC is 1. |
| custscript_pc_api_disabled_actions | PC \| Disabled Actions | TEXT | customscript_pc_crm_api | PC \| Comma-separated action names that the API refuses. The kill switch. |
| custscript_pc_sl_allowed_roles | PC \| Allowed Role Script IDs | TEXT | customscript_pc_crm_create_project_sl | PC \| Comma-separated script ids of the roles allowed to call the service. Administrator is always allowed. |
| custscript_pc_type_support_id | PC \| Support Type ID | INTEGER | customscript_pc_crm_create_project_sl | PC \| Internal id of the Support value in the engagement type list, created in the UI. |
| custscript_pc_fail_after_step | PC \| Fail After Step (Test) | INTEGER | customscript_pc_crm_create_project_sl | PC \| Test only. Throws a fault after this builder step, for ZZ TEST opportunities only. |
| custscript_pc_ue_type_support_id | PC \| Support Type ID | INTEGER | customscript_pc_crm_opp_ue | PC \| Internal id of the Support value in the engagement type list, created in the UI. |

## 3. Fields and lists created by the project

| Field or list ID | Label | Type | Applies to | Purpose |
|---|---|---|---|---|
| custbody_pc_commercial_model | PC \| Commercial Model | SELECT, list customlist_pc_commercial_model | Opportunity (transaction body) | PC \| Sales OS phase 1. Commercial model of the deal. |
| custbody_pc_signed_date | PC \| Signed Agreement Date | DATE | Opportunity (transaction body) | PC \| Sales OS phase 1. Date the agreement was signed. |
| custbody_pc_deal_uuid | PC \| Deal UUID | TEXT, max 36 | Opportunity (transaction body) | PC \| Sales OS phase 1. Idempotency and folder key of the deal. |
| custbody_pc_billing_party | PC \| Billing Party | SELECT, record -2 (customer) | Opportunity (transaction body) | PC \| Sales OS phase 1. Billing party resolved from the channel map. |
| custbody_pc_partner_contact | PC \| Partner Contact | SELECT, record -6 (contact); native filter company = custbody_pc_billing_party | Opportunity (transaction body) | PC \| Sales OS phase 1. The sales rep at the subcontracting firm. |
| custbody_pc_referral_contact | PC \| Referral Contact | SELECT, record -6 (contact) | Opportunity (transaction body) | PC \| Sales OS phase 1. The person who sent the lead. |
| custentity_pc_end_client | PC \| End Client | SELECT, record -2 (customer) | Project (entity) | PC \| Sales OS phase 1. The client the work is for, copied from the opportunity. |
| custentity_pc_partner_contact | PC \| Partner Contact | SELECT, record -6 (contact) | Project (entity) | PC \| Sales OS phase 1. The sales rep at the subcontracting firm, copied from the opportunity. |
| custentity_pc_commercial_model | PC \| Commercial Model | SELECT, list customlist_pc_commercial_model | Project (entity) | PC \| Sales OS phase 1. Commercial model, copied from the opportunity. |
| custentity_pc_deal_uuid | PC \| Deal UUID | TEXT, max 36 | Project (entity) | PC \| Sales OS phase 1. Links the project to its deal and deal folder. |
| custentity_pc_asana_url | PC \| Asana Project URL | TEXT, max 300 | Project (entity) | PC \| Sales OS phase 1. Asana project link, copied from the opportunity. |
| custentity_pc_travel_exclude | PC \| Exclude From Travel Lists | CHECKBOX, default F | Project (entity) | PC \| Sales OS phase 1. Keeps a project out of the travel approver lists. |
| custbody_opp_af_contact | Anderson Frank Contact | TEXT (existing field, imported; display type HIDDEN) | Opportunity (transaction body) | [unconfirmed] (description element empty) |
| custbody_opp_af_contact_email | AF Contact Email | EMAIL (existing field, imported; display type HIDDEN) | Sales transaction (transaction body, bodysale T) | [unconfirmed] (description element empty) |
| custbody_af_contact_phone | AF Contact Phone | PHONE (existing field, imported; display type HIDDEN) | Sales transaction (transaction body, bodysale T) | [unconfirmed] (description element empty) |
| custentity_proj_af_contact | Anderson Frank Contact | TEXT (existing field, imported; display type HIDDEN) | Project (entity) | [unconfirmed] (description element empty) |
| custentity_proj_af_contact_email | AF Email | EMAIL (existing field, imported; display type HIDDEN) | Project (entity) | [unconfirmed] (description element empty) |
| custentity_proj_af_contact_phone | AF Contact Phone | PHONE (existing field, imported; display type HIDDEN) | Project (entity) | [unconfirmed] (description element empty) |
| customlist_pc_commercial_model | PC \| Commercial Model | List, 3 values (val_pc_cm_tm, val_pc_cm_ms, val_pc_cm_pss) | n/a | PC \| Commercial model of a deal, copied from the opportunity to the project. |
| customlist_pc_cm_relationship | PC \| Channel Relationship | List, 3 values (val_pc_rel_sub, val_pc_rel_ref, val_pc_rel_dir) | n/a | PC \| Relationship between Power Cloud and the party behind a channel (used by PC \| Channel Map). |
| customlist_pc_ol_status | PC \| Ledger Status | List, 4 values (val_pc_ol_pending, val_pc_ol_done, val_pc_ol_failed, val_pc_ol_refused) | n/a | PC \| Status of a row in PC \| Operation Ledger. |

## 4. Custom records and their fields

| Record / Field ID | Label | Type | Purpose |
|---|---|---|---|
| customrecord_pc_channel_map | PC \| Channel Map | Custom record (accesstype NONENEEDED) | PC \| Reference data. One row per class; a retired channel is marked Inactive. Each row says how the channel relates to Power Cloud and who is billed. No secrets; every role that views an opportunity must be able to read it. |
| custrecord_pc_cm_class | PC \| Class | SELECT, record -101 (classification), mandatory | PC \| Class this row maps. One row per class. |
| custrecord_pc_cm_relationship | PC \| Relationship | SELECT, list customlist_pc_cm_relationship, mandatory | PC \| Relationship of this channel to Power Cloud. |
| custrecord_pc_cm_billing_party | PC \| Billing Party | SELECT, record -2 (customer) | PC \| Customer Power Cloud bills for this channel. |
| customrecord_pc_op_ledger | PC \| Operation Ledger | Custom record (accesstype USEPERMISSIONLIST) | PC \| Operation ledger. One row per CRM mutation request, used for idempotency and resume. Name holds the request id. |
| custrecord_pc_ol_action | PC \| Action | TEXT | PC \| Requested action. |
| custrecord_pc_ol_hash | PC \| Payload Hash | TEXT, max 64 | PC \| Hash of the request payload. |
| custrecord_pc_ol_opp_id | PC \| Opportunity ID | INTEGER | PC \| Internal id of the opportunity the request acts on. |
| custrecord_pc_ol_opp | PC \| Opportunity (retired) | SELECT, record -30 (retired; not written by any script) | PC \| Retired 2026-10-09: a Transaction list field cannot hold an opportunity. See PC \| Opportunity ID. |
| custrecord_pc_ol_project | PC \| Project | SELECT, record -7 | PC \| Project the request created or acts on. |
| custrecord_pc_ol_step | PC \| Step | INTEGER | PC \| Last step completed. |
| custrecord_pc_ol_status | PC \| Status | SELECT, list customlist_pc_ol_status | PC \| Request status. |
| custrecord_pc_ol_result | PC \| Result | CLOBTEXT | PC \| Stored result as JSON. |
| custrecord_pc_ol_role | PC \| Requester Role | TEXT | PC \| Role of the requester. |
| custrecord_pc_ol_error | PC \| Error | CLOBTEXT | PC \| Error detail for a failed request. |

## 5. Roles

| Role ID | Name | Permission key | Level |
|---|---|---|---|
| customrole_pc_crm_sales_write | PC \| CRM Sales Write | TRAN_OPPRTNTY | EDIT |
| customrole_pc_crm_sales_write | PC \| CRM Sales Write | LIST_CUSTJOB | EDIT |
| customrole_pc_crm_sales_write | PC \| CRM Sales Write | LIST_JOB | EDIT |
| customrole_pc_crm_sales_write | PC \| CRM Sales Write | LIST_CONTACT | EDIT |
| customrole_pc_crm_sales_write | PC \| CRM Sales Write | LIST_CALL | EDIT |
| customrole_pc_crm_sales_write | PC \| CRM Sales Write | LIST_PARTNER | VIEW |
| customrole_pc_crm_sales_write | PC \| CRM Sales Write | LIST_CLASS | VIEW |
| customrole_pc_crm_sales_write | PC \| CRM Sales Write | LIST_PROJECTTASK | EDIT |
| customrole_pc_crm_sales_write | PC \| CRM Sales Write | LIST_FIND | FULL |
| customrole_pc_crm_sales_write | PC \| CRM Sales Write | LIST_OTHER_ADDRESS | FULL |
| customrole_pc_crm_sales_write | PC \| CRM Sales Write | ADMI_CRMLIST | VIEW |
| customrole_pc_crm_sales_write | PC \| CRM Sales Write | LIST_EMPLOYEE_RECORD | VIEW |
| customrole_pc_crm_sales_write | PC \| CRM Sales Write | LIST_EMPLOYEE | VIEW |
| customrole_pc_crm_sales_write | PC \| CRM Sales Write | LIST_ITEM | VIEW |
| customrole_pc_crm_sales_write | PC \| CRM Sales Write | ADMI_LOGIN_OAUTH2 | FULL |
| customrole_pc_crm_sales_write | PC \| CRM Sales Write | ADMI_CUSTOMSCRIPT | VIEW |
| customrole_pc_crm_sales_write | PC \| CRM Sales Write | [scriptid=customrecord_pc_op_ledger] | EDIT |
| customrole_pc_crm_travel_read | PC \| CRM Travel Read | LIST_JOB | VIEW |
| customrole_pc_crm_travel_read | PC \| CRM Travel Read | LIST_FIND | FULL |
| customrole_pc_crm_travel_read | PC \| CRM Travel Read | ADMI_LOGIN_OAUTH2 | FULL |
| customrole_pc_crm_travel_read | PC \| CRM Travel Read | LIST_EMPLOYEE | VIEW |
| customrole_pc_crm_travel_read | PC \| CRM Travel Read | LIST_OTHER_ADDRESS | FULL |
| customrole_pc_crm_travel_read | PC \| CRM Travel Read | LIST_EMPLOYEE_RECORD | VIEW |
| customrole_pc_crm_travel_read | PC \| CRM Travel Read | ADMI_CUSTOMSCRIPT | VIEW |

## 6. Saved searches

| Search ID | Title | Record type |
|---|---|---|
| customsearch_pc_opp_no_end_client | [unconfirmed] (no title element; definition opaque) | [unconfirmed] |
| customsearch_pc_inv_no_class_90d | [unconfirmed] (no title element; definition opaque) | [unconfirmed] |
| customsearch_pc_recon_links | [unconfirmed] (no title element; definition opaque) | [unconfirmed] |
| customsearch_pc_recon_status24 | [unconfirmed] (no title element; definition opaque) | [unconfirmed] |
| customsearch_pc_recon_ledger | [unconfirmed] (no title element; definition opaque) | [unconfirmed] (dependency list names customrecord_pc_op_ledger) |
| customsearch_pc_proj_sub_no_partner_cont | [unconfirmed] (no title element; definition opaque) | [unconfirmed] |

## 7. Function inventory

| Function | File | Purpose |
|---|---|---|
| toPositiveInt | pc_crm_types_lib.js | (no JSDoc) |
| toJobType | pc_crm_types_lib.js | (no JSDoc) |
| toIntOrNull | pc_crm_channel_lib.js | (no JSDoc) |
| resolve | pc_crm_channel_lib.js | Returns {relationship, billingPartyId} from the single active row for the class. |
| isBillingParty | pc_crm_channel_lib.js | True when the customer is the billing party on any channel map row, including retired (Inactive) rows. |
| loadStatusIds | pc_crm_ledger_lib.js | (no JSDoc) |
| statusId | pc_crm_ledger_lib.js | (no JSDoc) |
| truncate | pc_crm_ledger_lib.js | (no JSDoc) |
| parseJson | pc_crm_ledger_lib.js | (no JSDoc) |
| submit | pc_crm_ledger_lib.js | (no JSDoc) |
| findByRequestId | pc_crm_ledger_lib.js | Loads a row by request id. |
| claim | pc_crm_ledger_lib.js | Claims a ledger row for the request. |
| findByOpp | pc_crm_ledger_lib.js | Lists the rows of an opportunity for an action, newest first, optionally leaving one row out (the row the caller just claimed). |
| step | pc_crm_ledger_lib.js | Records the last completed step. |
| done | pc_crm_ledger_lib.js | Marks the row done and stores the result JSON, unchanged, for replay. |
| fail | pc_crm_ledger_lib.js | Marks the row failed. |
| refuse | pc_crm_ledger_lib.js | Marks the row refused and stores the reason (and optional details) as its result. |
| reopen | pc_crm_ledger_lib.js | Puts a failed row back to pending when its request id is replayed to resume. |
| toId | pc_crm_readiness_lib.js | (no JSDoc) |
| toBool | pc_crm_readiness_lib.js | (no JSDoc) |
| isBlank | pc_crm_readiness_lib.js | (no JSDoc) |
| findProject | pc_crm_readiness_lib.js | Finds the project built for a deal by external id pc_proj_{dealUuid}. |
| computeState | pc_crm_readiness_lib.js | Setup state from both opportunity links, the project with external id pc_proj_{D}, and the ledger. |
| check | pc_crm_readiness_lib.js | Checks an opportunity record (loaded record or beforeLoad newRecord; only getValue is used). |
| toId | pc_crm_project_builder_lib.js | (no JSDoc) |
| isBlank | pc_crm_project_builder_lib.js | (no JSDoc) |
| round2 | pc_crm_project_builder_lib.js | (no JSDoc) |
| isDate | pc_crm_project_builder_lib.js | (no JSDoc) |
| setIfPresent | pc_crm_project_builder_lib.js | (no JSDoc) |
| makeError | pc_crm_project_builder_lib.js | (no JSDoc) |
| ensureUsage | pc_crm_project_builder_lib.js | (no JSDoc) |
| sha256Hex | pc_crm_project_builder_lib.js | (no JSDoc) |
| refused | pc_crm_project_builder_lib.js | (no JSDoc) |
| splitHours | pc_crm_project_builder_lib.js | Splits hours across n assignees to two decimals; the last line takes the rounding remainder. |
| findTask | pc_crm_project_builder_lib.js | (no JSDoc) |
| createProject | pc_crm_project_builder_lib.js | Project record in one save. |
| readAssignees | pc_crm_project_builder_lib.js | Staffing from the four opportunity fields, one entry per distinct employee, in role order. |
| ensureTask | pc_crm_project_builder_lib.js | Creates one project task with externalid, estimatedwork and assignee lines unless it already exists. |
| readRelayUrl | pc_crm_project_builder_lib.js | Reads the relay URL from the Navan config record. |
| refreshRelay | pc_crm_project_builder_lib.js | Relay refresh. |
| build | pc_crm_project_builder_lib.js | Builds the project for a won opportunity. |
| ApiError (class) | pc_crm_api_rl.js | An expected, answerable failure. |
| bad | pc_crm_api_rl.js | (no JSDoc) |
| notFound | pc_crm_api_rl.js | (no JSDoc) |
| okResponse | pc_crm_api_rl.js | (no JSDoc) |
| errorResponse | pc_crm_api_rl.js | (no JSDoc) |
| makeError | pc_crm_api_rl.js | (no JSDoc) |
| ensureUsage | pc_crm_api_rl.js | (no JSDoc) |
| param | pc_crm_api_rl.js | (no JSDoc) |
| sha256Hex | pc_crm_api_rl.js | (no JSDoc) |
| canonicalJson | pc_crm_api_rl.js | JSON with object keys sorted recursively; arrays keep their order. |
| toId | pc_crm_api_rl.js | (no JSDoc) |
| isUuidV4 | pc_crm_api_rl.js | (no JSDoc) |
| isIsoDate | pc_crm_api_rl.js | True for yyyy-mm-dd that is a real calendar date. |
| toDate | pc_crm_api_rl.js | (no JSDoc) |
| isText | pc_crm_api_rl.js | (no JSDoc) |
| isMoney | pc_crm_api_rl.js | (no JSDoc) |
| isHours | pc_crm_api_rl.js | (no JSDoc) |
| isPlainObject | pc_crm_api_rl.js | (no JSDoc) |
| onlyKeys | pc_crm_api_rl.js | (no JSDoc) |
| isEmail | pc_crm_api_rl.js | (no JSDoc) |
| interleave | pc_crm_api_rl.js | (no JSDoc) |
| firstValueId | pc_crm_api_rl.js | (no JSDoc) |
| makeReader | pc_crm_api_rl.js | Reader over one payload object: rejects unknown keys up front, then each accessor checks type, length and range and throws a BAD_REQUEST that names the field, never the value. |
| safeLookup | pc_crm_api_rl.js | (no JSDoc) |
| requireActive | pc_crm_api_rl.js | (no JSDoc) |
| requireListValue | pc_crm_api_rl.js | (no JSDoc) |
| requireOpportunity | pc_crm_api_rl.js | (no JSDoc) |
| requireOpenStatus | pc_crm_api_rl.js | (no JSDoc) |
| findIdByExternalId | pc_crm_api_rl.js | (no JSDoc) |
| saveOrFind | pc_crm_api_rl.js | Saves a new record. |
| setIfPresent | pc_crm_api_rl.js | (no JSDoc) |
| shapeResolveClient | pc_crm_api_rl.js | (no JSDoc) |
| shapeCreateEndClient | pc_crm_api_rl.js | (no JSDoc) |
| shapeCreateOpportunity | pc_crm_api_rl.js | (no JSDoc) |
| refsCreateEndClient | pc_crm_api_rl.js | (no JSDoc) |
| refsCreateOpportunity | pc_crm_api_rl.js | (no JSDoc) |
| shapeUpdateOpportunity | pc_crm_api_rl.js | (no JSDoc) |
| refsUpdateOpportunity | pc_crm_api_rl.js | (no JSDoc) |
| shapeLogTouch | pc_crm_api_rl.js | (no JSDoc) |
| refsLogTouch | pc_crm_api_rl.js | (no JSDoc) |
| shapeCloseOpportunity | pc_crm_api_rl.js | (no JSDoc) |
| refsCloseOpportunity | pc_crm_api_rl.js | (no JSDoc) |
| shapeCreateProject | pc_crm_api_rl.js | (no JSDoc) |
| refsCreateProject | pc_crm_api_rl.js | (no JSDoc) |
| shapeListTravelProjects | pc_crm_api_rl.js | (no JSDoc) |
| noRefs | pc_crm_api_rl.js | (no JSDoc) |
| commitStep | pc_crm_api_rl.js | Commits a ledger step once. |
| hostFromUrl | pc_crm_api_rl.js | (no JSDoc) |
| domainFromEmail | pc_crm_api_rl.js | (no JSDoc) |
| runResolveClient | pc_crm_api_rl.js | Read-only. Never creates a record and never touches the ledger. |
| runCreateEndClient | pc_crm_api_rl.js | (no JSDoc) |
| runCreateOpportunity | pc_crm_api_rl.js | (no JSDoc) |
| readOpportunity | pc_crm_api_rl.js | Reads columns of an opportunity that validation already confirmed; NOT_FOUND if it vanished since. |
| runUpdateOpportunity | pc_crm_api_rl.js | (no JSDoc) |
| runLogTouch | pc_crm_api_rl.js | (no JSDoc) |
| runCloseOpportunity | pc_crm_api_rl.js | (no JSDoc) |
| runCreateProject | pc_crm_api_rl.js | The builder claims and owns its own ledger row; this action never claims one. |
| findColumn | pc_crm_api_rl.js | Exactly one column whose custom label equals label (case-insensitive, trimmed); if none, exactly one whose lowercase field name is in fallbackNames (exact match). |
| runListTravelProjects | pc_crm_api_rl.js | Read-only. The saved search rows minus projects flagged Exclude From Travel Lists, by project id. |
| parseRequest | pc_crm_api_rl.js | Step 1: shape. Sets ctx.action and ctx.requestId only from values that passed their checks. |
| authorize | pc_crm_api_rl.js | Step 2: role and deployment pair against the allowlist, before any record is touched. |
| checkKillSwitch | pc_crm_api_rl.js | Step 3: kill switch. |
| claimRow | pc_crm_api_rl.js | Step 5: claims the ledger row and applies the replay rules. |
| markRow | pc_crm_api_rl.js | (no JSDoc) |
| runLedgered | pc_crm_api_rl.js | Step 6: runs a ledgered action, then stores its result or its refusal or its failure on the row. |
| handle | pc_crm_api_rl.js | (no JSDoc) |
| post | pc_crm_api_rl.js | (no JSDoc) |
| wrongVerb | pc_crm_api_rl.js | A wrong verb never produces a NetSuite error page. |
| get | pc_crm_api_rl.js | (no JSDoc) |
| put | pc_crm_api_rl.js | (no JSDoc) |
| del (exported as delete) | pc_crm_api_rl.js | (no JSDoc) |
| toId | pc_crm_opp_ue.js | (no JSDoc) |
| escapeHtml | pc_crm_opp_ue.js | (no JSDoc) |
| checkDealUuid | pc_crm_opp_ue.js | Refuses a Deal UUID already carried by another opportunity. |
| beforeSubmit | pc_crm_opp_ue.js | Refuses a duplicate Deal UUID, sets Billing Party from the class through the channel map, and defaults End Client from the entity. |
| renderMessage | pc_crm_opp_ue.js | (no JSDoc) |
| beforeLoad | pc_crm_opp_ue.js | VIEW only: the Create Project or Resume button, or a block listing what is missing. |
| newRequestId | pc_crm_opp_cs.js | UUID v4 from the browser. |
| show | pc_crm_opp_cs.js | (no JSDoc) |
| send | pc_crm_opp_cs.js | (no JSDoc) |
| pageInit | pc_crm_opp_cs.js | (no JSDoc) |
| createProject | pc_crm_opp_cs.js | (no JSDoc) |
| resumeProject | pc_crm_opp_cs.js | (no JSDoc) |
| respond | pc_crm_create_project_sl.js | (no JSDoc) |
| failure | pc_crm_create_project_sl.js | (no JSDoc) |
| toPositiveIntOrNull | pc_crm_create_project_sl.js | (no JSDoc) |
| parseBody | pc_crm_create_project_sl.js | Parses and validates the body. |
| isRoleAllowed | pc_crm_create_project_sl.js | (no JSDoc) |
| opportunityExists | pc_crm_create_project_sl.js | (no JSDoc) |
| onRequest | pc_crm_create_project_sl.js | (no JSDoc) |
| isEmpty | pc_crm_class_propagate_ue.js | (no JSDoc) |
| selectValue | pc_crm_class_propagate_ue.js | (no JSDoc) |
| getProjectId | pc_crm_class_propagate_ue.js | Which header field carries the project for this record type. |
| getProjectClass | pc_crm_class_propagate_ue.js | (no JSDoc) |
| countEmptyLineClasses | pc_crm_class_propagate_ue.js | Counts item lines whose class is empty. |
| beforeSubmit | pc_crm_class_propagate_ue.js | (no JSDoc) |
| subcontractValueId | pc_crm_channel_map_ue.js | (no JSDoc) |
| readValues | pc_crm_channel_map_ue.js | Reads the values the guard needs. |
| hasOtherActiveRowForClass | pc_crm_channel_map_ue.js | (no JSDoc) |
| beforeSubmit | pc_crm_channel_map_ue.js | (no JSDoc) |
| respond | pc_crm_search_installer_sl.js | (no JSDoc) |
| buildFilters | pc_crm_search_installer_sl.js | Builds every filter as a Filter object. |
| buildColumns | pc_crm_search_installer_sl.js | (no JSDoc) |
| searchExists | pc_crm_search_installer_sl.js | (no JSDoc) |
| installOne | pc_crm_search_installer_sl.js | (no JSDoc) |
| onRequest | pc_crm_search_installer_sl.js | (no JSDoc) |
