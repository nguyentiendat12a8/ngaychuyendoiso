"""Extract used bitmap assets without changing decoded image pixels."""
from pathlib import Path
import re, base64, hashlib, io, json
from PIL import Image
root = Path(__file__).resolve().parent
js_path = root / 'assets/js/main.js'
js = js_path.read_text(encoding='utf-8')
frame = re.search(r"const FRAME_URL = 'data:image/png;base64,([^']+)';", js)
results = {}
if frame:
    frame_bytes = base64.b64decode(frame[1])
    digest = hashlib.sha256(frame_bytes).hexdigest()[:12]
    relative = f'assets/images/avatar-frame-{digest}.png'
    (root / relative).write_bytes(frame_bytes)
    assert (root / relative).read_bytes() == frame_bytes
    js = js.replace(frame[0], f"const FRAME_URL = '{relative}';")
    js_path.write_text(js, encoding='utf-8')
    results['avatar'] = {'file': relative, 'bytes': len(frame_bytes), 'identical_bytes': True}

svg = (root / 'logo-most.svg').read_text(encoding='utf-8')
match = re.search(r'data:image/png;base64,([^"\s]+)', svg)
if match:
    source_bytes = base64.b64decode(match[1])
    original = Image.open(io.BytesIO(source_bytes)).convert('RGBA')
    assert original.width == original.height, 'Non-square SVG bitmap needs layout review'
    digest = hashlib.sha256(source_bytes).hexdigest()[:12]
    target = root / f'assets/images/logo-most-{digest}.webp'
    original.save(target, 'WEBP', lossless=True, exact=True, method=6)
    decoded = Image.open(target).convert('RGBA')
    assert original.size == decoded.size and original.tobytes() == decoded.tobytes(), 'Pixel mismatch'
    html_path = root / 'index.html'
    html = html_path.read_text(encoding='utf-8')
    uses = len(re.findall(r'src="logo-most.svg"', html))
    assert uses > 0, 'Logo not referenced; no change made'
    html = html.replace('src="logo-most.svg"', f'src="assets/images/{target.name}"')
    html_path.write_text(html, encoding='utf-8')
    results['logo'] = {'file': target.name, 'svg_bytes': len(svg.encode()), 'webp_bytes': target.stat().st_size, 'dimensions': original.size, 'identical_rgba_pixels': True, 'uses_preserved': uses}
print(json.dumps(results, ensure_ascii=False, indent=2))
