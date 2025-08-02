# Basic Commands

Essential commands for getting started with ThoughtPilot.

## Installation

```bash
# Install ThoughtPilot
npm install -g @thoughtpilot/free
npm install -g @thoughtpilot/pro
npm install -g @thoughtpilot/team
npm install -g @thoughtpilot/enterprise

# Or use one-click installer
curl -fsSL https://install.thoughtpilot.ai/free | bash
curl -fsSL https://install.thoughtpilot.ai/pro | bash
curl -fsSL https://install.thoughtpilot.ai/team | bash
curl -fsSL https://install.thoughtpilot.ai/enterprise | bash
```

## Authentication

```bash
# Login to ThoughtPilot
thoughtpilot login

# Login with specific server
thoughtpilot login --server https://your-server.com

# Logout
thoughtpilot logout

# Check login status
thoughtpilot whoami
```

## Configuration

```bash
# Set configuration
thoughtpilot config set <key> <value>

# Examples
thoughtpilot config set server https://api.thoughtpilot.ai
thoughtpilot config set timeout 300
thoughtpilot config set log-level info

# Get configuration
thoughtpilot config get <key>

# List all configuration
thoughtpilot config list

# Reset configuration
thoughtpilot config reset
```

## Information

```bash
# Get version
thoughtpilot --version
thoughtpilot version

# Get help
thoughtpilot --help
thoughtpilot help

# Get help for specific command
thoughtpilot help <command>
thoughtpilot <command> --help

# Get system information
thoughtpilot info

# Check system health
thoughtpilot doctor
```

## Examples

```bash
# Quick start
npm install -g @thoughtpilot/free
thoughtpilot login
thoughtpilot doctor

# Configure for custom server
thoughtpilot config set server https://your-server.com
thoughtpilot login

# Get help
thoughtpilot help patches
thoughtpilot help projects
``` 