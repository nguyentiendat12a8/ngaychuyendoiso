import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

root_dir = r'D:\CDSQG\Công việc ngày 1010\source'

for root, dirs, files in os.walk(root_dir):
    if 'node_modules' in dirs:
        dirs.remove('node_modules')
    if 'dist' in dirs:
        dirs.remove('dist')
    for file in files:
        if file.endswith(('.html', '.js', '.json', '.txt', '.md', '.css', '.cjs')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                matches = re.finditer(r'(Hội trường|Hội nghị Quốc gia|Trung tâm Hội nghị)', content)
                for m in matches:
                    print(f"File {file} pos {m.start()}: {content[max(0, m.start()-40):min(len(content), m.end()+40)].replace('\n', ' ')}")
