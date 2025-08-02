# ThoughtPilot Installation Guide (Hardened)

## Features
- **Non-blocking**: All heavy operations run in background with timeouts
- **CI/CD Safe**: No process will hang your pipeline or terminal
- **Logged**: All output captured to logs/ directory
- **Timeout Protected**: Every operation has appropriate timeout limits

## Usage

```bash
# Install specific tier
bash install-free.sh
bash install-pro.sh
bash install-team.sh
bash install-enterprise.sh

# Or use universal installer
TIER=pro bash install.sh
```

## Timeout Values
- Doctor scripts: 45 seconds
- Python dependencies: 120 seconds
- Node.js dependencies: 120 seconds
- Python tests: 60 seconds
- Node.js tests: 60 seconds

## Logs
All output is captured in the logs/ directory:
- doctor.log - System health check results
- pip-install.log - Python dependency installation
- npm-install.log - Node.js dependency installation
- pytest.log - Python test results
- npm-test.log - Node.js test results 