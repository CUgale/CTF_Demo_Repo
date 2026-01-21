# Mock Mode Setup - Quick Start Guide

## What Was Added

A complete mock data system has been integrated into the CTF UI to enable demo mode without requiring a backend API server.

## Files Created/Modified

### New Files:
1. **`src/services/mock-data.service.ts`** - Central mock data service with:
   - Mock user data
   - Mock projects (3 projects)
   - Mock commits (6 commits)
   - Mock job creation responses
   - Helper functions to check if mock mode is enabled

### Modified Files:
1. **`src/pages/login/Login.saga.ts`** - Updated to use mock data for login and user fetching
2. **`src/layouts/Layout.saga.ts`** - Updated to use mock data for projects
3. **`src/pages/createJob/CreateJob.saga.ts`** - Updated to use mock data for commits and job creation
4. **`src/pages/login/login-components/LoginForm.tsx`** - Added demo mode indicator

### Documentation:
1. **`MOCK_MODE_README.md`** - Complete documentation for using mock mode

## How to Enable Mock Mode

### Option 1: URL Parameter (Easiest)
Visit: `http://localhost:3000/?mock=true`

### Option 2: LocalStorage
Open browser console and run:
```javascript
localStorage.setItem('useMockData', 'true');
location.reload();
```

### Option 3: Environment Variable
Add to `.env` file:
```
VITE_USE_MOCK_DATA=true
```

## Demo Flow

1. **Enable mock mode** using one of the methods above
2. **Login** - Use any username/password (e.g., `demo_user` / `password`)
3. **View Dashboard** - See project statistics
4. **Select Projects** - Switch between 3 available projects
5. **Create Job**:
   - Go to "Create Job"
   - Select a commit from the dropdown (6 commits available)
   - Click "Trigger Job"
   - You'll be redirected to jobs list
6. **View Job Details** - Click on any job to see detailed execution phases (existing mock data)

## Mock Data Available

### Projects:
- `dbt_analytics_warehouse` (default active)
- `dbt_marketing_analytics`
- `dbt_finance_reporting`

### Commits:
- 6 recent commits with realistic commit messages and metadata

### User:
- Username: `demo_user`
- Email: `demo@example.com`
- Any credentials work for login in mock mode

## Important Notes

- ✅ All existing mock data for job details, test reviews, etc. remains unchanged
- ✅ Mock mode adds realistic API delays (300-1000ms) for better demo experience
- ✅ Mock mode can be toggled on/off without restarting the server
- ✅ When mock mode is disabled, the app connects to the real API
- ✅ No existing logic was broken - mock mode is additive only

## Testing

To test the mock mode:
1. Start the dev server: `npm run dev`
2. Enable mock mode: `http://localhost:3000/?mock=true`
3. Login with any credentials
4. Navigate through the app and verify all features work

## Troubleshooting

If mock mode doesn't work:
1. Check browser console for errors
2. Verify mock mode is enabled (check URL or localStorage)
3. Clear browser cache
4. Check that localStorage is not blocked
