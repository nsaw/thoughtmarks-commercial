# ThoughtPilot Installation Scripts

This directory contains installation scripts for all ThoughtPilot tiers.

## Quick Start

### Unix/Linux/macOS
```bash
# Install Free tier
curl -fsSL https://install.thoughtpilot.ai/free | bash

# Install Pro tier
curl -fsSL https://install.thoughtpilot.ai/pro | bash

# Install Team tier
curl -fsSL https://install.thoughtpilot.ai/team | bash

# Install Enterprise tier
curl -fsSL https://install.thoughtpilot.ai/enterprise | bash
```

### Windows
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-Expression (New-Object Net.WebClient).DownloadString('https://install.thoughtpilot.ai/windows')
```

## Manual Installation

1. Download the appropriate script for your tier
2. Make it executable: `chmod +x install-*.sh`
3. Run the script: `./install-*.sh`

## System Requirements

- **Free**: Node.js 16+, npm
- **Pro**: Node.js 16+, npm, Docker
- **Team**: Node.js 16+, npm, Docker, kubectl
- **Enterprise**: Node.js 16+, npm, Docker, kubectl, SAML setup

## Troubleshooting

Run the doctor script after installation:
```bash
thoughtpilot doctor
```

For more help, visit: https://docs.thoughtpilot.ai/installation 