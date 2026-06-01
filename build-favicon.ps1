$bytes = [System.IO.File]::ReadAllBytes("logo.png")
$base64 = [System.Convert]::ToBase64String($bytes)
$svg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <circle cx="64" cy="64" r="64" fill="#0A1128" />
  <image href="data:image/png;base64,$base64" x="14" y="34" width="100" height="60" preserveAspectRatio="xMidYMid meet" />
</svg>
"@
[System.IO.File]::WriteAllText("favicon.svg", $svg)
Write-Host "favicon.svg created successfully!"
