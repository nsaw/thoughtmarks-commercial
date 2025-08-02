# Developer Guide

This guide is for developers who want to use ThoughtPilot for automation and patch management.

## Core Concepts

### Patches

Patches are JSON files that describe changes to your codebase. They can:
- Create or modify files
- Run shell commands
- Validate changes
- Rollback if needed

### Patch Structure

```json
{
  "patchId": "unique-patch-id",
  "version": "1.0.0",
  "description": "What this patch does",
  "mutations": [
    {
      "file": "path/to/file",
      "content": "file content"
    }
  ],
  "validate": {
    "shell": ["commands to validate"]
  }
}
```

## CLI Commands

### Basic Commands

```bash
# Apply a patch
thoughtpilot apply patch.json

# List applied patches
thoughtpilot list

# Check status
thoughtpilot status

# Rollback a patch
thoughtpilot rollback patch-id
```

### Advanced Commands

```bash
# Dry run a patch
thoughtpilot apply --dry-run patch.json

# Apply with validation
thoughtpilot apply --validate patch.json

# Force apply (skip validation)
thoughtpilot apply --force patch.json
```

## Best Practices

### Patch Design

1. **Keep patches small and focused**
2. **Use descriptive patch IDs**
3. **Include validation steps**
4. **Test patches before applying**
5. **Document complex patches**

### Validation

Always include validation in your patches:

```json
"validate": {
  "shell": [
    "npm test",
    "npm run lint",
    "npm run build"
  ]
}
```

### Error Handling

Use rollback capabilities:

```json
"rollback": {
  "shell": [
    "git checkout HEAD~1",
    "npm install"
  ]
}
```

## Examples

See [Examples](./examples.md) for real-world patch examples.

## API Reference

For detailed API information, see [API Reference](./api-reference.md). 