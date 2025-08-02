#!/bin/bash

set -e

echo '🚀 ThoughtPilot Universal Installer'
echo 'This installer will detect your needs and install the appropriate tier.'
echo ''

# Detect tier based on environment
if [ "$THOUGHTPILOT_TIER" = "enterprise" ]; then
    echo 'Installing Enterprise tier...'
    ./install-enterprise.sh || echo '⚠️ Enterprise install failed (continuing anyway)'
elif [ "$THOUGHTPILOT_TIER" = "team" ]; then
    echo 'Installing Team tier...'
    ./install-team.sh || echo '⚠️ Team install failed (continuing anyway)'
elif [ "$THOUGHTPILOT_TIER" = "pro" ]; then
    echo 'Installing Pro tier...'
    ./install-pro.sh || echo '⚠️ Pro install failed (continuing anyway)'
else
    echo 'Installing Free tier...'
    ./install-free.sh || echo '⚠️ Free install failed (continuing anyway)'
fi

echo '✅ Installation process completed' 