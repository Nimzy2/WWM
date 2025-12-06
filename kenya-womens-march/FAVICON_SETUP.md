# Favicon Setup Guide

This guide will help you create the necessary favicon files for the World March of Women Kenya website.

## Required Favicon Files

You need to create the following files in the `public` folder:

1. **favicon.ico** - Main favicon (16x16, 32x32, 48x48 sizes)
2. **favicon-16x16.png** - 16x16 PNG favicon
3. **favicon-32x32.png** - 32x32 PNG favicon
4. **apple-touch-icon.png** - 180x180 PNG for iOS devices
5. **android-chrome-192x192.png** - 192x192 PNG for Android
6. **android-chrome-512x512.png** - 512x512 PNG for Android

## How to Generate Favicons

### Option 1: Online Favicon Generator (Recommended)

1. Visit [favicon.io](https://favicon.io/) or [realfavicongenerator.net](https://realfavicongenerator.net/)
2. Upload your logo file (`WMW-New Logo.jpg` from the `public` folder)
3. Download the generated favicon package
4. Extract all files to the `public` folder

### Option 2: Using Image Editing Software

1. Open `WMW-New Logo.jpg` in an image editor (Photoshop, GIMP, etc.)
2. Create square versions of the logo (crop to square if needed)
3. Resize to each required size:
   - 16x16 pixels → `favicon-16x16.png`
   - 32x32 pixels → `favicon-32x32.png`
   - 180x180 pixels → `apple-touch-icon.png`
   - 192x192 pixels → `android-chrome-192x192.png`
   - 512x512 pixels → `android-chrome-512x512.png`
4. For `favicon.ico`, use an online converter or tool like [convertio.co](https://convertio.co/png-ico/) to convert the 32x32 PNG to ICO format

### Option 3: Using Command Line (if you have ImageMagick installed)

```bash
# Navigate to public folder
cd public

# Create PNG favicons from logo (assuming logo is square)
convert "WMW-New Logo.jpg" -resize 16x16 favicon-16x16.png
convert "WMW-New Logo.jpg" -resize 32x32 favicon-32x32.png
convert "WMW-New Logo.jpg" -resize 180x180 apple-touch-icon.png
convert "WMW-New Logo.jpg" -resize 192x192 android-chrome-192x192.png
convert "WMW-New Logo.jpg" -resize 512x512 android-chrome-512x512.png

# Create ICO file (requires additional tools)
# Use online converter or icotool if available
```

## Quick Setup with Online Tools

**Recommended: [RealFaviconGenerator](https://realfavicongenerator.net/)**

1. Go to https://realfavicongenerator.net/
2. Click "Select your Favicon image"
3. Upload `public/WMW-New Logo.jpg`
4. Configure options:
   - iOS: Use the generated settings
   - Android: Use the generated settings
   - Windows: Use the generated settings
5. Click "Generate your Favicons and HTML code"
6. Download the package
7. Extract all files to the `public` folder

## Verification

After adding the favicon files:

1. Clear your browser cache
2. Restart your development server
3. Check the browser tab - you should see the favicon
4. Test on mobile devices to verify app icons work

## Notes

- The favicon configuration is already set up in `index.html`
- The manifest.json is configured to use the favicon files
- All favicon links are properly configured for cross-platform support



