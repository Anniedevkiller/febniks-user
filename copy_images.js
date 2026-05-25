const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\75c02154-e3bd-42d3-bfc2-b6eefe50c5f9';
const destDir = path.join(__dirname, 'public');

const files = {
  'media__1779748096252.jpg': 'croaker-dish.jpg',
  'media__1779748096276.jpg': 'catfish-dish.jpg',
  'media__1779748096403.jpg': 'mangala-pack.jpg',
  'media__1779748096465.jpg': 'founder-market.jpg',
  'media__1779748096481.jpg': 'spicy-dish-watermark.jpg'
};

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

for (const [srcName, destName] of Object.entries(files)) {
  const srcPath = path.join(srcDir, srcName);
  const destPath = path.join(destDir, destName);
  
  if (fs.existsSync(srcPath)) {
    try {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Successfully copied ${srcName} -> ${destName}`);
    } catch (err) {
      console.error(`Failed to copy ${srcName}:`, err.message);
    }
  } else {
    console.error(`Source file not found: ${srcPath}`);
  }
}

console.log("Image copy task completed!");
