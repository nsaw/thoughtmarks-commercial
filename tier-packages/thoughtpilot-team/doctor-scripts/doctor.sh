#!/bin/bash
# ThoughtPilot Doctor Script - Universal
# Automatically detects tier and runs appropriate diagnostics

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔬 ThoughtPilot Doctor - Universal${NC}"
echo "====================================="
echo

# Detect tier based on package.json
detect_tier() {
  if [[ -f "package.json" ]]; then
    PACKAGE_NAME=$(grep '"name"' package.json | cut -d'"' -f4 2>/dev/null || echo "")
    case "$PACKAGE_NAME" in
      "@thoughtpilot/free") echo "free" ;;
      "@thoughtpilot/pro") echo "pro" ;;
      "@thoughtpilot/team") echo "team" ;;
      "@thoughtpilot/enterprise") echo "enterprise" ;;
      *) echo "unknown" ;;
    esac
  else
    echo "unknown"
  fi
}

# Main execution
TIER=$(detect_tier)
echo "Detected tier: $TIER"
echo

if [[ "$TIER" == "unknown" ]]; then
  echo "⚠️  Could not detect tier. Running base diagnostics..."
  TIER_NAME="unknown"
  export TIER_NAME
  source "$SCRIPT_DIR/doctor-base.sh"
else
  echo "✅ Running $TIER tier diagnostics..."
  TIER_NAME="$TIER"
  export TIER_NAME
  source "$SCRIPT_DIR/doctor-base.sh"
fi 