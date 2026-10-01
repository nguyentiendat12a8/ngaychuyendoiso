# Landing page Ngày Chuyển đổi số quốc gia

Đây là bản đang phát triển, tiếp tục cập nhật nội dung và giao diện.

## Chỉnh sửa

- Nội dung, cấu trúc trang: `index.html`.
- CSS tùy chỉnh: `styles/tailwind.css` (sau ba dòng `@tailwind`).
- Màu, font, animation của Tailwind: `tailwind.config.cjs`.
- Countdown, avatar, bài viết, tab: `assets/js/main.js`.
- Carousel, menu: `assets/js/carousels.js`.
- Ảnh câu chuyện: `assets/images/`; logo và khung avatar giữ vị trí cũ.

Sau khi thêm/sửa class Tailwind trong HTML hoặc JavaScript, hoặc sửa CSS/config, chạy tại thư mục này:

```sh
npm ci
npm run build
```

`npm ci` chỉ cần chạy khi cài lần đầu hoặc khi dependency thay đổi. Commit cả CSS đã build và `package-lock.json`. Máy chủ chỉ phục vụ file tĩnh, không cần Node.js.

## Xuất bản

Đưa `index.html`, thư mục `assets/`, logo, favicon và ảnh khung lên hosting, giữ nguyên đường dẫn tương đối. Nếu dùng GitHub Pages, đặt nội dung thư mục này tại gốc repository và chọn xuất bản từ gốc. `.nojekyll` cho phép phục vụ trực tiếp file tĩnh. Không tải `node_modules/` lên hosting.

## Tài nguyên đóng gói

Tailwind CSS 3.4.17 (build tại máy); Font Awesome Free 6.4.0; AOS 2.3.4; Splide 4.1.4; Splide Auto Scroll 0.4.2; font Be Vietnam Pro và năm ảnh Unsplash đã dùng trong bản gốc. Các tài nguyên chạy từ đường dẫn nội bộ; giữ thông tin giấy phép của thư viện khi phân phối.

`package-assets.cjs` là script chuyển đổi bản CDN ban đầu, không chạy lại để cập nhật nội dung. Những lần sửa tiếp theo dùng `npm run build`.

QR và liên kết đăng ký hiện giữ nguyên bản nháp, sẽ cập nhật sau. QR vẫn dùng dịch vụ ngoài. Các liên kết bản đồ và website liên hệ vẫn dẫn ra ngoài.

Trước bản chính thức cần kiểm thử trình duyệt, thiết bị di động, tạo avatar, các liên kết và thay URL chia sẻ Open Graph bằng URL tuyệt đối của tên miền thật.
