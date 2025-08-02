#!/bin/bash
# ThoughtPilot Base Installation Script - Hardened, Non-blocking
set -euo pipefail
TIER_NAME="${TIER_NAME:-free}"
PROJECT_ROOT="$(pwd)"
LOG_DIR="$PROJECT_ROOT/logs"
mkdir -p "$LOG_DIR"
echo "🔧 Installing ThoughtPilot $TIER_NAME tier..."

# Doctor script (45s timeout, background, non-blocking)
(timeout 45s bash "$PROJECT_ROOT/doctor-scripts/doctor-$TIER_NAME.sh" > "$LOG_DIR/doctor.log" 2>&1) & disown

# Python dependencies (120s timeout, background, non-blocking)
if [[ -f requirements.txt ]]; then
  echo "📦 Installing Python dependencies (backgrounded)..."
  (timeout 120s pip3 install -r requirements.txt > "$LOG_DIR/pip-install.log" 2>&1) & disown
fi

# Node.js dependencies (120s timeout, background, non-blocking)
if [[ -f package.json ]]; then
  echo "📦 Installing Node.js dependencies (backgrounded)..."
  (timeout 120s npm install > "$LOG_DIR/npm-install.log" 2>&1) & disown
fi

# Python tests (60s timeout, background, never blocks)
if command -v pytest &> /dev/null && ([[ -d "tests" ]] || [[ -d "test" ]]); then
  echo "🧪 Running Python tests (backgrounded)..."
  (timeout 60s python3 -m pytest tests/ test/ -v > "$LOG_DIR/pytest.log" 2>&1; exit 0) & disown
fi

# Node.js tests (60s timeout, background, never blocks)
if command -v npm &> /dev/null && [[ -f package.json ]]; then
  echo "🧪 Running Node.js tests (backgrounded)..."
  (timeout 60s npm test > "$LOG_DIR/npm-test.log" 2>&1; exit 0) & disown
fi

# Wait for background processes to start
sleep 3
echo "✅ Installation initiated (all heavy operations backgrounded with timeouts)"
echo "📋 Check logs/ directory for detailed output" 