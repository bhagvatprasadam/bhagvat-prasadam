Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\User 1\.gemini\antigravity-ide\brain\bf7dd630-4b66-417b-a55d-b4f47993f406\.user_uploaded\media_1790761854398.png"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)

# Find pixels with the deep red background of the card (R > 100, G < 30, B < 30) around x > 600, y between 150 and 350
$minX = 1024
$maxX = 0
$minY = 479
$maxY = 0

for ($y = 150; $y -lt 380; $y++) {
    for ($x = 500; $x -lt 1000; $x++) {
        $c = $img.GetPixel($x, $y)
        # Check for the red banner color (approx R: 110-150, G: 0-30, B: 10-35)
        if ($c.R -gt 90 -and $c.G -lt 30 -and $c.B -lt 35) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Red area: minX=$minX, maxX=$maxX, minY=$minY, maxY=$maxY"

# Now find the left edge of the banner (it has a light cream border/background)
# Let's inspect rows around minY+10 to maxY-10 from x=500 down to x=450
$bannerMinX = $minX
for ($y = $minY + 5; $y -lt $maxY - 5; $y += 5) {
    for ($x = 600; $x -ge 500; $x--) {
        $c = $img.GetPixel($x, $y)
        # If it's the cream/beige banner background (e.g. R > 230, G > 220, B > 200)
        if ($c.R -gt 230 -and $c.G -gt 220 -and $c.B -gt 190) {
            if ($x -lt $bannerMinX) { $bannerMinX = $x }
        }
    }
}

Write-Host "Banner left edge approx: $bannerMinX"
$img.Dispose()
