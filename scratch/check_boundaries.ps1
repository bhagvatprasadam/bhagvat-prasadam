Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\User 1\.gemini\antigravity-ide\brain\bf7dd630-4b66-417b-a55d-b4f47993f406\.user_uploaded\media_1790761854398.png"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)

for ($x = 480; $x -le 540; $x++) {
    $c = $img.GetPixel($x, 280)
    Write-Host "x=$x : R=$($c.R) G=$($c.G) B=$($c.B)"
}

for ($x = 970; $x -le 990; $x++) {
    $c = $img.GetPixel($x, 280)
    Write-Host "x=$x : R=$($c.R) G=$($c.G) B=$($c.B)"
}

$img.Dispose()
