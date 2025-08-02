#!/bin/bash
# ThoughtPilot Free Tier Installation - Hardened
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT/tier-packages/thoughtpilot-free"
TIER_NAME="free"
source "$SCRIPT_DIR/install-base.sh" 