#!/bin/bash
# ThoughtPilot Installation Validator
# Validates that ThoughtPilot is properly installed and configured

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }

echo "🔍 Validating ThoughtPilot installation..."
echo

ERRORS=0
WARNINGS=0

# Check Python package
if [[ -f "gpt_cursor_runner/__init__.py" ]]; then
  log_success "Python package found"
else
  log_error "Python package not found"
  ((ERRORS++))
fi

# Check package.json
if [[ -f "package.json" ]]; then
  log_success "Package.json found"
else
  log_error "Package.json not found"
  ((ERRORS++))
fi

# Check core directories
for dir in gpt_cursor_runner core utils bin; do
  if [[ -d "$dir" ]]; then
    log_success "Directory '$dir' found"
  else
    log_warning "Directory '$dir' not found"
    ((WARNINGS++))
  fi
done

# Check Python dependencies
if [[ -f "requirements.txt" ]]; then
  log_success "Requirements.txt found"
  if command -v pip3 &> /dev/null; then
    log_success "Pip3 available for dependency installation"
  else
    log_warning "Pip3 not available"
    ((WARNINGS++))
  fi
else
  log_warning "Requirements.txt not found"
  ((WARNINGS++))
fi

# Check Node.js dependencies
if [[ -f "package.json" ]]; then
  if command -v npm &> /dev/null; then
    log_success "NPM available for dependency installation"
  else
    log_warning "NPM not available"
    ((WARNINGS++))
  fi
fi

echo
echo "Validation Summary:"
echo "  Errors: $ERRORS"
echo "  Warnings: $WARNINGS"
echo

if [[ $ERRORS -eq 0 ]]; then
  log_success "Installation validation passed!"
  exit 0
else
  log_error "Installation validation failed with $ERRORS errors"
  exit 1
fi 