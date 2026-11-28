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
$key = $Matches[1] + "/" + $Matches[2]
$text = [Uri]::UnescapeDataString($Matches[3])
if ($text -notmatch '^/roll dice: [0-9dkl +-]+$') { exit 1 }
$cache = Join-Path $PSScriptRoot "channels.txt"
$titles = @{}
if ([IO.File]::Exists($cache)) { foreach ($line in [IO.File]::ReadAllLines($cache)) { $k, $v = $line -split "=", 2; if ($v) { $titles[$k] = $v } } }
$save = { [IO.File]::WriteAllLines($cache, [string[]]@($titles.GetEnumerator() | ForEach-Object { $_.Key + "=" + $_.Value })) }
$known = $titles[$key]
$find = { [Diagnostics.Process]::GetProcessesByName("Discord") | Where-Object { $_.MainWindowHandle -ne 0 } | Select-Object -First 1 }
$discord = & $find
$wasRunning = [bool]$discord
$before = if ($discord) { $discord.MainWindowTitle } else { "" }
Set-Clipboard -Value $text
if (-not ($known -and $before.Contains($known))) {
  $link = "discord://-/channels/$key"
  $exe = [regex]::Match([string][Microsoft.Win32.Registry]::GetValue("HKEY_CURRENT_USER\Software\Classes\discord\shell\open\command", "", ""), '^"([^"]+)"').Groups[1].Value
  if ($exe -and [IO.File]::Exists($exe)) {
    $start = New-Object Diagnostics.ProcessStartInfo $exe, "--url -- `"$link`""
    $start.UseShellExecute = $false
    $start.CreateNoWindow = $true
    [void][Diagnostics.Process]::Start($start)
  } else { Start-Process $link }
  $limit = if ($wasRunning) { 4000 } else { 30000 }
  $sw = [Diagnostics.Stopwatch]::StartNew()
  while (-not $discord -and $sw.ElapsedMilliseconds -lt $limit) { Start-Sleep -Milliseconds 50; $discord = & $find }
  if (-not $discord) { exit 1 }
  $last = $before
  $changed = -1
  $ok = $false
  while ($sw.ElapsedMilliseconds -lt $limit) {
    $discord.Refresh()
    $title = $discord.MainWindowTitle
    if ($known -and $title.Contains($known)) { $ok = $true; break }
    if ($title -ne $last) { $last = $title; $changed = $sw.ElapsedMilliseconds }
    elseif (-not $known -and $changed -ge 0 -and $title.Contains(" | ") -and $sw.ElapsedMilliseconds - $changed -ge 250) { $ok = $true; break }
    Start-Sleep -Milliseconds 25
  }
  if (-not $ok -and -not $known -and $last -eq $before -and $before.Contains(" | ")) { $ok = $true; $title = $before }
  if (-not $ok) { $titles.Remove($key); & $save; exit 1 }
  if (-not $known) { $titles[$key] = $title -replace '^\(\d+\)\s*', ''; & $save }
  Start-Sleep -Milliseconds $(if ($wasRunning) { 150 } else { 1500 })
}
$shell = New-Object -ComObject WScript.Shell
$tries = 0
while (-not $shell.AppActivate($discord.Id)) { if (++$tries -ge 20) { exit 1 }; Start-Sleep -Milliseconds 50 }
$discord.Refresh()
if (-not $discord.MainWindowTitle.Contains($titles[$key])) { exit 1 }
$shell.SendKeys("^v")
Start-Sleep -Milliseconds 300
$shell.SendKeys("{ENTER}")
'@
New-Item "$key\shell\open\command" -Force | Out-Null
Set-ItemProperty $key "(default)" "URL:Jets de la fiche D&D vers Discord"
Set-ItemProperty $key "URL Protocol" ""
Set-ItemProperty "$key\shell\open\command" "(default)" "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$file`" `"%1`""
Write-Host "Installé. Dans la fiche : Options, Salon Discord, puis cochez « Envoi direct »."
