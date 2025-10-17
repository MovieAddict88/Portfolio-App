# PWA Setup & Installation Guide

## Quick Start

### 1. Deploy Files
Ensure all PWA files are deployed to your web server:
```
/public/
├── manifest.json          # Web app manifest
├── sw.js                  # Service worker
├── offline.html           # Offline fallback page
├── icons/                 # PWA icons directory
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   ├── icon-512x512.png
│   ├── shortcut-about.png
│   ├── shortcut-projects.png
│   └── shortcut-contact.png
└── screenshots/           # App screenshots (optional)
    ├── desktop-screenshot.png
    └── mobile-screenshot.png
```

### 2. Enable HTTPS
PWA requires HTTPS (except on localhost). Ensure your site has a valid SSL certificate.

### 3. Test PWA Features
Visit `/pwa-test.html` to validate all PWA features are working correctly.

## Installation for Users

### Desktop (Chrome/Edge)
1. Visit the portfolio website
2. Look for the install button in the address bar (📱 icon)
3. Click "Install" when prompted
4. The app will be added to your desktop and app list

### Mobile (Android)
1. Open the website in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home Screen"
4. Confirm installation

### iOS (Safari)
1. Open the website in Safari
2. Tap the share button
3. Select "Add to Home Screen"
4. Customize the name and tap "Add"

## Features Available

### ✅ Installed App Features
- **Standalone Mode**: Runs without browser UI
- **App Icon**: Custom icon on home screen/desktop
- **Splash Screen**: Branded loading screen
- **Offline Access**: Works without internet connection
- **Fast Loading**: Cached content loads instantly
- **Native Feel**: App-like navigation and interactions

### ✅ Offline Capabilities
- Portfolio content and images
- Navigation between sections
- Contact form (queued for sync)
- Resume downloads (if previously cached)
- Basic app functionality

## Troubleshooting

### Install Button Not Showing?
- Ensure you're using HTTPS
- Check that the manifest.json is accessible
- Verify service worker is registered
- Try refreshing the page

### Offline Not Working?
- Check browser developer tools > Application > Service Workers
- Verify cache storage is available
- Clear browser cache and try again

### Icons Not Displaying?
- Ensure icon files exist in `/public/icons/`
- Check file permissions
- Verify manifest.json icon paths are correct

## Testing Checklist

- [ ] Manifest loads without errors
- [ ] Service worker registers successfully
- [ ] Icons display correctly
- [ ] Install prompt appears
- [ ] App installs successfully
- [ ] Offline functionality works
- [ ] App shortcuts work
- [ ] Performance is acceptable

## Support

For technical issues:
1. Check browser console for errors
2. Use the PWA testing tool at `/pwa-test.html`
3. Verify all files are properly deployed
4. Test on different devices and browsers

---

*Your portfolio is now a fully functional Progressive Web App! 🎉*