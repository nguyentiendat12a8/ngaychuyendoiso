import os
import base64
import numpy as np
from PIL import Image, ImageEnhance

# 1. Source image
src_path = r'C:/Users/84878/.gemini/antigravity/brain/4b96544f-8307-41a9-aaed-9f5856461e31/.user_uploaded/media_1790932058276.png'
img = Image.open(src_path).convert('RGBA')

# 2. Clean outer white background & make transparent
arr = np.array(img)
r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]
h, w = arr.shape[:2]
cx, cy = w // 2, h // 2
radius = min(cx, cy) - 4

y, x = np.ogrid[:h, :w]
dist = np.sqrt((x - cx)**2 + (y - cy)**2)

# Make background outside logo circle transparent
outer_bg = (dist > radius) | ((r > 240) & (g > 240) & (b > 240) & (dist > (radius - 12)))
arr[outer_bg, 3] = 0

cleaned = Image.fromarray(arr)
bbox = cleaned.getbbox()
cropped = cleaned.crop(bbox)

# 3. High-Res Lanczos Upscaling to 1200x1200
hd_img = cropped.resize((1200, 1200), Image.Resampling.LANCZOS)
enhancer = ImageEnhance.Sharpness(hd_img)
hd_img = enhancer.enhance(1.3)

# 4. Save PNG & WebP
source_dir = r'D:\CDSQG\Công việc ngày 1010\source'
dist_dir = r'D:\CDSQG\Công việc ngày 1010\source\dist'

png_path = os.path.join(source_dir, 'logo-most.png')
webp_path = os.path.join(source_dir, 'assets/images/logo-most.webp')
dist_webp_path = os.path.join(dist_dir, 'assets/images/logo-most.webp')

os.makedirs(os.path.dirname(webp_path), exist_ok=True)
os.makedirs(os.path.dirname(dist_webp_path), exist_ok=True)

hd_img.save(png_path, 'PNG')
hd_img.save(webp_path, 'WEBP', quality=98)
hd_img.save(dist_webp_path, 'WEBP', quality=98)

# 5. Build SVG
with open(png_path, 'rb') as f:
    b64_data = base64.b64encode(f.read()).decode('utf-8')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 600 600" width="600" height="600">
  <title>Logo Bo Khoa hoc va Cong nghe (MOST)</title>
  <image width="600" height="600" xlink:href="data:image/png;base64,{b64_data}"/>
</svg>'''

svg_path = os.path.join(source_dir, 'logo-most.svg')
dist_svg_path = os.path.join(dist_dir, 'logo-most.svg')

with open(svg_path, 'w', encoding='utf-8') as f:
    f.write(svg_content)

with open(dist_svg_path, 'w', encoding='utf-8') as f:
    f.write(svg_content)

print("MOST logo updated successfully in high resolution.")
