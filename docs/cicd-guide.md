# CI/CD Integration Guide

This guide is for CI/CD leads who want to integrate ThoughtPilot into their deployment pipelines.

## Integration Overview

ThoughtPilot can be integrated into any CI/CD pipeline to:
- Apply patches automatically
- Validate changes
- Rollback on failures
- Monitor deployment health

## GitHub Actions

### Basic Integration

```yaml
name: Apply ThoughtPilot Patches

on:
  push:
    branches: [main]
    paths: ['patches/**']

jobs:
  apply-patches:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install ThoughtPilot
        run: npm install -g @thoughtpilot/team
      
      - name: Apply Patches
        run: |
          for patch in patches/*.json; do
            thoughtpilot-team apply "$patch"
          done
      
      - name: Run Tests
        run: npm test
      
      - name: Deploy
        run: npm run deploy
```

### Advanced Integration

```yaml
name: Advanced ThoughtPilot CI/CD

on:
  push:
    branches: [main]

jobs:
  validate-patches:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate Patches
        run: |
          npm install -g @thoughtpilot/team
          thoughtpilot-team validate patches/
  
  apply-patches:
    needs: validate-patches
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Apply Patches
        run: |
          npm install -g @thoughtpilot/team
          thoughtpilot-team apply patches/
  
  deploy:
    needs: apply-patches
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Production
        run: |
          # Your deployment commands
          kubectl apply -f k8s/
```

## GitLab CI

```yaml
stages:
  - validate
  - apply
  - deploy

validate-patches:
  stage: validate
  script:
    - npm install -g @thoughtpilot/team
    - thoughtpilot-team validate patches/

apply-patches:
  stage: apply
  script:
    - npm install -g @thoughtpilot/team
    - thoughtpilot-team apply patches/
  dependencies:
    - validate-patches

deploy:
  stage: deploy
  script:
    - kubectl apply -f k8s/
  dependencies:
    - apply-patches
```

## Jenkins

### Pipeline Script

```groovy
pipeline {
    agent any
    
    stages {
        stage('Validate Patches') {
            steps {
                sh 'npm install -g @thoughtpilot/team'
                sh 'thoughtpilot-team validate patches/'
            }
        }
        
        stage('Apply Patches') {
            steps {
                sh 'thoughtpilot-team apply patches/'
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'kubectl apply -f k8s/'
            }
        }
    }
    
    post {
        failure {
            sh 'thoughtpilot-team rollback'
        }
    }
}
```

## Kubernetes Integration

### Deployment with Patches

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: thoughtpilot-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: thoughtpilot
  template:
    metadata:
      labels:
        app: thoughtpilot
    spec:
      containers:
      - name: thoughtpilot
        image: thoughtpilot/team:latest
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: thoughtpilot-secrets
              key: database-url
        volumeMounts:
        - name: patches
          mountPath: /app/patches
      volumes:
      - name: patches
        configMap:
          name: thoughtpilot-patches
```

## Best Practices

### Patch Management

1. **Version control patches**
2. **Test patches in staging**
3. **Use dry-run mode**
4. **Implement rollback procedures**
5. **Monitor patch application**

### Security

1. **Use secrets management**
2. **Validate patches before applying**
3. **Audit patch changes**
4. **Limit patch permissions**

### Monitoring

1. **Track patch success rates**
2. **Monitor deployment health**
3. **Alert on failures**
4. **Log all operations**

## Examples

See [CI/CD Examples](./examples/cicd-examples.md) for more detailed examples.

## Support

For CI/CD support:
- [Documentation](./README.md)
- [API Reference](./api-reference.md)
- [Community Forum](https://community.thoughtpilot.ai) 