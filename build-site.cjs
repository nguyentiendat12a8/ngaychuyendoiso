const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = __dirname;
const out = path.join(root, 'dist');
fs.mkdirSync(out, { recursive: true });
const included = new Set();
function include(relative) {
  relative = relative.split(/[?#]/)[0];
  if (!relative || /^(https?:|data:|mailto:|#)/.test(relative)) return;
  const target = path.resolve(root, relative);
  if (!target.startsWith(root + path.sep)) throw new Error('Invalid asset: ' + relative);
  if (included.has(relative)) return;
  if (!fs.existsSync(target)) throw new Error('Missing asset: ' + relative);
  included.add(relative);
  const destination = path.join(out, relative);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(target, destination);
  if (/\.css$/.test(relative)) {
    const css = fs.readFileSync(target, 'utf8');
    for (const m of css.matchAll(/url\(([^)]+)\)/g)) {
      const url = m[1].replace(/["']/g, '');
      if (/^(data:|https?:)/.test(url)) continue;
      include(path.join(path.dirname(relative), url));
    }
  }
  if (/\.js$/.test(relative) && relative.startsWith('assets/js/')) {
    for (const m of fs.readFileSync(target, 'utf8').matchAll(/['"](assets\/[\w./-]+)['"]/g)) include(m[1]);
  }
}
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const m of html.matchAll(/(?:src|href|content)="([^"]+)"/g)) {
  if (/\.(?:css|js|png|jpg|webp|svg)(?:[?#].*)?$/.test(m[1])) include(m[1]);
}
// HTML always revalidates; changed CSS/JS gets a fresh URL after each build.
html = html.replace(/((?:src|href)=")([^"?]+\.(?:js|css))"/g, (_, start, relative) => {
  if (/^https?:/.test(relative)) return start + relative + '"';
  const hash = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, relative))).digest('hex').slice(0, 12);
  return start + relative + '?v=' + hash + '"';
});
fs.writeFileSync(path.join(out, 'index.html'), html);
fs.writeFileSync(path.join(out, '.nojekyll'), '');
const bytes = [...included].reduce((sum, file) => sum + fs.statSync(path.join(root, file)).size, Buffer.byteLength(html));
console.log(`Deploy bundle: ${included.size + 1} files, ${(bytes / 1024 / 1024).toFixed(2)} MiB (not all loaded at once).`);
