const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, 'dist');
const assetsDir = path.join(distDir, 'assets');

if (!fs.existsSync(assetsDir)) {
  console.error('dist/assets not found. Run vite build first.');
  process.exit(1);
}

const cssFile = fs.readdirSync(assetsDir).find(f => f.endsWith('.css'));
const jsFile = fs.readdirSync(assetsDir).find(f => f.endsWith('.js'));

const css = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');
const js = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sanjeevani Setu | ElderCare Connect</title>
    <meta name="description" content="Technology that cares for elders. A simple bridge between elder and caregiver with Phone-Based Reminders." />
    <meta property="og:title" content="Sanjeevani Setu | ElderCare Connect" />
    <meta property="og:description" content="Technology that cares for elders. A simple bridge between elder and caregiver with Phone-Based Reminders." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Caladea:ital,wght@0,400;0,700;1,400;1,700&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap" rel="stylesheet" />
    <style>
${css}
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module">
${js}
    </script>
  </body>
</html>`;

fs.writeFileSync(path.resolve(__dirname, 'standalone.html'), html, 'utf8');
console.log('✓ standalone.html successfully generated! Size:', Math.round(html.length / 1024), 'KB');
