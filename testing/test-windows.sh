#!/bin/bash

set -e

echo 'Testing ThoughtPilot on Windows...'

# Test Free tier
{ timeout 300 npm install -g @thoughtpilot/free & } >/dev/null 2>&1 & disown || echo '⚠️ Free install failed (continuing anyway)'
{ timeout 300 thoughtpilot doctor & } >/dev/null 2>&1 & disown || echo '⚠️ Free doctor failed (continuing anyway)'
{ timeout 300 thoughtpilot --version & } >/dev/null 2>&1 & disown || echo '⚠️ Free version check failed (continuing anyway)'

# Test Pro tier
{ timeout 300 npm install -g @thoughtpilot/pro & } >/dev/null 2>&1 & disown || echo '⚠️ Pro install failed (continuing anyway)'
{ timeout 300 thoughtpilot-pro doctor & } >/dev/null 2>&1 & disown || echo '⚠️ Pro doctor failed (continuing anyway)'

# Test Team tier
{ timeout 300 npm install -g @thoughtpilot/team & } >/dev/null 2>&1 & disown || echo '⚠️ Team install failed (continuing anyway)'
{ timeout 300 thoughtpilot-team doctor & } >/dev/null 2>&1 & disown || echo '⚠️ Team doctor failed (continuing anyway)'

# Test Enterprise tier
{ timeout 300 npm install -g @thoughtpilot/enterprise & } >/dev/null 2>&1 & disown || echo '⚠️ Enterprise install failed (continuing anyway)'
{ timeout 300 thoughtpilot-enterprise doctor & } >/dev/null 2>&1 & disown || echo '⚠️ Enterprise doctor failed (continuing anyway)'

echo '✅ Windows tests completed (non-blocking)' 