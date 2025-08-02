#!/bin/bash
echo "🔬 ThoughtPilot Team Tier Demo"
echo "Running Team tier diagnostics..."
bash doctor-scripts/doctor-team.sh
echo "Checking CI/CD integration..."
test -d ci-cd && echo "✅ CI/CD integration found" || echo "❌ CI/CD integration missing"
echo "Checking Kubernetes deployment..."
test -d k8s && echo "✅ Kubernetes deployment found" || echo "❌ Kubernetes deployment missing"
echo "Checking multi-user support..."
test -d multi-user && echo "✅ Multi-user support found" || echo "❌ Multi-user support missing"
echo "Checking API access..."
test -d api && echo "✅ API access found" || echo "❌ API access missing"
echo "✅ Team tier demo completed!"
