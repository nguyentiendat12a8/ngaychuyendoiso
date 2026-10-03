import re
import os

svg_path = r'D:\CDSQG\Công việc ngày 1010\BND Ngày CĐSQG 2026\bo-an-pham-2026-gop\01_bo-nhan-dien-chu-dao_7-artboard_1920x1080px_v01.svg'

with open(svg_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

print("SVG File size:", len(content))
ids = re.findall(r'id="([^"]+)"', content)
print("Found IDs count:", len(ids))
print("First 30 IDs:", ids[:30])

# Check for path tags, circle tags, arc tags, or embedded images
paths = re.findall(r'<path[^>]+>', content)
print("Path count:", len(paths))
images = re.findall(r'<image[^>]+>', content)
print("Embedded image count:", len(images))
