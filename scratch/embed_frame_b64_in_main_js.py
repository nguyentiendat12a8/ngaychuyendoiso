import os

js_path = r'D:\CDSQG\Công việc ngày 1010\source\assets\js\main.js'
b64_path = r'D:\CDSQG\Công việc ngày 1010\source\scratch\avatar_frame_b64.txt'

with open(b64_path, 'r', encoding='utf-8') as f:
    b64_data = f.read().strip()

with open(js_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace const FRAME_URL = 'assets/images/avatar-frame.png'; with base64 data URI
target = "const FRAME_URL = 'assets/images/avatar-frame.png';"
replacement = f"const FRAME_URL = '{b64_data}';"

if target in content:
    content_updated = content.replace(target, replacement)
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(content_updated)
    print("Embedded avatar-frame base64 into main.js successfully!")
else:
    print("Target string not found in main.js")
