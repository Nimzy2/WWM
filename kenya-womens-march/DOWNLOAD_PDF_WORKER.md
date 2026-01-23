# How to Download PDF.js Worker File

The PDF upload feature requires a worker file to process PDFs. If you're getting errors, follow these steps:

## Option 1: Manual Download (Recommended)

**Important:** Version 5.4.394 uses `.mjs` format (ES modules), not `.js` format!

Try these links (one should work):

**Option A - jsDelivr CDN (Recommended):**
1. Open your web browser
2. Go to: https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.394/build/pdf.worker.min.mjs
3. The file should download automatically
4. If you see code instead:
   - Right-click on the page → "Save As"
   - Save it as `pdf.worker.min.mjs` (make sure extension is .mjs)
5. Copy the file to: `kenya-womens-march/public/pdf.worker.min.mjs`

**Option B - UNPKG CDN (Alternative):**
1. Go to: https://unpkg.com/pdfjs-dist@5.4.394/build/pdf.worker.min.mjs
2. Follow the same steps as above

## Option 2: Using PowerShell (if network allows)

```powershell
cd "c:\Users\user\Documents\WMWK\kenya-womens-march\public"
# Try jsDelivr first (usually more reliable)
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.394/build/pdf.worker.min.mjs" -OutFile "pdf.worker.min.mjs"
# If that fails, try unpkg
# Invoke-WebRequest -Uri "https://unpkg.com/pdfjs-dist@5.4.394/build/pdf.worker.min.mjs" -OutFile "pdf.worker.min.mjs"
```

## Option 3: Using Node.js Script

```bash
cd kenya-womens-march
node scripts/download-pdf-worker.js
```

## Verify Installation

After downloading, verify the file exists:
- Path: `public/pdf.worker.min.mjs`
- The file should be approximately 1 MB in size (version 5.4.394 uses .mjs format)

## Alternative: Use CDN Only

If you cannot download the file, the code will try to use the CDN. However, this may fail if:
- Your network blocks external CDNs
- The CDN is temporarily unavailable
- Firewall restrictions are in place

For production, it's recommended to download the worker file locally for better reliability.
