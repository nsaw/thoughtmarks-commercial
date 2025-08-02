# Edge Case Testing Suite

This directory contains edge case testing for ThoughtPilot.

## Overview

Edge case testing covers:
- Low disk space scenarios
- Bad network connectivity
- Interrupted installations
- Permission issues
- Port conflicts

## Running Tests

```bash
./run-edge-case-tests.sh
```

## Test Categories

- **Resource Constraints**: Low memory, disk space, CPU
- **Network Issues**: Slow network, intermittent connectivity
- **Permission Issues**: Read-only filesystems, permission denied
- **System Conflicts**: Conflicting software, services
