#!/bin/bash
# ThoughtPilot Doctor Script - Enterprise Tier
# Run with: TIER_NAME=enterprise ./doctor-enterprise.sh

TIER_NAME="enterprise"
export TIER_NAME

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/doctor-base.sh" 