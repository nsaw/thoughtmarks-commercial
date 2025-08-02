#!/bin/bash

# ThoughtPilot Status Script
# Version: 1.4.1
# Description: Check ThoughtPilot service status

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

# Print banner
print_banner() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                   ThoughtPilot Status                       ║"
    echo "║                        Version 1.4.1                        ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Check service status
check_service_status() {
    local service_name="$1"
    local pid_file="$2"
    local port="$3"
    
    echo -e "\n${BLUE}=== $service_name Status ===${NC}"
    
    # Check PID file
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p "$pid" > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Process running (PID: $pid)${NC}"
        else
            echo -e "${RED}✗ Process not running (stale PID file)${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠ No PID file found${NC}"
        return 1
    fi
    
    # Check port if specified
    if [ -n "$port" ]; then
        if lsof -i :$port > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Port $port is listening${NC}"
        else
            echo -e "${RED}✗ Port $port is not listening${NC}"
            return 1
        fi
    fi
    
    return 0
}

# Check PM2 status
check_pm2_status() {
    echo -e "\n${BLUE}=== PM2 Status ===${NC}"
    
    if command -v pm2 > /dev/null; then
        local pm2_status=$(pm2 status 2>/dev/null | grep -E "(thoughtpilot|gpt-cursor)" || echo "No ThoughtPilot processes found")
        if echo "$pm2_status" | grep -q "online"; then
            echo -e "${GREEN}✓ PM2 processes are online${NC}"
            echo "$pm2_status"
        else
            echo -e "${YELLOW}⚠ PM2 processes not found or offline${NC}"
            echo "$pm2_status"
        fi
    else
        echo -e "${YELLOW}⚠ PM2 not installed${NC}"
    fi
}

# Check Redis status
check_redis_status() {
    echo -e "\n${BLUE}=== Redis Status ===${NC}"
    
    if command -v redis-cli > /dev/null; then
        if redis-cli ping > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Redis is running${NC}"
            
            # Get Redis info
            local redis_info=$(redis-cli info server | grep -E "(redis_version|uptime_in_seconds|connected_clients)" | head -3)
            echo "$redis_info"
        else
            echo -e "${RED}✗ Redis is not responding${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ Redis CLI not found${NC}"
    fi
}

# Check health endpoints
check_health_endpoints() {
    echo -e "\n${BLUE}=== Health Endpoints ===${NC}"
    
    local endpoints=("http://localhost:3000/health" "http://localhost:3000/status" "http://localhost:3000/api/health")
    
    for endpoint in "${endpoints[@]}"; do
        if curl -s "$endpoint" > /dev/null 2>&1; then
            echo -e "${GREEN}✓ $endpoint - OK${NC}"
        else
            echo -e "${RED}✗ $endpoint - Failed${NC}"
        fi
    done
}

# Check log files
check_log_files() {
    echo -e "\n${BLUE}=== Log Files ===${NC}"
    
    local log_files=("$LOG_DIR/start.log" "$LOG_DIR/python.log" "$LOG_DIR/node.log")
    
    for log_file in "${log_files[@]}"; do
        if [ -f "$log_file" ]; then
            local size=$(du -h "$log_file" | cut -f1)
            local last_modified=$(stat -f "%Sm" "$log_file" 2>/dev/null || stat -c "%y" "$log_file" 2>/dev/null)
            echo -e "${GREEN}✓ $log_file (${size}, modified: $last_modified)${NC}"
        else
            echo -e "${YELLOW}⚠ $log_file - Not found${NC}"
        fi
    done
}

# Check disk usage
check_disk_usage() {
    echo -e "\n${BLUE}=== Disk Usage ===${NC}"
    
    local project_size=$(du -sh "$PROJECT_ROOT" 2>/dev/null | cut -f1)
    local log_size=$(du -sh "$LOG_DIR" 2>/dev/null | cut -f1)
    
    echo -e "Project directory: ${GREEN}$project_size${NC}"
    echo -e "Log directory: ${GREEN}$log_size${NC}"
    
    # Check available disk space
    local available_space=$(df "$PROJECT_ROOT" | awk 'NR==2 {print $4}')
    local available_gb=$((available_space / 1024 / 1024))
    
    if [ $available_gb -gt 1 ]; then
        echo -e "Available space: ${GREEN}${available_gb}GB${NC}"
    else
        echo -e "Available space: ${RED}${available_gb}GB (low)${NC}"
    fi
}

# Check environment
check_environment() {
    echo -e "\n${BLUE}=== Environment ===${NC}"
    
    if [ -f "$PROJECT_ROOT/.env" ]; then
        echo -e "${GREEN}✓ .env file exists${NC}"
        
        # Check key environment variables
        local env_vars=("SLACK_BOT_TOKEN" "DATABASE_URL" "REDIS_URL" "PORT")
        for var in "${env_vars[@]}"; do
            if grep -q "^$var=" "$PROJECT_ROOT/.env"; then
                echo -e "  ✓ $var is set"
            else
                echo -e "  ⚠ $var is not set"
            fi
        done
    else
        echo -e "${RED}✗ .env file not found${NC}"
    fi
}

# Main function
main() {
    print_banner
    
    # Check if PID directory exists
    if [ ! -d "$PID_DIR" ]; then
        echo -e "${YELLOW}No PID directory found. Services may not be running.${NC}"
        exit 0
    fi
    
    # Check individual services
    check_service_status "Python Application" "$PID_DIR/python.pid" "3000"
    check_service_status "Node.js Application" "$PID_DIR/node.pid" "3000"
    
    # Check PM2 status
    check_pm2_status
    
    # Check Redis
    check_redis_status
    
    # Check health endpoints
    check_health_endpoints
    
    # Check log files
    check_log_files
    
    # Check disk usage
    check_disk_usage
    
    # Check environment
    check_environment
    
    echo -e "\n${BLUE}=== Summary ===${NC}"
    echo -e "For detailed logs: ${YELLOW}./setup-wizard/logs.sh${NC}"
    echo -e "To restart services: ${YELLOW}./setup-wizard/restart.sh${NC}"
    echo -e "To stop services: ${YELLOW}./setup-wizard/stop.sh${NC}"
}

# Run main function
main "$@" 