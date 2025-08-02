#!/bin/bash
# ThoughtPilot Universal Installation Script - Hardened
set -euo pipefail
TIER="${TIER:-free}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
echo "🔧 Installing ThoughtPilot $TIER tier..."
bash "$SCRIPT_DIR/install-$TIER.sh" 