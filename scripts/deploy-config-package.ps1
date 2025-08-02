Write-Host 'Deploying ThoughtPilot config package...'
Expand-Archive -Path 'configs/thoughtpilot-config-package.zip' -DestinationPath 'C:\ProgramData\ThoughtPilot\configs'
Write-Host '✅ Configs deployed to C:\ProgramData\ThoughtPilot\configs' 