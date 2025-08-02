#!/bin/bash

# ThoughtPilot Start Script
# Version: 1.4.1
# Description: Start ThoughtPilot services

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
LOG_DIR="$PROJECT_ROOT/logs"
PID_DIR="$PROJECT_ROOT/pids"

# Create directories if they don't exist
mkdir -p "$LOG_DIR" "$PID_DIR"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_DIR/start.log"
}

# Check if services are already running
check_running() {
    if [ -f "$PID_DIR/thoughtpilot.pid" ]; then
        local pid=$(cat "$PID_DIR/thoughtpilot.pid")
        if ps -p "$pid" > /dev/null 2>&1; then
            log "ThoughtPilot is already running (PID: $pid)"
            return 0
        else
            log "Removing stale PID file"
            rm -f "$PID_DIR/thoughtpilot.pid"
        fi
    fi
    return 1
}

# Start Redis if not running
start_redis() {
    log "Starting Redis..."
    
    if ! pgrep redis-server > /dev/null; then
        if command -v redis-server > /dev/null; then
            redis-server "$PROJECT_ROOT/redis.conf" --daemonize yes
            log "Redis started successfully"
        else
            log "Warning: Redis not found. Please install Redis manually."
        fi
    else
        log "Redis is already running"
    fi
}

# Start ThoughtPilot services
start_services() {
    log "Starting ThoughtPilot services..."
    
    # Start with PM2 if available
    if command -v pm2 > /dev/null; then
        log "Starting with PM2..."
        
        # Check if ecosystem config exists
        if [ -f "$PROJECT_ROOT/ecosystem.config.js" ]; then
            pm2 start "$PROJECT_ROOT/ecosystem.config.js"
            pm2 save
            log "Services started with PM2"
        else
            log "Warning: ecosystem.config.js not found. Starting manually..."
            start_manual
        fi
    else
        log "PM2 not found. Starting manually..."
        start_manual
    fi
}

# Start services manually
start_manual() {
    log "Starting services manually..."
    
    # Start Python application
    if [ -f "$PROJECT_ROOT/gpt_cursor_runner/main.py" ]; then
        log "Starting Python application..."
        nohup python3 -m gpt_cursor_runner.main > "$LOG_DIR/python.log" 2>&1 &
        echo $! > "$PID_DIR/python.pid"
        log "Python application started (PID: $(cat $PID_DIR/python.pid))"
    fi
    
    # Start Node.js application
    if [ -f "$PROJECT_ROOT/package.json" ]; then
        log "Starting Node.js application..."
        nohup npm start > "$LOG_DIR/node.log" 2>&1 &
        echo $! > "$PID_DIR/node.pid"
        log "Node.js application started (PID: $(cat $PID_DIR/node.pid))"
    fi
    
    # Create main PID file
    echo "MANUAL" > "$PID_DIR/thoughtpilot.pid"
}

# Wait for services to be ready
wait_for_services() {
    log "Waiting for services to be ready..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:3000/health > /dev/null 2>&1; then
            log "Services are ready!"
            return 0
        fi
        
        log "Waiting for services... (attempt $attempt/$max_attempts)"
        sleep 2
        ((attempt++))
    done
    
    log "Warning: Services may not be fully ready"
    return 1
}

# Main function
main() {
    echo -e "${BLUE}Starting ThoughtPilot...${NC}"
    
    # Check if already running
    if check_running; then
        echo -e "${YELLOW}ThoughtPilot is already running.${NC}"
        exit 0
    fi
    
    # Load environment variables
    if [ -f "$PROJECT_ROOT/.env" ]; then
        log "Loading environment variables..."
        export $(cat "$PROJECT_ROOT/.env" | grep -v '^#' | xargs)
    else
        log "Warning: .env file not found"
    fi
    
    # Start Redis
    start_redis
    
    # Start services
    start_services
    
    # Wait for services
    wait_for_services
    
    # Final status
    echo -e "\n${GREEN}ThoughtPilot started successfully!${NC}"
    echo -e "${YELLOW}Check status: ./setup-wizard/status.sh${NC}"
    echo -e "${YELLOW}View logs: ./setup-wizard/logs.sh${NC}"
    echo -e "${YELLOW}Stop services: ./setup-wizard/stop.sh${NC}"
    
    log "Startup completed successfully"
}

# Run main function
main "$@" 