#!/bin/bash

# ThoughtPilot Tier Distribution Package Creator
# Creates standalone tar.gz packages for each tier

echo "📦 Creating ThoughtPilot Tier Distribution Packages"
echo "=================================================="
echo ""

# Base directories
BASE_DIR="/Users/sawyer/gitSync/thoughtpilot-commercial"
DIST_DIR="$BASE_DIR/distributions"
TIER_DIR="$BASE_DIR/tier-packages"
DATE=$(date +%Y%m%d_%H%M%S)

# Create distributions directory
mkdir -p "$DIST_DIR"

# Function to create tier package
create_tier_package() {
    local tier_name=$1
    local tier_dir="$TIER_DIR/thoughtpilot-$tier_name"
    local package_name="thoughtpilot-$tier_name-v1.0.0-$DATE.tar.gz"
    local temp_dir="$DIST_DIR/temp-$tier_name"
    
    echo "📦 Creating $tier_name tier package..."
    
    # Create temp directory
    mkdir -p "$temp_dir"
    
    # Copy tier files
    cp -r "$tier_dir"/* "$temp_dir/"
    
    # Create installation documentation
    cat > "$temp_dir/INSTALLATION.md" << EOF
# ThoughtPilot $tier_name Tier Installation Guide

## Overview
This package contains the ThoughtPilot $tier_name tier with all necessary components for standalone installation.

## Package Contents
- Core CLI functionality
- Installation scripts
- Documentation
- Feature flag system
- Doctor scripts for health checks

## Quick Start

### Prerequisites
$(case $tier_name in
    "free")
        echo "- Python >= 3.8"
        ;;
    "pro")
        echo "- Python >= 3.8"
        echo "- Node.js >= 16.0.0"
        ;;
    "team")
        echo "- Python >= 3.8"
        echo "- Node.js >= 16.0.0"
        echo "- kubectl >= 1.20.0"
        ;;
    "enterprise")
        echo "- Python >= 3.8"
        echo "- Node.js >= 16.0.0"
        echo "- kubectl >= 1.20.0"
        echo "- Helm >= 3.0.0"
        ;;
esac)

### Installation Steps
1. Extract this package: \`tar -xzf $package_name\`
2. Navigate to the extracted directory
3. Run the installation script: \`bash installation-scripts/install-$tier_name.sh\`
4. Verify installation: \`bash doctor-scripts/doctor-$tier_name.sh\`

## Features
$(case $tier_name in
    "free")
        echo "- Basic CLI functionality"
        echo "- Core utilities"
        echo "- Feature flag system"
        ;;
    "pro")
        echo "- All Free tier features"
        echo "- Slack integration"
        echo "- Web dashboard"
        ;;
    "team")
        echo "- All Pro tier features"
        echo "- Multi-user support"
        echo "- CI/CD integration"
        echo "- Kubernetes deployment"
        ;;
    "enterprise")
        echo "- All Team tier features"
        echo "- SSO integration"
        echo "- Security features"
        echo "- Compliance tools"
        echo "- Airgapped deployment"
        echo "- Custom GPT endpoints"
        ;;
esac)

## Support
For support and documentation, visit: https://thoughtpilot.ai/docs

## License
MIT License - see LICENSE file for details

Package created: $(date)
Version: 1.0.0
Tier: $tier_name
EOF

    # Create README for the package
    cat > "$temp_dir/README.md" << EOF
# ThoughtPilot $tier_name Tier

## Quick Installation
\`\`\`bash
# Extract and install
tar -xzf $package_name
cd thoughtpilot-$tier_name
bash installation-scripts/install-$tier_name.sh
\`\`\`

## Documentation
- [Installation Guide](INSTALLATION.md)
- [API Documentation](docs/)
- [Troubleshooting](doctor-scripts/)

## Features
$(case $tier_name in
    "free")
        echo "- Minimal CLI package for basic usage"
        ;;
    "pro")
        echo "- CLI with Slack integration and dashboard"
        ;;
    "team")
        echo "- Multi-user support with CI/CD and Kubernetes"
        ;;
    "enterprise")
        echo "- Enterprise features with SSO, security, and compliance"
        ;;
esac)

Package: $package_name
Created: $(date)
EOF

    # Create LICENSE file
    cat > "$temp_dir/LICENSE" << EOF
MIT License

Copyright (c) 2025 ThoughtPilot Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

    # Create package manifest
    cat > "$temp_dir/PACKAGE_MANIFEST.txt" << EOF
ThoughtPilot $tier_name Tier Package Manifest
============================================

Package Name: $package_name
Tier: $tier_name
Version: 1.0.0
Created: $(date)
File Count: $(find "$temp_dir" -type f | wc -l | tr -d ' ')

Contents:
$(find "$temp_dir" -type f | sort | sed 's|.*/||' | head -20)

... and $(find "$temp_dir" -type f | wc -l | tr -d ' ') total files

Installation:
1. Extract: tar -xzf $package_name
2. Install: bash installation-scripts/install-$tier_name.sh
3. Verify: bash doctor-scripts/doctor-$tier_name.sh

Support: https://thoughtpilot.ai/support
EOF

    # Create the tar.gz package
    cd "$DIST_DIR"
    tar -czf "$package_name" -C "$temp_dir" .
    
    # Get package size
    PACKAGE_SIZE=$(du -h "$package_name" | cut -f1)
    
    echo "✅ Created $package_name ($PACKAGE_SIZE)"
    
    # Clean up temp directory
    rm -rf "$temp_dir"
}

# Create packages for each tier
echo "🚀 Creating distribution packages..."
echo ""

create_tier_package "free"
create_tier_package "pro"
create_tier_package "team"
create_tier_package "enterprise"

echo ""
echo "📊 Distribution Package Summary"
echo "==============================="
echo ""

# List created packages
ls -lh "$DIST_DIR"/*.tar.gz

echo ""
echo "✅ All tier packages created successfully!"
echo ""
echo "📁 Packages located in: $DIST_DIR"
echo ""
echo "📦 Package Details:"
for package in "$DIST_DIR"/*.tar.gz; do
    if [ -f "$package" ]; then
        PACKAGE_NAME=$(basename "$package")
        PACKAGE_SIZE=$(du -h "$package" | cut -f1)
        echo "  - $PACKAGE_NAME ($PACKAGE_SIZE)"
    fi
done

echo ""
echo "🚀 Ready for distribution!"
echo ""
echo "Installation example:"
echo "  tar -xzf $DIST_DIR/thoughtpilot-free-v1.0.0-$DATE.tar.gz"
echo "  cd thoughtpilot-free"
echo "  bash installation-scripts/install-free.sh" 