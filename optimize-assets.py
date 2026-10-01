"""One-time loss-aware asset conversion; originals remain available for editing."""
from pathlib import Path
import sys, re, base64, io, json
root = Path(__file__).resolve().parent
sys.path.insert(0, str(root / '.build-tools'))
from fontTools.ttLib import TTFont
from PIL import Image

css_path = root / 'assets/css/fonts.css'
css = css_path.read_text(encoding='utf-8')
for source in (root / 'assets/fonts').glob('*.ttf'):
    target = source.with_suffix('.woff2')
    font = TTFont(source)
    font.flavor = 'woff2'
    font.save(target)
    css = css.replace(source.name, target.name).replace("format('truetype')", "format('woff2')")
css_path.write_text(css, encoding='utf-8')

main_path = root / 'assets/js/main.js'
js = main_path.read_text(encoding='utf-8')
match = re.search(r"const FRAME_B64 = 'data:image/png;base64,([^']+)';", js)
if match:
    (root / 'assets/images/avatar-frame.png').write_bytes(base64.b64decode(match[1]))
    js = js.replace(match[0], "const FRAME_URL = 'assets/images/avatar-frame.png';")
    js = js.replace('frameImg.src = FRAME_B64;', '')
    # Install load callback before starting the image request (also works from cache).
    js = js.replace('        function initCanvas()', "        frameImg.src = FRAME_URL;\n\n        function initCanvas()", 1)

html_path = root / 'index.html'
html = html_path.read_text(encoding='utf-8-sig')
for source in (root / 'assets/images').glob('story-*.jpg'):
    image = Image.open(source)
    image.save(source.with_suffix('.webp'), 'WEBP', quality=80, method=6)
    html = html.replace(source.name, source.with_suffix('.webp').name)
    js = js.replace(source.name, source.with_suffix('.webp').name)

for name, max_size in [('logo.png', 512), ('logo-bca.png', 160), ('logo-moj.svg', 160)]:
    source = root / name
    if source.suffix == '.svg':
        data = re.search(r'data:image/(?:png|jpeg);base64,([^"\s]+)', source.read_text(encoding='utf-8'))
        if not data:
            continue
        image = Image.open(io.BytesIO(base64.b64decode(data[1])))
    else:
        image = Image.open(source)
    image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
    target = root / 'assets/images' / (source.stem + '.webp')
    image.save(target, 'WEBP', quality=90, method=6)
    html = html.replace('src="' + name + '"', 'src="assets/images/' + target.name + '"')

def image_attrs(match):
    tag = match[0]
    if 'id="modalImage"' in tag:
        return tag
    if 'decoding=' not in tag:
        tag = tag.replace('<img ', '<img decoding="async" ', 1)
    src = re.search(r'src="([^"]+)"', tag)
    if src and (src[1].startswith('assets/images/story-') or src[1].startswith('logo-') or 'assets/images/logo-bca' in src[1] or 'assets/images/logo-moj' in src[1] or 'qrserver.com' in src[1]):
        if 'loading=' not in tag:
            tag = tag.replace('<img ', '<img loading="lazy" ', 1)
    return tag
html = re.sub(r'<img\b[^>]*>', image_attrs, html)
html = html.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">\n    <meta name="build-version" content="local-assets-20261001-v2">', 1)
html_path.write_text(html, encoding='utf-8')
main_path.write_text(js, encoding='utf-8')
print('Converted fonts to WOFF2; optimized images; extracted avatar frame; enabled lazy image loading.')
