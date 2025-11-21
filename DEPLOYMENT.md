# Deployment Guide for Habit Helper

This guide explains how to deploy Habit Helper to Vercel and other hosting platforms.

---

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Git installed locally

---

## Deploy to Vercel (Recommended)

Vercel is the recommended hosting platform because:
- ✅ Provides HTTPS automatically (required for Service Workers)
- ✅ Easy GitHub integration with automatic deployments
- ✅ Free tier available
- ✅ Fast global CDN
- ✅ Zero configuration needed for static sites

### Step 1: Push to GitHub

Make sure your code is pushed to a GitHub repository:

```bash
git add .
git commit -m "feat: prepare for deployment"
git push origin main
```

### Step 2: Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com) and sign up/log in
2. Click "Add New" → "Project"
3. Select "Import Git Repository"
4. Choose your `final-habit-helper` repository
5. Vercel will auto-detect it as a static site

### Step 3: Configure Project (Optional)

Vercel should automatically detect the correct settings:

- **Framework Preset:** Other (or leave as detected)
- **Build Command:** (leave empty - no build needed)
- **Output Directory:** (leave empty - serves from root)
- **Install Command:** (leave empty - no dependencies)

The `vercel.json` file in the repository will automatically configure:
- Service Worker headers
- Security headers
- SPA routing

### Step 4: Deploy

1. Click "Deploy"
2. Wait 1-2 minutes for deployment to complete
3. Vercel will provide a live URL (e.g., `https://your-app.vercel.app`)

### Step 5: Test Production Deployment

Visit the live URL and test:

1. ✅ App loads over HTTPS
2. ✅ Service Worker registers (check DevTools → Application → Service Workers)
3. ✅ Create a habit
4. ✅ Request notification permissions
5. ✅ Test notifications (schedule for 1-2 minutes in the future)
6. ✅ Test offline mode (disconnect WiFi, reload page)
7. ✅ Mark habit as complete

### Step 6: Enable Automatic Deployments

By default, Vercel will:
- Deploy on every push to `main` branch
- Deploy preview versions for pull requests
- Automatically use HTTPS

You can view deployment status in the Vercel dashboard.

---

## Alternative: Deploy to Netlify

Netlify is another excellent option with similar features.

### Steps:

