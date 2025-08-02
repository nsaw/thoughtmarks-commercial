# ThoughtPilot Doctor Scripts

Comprehensive diagnostic tools for ThoughtPilot installations across all tiers.

## Scripts

### Universal Doctor
- **doctor.sh**: Automatically detects tier and runs appropriate diagnostics
- **Usage**: `./doctor.sh`

### Tier-Specific Doctors
- **doctor-free.sh**: Free tier diagnostics
- **doctor-pro.sh**: Pro tier diagnostics
- **doctor-team.sh**: Team tier diagnostics
- **doctor-enterprise.sh**: Enterprise tier diagnostics
- **Usage**: `TIER_NAME=<tier> ./doctor-<tier>.sh`

### Installation Validator
- **validate-installation.sh**: Validates ThoughtPilot installation
- **Usage**: `./validate-installation.sh`

## Features

### System Diagnostics
- Python environment check
- Node.js environment check
- File system validation
- Network connectivity test
- Disk space analysis

### ThoughtPilot Specific
- Package structure validation
- Tier-specific component checks
- Dependency verification
- Configuration validation

### Recommendations
- Actionable feedback for issues
- Installation guidance
- Troubleshooting suggestions

## Usage Examples

```bash
# Run universal diagnostics
./doctor.sh

# Run specific tier diagnostics
TIER_NAME=pro ./doctor-pro.sh

# Validate installation
./validate-installation.sh

# Verbose output
VERBOSE=true ./doctor.sh

# Quiet mode
QUIET=true ./doctor.sh
```

## Output

The doctor scripts provide detailed diagnostic information including:
- System information
- Environment checks
- Component validation
- Issue identification
- Recommendations

## Exit Codes

- **0**: All checks passed
- **1**: Errors found
- **2**: Warnings only

## Integration

These scripts can be integrated into:
- CI/CD pipelines
- Installation processes
- Troubleshooting workflows
- Health monitoring systems 