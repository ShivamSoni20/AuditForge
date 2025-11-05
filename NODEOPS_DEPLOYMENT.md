# 🚀 AuditForge NodeOps Deployment Guide

Deploy AuditForge on NodeOps infrastructure with one click using the template.yaml configuration.

## 📋 Prerequisites

Before deploying, you'll need:

1. **NodeOps Account** - Sign up at [NodeOps Platform](https://nodeops.xyz)
2. **AIML API Key** - Get from [aimlapi.com](https://aimlapi.com) (Required)
3. **Etherscan API Keys** - Get from [etherscan.io/apis](https://etherscan.io/apis) (Optional but recommended)

## 🎯 Quick Deploy

### Step 1: Prepare Your API Keys

Gather the following API keys:

**Required:**
- `AIML_API_KEY` - For AI-powered contract analysis

**Optional (for Etherscan integration):**
- `ETHERSCAN_API_KEY` - Ethereum mainnet
- `BSCSCAN_API_KEY` - Binance Smart Chain
- `POLYGONSCAN_API_KEY` - Polygon
- `ARBISCAN_API_KEY` - Arbitrum
- `OPTIMISM_API_KEY` - Optimism
- `BASESCAN_API_KEY` - Base

### Step 2: Deploy on NodeOps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ShivamSoni20/AuditForge.git
   cd AuditForge
   ```

2. **Deploy Using Template**
   - Upload `nodeops_template.yaml` to NodeOps dashboard
   - Or use NodeOps CLI:
   ```bash
   nodeops deploy --template nodeops_template.yaml
   ```

3. **Configure Environment Variables**
   
   When prompted, provide your API keys:
   ```
   AIML_API_KEY: your_aiml_api_key_here
   ETHERSCAN_API_KEY: your_etherscan_key (optional)
   BSCSCAN_API_KEY: your_bscscan_key (optional)
   POLYGONSCAN_API_KEY: your_polygonscan_key (optional)
   ARBISCAN_API_KEY: your_arbiscan_key (optional)
   OPTIMISM_API_KEY: your_optimism_key (optional)
   BASESCAN_API_KEY: your_basescan_key (optional)
   ```

4. **Access Your Deployment**
   - Your app will be available at the NodeOps-provided URL
   - Example: `https://auditforge-{your-id}.nodeops.xyz`

## 📦 Template Configuration

The `template.yaml` file includes:

### Container Settings
- **Image**: `shivamsoni20/auditforge:latest`
- **Port**: 3000 (HTTP)
- **Pull Policy**: Always (ensures latest version)

### Resource Allocation
- **Idle State**:
  - CPU: 200m (0.2 cores)
  - Memory: 512MB
  
- **Active State**:
  - CPU: 500m (0.5 cores)
  - Memory: 1024MB (1GB)

### Environment Variables
All API keys are templated with `{{.VARIABLE_NAME}}` syntax for secure deployment.

## 🔧 Advanced Configuration

### Custom Resource Limits

Edit `template.yaml` to adjust resources:

```yaml
resourceUsage:
  idle:
    cpu: 300      # Increase for faster cold starts
    memory: 768   # Increase for larger contracts
  active:
    cpu: 1000     # Increase for concurrent audits
    memory: 2048  # Increase for complex analysis
```

### Multiple Instances

For high availability, deploy multiple instances:

```bash
nodeops deploy --template template.yaml --replicas 3
```

### Custom Domain

Configure a custom domain in NodeOps dashboard:
1. Go to your deployment settings
2. Add custom domain (e.g., `audit.yourdomain.com`)
3. Update DNS records as instructed

## 🔒 Security Best Practices

### API Key Management

1. **Never commit API keys** to version control
2. **Use NodeOps secrets** for sensitive data
3. **Rotate keys regularly** (every 90 days recommended)
4. **Use read-only keys** where possible

### Network Security

1. **Enable HTTPS** (automatic on NodeOps)
2. **Configure rate limiting** in NodeOps dashboard
3. **Monitor access logs** for suspicious activity

## 📊 Monitoring & Logs

### View Application Logs

```bash
# Using NodeOps CLI
nodeops logs auditforge --follow

# Or via dashboard
# Navigate to Deployments > AuditForge > Logs
```

### Health Checks

The application includes a health endpoint:
- **URL**: `https://your-app.nodeops.xyz/api/health`
- **Expected Response**: `200 OK`

### Metrics to Monitor

- **Response Time**: Should be < 2s for most requests
- **Memory Usage**: Should stay under 1GB during normal operation
- **CPU Usage**: Spikes during AI analysis are normal
- **Error Rate**: Should be < 1%

## 🔄 Updates & Maintenance

### Update to Latest Version

```bash
# Pull latest image
nodeops deploy --template template.yaml --update

# Or force rebuild
nodeops deploy --template template.yaml --rebuild
```

### Rollback to Previous Version

```bash
nodeops rollback auditforge --version previous
```

### Scheduled Maintenance

Set up automatic updates:
1. Go to NodeOps dashboard
2. Enable auto-updates for your deployment
3. Configure maintenance window (e.g., 2 AM UTC)

## 🐛 Troubleshooting

### Deployment Fails

**Issue**: Container won't start

**Solutions**:
1. Check API keys are correct
2. Verify image exists: `docker pull shivamsoni20/auditforge:latest`
3. Review logs: `nodeops logs auditforge`

### High Memory Usage

**Issue**: Container keeps restarting due to OOM

**Solutions**:
1. Increase memory limit in `template.yaml`
2. Check for memory leaks in logs
3. Reduce concurrent audit requests

### Slow Response Times

**Issue**: Audits taking too long

**Solutions**:
1. Increase CPU allocation
2. Check AIML API rate limits
3. Enable caching in NodeOps
4. Scale to multiple instances

### API Key Errors

**Issue**: "Invalid API key" errors

**Solutions**:
1. Verify key is correct in NodeOps secrets
2. Check key hasn't expired
3. Ensure key has proper permissions
4. Test key directly: `curl https://api.aimlapi.com/v1/models -H "Authorization: Bearer YOUR_KEY"`

## 💰 Cost Optimization

### Reduce Costs

1. **Right-size resources**: Start small, scale as needed
2. **Use idle state**: Reduces costs during low traffic
3. **Enable auto-scaling**: Only pay for what you use
4. **Cache responses**: Reduce API calls to AIML

### Estimated Costs

Based on typical usage:
- **NodeOps Hosting**: ~$10-30/month
- **AIML API**: ~$0.002 per audit (varies by contract size)
- **Etherscan API**: Free tier sufficient for most use cases

## 🌐 Multi-Region Deployment

Deploy to multiple regions for better performance:

```bash
# Deploy to US region
nodeops deploy --template template.yaml --region us-east

# Deploy to EU region
nodeops deploy --template template.yaml --region eu-west

# Deploy to Asia region
nodeops deploy --template template.yaml --region asia-southeast
```

## 📈 Scaling Guide

### Horizontal Scaling

Increase replicas for high traffic:

```yaml
# In template.yaml
scaling:
  minReplicas: 2
  maxReplicas: 10
  targetCPU: 70
  targetMemory: 80
```

### Vertical Scaling

Increase resources per instance:

```yaml
resourceUsage:
  active:
    cpu: 2000     # 2 cores
    memory: 4096  # 4GB
```

## 🔗 Integration with CI/CD

### GitHub Actions

```yaml
name: Deploy to NodeOps

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to NodeOps
        run: |
          nodeops deploy --template template.yaml
        env:
          NODEOPS_API_KEY: ${{ secrets.NODEOPS_API_KEY }}
```

### GitLab CI

```yaml
deploy:
  stage: deploy
  script:
    - nodeops deploy --template template.yaml
  only:
    - main
```

## 📞 Support

- **NodeOps Documentation**: [docs.nodeops.xyz](https://docs.nodeops.xyz)
- **AuditForge Issues**: [github.com/ShivamSoni20/AuditForge/issues](https://github.com/ShivamSoni20/AuditForge/issues)
- **Community Discord**: Join for real-time support

## 📝 License

MIT License - See LICENSE file for details

---

**Ready to deploy?** Start with the Quick Deploy section above! 🚀
