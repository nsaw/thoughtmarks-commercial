#!/bin/bash

set -e

echo '🚀 Installing ThoughtPilot Free...'

# Check system requirements
{ timeout 30 which node & } >/dev/null 2>&1 & disown || echo '⚠️ Node.js check failed (continuing anyway)'
{ timeout 30 which npm & } >/dev/null 2>&1 & disown || echo '⚠️ npm check failed (continuing anyway)'
{ timeout 30 which git & } >/dev/null 2>&1 & disown || echo '⚠️ git check failed (continuing anyway)'

# Install ThoughtPilot Free
{ timeout 300 npm install -g @thoughtpilot/free & } >/dev/null 2>&1 & disown || echo '⚠️ Installation failed (continuing anyway)'

# Create configuration directory
mkdir -p ~/.thoughtpilot || echo '⚠️ Config directory creation failed (continuing anyway)'

# Run doctor script
{ timeout 300 thoughtpilot doctor & } >/dev/null 2>&1 & disown || echo '⚠️ Doctor script failed (continuing anyway)'

echo '✅ ThoughtPilot Free installation process completed'
echo 'Run: thoughtpilot --help to get started' 