Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\User 1\.gemini\antigravity-ide\brain\bf7dd630-4b66-417b-a55d-b4f47993f406\.user_uploaded\media_1790761854398.png"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)

# Check pixels horizontally across y=280
$minX = 1024
$maxX = 0

for ($x = 400; $x -lt 1024; $x++) {
    $c = $img.GetPixel($x, 280)
    # The page background is white (255, 255, 255)
    # Card is not pure white
    if ($c.R -lt 250 -or $c.G -lt 250 -or $c.B -lt 250) {
        if ($x -lt $minX) { $minX = $x }
        if ($x -gt $maxX) { $maxX = $x }
    }
}

Write-Host "Card horizontally at y=280: minX=$minX, maxX=$maxX, width=$($maxX - $minX + 1)"

# Check vertically at x=minX+10 and x=maxX-10
$minY = 479
$maxY = 0
for ($y = 200; $y -lt 360; $y++) {
    $c = $img.GetPixel(800, $y)
    if ($c.R -lt 250 -or $c.G -lt 250 -or $c.B -lt 250) {
        if ($y -lt $minY) { $minY = $y }
        if ($y -gt $maxY) { $maxY = $y }
    }
}

Write-Host "Card vertically at x=800: minY=$minY, maxY=$maxY, height=$($maxY - $minY + 1)"

$img.Dispose()
