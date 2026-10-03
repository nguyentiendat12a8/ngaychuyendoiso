import fitz # PyMuPDF
from PIL import Image
import numpy as np
import base64
import os

logo_png_path = r'D:\CDSQG\Công việc ngày 1010\PNG ấn phẩm\LOGO PNG\LOGO_CDSQG.png'

with open(logo_png_path, 'rb') as f:
    logo_b64 = base64.b64encode(f.read()).decode('utf-8')

logo_data_uri = f"data:image/png;base64,{logo_b64}"

# SVG with viewBox="900 30 1400 1400" so NO CLIPPING happens at the top (y=30 is far above top of vong-1 at y=80!)
clean_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="900 30 1400 1400" width="1600" height="1600">
  <g id="vong-cung">
    <path id="vong-1" fill="none" stroke="#1B3E9C" stroke-width="48" stroke-linecap="round" d="M1361.7,258.7c177.4-131.6,428-94.4,559.6,83s94.4,428-83,559.6s-428,94.4-559.6-83c-60.5-81.6-87.7-183.1-76.1-284"/>
    <path id="vong-2" fill="none" stroke="#2F6BFF" stroke-width="48" stroke-linecap="round" d="M1361.7,748.7c-93.2-131.6-62-313.9,69.7-407s313.9-62,407,69.7c93.2,131.6,62,313.9-69.7,407c-56.9,40.2-126.3,58.8-195.6,52.4"/>
    <path id="vong-3" fill="none" stroke="#F7931E" stroke-width="48" stroke-linecap="round" d="M1655.4,755.5c-96.9,30.6-200.3-23.1-230.9-120s23.1-200.3,120-230.9c96.9-30.6,200.3,23.1,230.9,120c8.1,25.7,10.5,52.8,7,79.5"/>
    <path id="doan-nhan" fill="none" stroke="#FFC21A" stroke-width="48" stroke-linecap="round" d="M1230.3,427.3c13.5-32.6,31.2-63.2,52.6-91.2"/>
    <image width="1800" height="1800" id="bieu-tuong-loi" xlink:href="{logo_data_uri}" transform="matrix(0.1422 0 0 0.1422 1472 452)"/>
  </g>
</svg>"""

out_svg_path = r'D:\CDSQG\Công việc ngày 1010\source\scratch\ring_graphic_final.svg'
with open(out_svg_path, 'w', encoding='utf-8') as f:
    f.write(clean_svg)

doc = fitz.open(out_svg_path)
page = doc[0]
# Render high resolution 300 DPI transparent image
pix = page.get_pixmap(dpi=300, alpha=True)
tmp_png = r'D:\CDSQG\Công việc ngày 1010\source\scratch\tmp_ring.png'
pix.save(tmp_png)

# Open with PIL to auto-crop transparent padding nicely
img = Image.open(tmp_png)
bbox = img.getbbox() # get bounding box of non-transparent pixels
if bbox:
    # Add a 25px padding around bounding box
    pad = 25
    w, h = img.size
    crop_box = (max(0, bbox[0]-pad), max(0, bbox[1]-pad), min(w, bbox[2]+pad), min(h, bbox[3]+pad))
    img_cropped = img.crop(crop_box)
else:
    img_cropped = img

# Target file paths
target_png = r'D:\CDSQG\Công việc ngày 1010\source\assets\images\ring-graphic-transparent.png'
target_webp = r'D:\CDSQG\Công việc ngày 1010\source\assets\images\ring-graphic-transparent.webp'

img_cropped.save(target_png, 'PNG')
img_cropped.save(target_webp, 'WEBP', quality=100)

# Also update dist/ if it exists
dist_dir = r'D:\CDSQG\Công việc ngày 1010\source\dist\assets\images'
if os.path.exists(dist_dir):
    img_cropped.save(os.path.join(dist_dir, 'ring-graphic-transparent.png'), 'PNG')
    img_cropped.save(os.path.join(dist_dir, 'ring-graphic-transparent.webp'), 'WEBP', quality=100)

print("Saved finalized transparent ring graphics successfully with zero clipping.")
