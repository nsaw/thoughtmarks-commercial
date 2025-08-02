#!/bin/bash
# ThoughtPilot Doctor Script - Team Tier
# Run with: TIER_NAME=team ./doctor-team.sh

TIER_NAME="team"
export TIER_NAME

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/doctor-base.sh" 