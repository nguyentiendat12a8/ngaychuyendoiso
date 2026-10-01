const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const htmlPath = path.join(root, 'index.html');
async function download(url, relative) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, Buffer.from(await response.arrayBuffer()));
}
async function main() {
  let html = fs.readFileSync(htmlPath, 'utf8');
  if (!html.includes('cdn.tailwindcss.com')) throw new Error('Assets already packaged; use npm run build for later edits.');
  fs.mkdirSync(path.join(root, 'styles'), { recursive: true });
  const config = html.match(/<script>\s*tailwind.config = ([\s\S]*?)<\/script>/);
  fs.writeFileSync(path.join(root, 'tailwind.config.cjs'), 'module.exports = ' + config[1].trim() + ';\nmodule.exports.content = ["./index.html", "./assets/js/*.js"];\n');
  html = html.replace(config[0], '');
  const styles = [];
  html = html.replace(/<style>([\s\S]*?)<\/style>/g, (_, css) => { styles.push(css); return ''; });
  fs.writeFileSync(path.join(root, 'styles/tailwind.css'), '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n' + styles.join('\n'));
  const assets = [
    ['https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', 'assets/vendor/fontawesome/css/all.min.css'],
    ['https://unpkg.com/aos@2.3.4/dist/aos.css', 'assets/vendor/aos/aos.css'],
    ['https://unpkg.com/aos@2.3.4/dist/aos.js', 'assets/vendor/aos/aos.js'],
    ['https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css', 'assets/vendor/splide/splide.min.css'],
    ['https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js', 'assets/vendor/splide/splide.min.js'],
    ['https://cdn.jsdelivr.net/npm/@splidejs/splide-extension-auto-scroll@0.4.2/dist/js/splide-extension-auto-scroll.min.js', 'assets/vendor/splide/splide-extension-auto-scroll.min.js']
  ];
  for (const [url, local] of assets) {
    await download(url, local);
    html = html.replaceAll(url, local).replaceAll(url.replace('aos@2.3.4', 'aos@next'), local);
  }
  const fa = fs.readFileSync(path.join(root, assets[0][1]), 'utf8');
  for (const name of new Set([...fa.matchAll(/\.\.\/webfonts\/([^)'"\s]+)/g)].map(m => m[1]))) {
    await download('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/' + name, 'assets/vendor/fontawesome/webfonts/' + name);
  }
  const fontUrl = 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap';
  const fontResponse = await fetch(fontUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!fontResponse.ok) throw new Error('Font download failed');
  let fontCss = await fontResponse.text();
  let fontIndex = 0;
  for (const url of new Set([...fontCss.matchAll(/url\((https:[^)]+)\)/g)].map(m => m[1]))) {
    const name = 'be-vietnam-pro-' + (++fontIndex) + path.extname(new URL(url).pathname);
    await download(url, 'assets/fonts/' + name);
    fontCss = fontCss.replaceAll(url, '../fonts/' + name);
  }
  fs.mkdirSync(path.join(root, 'assets/css'), { recursive: true });
  fs.writeFileSync(path.join(root, 'assets/css/fonts.css'), fontCss);
  html = html.replace(/<link[^>]+(?:fonts.googleapis.com|fonts.gstatic.com)[^>]*>/g, '');
  html = html.replace('<script src="https://cdn.tailwindcss.com"></script>', '<link rel="stylesheet" href="assets/css/fonts.css">\n    <link rel="stylesheet" href="assets/css/tailwind.min.css">');
  let photoIndex = 0;
  for (const url of new Set([...html.matchAll(/https:\/\/images.unsplash.com\/[^"\s]+/g)].map(m => m[0]))) {
    const local = 'assets/images/story-' + (++photoIndex) + '.jpg';
    const imageUrl = new URL(url); imageUrl.searchParams.set('fm', 'jpg');
    await download(imageUrl.href, local);
    html = html.replaceAll(url, local);
  }
  let scriptIndex = 0;
  fs.mkdirSync(path.join(root, 'assets/js'), { recursive: true });
  html = html.replace(/<script>([\s\S]*?)<\/script>/g, (_, js) => {
    const local = 'assets/js/page-' + (++scriptIndex) + '.js';
    fs.writeFileSync(path.join(root, local), js.trim() + '\n');
    return '<script src="' + local + '"></script>';
  });
  html = html.replace('<!-- Tailwind CSS CDN -->', '<!-- Local compiled styles; rebuild with npm run build after edits -->');
  fs.writeFileSync(htmlPath, html);
  console.log('Packaged libraries, fonts, story images and page scripts. QR unchanged.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
