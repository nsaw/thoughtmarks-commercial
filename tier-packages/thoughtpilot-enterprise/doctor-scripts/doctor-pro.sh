#!/bin/bash
# ThoughtPilot Doctor Script - Pro Tier
# Run with: TIER_NAME=pro ./doctor-pro.sh

TIER_NAME="pro"
export TIER_NAME

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/doctor-base.sh" 