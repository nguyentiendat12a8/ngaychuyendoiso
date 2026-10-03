const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = __dirname;
const out = path.join(root, 'dist');
// Refuse accidental reintroduction of large bitmap payloads into page logic.
const mainSource = fs.readFileSync(path.join(root, 'assets/js/main.js'), 'utf8');
if (/data:image\/[^;]+;base64,[A-Za-z0-9+/=]{100000}/.test(mainSource)) {
  throw new Error('Large Base64 image in main.js: keep the image in assets/images and reference its path.');
}
fs.mkdirSync(out, { recursive: true });
// Refuse stale narration after article edits; audio is generated ahead of deploy.
const audioManifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/audio/manifest.json'), 'utf8'));
const storySource = mainSource.split('const articlesData = {')[1].split('function openArticleModal')[0];
const storyMatches = [...storySource.matchAll(/title:\s*"([^"]+)"[\s\S]*?content:\s*`([^`]+)`/g)];
if (storyMatches.length !== 5) throw new Error('Review narration manifest for the updated article structure.');
storyMatches.forEach((match, index) => {
  const input = (match[1] + '\n' + match[2]).replace(/\r\n/g, '\n');
  const hash = crypto.createHash('sha256').update(input).digest('hex');
  if (audioManifest.tracks[index + 1]?.contentHash !== hash) {
    throw new Error(`Story ${index + 1} audio is stale: regenerate narration before deploying.`);
  }
});
fs.writeFileSync(path.join(root, 'assets/js/story-audio-data.js'),
  'window.storyAudioTracks = ' + JSON.stringify(audioManifest.tracks, null, 2) + ';\n');
// Generate an offline-only companion from the same frame bytes. Online users
// never request it; keeping it separate avoids bloating main.js again.
const framePath = mainSource.match(/const FRAME_URL = '([^']+)'/)[1];
const frameData = fs.readFileSync(path.join(root, framePath)).toString('base64');
fs.writeFileSync(path.join(root, 'assets/js/avatar-frame.local.js'),
  'window.__loadLocalAvatarFrame("data:image/png;base64,' + frameData + '");\n');
const included = new Set();
function include(relative) {
  relative = relative.split(/[?#]/)[0].replace(/\\/g, '/');
  if (!relative || /^(https?:|data:|mailto:|#)/.test(relative)) return;
  const target = path.resolve(root, relative);
  if (!target.startsWith(root + path.sep)) throw new Error('Invalid asset: ' + relative);
  if (included.has(relative)) return;
  if (!fs.existsSync(target)) throw new Error('Missing asset: ' + relative);
  included.add(relative);
  const destination = path.join(out, relative);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(target, destination);
  if (/\.html$/.test(relative)) {
    for (const m of fs.readFileSync(target, 'utf8').matchAll(/(?:src|href)="([^"]+)"/g)) {
      if (!/^(?:https?:|data:)/.test(m[1]) && /\.(?:css|js|png|jpg|webp|svg)(?:[?#].*)?$/.test(m[1])) {
        include(m[1].startsWith('/') ? m[1].slice(1) : path.join(path.dirname(relative), m[1]));
      }
    }
  }
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
// Pages reads _headers from the output root; 404.html disables SPA fallback.
// Missing configuration must fail the build instead of silently losing protection.
include('404.html');
// Source uses relative URLs for file:// previews. The deployed error page
// needs root URLs because Pages can serve it at any missing nested route.
const errorPage = fs.readFileSync(path.join(root, '404.html'), 'utf8')
  .replace(/((?:src|href)=")((?:assets\/|favicon\.png)[^"]*)"/g, '$1/$2"')
  .replace('href="index.html"', 'href="/"');
fs.writeFileSync(path.join(out, '404.html'), errorPage);
include('_headers');
fs.writeFileSync(path.join(out, '.nojekyll'), '');
const bytes = [...included].reduce((sum, file) => sum + fs.statSync(path.join(root, file)).size, Buffer.byteLength(html));
console.log(`Deploy bundle: ${included.size + 1} files, ${(bytes / 1024 / 1024).toFixed(2)} MiB (not all loaded at once).`);
