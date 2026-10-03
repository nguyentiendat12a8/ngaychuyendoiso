import re

svg_path = r'D:\CDSQG\Công việc ngày 1010\BND Ngày CĐSQG 2026\bo-an-pham-2026-gop\01_bo-nhan-dien-chu-dao_7-artboard_1920x1080px_v01.svg'

with open(svg_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Extract <style> block
styles = re.findall(r'<style[^>]*>(.*?)</style>', content, re.DOTALL)
if styles:
    print("--- STYLE BLOCK ---")
    for st in styles[0].split('\n'):
        if any(cls in st for cls in ['st20', 'st21', 'st22', 'st23', 'st24', 'st25', 'st26', 'vong', 'doan', 'bieu-tuong']):
            print(st.strip())

# Extract groups around vong-cung, doan-nhan, bieu-tuong-loi
tags = ['vong-cung', 'vong-1', 'vong-2', 'vong-3', 'doan-nhan', 'bieu-tuong-loi']
for tag in tags:
    matches = re.findall(r'<[^>]*id="' + tag + r'"[^>]*>.*?(?:</g>|</path>)', content, re.DOTALL)
    print(f"\n=== Tag: {tag} (matches={len(matches)}) ===")
    for m in matches[:2]:
        print(m[:400])

