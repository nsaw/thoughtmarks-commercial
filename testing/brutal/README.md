# Brutal Installation Testing Suite

This directory contains the brutal installation testing suite for ThoughtPilot.

## Overview

The brutal testing suite is designed to test ThoughtPilot installations under extreme conditions:

- **Multiple simultaneous installations**
- **Network interruptions**
- **Disk space exhaustion**
- **Permission failures**
- **Corrupted downloads**
- **Incomplete installations**
- **System resource exhaustion**

## Test Categories

### Installation Tests
- **Clean Install**: Fresh installation on clean system
- **Dirty Install**: Installation on system with existing ThoughtPilot
- **Partial Install**: Interrupted installation recovery
- **Corrupted Install**: Installation with corrupted files
- **Network Install**: Installation with network issues

### Environment Tests
- **Resource Exhaustion**: Low memory, disk space, CPU
- **Permission Issues**: Read-only filesystems, permission denied
- **Network Issues**: Slow network, intermittent connectivity
- **System Conflicts**: Conflicting software, services

### Recovery Tests
- **Installation Recovery**: Recover from failed installations
- **Data Recovery**: Recover from corrupted data
- **Configuration Recovery**: Recover from bad configuration
- **Service Recovery**: Recover from service failures

## Running Tests

### Quick Test

```bash
# Run all tests
./run-all-tests.sh

# Run specific test category
./run-installation-tests.sh
./run-environment-tests.sh
./run-recovery-tests.sh
```

### Individual Tests

```bash
# Clean installation test
./test-clean-install.sh

# Network interruption test
./test-network-interruption.sh

# Resource exhaustion test
./test-resource-exhaustion.sh

# Recovery test
./test-recovery.sh
```

### Test Options

```bash
# Run with specific options
./run-all-tests.sh --parallel 4
./run-all-tests.sh --timeout 3600
./run-all-tests.sh --continue-on-failure

# Run on specific platforms
./run-all-tests.sh --platform macos
./run-all-tests.sh --platform linux
./run-all-tests.sh --platform windows
```

## Test Results

Test results are stored in the `results/` directory:

- **Passed Tests**: `results/passed/`
- **Failed Tests**: `results/failed/`
- **Test Logs**: `results/logs/`
- **Test Reports**: `results/reports/`

## Test Configuration

Tests can be configured via `test-config.json`:

```json
{
  "parallel": 4,
  "timeout": 3600,
  "continueOnFailure": true,
  "platforms": ["macos", "linux", "windows"],
  "testCategories": ["installation", "environment", "recovery"]
}
```

## Adding New Tests

To add a new test:

1. Create test script in appropriate category directory
2. Add test to test registry
3. Update test documentation
4. Run test validation

## Support

For test-related issues:
- [Test Documentation](./docs/)
- [Test Examples](./examples/)
- [Test Troubleshooting](./troubleshooting.md)
- [Test Support](mailto:test-support@thoughtpilot.ai)
