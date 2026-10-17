<#
.SYNOPSIS
    Snapshots the Power Cloud OS working files from Google Drive into this git repo.

.DESCRIPTION
    Copies an explicit allowlist of OS files and folders out of the Shared Drive,
    adds the Paco service source and Power Cloud's own NetSuite projects from the
    local dev tree (netsuite/), commits any changes,
    and pushes to the private GitHub remote.

    Client folders are NEVER copied. The allowlist below is the mechanism: a new
    client folder appearing on the Drive is invisible to this script unless someone
    adds it by hand. A guard also aborts the run if an unexpected top-level folder
    turns up in the repo.

    Archive/ is deliberately out of scope (superseded documents, ~8 MB).

.PARAMETER NoCommit
    Sync the files but leave them uncommitted, so you can review with `git diff` first.

.PARAMETER NoPush
    Commit locally but skip pushing to GitHub.

.EXAMPLE
    .\sync-backup.ps1
    .\sync-backup.ps1 -NoCommit
#>
param(
    [switch]$NoCommit,
    [switch]$NoPush
)

$ErrorActionPreference = 'Stop'

$Source = 'G:\Shared drives\Power Cloud OS'
$Repo   = $PSScriptRoot

# --- The allowlist. Everything backed up is named here. ---------------------
$Folders = @('.claude', 'fonts', 'logos', 'templates', 'Internal', 'feedback', 'tasks')

# Files this repo owns, as opposed to files mirrored from the Drive. Excluded
# from the root-level prune so a sync never deletes its own tooling.
$RepoOwnedFiles = @('sync-backup.ps1', 'README.md', '.gitignore', '.gitattributes')

# Sync junk and Office lock files.
# Google-native formats (.gdoc and friends) are shortcuts Drive for Desktop cannot hand over as
# files; robocopy fails on them and, at its default of a million retries, hangs the sync forever.
$JunkFiles = @('desktop.ini', 'Thumbs.db', '.DS_Store', '~$*', '*.gdoc', '*.gsheet', '*.gslides', '*.gform', '*.gdraw',
               # Key material is never copied from anywhere, whatever folder it strays into (2026-10-12: a private
               # key left at the Drive root by an openssl run reached the clone's working tree before this line).
               '*.key', '*.pem', '*.p12', '*.pfx', '*.crt', '*.cer')

if (-not (Test-Path -LiteralPath $Source)) {
    throw "Source not found: $Source`nIs Google Drive for Desktop running and the G: drive mounted?"
}

# --- Guard: this sync overwrites the working tree from the Drive -------------
# robocopy /MIR makes the Drive win, so running it on a feature branch would
# commit Drive state onto that branch, and running it over uncommitted work would
# destroy the work. Both are silent. Refuse unless we are on main and clean.
Push-Location $Repo
try {
    $branch = (git rev-parse --abbrev-ref HEAD 2>$null)
    $dirty  = (git status --porcelain 2>$null)
}
finally {
    Pop-Location
}

if ($branch -and $branch -ne 'main') {
    throw ("On branch '$branch'. This sync copies the Drive over the working tree, so it would " +
           "commit Drive state onto your branch.`nSwitch to main first: git switch main")
}
if ($dirty) {
    throw ("The repo has uncommitted changes. This sync would overwrite them from the Drive.`n" +
           "Commit or stash first, then re-run.")
}

Write-Host "Source: $Source"
Write-Host "Repo:   $Repo"
Write-Host ''

# --- Folders: mirror, so deletions on the Drive show up as deletions here ---
foreach ($folder in $Folders) {
    $src = Join-Path $Source $folder
    $dst = Join-Path $Repo   $folder

    if (-not (Test-Path -LiteralPath $src)) {
        Write-Warning "Skipping '$folder' - not present in source."
        continue
    }

    # Raw session captures (Internal\sessions\raw) are verbatim chat, which can hold anything a
    # consultant pasted. They stay on the Drive only (session-memory decision D3, 2026-09-24);
    # checkpoints in Internal\sessions are the decision record and are backed up.
    $excludeDirs = @('__pycache__', (Join-Path $src 'sessions\raw'))
    robocopy $src $dst /MIR /XF $JunkFiles /XD $excludeDirs /NFL /NDL /NJH /NJS /NP /R:2 /W:5 | Out-Null

    # Robocopy: 0-7 are success codes, 8+ are real failures.
    if ($LASTEXITCODE -ge 8) {
        throw "robocopy failed on '$folder' with exit code $LASTEXITCODE"
    }
    Write-Host "  synced  $folder"
}

