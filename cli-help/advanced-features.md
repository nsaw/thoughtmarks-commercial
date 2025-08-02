# Advanced Features

Advanced features and options in ThoughtPilot.

## Scripting and Automation

```bash
# Run scripts
thoughtpilot script <script-file>

# Examples
thoughtpilot script deploy.sh
thoughtpilot script backup.js

# Run with options
thoughtpilot script --dry-run <script-file>
thoughtpilot script --timeout 300 <script-file>
thoughtpilot script --env production <script-file>

# Run multiple scripts
thoughtpilot script scripts/
thoughtpilot script *.sh
```

## Batch Operations

```bash
# Batch apply patches
thoughtpilot batch-apply <directory>

# Examples
thoughtpilot batch-apply patches/
thoughtpilot batch-apply --pattern "*.json"

# Batch with options
thoughtpilot batch-apply --parallel 4 <directory>
thoughtpilot batch-apply --stop-on-error <directory>
thoughtpilot batch-apply --dry-run <directory>

# Batch rollback
thoughtpilot batch-rollback <patch-ids>
thoughtpilot batch-rollback --since 2023-01-01
```

## API Integration

```bash
# API calls
thoughtpilot api <endpoint>

# Examples
thoughtpilot api GET /patches
thoughtpilot api POST /patches -d @patch.json
thoughtpilot api PUT /projects/my-project -d @config.json

# API with options
thoughtpilot api --headers '{"Authorization": "Bearer token"}' <endpoint>
thoughtpilot api --timeout 30 <endpoint>
thoughtpilot api --output response.json <endpoint>
```

## Webhooks

```bash
# List webhooks
thoughtpilot webhooks

# Create webhook
thoughtpilot create-webhook <url>

# Examples
thoughtpilot create-webhook https://my-app.com/webhook
thoughtpilot create-webhook --events patch.applied,patch.failed <url>

# Update webhook
thoughtpilot update-webhook <webhook-id> <url>

# Delete webhook
thoughtpilot delete-webhook <webhook-id>

# Test webhook
thoughtpilot test-webhook <webhook-id>
```

## Plugins

```bash
# List plugins
thoughtpilot plugins

# Install plugin
thoughtpilot install-plugin <plugin-name>

# Examples
thoughtpilot install-plugin @thoughtpilot/plugin-slack
thoughtpilot install-plugin @thoughtpilot/plugin-github

# Update plugin
thoughtpilot update-plugin <plugin-name>

# Remove plugin
thoughtpilot remove-plugin <plugin-name>

# Enable plugin
thoughtpilot enable-plugin <plugin-name>

# Disable plugin
thoughtpilot disable-plugin <plugin-name>
```

## Custom Commands

```bash
# Create custom command
thoughtpilot create-command <command-name>

# Examples
thoughtpilot create-command deploy
thoughtpilot create-command backup

# List custom commands
thoughtpilot custom-commands

# Remove custom command
thoughtpilot remove-command <command-name>
```

## Templates

```bash
# Create template
thoughtpilot create-template <template-name>

# Examples
thoughtpilot create-template my-template
thoughtpilot create-template --from existing-template new-template

# List templates
thoughtpilot templates

# Update template
thoughtpilot update-template <template-name>

# Delete template
thoughtpilot delete-template <template-name>

# Use template
thoughtpilot use-template <template-name> <target>
```

## Examples

```bash
# Run deployment script
thoughtpilot script deploy.sh --env production

# Batch apply patches
thoughtpilot batch-apply patches/ --parallel 4

# API call
thoughtpilot api GET /patches --output patches.json

# Create webhook
thoughtpilot create-webhook https://my-app.com/webhook --events patch.applied

# Install plugin
thoughtpilot install-plugin @thoughtpilot/plugin-slack

# Create custom command
thoughtpilot create-command deploy
``` 