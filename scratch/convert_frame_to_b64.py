import base64
import os

frame_path = r'D:\CDSQG\Công việc ngày 1010\source\assets\images\avatar-frame.png'

with open(frame_path, 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

data_uri = f"data:image/png;base64,{b64}"

print("Avatar frame size bytes:", os.path.getsize(frame_path))
print("Base64 string length:", len(data_uri))

# Write to a js module file or inline in main.js
with open(r'D:\CDSQG\Công việc ngày 1010\source\scratch\avatar_frame_b64.txt', 'w') as f:
    f.write(data_uri)

print("Saved base64 data URI successfully.")
