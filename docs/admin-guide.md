# Administrator Guide

This guide is for system administrators who need to install, configure, and maintain ThoughtPilot.

## Installation

### System Requirements

- **Free Tier**: Node.js 16+, npm
- **Pro Tier**: Node.js 16+, npm, Docker, PostgreSQL
- **Team Tier**: Node.js 16+, npm, Docker, Kubernetes
- **Enterprise Tier**: Node.js 16+, npm, Docker, Kubernetes, SAML

### Installation Methods

#### One-Click Install

```bash
# Free tier
curl -fsSL https://install.thoughtpilot.ai/free | bash

# Pro tier
curl -fsSL https://install.thoughtpilot.ai/pro | bash

# Team tier
curl -fsSL https://install.thoughtpilot.ai/team | bash

# Enterprise tier
curl -fsSL https://install.thoughtpilot.ai/enterprise | bash
```

#### Manual Install

```bash
# Download and extract
wget https://downloads.thoughtpilot.ai/latest.tar.gz
tar -xzf latest.tar.gz
cd thoughtpilot

# Run installer
./install.sh
```

## Configuration

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/thoughtpilot

# Slack (Pro+)
SLACK_BOT_TOKEN=xoxb-your-token
SLACK_SIGNING_SECRET=your-secret

# Security
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key
```

### Configuration Files

```json
{
  "database": {
    "url": "postgresql://localhost:5432/thoughtpilot",
    "pool": {
      "min": 2,
      "max": 10
    }
  },
  "security": {
    "jwtSecret": "your-secret",
    "encryptionKey": "your-key"
  },
  "features": {
    "slack": true,
    "dashboard": true,
    "multiUser": false
  }
}
```

## Security

### Access Control

- Use strong passwords
- Enable 2FA where available
- Regular security updates
- Monitor access logs

### Data Protection

- Encrypt sensitive data
- Regular backups
- Secure communication (HTTPS)
- Audit logging

## Monitoring

### Health Checks

```bash
# Check system health
thoughtpilot doctor

# Monitor logs
thoughtpilot logs --follow

# Check metrics
thoughtpilot metrics
```

### Alerts

Set up monitoring for:
- System resources (CPU, memory, disk)
- Application errors
- Security events
- Performance metrics

## Troubleshooting

See [Troubleshooting](./troubleshooting.md) for common issues and solutions.

## Support

For additional support:
- [Documentation](./README.md)
- [FAQ](./faq.md)
- [Community Forum](https://community.thoughtpilot.ai)
- [Support Email](mailto:support@thoughtpilot.ai) 