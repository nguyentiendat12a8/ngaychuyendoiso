import re

svg_path = r'D:\CDSQG\Công việc ngày 1010\source\scratch\ring_graphic_final.svg'

with open(svg_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Inspect SVG path coordinates
paths = re.findall(r'<path[^>]*d="([^"]+)"', content)

# Extract all numbers from d strings to find min/max x and y
all_coords = []
for d in paths:
    nums = [float(n) for n in re.findall(r'-?\d+\.?\d*', d)]
    # Coordinates come in x, y pairs
    # Note: relative commands might exist, but in our SVG M1361.7,258.7c... numbers are mostly relative/absolute
    print(f"Path nums count: {len(nums)}")

# Let's measure center at (1600, 580)
# Radius of vong-1 is ~ 470
# Center X = 1600, Center Y = 580
# Min X = 1600 - 490 = 1110, Max X = 1600 + 490 = 2090
# Min Y = 580 - 490 = 90, Max Y = 580 + 490 = 1070
# Width = 2090 - 1110 = 980, Height = 1070 - 90 = 980

# So viewBox="1080 60 1040 1040" fits the circle graphic with 30px padding!
print("Recommended viewBox: 1080 60 1040 1040")
