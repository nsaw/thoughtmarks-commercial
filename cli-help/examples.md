# Examples

Real-world examples of ThoughtPilot usage.

## Getting Started

### First Installation

```bash
# Install ThoughtPilot Free
npm install -g @thoughtpilot/free

# Login
thoughtpilot login

# Check installation
thoughtpilot doctor

# Get help
thoughtpilot help
```

### Create Your First Patch

```bash
# Create a simple patch
cat > my-first-patch.json << 'EOF'
{
  "patchId": "my-first-patch",
  "description": "My first ThoughtPilot patch",
  "mutations": [
    {
      "file": "src/hello.js",
      "content": "console.log('Hello, ThoughtPilot!');"
    }
  ]
}
EOF

# Apply the patch
thoughtpilot apply my-first-patch.json

# Check status
thoughtpilot status my-first-patch
```

## Patch Management

### Apply Multiple Patches

```bash
# Apply all patches in directory
thoughtpilot apply patches/

# Apply with validation
thoughtpilot apply --validate patches/

# Apply with dry run
thoughtpilot apply --dry-run patches/
```

### Rollback Failed Patches

```bash
# List failed patches
thoughtpilot list --status failed

# Rollback specific patch
thoughtpilot rollback failed-patch-id

# Rollback all failed patches
thoughtpilot list --status failed --format json | jq -r '.[].id' | xargs -I {} thoughtpilot rollback {}
```

### Validate Patches

```bash
# Validate single patch
thoughtpilot validate patch.json

# Validate all patches
thoughtpilot validate patches/

# Validate with fixes
thoughtpilot validate --fix patches/
```

## Project Management

### Create and Manage Projects

```bash
# Create new project
thoughtpilot create-project my-app --description "My application"

# List projects
thoughtpilot projects

# Get project details
thoughtpilot project my-app --detailed

# Update project
thoughtpilot update-project my-app --description "Updated description"
```

### Project Templates

```bash
# List available templates
thoughtpilot templates

# Create project from template
thoughtpilot create-project --template basic my-app

# Create custom template
thoughtpilot create-template my-template
```

## User Management (Team/Enterprise)

### Manage Users

```bash
# Create new user
thoughtpilot create-user john.doe --email john@example.com --role developer

# List users
thoughtpilot users

# Update user role
thoughtpilot update-user john.doe --role admin

# Add user to team
thoughtpilot add-to-team john.doe engineering
```

### User Permissions

```bash
# Grant permissions
thoughtpilot grant john.doe patch:write
thoughtpilot grant john.doe project:read

# Check permissions
thoughtpilot permissions john.doe

# Revoke permissions
thoughtpilot revoke john.doe project:delete
```

## System Administration

### Health Monitoring

```bash
# Check system health
thoughtpilot health --detailed

# Monitor system
thoughtpilot monitor --cpu --memory --disk

# View logs
thoughtpilot logs --tail 100 --follow
```

### Backup and Recovery

```bash
# Create backup
thoughtpilot backup --full --compress

# List backups
thoughtpilot backups

# Restore backup
thoughtpilot restore backup-2023-01-01
```

### System Updates

```bash
# Check for updates
thoughtpilot update --check

# Update system
thoughtpilot update --backup

# Rollback if needed
thoughtpilot update --rollback
```

## Advanced Features

### Scripting

```bash
# Create deployment script
cat > deploy.sh << 'EOF'
#!/bin/bash
echo "Deploying application..."
thoughtpilot apply patches/
npm run build
npm run deploy
echo "Deployment complete"
EOF

# Run script
thoughtpilot script deploy.sh --env production
```

### Batch Operations

```bash
# Batch apply patches
thoughtpilot batch-apply patches/ --parallel 4 --stop-on-error

# Batch rollback
thoughtpilot batch-rollback --since 2023-01-01
```

### API Integration

```bash
# Get all patches
thoughtpilot api GET /patches --output patches.json

# Create patch via API
thoughtpilot api POST /patches -d @patch.json

# Update project
thoughtpilot api PUT /projects/my-project -d @config.json
```

### Webhooks

```bash
# Create webhook for patch events
thoughtpilot create-webhook https://my-app.com/webhook \
  --events patch.applied,patch.failed,patch.rolled_back

# Test webhook
thoughtpilot test-webhook webhook-id
```

### Plugins

```bash
# Install Slack plugin
thoughtpilot install-plugin @thoughtpilot/plugin-slack

# Enable plugin
thoughtpilot enable-plugin @thoughtpilot/plugin-slack

# Configure plugin
thoughtpilot config set slack.webhook https://hooks.slack.com/...
```

## Troubleshooting

### Common Issues

```bash
# Check system health
thoughtpilot doctor

# View error logs
thoughtpilot logs --level error

# Check configuration
thoughtpilot config list

# Reset configuration
thoughtpilot config reset
```

### Debug Mode

```bash
# Enable debug logging
thoughtpilot config set log-level debug

# Run with debug
thoughtpilot --debug apply patch.json

# View debug logs
thoughtpilot logs --level debug
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Apply ThoughtPilot Patches

on:
  push:
    branches: [main]
    paths: ['patches/**']

jobs:
  apply-patches:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install ThoughtPilot
        run: npm install -g @thoughtpilot/team
      - name: Apply Patches
        run: thoughtpilot apply patches/
      - name: Run Tests
        run: npm test
```

### GitLab CI

```yaml
stages:
  - apply
  - test
  - deploy

apply-patches:
  stage: apply
  script:
    - npm install -g @thoughtpilot/team
    - thoughtpilot apply patches/

test:
  stage: test
  script:
    - npm test
  dependencies:
    - apply-patches

deploy:
  stage: deploy
  script:
    - npm run deploy
  dependencies:
    - test
``` 