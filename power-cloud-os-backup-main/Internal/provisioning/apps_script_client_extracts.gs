/**
 * Client time-entry extract delivery.
 *
 * Paste into the SAME Apps Script project that already builds the Monday dashboard
 * Sheet. Two parts:
 *   1. a small guard at the top of the existing doPost(), below
 *   2. the writeClientExtracts() function and its helpers
 *
 * Nothing existing changes. An unrecognised payload falls straight through to the
 * dashboard path exactly as it does today.
 *
 * SETUP (once): Project Settings > Script Properties, add
 *   POWER_CLOUD_OS_FOLDER_ID = <the Drive folder ID of "Power Cloud OS">
 * Take the ID from the folder URL:
 *   https://drive.google.com/drive/folders/<THIS_PART>
 *
 * The script's identity needs edit access to the Power Cloud OS shared drive
 * (its own drive since the 2026-08-22 migration). It already has access to the
 * Owners folder, so this is an additional grant rather than a new credential.
 *
 * WHY IT WRITES IN PLACE: the Monday Sheet folder shows " (1)" duplicates on seven
 * dates, because a second run created a second file with the same name. These
 * extracts overwrite the existing file's content instead of creating a new one, so
 * a re-run refreshes rather than duplicating.
 */


/* -------------------------------------------------------------------------
 * 1. ADD THIS BLOCK AT THE TOP OF YOUR EXISTING doPost(e)
 * -------------------------------------------------------------------------
 *
 * function doPost(e) {
 *   // --- client extract delivery (added 2026-08-18) ---
 *   try {
 *     var probe = JSON.parse(e.postData.contents);
 *     if (probe && probe.action === 'clientExtracts') {
 *       return ContentService
 *         .createTextOutput(JSON.stringify(writeClientExtracts(probe)))
 *         .setMimeType(ContentService.MimeType.JSON);
 *     }
 *   } catch (err) {
 *     // not our payload, or unparseable: fall through to the dashboard path
 *   }
 *   // --- end added block ---
 *
 *   ...your existing dashboard code, unchanged...
 * }
 */


/* -------------------------------------------------------------------------
 * 2. NEW FUNCTIONS
 * ------------------------------------------------------------------------- */

var RECORD_SUBFOLDERS = ['source', 'working', 'deliverables', 'execution'];

// Root folders that are OS machinery, never client records. Excluded so the
// extract job can never register or write into them (templates/ carries a
// CONTEXT.md in its client-record stamp, which would otherwise register it).
var NON_CLIENT_FOLDERS = ['templates', 'internal', 'archive', 'feedback', 'fonts', 'logos'];

/**
 * Write one time-entry extract per customer into that client's working/ folder.
 *
 * payload = {
 *   action:      'clientExtracts',
 *   pulledAt:    ISO timestamp,
 *   periodStart: 'YYYY-MM-DD',
 *   periodEnd:   'YYYY-MM-DD',
 *   runDate:     'YYYY-MM-DD',
 *   customers:   [ { customerName, entryCount, totalHours, entries: [...] }, ... ]
 * }
 */
function writeClientExtracts(payload) {
  var osFolderId = PropertiesService.getScriptProperties()
      .getProperty('POWER_CLOUD_OS_FOLDER_ID');
  if (!osFolderId) {
    return { success: false, error: 'POWER_CLOUD_OS_FOLDER_ID script property is not set' };
  }

  var osFolder = DriveApp.getFolderById(osFolderId);
  var index = buildClientIndex_(osFolder);

  var filename = 'time_entries_' + payload.periodEnd + '.json';
  var written = [];
  var unmatched = [];

  (payload.customers || []).forEach(function (cust) {
    var targets = matchClientFolders_(cust.customerName, index);
    if (!targets.length) {
      unmatched.push(cust.customerName);
      return;
    }
    var body = JSON.stringify({
      customer_name: cust.customerName,
      pulled_at:     payload.pulledAt,
      period_start:  payload.periodStart,
      period_end:    payload.periodEnd,
      run_date:      payload.runDate,
      source:        'monday-dashboard via Apps Script',
      entry_count:   cust.entryCount,
      total_hours:   cust.totalHours,
      entries:       cust.entries
    }, null, 2);

    targets.forEach(function (folder) {
      var working = getOrCreateChild_(folder, 'working');
      upsertFile_(working, filename, body);
      written.push(folder.getName() + '/' + filename);
    });
  });

  return {
    success: true,
    written: written,
    writtenCount: written.length,
    unmatched: unmatched,
    filename: filename
  };
}


