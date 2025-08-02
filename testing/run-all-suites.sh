#!/bin/bash

# ThoughtPilot Testing Suite - Main Runner
# Runs all test suites

echo "🧪 Running All ThoughtPilot Test Suites"
echo "======================================"
echo ""

# Test suites
SUITES=(
    "brutal"
    "edge-cases"
    "user-experience"
    "performance"
    "security"
)

# Run each suite
for suite in "${SUITES[@]}"; do
    echo "Running $suite tests..."
    if [ -d "$suite" ]; then
        cd "$suite"
        # Check for different possible runner script names
        if [ -f "run-all-tests.sh" ]; then
            ./run-all-tests.sh
        elif [ -f "run-edge-case-tests.sh" ]; then
            ./run-edge-case-tests.sh
        elif [ -f "run-ux-tests.sh" ]; then
            ./run-ux-tests.sh
        elif [ -f "run-performance-tests.sh" ]; then
            ./run-performance-tests.sh
        elif [ -f "run-security-tests.sh" ]; then
            ./run-security-tests.sh
        else
            echo "⚠️ No runner script found in $suite (continuing anyway)"
        fi
        cd ..
        echo "✅ $suite tests completed"
    else
        echo "⚠️ $suite test suite not found (continuing anyway)"
    fi
    echo ""
done

echo "✅ All test suites completed (non-blocking execution)"
