# Changelog

## [Unreleased] - 2024-11-02

### Added
- **Landing Page**: Comprehensive landing page with MVP features showcase
  - Hero section with project overview and statistics
  - Feature highlights with icons and descriptions
  - Detailed MVP features section covering all capabilities
  - Use cases for different user personas
  - Call-to-action sections
  - Professional footer with links
  
- **Routing**: React Router integration for navigation
  - `/` - Landing page with project information
  - `/app` - Main audit application interface
  
- **New Components**:
  - `LandingPage.jsx` - Full-featured landing page
  - `AuditApp.jsx` - Separated audit interface component
  
- **Documentation**:
  - `DEPLOYMENT.md` - Comprehensive Vercel deployment guide
  - Updated `README.md` with landing page navigation

### Fixed
- **Vercel 404 Error**: Fixed deployment configuration
  - Updated `vercel.json` with correct build settings
  - Added proper API rewrites for serverless functions
  - Created `.vercelignore` to optimize deployment
  
- **Missing Import**: Added `AlertCircle` import in `AuditHistory.jsx`
  - Fixed ReferenceError that was breaking the application

### Changed
- **App Structure**: Refactored main App component
  - Moved audit interface to separate `AuditApp.jsx` component
  - Implemented routing for better navigation
  - Improved code organization with pages directory

### Dependencies
- Added `react-router-dom@^6.20.1` for routing functionality

## Deployment Notes

### Vercel Configuration
The project now uses a simplified Vercel configuration:
- Frontend builds from `frontend/dist`
- API runs as serverless functions via `api/index.js`
- Automatic SPA fallback for React Router

### Environment Variables Required
- `NODE_ENV=production`
- `AIML_API_KEY=your_api_key_here`

### Testing Checklist
- [ ] Landing page loads at root URL
- [ ] "Launch App" button navigates to `/app`
- [ ] Audit interface works correctly
- [ ] API endpoints respond properly
- [ ] PDF report generation works
- [ ] Code correction feature functional
- [ ] Audit history displays correctly
