# Landing page Ngày Chuyển đổi số quốc gia

Đây là bản đang phát triển, tiếp tục cập nhật nội dung và giao diện.

## Chỉnh sửa

- Nội dung, cấu trúc trang: `index.html`.
- CSS tùy chỉnh: `styles/tailwind.css` (sau ba dòng `@tailwind`).
- Màu, font, animation của Tailwind: `tailwind.config.cjs`.
- Countdown, avatar, thông tin thẻ bài viết và tab: `assets/js/main.js`.
- Nội dung đầy đủ của 60 bài nằm trong `assets/data/stories/`; mỗi tệp chỉ được tải khi người dùng mở đúng bài đó.
- Carousel, menu: `assets/js/carousels.js`.
- Ảnh câu chuyện: `assets/images/`; logo và khung avatar giữ vị trí cũ.

Sau khi thêm/sửa class Tailwind trong HTML hoặc JavaScript, hoặc sửa CSS/config, chạy tại thư mục này:

```sh
npm ci
npm run build
```

`npm ci` chỉ cần chạy khi cài lần đầu hoặc khi dependency thay đổi. Commit cả CSS đã build và `package-lock.json`. Máy chủ chỉ phục vụ file tĩnh, không cần Node.js.

Build tạo `assets/css/site.min.css` từ font, Tailwind, Font Awesome, AOS và Splide theo đúng thứ tự cũ. Trang tải một file CSS; không bỏ quy tắc hoặc biểu tượng đang sử dụng. Đường dẫn font được đổi tương ứng và Font Awesome dùng `font-display: swap`. Sửa CSS ở file nguồn, sau đó build lại, không sửa trực tiếp bundle.

Logo gốc `assets/images/logo.webp` được giữ lại. Các bản 128/256/400px phục vụ các kích thước hiển thị nhỏ; HTML dùng `srcset` cho ảnh và build lấy đủ các ứng viên. Khi thay logo gốc, cần tạo lại các bản kích thước này. Meta description ở đầu `index.html` có thể sửa cùng nội dung sự kiện.

## Xuất bản

Chạy `npm run build`, sau đó đưa **nội dung thư mục `dist/`** lên hosting. Script chỉ lấy những tài nguyên trang thực sự tham chiếu, giữ nguyên đường dẫn tương đối và thêm mã phiên bản CSS/JS. Không tải `node_modules/`, `.build-tools/` hoặc các công cụ build lên hosting.

Với Vercel: đặt **Root Directory** đúng thư mục chứa `package.json` và `vercel.json` (nếu repository chứa thư mục `source`, chọn `source`). Build Command: `npm run build`; Output Directory: `dist`. Cấu hình này đã được lưu trong `vercel.json`. Sau deploy, xem source trang: phải có `build-version=local-assets-20261001-v2`, `assets/css/site.min.css`, ảnh `story-*.webp`; không còn Tailwind CDN hoặc Google Fonts. Nếu repository còn một `index.html` khác ở gốc, không chọn nhầm nó làm trang xuất bản.

## Tài nguyên đóng gói

Tailwind CSS 3.4.17 (build tại máy); Font Awesome Free 6.4.0; AOS 2.3.4; Splide 4.1.4; Splide Auto Scroll 0.4.2; font Be Vietnam Pro và năm ảnh Unsplash đã dùng trong bản gốc. Các tài nguyên chạy từ đường dẫn nội bộ; giữ thông tin giấy phép của thư viện khi phân phối.

`package-assets.cjs` là script chuyển đổi bản CDN ban đầu, không chạy lại để cập nhật nội dung. Những lần sửa tiếp theo dùng `npm run build`.

Font hiện dùng WOFF2 đầy đủ bộ ký tự từ font gốc, không cắt theo nội dung hiện tại để tránh thiếu dấu khi cập nhật. Ảnh minh họa và logo hiển thị dùng WebP; các file gốc giữ lại để chỉnh sửa. Khung avatar giữ nguyên PNG gốc, tách khỏi JavaScript để tải/cache riêng. `optimize-assets.py` là công cụ chuyển đổi ban đầu, không thuộc quy trình build thường ngày và không cần Python trên Vercel.

