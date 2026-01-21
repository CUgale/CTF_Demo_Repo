# Quick Steps to Push to GitHub

Follow these steps in order:

## Step 1: Check Current Status

```bash
cd /home/chaitrali.ugale/IdeaProjects/mig-v2/ctf/ctf-ui
git status
```

## Step 2: Add All Files

```bash
git add .
```

## Step 3: Commit Changes

```bash
git commit -m "Add mock mode and GitHub Pages deployment configuration"
```

## Step 4: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `ctf-ui` (or your preferred name)
3. Description: "CTF Dashboard - Continuous Testing Framework UI"
4. Choose **Public** (for free GitHub Pages) or **Private** (requires GitHub Pro)
5. **DO NOT** check "Add a README file" (we already have one)
6. Click **"Create repository"**

## Step 5: Get Your Repository URL

After creating the repository, GitHub will show you the repository URL. It will look like:
```
https://github.com/YOUR_USERNAME/ctf-ui.git
```

**Replace `YOUR_USERNAME` with your actual GitHub username in the commands below!**

## Step 6: Add Remote and Push

```bash
# Remove existing remote if any (if you get an error, skip this)
git remote remove origin

# Add your GitHub repository as remote
# REPLACE YOUR_USERNAME with your actual GitHub username!
git remote add origin https://github.com/YOUR_USERNAME/ctf-ui.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 7: Authenticate

When prompted:
- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (NOT your GitHub password)

### To Create Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: "CTF UI Deployment"
4. Select expiration (or no expiration)
5. Check the **`repo`** scope
6. Click **"Generate token"**
7. **COPY THE TOKEN** (you won't see it again!)
8. Use this token as your password when pushing

## Step 8: Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/YOUR_USERNAME/ctf-ui`
2. Click **"Settings"** tab
3. Click **"Pages"** in the left sidebar
4. Under **"Source"**, select: **"GitHub Actions"**
5. Save (no need to click anything, it auto-saves)

## Step 9: Wait for Deployment

1. Click **"Actions"** tab in your repository
2. You should see a workflow running: **"Deploy to GitHub Pages"**
3. Wait 2-3 minutes for it to complete
4. Once it shows a green checkmark ✅, your site is deployed!

## Step 10: Access Your Site

1. Go back to **"Settings"** → **"Pages"**
2. Your site URL will be shown at the top:
   - `https://YOUR_USERNAME.github.io/ctf-ui/`
   - Or if repo is `YOUR_USERNAME.github.io`: `https://YOUR_USERNAME.github.io/`

## Step 11: Enable Mock Mode on Live Site

Add `?mock=true` to your URL:
```
https://YOUR_USERNAME.github.io/ctf-ui/?mock=true
```

## Troubleshooting

### "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/ctf-ui.git
```

### "Authentication failed"
- Make sure you're using a Personal Access Token, not your password
- Check that the token has `repo` permissions

### "Permission denied"
- Verify your GitHub username is correct
- Make sure the repository exists on GitHub
- Check that you have write access to the repository

### Build fails in Actions
- Check the Actions tab for error messages
- Make sure all files were pushed correctly
- Verify `package.json` has all dependencies

## Need Help?

Check the detailed guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
