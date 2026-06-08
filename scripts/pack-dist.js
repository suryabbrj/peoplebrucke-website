const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const zipPath = path.join(root, 'peoplebrucke-site.zip');

if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('dist/index.html missing — run npm run build:netlify first.');
  process.exit(1);
}

if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

function packDist() {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);

    archive.pipe(output);
    archive.directory(dist, false);
    archive.finalize();
  });
}

packDist()
  .then(() => {
    console.log(`\nReady to drag-and-drop: ${zipPath}`);
    console.log('Zip uses forward-slash paths (compatible with Netlify).');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
