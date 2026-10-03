import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

# Search index.html and js files for avatar code
for root, dirs, files in os.walk(r'D:\CDSQG\Công việc ngày 1010\source'):
    for file in files:
        if file.endswith(('.html', '.js')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                if 'downloadAvatar' in content or 'avatarCanvas' in content:
                    print(f"=== File: {file} ===")
                    lines = content.split('\n')
                    for i, line in enumerate(lines):
                        if any(k in line for k in ['downloadAvatar', 'uploadPhoto', 'avatarCanvas', 'downloadBtn', 'disabled', 'enable']):
                            print(f"  Line {i+1}: {line.strip()}")
