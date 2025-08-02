#!/bin/bash
# ThoughtPilot Doctor Script - Free Tier
# Run with: TIER_NAME=free ./doctor-free.sh

TIER_NAME="free"
export TIER_NAME

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/doctor-base.sh" 