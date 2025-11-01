# Deployment Guide for AuditForge

## Vercel Deployment

### Prerequisites
- Vercel account
- GitHub repository connected to Vercel
- AIML API key (for AI features)

### Deployment Steps

1. **Push the updated code to GitHub**
   ```bash
   git add .
   git commit -m "Fix Vercel deployment configuration"
   git push origin main
   ```

2. **Configure Vercel Project**
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings → General
   - Ensure the following settings:
     - **Framework Preset**: Vite
     - **Root Directory**: `./` (leave as root)
     - **Build Command**: `cd frontend && npm install && npm run build`
     - **Output Directory**: `frontend/dist`
     - **Install Command**: `npm install --prefix api && npm install --prefix backend`

3. **Set Environment Variables**
   - Go to Settings → Environment Variables
   - Add the following:
     - `NODE_ENV` = `production`
     - `AIML_API_KEY` = `your_aiml_api_key_here`

4. **Redeploy**
   - Go to Deployments
   - Click on the three dots menu on the latest deployment
   - Select "Redeploy"
   - Or push a new commit to trigger automatic deployment

### Troubleshooting

#### 404 Error
If you're still getting 404 errors:
1. Check that `frontend/dist` folder is being created during build
2. Verify API routes are accessible at `/api/*`
3. Check Vercel function logs for errors

#### API Not Working
1. Ensure environment variables are set correctly
2. Check that `api/index.js` is properly exporting the Express app
3. Verify backend dependencies are installed

#### Build Failures
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are listed in `package.json` files
3. Verify Node.js version compatibility (should be 18.x or 20.x)

### File Structure for Vercel
```
/
├── api/
│   ├── index.js          # Vercel serverless function entry
│   └── package.json      # API dependencies
├── backend/
│   ├── server.js         # Express app
│   ├── services/         # Business logic
│   └── package.json      # Backend dependencies
├── frontend/
│   ├── src/              # React source code
│   ├── dist/             # Build output (generated)
│   ├── index.html        # Entry HTML
│   ├── vite.config.js    # Vite configuration
│   └── package.json      # Frontend dependencies
├── vercel.json           # Vercel configuration
└── .vercelignore         # Files to ignore during deployment
```

### Important Notes
- The frontend is built as a static site and served from `frontend/dist`
- The backend runs as Vercel serverless functions via `api/index.js`
- API routes are accessible at `/api/*`
- All other routes fallback to `index.html` for React Router

### Testing Deployment
After deployment, test these endpoints:
1. `https://your-app.vercel.app/` - Should load the frontend
2. `https://your-app.vercel.app/api/health` - Should return `{"status":"ok",...}`
3. Try uploading a contract for audit

### Alternative: Manual Deployment via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```
