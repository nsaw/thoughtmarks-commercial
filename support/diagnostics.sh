#!/bin/bash

# ThoughtPilot Diagnostics Script
# This script performs comprehensive diagnostics on ThoughtPilot installations

echo "🔍 ThoughtPilot Diagnostics"
echo "========================="
echo ""

# Create logs directory
mkdir -p /tmp/thoughtpilot-diagnostics || echo '⚠️ Log directory creation failed (continuing anyway)'

# System Information
echo "📊 System Information"
echo "-------------------"
uname -a || echo '⚠️ System info failed (continuing anyway)'
lsb_release -a 2>/dev/null || echo '⚠️ LSB info not available (continuing anyway)'
echo ""

# Node.js Information
echo "📦 Node.js Information"
echo "----------------------"
node --version || echo '⚠️ Node.js not found (continuing anyway)'
npm --version || echo '⚠️ npm not found (continuing anyway)'
echo ""

# ThoughtPilot Installation
echo "🚀 ThoughtPilot Installation"
echo "---------------------------"
which thoughtpilot || echo '⚠️ ThoughtPilot CLI not found (continuing anyway)'
thoughtpilot --version 2>/dev/null || echo '⚠️ ThoughtPilot version check failed (continuing anyway)'
echo ""

# Directory Structure
echo "📁 Directory Structure"
echo "----------------------"
ls -la /Users/sawyer/gitSync/thoughtpilot-commercial/ 2>/dev/null || echo '⚠️ ThoughtPilot directory not found (continuing anyway)'
echo ""

# Configuration Files
echo "⚙️ Configuration Files"
echo "----------------------"
test -f ~/.thoughtpilot/config.json && echo '✅ Config file found' || echo '⚠️ Config file not found (continuing anyway)'
test -f ~/.thoughtpilot/credentials.json && echo '✅ Credentials file found' || echo '⚠️ Credentials file not found (continuing anyway)'
echo ""

# Network Connectivity
echo "🌐 Network Connectivity"
echo "----------------------"
curl -s --max-time 10 https://api.thoughtpilot.ai/health >/dev/null && echo '✅ API connectivity OK' || echo '⚠️ API connectivity failed (continuing anyway)'
curl -s --max-time 10 https://docs.thoughtpilot.ai >/dev/null && echo '✅ Docs connectivity OK' || echo '⚠️ Docs connectivity failed (continuing anyway)'
echo ""

# Database Connectivity (if applicable)
echo "🗄️ Database Connectivity"
echo "----------------------"
if command -v psql >/dev/null 2>&1; then
    echo '✅ PostgreSQL client found'
    # Test connection if DATABASE_URL is set
    if [ -n "$DATABASE_URL" ]; then
        psql "$DATABASE_URL" -c 'SELECT 1;' >/dev/null 2>&1 && echo '✅ Database connection OK' || echo '⚠️ Database connection failed (continuing anyway)'
    else
        echo '⚠️ DATABASE_URL not set (continuing anyway)'
    fi
else
    echo '⚠️ PostgreSQL client not found (continuing anyway)'
fi
echo ""

# Docker Status (if applicable)
echo "🐳 Docker Status"
echo "-------------"
if command -v docker >/dev/null 2>&1; then
    echo '✅ Docker found'
    docker --version || echo '⚠️ Docker version check failed (continuing anyway)'
    docker ps >/dev/null 2>&1 && echo '✅ Docker daemon running' || echo '⚠️ Docker daemon not running (continuing anyway)'
else
    echo '⚠️ Docker not found (continuing anyway)'
fi
echo ""

# Log Files
echo "📝 Log Files"
echo "----------"
find /Users/sawyer/gitSync/thoughtpilot-commercial -name "*.log" -type f 2>/dev/null | head -5 || echo '⚠️ No log files found (continuing anyway)'
echo ""

# Recent Errors
echo "❌ Recent Errors"
echo "---------------"
find /Users/sawyer/gitSync/thoughtpilot-commercial -name "*.log" -type f -exec grep -l -i error {} \; 2>/dev/null | head -3 || echo '⚠️ No error logs found (continuing anyway)'
echo ""

# Recommendations
echo "💡 Recommendations"
echo "----------------"
echo "1. Check the documentation: https://docs.thoughtpilot.ai"
echo "2. Join the community: https://community.thoughtpilot.ai"
echo "3. Contact support: support@thoughtpilot.ai"
echo "4. Check logs for specific errors"
echo ""

echo "✅ Diagnostics completed (non-blocking execution)" 