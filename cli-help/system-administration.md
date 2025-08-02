# System Administration

Commands for system administration in ThoughtPilot.

## System Information

```bash
# Get system information
thoughtpilot system
thoughtpilot system-info

# Get detailed system information
thoughtpilot system --detailed
thoughtpilot system --stats

# Get system configuration
thoughtpilot system --config
```

## System Health

```bash
# Check system health
thoughtpilot health
thoughtpilot health-check

# Check specific components
thoughtpilot health --database
thoughtpilot health --api
thoughtpilot health --services

# Get health report
thoughtpilot health --report
thoughtpilot health --json
```

## System Logs

```bash
# View system logs
thoughtpilot logs

# View specific logs
thoughtpilot logs --application
thoughtpilot logs --system
thoughtpilot logs --security

# View logs with options
thoughtpilot logs --follow
thoughtpilot logs --tail 100
thoughtpilot logs --since 1h
thoughtpilot logs --until 2023-01-01

# Export logs
thoughtpilot logs --export logs.json
thoughtpilot logs --export logs.csv
```

## System Configuration

```bash
# Get system configuration
thoughtpilot system-config

# Set system configuration
thoughtpilot system-config <key> <value>

# Examples
thoughtpilot system-config log-level debug
thoughtpilot system-config max-users 1000
thoughtpilot system-config session-timeout 3600

# Reset system configuration
thoughtpilot system-config --reset
```

## System Maintenance

```bash
# Run system maintenance
thoughtpilot maintenance

# Run specific maintenance tasks
thoughtpilot maintenance --cleanup-logs
thoughtpilot maintenance --optimize-database
thoughtpilot maintenance --backup

# Schedule maintenance
thoughtpilot maintenance --schedule daily
thoughtpilot maintenance --schedule weekly
```

## System Backup

```bash
# Create backup
thoughtpilot backup

# Create backup with options
thoughtpilot backup --full
thoughtpilot backup --incremental
thoughtpilot backup --compress

# List backups
thoughtpilot backups

# Restore backup
thoughtpilot restore <backup-id>

# Examples
thoughtpilot restore backup-2023-01-01
thoughtpilot restore --dry-run backup-2023-01-01
```

## System Updates

```bash
# Check for updates
thoughtpilot update --check

# Update system
thoughtpilot update

# Update with options
thoughtpilot update --force
thoughtpilot update --dry-run
thoughtpilot update --backup

# Rollback update
thoughtpilot update --rollback
```

## System Security

```bash
# Security audit
thoughtpilot security
thoughtpilot security-audit

# Security scan
thoughtpilot security --scan
thoughtpilot security --vulnerabilities

# Security report
thoughtpilot security --report
thoughtpilot security --json
```

## System Monitoring

```bash
# Start monitoring
thoughtpilot monitor

# Monitor specific metrics
thoughtpilot monitor --cpu
thoughtpilot monitor --memory
thoughtpilot monitor --disk
thoughtpilot monitor --network

# Monitor with options
thoughtpilot monitor --interval 30
thoughtpilot monitor --duration 1h
thoughtpilot monitor --export metrics.json
```

## Examples

```bash
# Check system health
thoughtpilot health --detailed

# View recent logs
thoughtpilot logs --tail 50 --follow

# Create backup
thoughtpilot backup --full --compress

# Check for updates
thoughtpilot update --check

# Security audit
thoughtpilot security --scan --report
``` 