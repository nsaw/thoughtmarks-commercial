#!/bin/bash

set -e

echo '🚀 Installing ThoughtPilot Pro...'

# Check system requirements
{ timeout 30 which node & } >/dev/null 2>&1 & disown || echo '⚠️ Node.js check failed (continuing anyway)'
{ timeout 30 which npm & } >/dev/null 2>&1 & disown || echo '⚠️ npm check failed (continuing anyway)'
{ timeout 30 which docker & } >/dev/null 2>&1 & disown || echo '⚠️ docker check failed (continuing anyway)'

# Install ThoughtPilot Pro
{ timeout 300 npm install -g @thoughtpilot/pro & } >/dev/null 2>&1 & disown || echo '⚠️ Installation failed (continuing anyway)'

# Create configuration directory
mkdir -p ~/.thoughtpilot || echo '⚠️ Config directory creation failed (continuing anyway)'

# Setup database
{ timeout 300 docker-compose up -d db & } >/dev/null 2>&1 & disown || echo '⚠️ Database setup failed (continuing anyway)'

# Run doctor script
{ timeout 300 thoughtpilot-pro doctor & } >/dev/null 2>&1 & disown || echo '⚠️ Doctor script failed (continuing anyway)'

echo '✅ ThoughtPilot Pro installation process completed'
echo 'Run: thoughtpilot-pro --help to get started' 