1. Go to [netlify.com](https://netlify.com) and sign up/log in
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure build settings:
   - **Build command:** (leave empty)
   - **Publish directory:** `/` (root)
5. Click "Deploy site"

Create a `netlify.toml` file in the root:

```toml
[build]
  publish = "."

[[headers]]
  for = "/service-worker.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
    Service-Worker-Allowed = "/"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

---

## Alternative: Deploy to GitHub Pages

GitHub Pages works but has some limitations for Service Workers.

### Steps:

1. Enable GitHub Pages in repository settings
2. Set source to `main` branch
3. Wait for deployment
4. Access at `https://username.github.io/repo-name`

**Note:** GitHub Pages requires additional configuration for Service Workers to work correctly. Vercel or Netlify are recommended instead.

---

## Local Testing

For local development, HTTPS is required for Service Workers and notifications.

### Option 1: Use ngrok for HTTPS Tunnel

```bash
# Install ngrok: https://ngrok.com/download
# Start local server
python3 -m http.server 8000

# In another terminal, create HTTPS tunnel
ngrok http 8000
```

Use the ngrok HTTPS URL (e.g., `https://abc123.ngrok.io`) to test locally with full functionality.

### Option 2: Use localhost with Chrome Flags

Chrome treats `localhost` as a secure origin, so Service Workers work:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000` in Chrome. Service Workers will work, but notifications may be limited.

---

## Post-Deployment Checklist

After deploying to production, verify:

### Functionality Tests
- [ ] App loads correctly over HTTPS
- [ ] Service Worker registers successfully
- [ ] Can create habits
- [ ] Can mark habits complete
- [ ] Streak calculations work
- [ ] Navigation between habits works (if multiple)
- [ ] Notification permission request appears
- [ ] Notifications display correctly
- [ ] Clicking notification opens app
- [ ] App works offline (after first load)
- [ ] Data persists after closing browser
- [ ] Milestone celebrations trigger correctly

### Performance Tests
- [ ] Page loads quickly (< 2 seconds on 3G)
- [ ] No console errors
- [ ] Smooth animations
- [ ] Responsive on mobile devices

### Browser Tests
- [ ] Works on Chrome (desktop & mobile)
- [ ] Works on Safari (desktop & mobile)
- [ ] Works on Firefox (desktop & mobile)
- [ ] Works on Edge

### Mobile Tests
- [ ] Test on actual iPhone (iOS Safari)
- [ ] Test on actual Android phone (Chrome)
- [ ] Swipe gestures work smoothly
- [ ] Touch targets are sized correctly
- [ ] Text is readable without zooming

---

## Updating the Deployment

### Automatic Updates (Vercel/Netlify)

Just push to GitHub:

```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

Vercel/Netlify will automatically rebuild and deploy.

### Manual Updates

1. Make code changes locally
2. Test locally
3. Commit and push to GitHub
4. Trigger manual deployment in hosting dashboard (if needed)

---

## Custom Domain (Optional)

### Vercel Custom Domain

1. Go to project settings in Vercel dashboard
2. Click "Domains"
3. Add your custom domain (e.g., `habithelper.com`)
4. Follow DNS configuration instructions
5. Vercel automatically provisions SSL certificate

### Netlify Custom Domain

1. Go to site settings in Netlify dashboard
2. Click "Domain management"
3. Add custom domain
4. Update DNS records as instructed
5. Enable HTTPS (automatic)

---

## Monitoring and Analytics (Optional)

### Add Analytics

You can add privacy-friendly analytics like:
- **Plausible Analytics**: Lightweight, privacy-focused
- **Simple Analytics**: GDPR-compliant
- **Vercel Analytics**: Built-in (requires upgrade)

Add analytics script to `index.html`:

```html
<!-- Example: Plausible Analytics -->
<script defer data-domain="your-domain.com" src="https://plausible.io/js/script.js"></script>
```

### Monitor Errors

Consider adding error monitoring:
- **Sentry**: Real-time error tracking
- **LogRocket**: Session replay
- **Browser DevTools**: Check console for errors

---

## Troubleshooting

### Service Worker Not Registering

**Problem:** Service Worker shows as "Not registered" in DevTools

**Solutions:**
- Verify you're using HTTPS (not HTTP)
- Check `service-worker.js` path is correct
- Clear browser cache and hard reload
- Check console for registration errors

### Notifications Not Working

**Problem:** Notifications don't display

**Solutions:**
- Verify HTTPS is enabled
- Check notification permissions are granted
- Test on supported browser (Chrome, Firefox, Edge)
- Safari has limited support on iOS (requires iOS 16.4+)
- Check browser console for errors

### App Not Working Offline

**Problem:** App doesn't load when offline

**Solutions:**
- Verify Service Worker is registered and active
- Check cached files in DevTools → Application → Cache Storage
- Make sure all required files are listed in `service-worker.js` cache
- Test: load app online first, then go offline

### localStorage Full

**Problem:** "QuotaExceededError" in console

**Solutions:**
- localStorage limit is ~5-10MB per domain
- Clear old habits/tracking data
- Implement data cleanup for old tracking data
- Consider IndexedDB for larger storage needs

### Build Errors on Vercel

**Problem:** Deployment fails on Vercel

**Solutions:**
- Check build logs in Vercel dashboard
- Verify all files are committed to Git
- Ensure no build command is specified (static site)
- Check `vercel.json` syntax is correct

---

## Security Considerations

### Already Implemented
✅ All data stored locally (no server transmission)
✅ HTTPS enforced (via Vercel)
✅ Security headers configured in `vercel.json`
✅ No API keys or secrets in code
✅ Input sanitization in JavaScript

### Additional Security (Optional)
- Enable Content Security Policy (CSP)
- Add Subresource Integrity (SRI) for any external scripts
- Regular dependency updates (if added in future)

---

## Backup and Recovery

### Export Data Feature (Future Enhancement)

Consider adding data export functionality:

```javascript
// Export all data as JSON
function exportData() {
    const data = {
        habits: getHabits(),
        tracking: {},
        version: '1.0.0',
        exportDate: new Date().toISOString()
    };
    
    // Get all tracking data
    data.habits.forEach(habit => {
        data.tracking[habit.id] = getTracking(habit.id);
    });
    
    // Download as JSON file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-helper-backup-${Date.now()}.json`;
    a.click();
}
```

---

## Support and Maintenance

### Regular Maintenance Tasks
- Monitor deployment status
- Check for browser console errors
- Test on new browser versions
- Review analytics (if implemented)
- Respond to user feedback
- Update dependencies (if any added)

### Getting Help
- Check browser DevTools console for errors
- Review [TESTING.md](TESTING.md) for common issues
- Test on multiple browsers and devices
- Check Vercel/Netlify deployment logs

---

## Resources

- **Vercel Documentation:** https://vercel.com/docs
- **Service Worker API:** https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- **Notification API:** https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API
- **Web App Manifest:** https://developer.mozilla.org/en-US/docs/Web/Manifest
- **localStorage:** https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

---

## Rollback Strategy

If a deployment causes issues:

### Vercel Rollback
1. Go to Vercel dashboard
2. Find the deployment you want to rollback to
3. Click "..." menu → "Promote to Production"
4. Previous version is now live

### Git Rollback
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push origin main --force
```

---

## Success Criteria

Deployment is successful when:
- ✅ App loads over HTTPS
- ✅ Service Worker active
- ✅ Notifications work
- ✅ Offline mode works
- ✅ All features functional
- ✅ No console errors
- ✅ Fast load times
- ✅ Mobile responsive
- ✅ Cross-browser compatible

**Congratulations! Your Habit Helper app is now live! 🎉**
