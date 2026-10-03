import re

svg_path = r'D:\CDSQG\Công việc ngày 1010\BND Ngày CĐSQG 2026\bo-an-pham-2026-gop\01_bo-nhan-dien-chu-dao_7-artboard_1920x1080px_v01.svg'

with open(svg_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Let's print the exact SVG definitions of vong-1, vong-2, vong-3, doan-nhan, bieu-tuong-loi
for item_id in ['vong-cung', 'vong-1', 'vong-2', 'vong-3', 'doan-nhan', 'bieu-tuong-loi']:
    match = re.search(r'<[^>]*id="' + item_id + r'"[^>]*>', content)
    if match:
        print(f"Tag {item_id}: {match.group(0)}")

# Print style block fully
style_match = re.search(r'<style[^>]*>(.*?)</style>', content, re.DOTALL)
if style_match:
    print("\n--- STYLES ---")
    print(style_match.group(1))
