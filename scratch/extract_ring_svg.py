import re

svg_path = r'D:\CDSQG\Công việc ngày 1010\BND Ngày CĐSQG 2026\bo-an-pham-2026-gop\01_bo-nhan-dien-chu-dao_7-artboard_1920x1080px_v01.svg'

with open(svg_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Find the group <g id="vong-cung"...>
pattern = r'(<g[^>]*id="vong-cung"[^>]*>.*?</g>)'
matches = re.findall(r'<g[^>]*id="vong-cung"[^>]*>.*?</g>', content, re.DOTALL)

print("Found vong-cung groups:", len(matches))
for i, m in enumerate(matches):
    print(f"--- Group {i} len={len(m)} ---")
    print(m[:500])
    print("...")

