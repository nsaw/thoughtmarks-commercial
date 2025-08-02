#!/bin/bash

# ThoughtPilot Support Information Script
# This script provides support information and contact details

echo "📞 ThoughtPilot Support Information"
echo "================================="
echo ""

echo "🔗 Support Channels"
echo "-----------------"
echo "• Documentation: https://docs.thoughtpilot.ai"
echo "• Community Forum: https://community.thoughtpilot.ai"
echo "• Discord: https://discord.gg/thoughtpilot"
echo "• Email: support@thoughtpilot.ai"
echo "• Slack: #thoughtpilot-support"
echo ""

echo "📋 Before Contacting Support"
echo "-------------------------"
echo "1. Check the documentation first"
echo "2. Search the community forum"
echo "3. Run diagnostics: ./diagnostics.sh"
echo "4. Run health check: ./health-check.sh"
echo "5. Gather relevant logs and error messages"
echo ""

echo "📝 Information to Include"
echo "------------------------"
echo "• Your ThoughtPilot version"
echo "• Operating system and version"
echo "• Node.js version"
echo "• Error messages and logs"
echo "• Steps to reproduce the issue"
echo "• What you've already tried"
echo ""

echo "🚀 Quick Troubleshooting"
echo "----------------------"
echo "• Restart ThoughtPilot services"
echo "• Check network connectivity"
echo "• Verify configuration files"
echo "• Update to latest version"
echo "• Clear cache and temporary files"
echo ""

echo "📊 System Information (for support)"
echo "--------------------------------"
echo "Copy this information when contacting support:"
echo ""

echo "=== SYSTEM INFO ==="
uname -a || echo '⚠️ System info failed (continuing anyway)'
echo ""

echo "=== NODE VERSION ==="
node --version || echo '⚠️ Node version failed (continuing anyway)'
echo ""

echo "=== THOUGHTPILOT VERSION ==="
thoughtpilot --version 2>/dev/null || echo '⚠️ ThoughtPilot version failed (continuing anyway)'
echo ""

echo "=== CONFIG LOCATION ==="
echo "~/.thoughtpilot/config.json"
echo ""

echo "=== LOG LOCATIONS ==="
echo "/Users/sawyer/gitSync/thoughtpilot-commercial/logs/"
echo "~/.thoughtpilot/logs/"
echo ""

echo "✅ Support information displayed (non-blocking execution)" 