Add-Type -AssemblyName System.Drawing

$sourcePath = 'd:\work\extenshion\reload\icon.png'
$outPath = 'd:\work\extenshion\reload'

# Load the image
$image = [System.Drawing.Image]::FromFile($sourcePath)

$sizes = @(16, 48, 128)

foreach ($size in $sizes) {
    # Create transparent bitmap
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    # High quality smoothing and interpolation
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    # Ensure background is fully transparent
    $g.Clear([System.Drawing.Color]::Transparent)

    # Set up a strict circular clipping path to chop off everything outside the perfect circle
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddEllipse(0, 0, $size, $size)
    $g.SetClip($path)

    # Draw the image into the circle mask
    $g.DrawImage($image, 0, 0, $size, $size)
    $g.Dispose()

    # Save
    $savePath = "$outPath\icon-$size.png"
    $bmp.Save($savePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created transparent circle icon: $savePath"
}

$image.Dispose()
