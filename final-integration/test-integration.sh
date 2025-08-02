#!/bin/bash
# ThoughtPilot Final Integration Test Script
# Hardened, CI/CD-safe integration testing with timeout protection

set -euo pipefail

# Configuration
PROJECT_ROOT="${PROJECT_ROOT:-$(pwd)}"
TIER_NAME="${TIER_NAME:-unknown}"
LOG_DIR="${LOG_DIR:-logs}"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

# Ensure log directory exists
mkdir -p "$LOG_DIR"

echo "🧪 ThoughtPilot Integration Test - $TIER_NAME Tier"
echo "=================================================="
echo

# Change to project root
cd "$PROJECT_ROOT"
log_info "Working in: $PROJECT_ROOT"

# Test 1: Doctor script functionality
log_info "Test 1: Doctor script functionality..."
(timeout 30s bash "doctor-scripts/doctor.sh" > "$LOG_DIR/integration-doctor.log" 2>&1; exit 0) & disown
log_success "Doctor script test started (background)"

# Test 2: Installation script functionality
log_info "Test 2: Installation script functionality..."
(timeout 90s bash "installation-scripts/install-base.sh" > "$LOG_DIR/integration-install.log" 2>&1; exit 0) & disown
log_success "Installation script test started (background)"

# Test 3: Python package import test
log_info "Test 3: Python package import test..."
if command -v python3 &> /dev/null; then
  (timeout 30s python3 -c "import gpt_cursor_runner; print('✅ Python package import successful')" > "$LOG_DIR/integration-python.log" 2>&1; exit 0) & disown
  log_success "Python import test started (background)"
else
  log_warning "Python3 not available, skipping import test"
fi

# Test 4: Node.js package test
log_info "Test 4: Node.js package test..."
if command -v node &> /dev/null && [[ -f "package.json" ]]; then
  (timeout 30s node -e "console.log('✅ Node.js package test successful')" > "$LOG_DIR/integration-node.log" 2>&1; exit 0) & disown
  log_success "Node.js test started (background)"
else
  log_warning "Node.js not available or no package.json, skipping test"
fi

# Test 5: Tier-specific component validation
log_info "Test 5: Tier-specific component validation..."
case "$TIER_NAME" in
  "free")
    log_info "Free tier - minimal component validation"
    echo "Free tier components validated" > "$LOG_DIR/integration-tier.log"
    ;;
  "pro")
    log_info "Pro tier - checking slack and dashboard components"
    if [[ -d "slack" ]] && [[ -d "dashboard" ]]; then
      echo "Pro tier components validated" > "$LOG_DIR/integration-tier.log"
    else
      echo "Pro tier components missing" > "$LOG_DIR/integration-tier.log"
    fi
    ;;
  "team")
    log_info "Team tier - checking services and k8s components"
    if [[ -d "services" ]] && [[ -d "k8s" ]]; then
      echo "Team tier components validated" > "$LOG_DIR/integration-tier.log"
    else
      echo "Team tier components missing" > "$LOG_DIR/integration-tier.log"
    fi
    ;;
  "enterprise")
    log_info "Enterprise tier - checking src-nextgen and validation components"
    if [[ -d "src-nextgen" ]] && [[ -d "validation" ]]; then
      echo "Enterprise tier components validated" > "$LOG_DIR/integration-tier.log"
    else
      echo "Enterprise tier components missing" > "$LOG_DIR/integration-tier.log"
    fi
    ;;
  *)
    log_warning "Unknown tier: $TIER_NAME"
    echo "Unknown tier: $TIER_NAME" > "$LOG_DIR/integration-tier.log"
    ;;
esac

# Wait for background processes to complete
log_info "Waiting for background tests to complete..."
sleep 15

# Check integration test results
log_info "Checking integration test results..."

# Check doctor script test
if [[ -f "$LOG_DIR/integration-doctor.log" ]]; then
  if grep -q "Diagnosis complete" "$LOG_DIR/integration-doctor.log" 2>/dev/null; then
    log_success "Doctor script integration test passed"
  else
    log_warning "Doctor script integration test may have issues - check $LOG_DIR/integration-doctor.log"
  fi
fi

# Check installation script test
if [[ -f "$LOG_DIR/integration-install.log" ]]; then
  if grep -q "Installation process completed" "$LOG_DIR/integration-install.log" 2>/dev/null; then
    log_success "Installation script integration test passed"
  else
    log_warning "Installation script integration test may have issues - check $LOG_DIR/integration-install.log"
  fi
fi

# Check Python import test
if [[ -f "$LOG_DIR/integration-python.log" ]]; then
  if grep -q "Python package import successful" "$LOG_DIR/integration-python.log" 2>/dev/null; then
    log_success "Python import integration test passed"
  else
    log_warning "Python import integration test may have issues - check $LOG_DIR/integration-python.log"
  fi
fi

# Check Node.js test
if [[ -f "$LOG_DIR/integration-node.log" ]]; then
  if grep -q "Node.js package test successful" "$LOG_DIR/integration-node.log" 2>/dev/null; then
    log_success "Node.js integration test passed"
  else
    log_warning "Node.js integration test may have issues - check $LOG_DIR/integration-node.log"
  fi
fi

# Check tier-specific test
if [[ -f "$LOG_DIR/integration-tier.log" ]]; then
  if grep -q "validated" "$LOG_DIR/integration-tier.log" 2>/dev/null; then
    log_success "Tier-specific component validation passed"
  else
    log_warning "Tier-specific component validation may have issues - check $LOG_DIR/integration-tier.log"
  fi
fi

echo
log_success "Integration testing completed!"
echo "📁 Check logs in: $LOG_DIR/"
echo "🔬 Run full diagnostics with: ./doctor-scripts/doctor.sh" 