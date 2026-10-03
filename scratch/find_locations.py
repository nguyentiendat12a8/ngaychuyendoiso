import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'D:\CDSQG\Công việc ngày 1010\source\index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if re.search(r'(Hội trường|Trung tâm|maps\.google|bản đồ|Đông Anh|Hà Nội|Địa điểm|Location)', line, re.IGNORECASE):
        print(f"Line {i+1}: {line.strip()}")
