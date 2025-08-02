# ThoughtPilot Testing Suite

This directory contains comprehensive testing suites for ThoughtPilot.

## Test Categories

### [Brutal Testing](./brutal/)
Extreme condition testing for installations and system behavior.

### [Edge Case Testing](./edge-cases/)
Testing under resource constraints and unusual conditions.

### [User Experience Testing](./user-experience/)
Testing user interface and experience design.

### [Performance Testing](./performance/)
Testing system performance and scalability.

### [Security Testing](./security/)
Testing security vulnerabilities and compliance.

## Running All Tests

```bash
# Run all test suites
./run-all-suites.sh

# Run specific test suite
cd brutal && ./run-all-tests.sh
cd edge-cases && ./run-edge-case-tests.sh
cd user-experience && ./run-ux-tests.sh
cd performance && ./run-performance-tests.sh
cd security && ./run-security-tests.sh
```

## Test Results

Each test suite generates its own results in:
- `brutal/results/`
- `edge-cases/results/`
- `user-experience/results/`
- `performance/results/`
- `security/results/`

## Configuration

Test configuration can be customized via:
- Environment variables
- Configuration files
- Command line options

## Support

For testing issues:
- [Test Documentation](./docs/)
- [Test Examples](./examples/)
- [Test Troubleshooting](./troubleshooting.md)