# --- Local development trees: Paco and Power Cloud's own NetSuite projects ---
# Paco is part of the OS (Mike, 2026-09-14), and so are the NetSuite projects for
# Power Cloud's own account (Mike, 2026-10-12: "all of this needs to be part of
# Power Cloud OS", because the OS is being rebuilt as its own platform and the
# information has to live in one place). None of these trees is a mirror of a
# copy that exists elsewhere: what is here IS the record. On a machine without a
# tree, leave its copy alone rather than mirroring an absence into a deletion.
# Not here: client projects, and Power Cloud products with their own repos
# (PowerStripe and the Power* line).
$DevRoot = 'C:\Development\projects\Netsuite Development'
$LocalTrees = @(
    @{ Source = 'Power Cloud NS\Monday Morning\meeting_ingest';  Dest = 'paco\meeting_ingest' }
    @{ Source = 'Power Cloud NS\CRM';                            Dest = 'netsuite\crm' }
    @{ Source = 'Power Cloud NS\Task to Invoice';                Dest = 'netsuite\task-to-invoice' }
    @{ Source = 'Power Cloud NS\Unapproved Hours Monitor';       Dest = 'netsuite\unapproved-hours-monitor' }
    @{ Source = 'MCP\ScriptReader';                              Dest = 'netsuite\scriptreader' }
    @{ Source = 'Navan';                                         Dest = 'netsuite\navan' }
)
# Never copied out of a dev tree: version control of its own, dependencies, and
# anything that holds a credential or a live token. .env.example stays (it is the
# template); .env and .env.local do not.
$DevExcludeDirs  = @('.git', 'node_modules', '__pycache__', '.suitecloud')
$DevExcludeFiles = $JunkFiles + @('*.key', '*.pem', '.env', '.env.local', 'crm_api.local.json',
                                  '.token_cache.json', 'runbook_log.jsonl', '*.log', '*.sqlite', '*.db',
                                  'settings.local.json')

foreach ($tree in $LocalTrees) {
    $src = Join-Path $DevRoot $tree.Source
    $dst = Join-Path $Repo $tree.Dest
    if (-not (Test-Path -LiteralPath $src)) {
        Write-Warning ("{0} is not on this machine, so {1} was left untouched." -f $tree.Source, $tree.Dest)
        continue
    }
    $xd = @($DevExcludeDirs | ForEach-Object { $_ })
    robocopy $src $dst /MIR /XF $DevExcludeFiles /XD $xd /NFL /NDL /NJH /NJS /NP /R:2 /W:5 | Out-Null
    if ($LASTEXITCODE -ge 8) {
        throw ("robocopy failed on '{0}' with exit code {1}" -f $tree.Source, $LASTEXITCODE)
    }
    Write-Host ("  synced  {0}" -f $tree.Dest.Replace('\', '/'))
}

# --- Root-level files: copy top level only (no /S), then prune stale ones ---
robocopy $Source $Repo /XF $JunkFiles /NFL /NDL /NJH /NJS /NP /R:2 /W:5 | Out-Null
if ($LASTEXITCODE -ge 8) {
    throw "robocopy failed on root files with exit code $LASTEXITCODE"
}

$sourceRootNames = @(Get-ChildItem -LiteralPath $Source -File -Force | Select-Object -ExpandProperty Name)
$stale = Get-ChildItem -LiteralPath $Repo -File -Force |
    Where-Object { $_.Name -notin $sourceRootNames -and $_.Name -notin $RepoOwnedFiles }

foreach ($file in $stale) {
    Remove-Item -LiteralPath $file.FullName -Force
    Write-Host "  removed $($file.Name) (gone from source)"
}
Write-Host "  synced  root files ($($sourceRootNames.Count))"

# --- Guard: nothing but the allowlist may sit at the top level --------------
$allowedDirs = $Folders + @('.git', 'paco', 'netsuite')
$unexpected = Get-ChildItem -LiteralPath $Repo -Directory -Force |
    Where-Object { $_.Name -notin $allowedDirs }

if ($unexpected) {
    Write-Host ''
    throw ("Unexpected top-level folder(s) in the repo: {0}`n" -f ($unexpected.Name -join ', ')) +
          "Client material must never be committed here. Remove them, then re-run."
}

# --- Report -----------------------------------------------------------------
$files = Get-ChildItem -LiteralPath $Repo -Recurse -File -Force |
    Where-Object { $_.FullName -notlike "$Repo\.git\*" }
$sizeMb = [math]::Round((($files | Measure-Object -Property Length -Sum).Sum) / 1MB, 1)

Write-Host ''
Write-Host ("Backed up {0} files, {1} MB." -f $files.Count, $sizeMb)

# --- Commit and push --------------------------------------------------------
if ($NoCommit) {
    Write-Host 'Skipping commit (-NoCommit). Review with: git status'
    exit 0
}

Push-Location $Repo
try {
    git add -A

    # --quiet prints nothing and signals through the exit code: 0 = no changes.
    git diff --cached --quiet
    if ($LASTEXITCODE -eq 0) {
        Write-Host 'No changes since the last snapshot. Nothing to commit.'
        exit 0
    }

    $stamp = Get-Date -Format 'yyyy-MM-dd HH:mm'
    git commit -m "Snapshot $stamp" | Out-Null
    Write-Host "Committed: Snapshot $stamp"

    if ($NoPush) {
        Write-Host 'Skipping push (-NoPush).'
        exit 0
    }

    if (git remote) {
        git push
        Write-Host 'Pushed to GitHub.'
    }
    else {
        Write-Host 'No remote configured, so nothing was pushed.'
    }
}
finally {
    Pop-Location
}
