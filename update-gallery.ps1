# ─────────────────────────────────────────────────────────────────────────────
# update-gallery.ps1
# Octaves Website — Gallery Auto-Updater
#
# HOW TO USE:
#   1. Drop new photos into the "pictures for use" folder (any .jpg/.jpeg/.png/.webp)
#   2. Double-click this script (or run: powershell -ExecutionPolicy Bypass -File update-gallery.ps1)
#   3. Commit and push to GitHub — the gallery will be live!
#
# CATEGORY RULES (auto-assigned by filename prefix):
#   DSC*   → "performances"    (DSLR stage shots)
#   IMG*   → "portraits"       (phone portraits)
#   2026*  → "backstage"       (dated phone candids)
#   Everything else → "events"
#
# You can override per-file by editing the $categoryOverrides hashtable below.
# ─────────────────────────────────────────────────────────────────────────────

# ── Optional per-file category overrides ──────────────────────────────────────
# Key = filename (case-insensitive), Value = category ("performances"|"backstage"|"events"|"portraits")
$categoryOverrides = @{
    "DSC01080.JPG" = "events"
    "DSC01227.JPG" = "events"
    "DSC01228.JPG" = "events"
    "DSC00894.JPG" = "events"
    "DSC01239.JPG" = "backstage"
    "DSC01151.JPG" = "backstage"
    "DSC01154.JPG" = "backstage"
    "20260829_190833.jpg" = "backstage"
    "20260829_191727.jpg" = "backstage"
    "20260829_191732.jpg" = "backstage"
    "20260829_192206.jpg" = "events"
    "20260829_192217.jpg" = "events"
}

# ── Config ────────────────────────────────────────────────────────────────────
$scriptDir   = Split-Path -Parent $MyInvocation.MyCommand.Path
$galleryHtml = Join-Path $scriptDir "gallery.html"
$photosDir   = Join-Path $scriptDir "pictures for use"
$extensions  = @(".jpg", ".jpeg", ".png", ".webp")
$startMarker = "<!-- GALLERY-ITEMS-START"
$endMarker   = "<!-- GALLERY-ITEMS-END -->"

# ── Collect images (top-level only, skip subfolders) ──────────────────────────
$images = Get-ChildItem -Path $photosDir -File |
    Where-Object { $extensions -contains $_.Extension.ToLower() } |
    Sort-Object Name

if ($images.Count -eq 0) {
    Write-Host "No images found in '$photosDir'. Nothing to do." -ForegroundColor Yellow
    exit
}

Write-Host "Found $($images.Count) image(s). Generating gallery items..." -ForegroundColor Cyan

# ── Helper: determine category ────────────────────────────────────────────────
function Get-Category($filename) {
    if ($categoryOverrides.ContainsKey($filename)) {
        return $categoryOverrides[$filename]
    }
    $lower = $filename.ToLower()
    if ($lower.StartsWith("dsc"))  { return "performances" }
    if ($lower.StartsWith("img"))  { return "portraits" }
    if ($lower -match "^\d{8}_")   { return "backstage" }
    return "events"
}

# ── Helper: category display label ────────────────────────────────────────────
function Get-Label($cat) {
    switch ($cat) {
        "performances" { return "Performances" }
        "backstage"    { return "Backstage" }
        "portraits"    { return "Portraits" }
        default        { return "Events" }
    }
}

# ── Helper: friendly alt text ─────────────────────────────────────────────────
$counter = @{ performances = 0; backstage = 0; events = 0; portraits = 0 }
function Get-AltText($filename, $cat) {
    $script:counter[$cat]++
    switch ($cat) {
        "performances" { return "Octaves Performance $($script:counter[$cat])" }
        "backstage"    { return "Octaves Backstage $($script:counter[$cat])" }
        "portraits"    { return "Octaves Portrait $($script:counter[$cat])" }
        default        { return "Octaves Event $($script:counter[$cat])" }
    }
}

# ── Build HTML block ──────────────────────────────────────────────────────────
$lines = [System.Collections.Generic.List[string]]::new()
$lines.Add("      <!-- GALLERY-ITEMS-START (auto-generated — run update-gallery.ps1 to refresh) -->")

foreach ($img in $images) {
    $relPath = "pictures for use/$($img.Name)"
    $cat     = Get-Category $img.Name
    $label   = Get-Label $cat
    $alt     = Get-AltText $img.Name $cat

    $lines.Add("      <div class=`"gallery-item`" data-category=`"$cat`">")
    $lines.Add("        <img src=`"$relPath`" alt=`"$alt`" loading=`"lazy`" />")
    $lines.Add("        <div class=`"gallery-item-overlay`">")
    $lines.Add("          <div>")
    $lines.Add("            <span class=`"gallery-item-tag`">$label</span>")
    $lines.Add("            <p class=`"gallery-item-caption`">Octaves · VNIT Nagpur</p>")
    $lines.Add("          </div>")
    $lines.Add("        </div>")
    $lines.Add("      </div>")
}

$lines.Add("      <!-- GALLERY-ITEMS-END -->")
$newBlock = $lines -join "`n"

# ── Read gallery.html and splice in new block ─────────────────────────────────
$content = [System.IO.File]::ReadAllText($galleryHtml)

$startIdx = $content.IndexOf($startMarker)
$endIdx   = $content.IndexOf($endMarker)

if ($startIdx -lt 0 -or $endIdx -lt 0) {
    Write-Host "ERROR: Could not find GALLERY-ITEMS-START or GALLERY-ITEMS-END markers in gallery.html." -ForegroundColor Red
    Write-Host "Make sure gallery.html contains those comment markers." -ForegroundColor Red
    exit 1
}

$endIdx  = $endIdx + $endMarker.Length  # include the end marker itself
$before  = $content.Substring(0, $startIdx)
$after   = $content.Substring($endIdx)
$updated = $before + $newBlock + $after

[System.IO.File]::WriteAllText($galleryHtml, $updated, [System.Text.Encoding]::UTF8)

Write-Host ""
Write-Host "✔  gallery.html updated with $($images.Count) image(s)." -ForegroundColor Green
Write-Host ""
Write-Host "Category breakdown:" -ForegroundColor DarkCyan
foreach ($k in @("performances","backstage","events","portraits")) {
    if ($counter[$k] -gt 0) {
        Write-Host "   $k : $($counter[$k])" -ForegroundColor DarkCyan
    }
}
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review gallery.html in your browser to confirm images look good."
Write-Host "  2. Run: git add gallery.html 'pictures for use/'"
Write-Host "  3. Run: git commit -m 'Update gallery with new photos'"
Write-Host "  4. Run: git push origin main"
Write-Host ""
