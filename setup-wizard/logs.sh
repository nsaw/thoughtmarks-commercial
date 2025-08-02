#!/bin/bash

# ThoughtPilot Logs Script
# Version: 1.4.1
# Description: View ThoughtPilot logs

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

# Print banner
print_banner() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    ThoughtPilot Logs                        ║"
    echo "║                        Version 1.4.1                        ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Show log file
show_log() {
    local log_file="$1"
    local lines="${2:-50}"
    
    if [ -f "$log_file" ]; then
        echo -e "\n${BLUE}=== $log_file (last $lines lines) ===${NC}"
        tail -n "$lines" "$log_file"
    else
        echo -e "\n${YELLOW}⚠ $log_file - Not found${NC}"
    fi
}

# Show PM2 logs
show_pm2_logs() {
    echo -e "\n${BLUE}=== PM2 Logs ===${NC}"
    
    if command -v pm2 > /dev/null; then
        local pm2_processes=$(pm2 list 2>/dev/null | grep -E "(thoughtpilot|gpt-cursor)" | awk '{print $2}' || echo "")
        
        if [ -n "$pm2_processes" ]; then
            for process in $pm2_processes; do
                echo -e "\n${YELLOW}--- $process logs ---${NC}"
                pm2 logs "$process" --lines 20 2>/dev/null || echo "No logs available"
            done
        else
            echo -e "${YELLOW}No PM2 processes found${NC}"
        fi
    else
        echo -e "${YELLOW}PM2 not installed${NC}"
    fi
}

# Show system logs
show_system_logs() {
    echo -e "\n${BLUE}=== System Logs ===${NC}"
    
    # Show recent system messages
    if command -v journalctl > /dev/null; then
        echo -e "\n${YELLOW}--- Recent system messages ---${NC}"
        journalctl --since "1 hour ago" | grep -i thoughtpilot | tail -10 || echo "No ThoughtPilot system messages found"
    fi
}

# Main function
main() {
    print_banner
    
    # Check if log directory exists
    if [ ! -d "$LOG_DIR" ]; then
        echo -e "${YELLOW}No log directory found. Services may not be running.${NC}"
        exit 0
    fi
    
    # Show application logs
    show_log "$LOG_DIR/start.log" 30
    show_log "$LOG_DIR/python.log" 30
    show_log "$LOG_DIR/node.log" 30
    show_log "$LOG_DIR/stop.log" 20
    
    # Show PM2 logs
    show_pm2_logs
    
    # Show system logs
    show_system_logs
    
    echo -e "\n${BLUE}=== Log Management ===${NC}"
    echo -e "To follow logs in real-time: ${YELLOW}tail -f $LOG_DIR/*.log${NC}"
    echo -e "To clear logs: ${YELLOW}rm $LOG_DIR/*.log${NC}"
    echo -e "To view specific log: ${YELLOW}cat $LOG_DIR/[logfile]${NC}"
}

# Handle command line arguments
case "${1:-}" in
    "start")
        show_log "$LOG_DIR/start.log" "${2:-50}"
        ;;
    "python")
        show_log "$LOG_DIR/python.log" "${2:-50}"
        ;;
    "node")
        show_log "$LOG_DIR/node.log" "${2:-50}"
        ;;
    "stop")
        show_log "$LOG_DIR/stop.log" "${2:-50}"
        ;;
    "pm2")
        show_pm2_logs
        ;;
    "system")
        show_system_logs
        ;;
    "follow")
        echo -e "${BLUE}Following all logs (Ctrl+C to stop)...${NC}"
        tail -f "$LOG_DIR"/*.log 2>/dev/null || echo "No log files to follow"
        ;;
    *)
        main
        ;;
esac 