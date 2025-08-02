# Project Management

Commands for managing projects in ThoughtPilot.

## List Projects

```bash
# List all projects
thoughtpilot projects
thoughtpilot list-projects

# List with options
thoughtpilot projects --all
thoughtpilot projects --user my-user
thoughtpilot projects --status active

# List with format
thoughtpilot projects --format json
thoughtpilot projects --format table
thoughtpilot projects --format csv
```

## Create Projects

```bash
# Create a new project
thoughtpilot create-project <name>

# Examples
thoughtpilot create-project my-project
thoughtpilot create-project "My Project"

# Create with options
thoughtpilot create-project --description "Project description" <name>
thoughtpilot create-project --repository https://github.com/user/repo <name>
thoughtpilot create-project --template basic <name>

# Create with configuration
thoughtpilot create-project --config config.json <name>
```

## Project Information

```bash
# Get project information
thoughtpilot project <project-id>

# Examples
thoughtpilot project my-project
thoughtpilot project project-123

# Get detailed information
thoughtpilot project --detailed <project-id>
thoughtpilot project --stats <project-id>

# Get project configuration
thoughtpilot project --config <project-id>
```

## Update Projects

```bash
# Update project
thoughtpilot update-project <project-id>

# Examples
thoughtpilot update-project my-project --name "New Name"
thoughtpilot update-project my-project --description "New description"
thoughtpilot update-project my-project --repository https://new-repo.com

# Update with configuration
thoughtpilot update-project --config config.json <project-id>
```

## Delete Projects

```bash
# Delete a project
thoughtpilot delete-project <project-id>

# Examples
thoughtpilot delete-project my-project
thoughtpilot delete-project project-123

# Delete with options
thoughtpilot delete-project --force <project-id>
thoughtpilot delete-project --dry-run <project-id>
```

## Project Configuration

```bash
# Get project configuration
thoughtpilot project-config <project-id>

# Set project configuration
thoughtpilot project-config <project-id> <key> <value>

# Examples
thoughtpilot project-config my-project timeout 300
thoughtpilot project-config my-project log-level debug

# Reset project configuration
thoughtpilot project-config --reset <project-id>
```

## Project Templates

```bash
# List templates
thoughtpilot templates

# Get template information
thoughtpilot template <template-name>

# Create project from template
thoughtpilot create-project --template <template-name> <project-name>

# Examples
thoughtpilot create-project --template basic my-project
thoughtpilot create-project --template advanced my-project
```

## Examples

```bash
# Create a new project
thoughtpilot create-project my-app --description "My application"

# List all projects
thoughtpilot projects --format table

# Get project details
thoughtpilot project my-app --detailed

# Update project
thoughtpilot update-project my-app --description "Updated description"

# Delete project
thoughtpilot delete-project my-app --force
``` 