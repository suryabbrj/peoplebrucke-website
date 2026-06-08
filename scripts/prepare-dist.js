const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

function removeDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const requiredFiles = ['index.html', 'careers.html'];
const requiredDirs = ['css', 'js', 'assets'];

for (const file of requiredFiles) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing ${file} — run "npm run build" first.`);
    process.exit(1);
  }
}

for (const dir of requiredDirs) {
  const dirPath = path.join(root, dir);
  if (!fs.existsSync(dirPath)) {
    console.error(`Missing ${dir}/ folder.`);
    process.exit(1);
  }
}

removeDir(dist);
fs.mkdirSync(dist, { recursive: true });

requiredFiles.forEach((file) => {
  fs.copyFileSync(path.join(root, file), path.join(dist, file));
});

requiredDirs.forEach((dir) => {
  copyDir(path.join(root, dir), path.join(dist, dir));
});

// Drop dev-only files from the deploy bundle
const devOnly = path.join(dist, 'js', 'generate-placeholders.js');
if (fs.existsSync(devOnly)) {
  fs.unlinkSync(devOnly);
}

console.log('Deploy bundle ready in dist/');