QR đăng ký dùng nguyên ảnh được cung cấp, lưu tại `assets/images/registration-qr.jpg`. Ảnh và nút đăng ký cùng dẫn đến URL giải mã từ QR: `https://q.me-qr.com/qhn68xfc`. Không gọi dịch vụ tạo QR ngoài khi tải trang. Đây là URL trung gian ME-QR; cần kiểm tra trên điện thoại rằng đích chuyển tiếp là biểu mẫu chính thức trước khi công bố. Các liên kết bản đồ và website liên hệ vẫn dẫn ra ngoài.

## Giữ tài nguyên khi cập nhật

Mở trực tiếp `index.html` bằng `file://` vẫn hỗ trợ tải avatar: build tạo `assets/js/avatar-frame.local.js` từ đúng ảnh khung, chỉ nạp file này khi xem local để Canvas không bị khóa xuất ảnh. Khi chạy HTTP/HTTPS, trang chỉ tải PNG riêng và không tải script Base64 này. Commit file companion cùng các tài nguyên; sau khi đổi khung chạy lại `npm run build`.

Khung avatar hiện dùng `assets/images/avatar-frame-final.png`, được thu từ file thiết kế duyệt `02. Avatar frame final.png` về đúng kích thước canvas 800×800 và giữ kênh trong suốt. Logo Bộ Khoa học và Công nghệ giữ bản nguồn lossless tại `assets/images/logo-most-4f8d4d809f3f.webp`; giao diện dùng bản 256 px `assets/images/logo-most-256.webp` tại 6 vị trí để giảm dung lượng tải. `logo-most.svg` gốc vẫn còn để chỉnh sửa. Không dán lại chuỗi Base64 lớn vào `main.js`: build sẽ báo lỗi để tránh tái phát. Khi thay khung/logo, thêm file mới và cập nhật đường dẫn tương ứng, giữ bản gốc. `fix-embedded-assets.py` là công cụ chuyển đổi một lần, không cần chạy trong build.

Trước bản chính thức cần kiểm thử trình duyệt, thiết bị di động, tạo avatar, các liên kết và thay URL chia sẻ Open Graph bằng URL tuyệt đối của tên miền thật.

## Cloudflare Pages: 404 và header phòng vệ

Cloudflare Pages: Root Directory là thư mục chứa `package.json` (thường là `source`), Build Command `npm run build`, Build output directory `dist`. Commit `404.html`, `_headers`, `assets/css/404.css`, ảnh QR mới và các sửa đổi build/index/README. Không commit `.build-tools/` hoặc `dist/`.

Build tự đưa `404.html`, CSS của trang lỗi và `_headers` vào gốc `dist`. `source/404.html` dùng đường dẫn tương đối để mở offline bằng `file://`, nút Về trang chủ mở `index.html`. Build chuyển đường dẫn trong `dist/404.html` thành đường dẫn bắt đầu bằng `/` để hoạt động khi URL sai có nhiều cấp; bản `dist` dành cho web hosting, xem offline thì mở bản trong source. Trên Pages, top-level `404.html` tắt mặc định trả landing page cho mọi URL không tồn tại. Nếu sau này thêm client-side routing, cần xem lại hành vi này.

Header đang áp dụng: `nosniff`, `SAMEORIGIN` (không cho site khác nhúng iframe), referrer `strict-origin-when-cross-origin`, tắt quyền camera/micro/vị trí và HSTS 1 ngày. HSTS chưa có `includeSubDomains` hoặc `preload`; chỉ tăng thời hạn khi đã kiểm tra HTTPS và phương án dự phòng. Các header được Pages áp dụng cho phản hồi tĩnh; mở `file://` không thử được header, máy chủ static thông thường cũng không tự đọc `_headers`.

CSP **chỉ Report-Only**, không có CSP cưỡng chế chặn. Cho phép script nội bộ và Cloudflare Web Analytics, ảnh nội bộ/data/blob, font nội bộ và CSS inline vì trang/carousel còn dùng. QR là ảnh nội bộ; link ra ME-QR/Google Maps là điều hướng, không cần thêm chúng vào nguồn tải script/ảnh. Canvas không cần quyền camera; chọn ảnh từ máy vẫn hoạt động.

`script-src-attr 'none'` cố ý báo các handler inline đang có; không xóa handler hoặc chuyển sang chặn trước khi thay bằng event listener và kiểm thử. Không thêm `'unsafe-inline'` vào script chỉ để làm mất cảnh báo. Không có endpoint báo cáo trung tâm: quan sát Console của trình duyệt, chưa có thu thập báo cáo từ toàn bộ người truy cập. Nếu cần, triển khai endpoint riêng trước khi thêm `report-to`/`report-uri`; không trỏ báo cáo vào đường dẫn chưa tồn tại.

