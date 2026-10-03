import base64

logo_png_path = r'D:\CDSQG\Công việc ngày 1010\PNG ấn phẩm\LOGO PNG\LOGO_CDSQG.png'

with open(logo_png_path, 'rb') as f:
    logo_b64 = base64.b64encode(f.read()).decode('utf-8')

logo_data_uri = f"data:image/png;base64,{logo_b64}"

svg_animated_markup = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="900 30 1400 1400" width="100%" height="100%" class="w-full h-full object-contain filter drop-shadow-[0_10px_30px_rgba(47,107,255,0.35)]">
  <g id="vong-cung">
    <!-- Outer Dark Blue Ring (Vòng 1) -->
    <path id="vong-1" class="ring-vong-1" fill="none" stroke="#1B3E9C" stroke-width="48" stroke-linecap="round" d="M1361.7,258.7c177.4-131.6,428-94.4,559.6,83s94.4,428-83,559.6s-428,94.4-559.6-83c-60.5-81.6-87.7-183.1-76.1-284"/>
    <!-- Middle Bright Blue Ring (Vòng 2) -->
    <path id="vong-2" class="ring-vong-2" fill="none" stroke="#2F6BFF" stroke-width="48" stroke-linecap="round" d="M1361.7,748.7c-93.2-131.6-62-313.9,69.7-407s313.9-62,407,69.7c93.2,131.6,62,313.9-69.7,407c-56.9,40.2-126.3,58.8-195.6,52.4"/>
    <!-- Inner Orange Ring (Vòng 3) -->
    <path id="vong-3" class="ring-vong-3" fill="none" stroke="#F7931E" stroke-width="48" stroke-linecap="round" d="M1655.4,755.5c-96.9,30.6-200.3-23.1-230.9-120s23.1-200.3,120-230.9c96.9-30.6,200.3,23.1,230.9,120c8.1,25.7,10.5,52.8,7,79.5"/>
    <!-- Yellow Pill Accent -->
    <path id="doan-nhan" class="ring-doan-nhan" fill="none" stroke="#FFC21A" stroke-width="48" stroke-linecap="round" d="M1230.3,427.3c13.5-32.6,31.2-63.2,52.6-91.2"/>
    <!-- Core Emblem Logo -->
    <g class="ring-core-logo" style="transform-origin: 1600px 580px;">
      <image width="1800" height="1800" id="bieu-tuong-loi" xlink:href="{logo_data_uri}" transform="matrix(0.1422 0 0 0.1422 1472 452)"/>
    </g>
  </g>
</svg>"""

with open(r'D:\CDSQG\Công việc ngày 1010\source\scratch\svg_markup.html', 'w', encoding='utf-8') as f:
    f.write(svg_animated_markup)

print("Generated SVG markup successfully")
