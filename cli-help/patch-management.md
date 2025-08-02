# Patch Management

Commands for working with patches in ThoughtPilot.

## Apply Patches

```bash
# Apply a single patch
thoughtpilot apply <patch-file>

# Examples
thoughtpilot apply patch.json
thoughtpilot apply /path/to/patch.json
thoughtpilot apply https://example.com/patch.json

# Apply with options
thoughtpilot apply --dry-run patch.json
thoughtpilot apply --force patch.json
thoughtpilot apply --validate patch.json
thoughtpilot apply --timeout 300 patch.json

# Apply multiple patches
thoughtpilot apply patches/
thoughtpilot apply *.json
```

## List Patches

```bash
# List all patches
thoughtpilot list
thoughtpilot patches

# List with options
thoughtpilot list --all
thoughtpilot list --status applied
thoughtpilot list --status failed
thoughtpilot list --status pending

# List with format
thoughtpilot list --format json
thoughtpilot list --format table
thoughtpilot list --format csv

# List with filters
thoughtpilot list --project my-project
thoughtpilot list --user my-user
thoughtpilot list --date 2023-01-01
```

## Patch Status

```bash
# Get patch status
thoughtpilot status <patch-id>

# Examples
thoughtpilot status patch-1
thoughtpilot status patch-v1.0.0

# Get detailed status
thoughtpilot status --detailed <patch-id>
thoughtpilot status --logs <patch-id>

# Get status for all patches
thoughtpilot status
thoughtpilot status --all
```

## Rollback Patches

```bash
# Rollback a patch
thoughtpilot rollback <patch-id>

# Examples
thoughtpilot rollback patch-1
thoughtpilot rollback patch-v1.0.0

# Rollback with options
thoughtpilot rollback --force <patch-id>
thoughtpilot rollback --dry-run <patch-id>

# Rollback multiple patches
thoughtpilot rollback patch-1 patch-2 patch-3
```

## Validate Patches

```bash
# Validate a patch
thoughtpilot validate <patch-file>

# Examples
thoughtpilot validate patch.json
thoughtpilot validate patches/

# Validate with options
thoughtpilot validate --strict patch.json
thoughtpilot validate --fix patch.json
```

## Create Patches

```bash
# Create a patch from changes
thoughtpilot create-patch

# Examples
thoughtpilot create-patch --name my-patch
thoughtpilot create-patch --description "My patch description"
thoughtpilot create-patch --files src/

# Create with options
thoughtpilot create-patch --dry-run
thoughtpilot create-patch --include-untracked
```

## Examples

```bash
# Apply a patch with validation
thoughtpilot apply --validate patch.json

# List failed patches
thoughtpilot list --status failed

# Rollback the last patch
thoughtpilot rollback $(thoughtpilot list --format json | jq -r '.[0].id')

# Validate all patches in directory
thoughtpilot validate patches/
``` 