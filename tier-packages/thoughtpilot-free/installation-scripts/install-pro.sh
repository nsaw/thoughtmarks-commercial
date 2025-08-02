#!/bin/bash
# ThoughtPilot Pro Tier Installation - Hardened
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT/tier-packages/thoughtpilot-pro"
TIER_NAME="pro"
source "$SCRIPT_DIR/install-base.sh" 