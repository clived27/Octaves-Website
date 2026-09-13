# ─────────────────────────────────────────────────────────────────────────────
# update-gallery.ps1
# Octaves Website — Gallery Auto-Updater
#
# HOW TO USE:
#   1. Drop new photos into the "pictures for use" folder (any .jpg/.jpeg/.png/.webp)
#   2. Double-click this script (or run: powershell -ExecutionPolicy Bypass -File update-gallery.ps1)
#   3. Commit and push to GitHub — the gallery will be live!
# ─────────────────────────────────────────────────────────────────────────────

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

# ── Build HTML block ──────────────────────────────────────────────────────────
$lines = [System.Collections.Generic.List[string]]::new()
$lines.Add("      <!-- GALLERY-ITEMS-START (auto-generated — run update-gallery.ps1 to refresh) -->")

foreach ($img in $images) {
    $relPath = "pictures for use/$($img.Name)"
    $lines.Add("      <div class=`"gallery-item`"><img src=`"$relPath`" alt=`"Octaves`" loading=`"lazy`" /></div>")
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
