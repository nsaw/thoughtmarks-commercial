# PowerShell installation script for Windows

Write-Host '🚀 Installing ThoughtPilot...' -ForegroundColor Green

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host '⚠️ Node.js is required but not installed. (continuing anyway)' -ForegroundColor Yellow
    Write-Host 'Please install Node.js from https://nodejs.org/' -ForegroundColor Yellow
}

# Install ThoughtPilot Free by default
Write-Host 'Installing ThoughtPilot Free...' -ForegroundColor Yellow
try {
    npm install -g @thoughtpilot/free
} catch {
    Write-Host '⚠️ Installation failed (continuing anyway)' -ForegroundColor Yellow
}

# Create configuration directory
try {
    New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.thoughtpilot"
} catch {
    Write-Host '⚠️ Config directory creation failed (continuing anyway)' -ForegroundColor Yellow
}

Write-Host '✅ ThoughtPilot installation process completed!' -ForegroundColor Green
Write-Host 'Run: thoughtpilot --help to get started' -ForegroundColor Cyan 