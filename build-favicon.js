const fs = require('fs');
const path = require('path');

try {
  const logoPath = path.join(__dirname, 'logo.png');
  const logoData = fs.readFileSync(logoPath);
  const base64Logo = logoData.toString('base64');
  
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <circle cx="64" cy="64" r="58" fill="#0A1128" />
  <image href="data:image/png;base64,${base64Logo}" x="22" y="38" width="84" height="52" preserveAspectRatio="xMidYMid meet" />
</svg>`;

  fs.writeFileSync(path.join(__dirname, 'favicon.svg'), svgContent);
  console.log('Successfully created self-contained favicon.svg with embedded Base64!');
} catch (error) {
  console.error('Error generating favicon:', error.message);
  process.exit(1);
}
