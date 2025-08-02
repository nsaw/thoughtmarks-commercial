#!/usr/bin/env python3
"""Feature Flag CLI for ThoughtPilot Tiers"""

import sys
from feature_manager import FeatureManager

def main():
    if len(sys.argv) < 3:
        print("Usage: python3 feature_cli.py <tier> <feature>")
        sys.exit(1)

    tier = sys.argv[1]
    feature = sys.argv[2]

    fm = FeatureManager(tier)
    enabled = fm.is_enabled(feature)
    print(f"Feature {feature} for tier {tier}: {\"ENABLED\" if enabled else \"DISABLED\"}")
    sys.exit(0 if enabled else 1)

if __name__ == "__main__":
    main()
