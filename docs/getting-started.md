# Getting Started with ThoughtPilot

This guide will help you get up and running with ThoughtPilot in minutes.

## Prerequisites

- Node.js 16 or higher
- npm or yarn
- Git

## Installation

### Quick Install

```bash
# Install ThoughtPilot Free
curl -fsSL https://install.thoughtpilot.ai/free | bash

# Or install via npm
npm install -g @thoughtpilot/free
```

### Verify Installation

```bash
# Check version
thoughtpilot --version

# Run doctor script
thoughtpilot doctor
```

## Your First Patch

1. **Create a patch file**:
```json
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
```

2. **Apply the patch**:
```bash
thoughtpilot apply my-patch.json
```

3. **Check the results**:
```bash
thoughtpilot status
```

## Next Steps

- Read the [Developer Guide](./developer-guide.md)
- Explore [Patch Development](./patch-development.md)
- Check out [Examples](./examples.md)

## Need Help?

- [Troubleshooting](./troubleshooting.md)
- [FAQ](./faq.md)
- [Support](./support.md) 