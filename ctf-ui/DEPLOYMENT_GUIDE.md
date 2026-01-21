# GitHub Pages Deployment Guide for CTF UI

This guide will walk you through deploying your CTF UI to GitHub Pages step by step.

## Prerequisites

- A GitHub account
- Git installed on your machine
- Node.js and npm installed

## Step 1: Prepare Your Code

All necessary files are already configured:
- ✅ `vite.config.ts` - Configured for GitHub Pages
- ✅ `404.html` - Handles client-side routing
- ✅ `.github/workflows/deploy.yml` - GitHub Actions workflow
- ✅ `.gitignore` - Excludes unnecessary files

## Step 2: Create a New GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the repository details:
   - **Repository name**: `ctf-ui` (or your preferred name)
   - **Description**: "CTF Dashboard - Continuous Testing Framework UI"
   - **Visibility**: Choose **Public** (required for free GitHub Pages) or **Private** (requires GitHub Pro)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

## Step 3: Push Your Code to GitHub

Open your terminal and run these commands:

```bash
# Navigate to your project directory
cd /home/chaitrali.ugale/IdeaProjects/mig-v2/ctf/ctf-ui

# Check current git status
git status

# Add all files (excluding those in .gitignore)
git add .

# Commit your changes
git commit -m "Initial commit: CTF UI with mock mode for GitHub Pages deployment"

# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ctf-ui.git

# If you already have a remote, remove it first:
# git remote remove origin
# git remote add origin https://github.com/YOUR_USERNAME/ctf-ui.git

# Push to GitHub (replace 'main' with 'master' if that's your default branch)
git branch -M main
git push -u origin main
```

**Note**: You'll be prompted for your GitHub credentials:
- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (not your GitHub password)
  - To create one: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token
  - Give it `repo` permissions
  - Copy the token and use it as your password

## Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **"Settings"** tab
3. Scroll down to **"Pages"** in the left sidebar
4. Under **"Source"**, select:
   - **Source**: `GitHub Actions` (this will appear after you push)
5. Save the settings

## Step 5: Update Repository Name in Workflow (If Needed)

If your repository name is NOT `ctf-ui`, you need to update the workflow:

1. Edit `.github/workflows/deploy.yml`
2. Find this line:
   ```yaml
   VITE_REPO_NAME: ${{ github.event.repository.name }}
   ```
3. If your repo is `username.github.io`, change it to:
   ```yaml
   VITE_REPO_NAME: 
   ```
   (empty string)
4. If your repo has a different name, it will automatically use the repo name

## Step 6: Trigger the Deployment

The deployment will automatically trigger when you push to the `main` branch. To trigger it manually:

1. Go to your repository on GitHub
2. Click on **"Actions"** tab
3. You should see the workflow running
4. Wait for it to complete (usually 2-3 minutes)

## Step 7: Access Your Deployed Site

Once deployment is complete:

1. Go to **"Settings"** → **"Pages"**
2. Your site URL will be displayed:
   - If repo is `username.github.io`: `https://username.github.io`
   - Otherwise: `https://username.github.io/repo-name`

## Step 8: Enable Mock Mode on Deployed Site

To enable mock mode on your deployed site, users can:

1. **URL Parameter**: Add `?mock=true` to the URL
   ```
   https://username.github.io/ctf-ui/?mock=true
   ```

2. **LocalStorage** (via browser console):
   ```javascript
   localStorage.setItem('useMockData', 'true');
   location.reload();
   ```

## Troubleshooting

### Build Fails
- Check the **Actions** tab for error messages
- Ensure all dependencies are in `package.json`
- Verify Node.js version in workflow matches your local version

### 404 Errors on Routes
- Verify `404.html` is in the root directory
- Check that `vite.config.ts` has the correct `base` path
- Ensure the repository name matches in the workflow

### Site Not Updating
- Clear browser cache
- Check GitHub Actions for deployment status
- Verify the workflow completed successfully

### Routing Issues
- Make sure you're using the correct base path
- Check browser console for errors
- Verify `404.html` is being served correctly

## Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
# Build the project
npm run build

# The dist folder contains your built files
# You can manually upload these to GitHub Pages
```

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file in the `public` folder with your domain:
   ```
   yourdomain.com
   ```
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings with your custom domain

## Support

For issues or questions:
- Check GitHub Actions logs
- Review the [GitHub Pages documentation](https://docs.github.com/en/pages)
- Check the [Vite deployment guide](https://vitejs.dev/guide/static-deploy.html)
