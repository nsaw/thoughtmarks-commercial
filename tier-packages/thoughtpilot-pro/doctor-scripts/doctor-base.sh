#!/bin/bash
# ThoughtPilot Doctor Script - Base Template
# Comprehensive diagnostic tool for ThoughtPilot installations

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TIER_NAME="${TIER_NAME:-unknown}"
VERBOSE="${VERBOSE:-false}"
QUIET="${QUIET:-false}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
  if [[ "$QUIET" != "true" ]]; then
    echo -e "${BLUE}ℹ️  $1${NC}"
  fi
}

log_success() {
  if [[ "$QUIET" != "true" ]]; then
    echo -e "${GREEN}✅ $1${NC}"
  fi
}

log_warning() {
  if [[ "$QUIET" != "true" ]]; then
    echo -e "${YELLOW}⚠️  $1${NC}"
  fi
}

log_error() {
  if [[ "$QUIET" != "true" ]]; then
    echo -e "${RED}❌ $1${NC}"
  fi
}

log_debug() {
  if [[ "$VERBOSE" == "true" ]] && [[ "$QUIET" != "true" ]]; then
    echo -e "${BLUE}🔍 DEBUG: $1${NC}"
  fi
}

# System information
get_system_info() {
  log_info "Gathering system information..."
  echo "=== System Information ==="
  echo "OS: $(uname -s)"
  echo "Architecture: $(uname -m)"
  echo "Kernel: $(uname -r)"
  echo "Hostname: $(hostname)"
  echo "User: $(whoami)"
  echo "Working Directory: $(pwd)"
  echo "Script Directory: $SCRIPT_DIR"
  echo "Tier: $TIER_NAME"
  echo "Timestamp: $(date -u +'%Y-%m-%d %H:%M:%S UTC')"
  echo
}

# Python environment check
check_python() {
  log_info "Checking Python environment..."
  echo "=== Python Environment ==="
  
  if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1)
    log_success "Python3 found: $PYTHON_VERSION"
    echo "Python3: $PYTHON_VERSION"
  else
    log_error "Python3 not found"
    echo "Python3: NOT FOUND"
    return 1
  fi
  
  if command -v pip3 &> /dev/null; then
    PIP_VERSION=$(pip3 --version 2>&1)
    log_success "Pip3 found: $PIP_VERSION"
    echo "Pip3: $PIP_VERSION"
  else
    log_warning "Pip3 not found"
    echo "Pip3: NOT FOUND"
  fi
  
  # Check Python modules
  log_debug "Checking Python modules..."
  for module in requests flask pytest; do
    if python3 -c "import $module" 2>/dev/null; then
      log_success "Python module '$module' available"
      echo "  $module: AVAILABLE"
    else
      log_warning "Python module '$module' not available"
      echo "  $module: NOT AVAILABLE"
    fi
  done
  echo
}

# Node.js environment check
check_nodejs() {
  log_info "Checking Node.js environment..."
  echo "=== Node.js Environment ==="
  
  if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version 2>&1)
    log_success "Node.js found: $NODE_VERSION"
    echo "Node.js: $NODE_VERSION"
  else
    log_warning "Node.js not found"
    echo "Node.js: NOT FOUND"
  fi
  
  if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version 2>&1)
    log_success "NPM found: $NPM_VERSION"
    echo "NPM: $NPM_VERSION"
  else
    log_warning "NPM not found"
    echo "NPM: NOT FOUND"
  fi
  echo
}

# File system check
check_filesystem() {
  log_info "Checking file system..."
  echo "=== File System ==="
  
  # Check disk space
  DISK_USAGE=$(df -h . | tail -1)
  log_info "Disk usage: $DISK_USAGE"
  echo "Disk Usage: $DISK_USAGE"
  
  # Check permissions
  if [[ -r . ]]; then
    log_success "Current directory is readable"
    echo "Current Directory Readable: YES"
  else
    log_error "Current directory is not readable"
    echo "Current Directory Readable: NO"
  fi
  
  if [[ -w . ]]; then
    log_success "Current directory is writable"
    echo "Current Directory Writable: YES"
  else
    log_error "Current directory is not writable"
    echo "Current Directory Writable: NO"
  fi
  echo
}

# Network connectivity check (hardened, non-blocking)
check_network() {
  log_info "Checking network connectivity..."
  echo "=== Network Connectivity ==="
  
  # Check internet connectivity (timeout protected)
  (timeout 10s ping -c 1 8.8.8.8 > /dev/null 2>&1; exit 0) & disown
  if ping -c 1 8.8.8.8 &> /dev/null; then
    log_success "Internet connectivity available"
    echo "Internet Connectivity: AVAILABLE"
  else
    log_warning "Internet connectivity not available"
    echo "Internet Connectivity: NOT AVAILABLE"
  fi
  
  # Check DNS resolution (timeout protected)
  (timeout 10s nslookup google.com > /dev/null 2>&1; exit 0) & disown
  if nslookup google.com &> /dev/null; then
    log_success "DNS resolution working"
    echo "DNS Resolution: WORKING"
  else
    log_warning "DNS resolution not working"
    echo "DNS Resolution: NOT WORKING"
  fi
  echo
}

