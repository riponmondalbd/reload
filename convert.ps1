Add-Type -AssemblyName System.Drawing

$sourcePath = 'd:\work\extenshion\reload\icon.png'
$outPath = 'd:\work\extenshion\reload'

# Load the image
$image = [System.Drawing.Image]::FromFile($sourcePath)

$sizes = @(16, 48, 128)

foreach ($size in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($image, 0, 0, $size, $size)
    $graphics.Dispose()

    $savePath = "$outPath\icon-$size.png"
    $bmp.Save($savePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created $savePath"
}

$image.Dispose()
