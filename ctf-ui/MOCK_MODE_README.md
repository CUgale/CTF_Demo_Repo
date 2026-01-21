# Mock Mode for Demo/Development

This application supports a mock mode that allows you to run the UI without a backend API server. This is useful for demos, development, and testing.

## How to Enable Mock Mode

There are three ways to enable mock mode:

### 1. URL Parameter (Easiest for Quick Demo)
Add `?mock=true` to your URL:
```
http://localhost:3000/?mock=true
```

### 2. LocalStorage (Persists across sessions)
Open your browser's developer console and run:
```javascript
localStorage.setItem('useMockData', 'true');
```
Then refresh the page.

To disable:
```javascript
localStorage.removeItem('useMockData');
```

### 3. Environment Variable (For Development)
Create or update `.env` file in the project root:
```
VITE_USE_MOCK_DATA=true
```

Then restart your development server.

## What Mock Mode Provides

When mock mode is enabled, the following features work without a backend:

### 1. **Mock Login**
- **Any username/password** will work for login
- Example credentials:
  - Username: `demo_user` (or any value)
  - Password: `password` (or any value)

### 2. **Mock Projects**
The following projects are available:
- **dbt_analytics_warehouse** (default active)
  - Repository: `https://github.com/example/dbt_analytics_warehouse`
  - Description: Main analytics warehouse project
  
- **dbt_marketing_analytics**
  - Repository: `https://github.com/example/dbt_marketing_analytics`
  - Description: Marketing analytics project
  
- **dbt_finance_reporting**
  - Repository: `https://github.com/example/dbt_finance_reporting`
  - Description: Finance reporting project

### 3. **Mock Commits**
A list of 6 recent commits is available, including:
- `a1b2c3d4e5f6789012345678901234567890abcd` - Add customer analytics ETL pipeline
- `b2c3d4e5f6a789012345678901234567890abcde` - Update order analytics models
- `c3d4e5f6a7b89012345678901234567890abcdef` - Add product catalog models
- And more...

### 4. **Mock Job Creation**
- You can trigger jobs using any commit SHA from the commits list
- Jobs will be created with a unique ID and will appear in the jobs list
- Job details use existing mock data (already configured)

## Demo Flow

1. **Enable mock mode** using one of the methods above
2. **Login** with any credentials
3. **View Dashboard** - See project statistics and metrics
4. **Select a Project** - Switch between available projects
5. **Create a Job**:
   - Navigate to "Create Job"
   - Select a commit from the dropdown
   - Click "Trigger Job"
   - Job will be created and you'll be redirected to jobs list
6. **View Job Details** - Click on any job to see detailed execution phases

## Notes

- Mock mode adds realistic delays to simulate API calls
- All existing mock data for job details, test reviews, etc. remains unchanged
- Mock mode can be toggled on/off without restarting the server (using URL parameter or localStorage)
- When mock mode is disabled, the app will attempt to connect to the real API

## Troubleshooting

If mock mode doesn't seem to be working:
1. Check browser console for any errors
2. Verify mock mode is enabled (check URL parameter or localStorage)
3. Clear browser cache and reload
4. Check that you're not blocking localStorage in your browser settings