# ThoughtPilot specific checks
check_thoughtpilot() {
  log_info "Checking ThoughtPilot installation..."
  echo "=== ThoughtPilot Installation ==="
  
  # Check if we're in a ThoughtPilot directory
  if [[ -f "gpt_cursor_runner/__init__.py" ]]; then
    log_success "ThoughtPilot Python package found"
    echo "Python Package: FOUND"
  else
    log_warning "ThoughtPilot Python package not found"
    echo "Python Package: NOT FOUND"
  fi
  
  if [[ -f "package.json" ]]; then
    log_success "Package.json found"
    echo "Package.json: FOUND"
    # Extract package name
    PACKAGE_NAME=$(grep '"name"' package.json | cut -d'"' -f4 2>/dev/null || echo "unknown")
    echo "Package Name: $PACKAGE_NAME"
  else
    log_warning "Package.json not found"
    echo "Package.json: NOT FOUND"
  fi
  
  # Check for core directories
  for dir in gpt_cursor_runner core utils bin; do
    if [[ -d "$dir" ]]; then
      log_success "Directory '$dir' found"
      echo "  $dir: FOUND"
    else
      log_warning "Directory '$dir' not found"
      echo "  $dir: NOT FOUND"
    fi
  done
  echo
}

# Tier-specific checks
check_tier_specific() {
  log_info "Checking tier-specific components..."
  echo "=== Tier-Specific Components ==="
  
  case "$TIER_NAME" in
    "free")
      log_info "Checking Free tier components..."
      echo "Tier: Free"
      # Free tier has minimal requirements
      ;;
    "pro")
      log_info "Checking Pro tier components..."
      echo "Tier: Pro"
      for dir in slack dashboard; do
        if [[ -d "$dir" ]]; then
          log_success "Pro component '$dir' found"
          echo "  $dir: FOUND"
        else
          log_warning "Pro component '$dir' not found"
          echo "  $dir: NOT FOUND"
        fi
      done
      ;;
    "team")
      log_info "Checking Team tier components..."
      echo "Tier: Team"
      for dir in services k8s deployment; do
        if [[ -d "$dir" ]]; then
          log_success "Team component '$dir' found"
          echo "  $dir: FOUND"
        else
          log_warning "Team component '$dir' not found"
          echo "  $dir: NOT FOUND"
        fi
      done
      ;;
    "enterprise")
      log_info "Checking Enterprise tier components..."
      echo "Tier: Enterprise"
      for dir in src-nextgen validation; do
        if [[ -d "$dir" ]]; then
          log_success "Enterprise component '$dir' found"
          echo "  $dir: FOUND"
        else
          log_warning "Enterprise component '$dir' not found"
          echo "  $dir: NOT FOUND"
        fi
      done
      ;;
    *)
      log_warning "Unknown tier: $TIER_NAME"
      echo "Tier: UNKNOWN ($TIER_NAME)"
      ;;
  esac
  echo
}

# Generate recommendations
generate_recommendations() {
  log_info "Generating recommendations..."
  echo "=== Recommendations ==="
  
  # Check for common issues and provide recommendations
  if ! command -v python3 &> /dev/null; then
    echo "• Install Python 3.8 or higher"
  fi
  
  if ! command -v pip3 &> /dev/null; then
    echo "• Install pip3 for Python package management"
  fi
  
  if ! [[ -f "gpt_cursor_runner/__init__.py" ]]; then
    echo "• Ensure ThoughtPilot is properly installed"
  fi
  
  if ! [[ -f "package.json" ]]; then
    echo "• Run 'npm install' to install dependencies"
  fi
  
  # Tier-specific recommendations
  case "$TIER_NAME" in
    "pro")
      if ! [[ -d "slack" ]]; then
        echo "• Pro tier requires Slack integration components"
      fi
      if ! [[ -d "dashboard" ]]; then
        echo "• Pro tier requires dashboard components"
      fi
      ;;
    "team")
      if ! [[ -d "services" ]]; then
        echo "• Team tier requires services components"
      fi
      if ! [[ -d "k8s" ]]; then
        echo "• Team tier requires Kubernetes components"
      fi
      ;;
    "enterprise")
      if ! [[ -d "src-nextgen" ]]; then
        echo "• Enterprise tier requires nextgen components"
      fi
      if ! [[ -d "validation" ]]; then
        echo "• Enterprise tier requires validation components"
      fi
      ;;
  esac
  echo
}

# Main function
main() {
  echo "🔬 ThoughtPilot Doctor - $TIER_NAME Tier"
  echo "=========================================="
  echo
  
  get_system_info
  check_python
  check_nodejs
  check_filesystem
  check_network
  check_thoughtpilot
  check_tier_specific
  generate_recommendations
  
  echo "🔬 Diagnosis complete!"
}

# Run main function
main "$@" 