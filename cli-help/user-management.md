# User Management (Team/Enterprise)

Commands for managing users in ThoughtPilot Team and Enterprise tiers.

## List Users

```bash
# List all users
thoughtpilot users
thoughtpilot list-users

# List with options
thoughtpilot users --all
thoughtpilot users --role admin
thoughtpilot users --status active

# List with format
thoughtpilot users --format json
thoughtpilot users --format table
thoughtpilot users --format csv

# List with filters
thoughtpilot users --project my-project
thoughtpilot users --team my-team
```

## Create Users

```bash
# Create a new user
thoughtpilot create-user <username>

# Examples
thoughtpilot create-user john.doe
thoughtpilot create-user "John Doe"

# Create with options
thoughtpilot create-user --email john@example.com <username>
thoughtpilot create-user --role developer <username>
thoughtpilot create-user --team engineering <username>

# Create with configuration
thoughtpilot create-user --config user.json <username>
```

## User Information

```bash
# Get user information
thoughtpilot user <username>

# Examples
thoughtpilot user john.doe
thoughtpilot user user-123

# Get detailed information
thoughtpilot user --detailed <username>
thoughtpilot user --stats <username>

# Get user permissions
thoughtpilot user --permissions <username>
```

## Update Users

```bash
# Update user
thoughtpilot update-user <username>

# Examples
thoughtpilot update-user john.doe --email new@example.com
thoughtpilot update-user john.doe --role admin
thoughtpilot update-user john.doe --team new-team

# Update with configuration
thoughtpilot update-user --config user.json <username>
```

## Delete Users

```bash
# Delete a user
thoughtpilot delete-user <username>

# Examples
thoughtpilot delete-user john.doe
thoughtpilot delete-user user-123

# Delete with options
thoughtpilot delete-user --force <username>
thoughtpilot delete-user --dry-run <username>
```

## User Roles

```bash
# List roles
thoughtpilot roles

# Get role information
thoughtpilot role <role-name>

# Assign role to user
thoughtpilot assign-role <username> <role-name>

# Remove role from user
thoughtpilot remove-role <username> <role-name>

# Examples
thoughtpilot assign-role john.doe admin
thoughtpilot remove-role john.doe developer
```

## User Teams

```bash
# List teams
thoughtpilot teams

# Get team information
thoughtpilot team <team-name>

# Add user to team
thoughtpilot add-to-team <username> <team-name>

# Remove user from team
thoughtpilot remove-from-team <username> <team-name>

# Examples
thoughtpilot add-to-team john.doe engineering
thoughtpilot remove-from-team john.doe marketing
```

## User Permissions

```bash
# Get user permissions
thoughtpilot permissions <username>

# Grant permission
thoughtpilot grant <username> <permission>

# Revoke permission
thoughtpilot revoke <username> <permission>

# Examples
thoughtpilot grant john.doe patch:write
thoughtpilot revoke john.doe project:delete
```

## Examples

```bash
# Create a new user
thoughtpilot create-user john.doe --email john@example.com --role developer

# List all users
thoughtpilot users --format table

# Get user details
thoughtpilot user john.doe --detailed

# Update user role
thoughtpilot update-user john.doe --role admin

# Add user to team
thoughtpilot add-to-team john.doe engineering

# Delete user
thoughtpilot delete-user john.doe --force
``` 