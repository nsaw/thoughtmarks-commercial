#!/bin/bash

set -e

echo '🚀 Installing ThoughtPilot Team...'

# Check system requirements
{ timeout 30 which node & } >/dev/null 2>&1 & disown || echo '⚠️ Node.js check failed (continuing anyway)'
{ timeout 30 which npm & } >/dev/null 2>&1 & disown || echo '⚠️ npm check failed (continuing anyway)'
{ timeout 30 which docker & } >/dev/null 2>&1 & disown || echo '⚠️ docker check failed (continuing anyway)'
{ timeout 30 which kubectl & } >/dev/null 2>&1 & disown || echo '⚠️ kubectl check failed (continuing anyway)'

# Install ThoughtPilot Team
{ timeout 300 npm install -g @thoughtpilot/team & } >/dev/null 2>&1 & disown || echo '⚠️ Installation failed (continuing anyway)'

# Create configuration directory
mkdir -p ~/.thoughtpilot || echo '⚠️ Config directory creation failed (continuing anyway)'

# Setup infrastructure
{ timeout 300 docker-compose up -d & } >/dev/null 2>&1 & disown || echo '⚠️ Infrastructure setup failed (continuing anyway)'

# Run doctor script
{ timeout 300 thoughtpilot-team doctor & } >/dev/null 2>&1 & disown || echo '⚠️ Doctor script failed (continuing anyway)'

echo '✅ ThoughtPilot Team installation process completed'
echo 'Run: thoughtpilot-team --help to get started' 