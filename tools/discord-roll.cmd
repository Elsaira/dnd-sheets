<# :
@echo off
set "DNDROLL_FILE=%~f0"
powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ([IO.File]::ReadAllText($env:DNDROLL_FILE))"
pause
exit /b
#>
$dir = Join-Path $env:LOCALAPPDATA "dnd-sheets"
$file = Join-Path $dir "discord-roll.ps1"
$key = "HKCU:\Software\Classes\dndroll"
if (Test-Path $key) {
  $answer = Read-Host "Déjà installé. Tapez D puis Entrée pour désinstaller, ou Entrée seule pour réinstaller"
  if ($answer -match '^[dD]') {
    Remove-Item $key -Recurse
    Remove-Item $dir -Recurse -ErrorAction SilentlyContinue
    Write-Host "Désinstallé."
    return
  }
}
New-Item $dir -ItemType Directory -Force | Out-Null
Set-Content -Path $file -Encoding UTF8 -Value @'
param([string]$Url)
if ($Url -notmatch '^dndroll://(\d+)/(\d+)/([^/]+)/?$') { exit 1 }
$guild = $Matches[1]
$channel = $Matches[2]
$text = [Uri]::UnescapeDataString($Matches[3])
if ($text -notmatch '^/roll dice: [0-9dkl +-]+$') { exit 1 }
$running = Get-Process Discord -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 } | Select-Object -First 1
Set-Clipboard -Value $text
Start-Process "discord://-/channels/$guild/$channel"
$discord = $null
for ($i = 0; $i -lt 60 -and -not $discord; $i++) {
  Start-Sleep -Milliseconds 250
  $discord = Get-Process Discord -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 } | Select-Object -First 1
}
if (-not $discord) { exit 1 }
Start-Sleep -Milliseconds $(if ($running) { 800 } else { 6000 })
$shell = New-Object -ComObject WScript.Shell
if (-not $shell.AppActivate($discord.Id)) { exit 1 }
Start-Sleep -Milliseconds 150
$shell.SendKeys("^v")
Start-Sleep -Milliseconds 600
$shell.SendKeys("{ENTER}")
'@
New-Item "$key\shell\open\command" -Force | Out-Null
Set-ItemProperty $key "(default)" "URL:Jets de la fiche D&D vers Discord"
Set-ItemProperty $key "URL Protocol" ""
Set-ItemProperty "$key\shell\open\command" "(default)" "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$file`" `"%1`""
Write-Host "Installé. Dans la fiche : Options, Salon Discord, puis cochez « Envoi direct »."
