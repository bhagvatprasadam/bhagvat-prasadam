Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\User 1\.gemini\antigravity-ide\brain\bf7dd630-4b66-417b-a55d-b4f47993f406\.user_uploaded\media_1790761854398.png"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)

for ($y = 220; $y -le 235; $y++) {
    $c = $img.GetPixel(800, $y)
    Write-Host "y=$y : R=$($c.R) G=$($c.G) B=$($c.B)"
}

for ($y = 330; $y -le 342; $y++) {
    $c = $img.GetPixel(800, $y)
    Write-Host "y=$y : R=$($c.R) G=$($c.G) B=$($c.B)"
}

$img.Dispose()