Sau deploy:

1. DevTools → Network → chọn document → Response Headers: phải thấy `Content-Security-Policy-Report-Only` cùng header phòng vệ; không được có CSP cưỡng chế ngoài ý muốn từ cấu hình khác.
2. Mở URL không tồn tại, ví dụ `/kiem-tra-404/khong-ton-tai`: nhận HTTP **404**, hiện trang lỗi và bấm Về trang chủ được. Kiểm tra `/.env` và `/.git/config` cũng 404; 404 không thay thế việc loại bỏ bí mật khỏi bản deploy.
3. Mở Console, bật Preserve log rồi thử menu mobile, tab sự kiện, popup bài viết, carousel, chọn ảnh, zoom, tải avatar và QR/nút đăng ký. Cảnh báo Report-Only của onclick hiện là dự kiến; ghi lại vi phạm tài nguyên hoặc script khác trước khi chỉnh allowlist. Kiểm tra Chrome/Edge, Safari iPhone và Chrome Android.
4. Chỉ chuyển thành `Content-Security-Policy` sau khi xử lý handler inline, kiểm thử mọi luồng và các script Cloudflare thực tế. Đánh giá riêng các directive còn nới lỏng (CSS inline), không coi CSP hiện tại là hoàn tất chống XSS. Giữ bản deploy trước để rollback nếu có lỗi.

Không tạo Cache Everything hoặc chỉnh thời gian cache trong thay đổi này. Các header trên không thay thế WAF, chống DDoS hoặc bài kiểm thử tải.

## Nghe 5 câu chuyện

Popup chi tiết có nút Nghe bài viết và thanh phát/tạm dừng/tua cạnh nhãn chủ đề. Không có ô chọn tốc độ riêng hoặc dòng trạng thái hiển thị; trạng thái vẫn được thông báo cho trình đọc màn hình. Giọng Microsoft Hoài My, tốc độ tạo -5%, đọc tiêu đề và toàn bộ nội dung. Âm thanh tạo trước bằng `edge-tts` như mẫu đã duyệt, không dùng tài khoản FPT. Khách truy cập chỉ tải MP3 nội bộ, không gửi nội dung hay gọi API TTS. Không tự phát hoặc đặt src khi mở popup (`preload="none"`); chỉ bắt đầu tải khi bấm Nghe. Đóng popup/Escape/đổi bài dừng và gỡ nguồn âm thanh. Không có bản đọc thì phần nghe ẩn, nội dung bài vẫn hiển thị.

Commit toàn bộ `assets/audio/*.mp3`, `assets/audio/manifest.json`, `assets/js/story-audio-data.js`, `assets/js/story-audio.js`, `generate-story-audio.py`, cùng index/main/build/CSS/header đã sửa. CSP Report-Only có `media-src 'self'`.

Sau khi sửa tiêu đề/nội dung bài, build sẽ báo bản đọc không còn khớp. Tạo lại trên máy biên tập (không chạy trong Cloudflare build):

```sh
python -m pip install --target .build-tools edge-tts mutagen
python generate-story-audio.py
npm run build
```

Máy tạo âm thanh cần Python và Internet. Công cụ chỉ tạo bài thay đổi, giữ MP3 có cùng nội dung/giọng/tốc độ; tên file có mã phiên bản để tránh cache bản cũ. Manifest lưu dấu vết nội dung và thời lượng, build kiểm tra khớp với 5 bài. Thư mục `.build-tools` đã được bỏ qua bởi Git. Không đưa Python/API key lên hosting. Thư viện cộng đồng edge-tts dùng dịch vụ đọc của Edge, không phải API Azure có hợp đồng/SLA; nếu dịch vụ thay đổi, có thể thay bằng MP3 FPT/Viettel được duyệt và cập nhật manifest trước khi build.

Kiểm tra trước công bố: nghe đủ 5 bài để duyệt phát âm viết tắt/tên riêng/số liệu; thử phát, tạm dừng, tua, tốc độ, đóng/mở và chuyển bài trên Chrome/Edge và điện thoại iOS/Android. Kiểm tra Network: mở popup chưa tải MP3, bấm nghe mới có yêu cầu; source mở file:// cũng phát được MP3 local. Nếu mạng lỗi, thông báo không tải được âm thanh, người xem vẫn đọc được bài. Chưa có đồng bộ highlight từng từ.
