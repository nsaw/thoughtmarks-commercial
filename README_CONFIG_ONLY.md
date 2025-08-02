# ThoughtPilot Config-Only Distribution (Pivoted)

## NOTICE
This release contains only configuration, feature flag, and infrastructure packages.
No application installer is required or provided at this time.

## How to Use
- Download and extract `configs/thoughtpilot-config-package.zip` (Windows) or `configs/thoughtpilot-config-package.tar.gz` (Linux/macOS).
- Run the included deployment script for your platform:
    - **Linux/macOS:** `bash scripts/deploy-config-package.sh`
    - **Windows:** `pwsh scripts/deploy-config-package.ps1`
- Configs will be placed in the standard directory for your system.

## Why This Change?
- The current packages do not include any executable software or applications, only configs.
- Platform-specific installers (like .exe or .pkg) would confuse users and are not appropriate for configuration-only distributions.
- When a real ThoughtPilot application is available, platform installers will be added back to the CI/CD pipeline.

## Support
For feedback or help, open an issue or contact the project owner. 