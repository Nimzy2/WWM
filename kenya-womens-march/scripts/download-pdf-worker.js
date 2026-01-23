/**
 * Script to download PDF.js worker file to public folder
 * Run this with: node scripts/download-pdf-worker.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const version = '5.4.394';
// Version 5.4.394+ uses .mjs format (ES modules)
const workerUrl = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
const outputPath = path.join(__dirname, '..', 'public', 'pdf.worker.min.mjs');

console.log(`Downloading PDF.js worker (v${version})...`);
console.log(`From: ${workerUrl}`);
console.log(`To: ${outputPath}`);

https.get(workerUrl, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to download: HTTP ${response.statusCode}`);
    process.exit(1);
  }

  const fileStream = fs.createWriteStream(outputPath);
  response.pipe(fileStream);

  fileStream.on('finish', () => {
    fileStream.close();
    console.log('✓ Worker file downloaded successfully!');
    console.log(`  Location: ${outputPath}`);
    console.log('\nThe worker file is now ready! The code is already configured to use it.');
    console.log('File location: public/pdf.worker.min.mjs');
  });
}).on('error', (err) => {
  console.error('Error downloading worker file:', err.message);
  process.exit(1);
});
