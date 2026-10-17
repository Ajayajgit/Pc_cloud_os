# Handback: CRM RESTlet driver

## Files written
- C:\Development\projects\Netsuite Development\Power Cloud NS\CRM\tools\crm_api_driver.mjs
- C:\Development\projects\Netsuite Development\Power Cloud NS\CRM\tools\crm_api.example.json
- C:\Development\projects\Netsuite Development\Power Cloud NS\CRM\tools\README.md (33 lines)
- C:\Development\projects\Netsuite Development\Power Cloud NS\CRM\tools\HANDBACK_driver.md (this file)
- Appended 5 lines to C:\Development\projects\Netsuite Development\Power Cloud NS\CRM\.gitignore (existing content kept; it already ended with a newline).

## Verification output
```
$ node --check tools/crm_api_driver.mjs
check-ok            (no syntax errors, exit 0)

$ node tools/crm_api_driver.mjs --selftest
selftest ok
```
Extra offline checks: missing config exits 1 with a clear message; `--as bogus` exits 1 listing known mappings; an unreadable key file exits 1 naming the path (ENOENT). `--help` prints. No em-dashes in any file (grep count 0).

## Not done
- No live call against NetSuite (no credentials, and the task said no network use in testing). The token exchange and RESTlet call paths are untested against the real account. The selftest covers JWT construction and PS256 signing only.

## Decisions the spec did not cover
- Exit codes: usage and config errors exit 1. Token exchange failures (including network failure on the token call) exit 2. RESTlet non-2xx or network failure exit 3.
- `--verb GET` is sent with no body, because `fetch` throws on a GET with a body. The log still records the intended body.
- `--deploy` also accepts a raw script id starting with `customdeploy` when it is not a key in `deployments`. Any other unknown value fails.
- When `--deploy` is omitted and `--as` has no same-named deployment key, it fails and asks for `--deploy`.
- `--raw-body` bypasses the built body entirely: no `requestId` is generated or printed, and `--action`, `--payload` and `--extra` are ignored. The log's `action` and `requestId` are null in that case, and `body` is the raw string.
- `--token-only` prints `ok expires_in=<n> mapping=<name>`, with ` (cached)` appended on a cache hit (expires_in is then the remaining seconds).
- Token cache entries also store accountId, clientId and certId, and are ignored if any differ from the current config, so editing config invalidates the cache. The cache file holds live tokens; it is git-ignored.
- `--verbose` diagnostics go to stderr, so stdout stays clean for `requestId:`, `HTTP <status>` and the body. Only the first 6 token characters plus `...` are ever shown.
- Output format is `HTTP <status>` on one line, then the pretty-printed body.
- `--payload` and `--payload-file` together is an error. Default payload is `{}`. `--extra` keys are merged last and can override `action`, `requestId` or `payload` (intentional, for malformed-envelope tests).
- Body key order is `action`, `requestId`, `payload`.
- Because the Bash tool could not take the multi-file heredoc, the files were created with the Write tool; no content differs from the spec.
