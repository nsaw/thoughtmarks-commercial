#!/bin/bash
set -e
echo 'Deploying ThoughtPilot config package...'
tar -xzvf configs/thoughtpilot-config-package.tar.gz -C /opt/thoughtpilot/configs/
echo '✅ Configs deployed to /opt/thoughtpilot/configs/' 