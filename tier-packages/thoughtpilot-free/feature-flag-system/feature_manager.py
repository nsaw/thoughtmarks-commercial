#!/usr/bin/env python3
"""Feature Flag Manager for ThoughtPilot Tiers"""

import json
import os


class FeatureManager:
    def __init__(self, tier="free"):
        self.tier = tier
        self.flags = self._load_flags()

    def _load_flags(self):
        try:
            # Try current directory first, then parent directory
            json_paths = [
                "feature-flags.json", 
                "../feature-flag-system/feature-flags.json"
            ]
            for path in json_paths:
                if os.path.exists(path):
                    with open(path, "r") as f:
                        return json.load(f)
            return {"featureFlags": {}, "tiers": {}}
        except FileNotFoundError:
            return {"featureFlags": {}, "tiers": {}}

    def is_enabled(self, feature):
        """Check if a feature is enabled for the current tier"""
        # Check if feature is in tier's feature list
        tier_features = self.get_tier_features()
        if feature in tier_features:
            return True
        
        # Check feature flags configuration
        if feature not in self.flags.get("featureFlags", {}):
            return False
        feature_config = self.flags["featureFlags"][feature]
        return (feature_config.get("enabled", False) and 
                feature_config.get("tier") in ["all", self.tier])

    def get_tier_features(self):
        """Get all features for the current tier"""
        return (self.flags.get("tiers", {})
                .get(self.tier, {})
                .get("features", []))


if __name__ == "__main__":
    # Test the feature manager
    for tier in ["free", "pro", "team", "enterprise"]:
        fm = FeatureManager(tier)
        print(f"Tier: {tier}")
        print(f"Features: {fm.get_tier_features()}")
        print(f"Slack enabled: {fm.is_enabled('slack')}")
        print("---")
