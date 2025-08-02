#!/bin/bash

# ThoughtPilot Stop Script
# Version: 1.4.1
# Description: Stop ThoughtPilot services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PID_DIR="$PROJECT_ROOT/pids"
LOG_DIR="$PROJECT_ROOT/logs"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_DIR/stop.log"
}

# Stop PM2 processes
stop_pm2() {
    log "Stopping PM2 processes..."
    
    if command -v pm2 > /dev/null; then
        # Stop ThoughtPilot processes
        pm2 stop thoughtpilot 2>/dev/null || true
        pm2 stop gpt-cursor-runner 2>/dev/null || true
        
        # Delete from PM2
        pm2 delete thoughtpilot 2>/dev/null || true
        pm2 delete gpt-cursor-runner 2>/dev/null || true
        
        pm2 save
        log "PM2 processes stopped"
    else
        log "PM2 not found, skipping PM2 stop"
    fi
}

# Stop manual processes
stop_manual() {
    log "Stopping manual processes..."
    
    # Stop Python process
    if [ -f "$PID_DIR/python.pid" ]; then
        local pid=$(cat "$PID_DIR/python.pid")
        if ps -p "$pid" > /dev/null 2>&1; then
            log "Stopping Python process (PID: $pid)"
            kill "$pid" 2>/dev/null || true
            sleep 2
            if ps -p "$pid" > /dev/null 2>&1; then
                log "Force killing Python process"
                kill -9 "$pid" 2>/dev/null || true
            fi
        fi
        rm -f "$PID_DIR/python.pid"
    fi
    
    # Stop Node.js process
    if [ -f "$PID_DIR/node.pid" ]; then
        local pid=$(cat "$PID_DIR/node.pid")
        if ps -p "$pid" > /dev/null 2>&1; then
            log "Stopping Node.js process (PID: $pid)"
            kill "$pid" 2>/dev/null || true
            sleep 2
            if ps -p "$pid" > /dev/null 2>&1; then
                log "Force killing Node.js process"
                kill -9 "$pid" 2>/dev/null || true
            fi
        fi
        rm -f "$PID_DIR/node.pid"
    fi
    
    # Remove main PID file
    rm -f "$PID_DIR/thoughtpilot.pid"
}

# Stop Redis
stop_redis() {
    log "Stopping Redis..."
    
    if command -v redis-cli > /dev/null; then
        redis-cli shutdown 2>/dev/null || true
        log "Redis stopped"
    else
        log "Redis CLI not found, skipping Redis stop"
    fi
}

# Main function
main() {
    echo -e "${BLUE}Stopping ThoughtPilot...${NC}"
    
    # Create log directory if it doesn't exist
    mkdir -p "$LOG_DIR"
    
    # Stop PM2 processes
    stop_pm2
    
    # Stop manual processes
    stop_manual
    
    # Stop Redis
    stop_redis
    
    # Final message
    echo -e "\n${GREEN}ThoughtPilot stopped successfully!${NC}"
    echo -e "${YELLOW}To start again: ./setup-wizard/start.sh${NC}"
    echo -e "${YELLOW}Check status: ./setup-wizard/status.sh${NC}"
    
    log "Stop completed successfully"
}

# Run main function
main "$@" 