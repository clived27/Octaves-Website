# ─────────────────────────────────────────────────────────────────────────────
# update-gallery.ps1
# Octaves Website — Gallery Auto-Updater
#
# HOW TO USE:
#   1. Drop new photos into the "pictures for use" folder (any .jpg/.jpeg/.png/.webp)
#   2. Double-click this script (or run: powershell -ExecutionPolicy Bypass -File update-gallery.ps1)
#   3. Commit and push to GitHub — the gallery will be live!
# ─────────────────────────────────────────────────────────────────────────────

$scriptDir   = Split-Path -Parent $MyInvocation.MyCommand.Path
$galleryHtml = Join-Path $scriptDir "gallery.html"
$photosDir   = Join-Path $scriptDir "pictures for use"
$extensions  = @(".jpg", ".jpeg", ".png", ".webp")
$startMarker = "<!-- GALLERY-ITEMS-START"
$endMarker   = "<!-- GALLERY-ITEMS-END -->"

$images = Get-ChildItem -Path $photosDir -File |
    Where-Object { $extensions -contains $_.Extension.ToLower() } |
    Get-Random -Count 999

if ($images.Count -eq 0) {
    Write-Host "No images found in '$photosDir'. Nothing to do." -ForegroundColor Yellow
    exit
}

Write-Host "Found $($images.Count) image(s). Generating gallery items..." -ForegroundColor Cyan

$lines = [System.Collections.Generic.List[string]]::new()
$lines.Add('      <!-- GALLERY-ITEMS-START (auto-generated — run update-gallery.ps1 to refresh) -->')

foreach ($img in $images) {
    $name = $img.Name
    $lines.Add("      <div class=""gallery-item""><img src=""pictures for use/$name"" alt=""Octaves"" loading=""lazy"" /></div>")
}

$lines.Add('      <!-- GALLERY-ITEMS-END -->')
$newBlock = $lines -join "`n"

$content = [System.IO.File]::ReadAllText($galleryHtml)

$startIdx = $content.IndexOf($startMarker)
$endIdx   = $content.IndexOf($endMarker)

if ($startIdx -lt 0 -or $endIdx -lt 0) {
    Write-Host "ERROR: Could not find GALLERY-ITEMS-START or GALLERY-ITEMS-END markers in gallery.html." -ForegroundColor Red
    exit 1
}

$endIdx  = $endIdx + $endMarker.Length
$before  = $content.Substring(0, $startIdx)
$after   = $content.Substring($endIdx)
$updated = $before + $newBlock + $after

[System.IO.File]::WriteAllText($galleryHtml, $updated, [System.Text.Encoding]::UTF8)

Write-Host "Gallery updated cleanly." -ForegroundColor Green

