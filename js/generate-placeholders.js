const fs = require('fs');
const path = require('path');

const colors = [
  '#E2D4C4', '#9C99A2', '#D52B1E', '#D09845', '#48BFB2', '#321A06',
  '#ACCDD8', '#E15B38', '#85BCC9', '#78CEB4', '#6201D9', '#FE6A00',
  '#2a2a35', '#3d4f5f', '#5c4033', '#1a3a4a', '#4a3728', '#2d5a4a'
];

function svgPlaceholder(w, h, color, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="${color}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="sans-serif" font-size="${Math.min(w,h)*0.08}">${label}</text>
</svg>`;
}

const dirs = {
  services: ['brand', 'commerce', 'websites'],
  work: ['work-1'],
  engagements: ['client-1', 'client-2', 'client-3']
};

Object.entries(dirs).forEach(([folder, items]) => {
  const dir = path.join('assets/images', folder);
  fs.mkdirSync(dir, { recursive: true });
  items.forEach((name, i) => {
    const color = colors[i % colors.length];
    const w = folder === 'engagements' ? 200 : 800;
    const h = folder === 'engagements' ? 75 : 450;
    fs.writeFileSync(path.join(dir, `${name}.svg`), svgPlaceholder(w, h, color, name));
  });
});

// Hero gradient SVG
fs.writeFileSync('assets/images/hero-bg.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e1d23"/>
      <stop offset="50%" style="stop-color:#2a2835"/>
      <stop offset="100%" style="stop-color:#1a1a22"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <circle cx="960" cy="540" r="300" fill="rgba(255,255,255,0.03)"/>
  <circle cx="600" cy="300" r="150" fill="rgba(255,255,255,0.02)"/>
</svg>`);

console.log('Placeholders generated');