/** Client records: top-level folders with a CONTEXT.md, plus nested custom projects. */
function buildClientIndex_(osFolder) {
  var index = {};

  function register(key, folder) {
    if (!key) return;
    if (!index[key]) index[key] = [];
    var already = index[key].some(function (f) { return f.getId() === folder.getId(); });
    if (!already) index[key].push(folder);
  }

  var clients = osFolder.getFolders();
  while (clients.hasNext()) {
    var client = clients.next();
    var name = client.getName();
    if (name.indexOf('.') === 0) continue;
    if (NON_CLIENT_FOLDERS.indexOf(name.toLowerCase()) !== -1) continue;

    var clientHasContext = hasFile_(client, 'CONTEXT.md');
    if (clientHasContext) {
      var declared = readNetsuiteCustomer_(client);
      if (declared) {
        declared.forEach(function (d) { register(normalizeName_(d), client); });
      } else {
        register(normalizeName_(name), client);
      }
    }

    // one level deeper: custom projects live at {Client}/{Project}/
    var subs = client.getFolders();
    while (subs.hasNext()) {
      var sub = subs.next();
      var subName = sub.getName();
      if (subName.indexOf('.') === 0) continue;
      if (RECORD_SUBFOLDERS.indexOf(subName.toLowerCase()) !== -1) continue;
      if (!hasFile_(sub, 'CONTEXT.md')) continue;

      var subDeclared = readNetsuiteCustomer_(sub);
      if (subDeclared) {
        subDeclared.forEach(function (d) { register(normalizeName_(d), sub); });
      } else {
        // NetSuite bills the client, not the project, so inherit the parent name
        register(normalizeName_(name), sub);
        register(normalizeName_(subName), sub);
      }
    }
  }
  return index;
}


/** Read the `- NetSuite customer:` line(s) from a folder's CONTEXT.md. */
function readNetsuiteCustomer_(folder) {
  var files = folder.getFilesByName('CONTEXT.md');
  if (!files.hasNext()) return null;
  var text;
  try {
    text = files.next().getBlob().getDataAsString();
  } catch (err) {
    return null;
  }
  var out = [];
  var re = /^\s*[-*]\s*NetSuite customer:\s*(.+?)\s*$/gim;
  var m;
  while ((m = re.exec(text)) !== null) {
    var v = m[1].trim();
    if (v && v.charAt(0) !== '{') {
      // one line may list several, comma separated
      v.split(',').forEach(function (part) {
        var p = part.trim();
        if (p) out.push(p);
      });
    }
  }
  return out.length ? out : null;
}


function normalizeName_(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}


/** Exact normalized match, then conservative containment. Returns an array. */
function matchClientFolders_(customerName, index) {
  var key = normalizeName_(customerName);
  if (!key) return [];
  if (index[key]) return index[key];

  var hits = [];
  Object.keys(index).forEach(function (k) {
    if (k.length >= 5 && (k.indexOf(key) !== -1 || key.indexOf(k) !== -1)) {
      index[k].forEach(function (f) {
        var already = hits.some(function (h) { return h.getId() === f.getId(); });
        if (!already) hits.push(f);
      });
    }
  });
  return hits;
}


function hasFile_(folder, name) {
  return folder.getFilesByName(name).hasNext();
}


function getOrCreateChild_(folder, name) {
  var it = folder.getFoldersByName(name);
  return it.hasNext() ? it.next() : folder.createFolder(name);
}


/** Overwrite in place if the file exists, so a re-run refreshes rather than duplicating. */
function upsertFile_(folder, name, content) {
  var existing = folder.getFilesByName(name);
  if (existing.hasNext()) {
    var file = existing.next();
    file.setContent(content);
    return file;
  }
  return folder.createFile(name, content, MimeType.PLAIN_TEXT);
}


/* -------------------------------------------------------------------------
 * 3. TEST IT BEFORE WIRING THE SERVER
 * -------------------------------------------------------------------------
 * Run this from the Apps Script editor. It writes one harmless test file into
 * whichever client folder matches, then tells you what it did. Delete the file
 * afterwards if you do not want it there.
 */
function testClientExtracts() {
  var result = writeClientExtracts({
    action: 'clientExtracts',
    pulledAt: new Date().toISOString(),
    periodStart: '2026-08-03',
    periodEnd: '2026-08-16',
    runDate: '2026-08-17',
    customers: [{
      customerName: 'American Barbell',
      entryCount: 1,
      totalHours: 1.5,
      entries: [{
        trandate: '2026-08-10', hours: '1.5', isbillable: 'T',
        employee_name: 'TEST', customer_name: 'American Barbell',
        project_type: 'Consulting', project_status: 'In Progress'
      }]
    }]
  });
  Logger.log(JSON.stringify(result, null, 2));
  return result;
}
