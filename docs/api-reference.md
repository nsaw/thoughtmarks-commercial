# API Reference

This document provides detailed information about the ThoughtPilot API.

## Authentication

ThoughtPilot uses JWT tokens for authentication.

### Getting a Token

```bash
# Login and get token
thoughtpilot login

# Or use API directly
curl -X POST https://api.thoughtpilot.ai/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "pass"}'
```

### Using Tokens

```bash
# Set token for CLI
thoughtpilot config set token YOUR_TOKEN

# Use token in API calls
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.thoughtpilot.ai/patches
```

## Patches API

### List Patches

```http
GET /api/v1/patches
```

**Response:**
```json
{
  "patches": [
    {
      "id": "patch-1",
      "name": "My Patch",
      "status": "applied",
      "createdAt": "2023-01-01T00:00:00Z",
      "appliedAt": "2023-01-01T01:00:00Z"
    }
  ]
}
```

### Apply Patch

```http
POST /api/v1/patches
Content-Type: application/json
```

**Request Body:**
```json
{
  "patchId": "my-patch",
  "description": "My patch description",
  "mutations": [
    {
      "file": "src/file.js",
      "content": "console.log('Hello');"
    }
  ]
}
```

**Response:**
```json
{
  "id": "patch-1",
  "status": "applied",
  "appliedAt": "2023-01-01T01:00:00Z"
}
```

### Get Patch Status

```http
GET /api/v1/patches/{patchId}
```

**Response:**
```json
{
  "id": "patch-1",
  "status": "applied",
  "appliedAt": "2023-01-01T01:00:00Z",
  "validation": {
    "passed": true,
    "tests": ["npm test", "npm run lint"]
  }
}
```

### Rollback Patch

```http
POST /api/v1/patches/{patchId}/rollback
```

**Response:**
```json
{
  "id": "patch-1",
  "status": "rolled_back",
  "rolledBackAt": "2023-01-01T02:00:00Z"
}
```

## Projects API

### List Projects

```http
GET /api/v1/projects
```

### Create Project

```http
POST /api/v1/projects
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "My Project",
  "description": "Project description",
  "repository": "https://github.com/user/repo"
}
```

## Users API

### List Users

```http
GET /api/v1/users
```

### Create User

```http
POST /api/v1/users
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "role": "developer"
}
```

## Webhooks

### Configure Webhook

```http
POST /api/v1/webhooks
Content-Type: application/json
```

**Request Body:**
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["patch.applied", "patch.failed"],
  "secret": "your-webhook-secret"
}
```

### Webhook Events

- `patch.applied` - Patch successfully applied
- `patch.failed` - Patch application failed
- `patch.rolled_back` - Patch rolled back
- `project.created` - New project created
- `user.created` - New user created

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Patch validation failed",
    "details": {
      "field": "mutations",
      "issue": "Missing required field"
    }
  }
}
```

### Common Error Codes

- `AUTHENTICATION_ERROR` - Invalid or missing token
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `VALIDATION_ERROR` - Invalid request data
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource conflict
- `INTERNAL_ERROR` - Server error

## Rate Limiting

API requests are rate limited:
- **Free tier**: 100 requests/hour
- **Pro tier**: 1000 requests/hour
- **Team tier**: 10000 requests/hour
- **Enterprise tier**: Unlimited

## SDKs

### JavaScript/Node.js

```bash
npm install @thoughtpilot/sdk
```

```javascript
const ThoughtPilot = require('@thoughtpilot/sdk');

const client = new ThoughtPilot({
  token: 'your-token',
  baseUrl: 'https://api.thoughtpilot.ai'
});

// Apply a patch
const patch = await client.patches.apply({
  patchId: 'my-patch',
  mutations: [{
    file: 'src/file.js',
    content: 'console.log("Hello");'
  }]
});
```

### Python

```bash
pip install thoughtpilot-sdk
```

```python
from thoughtpilot import ThoughtPilot

client = ThoughtPilot(
    token='your-token',
    base_url='https://api.thoughtpilot.ai'
)

# Apply a patch
patch = client.patches.apply({
    'patchId': 'my-patch',
    'mutations': [{
        'file': 'src/file.js',
        'content': 'console.log("Hello");'
    }]
})
```

## Support

For API support:
- [Documentation](./README.md)
- [Examples](./examples.md)
- [Community Forum](https://community.thoughtpilot.ai)
- [Support Email](mailto:api-support@thoughtpilot.ai) 