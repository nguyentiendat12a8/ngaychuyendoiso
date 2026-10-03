import math
import re

svg_path = r'D:\CDSQG\Công việc ngày 1010\source\scratch\ring_graphic_final.svg'

with open(svg_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's inspect path d values
paths = re.findall(r'<path[^>]*id="([^"]+)"[^>]*d="([^"]+)"', content)

print("Found paths in SVG:")
for pid, d in paths:
    print(f"ID: {pid}")
    print(f"  d: {d}")

