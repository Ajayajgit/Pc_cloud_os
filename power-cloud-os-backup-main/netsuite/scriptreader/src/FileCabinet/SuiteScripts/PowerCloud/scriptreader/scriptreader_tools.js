/**
 * @NApiVersion 2.1
 * @NScriptType CustomTool
 * @NModuleScope Public
 * @description Power Cloud - Script Reader toolset for the NetSuite AI Connector Service.
 *              Reads SuiteScript source, lists scripts, reads File Cabinet text files,
 *              and reports script deployments. Read-only.
 * @author Power Cloud Consulting
 */
define(['N/file', 'N/query', 'N/log', 'N/runtime', 'N/config'], function (file, query, log, runtime, config) {
    'use strict';

    const SCRIPT_NAME = 'PowerCloud_ScriptReader';
    const MAX_CONTENT_BYTES = 10 * 1024 * 1024; // file.getContents() in-memory cap (10 MB)
    const DEFAULT_MAX_LINES = 2000;
    const LIST_ROW_CAP = 200;

    // file.Type members whose getContents() returns readable text (not base64 binary).
    const TEXT_TYPES = new Set([
        file.Type.JAVASCRIPT, file.Type.PLAINTEXT, file.Type.JSON, file.Type.CSV,
        file.Type.XMLDOC, file.Type.HTMLDOC, file.Type.STYLESHEET, file.Type.MESSAGERFC
    ]);

    /**
     * Return a 1-based line window of text plus paging metadata.
     * @param {string} contents - full file text
     * @param {number} [startLine] - 1-based first line to include (default 1)
     * @param {number} [maxLines] - maximum lines to include (default DEFAULT_MAX_LINES)
     * @returns {{text:string,totalLines:number,returnedLines:number,startLine:number,truncated:boolean}}
     */
    function paginate(contents, startLine, maxLines) {
        const lines = String(contents).split('\n');
        const total = lines.length;
        let start = (typeof startLine === 'number' && startLine > 0) ? Math.floor(startLine) : 1;
        if (start > total) { start = total; }
        const max = (typeof maxLines === 'number' && maxLines > 0) ? Math.floor(maxLines) : DEFAULT_MAX_LINES;
        const endExclusive = Math.min(start - 1 + max, total);
        const slice = lines.slice(start - 1, endExclusive);
        return {
            text: slice.join('\n'),
            totalLines: total,
            returnedLines: slice.length,
            startLine: start,
            truncated: slice.length < total
        };
    }

    /**
     * Resolve a script identifier (custom id, numeric internal id, or exact name)
     * to its metadata and the internal id of its File Cabinet file.
     * @param {string} scriptId
     * @returns {Object|null} mapped result row or null when nothing matches
     */
    function resolveScript(scriptId) {
        const raw = String(scriptId).trim();
        let where, params;
        if (/^\d+$/.test(raw)) {
            where = 'Script.ID = ?';
            params = [Number(raw)];
        } else {
            where = '(UPPER(Script.ScriptID) = UPPER(?) OR UPPER(Script.Name) = UPPER(?))';
            params = [raw, raw];
        }
        const sql = 'SELECT Script.ID AS scriptinternalid, Script.Name AS scriptname, ' +
            'Script.ScriptID AS scriptid, Script.ScriptType AS scripttype, ' +
            'Script.ScriptFile AS fileid FROM Script WHERE ' + where;
        const rows = query.runSuiteQL({ query: sql, params: params }).asMappedResults();
        return rows.length ? rows[0] : null;
    }

    /**
     * Read the source code of a SuiteScript file by scriptId, fileId, or filePath.
     * @param {Object} args
     * @returns {Promise<Object>}
     */
    async function readScriptSource(args) {
        const out = {
            source: '', fileName: '', fileId: 0, scriptName: '', scriptType: '',
            totalLines: 0, returnedLines: 0, startLine: 0, truncated: false, error: ''
        };
        try {
            let fileId = args.fileId;
            if (!fileId && !args.filePath && args.scriptId) {
                const meta = resolveScript(args.scriptId);
                if (!meta) {
                    out.error = 'No script found matching "' + args.scriptId + '".';
                    return out;
                }
                fileId = meta.fileid;
                out.scriptName = meta.scriptname || '';
                out.scriptType = meta.scripttype || '';
            }

            let fileObj;
            if (fileId) {
                fileObj = file.load({ id: fileId });
            } else if (args.filePath) {
                fileObj = file.load({ id: args.filePath });
            } else {
                out.error = 'Provide one of: scriptId, fileId, or filePath.';
                return out;
            }

            out.fileName = fileObj.name;
            out.fileId = Number(fileObj.id);

            if (fileObj.size >= MAX_CONTENT_BYTES) {
                out.error = 'File is ' + fileObj.size + ' bytes, which exceeds the 10 MB read limit.';
                return out;
            }

            const page = paginate(fileObj.getContents(), args.startLine, args.maxLines);
            out.source = page.text;
            out.totalLines = page.totalLines;
            out.returnedLines = page.returnedLines;
            out.startLine = page.startLine;
            out.truncated = page.truncated;
            return out;
        } catch (e) {
            log.error({ title: SCRIPT_NAME + '.readScriptSource', details: e });
            out.error = 'Error reading script source: ' + (e.message || e);
            return out;
        }
    }

    /**
     * List script records with metadata only (no source). Returns a JSON-string array.
     * @param {Object} args
     * @returns {Promise<Object>}
     */
    async function listScripts(args) {
        const out = { scriptsJson: '[]', count: 0, capped: false, error: '' };
        try {
            const conds = [];
            const params = [];
            if (args.nameFilter) {
                conds.push('(UPPER(Script.Name) LIKE UPPER(?) OR UPPER(Script.ScriptID) LIKE UPPER(?))');
                const like = '%' + args.nameFilter + '%';
                params.push(like, like);
            }
            if (args.scriptType) {
                conds.push('UPPER(Script.ScriptType) = UPPER(?)');
                params.push(args.scriptType);
            }
            if (!args.includeInactive) {
                conds.push("Script.IsInactive = 'F'");
            }
            const where = conds.length ? (' WHERE ' + conds.join(' AND ')) : '';
            const sql = 'SELECT Script.Name AS scriptname, Script.ScriptID AS scriptid, ' +
                'Script.ScriptType AS scripttype, Script.ScriptFile AS fileid, ' +
                'File.Name AS filename, Script.IsInactive AS isinactive ' +
                'FROM Script LEFT JOIN File ON File.ID = Script.ScriptFile' + where +
                ' ORDER BY Script.Name';
            const rows = query.runSuiteQL({ query: sql, params: params }).asMappedResults();
            out.capped = rows.length > LIST_ROW_CAP;
            const scripts = rows.slice(0, LIST_ROW_CAP).map(function (r) {
                return {
                    scriptName: r.scriptname || '',
                    scriptId: r.scriptid || '',
                    scriptType: r.scripttype || '',
                    fileId: (r.fileid != null) ? Number(r.fileid) : 0,
                    fileName: r.filename || '',
                    isInactive: r.isinactive === 'T'
                };
            });
            out.scriptsJson = JSON.stringify(scripts);
            out.count = scripts.length;
            return out;
        } catch (e) {
            log.error({ title: SCRIPT_NAME + '.listScripts', details: e });
            out.error = 'Error listing scripts: ' + (e.message || e);
            return out;
        }
    }

    /**
     * Read any text file from the File Cabinet by fileId or filePath. Refuses binary types.
     * @param {Object} args
     * @returns {Promise<Object>}
     */
    async function readFile(args) {
        const out = {
            contents: '', fileName: '', fileId: 0, fileType: '', folder: '',
            totalLines: 0, returnedLines: 0, truncated: false, isBinary: false, error: ''
        };
        try {
            let fileObj;
            if (args.fileId) {
                fileObj = file.load({ id: args.fileId });
            } else if (args.filePath) {
                fileObj = file.load({ id: args.filePath });
            } else {
                out.error = 'Provide fileId or filePath.';
                return out;
            }

            out.fileName = fileObj.name;
            out.fileId = Number(fileObj.id);
            out.fileType = String(fileObj.fileType);
            out.folder = (fileObj.folder != null) ? String(fileObj.folder) : '';

            if (!TEXT_TYPES.has(fileObj.fileType)) {
                out.isBinary = true;
                out.error = 'File type ' + fileObj.fileType + ' is binary; text extraction is not supported.';
                return out;
            }
            if (fileObj.size >= MAX_CONTENT_BYTES) {
                out.error = 'File is ' + fileObj.size + ' bytes, which exceeds the 10 MB read limit.';
                return out;
            }

            const page = paginate(fileObj.getContents(), args.startLine, args.maxLines);
            out.contents = page.text;
            out.totalLines = page.totalLines;
            out.returnedLines = page.returnedLines;
            out.truncated = page.truncated;
            return out;
        } catch (e) {
            log.error({ title: SCRIPT_NAME + '.readFile', details: e });
            out.error = 'Error reading file: ' + (e.message || e);
            return out;
        }
    }

    /**
     * Return the deployment records for a script. Returns a JSON-string array.
     * @param {Object} args
     * @returns {Promise<Object>}
     */
    async function getScriptDeployments(args) {
        const out = { deploymentsJson: '[]', count: 0, error: '' };
        try {
            let where, params;
            if (args.scriptInternalId) {
                where = 'Script.ID = ?';
                params = [Number(args.scriptInternalId)];
            } else if (args.scriptId) {
                const raw = String(args.scriptId).trim();
                if (/^\d+$/.test(raw)) {
                    where = 'Script.ID = ?';
                    params = [Number(raw)];
                } else {
                    where = '(UPPER(Script.ScriptID) = UPPER(?) OR UPPER(Script.Name) = UPPER(?))';
                    params = [raw, raw];
                }
            } else {
                out.error = 'Provide scriptId or scriptInternalId.';
                return out;
            }

            const sql = 'SELECT ScriptDeployment.ScriptID AS deploymentid, Script.Name AS scriptname, ' +
                'BUILTIN.DF(ScriptDeployment.Status) AS status, ScriptDeployment.IsDeployed AS isdeployed, ' +
                'ScriptDeployment.ExecutionContext AS executioncontext, ' +
                'ScriptDeployment.RecordType AS recordtype, ' +
                'ScriptDeployment.LogLevel AS loglevel ' +
                'FROM ScriptDeployment INNER JOIN Script ON Script.ID = ScriptDeployment.Script ' +
                'WHERE ' + where + ' ORDER BY ScriptDeployment.ScriptID';
            const rows = query.runSuiteQL({ query: sql, params: params }).asMappedResults();
            const deployments = rows.map(function (r) {
                return {
                    deploymentId: r.deploymentid || '',
                    scriptName: r.scriptname || '',
                    status: r.status || '',
                    isDeployed: r.isdeployed === 'T',
                    executionContext: r.executioncontext || '',
                    recordType: r.recordtype || '',
                    logLevel: r.loglevel || ''
                };
            });
            out.deploymentsJson = JSON.stringify(deployments);
            out.count = deployments.length;
            return out;
        } catch (e) {
            log.error({ title: SCRIPT_NAME + '.getScriptDeployments', details: e });
            out.error = 'Error reading deployments: ' + (e.message || e);
            return out;
        }
    }

    /**
     * Return the account's own identity and platform facts: account id, environment
     * type, NetSuite release version, whether the NetSuite Next runtime API exists,
     * and (permission permitting) Company Information fields. The N/runtime facts
     * need no permission at all; Company Information needs the Set Up Company
     * permission and degrades gracefully when the role lacks it. Read-only, no input.
     * @returns {Promise<Object>}
     */
    async function getAccountInfo() {
        const out = {
            accountId: '', envType: '', version: '', roleId: 0,
            nextApiAvailable: false, isNextActiveForThisRole: false,
            companyId: '', companyName: '', legalName: '', country: '',
            companyInfoSource: '', error: ''
        };
        try {
            out.accountId = String(runtime.accountId || '');
            out.envType = String(runtime.envType || '');
            out.version = String(runtime.version || '');
            out.roleId = Number(runtime.getCurrentUser().role) || 0;

            // N/runtime.isNextActive() ships with the NetSuite Next era (2026.2+).
            // Its absence on older releases is a fact worth reporting, not an error.
            if (typeof runtime.isNextActive === 'function') {
                out.nextApiAvailable = true;
                try {
                    out.isNextActiveForThisRole = runtime.isNextActive() === true;
                } catch (e) {
                    // API present but not callable in this context; leave false.
                }
            }

            try {
                const info = config.load({ type: config.Type.COMPANY_INFORMATION });
                out.companyId = String(info.getValue({ fieldId: 'companyid' }) || '');
                out.companyName = String(info.getValue({ fieldId: 'companyname' }) || '');
                out.legalName = String(info.getValue({ fieldId: 'legalname' }) || '');
                out.country = String(info.getValue({ fieldId: 'country' }) || '');
                out.companyInfoSource = 'config';
            } catch (e) {
                out.companyInfoSource = 'unavailable: role lacks the Set Up Company permission (runtime facts above are unaffected)';
            }
            return out;
        } catch (e) {
            log.error({ title: SCRIPT_NAME + '.getAccountInfo', details: e });
            out.error = 'Error reading account info: ' + (e.message || e);
            return out;
        }
    }

    return {
        readScriptSource: readScriptSource,
        listScripts: listScripts,
        readFile: readFile,
        getScriptDeployments: getScriptDeployments,
        getAccountInfo: getAccountInfo
    };
});
