#!/bin/bash
echo "🔬 ThoughtPilot Pro Tier Demo"
echo "Running Pro tier diagnostics..."
bash doctor-scripts/doctor-pro.sh
echo "Checking Slack integration..."
test -d slack && echo "✅ Slack integration found" || echo "❌ Slack integration missing"
echo "Checking dashboard..."
test -d dashboard && echo "✅ Dashboard found" || echo "❌ Dashboard missing"
echo "✅ Pro tier demo completed!"
