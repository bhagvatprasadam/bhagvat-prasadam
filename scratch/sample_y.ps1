Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\User 1\.gemini\antigravity-ide\brain\bf7dd630-4b66-417b-a55d-b4f47993f406\.user_uploaded\media_1790761854398.png"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)

for ($y = 150; $y -le 450; $y += 5) {
    $c550 = $img.GetPixel(550, $y)
    $c800 = $img.GetPixel(800, $y)
    Write-Host "y=$y | at 550: R=$($c550.R) G=$($c550.G) B=$($c550.B) | at 800: R=$($c800.R) G=$($c800.G) B=$($c800.B)"
}

$img.Dispose()
