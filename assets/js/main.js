AOS.init({ once: true, duration: 1200 });

        // Countdown (Đếm ngược 24/7 đến Ngày Chuyển đổi số Quốc gia 10/10/2026)
        const targetDate = new Date('2026-10-10T00:00:00+07:00').getTime();

        function updateCountdown() {
            const now = new Date().getTime();
            const difference = targetDate - now;
            const titleEl = document.getElementById('countdownTitle');

            if (difference > 0) {
                if (titleEl) titleEl.classList.remove('hidden');
                const daysEl = document.getElementById('days');
                const hoursEl = document.getElementById('hours');
                const minutesEl = document.getElementById('minutes');
                const secondsEl = document.getElementById('seconds');
                if (daysEl) daysEl.innerText = String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0');
                if (hoursEl) hoursEl.innerText = String(Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
                if (minutesEl) minutesEl.innerText = String(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
                if (secondsEl) secondsEl.innerText = String(Math.floor((difference % (1000 * 60)) / 1000)).padStart(2, '0');
            } else {
                if (titleEl) titleEl.classList.add('hidden');
                const containerEl = document.getElementById('countdownContainer');
                if (containerEl && !containerEl.classList.contains('expired-active')) {
                    containerEl.classList.add('expired-active');
                    containerEl.className = 'w-full expired-active';
                    containerEl.innerHTML = `
                        <div class="w-full bg-gradient-to-r from-[#FFC21A] via-[#F7931E] to-[#FFC21A] text-[#0B1B4D] font-black p-4 sm:p-5 rounded-2xl text-center shadow-2xl border border-white/40">
                            <div class="text-sm sm:text-lg flex items-center justify-center gap-1.5 sm:gap-2 uppercase tracking-wider font-black mb-1.5 leading-tight">
                                <span class="text-base sm:text-xl">🎉</span>
                                <span class="whitespace-normal">CHÀO MỪNG NGÀY CHUYỂN ĐỔI SỐ QUỐC GIA 10/10</span>
                                <span class="text-base sm:text-xl">🎉</span>
                            </div>
                            <span class="text-xs sm:text-sm font-bold text-[#0B1B4D]/90 block leading-relaxed">Hành động cùng Chuyển đổi số Quốc gia – Nâng cao hiệu quả quản trị và tạo giá trị thực cho Người dân!</span>
                        </div>
                    `;
                }
            }
        }
        setInterval(updateCountdown, 1000);
        updateCountdown();

        // Counter-Up Animation
        const counterElements = document.querySelectorAll('.counter-val');
        let counterAnimated = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counterAnimated) {
                    counterAnimated = true;
                    counterElements.forEach(counter => {
                        const rawTarget = counter.getAttribute('data-target');
                        const target = parseFloat(rawTarget);
                        const isFloat = rawTarget.includes('.');
                        const decimals = isFloat ? (rawTarget.split('.')[1] || '').length : 0;
                        let count = 0;
                        const increment = target / 45;
                        const formatter = new Intl.NumberFormat('vi-VN', {
                            minimumFractionDigits: decimals,
                            maximumFractionDigits: decimals
                        });
                        const updateCount = () => {
                            count += increment;
                            if (count < target) {
                                const current = isFloat ? Number(count.toFixed(decimals)) : Math.ceil(count);
                                counter.innerText = formatter.format(current);
                                setTimeout(updateCount, 45);
                            } else {
                                counter.innerText = formatter.format(target);
                            }
                        };
                        updateCount();
                    });
                }
            });
        }, { threshold: 0.15 });
        const metricsSection = document.getElementById('ket-qua');
        if (metricsSection) observer.observe(metricsSection);

        // Logo Explanation Toggle
        const toggleExplanationBtn = document.getElementById('toggleExplanationBtn');
        const identityExplanationBox = document.getElementById('identityExplanationBox');
        const explanationBtnText = document.getElementById('explanationBtnText');
        const explanationChevron = document.getElementById('explanationChevron');

        if (toggleExplanationBtn && identityExplanationBox) {
            toggleExplanationBtn.addEventListener('click', () => {
                const isHidden = identityExplanationBox.classList.contains('hidden');
                if (isHidden) {
                    identityExplanationBox.classList.remove('hidden');
                    toggleExplanationBtn.setAttribute('aria-expanded', 'true');
                    if (explanationBtnText) explanationBtnText.innerText = 'Ẩn thuyết minh biểu trưng';
                    if (explanationChevron) explanationChevron.classList.add('rotate-180');
                } else {
                    identityExplanationBox.classList.add('hidden');
                    toggleExplanationBtn.setAttribute('aria-expanded', 'false');
                    if (explanationBtnText) explanationBtnText.innerText = 'Xem thuyết minh biểu trưng 2026';
                    if (explanationChevron) explanationChevron.classList.remove('rotate-180');
                }
            });
        }

        // Canvas Avatar Generator
        const canvas = document.getElementById('avatarCanvas');
        const ctx = canvas.getContext('2d');
        let uploadedImage = null;

        const frameImg = new Image();
        const FRAME_URL = 'assets/images/avatar-frame-cc05a2f8a505.png';
        
        frameImg.onload = function() {
            renderAvatarFrame();
        };

        if (window.location.protocol === 'file:') {
            // Local file images can taint a canvas. Only local previews load
            // the identical PNG as a data URL through a separate script.
            window.__loadLocalAvatarFrame = function(dataUrl) {
                frameImg.src = dataUrl;
                delete window.__loadLocalAvatarFrame;
            };
            const localFrameScript = document.createElement('script');
            localFrameScript.src = 'assets/js/avatar-frame.local.js';
            localFrameScript.onerror = function() {
                console.error('Không tải được ảnh khung cho bản xem local. Hãy chạy npm run build.');
            };
            document.head.appendChild(localFrameScript);
        } else {
            frameImg.crossOrigin = 'anonymous';
            frameImg.src = FRAME_URL;
        }

        function initCanvas() {
            canvas.width = 800;
            canvas.height = 800;
            renderAvatarFrame();
        }

        function renderAvatarFrame() {
            const size = 800;
            ctx.clearRect(0, 0, size, size);

            const cx = 400;
            const cy = 437.5;
            const r = 261.875;

            if (uploadedImage) {
                const zoom = parseFloat(document.getElementById('zoomRange').value) || 1.0;
                const baseScale = Math.max((r * 2) / uploadedImage.width, (r * 2) / uploadedImage.height);
                const imgW = uploadedImage.width * baseScale * zoom;
                const imgH = uploadedImage.height * baseScale * zoom;
                const imgX = cx - imgW / 2;
                const imgY = cy - imgH / 2;

                ctx.save();
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.clip();
                ctx.drawImage(uploadedImage, imgX, imgY, imgW, imgH);
                ctx.restore();
            } else {
                ctx.save();
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.clip();
                ctx.fillStyle = '#13307A';
                ctx.fillRect(0, 0, size, size);
                ctx.fillStyle = '#C9D3F0';
                ctx.font = '600 22px "Be Vietnam Pro", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Vui lòng chọn ảnh của bạn', cx, cy);
                ctx.restore();
            }

            if (frameImg.complete && frameImg.naturalWidth > 0) {
                ctx.drawImage(frameImg, 0, 0, size, size);
            }
        }

        document.getElementById('uploadPhoto').addEventListener('change', function(e) {
            const file = e.target.files[0];
            const nameDisplay = document.getElementById('fileNameDisplay');
            const downloadBtn = document.getElementById('downloadBtn');
            if (file) {
                if (nameDisplay) {
                    nameDisplay.innerText = file.name;
                    nameDisplay.classList.remove('italic');
                    nameDisplay.classList.add('font-semibold', 'text-[#FFC21A]');
                }
                const reader = new FileReader();
                reader.onload = function(evt) {
                    uploadedImage = new Image();
                    uploadedImage.onload = function() {
                        renderAvatarFrame();
                        if (downloadBtn) {
                            downloadBtn.disabled = false;
                            downloadBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                            downloadBtn.classList.add('hover:bg-amber-300', 'hover:scale-105', 'cursor-pointer');
                        }
                    }
                    uploadedImage.src = evt.target.result;
                }
                reader.readAsDataURL(file);
            } else {
                if (nameDisplay) {
                    nameDisplay.innerText = 'Chưa chọn tệp nào';
                    nameDisplay.classList.add('italic');
                    nameDisplay.classList.remove('font-semibold', 'text-[#FFC21A]');
                }
                if (downloadBtn) {
                    downloadBtn.disabled = true;
                    downloadBtn.classList.add('opacity-50', 'cursor-not-allowed');
                    downloadBtn.classList.remove('hover:bg-amber-300', 'hover:scale-105', 'cursor-pointer');
                }
            }
        });

        document.getElementById('zoomRange').addEventListener('input', renderAvatarFrame);

        function downloadAvatar() {
            if (!uploadedImage) {
                alert('Vui lòng chọn ảnh của bạn trước khi tải về!');
                return;
            }
            if (!frameImg.complete || frameImg.naturalWidth === 0) {
                alert('Khung ảnh chưa tải xong. Vui lòng đợi một chút rồi thử lại!');
                return;
            }
            renderAvatarFrame();
            try {
                if (canvas.toBlob) {
                    canvas.toBlob(function(blob) {
                        if (blob) {
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.download = 'Avatar_Ngay_Chuyen_Doi_So_2026.png';
                            link.href = url;
                            document.body.appendChild(link);
                            link.click();
                            setTimeout(() => {
                                document.body.removeChild(link);
                                URL.revokeObjectURL(url);
                            }, 150);
                            return;
                        }
                        executeDataURLDownload();
                    }, 'image/png');
                } else {
                    executeDataURLDownload();
                }
            } catch (err) {
                executeDataURLDownload();
            }
        }

        window.downloadAvatar = downloadAvatar;

        function executeDataURLDownload() {
            try {
                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = 'Avatar_Ngay_Chuyen_Doi_So_2026.png';
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (err) {
                console.error("Download error:", err);
                alert("Đã xảy ra lỗi khi tải ảnh. Vui lòng thử lại!");
            }
        }
        // Particle Constellation Background Canvas
        const pCanvas = document.getElementById('particleCanvas');
        const pCtx = pCanvas.getContext('2d');

        function resizeParticleCanvas() {
            pCanvas.width = window.innerWidth;
            pCanvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeParticleCanvas);
        resizeParticleCanvas();

        const particles = [];
        const particleCount = 40;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * pCanvas.width,
                y: Math.random() * pCanvas.height,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                radius: Math.random() * 2 + 1
            });
        }

        function drawParticles() {
            pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
            pCtx.fillStyle = 'rgba(255, 194, 26, 0.35)';
            pCtx.strokeStyle = 'rgba(47, 107, 255, 0.12)';

            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > pCanvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > pCanvas.height) p.vy *= -1;

                pCtx.beginPath();
                pCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                pCtx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    let p2 = particles[j];
                    let dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 120) {
                        pCtx.beginPath();
                        pCtx.moveTo(p.x, p.y);
                        pCtx.lineTo(p2.x, p2.y);
                        pCtx.stroke();
                    }
                }
            }
            requestAnimationFrame(drawParticles);
        }
        drawParticles();

        // Articles Modal Logic
        const articlesData = {
            1: {
                category: "Cơ quan nhà nước",
                title: "Chuyển đổi số thay đổi cách người dân đi máy bay",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-vneid-airport-2026.webp",
                imageAlt: "Hành khách sử dụng điện thoại tại cổng nhận diện khuôn mặt ở sân bay",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Ở nhà ga T3 Tân Sơn Nhất, chị Nguyễn Thu Huyền, 27 tuổi, mở VNeID đã liên kết với vé máy bay rồi bước vào khung nhận diện khuôn mặt. Cửa mở ngay. “Nhanh hơn hẳn mấy lần trước, khỏi lục ví tìm căn cước, khỏi đợi in thẻ”, chị nói. Khuôn mặt đã thay cho tấm căn cước.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Một chuyến bay nội địa từng đồng nghĩa với nhiều lần dừng lại trình giấy. Hành khách làm thủ tục để nhận thẻ lên máy bay, rồi xuất trình giấy tờ tại điểm kiểm tra an ninh và thêm một lần nữa ở cửa ra tàu bay. Người chỉ mang hành lý xách tay cũng phải đi đủ các bước ấy. Mỗi chốt là một lần dừng lại, rút giấy tờ ra rồi cất vào, trong khi hàng người phía sau đang chờ.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Thay vì trình giấy ở từng chốt, nay việc xác minh “bạn là ai” được làm bằng sinh trắc học gắn với tài khoản định danh điện tử VNeID. Hành khách liên kết vé với ứng dụng; tại cửa an ninh và cửa ra máy bay, họ chỉ cần nhìn vào camera để hệ thống nhận diện khuôn mặt.</p><p>Từ ngày 1/12/2025, theo Chỉ thị số 24 của Thủ tướng, phần lớn khách bay nội địa đi thẳng qua an ninh và ra cửa lên máy bay bằng sinh trắc học gắn với VNeID hoặc qua ki-ốt tự phục vụ. Người chưa quen vẫn được hỗ trợ: ông Nguyễn Văn Bảy, 56 tuổi, quê Tây Ninh, quên mật khẩu VNeID ngay trước cổng; một nhân viên an ninh hướng dẫn ông khôi phục tài khoản, nhắc bỏ kính râm, nhìn thẳng camera. Cửa mở, ông qua chỉ trong vài giây.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Theo Bộ Công an, tính đến ngày 16/01/2026, xác thực sinh trắc học đã được áp dụng tại 18 cảng hàng không cho hơn 1,1 triệu lượt khách.</li><li>Thời gian kiểm soát, xử lý giảm từ 17–27 phút xuống còn 3–5 giây.</li><li>VNeID có hơn 67 triệu tài khoản đã kích hoạt, trung bình trên 3 triệu lượt truy cập mỗi ngày.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người được lợi trực tiếp là hành khách bay nội địa, nhất là người chỉ mang hành lý xách tay: không phải xếp hàng in thẻ, không phải rút giấy tờ ở từng chốt. Theo Tuổi Trẻ, hành khách không ký gửi hành lý tiết kiệm 10–15 phút khi bỏ được bước trình giấy tờ và in thẻ. Người lớn tuổi, chưa quen điện thoại vẫn đi được luồng mới, vì bên cạnh cổng tự động vẫn có nhân viên hướng dẫn.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Cánh cổng mở trong vài giây là phần nhìn thấy được. Phần không nhìn thấy là dữ liệu định danh của từng người đã có sẵn và được phép dùng chung. Khi dữ liệu ấy được tin dùng, người dân thôi phải chứng minh mình là ai ở mỗi chặng.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://tuoitre.vn/bay-noi-dia-cung-vneid-bot-lo-chen-lan-20250916233937224.htm" target="_blank" rel="noopener noreferrer">Tuổi Trẻ Online – 17/09/2025</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://hatinh.gov.vn/vi/bai-viet/bo-cong-an-vneid-cung-cap-50-tien-ich-ghi-nhan-hon-3-trieu-luot-truy-cap-moi-ngay" target="_blank" rel="noopener noreferrer">Cổng Thông tin điện tử tỉnh Hà Tĩnh – 16/01/2026</a></li></ul></section>
                `
            },
            2: {
                category: "Cơ quan nhà nước",
                title: "Từ thuế khoán đến chiếc điện thoại: Chuyển đổi số thay đổi cách hộ kinh doanh nộp thuế",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-tax-mobile-2026.webp",
                imageAlt: "Chủ hộ kinh doanh kê khai thuế điện tử trên điện thoại tại cửa hàng",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Từ ngày 1/1/2026, thuế khoán chính thức bị bãi bỏ. Hộ kinh doanh chuyển sang kê khai theo doanh thu thực tế, và phần lớn làm việc đó trên điện thoại. Đến 02/5/2026, 2.484.144 trong số 3.074.068 hộ đang hoạt động đã dùng eTax Mobile. Một chủ hộ ở Hà Nội nhận xét: “Số liệu rõ ràng hơn trước”.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Trong nhiều năm, hộ kinh doanh nộp thuế theo một mức khoán do cơ quan thuế ấn định, không phải xuất hóa đơn cho từng lần bán hàng. Doanh thu thật của mỗi hộ vì thế ít khi được ghi lại; mức thuế dựa nhiều vào ước lượng. Hộ bán nhiều và hộ bán ít có thể nộp những khoản không tương xứng với việc buôn bán thực tế. Cán bộ thuế quản lý theo địa bàn, chủ yếu bằng thủ công, và khó nắm được hàng triệu hộ nhỏ lẻ đang thực sự bán bao nhiêu.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Từ 1/1/2026, cách tính thuế đổi gốc: bỏ mức ấn định, chuyển sang kê khai “trên cơ sở dữ liệu doanh thu thực tế”. Hộ kinh doanh đăng ký tài khoản giao dịch điện tử, tự khai và nộp thuế trên ứng dụng eTax Mobile. Hộ thuộc diện bắt buộc dùng hóa đơn điện tử khởi tạo từ máy tính tiền, nên mỗi lần bán hàng là một lần doanh thu được ghi lại.</p><p>Chị Nguyễn Thị Minh ở phường Long Biên trước đây buôn bán nhỏ lẻ qua Facebook. Theo quy định mới, chị đăng ký tài khoản giao dịch điện tử và xuất hóa đơn điện tử từ máy tính tiền. Để người bán không bị bỏ lại, ngành thuế Hà Nội mở 2.200 điểm hỗ trợ lưu động tại chợ, trung tâm thương mại, khu dân cư, hỗ trợ khoảng 230.000 lượt hộ kinh doanh.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Cả nước có 98,6% hộ kinh doanh khai thuế điện tử; 2.484.144/3.074.068 hộ đang hoạt động, khoảng 81%, dùng eTax Mobile theo số liệu Bộ Tài chính đến 2/5/2026.</li><li>Tỷ lệ hồ sơ nộp đúng hạn đạt 99,8%; hơn 303.000 hộ đăng ký hóa đơn điện tử khởi tạo từ máy tính tiền, lũy kế đến 30/4/2026.</li><li>Tại Hà Nội, doanh thu kê khai của nhóm hộ có doanh thu hơn 1 tỷ đồng tăng 75% so với trước khi chuyển đổi.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Với hộ kinh doanh, số thuế giờ đi theo doanh thu thật chứ không theo một con số ấn định từ đầu năm. Việc khai, nộp làm trên điện thoại, không phải lên cơ quan thuế. “Tôi thấy rất tiện ích, số liệu rõ ràng hơn trước. Khi tất cả các hộ kinh doanh đều thực hiện sẽ tạo thị trường bình đẳng, minh bạch hơn”, chị Minh nói. Với cơ quan thuế, doanh thu của hàng triệu hộ nhỏ lần đầu hiện ra trên dữ liệu, như con số 75% ở Hà Nội cho thấy.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Bỏ thuế khoán không chỉ đổi cách tính thuế. Nó đổi quan hệ giữa người bán hàng và cơ quan thuế: từ một con số ấn định sang cùng nhìn vào một bộ dữ liệu. Và bộ dữ liệu ấy được tạo ra từ chính từng lần bán hàng.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://thuehaiquan.tapchikinhtetaichinh.vn/ty-le-ho-kinh-doanh-ke-khai-thue-dien-tu-dat-986-157673.html" target="_blank" rel="noopener noreferrer">Tạp chí Kinh tế – Tài chính – 01/06/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://nhandan.vn/dong-hanh-cung-ho-kinh-doanh-chuyen-tu-thue-khoan-sang-ke-khai-post973120.html" target="_blank" rel="noopener noreferrer">Báo Nhân Dân điện tử – 02/07/2026</a></li></ul></section>
                `
            },
            3: {
                category: "Cơ quan nhà nước",
                title: "Mỗi cử tri một định danh: Khi dữ liệu số đi vào ngày hội toàn dân",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-digital-voter-2026.webp",
                imageAlt: "Cử tri sử dụng định danh điện tử tại điểm bỏ phiếu",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Cuộc bầu cử đại biểu Quốc hội khóa XVI ngày 15/3/2026 ghi nhận hơn 76 triệu cử tri tham gia, tỷ lệ 99,70%, cao nhất qua các nhiệm kỳ. Trước ngày bầu cử, hơn 78,5 triệu cử tri đủ điều kiện đã được phân về các khu vực bỏ phiếu trên hệ thống. Lần đầu, dữ liệu dân cư và VNeID được dùng ở nhiều khâu: lập danh sách cử tri, cho người dân tự tra cứu và đổi nơi bỏ phiếu trên điện thoại.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Danh sách cử tri trước đây được lập chủ yếu từ thông tin người dân tự khai. Cùng một người, cách ghi họ tên, địa chỉ hay thông tin nhân thân có thể khác nhau giữa các nơi, dẫn tới trùng lặp hoặc thiếu thống nhất. Sau ngày bầu cử, số liệu từ hàng chục nghìn khu vực bỏ phiếu được tổng hợp chủ yếu thủ công, chịu áp lực lớn về thời gian và dễ phát sinh sai sót.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Lần này, danh sách cử tri được lập trên một phần mềm thống nhất toàn quốc, kết nối trực tiếp với Cơ sở dữ liệu quốc gia về dân cư. Mỗi cử tri được nhận diện bằng mã định danh cá nhân. Theo bà Tạ Thị Yên, Phó Chủ nhiệm Ủy ban Công tác đại biểu của Quốc hội, danh sách cử tri và hồ sơ ứng cử viên được đối chiếu với dữ liệu dân cư để loại bỏ trùng lặp, sai sót.</p><p>Phía cử tri, VNeID cho phép tra cứu khu vực và địa điểm bỏ phiếu. Người có tài khoản định danh điện tử mức độ 2 có thể gửi yêu cầu đổi nơi bỏ phiếu giữa nơi thường trú và nơi tạm trú ngay trên ứng dụng, chậm nhất 24 giờ trước giờ bầu cử.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Hơn 76 triệu cử tri tham gia bỏ phiếu tại khoảng 72.000 khu vực; tỷ lệ tham gia 99,70%, cao nhất qua các nhiệm kỳ.</li><li>3.320/3.321 xã, phường lập danh sách cử tri trên phần mềm thống nhất.</li><li>Kết quả bầu cử công bố ngày 21/3 và kỳ họp thứ nhất Quốc hội khóa XVI khai mạc ngày 6/4/2026, rút thời gian xuống hơn hai tuần so với gần hai tháng ở các nhiệm kỳ trước.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người đi làm ăn xa là nhóm hưởng lợi rõ nhất: chỉ với điện thoại, họ biết mình bỏ phiếu ở đâu và có thể xin bỏ phiếu tại nơi đang tạm trú. Mỗi cử tri có một mã định danh duy nhất, nên khả năng một người bị ghi hai lần hoặc bị sót tên giảm đi. Cán bộ xã, phường lập danh sách trên cùng một phần mềm, đối chiếu với cùng một nguồn dữ liệu, thay vì mỗi nơi một kiểu ghi chép.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Tỷ lệ 99,70% là kết quả của ý thức cử tri và công tác tổ chức, không phải của phần mềm. Việc dữ liệu làm được lặng lẽ hơn: mỗi người chỉ có một tên trong danh sách, và biết chắc mình sẽ bỏ phiếu ở đâu.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://vnexpress.net/lan-dau-ung-dung-du-lieu-dan-cu-vneid-trong-nhieu-khau-bau-cu-5049090.html" target="_blank" rel="noopener noreferrer">VnExpress – 12/03/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://nhandan.vn/cuoc-bau-cu-co-quy-mo-cu-tri-lon-nhat-va-ty-le-tham-gia-cao-nhat-post953521.html" target="_blank" rel="noopener noreferrer">Báo Nhân Dân điện tử – 06/04/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://thanhnien.vn/cuoc-bau-cu-dot-pha-ve-so-hoa-185260316210845038.htm" target="_blank" rel="noopener noreferrer">Báo Thanh Niên – 17/03/2026</a></li></ul></section>
                `
            },
            4: {
                category: "Cơ quan nhà nước",
                title: "Chuyển đổi số trong các cơ quan Đảng từ việc nộp đảng phí",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-electronic-party-procedures-2026.webp",
                imageAlt: "Cán bộ hỗ trợ thực hiện thủ tục và thanh toán điện tử trên điện thoại",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Trong hơn hai tháng thí điểm, từ 21/4/2026 đến 26/6/2026, hệ thống giải quyết thủ tục hành chính của Đảng tiếp nhận hơn 4,48 triệu hồ sơ điện tử. Phần lớn là giao dịch nộp đảng phí, tổng số tiền khoảng 265 tỷ đồng. Nhiều thủ tục trước đây thực hiện trực tiếp bằng hồ sơ giấy, nay đã có thể làm qua hệ thống hoặc ứng dụng.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>“Trước đây, toàn bộ thủ tục hành chính trong Đảng đều thực hiện trực tiếp, bằng hồ sơ giấy”, bà Lê Thị Ngọc Dung, Phó Bí thư Thường trực Đảng ủy phường Tân Tạo, TP.HCM, cho biết. Bốn việc đảng viên thường gặp nhất là nộp đảng phí, chuyển sinh hoạt đảng chính thức, chuyển sinh hoạt đảng tạm thời và lấy ý kiến nhận xét của chi ủy, chi bộ nơi cư trú. Mỗi việc đều phải đi qua hồ sơ giấy, qua tay chi bộ và cấp ủy, rồi được theo dõi bằng sổ sách.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Theo Kế hoạch số 77-KH/VPTW của Văn phòng Trung ương Đảng, bốn thủ tục này được đưa lên môi trường điện tử, thí điểm giai đoạn 1 tại Đảng ủy các cơ quan Đảng Trung ương và 8 tỉnh, thành phố. Nay đảng viên vào Hệ thống thông tin giải quyết thủ tục hành chính của Đảng hoặc ứng dụng iCPV để nộp đảng phí, thanh toán qua tài khoản ngân hàng hoặc mã QR. 21 ngân hàng đã mở 40.007 tài khoản thanh toán cho các tổ chức đảng.</p><p>Không phải mọi khâu đã trơn tru. Ở TP.HCM, cơ sở dữ liệu đảng viên mới có khoảng 20 trường thông tin, nên chuyển sinh hoạt đảng chính thức vẫn phải làm bằng hồ sơ giấy.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Hơn 4,48 triệu hồ sơ điện tử trong giai đoạn 1 từ 21/4 đến 26/6/2026, trong đó có 4.467.564 giao dịch nộp đảng phí.</li><li>Đảng phí thu qua hệ thống khoảng 265 tỷ đồng, tương đương khoảng 86% kế hoạch.</li><li>14.584 hồ sơ thuộc ba thủ tục về công tác đảng viên đã được xử lý.</li><li>Phường Tân Tạo, TP.HCM có 1.657 đảng viên khai báo nộp đảng phí trên hệ thống, hơn 97% đã hoàn tất.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Với đảng viên đang đi làm, nộp đảng phí hay gửi hồ sơ không còn phụ thuộc vào buổi sinh hoạt chi bộ. Với cấp ủy, đảng phí vào thẳng tài khoản ngân hàng của tổ chức đảng. “Việc số hóa giúp công tác quản lý ngày càng thuận lợi, giảm tải đáng kể cho bộ máy”, ông Lê Tiến Sĩ, Trưởng ban Xây dựng Đảng phường Sài Gòn, nói.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Bắt đầu từ việc thường xuyên nhất là nộp đảng phí đã giúp hàng triệu đảng viên làm quen với môi trường số chỉ trong một quý.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://tapchicongthuong.vn/hon-4-48-trieu-ho-so-thuc-hien-4-thu-tuc-hanh-chinh-cua-dang-tren-moi-truong-dien-tu-537057.htm" target="_blank" rel="noopener noreferrer">Tạp chí Công Thương – 27/07/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://thanhnien.vn/len-mang-lam-thu-tuc-hanh-chinh-cua-dang-185260614201926532.htm" target="_blank" rel="noopener noreferrer">Báo Thanh Niên – 15/06/2026</a></li></ul></section>
                `
            },
            5: {
                category: "Cơ quan nhà nước",
                title: "Hà Nội: Chuẩn hóa thủ tục trước, rồi mới đưa lên mạng",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-hanoi-digital-procedure-2026.webp",
                imageAlt: "Người dân được hỗ trợ giải quyết thủ tục bằng dữ liệu số tại trung tâm hành chính",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Tỷ lệ tái sử dụng dữ liệu số hóa của Hà Nội trên Cổng Dịch vụ công quốc gia đạt 97,35%. Chi phí tuân thủ thủ tục hành chính giảm từ 671 tỷ đồng xuống 263 tỷ đồng. Đằng sau hai con số là một lựa chọn: không đưa nguyên quy trình cũ lên môi trường số.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Hà Nội giải quyết gần 4 triệu hồ sơ thủ tục hành chính mỗi năm. Cách dễ nhất để “số hóa” là giữ nguyên biểu mẫu, giữ nguyên giấy tờ, chỉ chuyển nơi nộp từ quầy lên mạng. Khi đó người dân vẫn phải khai lại những gì cơ quan nhà nước đã có. Chính lãnh đạo thành phố thừa nhận dữ liệu “vẫn còn phân tán, chưa được chuẩn hóa thường xuyên; nhiều nơi có dữ liệu mà không khai thác được để hỗ trợ quyết định”.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Hà Nội chọn nguyên tắc “chuẩn hóa trước khi số hóa”: thiết kế lại quy trình phục vụ người dân, không chuyển nguyên quy trình cũ lên môi trường điện tử. Thành phố đã phê duyệt phương án tái cấu trúc 1.508 trong tổng số 1.721 thủ tục hành chính.</p><p>Song song, các cơ sở dữ liệu chuyên ngành được số hóa, kết nối để cán bộ tự khai thác khi giải quyết hồ sơ, thay vì yêu cầu người dân nộp bản giấy. Theo thành phố, các cơ sở dữ liệu này hỗ trợ giải quyết gần 4 triệu hồ sơ mỗi năm. Tỷ lệ số hóa hồ sơ và kết quả giải quyết thủ tục đạt trên 98%. Thành phố cũng nói thẳng hai điểm nghẽn còn lại là chất lượng dữ liệu và hành lang pháp lý.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Tỷ lệ tái sử dụng dữ liệu số hóa trên Cổng Dịch vụ công quốc gia đạt 97,35% theo Sở Khoa học và Công nghệ Hà Nội, công bố tháng 9/2026.</li><li>Chi phí tuân thủ thủ tục hành chính giảm từ 671 tỷ đồng xuống 263 tỷ đồng, gần 61%, gắn với phương án tái cấu trúc 1.508/1.721 thủ tục.</li><li>Trên 98% hồ sơ và kết quả giải quyết thủ tục hành chính được số hóa, tính đến 1/7/2026.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người dân và doanh nghiệp bớt phải khai lại, nộp lại những gì chính quyền đã có, và bớt những chuyến đi chỉ để bổ sung một tờ giấy. Ông Nguyễn Anh Tuấn, Phó Giám đốc Sở Khoa học và Công nghệ Hà Nội, nói: “Thước đo quan trọng nhất không phải là có thêm bao nhiêu phần mềm, bao nhiêu tài khoản hay bao nhiêu văn bản được ban hành, mà là người dân có bớt phải chờ đợi, đi lại, kê khai lại thông tin”.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Tỷ lệ số hóa cao chưa phải là con số thể hiện mức độ thành công chuyển đổi số. Con số đáng theo dõi hơn là bao nhiêu lần dữ liệu được dùng lại, và bao nhiêu lần người dân không phải khai lại điều Nhà nước đã biết.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://dantri.com.vn/khoa-hoc/xay-cao-toc-cho-thu-tuc-mot-thanh-pho-tiet-kiem-571000-gio-cong-xa-hoi-20260827093356326.htm" target="_blank" rel="noopener noreferrer">Báo Dân trí – 03/09/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://dantri.com.vn/khoa-hoc/tren-98-thu-tuc-hanh-chinh-cua-ha-noi-duoc-so-hoa-20260701171622756.htm" target="_blank" rel="noopener noreferrer">Báo Dân trí – 01/07/2026</a></li></ul></section>
                `
            },
            6: {
                category: "Cơ quan nhà nước",
                title: "Khi dịch vụ công vượt qua rào cản địa giới hành chính",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-cross-province-service-2026.webp",
                imageAlt: "Người lao động nộp hồ sơ hộ tịch tại nơi làm việc để được xử lý liên tỉnh",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Tháng 4/2026, ông Đào Tiến Dũng, 48 tuổi, công nhân ở xã Trừ Văn Thố (TP.HCM), cần bản sao trích lục khai sinh để con đi học. Theo quy trình thông thường, ông phải về quê ở Hà Tĩnh. Lần này, ông nộp hồ sơ ngay tại xã nơi mình làm việc; kết quả được gửi về qua bưu điện.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Ông Dũng quê ở xã Đan Hải, tỉnh Hà Tĩnh, làm công nhân ở ấp Bàu Giáng, xã Trừ Văn Thố. Giấy khai sinh của con do quê nhà quản lý. Theo cách làm cũ, thủ tục gắn với nơi cư trú và nơi trực tiếp giải quyết hồ sơ: người dân phải về đúng nơi đó để nộp và nhận kết quả. Với một người lao động ở TP.HCM, xin một bản trích lục cho con nghĩa là một chuyến đi hơn một nghìn cây số.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>TP.HCM đổi cách làm theo hướng “người dân ở đâu, thủ tục đi tới đó”. Người dân chọn trung tâm phục vụ hành chính công gần nơi sinh sống, làm việc để nộp hồ sơ; phần việc còn lại do các cơ quan nhà nước tự trao đổi, luân chuyển hồ sơ với nhau. Với ông Dũng, xã Trừ Văn Thố tiếp nhận, xã Đan Hải xử lý, kết quả trả qua bưu điện.</p><p>Song song, thành phố rà soát lại chính các thủ tục. Theo UBND TP.HCM, thành phố đã thông qua phương án cắt giảm, đơn giản hóa 570 thủ tục hành chính của 14 cơ quan, đơn vị; 432 thủ tục có thể dùng dữ liệu từ các cơ sở dữ liệu chuyên ngành. Riêng xã Trừ Văn Thố đã số hóa 100% kết quả giải quyết thủ tục hành chính.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>570 thủ tục hành chính được thông qua phương án cắt giảm, đơn giản hóa; thời gian giải quyết cắt giảm hơn 39%, chi phí tuân thủ giảm gần 22,5% (UBND TP.HCM, 5/2026).</li><li>1.908 thủ tục hành chính được giải quyết không phụ thuộc địa giới hành chính (tính đến đầu tháng 8/2026).</li><li>Từ đầu năm đến 18/5/2026: hơn 1,67 triệu hồ sơ, trong đó hơn 1,3 triệu nộp trực tuyến; 99,32% giải quyết đúng hạn.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người được lợi rõ nhất là người lao động sống xa nơi đăng ký hộ tịch, cư trú, như ông Dũng: không phải về quê chỉ vì một tờ giấy cho con. Riêng tại xã Trừ Văn Thố, trong những tháng gần đây, trung tâm đã hỗ trợ 63 trường hợp nộp hồ sơ phi địa giới về các tỉnh, thành phố. Xã không có tổ chuyên trách, nhưng vẫn phân công cán bộ, tình nguyện viên hỗ trợ khi người dân cần. Mức hài lòng trên Cổng Dịch vụ công quốc gia của xã đạt 18/18 điểm.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Con số 570 thủ tục được đơn giản hóa khó hình dung. Chuyến về quê hơn nghìn cây số mà ông Dũng không phải đi thì ai cũng hiểu. Khi hồ sơ được luân chuyển giữa các cơ quan, người dân bớt phiền phức trong việc thực hiện thủ tục hơn.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://thanhnien.vn/thu-tuc-hanh-chinh-o-tphcm-len-doi-nguoi-dan-o-dau-thu-tuc-di-toi-do-185260913215515104.htm" target="_blank" rel="noopener noreferrer">Báo Thanh Niên – 14/09/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://tapchikinhtetaichinh.vn/don-gian-hoa-hon-570-thu-tuc-hanh-chinh-tp-ho-chi-minh-giam-manh-thoi-gian-xu-ly-ho-so-157605.html" target="_blank" rel="noopener noreferrer">Tạp chí Kinh tế – Tài chính – 31/05/2026</a></li></ul></section>
                `
            },
            7: {
                category: "Cơ quan nhà nước",
                title: "Kiosk thông minh giúp người dân tự tin trên môi trường số",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-smart-kiosk-langson-2026.webp",
                imageAlt: "Người cao tuổi được hướng dẫn sử dụng kiosk dịch vụ công thông minh tại Lạng Sơn",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Ở 10 trung tâm phục vụ hành chính công cấp xã của Lạng Sơn, người dân nay có thể đặt căn cước lên một trạm tự phục vụ để máy nhận diện thông tin, giấy tờ được số hóa ngay tại chỗ. Sau hơn một tháng thí điểm, 10 trạm đã hỗ trợ giải quyết thành công 5.617 hồ sơ.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Mỗi tháng, cấp xã ở Lạng Sơn phát sinh khoảng 8.600 hồ sơ thủ tục hành chính. Đến trung tâm hành chính, người dân thường phải dành nhiều thời gian xếp hàng, chờ cán bộ tiếp nhận, đối chiếu giấy tờ thủ công. Chị Hoàng Thị Thu ở thôn Phiêng Quăn, xã Lộc Bình, kể rằng mỗi lần đi làm thủ tục, chị thường phải chuẩn bị khá nhiều giấy tờ, có những nội dung phải kê khai lại. Với người cao tuổi, người ở vùng sâu, vùng xa, tự làm thủ tục trực tuyến càng không dễ.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Ngày 27/7/2026, UBND tỉnh Lạng Sơn phối hợp với Agribank khai trương mô hình thí điểm “Trạm dịch vụ công số” tại Trung tâm Phục vụ hành chính công của 10 xã, phường; trạm ở phường Đông Kinh đã vận hành thử trước đó. Trạm kết nối trực tiếp với hệ thống giải quyết thủ tục hành chính.</p><p>Cách làm đổi từ “khai và nộp giấy” sang “quét và xác nhận”. Máy nhận diện thông tin trên căn cước công dân; giấy tờ được số hóa tại chỗ, có AI hỗ trợ bóc tách thông tin; người dân xác thực bằng khuôn mặt hoặc VNeID. Từ đó có thể tạo lập, nộp hồ sơ, tra cứu tiến độ, thanh toán trực tuyến và nhận kết quả. Các trung tâm bố trí cán bộ hỗ trợ, nhất là cho người cao tuổi, người ở vùng sâu, vùng xa.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Sau hơn một tháng thí điểm, 10 trạm hỗ trợ giải quyết thành công 5.617 hồ sơ: 4.021 hồ sơ dịch vụ công trực tuyến và 1.596 hồ sơ cấp bản sao chứng thực số.</li><li>Riêng xã Lộc Bình, từ cuối tháng 7/2026: trên 1.500 lượt sử dụng trạm, trong đó trên 390 lượt tiếp cận VNeID và trên 330 lượt nộp hồ sơ dịch vụ công.</li><li>Theo Agribank, đơn vị tài trợ, mô hình kiosk giúp nhiều thủ tục rút ngắn từ 10–15 phút xuống 3–5 phút.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Với chị Thu, khác biệt nằm ở những việc không phải làm nữa. Chị chia sẻ, nay thông tin trên căn cước được nhận diện, giấy tờ được số hóa ngay tại chỗ nên thuận tiện hơn rất nhiều. Ở Lộc Bình, hơn 390 lượt người dân đã tiếp cận VNeID ngay tại trạm, tức trạm cũng là nơi họ làm quen với tài khoản định danh điện tử. Người cao tuổi, người ở vùng sâu, vùng xa được cán bộ hỗ trợ ngay tại trạm.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Dịch vụ công trực tuyến không tự có người dùng. Ở Lạng Sơn, công cụ số được đặt ngay tại quầy nơi người dân vẫn quen đến, và máy làm thay phần việc nhàm chán nhất: đọc giấy tờ, điền lại những thông tin đã có sẵn.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://baotintuc.vn/kiosk-thong-minh-giup-nguoi-dan-tu-tin-tren-moi-truong-so-post1386612.html" target="_blank" rel="noopener noreferrer">Báo Tin tức – TTXVN – 18/09/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://mst.gov.vn/khai-truong-mo-hinh-tram-dich-vu-cong-so-197260728190104937.htm" target="_blank" rel="noopener noreferrer">Cổng Thông tin điện tử Bộ Khoa học và Công nghệ – 29/07/2026</a></li></ul></section>
                `
            },
            8: {
                category: "Cơ quan nhà nước",
                title: "Số hóa ngay từ quầy: Cách chuyển đổi số giúp chính quyền cơ sở xử lý hồ sơ đất đai đúng hạn",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-land-record-digitization-2026.webp",
                imageAlt: "Cán bộ số hóa hồ sơ đất đai ngay tại quầy tiếp nhận ở Ninh Bình",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Từ 1/7/2025, chính quyền địa phương chuyển sang hai cấp. Bộ phận hành chính phường Thành Nam (Ninh Bình) tiếp nhận cả những hồ sơ phức tạp như đất đai, xây dựng, hộ kinh doanh. Sau 07 tháng đi vào hoạt động, 6.172 trên 6.173 hồ sơ được trả đúng hạn. Bí quyết bắt đầu ngay tại quầy tiếp nhận.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Khi không còn cấp huyện, nhiều thủ tục về đến xã, phường. Mỗi tháng, Trung tâm Phục vụ hành chính công phường Thành Nam tiếp nhận, xử lý gần 1.200 hồ sơ. Một hồ sơ đất đai thường kèm nhiều giấy tờ bản cứng; nếu vẫn tiếp nhận bằng giấy, chuyển tay và theo dõi hạn thủ công, khối lượng ấy dễ đè lên một bộ phận một cửa cấp phường. Ở nơi khác, như phường Hòa Bình (Phú Thọ), bí thư đảng ủy phường thừa nhận nhiều cán bộ đất đai phải làm việc 12–14 giờ mỗi ngày.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Phường Thành Nam chọn đưa hồ sơ lên hệ thống ngay từ quầy. Khi ông Phạm Văn Thể đến “Cửa số 1” làm thủ tục đất đai, không có cảnh xếp hàng rồng rắn hay ôm đồm giấy tờ bản cứng: toàn bộ thông tin của ông được cán bộ tiếp nhận và số hóa trực tiếp lên phần mềm, quy trình tiếp nhận hoàn tất trong thời gian ngắn.</p><p>Từ đó, hồ sơ đi trên môi trường số: 100% được số hóa và thanh toán trực tuyến, 90% được lưu kho điện tử. Phường xây dựng hệ thống mã QR để người dân tự tra cứu hồ sơ. Với chứng thực, hộ tịch, phường làm theo phương châm “5 tại chỗ”: tiếp nhận và giải quyết ngay trong ngày, không có phiếu hẹn.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Phường Thành Nam, từ 1/7/2025 đến hết tháng 1/2026: 6.172 trên 6.173 hồ sơ được trả đúng hạn, tỷ lệ 99,98%.</li><li>Theo Giám đốc Trung tâm, mã QR tra cứu giúp rút ngắn khoảng 30% thời gian giải quyết hồ sơ.</li><li>Trung tâm Phục vụ hành chính công tỉnh Ninh Bình, 2 tháng đầu năm 2026: tiếp nhận 82.851 hồ sơ, 90,32% nộp trực tuyến, 81.520 hồ sơ hoàn thành đúng hạn (khoảng 98,4%).</li><li>Toàn quốc, sau một năm vận hành chính quyền hai cấp: trên 98% hồ sơ thủ tục hành chính được giải quyết đúng và trước hạn (Bộ Nội vụ, 9/2026).</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người dân như ông Thể không phải xếp hàng hay mang theo chồng giấy tờ bản cứng, và có thể tự tra cứu hồ sơ của mình bằng mã QR. Với chứng thực, hộ tịch, kết quả được trả ngay trong ngày. Bà Đồng Thị Nhung, Giám đốc Trung tâm, cho biết mã QR giúp rút ngắn khoảng 30% thời gian giải quyết hồ sơ. Năm 2025, phường Thành Nam đạt 95,59/100 điểm, xếp thứ 1/129 xã, phường của tỉnh về bộ chỉ số phục vụ người dân và doanh nghiệp.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Bỏ một cấp hành chính không tự khiến thủ tục nhanh hơn. Ở Thành Nam, điều giữ cho hồ sơ đúng hạn là một thói quen giản dị: số hóa ngay từ quầy tiếp nhận, để mọi bước sau đó hiện trên hệ thống và người dân tự xem được.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://vietnamnet.vn/luc-keo-chinh-quyen-dia-phuong-2-cap-va-chuyen-it-biet-sau-82-000-ho-so-dung-han-o-ninh-binh-2500932.html" target="_blank" rel="noopener noreferrer">VietNamNet – 02/04/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://vietnamnet.vn/chuyen-nhung-can-bo-mang-uy-ban-ve-tan-nha-dan-2523268.html" target="_blank" rel="noopener noreferrer">VietNamNet – 15/06/2026</a></li></ul></section>
                `
            },
            9: {
                category: "Cơ quan nhà nước",
                title: "Nền tảng số dùng chung: Một thay đổi lớn trong đầu tư chuyển đổi số của cơ quan nhà nước",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-shared-digital-platform-2026.webp",
                imageAlt: "Các cơ quan cùng khai thác một nền tảng số và dữ liệu dùng chung",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Ngày 24/6/2026, Thủ tướng Chính phủ ban hành danh mục 79 nền tảng số dùng chung quốc gia. Điểm đáng nhớ không nằm ở con số 79, mà ở một dòng quy định: khi nền tảng chung đã vận hành, cơ quan, tổ chức không được đầu tư, mua sắm hay thuê hệ thống có chức năng tương tự.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Nhiều năm qua, các bộ, ngành, địa phương tự đầu tư xây dựng hệ thống số riêng lẻ, dẫn tới tình trạng đầu tư trùng lặp, chồng chéo. Các hệ thống vận hành tách biệt, nên người dân, doanh nghiệp phải nộp lại giấy tờ và nhập liệu nhiều lần ở những cơ quan khác nhau. Cùng một chức năng có thể được nhiều nơi làm song song, còn dữ liệu nằm ở nhiều chỗ nhưng khó chảy sang nhau.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Quyết định 1132/QĐ-TTg chuyển cách làm từ “mỗi nơi tự xây” sang “Trung ương đầu tư, các nơi dùng lại”. Nhóm A gồm 17 nền tảng dùng chung cho mọi ngành, như Cổng Dịch vụ công quốc gia, VNeID, Trục liên thông văn bản quốc gia, Trợ lý ảo quốc gia. Nhóm B gồm 62 nền tảng cho từng ngành, lĩnh vực.</p><p>Danh mục đi kèm ràng buộc: sau khi nền tảng dùng chung vào vận hành, cơ quan, tổ chức không đầu tư, xây dựng, mua sắm, thuê dịch vụ hoặc mở rộng phạm vi triển khai đối với hệ thống có chức năng, mục tiêu và phạm vi sử dụng tương tự, trừ trường hợp có yêu cầu đặc thù về quốc phòng, an ninh, cơ yếu hoặc theo pháp luật chuyên ngành. Khung kiến trúc tổng thể quốc gia số ban hành ngày 29/7/2026, tiếp tục xác định 79 nền tảng này sẽ được Trung ương đầu tư để các nơi sử dụng lại.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>24/6/2026: ban hành danh mục 79 nền tảng số dùng chung quốc gia (17 nền tảng nhóm A, 62 nền tảng nhóm B).</li><li>29/7/2026: ban hành Khung kiến trúc tổng thể quốc gia số (phiên bản 1.0), lấy 79 nền tảng làm phần dùng chung.</li><li>Lưu ý: đây là danh mục quy định cách đầu tư, không phải 79 hệ thống đã cùng vận hành; quyết định không nêu mốc hoàn thành cho từng nền tảng.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Về nguyên tắc, một xã, một sở hay một bộ sẽ dùng cùng nền tảng, cùng chuẩn, thay vì mỗi nơi tự lập dự án, mua sắm và vận hành phần mềm riêng. Với người dân, kỳ vọng được nêu rõ: khi dữ liệu kết nối, chia sẻ giữa các cơ quan, tình trạng khai báo nhiều lần cùng một thông tin sẽ giảm, thời gian giải quyết thủ tục được rút ngắn. Đó là kỳ vọng của chính sách, chưa phải kết quả đã đo.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Có những cải cách không hiện ra trên màn hình của người dân. Giá trị của danh mục này nằm ở việc thực thi: nền tảng chung phải đủ tốt để các cơ quan muốn dùng.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://baochinhphu.vn/ban-hanh-danh-muc-79-nen-tang-so-dung-chung-quoc-gia-102260625170609058.htm" target="_blank" rel="noopener noreferrer">Báo Điện tử Chính phủ – 25/06/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://mst.gov.vn/ban-hanh-danh-muc-79-nen-tang-so-dung-chung-quoc-gia-197260628124806314.htm" target="_blank" rel="noopener noreferrer">Cổng Thông tin điện tử Bộ Khoa học và Công nghệ – 28/06/2026</a></li></ul></section>
                `
            },
            10: {
                category: "Cơ quan nhà nước",
                title: "“Lên đời” cho Internet: Hạ tầng thầm lặng của chuyển đổi số",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-ipv6-infrastructure-2026.webp",
                imageAlt: "Kỹ sư mạng vận hành hạ tầng IPv6 kết nối các dịch vụ và thiết bị số",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Internet IPv4 chỉ có khoảng 4,3 tỷ địa chỉ và đã cạn kiệt từ năm 2019. Năm 2025, tỷ lệ sử dụng hệ địa chỉ mới IPv6 tại Việt Nam đạt gần 70%, gấp 1,6 lần mức trung bình toàn cầu, đứng thứ 7 thế giới và thứ 2 ASEAN.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Mỗi thiết bị kết nối Internet cần một địa chỉ, giống như mỗi ngôi nhà cần một số nhà. IPv4, giao thức lõi của Internet trong hơn 40 năm, chỉ có khoảng 4,3 tỷ địa chỉ, trong khi hàng tỷ thiết bị thông minh đang kết nối mỗi ngày. Thiếu địa chỉ, thiết bị phải đi qua bộ chuyển đổi địa chỉ mạng (NAT) mới ra được Internet. Nhà máy thông minh, giao thông thông minh, thành phố thông minh đều cần rất nhiều địa chỉ như vậy.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Việt Nam chuyển hệ địa chỉ ngay ở tầng hạ tầng. IPv6 có không gian địa chỉ gần như vô hạn, cho phép mọi thiết bị kết nối trực tiếp với Internet mà không cần qua NAT. Mạng băng rộng của các nhà mạng và hệ thống của cơ quan nhà nước lần lượt được chuyển sang IPv6.</p><p>Bước tiếp theo là IPv6-Only, tức mạng chỉ vận hành bằng IPv6. Tháng 6/2026, Trung tâm Internet Việt Nam (VNNIC) công bố bộ tiêu chí theo dõi, đo lường tiến độ chương trình chuyển đổi IPv6-Only giai đoạn 2026–2030. “Chuyển đổi IPv6-Only không chỉ là chuyển đổi công nghệ. Đây là quá trình hiện đại hóa hạ tầng internet quốc gia”, Thứ trưởng Phạm Đức Long nói.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Tỷ lệ sử dụng IPv6: 65,5% (cuối năm 2024) lên gần 70% (năm 2025); thứ 7 thế giới, thứ 2 ASEAN.</li><li>Khoảng 95 triệu thuê bao Internet băng rộng đang sử dụng và hoạt động tốt với IPv6 (6/2026).</li><li>86% bộ, ngành, địa phương đã chuyển cổng thông tin điện tử, cổng dịch vụ công và các hệ thống kết nối Internet sang IPv6.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Với phần lớn người dùng, thay đổi diễn ra phía sau màn hình: khoảng 95 triệu thuê bao băng rộng đã chạy trên IPv6. Với doanh nghiệp, đó là không gian để phát triển Internet vạn vật, điện toán đám mây, 5G. “Nếu ví Internet như một nền kinh tế thì IPv6 chính là hạ tầng giao thông của nền kinh tế đó”, ông Nguyễn Văn Dương, Tổng Giám đốc Công ty DV Viễn thông DTC, nói.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Đổi hệ địa chỉ cho cả một nền Internet giống như đánh lại số nhà cho cả nước. Ít ai để ý, nhưng những con đường mới như Internet vạn vật hay thành phố thông minh đều phải đi qua đó.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://thanhnien.vn/viet-nam-vao-top-7-the-gioi-ve-ty-le-su-dung-ipv6-185260619205859556.htm" target="_blank" rel="noopener noreferrer">Báo Thanh Niên – 21/06/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://mst.gov.vn/viet-nam-top-dau-the-gioi-ve-chuyen-doi-internet-the-he-thu-sau-nen-tang-xay-ha-tang-so-hung-manh-1972512131032478.htm" target="_blank" rel="noopener noreferrer">Cổng Thông tin điện tử Bộ Khoa học và Công nghệ – 17/12/2025</a></li></ul></section>
                `
            },
            11: {
                category: "Cơ quan nhà nước",
                title: "Hơn 72 tỷ USD giá trị tăng thêm của kinh tế số: Đo được mới quản lý được",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-digital-economy-measurement-2026.webp",
                imageAlt: "Nhóm chuyên gia phân tích số liệu đóng góp của kinh tế số tại Việt Nam",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Năm 2025, kinh tế số tạo ra khoảng 72,1 tỷ USD giá trị tăng thêm, tương đương 14,02% GDP, gấp 1,64 lần năm 2020. Đó là số liệu của Cục Thống kê, được tính cho cả nước và cho từng tỉnh, thành phố. Nhìn kỹ, nó cho thấy kinh tế số đang nằm ở đâu, và còn thiếu ở đâu.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Cùng là “kinh tế số Việt Nam năm 2025”, đang có hai con số rất khác nhau được trích dẫn. Báo cáo e-Conomy SEA 2025 của Google, Temasek và Bain &amp; Company ước quy mô kinh tế số Việt Nam chạm mốc 39 tỷ USD, trong đó thương mại điện tử khoảng 25 tỷ USD. Cục Thống kê công bố 72,1 tỷ USD. Đặt cạnh nhau mà không nói rõ cách đo, người đọc dễ nghĩ một trong hai con số sai.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Hai con số đo hai thứ khác nhau. Báo cáo quốc tế đo quy mô các dịch vụ trên Internet như thương mại điện tử, nội dung trực tuyến, gọi xe, giao đồ ăn, du lịch trực tuyến. Cục Thống kê (Bộ Tài chính) đo giá trị tăng thêm, tức phần đóng góp vào GDP, của hai nhóm: kinh tế số lõi, gồm 7 ngành như sản xuất sản phẩm điện tử, máy vi tính, viễn thông, xuất bản phần mềm, lập trình; và phần số hóa trong các ngành khác.</p><p>Cách đo này được áp cho từng địa phương. Năm 2025, bốn tỉnh, thành có kinh tế số trên 20% GRDP: Bắc Ninh 46,30%, Thái Nguyên 29,53%, Phú Thọ 22,71%, Hải Phòng 22,28%.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Tỷ trọng kinh tế số tăng liên tục: 12,87% GDP (2021) lên 14,02% GDP (2025), khoảng 72,1 tỷ USD.</li><li>Kinh tế số lõi đóng góp 8,42% GDP (43,3 tỷ USD), hơn 60% tổng giá trị; phần số hóa các ngành khác chiếm 5,6% GDP (28,8 tỷ USD).</li><li>Theo giá so sánh, kinh tế số năm 2025 tăng khoảng 11,8% so với năm 2024.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người dùng trực tiếp con số này là những người ra quyết định. Một lãnh đạo tỉnh nay biết kinh tế số chiếm bao nhiêu phần kinh tế địa phương mình, so được với tỉnh bạn. Một nhà hoạch định chính sách thấy rõ hơn 60% giá trị đến từ nhóm ngành lõi như điện tử, viễn thông, phần mềm, còn phần số hóa trong thương mại, tài chính, sản xuất mới khoảng 5,6% GDP.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Kinh tế số chỉ quản lý được khi đo bằng cùng một thước.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://www.nso.gov.vn/tin-tuc-thong-ke/2026/01/thong-cao-bao-chi-ty-trong-gia-tri-tang-them-cua-kinh-te-so-trong-gdp-grdp-giai-doan-2021-2025/" target="_blank" rel="noopener noreferrer">Cục Thống kê – Bộ Tài chính – 05/01/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://vietnamnet.vn/kinh-te-so-viet-nam-dat-39-ty-usd-nguoi-viet-dung-ai-nhieu-nhat-khu-vuc-2466271.html" target="_blank" rel="noopener noreferrer">VietNamNet – 25/11/2025</a></li></ul></section>
                `
            },
            12: {
                category: "Cơ quan nhà nước",
                title: "Muốn dạy bà con “lên sàn”, trước hết phải có chiếc điện thoại",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-border-smartphone-commerce-2026.webp",
                imageAlt: "Người dân vùng biên Lai Châu học dùng điện thoại để bán nông sản trực tuyến",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Khi bắt đầu đưa công nghệ số về vùng biên, Bộ đội Biên phòng Lai Châu gặp một thực tế: hơn 2.000 người dân chưa có điện thoại thông minh. Cán bộ, chiến sĩ góp tiền, cùng nhà hảo tâm mua hơn 1.600 chiếc điện thoại cho các hộ. Nay 80 hộ đã có gian hàng trên mạng.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Biên giới Lai Châu địa hình hiểm trở, dân cư phân tán. Khảo sát ban đầu cho thấy nơi đây còn nhiều “vùng lõm” sóng điện thoại, Internet, và hơn 2.000 người dân chưa có điện thoại thông minh. Dịch vụ công trực tuyến, VNeID hay bán hàng qua mạng vì thế còn xa lạ với nhiều gia đình. Ngay cả khi muốn thử, từ tạo tài khoản, làm cho gian hàng có sức hút, đến thanh toán và chở hàng từ vùng sâu về miền xuôi đều là những việc không đơn giản với bà con.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Bộ đội Biên phòng tỉnh lập 31 tổ công tác với 121 cán bộ, tổ chức 286 buổi tuyên truyền cho 18.250 lượt người. Nhưng địa bàn rộng, dân thưa, lớp học tập trung không đủ. Sau các buổi tập huấn chung, tổ tuyên truyền viên tỏa về bản, đến từng nhà “cầm tay chỉ việc”: tạo tài khoản, dựng kịch bản livestream, chốt đơn, đóng gói. Già làng, trưởng bản, thanh niên biết công nghệ được chọn làm nòng cốt để nhân rộng.</p><p>Để bà con có thiết bị mà học, cán bộ, chiến sĩ cùng đóng góp và vận động nhà hảo tâm mua hơn 1.600 điện thoại, trị giá hơn 3 tỷ đồng, trao cho các hộ có nhu cầu. Song song, một hòm thư điện tử cho phép người dân gửi tin báo, tố giác tội phạm ẩn danh.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>80 hộ dân vận hành gian hàng trên TikTok Shop, Shopee…, đưa sâm, trà cổ thụ, thảo quả, thịt trâu sấy “lên sàn” với tổng doanh thu trên 1 tỷ đồng.</li><li>Hơn 1.600 điện thoại, trị giá hơn 3 tỷ đồng, đã được trao cho các hộ dân.</li><li>Hòm thư điện tử ẩn danh: từ tháng 8/2025 đã tiếp nhận 190 tin, trong đó 103 tin có giá trị cao.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người được lợi trực tiếp là những gia đình ở bản xa. Các gian hàng như “Hà Nhì Sơ”, “Mạ Sừ Pư” của bà con xã Thu Lũm hay “Hảng Thị Nú” ở Sin Suối Hồ đã có hàng chục nghìn lượt thích, đưa sản phẩm đến thẳng người tiêu dùng. Theo Đại tá Trương Minh Đức, Chỉ huy trưởng Bộ đội Biên phòng tỉnh, mục tiêu ban đầu không phải biến cán bộ, chiến sĩ thành lập trình viên, mà giúp người dân biết dùng dịch vụ công trực tuyến, VNeID và tiếp cận thông tin chính thống.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Xóa mù số ở vùng biên bắt đầu từ một câu hỏi rất đơn giản: bà con đã có chiếc điện thoại chưa? Chỉ khi câu hỏi ấy được giải quyết, những bài học về livestream hay VNeID mới có chỗ để bắt đầu.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://vietnamnet.vn/no-luc-xoa-mu-so-vung-bien-khi-con-hon-2-000-nguoi-dan-chua-co-smartphone-2549030.html" target="_blank" rel="noopener noreferrer">VietNamNet – 27/08/2026</a></li></ul></section>
                `
            },
            13: {
                category: "Cơ quan nhà nước",
                title: "Khi bác sĩ “tự tay” thiết kế lại quy trình cấp cứu bằng chuyển đổi số",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-emergency-digital-workflow-2026.webp",
                imageAlt: "Bác sĩ và điều dưỡng vận hành quy trình phân loại cấp cứu trên hệ thống số",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Ở Trung tâm Cấp cứu – Hồi sức, Bệnh viện Đại học Y Hà Nội, tiếng gọi nhau í ới gần như đã biến mất. Trước đây, khoảng 90–95 bệnh nhân là khoa có nguy cơ quá tải. Nay có lúc khoa tiếp nhận đồng thời 150 người mà vẫn kiểm soát được. Người tạo ra thay đổi là một bác sĩ cấp cứu.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Cấp cứu là nơi bệnh nhân vào liên tục, bệnh đủ loại: nội khoa, ngoại khoa, chấn thương, sản, nhi. Mọi mệnh lệnh truyền bằng miệng. Bác sĩ gọi điều dưỡng, điều dưỡng hỏi lại, ghi chép rồi chạy đi tìm nhau. Việc theo dõi ai nặng, ai nhẹ phụ thuộc nhiều vào giấy tờ và trí nhớ của nhân viên. Khi người bệnh dồn đến, khoa rất dễ rơi vào quá tải và hỗn loạn. Mà ở cấp cứu, chậm vài phút có thể phải đánh đổi bằng tính mạng người bệnh.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Bác sĩ Ngô Đức Hùng, Phó Giám đốc Trung tâm, không bắt đầu từ phần mềm. Ông dành khoảng ba tháng xây dựng lại quy trình và thiết kế giao diện, rồi thêm một tháng cùng bộ phận công nghệ thông tin hoàn thiện công cụ. Theo ông, phần mềm “phải được xây dựng từ chính người làm cấp cứu chứ không phải từ góc nhìn của lập trình viên”.</p><p>Nay, điều dưỡng đo dấu hiệu sinh tồn, mức độ đau, huyết áp, nhịp tim và nhập vào hệ thống. Phần mềm gợi ý mức độ nguy kịch theo bốn màu đỏ, cam, vàng, xanh. Bác sĩ ra y lệnh trên phần mềm; điều dưỡng nhận thông báo ngay và phải xác nhận đã làm thì y lệnh mới hoàn thành. Chỉ sau một tuần thử nghiệm, toàn khoa đã chuyển hẳn sang cách làm mới.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Sức tiếp nhận: từ mức khoảng 90–95 bệnh nhân đã có nguy cơ quá tải, nay có thời điểm tiếp nhận đồng thời 150 bệnh nhân mà vẫn kiểm soát được.</li><li>Theo bác sĩ Hùng, nhiều tác vụ tăng hiệu quả tới 10 lần.</li><li>Dịp Tết Nguyên đán Bính Ngọ 2026, Trung tâm tiếp nhận xấp xỉ 1.000 lượt bệnh nhân, tăng gần 30% so với Tết năm trước; 60–70% thuộc nhóm cảnh báo cao (ngày thường khoảng 35–40%).</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người được lợi trước hết là bệnh nhân nặng. Một nữ bệnh nhân sinh năm 1999 vào viện trong tình trạng tiền sốc; chưa đầy 3 giờ sau, chức năng tim suy giảm nhanh. Hệ thống báo động đa chuyên khoa được kích hoạt; các bác sĩ hội chẩn với chuyên gia tim mạch, triển khai ECMO. Sau những ngày nằm hồi sức tích cực, chị đã qua cơn nguy kịch và có lại nhận thức. Nhân viên y tế không phải nhớ quá nhiều việc cùng lúc. Người nhà có thể quét mã QR ở đầu giường để theo dõi tình trạng điều trị.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Ba tháng sắp xếp lại quy trình, một tháng viết phần mềm. Tỷ lệ ấy cho thấy phần khó nhất của chuyển đổi số không nằm ở công nghệ, mà ở việc người trong nghề chịu ngồi xuống thiết kế lại cách mình làm việc.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://vietnamnet.vn/su-yen-tinh-la-thuong-o-mot-trung-tam-cap-cuu-tuyen-cuoi-2533194.html" target="_blank" rel="noopener noreferrer">VietNamNet – 08/07/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://nhandan.vn/khi-bac-si-luoichien-luoc-trong-ky-nguyen-so-post945081.html" target="_blank" rel="noopener noreferrer">Báo Nhân Dân điện tử – 27/02/2026</a></li></ul></section>
                `
            },
            14: {
                category: "Cơ quan nhà nước",
                title: "Tìm một mẫu bệnh phẩm: từ 5 phút còn 20 giây",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-pathology-sample-indexing-2026.webp",
                imageAlt: "Kỹ thuật viên sắp xếp mẫu bệnh phẩm trong hộp chuẩn và quản lý vị trí trên máy tính",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Mỗi năm, Khoa Giải phẫu bệnh, Bệnh viện Nhi Trung ương lưu khoảng 20.000 mẫu sinh thiết dạ dày. Tìm lại một mẫu từng mất trung bình 5 phút; nay chỉ còn 10–20 giây. Thứ làm nên thay đổi là những chiếc hộp carton đúng kích cỡ và một bảng tính trực tuyến.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Sau khi có kết quả xét nghiệm, tiêu bản và khối nến chứa bệnh phẩm phải được lưu từ 3 năm đến hơn 10 năm, để đối chiếu, hội chẩn hay làm thêm xét nghiệm. Nhưng tiêu bản được xếp vào hộp giấy cũ, mã số viết tay, khối nến đựng trong túi zip. Mẫu chồng lấp, dễ xô lệch, không có phần mềm ghi vị trí. Mỗi lần cần một mẫu, nhân viên mất trung bình 5 phút để tìm. Còn tủ chuyên dụng nhập khẩu thì tốn hàng trăm triệu đồng mỗi năm.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Nguyễn Thị Quỳnh Giang và các đồng nghiệp trong khoa bắt đầu từ thứ vật lý nhất: chiếc hộp. Túi zip và hộp tận dụng được thay bằng hộp carton thiết kế riêng cho từng loại mẫu. Hộp tiêu bản kích thước chuẩn 75 x 26 mm, chia hàng, chia cột rõ ràng. Hộp khối nến 29 x 41 x 6 mm, có vách ngăn giữ khối nến thẳng hàng, tránh gãy vỡ, nhiễm bẩn.</p><p>Khi mọi hộp đã theo một chuẩn, việc số hóa trở nên đơn giản. Mỗi hộp được mã hóa thông tin đầu – cuối. Thông tin bệnh nhân, mã bệnh phẩm và vị trí hộp được quản lý đồng bộ trên phần mềm bệnh viện và bảng tính trực tuyến (Google Sheets/Excel). Cần mẫu nào, tra bảng là biết nằm ở hộp nào, như tìm một cuốn sách trong thư viện.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Thời gian tìm một mẫu: từ trung bình 5 phút xuống 10–20 giây.</li><li>Chi phí lưu trữ 20.000 mẫu: khoảng 1,1 triệu đồng/năm, thấp hơn khoảng 93 lần so với phương án tủ chuyên dụng (khoảng 103 triệu đồng/năm).</li><li>Theo khoa, sau 8 tháng triển khai (tháng 1–8/2025) không còn tình trạng thất lạc, xô lệch hay hư hỏng mẫu do bảo quản không phù hợp.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Nhân viên khoa bớt áp lực tìm kiếm thủ công, có thêm thời gian cho chuyên môn xét nghiệm. Với bệnh nhi, mẫu lưu là “bằng chứng y học”: khi cần gửi mẫu đi hội chẩn, thời gian chờ được rút ngắn. Mẫu được bảo quản tốt cũng là cơ sở để làm thêm xét nghiệm chuyên sâu như hóa mô miễn dịch hay xét nghiệm gen mà người bệnh không phải sinh thiết lần hai.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Trước khi nhập dòng dữ liệu đầu tiên, nhóm đã chuẩn hóa từng chiếc hộp. Bảng tính chỉ phát huy tác dụng khi những thứ nó mô tả đã ngăn nắp. Chuyển đổi số bắt đầu từ chuẩn hóa dữ liệu.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://benhviennhitrunguong.gov.vn/luu-tru-mau-giai-phau-benh-sang-kien-cai-tien-dot-pha-tai-bvntw.html" target="_blank" rel="noopener noreferrer">Cổng thông tin điện tử Bệnh viện Nhi Trung ương – 05/02/2026</a></li></ul></section>
                `
            },
            15: {
                category: "Cơ quan nhà nước",
                title: "Chợ quê vùng Khmer bớt đếm tiền lẻ",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-khmer-market-cashless-2026.webp",
                imageAlt: "Tiểu thương tại chợ quê Vĩnh Long nhận thanh toán bằng điện thoại",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Xã Long Hiệp (Vĩnh Long) là vùng sâu, 80,6% dân số là đồng bào Khmer. Ở hai chợ của xã, tiểu thương được hỗ trợ mở tài khoản ngân hàng và niêm yết mã QR cá nhân tại sạp. Một lần mua bán có thể xong trong vài giây, người bán không phải chuẩn bị tiền lẻ.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Ở chợ quê, tiền mặt từ lâu là phương thức thanh toán phổ biến. Người bán phải chuẩn bị tiền lẻ, thu, thối từng khoản nhỏ. Tiền mặt giữ ở quầy cả ngày kéo theo nguy cơ tiền giả, tiền rách, nhầm lẫn khi thu – trả. Với nhiều người dân vùng sâu, tài khoản ngân hàng, ví điện tử còn xa lạ. Trình độ và khả năng tiếp cận công nghệ không đồng đều; tâm lý e ngại phương thức thanh toán mới là rào cản lớn.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Xã triển khai mô hình “Chợ 4.0” tại Chợ Long Hiệp và Chợ Tha La, lấy thanh toán không dùng tiền mặt làm điểm khởi đầu. Cách làm là đưa người hướng dẫn ra tận chợ. Xã lập điểm hỗ trợ trực tiếp ở hai chợ; Tổ công nghệ số cộng đồng, đoàn viên, hội viên “cầm tay chỉ việc”: mở tài khoản, cài ứng dụng ngân hàng hoặc ví điện tử, tạo mã QR và thực hiện giao dịch.</p><p>Bước tiếp theo, địa phương dự kiến trang bị 93 bộ bảng mã QR kèm loa tự động đọc thông báo giao dịch, để người bán biết tiền đã về mà không phải mở điện thoại sau mỗi lần bán. Thanh toán số cũng sẽ mở rộng sang tiền thuê mặt bằng, tiền điện, nước, phí giữ xe tại chợ.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Viettel Vĩnh Long đã hỗ trợ triển khai “Chợ 4.0” tại 13 chợ trong tỉnh (tính đến giữa tháng 9/2026).</li><li>Đến 10/9/2026, 35 xã, phường của Vĩnh Long đã ban hành kế hoạch triển khai “Chợ 4.0” tại 49 chợ, tổng kinh phí dự kiến khoảng 754,7 triệu đồng.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Bà Lâm Thị Ngọc Điệp, bán trái cây ở chợ Long Hiệp, nhận xét: “Đối với các hộ kinh doanh nhỏ, thay đổi này không lớn về thao tác nhưng có ý nghĩa trong việc hình thành phương thức giao dịch mới.” Theo bà, tiểu thương giữ ít tiền mặt ở quầy hơn, bớt lo tiền giả, tiền rách. Người mua không cần mang sẵn tiền mặt, có thể xem lại lịch sử giao dịch trên ứng dụng. Với nhiều người dân nông thôn, đó là bước đầu làm quen với dịch vụ tài chính số.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Ở chợ quê, trở ngại lớn nhất của thanh toán số không phải là thiết bị, mà là sự e ngại. Vì thế, mô hình đặt người hướng dẫn ngay giữa chợ, trước khi nói đến loa hay bảng mã.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://www.vietnamplus.vn/nghi-quyet-57-nqtw-cho-que-bat-nhip-chuyen-doi-so-post1136054.vnp" target="_blank" rel="noopener noreferrer">VietnamPlus (TTXVN) – 15/09/2026</a></li></ul></section>
                `
            },
            16: {
                category: "Cơ quan nhà nước",
                title: "Tờ giấy chuyển viện không còn nỗi lo sợ ướt mỗi lần qua đò",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-camau-digital-referral-2026.webp",
                imageAlt: "Người dân Cà Mau xem giấy chuyển viện điện tử trên điện thoại khi đi đò",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Ở xã Năm Căn (Cà Mau), mỗi lần nhận giấy chuyển tuyến, ông Hải lại gói ghém cẩn thận suốt chặng đò về nhà, sợ rách, sợ ướt lại phải “lặn lội” thêm lần nữa. Nay giấy tờ ấy có thêm bản trên điện thoại. “Mình đi khám ở đâu thì đưa cho bác sĩ là được”, ông nói.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Cà Mau là vùng sông nước, kênh rạch chằng chịt; khoảng cách địa lý cộng với thủ tục khiến việc đi khám thành gánh nặng. Chị Liên Hoa ở phường Bạc Liêu, mỗi lần đưa mẹ đi tái khám, phải xin nghỉ việc, đến bệnh viện từ sớm tinh mơ xếp hàng lấy số rồi ngồi chờ. Ở trạm y tế xã, nhân viên như chị Ly, một y tá, dành phần lớn thời gian cho việc viết tay sổ khám bệnh, tìm hồ sơ trong kho, xuống từng nhà vận động tiêm chủng, tầm soát.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Ngành y tế Cà Mau đưa một phần thủ tục lên ứng dụng nhắn tin quen thuộc của người dân. Năm 2025 và 2026, Sở Y tế phối hợp với Zalo tập huấn, kết nối 310 điểm cầu, từ bệnh viện đến trạm y tế xã, phường. Cán bộ y tế được hướng dẫn dùng kênh chính thức để cấp giấy chuyển viện, ra viện điện tử, nhận đăng ký, gửi giấy mời tiêm chủng.</p><p>Ở Trạm Y tế xã U Minh, kênh này chạy từ tháng 10/2025. Có giấy chuyển viện bản cứng, người dân gửi thông tin vào kênh của trạm và được cấp bản điện tử ngay trên điện thoại, không phải quay lại bệnh viện nhiều lần. Bệnh viện Đa khoa Bạc Liêu mở thêm ứng dụng nhỏ để người bệnh lấy số khám từ hôm trước, theo dõi lịch hẹn, nhắc tái khám.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>310 điểm cầu y tế toàn tỉnh, từ bệnh viện đến trạm y tế xã, phường, được tập huấn và kết nối trong năm 2025–2026.</li><li>Bệnh viện Đa khoa Bạc Liêu là cơ sở đầu tiên ở Cà Mau cho người bệnh đăng ký, lấy số khám trước qua ứng dụng.</li><li>Theo Sở Y tế Cà Mau, đến cuối năm 2025, cả 31 cơ sở khám chữa bệnh của tỉnh đã hoàn thành thẩm định, công bố bệnh án điện tử.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Chị Liên Hoa giờ lấy số khám cho mẹ từ hôm trước. “Đến giờ là chở má qua bệnh viện thôi, chẳng cần chen chúc, chờ đợi ở bệnh viện nữa. Giờ hai má con đi chữa bệnh khỏe re”, chị kể. Ông Hải thừa nhận lần đầu làm “còn lọng cọng”, nhưng “đỡ hơn cứ cầm giấy tờ chạy qua chạy lại bệnh viện”. Trạm y tế cũng dùng kênh này để gửi lịch tiêm chủng, thông báo khám chữa bệnh miễn phí.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Ở vùng sông nước, bớt được một chuyến đò chỉ để lấy tờ giấy đã là thay đổi lớn. Dịch vụ công đến được với người dân khi nó được đặt vào đúng nơi họ vẫn dùng mỗi ngày.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://baomoi.com/bac-nhung-cay-cau-so-cho-nguoi-dan-ca-mau-toi-vien-de-dang-c55660532.epi" target="_blank" rel="noopener noreferrer">Tạp chí Tri thức – Znews (đăng lại trên Báo Mới) – 21/07/2026</a></li></ul></section>
                `
            },
            17: {
                category: "Cơ quan nhà nước",
                title: "Nơi gieo mầm kỹ năng số vùng biên",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-border-digital-literacy-2026.webp",
                imageAlt: "Người dân vùng biên Nghệ An học kỹ năng số trong phòng máy cộng đồng",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Ở đầu bản Huồi Cáng 1, xã Bắc Lý, mỗi buổi chiều, “Ngôi nhà thiện nguyện” của Đồn Biên phòng Mỹ Lý lại rộn ràng không khí học tập. Bà con đến để bộ đội chỉ cách cài VNeID, nộp hồ sơ trực tuyến. Phòng máy của đơn vị cũng mở cửa, ai muốn tập lúc nào cũng được.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Với người dân hai xã biên giới Bắc Lý, Mỹ Lý (Nghệ An), làm một thủ tục hành chính đồng nghĩa với một chuyến đi xa. “Trước đây làm thủ tục phải đi xa hàng chục cây số đường rừng, trời khô ráo còn đỡ chứ mưa gió thì vất vả lắm”, anh Cụt Văn Khuyên, bản Huồi Cáng 2, kể. Dịch vụ công trực tuyến với nhiều người chỉ là điều “nghe nói đến”. Thao tác trên điện thoại còn bỡ ngỡ, tâm lý e ngại vẫn nặng.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Đồn Biên phòng Mỹ Lý mở lớp “Bình dân học vụ số” ngay tại Ngôi nhà thiện nguyện của đơn vị. Lớp học vào lúc nông nhàn, do cán bộ của đồn trực tiếp phụ trách. Bộ đội “cầm tay chỉ việc”: cài và dùng ứng dụng trên điện thoại, đăng ký định danh điện tử, làm dịch vụ công; kèm theo cách phòng tránh lừa đảo trực tuyến, kiến thức an toàn thông tin.</p><p>Đơn vị tận dụng trang thiết bị sẵn có, phối hợp với chính quyền hai xã bồi dưỡng lực lượng nòng cốt ở từng bản để họ hướng dẫn lại cho người khác. “Phòng máy của đơn vị cũng được mở rộng, bà con có thể đến thực hành bất cứ lúc nào”, Trung tá Nguyễn Xuân Hóa, Chính trị viên phó Đồn, cho biết.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Nhiều người dân đã tự cài VNeID, đăng ký định danh điện tử, nộp hồ sơ qua Cổng dịch vụ công quốc gia và làm một số thủ tục cơ bản ngay tại nhà.</li><li>Lực lượng nòng cốt ở từng bản được bồi dưỡng để tiếp tục hướng dẫn người dân; nhiều phụ nữ trung niên cũng tham gia các buổi học.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Với người dân hai xã biên giới, một thủ tục không còn đồng nghĩa với một chuyến đi xuyên rừng. “Nay được bộ đội hướng dẫn làm ngay trên điện thoại, máy tính rất tiện. Ở đâu có sóng là làm được việc”, anh Khuyên nói. Chị Lữ Thị Đun, bản Huồi Cáng 1, kể: “Người biết nhiều hướng dẫn người biết ít, người biết ít lại chỉ cho người chưa biết. Ai cũng muốn học”.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Điều quý nhất đồn biên phòng mang đến cho bản không phải là quà, mà là một chỗ để tập. Có phòng máy mở cửa và người kèm cặp, kỹ năng số mới thật sự bám lại trong bản.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://baotuyenquang.com.vn/khoa-hoc-cong-nghe/202601/bo-doi-trang-bi-ky-nang-so-cho-dong-bao-bien-gioi-85124aa/" target="_blank" rel="noopener noreferrer">Báo Tuyên Quang (theo Báo Quân đội nhân dân) – 06/01/2026</a></li></ul></section>
                `
            },
            18: {
                category: "Cơ quan nhà nước",
                title: "Cục Tần số phát hiện hàng nghìn tàu khách, tàu du lịch vi phạm nhờ đối soát dữ liệu",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-radio-frequency-data-2026.webp",
                imageAlt: "Chuyên viên đối soát dữ liệu đăng kiểm tàu và giấy phép tần số trên bản đồ biển",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Cục Tần số Vô tuyến điện không lắp thêm trạm kiểm soát nào. Họ lấy dữ liệu 2.561 tàu khách, tàu du lịch từ Cục Đăng kiểm, đối soát với dữ liệu cấp phép tần số của mình. Kết quả: 60% số tàu không có giấy phép tần số.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Trước đây, 95% vi phạm tần số được phát hiện nhờ hệ thống kiểm soát kỹ thuật, phần còn lại qua thanh tra định kỳ. Nhưng hệ thống ấy không phủ hết vùng biển, vùng sâu, vùng xa hay đô thị có hạ tầng phức tạp. “Hệ thống kiểm soát thực sự không với hết được. Nếu đi kiểm tra trực tiếp thì không có nhân lực”, ông Lê Văn Tuấn, Cục trưởng Cục Tần số Vô tuyến điện, nói. Tàu thuyền dùng thiết bị vô tuyến không phép vì thế vẫn nằm ngoài tầm với.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Cục chuyển từ dò tìm tín hiệu sang tìm điểm bất hợp lý trong dữ liệu. Theo quy định, tàu liên quan đến an toàn con người trên biển phải có thiết bị vô tuyến và phải đăng kiểm. Tàu đã đăng kiểm mà chưa có giấy phép tần số là đối tượng cần kiểm tra. Cục Tần số thí điểm kết nối dữ liệu với Cục Đăng kiểm Việt Nam, đối soát và phân tích bằng AI.</p><p>Danh sách nghi vấn được kiểm chứng bằng đoàn liên ngành giám sát thực tế hơn 500 phương tiện. Mục tiêu chính không phải xử phạt mà là tăng tuân thủ: doanh nghiệp nhận cảnh báo cụ thể; ai cố tình mới bị phạt. Chiều ngược lại, khoảng 200 tàu khai có thiết bị vô tuyến nhưng “đang cất trong kho” được chuyển cho Cục Đăng kiểm xử lý.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Đối soát 2.561 tàu khách, tàu du lịch: 60% không có giấy phép tần số; riêng Quảng Ninh là 84%.</li><li>Giám sát thực tế tại Hải Phòng: 10/10 doanh nghiệp được kiểm tra đều có sai phạm.</li><li>Chỉ sau một tháng thí điểm vừa nhắc nhở vừa xử phạt, số doanh nghiệp đến làm thủ tục cấp phép “tăng vọt”; từ tháng 11/2025, 14 doanh nghiệp bị phạt tổng cộng 250 triệu đồng.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Với cơ quan quản lý, phát hiện vi phạm không còn phụ thuộc vào việc trạm kiểm soát có phủ tới nơi hay không, cũng không cần đi dò từng con tàu. Với doanh nghiệp, cảnh báo đến đúng đối tượng, và nhiều nơi đã tự đến làm thủ tục cấp phép. Quy định buộc tàu trên biển trang bị thiết bị vô tuyến là vì an toàn con người; khi những con tàu chở khách được quản lý đầy đủ hơn, người hưởng lợi sau cùng là hành khách, du khách.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Hai cơ sở dữ liệu của hai bộ đã có từ lâu. Chỉ khi được đặt cạnh nhau, chúng mới cho thấy điều mà trạm kiểm soát không nhìn thấy. Đôi khi, chuyển đổi số là đặt đúng câu hỏi cho dữ liệu sẵn có.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://vietnamnet.vn/phat-hien-hang-nghin-tau-ca-vi-pham-linh-vuc-tan-so-chi-bang-mot-thay-doi-nho-2480847.html" target="_blank" rel="noopener noreferrer">VietNamNet – 11/01/2026</a></li></ul></section>
                `
            },
            19: {
                category: "Doanh nghiệp",
                title: "Từ tài sản thế chấp đến dữ liệu: Một cách mới để doanh nghiệp nhỏ tiếp cận vốn",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-data-based-sme-lending-2026.webp",
                imageAlt: "Chủ doanh nghiệp nhỏ trao đổi khoản vay dựa trên dữ liệu bán hàng và dòng tiền",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Với nhiều hộ kinh doanh và doanh nghiệp nhỏ, cánh cửa ngân hàng thường khép lại ở câu hỏi: tài sản bảo đảm đâu? MISA Lending dùng một căn cứ khác: hóa đơn, doanh thu, dòng tiền mà chính doanh nghiệp tạo ra mỗi ngày. Sau 5 năm, 40.090 tỷ đồng đã được giải ngân qua nền tảng này.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Theo số liệu được TheLEADER dẫn, hơn 93% khoản vay tại Việt Nam yêu cầu tài sản thế chấp; 75,5% doanh nghiệp nhỏ và vừa phản ánh không thể vay ngân hàng nếu thiếu tài sản bảo đảm. Hồ sơ tài chính của khối này thường manh mún. Hồ sơ phức tạp, thời gian xét duyệt kéo dài. Ở phía bên kia, ngân hàng lại thiếu công cụ thẩm định nhanh dựa trên dòng tiền thực tế. Doanh nghiệp nhỏ vì thế khó chứng minh mình đủ sức trả nợ theo cách ngân hàng quen đọc.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>MISA Lending được gắn thẳng vào phần mềm bán hàng, kế toán và hóa đơn điện tử mà doanh nghiệp dùng hằng ngày. Trước đây, muốn vay, doanh nghiệp phải tự lập hồ sơ chứng minh năng lực tài chính. Nay, khi có nhu cầu, nền tảng tự tổng hợp dữ liệu doanh nghiệp đồng ý chia sẻ – hóa đơn điện tử, doanh thu, dòng tiền – rồi phân tích và đề xuất khoản vay phù hợp để ngân hàng xét duyệt.</p><p>MISA gọi đích đến là “5-1-0”: 5 phút hoàn thiện hồ sơ, 1 ngày có kết quả phê duyệt, 0 tài sản bảo đảm với các sản phẩm phù hợp. Con đường không ngắn: 2022–2024 là giai đoạn khó khăn nhất; đến năm 2025 nền tảng mới thực sự tăng tốc.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Giải ngân lũy kế sau 5 năm: 40.090 tỷ đồng; tổng hạn mức được cấp: 23.860 tỷ đồng.</li><li>Riêng năm 2025: 18.725 tỷ đồng giải ngân, gần một nửa con số lũy kế.</li><li>Tỷ lệ hồ sơ vay thành công 36,2%, theo MISA cao gấp 10 lần vay tín chấp truyền thống.</li><li>16 ngân hàng kết nối, phục vụ khoảng 400.000 doanh nghiệp, hộ kinh doanh trong hệ sinh thái MISA.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người được lợi là chủ hộ kinh doanh, chủ doanh nghiệp nhỏ, những người trước đây thường dừng lại ở yêu cầu tài sản bảo đảm. Họ không phải dựng bộ hồ sơ mới: dữ liệu đã nằm sẵn trong phần mềm họ dùng để bán hàng, xuất hóa đơn, ghi sổ. Ngân hàng có được bức tranh cập nhật hơn về sức khỏe tài chính của khách hàng. Bà Nguyễn Thị Ngoan, Phó Tổng Giám đốc Tập đoàn MISA, nói: “dữ liệu vận hành chính là một loại hạ tầng mới”.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Thông tin tốt nhất về một doanh nghiệp nhỏ không nằm trong bộ hồ sơ họ chuẩn bị để đi vay, mà trong hóa đơn, sổ sách họ vẫn làm mỗi ngày. Khi tín dụng tìm đến nơi dữ liệu đã có sẵn, rào cản thế chấp hạ xuống.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://baochinhphu.vn/hang-tram-ngan-ho-kinh-doanh-duoc-giai-ngan-40090-ty-dong-voi-misa-lending-102260818160940306.htm" target="_blank" rel="noopener noreferrer">Báo điện tử Chính phủ – 18/08/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://theleader.vn/tu-hon-40000-ty-dong-duoc-giai-ngan-den-chien-luoc-du-lieu-la-ha-tang-cua-misa-lending-d47599.html" target="_blank" rel="noopener noreferrer">TheLEADER – 11/09/2026</a></li></ul></section>
                `
            },
            20: {
                category: "Doanh nghiệp",
                title: "Giảm từ 12% lỗi xuống 0,5% số sản phẩm lỗi: Khi dữ liệu thay đổi cách một nhà máy vận hành",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-smart-plastic-factory-2026.webp",
                imageAlt: "Kỹ sư theo dõi dữ liệu chất lượng theo thời gian thực trong nhà máy nhựa thông minh",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Ở Công ty TNHH Nhựa An Lập (Bắc Ninh), cứ 100 sản phẩm từng có 12 sản phẩm lỗi. Sau đợt tư vấn nhà máy thông minh cùng chuyên gia Samsung Việt Nam năm 2025, con số ấy còn 0,5. Nhưng doanh nghiệp coi giá trị lớn nhất là cách đội ngũ chuyển sang điều hành bằng dữ liệu.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>An Lập làm sản phẩm nhựa kỹ thuật cho ngành điện – điện tử và công nghiệp hỗ trợ. Khách hàng ngày càng đòi hỏi cao về chất lượng, tiến độ và khả năng truy xuất dữ liệu sản xuất. Trong khi đó, tỷ lệ lỗi sản phẩm của doanh nghiệp ở mức 12%, tỷ lệ hoàn thành kế hoạch sản xuất chỉ 80%. Theo Sở Công Thương Bắc Ninh, trước đây nhiều doanh nghiệp trong tỉnh quản lý dữ liệu rời rạc, thông tin sản xuất cập nhật theo ngày hoặc theo tuần, nên điều hành thiếu kịp thời.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Chương trình phát triển nhà máy thông minh là hợp tác giữa Bộ Công Thương, tỉnh Bắc Ninh và Samsung Việt Nam; chuyên gia được cử đến làm việc trực tiếp tại doanh nghiệp. Ở An Lập, họ cùng doanh nghiệp dựng một hệ thống kết nối bốn mảng vốn tách rời: sản xuất, kho, quản lý chất lượng và thiết bị. Song song là chuẩn hóa quy trình và cải tiến trực tiếp trên dây chuyền.</p><p>Cách điều hành vì thế đổi khác. Từ chỗ số liệu rời rạc, doanh nghiệp chuyển sang quản lý dữ liệu theo thời gian thực. Ban lãnh đạo theo dõi sát tình trạng sản xuất, phát hiện sớm điểm nghẽn và kịp thời điều chỉnh kế hoạch. Các bộ phận phối hợp chặt hơn, bớt phụ thuộc vào xử lý thủ công.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Tỷ lệ lỗi sản phẩm: từ 12% xuống 0,5%.</li><li>Tỷ lệ hoàn thành kế hoạch sản xuất: từ 80% lên 92%.</li><li>Mức độ thông minh của nhà máy theo thang đánh giá của Samsung: từ 1,7 lên 2,8.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Với đội ngũ quản lý và kỹ thuật của An Lập, thay đổi lớn nhất nằm ở cách làm việc: theo đại diện doanh nghiệp, họ đã chuyển dần sang điều hành dựa trên dữ liệu và các chỉ số vận hành cụ thể. Ít phế phẩm hơn nghĩa là bớt lãng phí nguyên vật liệu. Với khách hàng công nghiệp, kế hoạch hoàn thành đều hơn là tiến độ giao hàng đáng tin hơn. Chất lượng ổn định cũng mở đường để doanh nghiệp vào sâu hơn chuỗi cung ứng của các khách hàng lớn.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Con số đẹp nhất ở An Lập là tỷ lệ lỗi. Nhưng điều doanh nghiệp tự đánh giá là quý nhất lại là một thói quen mới: nhìn vào dữ liệu trước khi quyết định. Thiết bị có thể mua; thói quen ấy thì phải tự xây.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://vietnamnet.vn/tu-van-cua-samsung-giup-nhua-an-lap-nang-manh-hieu-qua-san-xuat-2477414.html" target="_blank" rel="noopener noreferrer">VietNamNet – 19/10/2025</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://www.vietnamplus.vn/bac-ninh-nha-may-thong-minh-giup-doanh-nghiep-nang-hieu-qua-quan-tri-post1127337.vnp" target="_blank" rel="noopener noreferrer">TTXVN/Vietnam+ – 31/07/2026</a></li></ul></section>
                `
            },
            21: {
                category: "Doanh nghiệp",
                title: "Tự động một việc nhỏ, tiết kiệm lớn: Khi AI đi vào từng cửa hàng",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-ai-retail-replenishment-2026.webp",
                imageAlt: "Nhân viên siêu thị theo dõi dự báo bổ sung hàng tự động trên máy tính bảng",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Ở chuỗi WinMart/WinMart+, đặt hàng bổ sung là việc lặp lại mỗi ngày tại từng cửa hàng. Công cụ “Tự động bổ sung hàng” đã tự động hóa hơn 66% quy trình ấy. Theo WinCommerce, khối lượng công việc tại cửa hàng giảm khoảng 15%, tương đương tiết kiệm gần 300 tỷ đồng mỗi năm.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>WinCommerce, công ty bán lẻ của Masan, vận hành chuỗi WinMart/WinMart+ với hàng nghìn cửa hàng. Ở mỗi điểm bán, câu hỏi hằng ngày là mặt hàng nào sắp hết, nhập thêm bao nhiêu. Đặt thiếu, khách đến không có hàng; đặt thừa, hàng tồn và dễ hao hụt. Khi đơn bổ sung được lập tại cửa hàng, việc này chiếm một phần đáng kể thời gian của nhân viên. Nhân lên theo quy mô cả chuỗi, mỗi sai lệch nhỏ đều thành chi phí.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Công cụ “Tự động bổ sung hàng” lấy dữ liệu bán hàng và dự báo nhu cầu bằng trí tuệ nhân tạo để lập đơn thay cho phần lớn thao tác thủ công, với mục tiêu giảm lãng phí và bảo đảm hàng luôn sẵn tại điểm bán. Theo công bố tháng 11/2025, hơn 66% quy trình đặt hàng tại các cửa hàng đã được tự động hóa. Doanh nghiệp đặt mục tiêu nâng tỷ lệ này lên trên 90% vào cuối năm 2026.</p><p>Cách chọn nơi mở cửa hàng cũng đổi. Hệ thống “Chấm điểm địa điểm” dùng dữ liệu tiêu dùng từ hơn 400.000 điểm bán trên toàn quốc để đánh giá tiềm năng từng khu vực trước khi mở điểm mới, nhất là ở nông thôn.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Hơn 66% quy trình đặt hàng tại cửa hàng WinMart/WinMart+ đã tự động hóa.</li><li>Khối lượng công việc tại cửa hàng giảm khoảng 15%; theo doanh nghiệp, tương đương tiết kiệm gần 300 tỷ đồng mỗi năm.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Với nhân viên cửa hàng, khoảng 15% khối lượng công việc được cắt bớt, phần lớn ở khâu lặp lại nhất là lập đơn nhập hàng. Với người mua, đích của dự báo nhu cầu là hàng hóa luôn sẵn trên kệ, bớt cảnh đến nơi thì hết hàng. Ở nông thôn, nơi có hơn 60% dân số, dữ liệu giúp chọn vị trí mở cửa hàng mới. Lãnh đạo Masan nói doanh nghiệp “không theo đuổi công nghệ xa vời, mà tập trung giải quyết những bài toán thực tế của kinh doanh”.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Ở một chuỗi hàng nghìn cửa hàng, cải tiến đáng giá nhất không cần phức tạp nhất: chỉ cần tự động hóa đúng một việc lặp lại mỗi ngày ở mọi điểm bán. Bớt 15% việc ở một cửa hàng là nhỏ; nhân lên cả chuỗi thì khác hẳn.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://dantri.com.vn/kinh-doanh/masan-theo-duoi-so-hoa-de-tao-gia-tri-thuc-cho-nguoi-tieu-dung-20251113114216160.htm" target="_blank" rel="noopener noreferrer">Báo điện tử Dân trí – 13/11/2025</a></li></ul></section>
                `
            },
            22: {
                category: "Doanh nghiệp",
                title: "Khi công nghệ đảm nhiệm phần thủ tục, người mua không phải chờ lâu",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-digital-pharmacy-service-2026.webp",
                imageAlt: "Dược sĩ sử dụng thiết bị di động để phục vụ và tư vấn khách hàng",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Ở chuỗi nhà thuốc Long Châu, tra cứu thuốc, tạo đơn, thanh toán nay làm ngay trên thiết bị di động. Theo doanh nghiệp, thời gian phục vụ một khách giảm từ 10 phút xuống 2–3 phút. Phía sau quầy, một nền tảng dự báo nhu cầu đã kéo tỷ lệ thiếu hàng xuống dưới 5% trong đợt thí điểm.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Mỗi lượt khách tại quầy thuốc kéo theo một loạt thao tác: tra cứu thông tin thuốc, tạo đơn hàng, thanh toán. Những việc hành chính ấy từng khiến thời gian phục vụ một khách lên tới khoảng 10 phút, lấy bớt thời gian dược sĩ dành để lắng nghe, tư vấn; người đứng sau phải chờ. Phía sau quầy là bài toán khó không kém của bán lẻ dược: đặt hàng sao cho thuốc khách cần luôn có sẵn, mà không đẩy hàng tồn kho lên.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Long Châu đưa toàn bộ quy trình vận hành của chuỗi nhà thuốc và tiêm chủng lên nền tảng đám mây. Tra cứu thuốc, tạo đơn, thanh toán được làm trên thiết bị di động của dược sĩ. Doanh nghiệp cũng hợp tác với FPT Smartcloud phát triển AI Mentor, hỗ trợ nghiệp vụ và cập nhật kiến thức chuyên môn cho dược sĩ mỗi ngày.</p><p>Ở khâu đặt hàng, Long Châu dùng nền tảng học máy USEE để dự báo nhu cầu thuốc, làm căn cứ nhập hàng. Với khách hàng, ứng dụng của Long Châu nhắc lịch tiêm, lưu đơn thuốc, cho phép quét đơn bằng công nghệ nhận diện ký tự quang học.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Thời gian phục vụ một khách: từ 10 phút xuống 2–3 phút.</li><li>Sau 3 tháng thí điểm USEE tại 16 nhà thuốc: tỷ lệ thiếu hàng dưới 5%, “gần như không làm tăng tồn kho”.</li><li>100% dược sĩ trong hệ thống đã dùng thành thạo ứng dụng bán hàng trên thiết bị di động.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người mua thuốc chờ ngắn hơn, và ít gặp cảnh loại thuốc mình cần đã hết. Bài báo kể trường hợp chị Mai Phương (32 tuổi, TP.HCM): 9 giờ tối cuối tuần, ứng dụng nhắc lịch tiêm mũi phế cầu tiếp theo cho con; sau vài thao tác, chị đặt lịch xong mà không phải lục tìm sổ tiêm chủng. Với dược sĩ, bớt việc giấy tờ là có thêm thời gian tư vấn. Đại diện Long Châu nói: “AI không thay thế các dược sĩ mà đồng hành cùng họ”.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Bảy, tám phút lấy lại được ở quầy thuốc không đến từ việc dược sĩ làm vội hơn, mà từ việc thủ tục lùi ra phía sau. Khi công nghệ gánh phần hành chính, thời gian của dược sĩ được trả về cho người bệnh.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://theleader.vn/du-lieu-va-ai-hien-thuc-hoa-su-menh-cham-soc-suc-khoe-cong-dong-tai-long-chau-d47251.html" target="_blank" rel="noopener noreferrer">TheLEADER – 13/08/2026</a></li></ul></section>
                `
            },
            23: {
                category: "Doanh nghiệp",
                title: "Từ thất bại đến tăng trưởng gấp 3: Khi dữ liệu đổi cách Sunhouse bán hàng xuyên biên giới",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-cross-border-ecommerce-data-2026.webp",
                imageAlt: "Nhóm thương mại điện tử Việt Nam phân tích dữ liệu và thiết kế sản phẩm cho thị trường Mỹ",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Những năm đầu lên Amazon (2020–2023), Sunhouse mang nguyên sản phẩm, nhân sự, quy trình mạnh nhất trong nước sang thị trường Mỹ, và thất bại. Doanh nghiệp quay lại đọc dữ liệu khách hàng Mỹ, làm dòng xửng hấp mới. Năm 2025, doanh thu trên Amazon tăng gấp 3 lần so với năm 2024.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Khi bắt đầu bán trên Amazon, doanh nghiệp đồ gia dụng Sunhouse coi đây chỉ là thêm một kênh bán hàng trực tuyến. “Chúng tôi từng chủ quan. Mang tất cả những gì mạnh nhất của thị trường nội địa, từ sản phẩm, nhân sự đến quy trình, áp nguyên lên Amazon”, ông Nghiêm Xuân Minh, Giám đốc thương mại điện tử quốc tế Sunhouse, kể. Kết quả là tỷ lệ chuyển đổi thấp, chi phí cao, doanh số không đạt kỳ vọng. Trong khi đó, những đối thủ nhỏ hơn lại thành công.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Câu hỏi “Tại sao?” buộc doanh nghiệp đổi cách làm. Thay vì mang sản phẩm sẵn có đi bán, Sunhouse nghiên cứu thị hiếu và dữ liệu khách hàng Mỹ, thử nghiệm sản phẩm mới, trong đó có dòng xửng hấp. “Chúng tôi nhận ra rằng không quan trọng sản phẩm quen thuộc hay mới mẻ, mà là sản phẩm đó có chiếm được niềm tin và thị hiếu khách hàng Mỹ hay không”, ông Minh nói.</p><p>Chi phí cũng được cắt theo số liệu: thay vì chạy quảng cáo dàn trải, doanh nghiệp giữ chiến dịch tốt nhất, bỏ các chiến dịch kém hiệu quả. Bao bì, đóng gói được thiết kế lại để giảm chi phí vận chuyển. Một nhóm người trẻ chuyên trách Amazon được lập.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Doanh thu trên Amazon năm 2025 gấp 3 lần năm 2024.</li><li>Xửng hấp lọt Top 3 Amazon Best Seller, nhận huy hiệu Amazon's Choice, bán hơn 2.000 sản phẩm mỗi tháng.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người mua ở Mỹ nhận được sản phẩm làm theo nhu cầu của chính họ, không phải hàng nội địa mang sang. Trong doanh nghiệp, một nhóm nhân sự trẻ được giao việc riêng, mà ông Minh gọi là “đội đặc vụ Amazon”: “Nhanh là sức trẻ, nhạy là khả năng hiểu thị hiếu và ứng biến với thị trường”. Với các doanh nghiệp Việt đang tính lên sàn quốc tế, Sunhouse để lại một lời thú nhận hiếm thấy: “cái thách thức lớn nhất lại bắt nguồn từ chính thành công trong quá khứ”.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Bán hàng xuyên biên giới không phải là mở thêm một cửa hàng ở xa, mà là học lại khách hàng từ đầu, bằng dữ liệu của chính họ.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://nguoiquansat.vn/tung-that-bai-vi-mang-tu-duy-noi-dia-sang-amazon-sunhouse-doi-chien-luoc-de-tang-gap-3-doanh-so-lot-top-3-best-seller-my-253451.html" target="_blank" rel="noopener noreferrer">Người Quan Sát – 06/11/2025</a></li></ul></section>
                `
            },
            24: {
                category: "Doanh nghiệp",
                title: "Cảng Cát Lái: Khi chuyển đổi số giảm thời gian cho logistics",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-catlai-smart-port-2026.webp",
                imageAlt: "Xe container đi qua cổng cảng tự động sau khi hoàn tất thủ tục trực tuyến",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Cảng Tân Cảng – Cát Lái (TP.HCM) thuộc Tân Cảng Sài Gòn, doanh nghiệp nắm hơn 90% thị phần container xuất nhập khẩu phía Nam. Giao nhận một container từng mất 2–3 giờ, nay còn khoảng 30 phút. Kiểm tra một xe qua cổng từ 5–10 phút còn 10–15 giây. Thời gian được lấy lại chủ yếu ở khâu giấy tờ.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Mỗi container ra vào cảng kéo theo một chuỗi việc: kiểm tra điều kiện giao nhận, tình trạng thông quan, đăng ký xe, thanh toán, nhận lệnh giao hàng. Khi các bước này làm thủ công, chủ hàng và nhà xe phải đến tận cảng, cầm chứng từ qua từng khâu. Giao nhận một container mất 2–3 giờ. Tại cổng, mỗi xe dừng 5–10 phút để kiểm tra. Vào mùa cao điểm như dịp Tết, cổng và bãi cảng rất dễ ùn tắc.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Tân Cảng Sài Gòn chọn tự làm chủ phần mềm lõi và số hóa dần từng khâu. Năm 2008, doanh nghiệp tự làm chủ phần mềm lập kế hoạch khai thác TOPX. Riêng giai đoạn đầu, doanh nghiệp đã chi khoảng 5 triệu USD cho hệ thống công nghệ lõi. Năm 2015, phần mềm quản lý dữ liệu container TOPOVN ra đời.</p><p>Năm 2016, ứng dụng e-Port cho phép khách hàng kiểm tra điều kiện giao nhận, tình trạng thông quan, đăng ký xe, thanh toán điện tử và nhận lệnh giao hàng trực tuyến “mà không cần đến cảng”. Khi xe tới, hệ thống cổng tự động nhận diện, thay cho việc đối chiếu giấy tờ bằng tay. Nói cách khác, phần thủ tục được làm xong trước khi xe lăn bánh; cổng cảng chỉ còn là nơi xác nhận.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Giao nhận một container: từ 2–3 giờ xuống còn khoảng 30 phút.</li><li>Kiểm tra phương tiện tại cổng: từ 5–10 phút xuống 10–15 giây.</li><li>Mỗi ngày, e-Port ghi nhận khoảng 15 tỷ đồng giao dịch không dùng tiền mặt.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người hưởng lợi trực tiếp là doanh nghiệp xuất nhập khẩu và các nhà xe. Đăng ký, thanh toán, nhận lệnh giao hàng đều làm trực tuyến, không phải mang chứng từ tới cảng. Tài xế container qua cổng trong khoảng mười mấy giây thay vì dừng nhiều phút. Theo lãnh đạo doanh nghiệp, đổi mới sáng tạo và chuyển đổi số là “chìa khóa” giúp Tân Cảng Sài Gòn giữ vững hơn 50% thị phần container xuất nhập khẩu qua cảng biển cả nước.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Ở Cát Lái, thời gian được lấy lại nhiều nhất không phải ở cầu tàu hay cần cẩu, mà ở khâu giấy tờ. Làm xong thủ tục trước khi xe đến cổng, cảng đã bỏ được phần chờ đợi không tạo ra giá trị cho ai.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://mst.gov.vn/chuyen-doi-so-trong-logistics-tu-cang-thong-minh-den-chuoi-cung-ung-so-hoa-197251113085702819.htm" target="_blank" rel="noopener noreferrer">Cổng Thông tin điện tử Bộ Khoa học và Công nghệ – 25/10/2025</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://nhandan.vn/nen-tang-du-lieu-dinh-hinh-tuong-lai-cang-bien-post941805.html" target="_blank" rel="noopener noreferrer">Báo Nhân Dân điện tử – 07/02/2026</a></li></ul></section>
                `
            },
            25: {
                category: "Doanh nghiệp",
                title: "Từ 18 lên 30 container mỗi giờ: Khi dữ liệu giúp cảng quốc tế Hateco vận hành nhanh hơn",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-hateco-ocr-port-2026.webp",
                imageAlt: "Cảng container Hải Phòng vận hành cẩu và cổng tự động bằng dữ liệu",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Cảng container quốc tế Hateco Hải Phòng (HHIT) ở Lạch Huyện đi vào khai thác từ tháng 2/2025. Khi mới chạy, mỗi cẩu bình quân xếp dỡ 18 container một giờ; mười tháng sau là 30, có lúc 42. Ở cổng, xe tải ra vào lấy hàng dưới 18 phút, theo cảng chỉ bằng một nửa các cảng khác.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Một cảng container phải nhanh ở cả hai đầu: tàu cần được giải phóng sớm ở cầu bến, xe tải cần vào ra gọn ở cổng. Cách làm quen thuộc là kiểm đếm container bằng tay khi xếp dỡ và kiểm tra thủ công khi xe qua cổng, dễ gây chậm và ùn tắc. HHIT lại là cảng mới: khi đưa vào khai thác đầu năm 2025, năng suất xếp dỡ bình quân chỉ đạt 18 container/giờ/cẩu.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>HHIT vận hành trên hệ thống quản lý khai thác cảng NAVIS N4 cùng các công cụ nhận dạng tự động. Trên cẩu bờ, hệ thống nhận dạng ký tự quang học (OCR) tự ghi nhận số và tình trạng từng container trong lúc xếp dỡ, thay cho khâu kiểm đếm thủ công. Theo cảng, nhờ đó năng suất xếp dỡ tăng dần, tàu được giải phóng nhanh hơn.</p><p>Ở cổng, sau 4 tháng chạy thử, từ 16/6/2025 cảng vận hành cổng tự động 100%. Nhà xe đặt lịch hẹn trước qua phần mềm TAS; khi xe tới, hệ thống OCR ở cổng nhận dạng container. Theo ông Phạm Hồng Minh, Giám đốc Kinh doanh cảng, cổng tự động kết hợp ứng dụng đặt xe đã rút ngắn khoảng 25 phút thời gian quay vòng xe tải.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Năng suất xếp dỡ: từ bình quân 18 lên 30 container/giờ/cẩu, có thời điểm đạt 42.</li><li>Thời gian xe tải ra vào cảng lấy hàng: dưới 18 phút, theo cảng bằng 50% so với các cảng khác.</li><li>Tháng 2–11/2025: 498.000 container thông qua, chiếm khoảng 40% thị phần container qua khu vực Lạch Huyện.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người thấy rõ thay đổi nhất là tài xế và các nhà xe: đặt lịch trước, qua cổng tự động, vào lấy hàng và ra khỏi cảng trong chưa đầy 18 phút, bớt cảnh xếp hàng chờ ở cổng. Hãng tàu được giải phóng tàu nhanh hơn khi mỗi cẩu làm được nhiều container hơn trong một giờ; cảng hiện đón 5–6 chuyến tàu mỗi tuần. Xe quay vòng nhanh hơn cũng có nghĩa là ít khí thải hơn quanh khu cảng.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Ở một cảng container, nhiều phút bị mất không nằm ở cần cẩu, mà ở các khâu ghi chép, đối chiếu, chờ đợi. HHIT cho thấy một cảng mới có thể số hóa những khâu ấy ngay từ ngày đầu, thay vì sửa dần về sau.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://baochinhphu.vn/pho-thu-tuong-thuong-truc-kiem-tra-tinh-hinh-san-xuat-kinh-doanh-cang-container-quoc-te-hateco-hai-phong-102251214214321897.htm" target="_blank" rel="noopener noreferrer">Báo điện tử Chính phủ – 14/12/2025</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://nhandan.vn/nen-tang-du-lieu-dinh-hinh-tuong-lai-cang-bien-post941805.html" target="_blank" rel="noopener noreferrer">Báo Nhân Dân điện tử – 07/02/2026</a></li></ul></section>
                `
            },
            26: {
                category: "Doanh nghiệp",
                title: "Khi AI biến chỗ trống trên tàu thành vé rẻ hơn",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-ai-railway-flexible-fare-2026.webp",
                imageAlt: "Hành khách chọn vé tàu giảm giá theo chặng trống do hệ thống AI xác định",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Một chỗ trên tàu đã bán cho khách đi xa, nhưng chặng ngắn còn lại của chính chỗ ấy thường khó bán. Từ 1/5/2026, ngành đường sắt để hệ thống AI tự tìm những chặng đó và giảm giá 15–35%. Chỉ trong tuần thí điểm, hành khách được giảm trực tiếp 523 triệu đồng.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Một chỗ ngồi trên tàu có thể được bán cho hành khách đi một hành trình dài, chiếm hơn 70% quãng đường. Phần chặng ngắn còn lại của chính chỗ ấy thì khó bán tiếp. Với giá vé cố định theo bảng, những khoảng trống lẻ như vậy dễ bị bỏ lại: tàu vẫn chạy, ghế vẫn trống qua nhiều ga. Hệ số sử dụng chỗ vì thế khó tăng, trong khi đường sắt phải cạnh tranh về giá với nhiều phương tiện khác.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Tổng công ty Đường sắt Việt Nam (VNR) đưa tính năng “Giá vé linh hoạt” vào hệ thống bán vé điện tử. Khi một chỗ đã được bán cho hành trình dài, hệ thống AI tự truy quét các chặng ngắn còn lại, tính toán và đưa ra mức giảm phù hợp theo từng thời điểm mua vé, từ 15% đến tối đa 35%.</p><p>Với hành khách, cách mua vé gần như không đổi. Trên website, ứng dụng bán vé hay ví điện tử, chỗ được ưu đãi hiện màu xanh nhạt, kèm giá vé và số tiền được giảm. Sau tuần thí điểm 22–29/4/2026, VNR áp dụng cho tất cả các đoàn tàu từ 1/5/2026, sớm hơn hai tuần so với dự kiến.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Tuần thí điểm 22–29/4/2026: bán 9.376 vé, doanh thu khoảng 2 tỷ đồng, trong đó 523 triệu đồng giảm trực tiếp cho hành khách.</li><li>Hệ số sử dụng chỗ đạt 79%, tăng 9% so với cùng kỳ và cao hơn 12% so với tháng trước.</li><li>10,36% hành khách trên các đoàn tàu thí điểm được hưởng ưu đãi.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người được lợi trước hết là hành khách đi chặng ngắn: cùng chuyến tàu, cùng chỗ ngồi, nhưng trả ít hơn 15–35%. Chỉ trong tám ngày thí điểm, số tiền họ được giảm là 523 triệu đồng, và cứ khoảng 10 hành khách thì có một người hưởng ưu đãi. Giá vé linh hoạt được kỳ vọng mở thêm cơ hội đi lại với chi phí hợp lý, nhất là dịp lễ, Tết. Với ngành đường sắt, phần doanh thu này đến từ những chỗ dễ bị bỏ trống, không phải từ việc tăng giá.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Không cần thêm toa, thêm chuyến. Chỉ cần nhìn ra những khoảng trống vốn nằm sẵn trong dữ liệu bán vé. Một chỗ ngồi trống nửa hành trình, được định giá lại đúng lúc, có lợi cho cả người đi tàu lẫn nhà tàu.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://vneconomy.vn/tong-cong-ty-duong-sat-chinh-thuc-ap-dung-ai-dieu-hanh-gia-ve-linh-hoat-tu-15.htm" target="_blank" rel="noopener noreferrer">VnEconomy – 29/04/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://tuoitre.vn/nganh-duong-sat-dung-ai-de-tu-dong-giam-gia-ve-tau-chang-ngan-20260430092847677.htm" target="_blank" rel="noopener noreferrer">Tuổi Trẻ Online – 30/04/2026</a></li></ul></section>
                `
            },
            27: {
                category: "Doanh nghiệp",
                title: "Hợp đồng 256 triệu USD và nấc thang mới của kỹ sư Việt",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-vietnam-global-engineers-2026.webp",
                imageAlt: "Đội ngũ kỹ sư Việt Nam triển khai dự án chuyển đổi số cho khách hàng quốc tế",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Tháng 9/2025, FPT ký hợp đồng 256 triệu USD trong 5 năm với một tập đoàn năng lượng châu Á, lớn nhất trong lịch sử doanh nghiệp. Đáng chú ý không chỉ là con số, mà là phần việc được giao: gần như trọn vòng một hệ thống số, từ phân tích yêu cầu tới triển khai.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Cuối năm 2023, FPT trở thành doanh nghiệp công nghệ Việt Nam đầu tiên có doanh thu dịch vụ công nghệ thông tin từ nước ngoài vượt 1 tỷ USD. Nền tảng của con số ấy là phát triển phần mềm cho khách hàng quốc tế. Nhưng với một công ty dịch vụ, quy mô mới là một nửa câu chuyện. Nửa còn lại là khách hàng tin giao cho mình phần việc nào. Nếu chỉ nhận viết phần mềm theo thiết kế có sẵn, giá trị mỗi hợp đồng khó lớn lên.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Theo FPT, loại việc doanh nghiệp đảm nhận cho khách hàng quốc tế đã mở rộng từ phát triển phần mềm sang hiện đại hóa hệ thống, ERP, công nghệ ô tô, điện toán đám mây, dữ liệu và AI. Hợp đồng 256 triệu USD là ví dụ rõ: FPT cung cấp dịch vụ chuyển đổi số tích hợp AI, gồm phần mềm tùy chỉnh, kỹ thuật dữ liệu, di động, điện toán đám mây, quản lý dự án, tham gia từ phân tích yêu cầu, thiết kế giải pháp đến triển khai, hỗ trợ.</p><p>Nhật Bản là nơi bước chuyển thể hiện rõ: năm 2025, doanh thu tại đây đạt 15.452 tỷ đồng, tăng 25,4%, chiếm gần 44% doanh thu dịch vụ công nghệ thông tin nước ngoài.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Năm 2025: doanh thu dịch vụ công nghệ thông tin nước ngoài 35.382 tỷ đồng, tăng 14,3%; giá trị hợp đồng ký mới 40.636 tỷ đồng, hơn 1,5 tỷ USD.</li><li>Số dự án trên 10 triệu USD thắng thầu: 26 trong năm 2025; 14 trong 6 tháng đầu năm 2026.</li><li>Doanh thu dịch vụ AI và phân tích dữ liệu 6 tháng đầu năm 2026: 1.842 tỷ đồng, tăng 54%.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người làm nên các con số là đội ngũ kỹ sư: đến cuối tháng 7/2026, riêng nhân sự công nghệ của FPT là 37.002 người, làm dự án tại Việt Nam và phục vụ khách hàng ở nhiều thị trường. Riêng mảng năng lượng, FPT cho biết có 1.500 kỹ sư có kiến thức chuyên sâu. Khi hợp đồng mở rộng sang thiết kế giải pháp, dữ liệu và AI, kỹ sư được tham gia cả những phần việc đòi hỏi hiểu nghiệp vụ của khách hàng, không chỉ viết mã.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Doanh thu từ nước ngoài có thể tăng bằng cách thêm người. Thước đo đáng nhìn hơn là khách hàng giao cho mình phần việc nào. Khi các doanh nghiệp nước ngoài giao trọn gói chuyển đổi số cho doanh nghiệp Việt, đó là một nấc thang khác.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://vietnamnet.vn/doanh-thu-ky-moi-dich-vu-cntt-nuoc-ngoai-cua-fpt-vuot-1-5-ty-usd-2485326.html" target="_blank" rel="noopener noreferrer">VietNamNet – 26/01/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://thanhnien.vn/fpt-ky-hop-dong-gia-tri-ky-luc-voi-tap-doan-nang-luong-hang-dau-chau-a-185250916095800997.htm" target="_blank" rel="noopener noreferrer">Báo Thanh Niên – 16/09/2025</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://vtcnews.vn/fpt-lap-ky-luc-nganh-cntt-viet-nam-hon-1-5-ty-usd-hop-dong-moi-tu-nuoc-ngoai-ar1040915.html" target="_blank" rel="noopener noreferrer">VTC News – 21/09/2026</a></li></ul></section>
                `
            },
            28: {
                category: "Doanh nghiệp",
                title: "Nuôi tôm thời 4.0, người nuôi bớt phải đánh cược",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-smart-shrimp-farm-2026.webp",
                imageAlt: "Người nuôi tôm theo dõi cảm biến chất lượng nước và dữ liệu ao nuôi",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Năm 2023, ông Lê Văn Quang, Chủ tịch Tập đoàn Thủy sản Minh Phú, cho biết tỷ lệ nuôi tôm thành công bình quân không quá 40%. Đây là chỉ số về mức độ thành công của vụ nuôi. Trong mô hình MPBio Minh Phú thử nghiệm từ năm 2022, ao nuôi được cảm biến theo dõi 24/24; doanh nghiệp công bố một chỉ số khác là tỷ lệ sống của tôm thử nghiệm khoảng 80%</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Dịch bệnh EMS và EHP từng gây thiệt hại nặng cho nghề nuôi tôm. Theo ông Quang, rủi ro cao đến mức ngân hàng không dám cho người nuôi vay. Không có vốn, họ phải mua thức ăn, chế phẩm vi sinh, vật tư qua nhiều cấp đại lý, giá bị đẩy lên thêm 30–50%. Nhiều người buộc phải treo ao. Mỗi vụ tôm vì thế giống một lần đánh cược: chi phí bỏ ra lớn, còn tôm sống được bao nhiêu thì khó biết trước.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>MPBio là mô hình nuôi tôm thẻ chân trắng do Minh Phú phát triển. Mô hình mô phỏng môi trường tự nhiên độ mặn cao, dùng vi sinh đối kháng để kiểm soát mầm bệnh và tăng miễn dịch cho tôm, không dùng thuốc tím, PAC hay Chlorine. Số hóa là một trong chín giải pháp cấu thành mô hình.</p><p>Thay đổi về cách ra quyết định nằm ở dữ liệu. Toàn bộ ao nuôi được giám sát 24/24 bằng cảm biến và phần mềm quản lý. Dữ liệu môi trường được phân tích để quyết định cho ăn, xử lý nước và quản lý dịch bệnh. Nước ao không còn chỉ được nhìn bằng mắt, mà được đo suốt ngày đêm; mỗi quyết định trong ao có số liệu đi kèm.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Tỷ lệ sống của tôm: khoảng 80% theo kết quả thử nghiệm, được doanh nghiệp đánh giá cao hơn đáng kể so với phương pháp truyền thống.</li><li>Diện tích thả giống có thể tăng từ 30% lên 60% diện tích ao.</li><li>Chi phí sản xuất giảm tới 50%; lợi nhuận của người nuôi tăng thêm khoảng 10–20%.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Nếu mô hình được nhân rộng, người được lợi nhiều nhất là hộ nuôi tôm, những người đang gánh cùng lúc rủi ro dịch bệnh và chi phí đầu vào cao. Cùng một cái ao, thả giống nhiều hơn, chi phí thấp hơn, phần lợi nhuận vốn mỏng có thêm khoảng đệm. Năm 2023, ông Quang nói ngành tôm cần giải pháp công nghệ giúp người nuôi “vực dậy” sau khủng hoảng. Các bài báo chưa cho biết bao nhiêu hộ ngoài Minh Phú đã áp dụng MPBio.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Ở MPBio, cảm biến không thay được vi sinh hay kỹ thuật nuôi. Nó làm một việc giản dị hơn: biến nước ao từ thứ phải đoán thành thứ đo được suốt ngày đêm. Khi rủi ro được nhìn thấy sớm, nuôi tôm bớt giống với đặt cược.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://nguoinuoitom.vn/buc-tranh-mo-hinh-nuoi-tom-cong-nghe-cao-tai-viet-nam/" target="_blank" rel="noopener noreferrer">Người Nuôi Tôm – 31/03/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://thuysanvietnam.com.vn/tap-doan-minh-phu-giai-phap-ben-vung-cho-nganh-nuoi-tom-cong-nghe-cao-thich-ung-bien-doi-khi-hau/" target="_blank" rel="noopener noreferrer">Tạp chí Thủy sản Việt Nam – 12/12/2023</a></li></ul></section>
                `
            },
            29: {
                category: "Doanh nghiệp",
                title: "Khi dữ liệu thay đổi cách vận hành lưới điện",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-electric-grid-smart-meter-2026.webp",
                imageAlt: "Kỹ sư điện theo dõi công tơ đo xa và dữ liệu vận hành lưới điện",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Tháng 5/2021, chưa đến một nửa số công tơ của Tổng công ty Điện lực miền Bắc (EVNNPC) đọc được từ xa. Tháng 9/2026, tỷ lệ này đã xấp xỉ 100%, trên gần 11,6 triệu khách hàng. Cũng trong 5 năm ấy, tổn thất điện năng của EVNNPC xuống mức thấp nhất từ trước đến nay.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>EVNNPC cấp điện cho 17 tỉnh, thành phố miền Bắc (không gồm Hà Nội), nhiều nơi là miền núi, vùng sâu, vùng xa, phụ tải phân tán, đường dây dài. Với công tơ cơ khí, chỉ số điện phải ghi thủ công, chậm và dễ sai sót, nhầm lẫn. Năm 2021, doanh nghiệp nêu thêm khó khăn: có nơi thời tiết khắc nghiệt vượt giới hạn tiêu chuẩn của công tơ điện tử, một bộ phận cán bộ còn hạn chế khi tiếp cận công nghệ mới, và lao động dư tạo áp lực lớn về chi phí.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>EVNNPC thay dần công tơ cơ khí bằng công tơ điện tử đo xa, kết hợp nền tảng quản lý dữ liệu đo đếm. Thay vì chờ người đi ghi, dữ liệu sử dụng điện được thu thập và chốt tự động, gần như theo thời gian thực. Đơn vị điện lực nhanh chóng thấy bất thường về sản lượng, phụ tải, mất kết nối hay sai lệch số đo để xử lý.</p><p>Có dữ liệu liên tục, việc giảm tổn thất điện năng cũng đổi cách làm. Tổn thất được theo dõi đến từng đường dây, trạm biến áp, khu vực. Camera nhiệt, thiết bị giám sát giúp phát hiện sớm điểm tiếp xúc phát nhiệt, mất cân bằng pha, quá tải cục bộ. Theo doanh nghiệp, quản lý tổn thất đã chuyển từ phương thức truyền thống sang chủ động.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Công tơ đo xa: từ 49,23% (5.290.684/10.747.940 chiếc, ngày 31/5/2021) lên xấp xỉ 100% (tháng 9/2026).</li><li>Quy mô: gần 11,6 triệu khách hàng tại 17 tỉnh, thành phố miền Bắc.</li><li>Tỷ lệ tổn thất điện năng: từ 4,54% (2021) xuống 3,54% (2025), mức thấp nhất từ trước đến nay; công tơ đo xa là một trong nhiều giải pháp góp phần.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Với khách hàng, sản lượng điện được chốt tự động, giảm nguy cơ sai sót, nhầm lẫn do đọc và ghi bằng tay. Ở vùng núi, dữ liệu gần thời gian thực giúp phát hiện sớm bất thường trên lưới. Với người lao động, doanh nghiệp không giấu phần khó: thói quen cũ và tâm lý ngại thay đổi có thể thành lực cản; năm 2021, lao động dư được gọi là áp lực lớn. Các bài báo chưa cho biết lực lượng ghi chỉ số đã được bố trí lại thế nào.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Lắp gần 11,6 triệu công tơ đo xa là bài toán thiết bị. Nhưng chính EVNNPC thừa nhận phần khó hơn là con người: thói quen cũ, tâm lý ngại thay đổi, và câu hỏi những người từng đi ghi số sẽ làm gì tiếp theo.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://congthuong.vn/evnnpc-xay-dung-van-hoa-so-thuc-day-chuyen-doi-so-474484.html" target="_blank" rel="noopener noreferrer">Báo Công Thương – 24/09/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://congthuong.vn/cong-nghe-so-giup-evnnpc-keo-giam-ton-that-dien-nang-462614.html" target="_blank" rel="noopener noreferrer">Báo Công Thương – 24/06/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://thuonghieucongluan.com.vn/evnnpc-no-luc-trong-hien-dai-hoa-he-thong-do-dem-chi-so-dien-mang-toi-nhieu-su-tien-loi-cho-khach-hang-a137852.html" target="_blank" rel="noopener noreferrer">Thương hiệu và Công luận – 18/06/2021</a></li></ul></section>
                `
            },
            30: {
                category: "Doanh nghiệp",
                title: "“Khoảng dừng” đúng lúc: Khi AI giúp người dùng tránh bị lừa",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-ai-scam-pause-warning-2026.webp",
                imageAlt: "Người dùng dừng lại trước cảnh báo rủi ro khi chuẩn bị chuyển tiền",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Hơn 90% thiệt hại lừa đảo trên MoMo xảy ra khi chính người dùng tự bấm chuyển tiền, sau khi bị thao túng tâm lý. Vì vậy, ví điện tử này không chỉ tìm cách chặn kẻ gian, mà tạo ra một “khoảng dừng” ngay trước lúc chuyển. Theo MoMo, 99,5% người nhận cảnh báo đã dừng lại suy nghĩ.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Một vụ lừa đảo điển hình không bắt đầu trên ví điện tử. Kẻ gian tiếp cận qua mạng xã hội, ứng dụng nhắn tin, dựng kịch bản thao túng tâm lý, có khi dùng cả deepfake. Đến lúc nạn nhân mở ví, nhập số tài khoản và bấm chuyển, gần như mọi thứ đã xong. “Các nền tảng tài chính thường chỉ nhìn thấy phút thứ 89 của hành trình lừa đảo”, ông Nguyễn Mạnh Tường, đồng sáng lập, Tổng giám đốc MoMo, nhận định.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>MoMo đổi cách đặt bài toán: từ “chặn kẻ xấu” sang giúp người dùng không mắc sai lầm. Mỗi giao dịch được nhiều mô hình AI chạy song song chấm điểm rủi ro trong 100–300 mili giây, dựa trên hành vi, thiết bị, mạng lưới và ngữ cảnh.</p><p>Khi thấy dấu hiệu bất thường, ứng dụng không lặng lẽ cho qua. Người dùng có thể thấy nhãn cảnh báo tài khoản nhận có dấu hiệu rủi ro, gặp câu hỏi kiểm tra hoặc yêu cầu xác thực, để “thoát khỏi trạng thái vội vàng để nhìn lại trước khi quyết định”. Trước khi chuyển, họ cũng có thể tự tra cứu số tài khoản nhận. Phản hồi từ các lần cảnh báo được đưa ngược lại để huấn luyện mô hình.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Mỗi ngày, hệ thống phát hiện gần 29.000 giao dịch bất thường và cảnh báo hơn 10.000 người dùng.</li><li>99,5% người nhận cảnh báo đã dừng lại suy nghĩ trước khi tiếp tục giao dịch.</li><li>MoMo ước tính hơn 15 nghìn tỷ đồng mỗi năm được bảo vệ khỏi nguy cơ lừa đảo (ước tính của doanh nghiệp).</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người được bảo vệ trước hết là những người dễ bị dẫn dắt. Theo dữ liệu nội bộ của MoMo, 70% nạn nhân dưới 25 tuổi, 50% là sinh viên dưới 22 tuổi. Với họ, một câu hỏi hiện lên đúng lúc có thể là khác biệt giữa mất tiền và giữ được tiền. Ở lớp cảnh báo này, hệ thống không quyết định thay; nó tạo ra một “điểm dừng an toàn” để người dùng tự nhận ra mình đang bị dẫn dắt.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Thước đo đáng chú ý ở đây không phải độ chính xác của mô hình AI, mà là số người chịu dừng lại. Với lừa đảo đánh vào tâm lý, lớp bảo vệ hiệu quả đôi khi chỉ là một khoảnh khắc chậm lại đúng lúc.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://vnexpress.net/khoa-hoc-cong-nghe/ai4vn-2026/giai-phap/xay-dung-niem-tin-so-bang-cong-nghe-ai-trong-bao-mat-va-bao-ve-nguoi-dung-300" target="_blank" rel="noopener noreferrer">VnExpress – Giải thưởng AI4VN 2026 (hồ sơ giải pháp của MoMo) – 09/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://dantri.com.vn/kinh-doanh/khoang-dung-khi-chuyen-tien-va-y-tuong-lien-minh-phong-thu-so-cua-momo-20260603152854957.htm" target="_blank" rel="noopener noreferrer">Báo Dân trí – 03/06/2026</a></li></ul></section>
                `
            },
            31: {
                category: "Doanh nghiệp",
                title: "Nhờ dữ liệu, nhà máy đã giảm 68% thời gian dừng máy",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-orion-smart-factory-2026.webp",
                imageAlt: "Kỹ sư theo dõi dữ liệu máy móc và năng lượng trong phòng điều hành nhà máy",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Ở nhà máy Orion Vina tại Khu công nghiệp Mỹ Phước 2 (phường Bến Cát, TP.HCM), dữ liệu máy móc và năng lượng được đưa về một phòng điều hành tập trung. Theo doanh nghiệp, sau khoảng 8 tháng triển khai giai đoạn 1, thời gian dừng máy giảm 68%, công suất sản xuất tăng 30%.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Orion, tập đoàn bánh kẹo Hàn Quốc, xây nhà máy đầu tiên tại Khu công nghiệp Mỹ Phước 2 từ năm 2006. Dừng máy, chi phí kiểm tra, chi phí năng lượng và vận hành là những khoản nhà máy phải kiểm soát. Theo ông Jeong Jong Yeon, Phó Tổng giám đốc Orion Vina, khó khăn lớn nhất không chỉ là nâng cấp một nhà máy đã vận hành lâu năm, mà là thay đổi tư duy, cách làm việc của đội ngũ nhân sự, từ vận hành thủ công sang quản trị dựa trên dữ liệu.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Dự án nhà máy thông minh chia làm ba giai đoạn, từ tháng 4/2024 đến tháng 3/2026, do kỹ sư Việt Nam của VNTT và Becamex IDC triển khai. Giai đoạn 1 xây dựng phòng quản lý tập trung IOC, hệ thống quản lý năng lượng, camera giám sát tập trung, cảm biến và thiết bị kết nối IoT; nhà máy cũng đưa robot tự động hóa vào sản xuất.</p><p>Thay đổi cốt lõi là dữ liệu được gom về một chỗ. Thông số thiết bị và năng lượng được kết nối, điều hành tập trung, hiển thị đồng nhất theo thời gian thực. Theo doanh nghiệp, nhờ giám sát theo thời gian thực, dự báo sự cố và tối ưu quy trình, nhà máy không chỉ xử lý khi máy đã dừng mà có thể thấy sự cố từ sớm.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Thời gian dừng máy giảm 68% sau khoảng 8 tháng triển khai giai đoạn 1.</li><li>Công suất sản xuất tăng 30%.</li><li>Chi phí kiểm tra giảm 50%; chi phí năng lượng và vận hành được kiểm soát tốt hơn.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người thay đổi nhiều nhất là đội ngũ vận hành: họ chuyển từ vận hành thủ công sang làm việc với dữ liệu, điều lãnh đạo nhà máy gọi là phần khó nhất của dự án. Câu chuyện cũng là cơ hội cho kỹ sư trong nước. Ông Park Se Yeol, Tổng giám đốc Orion Vina, nhận xét: “các kỹ sư người Việt tại Becamex và VNTT đã chứng minh cho chúng tôi thấy sự tự tin, năng lực và khả năng triển khai rất tốt”.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Ở Orion Vina, phòng điều hành, cảm biến, robot đều lắp được theo tiến độ. Phần khó nhất, theo chính lãnh đạo nhà máy, là để đội ngũ quen ra quyết định bằng dữ liệu thay vì bằng thói quen vận hành thủ công.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://www.sggp.org.vn/tang-toc-dau-tu-nha-may-thong-minh-post831794.html" target="_blank" rel="noopener noreferrer">Báo Sài Gòn Giải Phóng – 03/01/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://nguoidothi.net.vn/orion-chuyen-doi-thanh-nha-may-thong-minh-45714.html" target="_blank" rel="noopener noreferrer">Người Đô Thị – 15/10/2024</a></li></ul></section>
                `
            },
            32: {
                category: "Doanh nghiệp",
                title: "Từ 60 giây xuống 10 giây: Khi chuẩn hóa mở đường cho số hóa",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-cleanroom-standardization-2026.webp",
                imageAlt: "Công nhân phòng sạch quét và sắp xếp vật liệu trên hệ thống giá kệ chuẩn hóa",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Ở Công ty Cổ phần Vina Technology (Thái Nguyên), mỗi lần tìm vật liệu trong kho từng mất khoảng 60 giây. Sau khi kho được sắp xếp lại, còn 10 giây. Cùng với nâng chuẩn phòng sạch, lỗi do dị vật giảm tới 68,7%. Bước đầu tiên của nhà máy thông minh ở đây không nằm trong phần mềm.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Vina Technology là doanh nghiệp sản xuất công nghiệp đặt cơ sở tại Thái Nguyên. Yêu cầu chất lượng ngày càng khắt khe, nhất là với sản phẩm đòi hỏi môi trường sản xuất sạch, trong khi phòng sạch của nhà máy mới đạt chuẩn Class 10.000. Dị vật lọt vào sản phẩm gây lỗi, kéo theo chi phí phát sinh. Trong kho, vật tư chưa có vị trí lưu trữ và cách nhận diện thống nhất; mỗi lần tìm vật liệu mất khoảng 60 giây, lặp lại qua từng lượt lấy hàng.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Năm 2025, Vina Technology tham gia Dự án hỗ trợ phát triển nhà máy thông minh do Samsung Việt Nam phối hợp với Bộ Công Thương thực hiện, với chuyên gia Samsung tư vấn. Những việc được làm trước tiên là việc nền. Nhà máy nâng phòng sạch từ chuẩn Class 10.000 lên Class 1.000, chuẩn sạch cao hơn, và chuẩn hóa quy trình kiểm soát môi trường sản xuất.</p><p>Kho vật liệu được sắp xếp lại theo hệ thống giá kệ (rack), chuẩn hóa vị trí lưu trữ và cách nhận diện vật tư, để mỗi thứ có chỗ cố định, dễ tìm. Doanh nghiệp tổ chức 26 khóa đào tạo nội bộ về vận hành trong phòng sạch, tuân thủ quy trình, ý thức chất lượng. Theo đại diện doanh nghiệp, đây là nền tảng “cho các bước số hóa sâu hơn trong thời gian tới”.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Tìm vật liệu trong kho: từ khoảng 60 giây xuống 10 giây mỗi lần.</li><li>Tỷ lệ lỗi do dị vật: giảm tới 68,7%.</li><li>Phòng sạch: từ chuẩn Class 10.000 lên Class 1.000; hơn 300 lượt cán bộ, nhân viên qua 26 khóa đào tạo nội bộ.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người hưởng lợi trực tiếp là công nhân: bớt thời gian đi tìm vật tư, làm việc trong môi trường sạch hơn và được đào tạo bài bản về quy trình, chất lượng. Với doanh nghiệp, ít lỗi hơn nghĩa là chất lượng ổn định hơn, giảm chi phí phát sinh trong sản xuất. Đại diện Vina Technology cho biết các cải tiến giúp doanh nghiệp “kiểm soát tốt hơn chất lượng và dòng chảy sản xuất”.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Nhà máy thông minh ở Vina Technology bắt đầu bằng những việc rất cơ bản: không khí sạch hơn, kho gọn hơn, người được đào tạo kỹ hơn. Một cuộn vật liệu chưa có chỗ cố định trên kệ thì cũng chưa thể số hóa được.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://vietnamnet.vn/vina-technology-nang-chuan-phong-sach-giam-manh-loi-2477423.html" target="_blank" rel="noopener noreferrer">VietNamNet – 08/12/2025</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://news.samsung.com/vn/samsung-viet-nam-tong-ket-du-an-ho-tro-phat-trien-nha-may-thong-minh-nam-2025-tai-khu-vuc-mien-bac" target="_blank" rel="noopener noreferrer">Samsung Newsroom Việt Nam – 16/10/2025</a></li></ul></section>
                `
            },
            33: {
                category: "Doanh nghiệp",
                title: "Từ 10 ngày xuống 2 ngày: Khi dữ liệu rút ngắn hành trình vay vốn của doanh nghiệp",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-sme-data-loan-2026.webp",
                imageAlt: "Chủ doanh nghiệp nhỏ trao đổi khoản vay dựa trên hóa đơn và dữ liệu dòng tiền",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Với doanh nghiệp nhỏ, một khoản vốn đến chậm có thể là một đơn hàng bị lỡ. Tại Ngân hàng TMCP Quân đội (MB), khi thẩm định dựa trên hóa đơn, dòng tiền, lịch sử giao dịch thay vì chủ yếu dựa vào tài sản hữu hình, một số hành trình cấp vốn rút từ 10 ngày xuống 2 ngày.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Khi cần vốn, doanh nghiệp nộp hồ sơ rồi chờ ngân hàng đọc, thẩm định. Cách làm quen thuộc dựa nhiều vào tài sản hữu hình, một điểm khó với doanh nghiệp nhỏ vốn ít tài sản. Ngân hàng cũng thường chờ khách hàng cung cấp đủ thông tin. Theo số liệu nội bộ của MB, một số hành trình cấp vốn từng mất khoảng 10 ngày. “Với doanh nghiệp, tốc độ của dòng vốn có thể quyết định khả năng nắm bắt một đơn hàng, duy trì chuỗi cung ứng hoặc mở rộng sản xuất”, lãnh đạo MB nói.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>MB đổi nguồn dữ liệu để hiểu doanh nghiệp. Trên nền tảng ngân hàng số BIZ MBBank, AI và dữ liệu lớn phân tích các “tài sản số”: hóa đơn, doanh thu, dòng tiền, lịch sử giao dịch và dữ liệu vận hành, để đánh giá sức khỏe tài chính, chu kỳ kinh doanh và nhu cầu vốn của từng doanh nghiệp.</p><p>Cách làm chuyển từ đọc hồ sơ sang hiểu hoạt động kinh doanh, từ xử lý thủ công sang tự động hóa, từ chờ khách hàng cung cấp thông tin sang chủ động khai thác dữ liệu. Dữ liệu kinh doanh hằng ngày trở thành căn cứ để vay vốn. Doanh nghiệp có thể tiếp cận hạn mức thấu chi tín chấp, tức không cần tài sản bảo đảm, tới 3 tỷ đồng, tùy điều kiện và kết quả đánh giá tín dụng.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Thời gian xử lý ở một số hành trình cấp vốn: từ khoảng 10 ngày xuống 2 ngày (số liệu nội bộ MB).</li><li>Nguồn lực tại một số quy trình được tối ưu tới 70%.</li><li>Số khách hàng sử dụng giải pháp tăng 2,5 lần.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người hưởng lợi là chủ doanh nghiệp nhỏ và vừa, những người cần vốn đúng lúc để nhận một đơn hàng hay giữ nhịp chuỗi cung ứng. Họ được đánh giá qua chính hoạt động kinh doanh của mình, không chỉ qua tài sản đem thế chấp. Ông Nguyễn Xuân Cường, Phó Giám đốc Khối Ngân hàng số MB, nói: “Thước đo của chuyển đổi số không phải MB ứng dụng bao nhiêu công nghệ, mà là doanh nghiệp tiết kiệm được bao nhiêu thời gian, tiếp cận vốn nhanh hơn bao nhiêu”.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Để cho doanh nghiệp nhỏ vay nhanh hơn, chỉ đổi kênh nộp hồ sơ từ giấy sang ứng dụng là chưa đủ. Cần đổi câu hỏi thẩm định: từ doanh nghiệp có tài sản gì sang việc kinh doanh của doanh nghiệp đang vận hành ra sao.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://baohatinh.vn/biz-mbbank-ung-dung-ai-rut-ngan-thoi-gian-duyet-von-tu-10-ngay-xuong-2-ngay-post315825.html" target="_blank" rel="noopener noreferrer">Báo Hà Tĩnh – 19/08/2026</a></li></ul></section>
                `
            },
            34: {
                category: "Doanh nghiệp",
                title: "Duyệt thẻ tín dụng: từ hàng giờ còn dưới 5 phút",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-ai-credit-card-approval-2026.webp",
                imageAlt: "Nhân viên ngân hàng giám sát hệ thống AI hỗ trợ phê duyệt thẻ tín dụng",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Ở HDBank, một hồ sơ thẻ tín dụng từng mất hàng giờ để phê duyệt; nay, theo lãnh đạo ngân hàng, còn dưới 5 phút. Điều đáng chú ý không chỉ là tốc độ. Ngân hàng vẫn giữ nguyên tắc: các quyết định quan trọng như tín dụng hay phê duyệt vay vẫn cần con người giám sát.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Với khách hàng, mở thẻ tín dụng từng là việc phải chờ: hồ sơ nộp xong, kết quả phê duyệt đến sau hàng giờ. Phía sau mỗi hồ sơ, ngân hàng có nhiều quy trình lặp lại và tốn thời gian, phần lớn do nhân viên làm bằng tay. Cùng lúc, ngân hàng phải trả lời hai câu hỏi không thể làm qua loa: khách hàng này có khả năng trả nợ không, và hồ sơ có dấu hiệu gian lận không. Làm nhanh hơn mà vẫn giữ được kiểm soát rủi ro là bài toán đặt ra.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>HDBank dùng robot phần mềm để tự động hóa những quy trình lặp lại, tốn thời gian, thay cho thao tác tay. AI được đưa vào phân tích tín dụng: dự đoán khả năng nợ xấu, nâng khả năng phát hiện gian lận. “Chúng tôi đã rút ngắn thời gian phê duyệt thẻ tín dụng xuống dưới 5 phút, thay vì hàng giờ như trước”, ông Đàm Thế Thái, Phó Tổng Giám đốc HDBank, cho biết.</p><p>Dữ liệu cũng được dùng để gợi ý sản phẩm cho từng khách hàng. Nhưng ngân hàng đặt ra ranh giới: theo ông Thái, dữ liệu phải chính xác, bảo mật đặt lên hàng đầu, AI cần cơ chế quản trị, giám sát để hạn chế sai lệch, và các quyết định quan trọng như tín dụng hay phê duyệt vay vẫn cần sự giám sát của con người.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Phê duyệt thẻ tín dụng: từ hàng giờ xuống dưới 5 phút.</li><li>Công việc thủ công giảm 80%, tiết kiệm hơn 92 nghìn giờ lao động mỗi năm.</li><li>15% khách hàng chấp nhận sản phẩm do AI gợi ý, tính trên tổng số đề xuất.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người mở thẻ không còn phải chờ hàng giờ mới biết kết quả. Với nhân viên ngân hàng, hơn 92 nghìn giờ lao động mỗi năm không còn dành cho những thao tác lặp lại.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Thời gian phê duyệt có thể rút từ giờ xuống phút. Trách nhiệm thì không rút ngắn được: ở HDBank, máy làm phần lặp lại, còn những quyết định tín dụng quan trọng vẫn cần con người giám sát.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://nhandan.vn/tri-tue-nhan-tao-lam-moi-ngan-hang-post914911.html" target="_blank" rel="noopener noreferrer">Báo Nhân Dân điện tử – 13/10/2025</a></li></ul></section>
                `
            },
            35: {
                category: "Doanh nghiệp",
                title: "Những cung đường cao tốc an toàn hơn nhờ chuyển đổi số",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-ai-smart-highway-2026.webp",
                imageAlt: "Trung tâm điều hành dùng camera AI phát hiện sự cố và cảnh báo trên cao tốc",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Một tuyến cao tốc 50 km sinh ra hàng chục luồng video liên tục. Người trực màn hình giảm tập trung sau vài chục phút; đêm khuya, lúc rủi ro tai nạn cao nhất, giám sát lại kém tin cậy nhất. Hệ thống ELCOM ITS của một doanh nghiệp Việt đang giám sát hơn 1.000 km đường bộ.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Cao tốc mở rộng nhanh hơn năng lực giám sát theo lối cũ. Với cách trực ca thủ công, tuyến dài gấp đôi thì người trực cũng phải tăng tương ứng. Khoảng thời gian từ lúc xảy ra va chạm đến lúc trung tâm điều hành biết và phát cảnh báo là lúc xe phía sau có thể lao vào hiện trường, gây tai nạn thứ cấp. Nhiều hệ thống nhập khẩu lại như “hộp đen”, chi phí cao, khó tích hợp; mỗi chủ đầu tư vận hành một hệ thống riêng, dữ liệu không liên thông.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Công ty Cổ phần Công nghệ – Viễn thông ELCOM xây dựng hệ sinh thái bảy phân hệ dùng chung một lớp dữ liệu, từ camera AI, biển báo điện tử, thu phí không dừng, cân tải trọng tự động đến hệ thống phát hiện sự cố. Thay vì người trực dò từng màn hình, camera AI tự nhận diện phương tiện, vi phạm, tai nạn, vật cản; hệ thống tự xoay camera về hiện trường và bật cảnh báo trên biển báo điện tử cho xe phía sau.</p><p>Hệ thống phân rõ việc của máy và việc của người. Bật cảnh báo, điều camera: AI làm ngay. Điều chỉnh đèn, đóng mở làn: chỉ tự động trong ngưỡng cài sẵn. Xử phạt nguội hay xác nhận xe quá tải: AI chỉ lập hồ sơ kèm chứng cứ; cán bộ có thẩm quyền xem xét và phê duyệt.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Hơn 1.000 km đường bộ đang được giám sát; 19/20 trung tâm điều hành cao tốc đã tích hợp.</li><li>72 trạm thu phí không dừng (khoảng 80% số trạm cả nước) và 172 làn cân tải trọng tự động.</li><li>Độ chính xác doanh nghiệp công bố: trên 98% với nhận diện phương tiện, trên 95% với hành vi vi phạm.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Với tài xế, cảnh báo sự cố, thời tiết, phân luồng đến sớm qua biển báo điện tử, loa, website và ứng dụng, giúp chủ động chọn lộ trình. Với người trực vận hành, việc dò tìm sự cố được máy làm thay; con người tập trung vào quyết định. Với người bị xử phạt, mọi hồ sơ vi phạm kèm ảnh, video và dữ liệu đo gốc, có căn cứ để khiếu nại và truy xuất.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Điểm đáng chú ý ở ELCOM ITS không nằm ở chỗ AI làm được nhiều việc, mà ở chỗ doanh nghiệp vạch rõ việc AI không tự làm: mọi quyết định hành chính đối với người dân vẫn phải có con người chịu trách nhiệm cuối cùng.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://vnexpress.net/khoa-hoc-cong-nghe/ai4vn-2026/giai-phap/he-sinh-thai-giao-thong-thong-minh-elcom-its-225" target="_blank" rel="noopener noreferrer">VnExpress – Giải thưởng AI4VN 2026 (hồ sơ giải pháp của ELCOM) – 09/2026</a></li></ul></section>
                `
            },
            36: {
                category: "Doanh nghiệp",
                title: "Đầu tư mạnh cho công nghệ giúp giảm các chi phí của Ngân hàng",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-digital-bank-efficiency-2026.webp",
                imageAlt: "Khách hàng giao dịch trên điện thoại trong trung tâm vận hành ngân hàng số",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Ở TPBank, khoảng 99,5% giao dịch nay diễn ra trên ứng dụng và máy giao dịch tự động LiveBank. Con số đáng chú ý hơn nằm ở chỗ khác: dù đầu tư khá lớn cho công nghệ, tỷ lệ chi phí trên thu nhập (CIR) của ngân hàng giảm từ trên 40% vài năm trước xuống dưới 35% năm 2026.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Nhiều việc ngân hàng từng phải qua tay nhân viên và nhiều bước giấy tờ. Theo TPBank, những quy trình như mở thẻ, hoàn thiện hồ sơ hay phê duyệt một số sản phẩm từng mất nhiều ngày, thậm chí khoảng một tuần. Tín dụng là lĩnh vực “vốn tiêu tốn nhiều thời gian và nhân lực nhất”: phải bóc tách hồ sơ khách hàng, đọc báo cáo tài chính, tra cứu thông tin doanh nghiệp, tài sản bảo đảm, dữ liệu pháp lý. Mỗi bước đều cần thêm người.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>TPBank đưa phần lớn giao dịch lên ứng dụng và LiveBank, rồi tự động hóa cả phần việc phía sau. Trong tín dụng, AI, công nghệ nhận dạng ký tự (OCR), robot phần mềm và dữ liệu liên thông được đưa vào toàn bộ quy trình: từ bóc tách hồ sơ, báo cáo tài chính, tra cứu tài sản bảo đảm, đến xác thực danh tính qua kết nối trực tiếp với cơ sở dữ liệu quốc gia.</p><p>Với khách hàng, thay đổi hiện ra qua những thao tác nhỏ. Với ChatPay, người dùng sao chép nội dung chuyển khoản từ đoạn chat hay tin nhắn, dán vào ứng dụng; AI tự nhận diện, bóc tách thông tin và soạn sẵn lệnh giao dịch. Theo ngân hàng, một số khoản vay nay được xử lý và giải ngân “gần như tức thì”.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Mở thẻ, hoàn thiện hồ sơ: từ nhiều ngày, có khi khoảng một tuần, xuống vài phút ở dịch vụ số hóa toàn diện (theo TPBank).</li><li>Khoảng 99,5% giao dịch qua kênh số; hơn 17,4 triệu khách hàng, trên 30% hoạt động thường xuyên.</li><li>Chi phí trên thu nhập (CIR): từ trên 40% vài năm trước xuống dưới 35% năm 2026.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Khách hàng là người thấy thay đổi rõ nhất: mở thẻ, làm hồ sơ không còn phải chờ nhiều ngày; chuyển tiền chỉ cần dán nội dung tin nhắn. Với người lao động, thay đổi có hai mặt. Tại Đại hội đồng cổ đông tháng 4/2026, ngân hàng cho biết đã cắt giảm khoảng 500 nhân sự gián tiếp ở các vị trí lặp lại, đồng thời tăng nhân sự kinh doanh trực tiếp và tuyển gần 200 người về công nghệ, dữ liệu, AI. Chủ tịch Đỗ Minh Phú nói: “AI không thể thay thế hoàn toàn con người.”</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Tỷ lệ giao dịch trên kênh số, đứng một mình, chưa nói được nhiều. Ở TPBank, con số nên đặt cạnh nó là chi phí trên thu nhập: số hóa chỉ tạo ra hiệu quả kinh tế khi làm tới cả phần việc phía sau màn hình ứng dụng.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://cafef.vn/chien-luoc-so-cua-tpbank-dong-luc-tang-truong-moi-ngoai-tin-dung-188260803120102848.chn" target="_blank" rel="noopener noreferrer">CafeF – 03/08/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://tpb.vn/tin-tuc/tin-tpbank/ben-trong-ngan-hang-viet-tien-phong-mo-hinh-ai-native" target="_blank" rel="noopener noreferrer">Ngân hàng TMCP Tiên Phong (tpb.vn) – 27/05/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://tuoitre.vn/chu-tich-tpbank-noi-ve-chuyen-sa-thai-nhan-su-vi-ai-20260424121731694.htm" target="_blank" rel="noopener noreferrer">Tuổi Trẻ Online – 24/04/2026</a></li></ul></section>
                `
            },
            37: {
                category: "Doanh nghiệp",
                title: "Chuyển đổi số trong quản lý điện năng: hiệu quả hơn, an toàn hơn",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-drone-power-transmission-2026.webp",
                imageAlt: "Kỹ sư dùng thiết bị bay và dữ liệu nhiệt để kiểm tra đường dây truyền tải điện",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Gần 7.000 người lao động của Tổng công ty Truyền tải điện Quốc gia (EVNNPT) quản lý hơn 33.300 km đường dây và 217 trạm biến áp. Đến cuối năm 2025, 169/174 trạm 220kV đã chuyển sang thao tác xa. Ngoài tuyến, thiết bị bay không người lái tự bay kiểm tra đường dây theo lộ trình lập sẵn.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Lưới truyền tải là “trục xương sống” của hệ thống điện: hơn 33.300 km đường dây và 217 trạm biến áp với tổng dung lượng máy biến áp hơn 139.300 MVA. Trạm biến áp vận hành theo chế độ 3 ca, 4 kíp. Việc kiểm tra đường dây dựa nhiều vào sức người: công nhân phải tới tận hiện trường, có nơi thuộc những vị trí “cực kỳ khó khăn do địa hình đồi núi, vực sâu”. Khối lượng tài sản lớn dần, trong khi lực lượng chỉ gần 7.000 người.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Ở trạm biến áp, EVNNPT chuyển dần sang thao tác xa: việc đóng cắt thiết bị được điều khiển từ xa thay vì làm tại chỗ ở từng trạm. Tổng công ty làm cấp 220kV trước; khi cấp này gần xong mới thử nghiệm ở cấp 500kV. Kế hoạch năm 2026 là chuyển nốt 5 trạm 220kV còn lại và 10 trạm 500kV.</p><p>Trên đường dây, UAV, camera AI, camera nhiệt và máy quét LiDAR được dùng để giám sát hành lang tuyến và soi phát nhiệt tự động ở trạm. Ở Truyền tải điện Krông Búk (Đắk Lắk), công nhân lập sẵn đường bay 3D ngay tại nhà trực; ra hiện trường chỉ cần “ấn nút khởi động”, UAV tự bay kiểm tra cột, cách điện, dây dẫn, còn AI nhận diện hư hỏng bất thường.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>169/174 trạm biến áp 220kV chuyển sang thao tác xa, đạt 97,1% (cuối năm 2025).</li><li>5 trạm biến áp 500kV hoàn thành thử nghiệm thao tác xa.</li><li>Khối lượng vận hành năm 2025: hơn 256,5 tỷ kWh điện truyền tải (ước), tăng hơn 4% so với năm 2024.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người được lợi trực tiếp là công nhân truyền tải. Khi UAV bay theo lộ trình lập sẵn, họ bớt phải tự mình tiếp cận những vị trí nguy hiểm. Theo ông Huỳnh Quang Thịnh, Trưởng phòng Kỹ thuật Công ty Truyền tải điện 3, công nghệ bay UAV kết hợp quét LiDAR được nhân rộng “nhằm giảm nguy cơ mất an toàn cho người lao động”. Người dùng điện không nhìn thấy những thay đổi này, nhưng họ phụ thuộc vào một lưới truyền tải vận hành an toàn.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Ở hạ tầng trọng yếu, thứ tự quan trọng không kém tốc độ. Đi từng bước chắc chắn cũng là một cách chuyển đổi số.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://congthuong.vn/evnnpt-giu-vung-truc-xuong-song-he-thong-dien-437966.html" target="_blank" rel="noopener noreferrer">Báo Công Thương – 07/01/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://nangluongvietnam.vn/evnnpt-tap-trung-dam-bao-van-hanh-an-toan-tin-cay-luoi-truyen-tai-dien-nam-2026-35652.html" target="_blank" rel="noopener noreferrer">Tạp chí Năng lượng Việt Nam – 23/02/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://www.evn.com.vn/d6/news/Thiet-lap-duong-bay-tu-dong-nang-cao-hieu-qua-quan-ly-van-hanh-luoi-dien-truyen-tai-6-14-123273.aspx" target="_blank" rel="noopener noreferrer">Tập đoàn Điện lực Việt Nam (evn.com.vn) – 07/02/2024</a></li></ul></section>
                `
            },
            38: {
                category: "Doanh nghiệp",
                title: "Từ 3–4 giờ giảm xuống 30 phút ở Cảng Nam Đình Vũ: Nơi các thủ tục được đưa lên môi trường số",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-namdinhvu-smartport-2026.webp",
                imageAlt: "Xe container đi qua cổng cảng tự động kết nối trực tiếp với hải quan",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Ở Cảng Nam Đình Vũ (Hải Phòng) của Gemadept, xe container qua cổng mà lái xe không phải xuống làm thủ tục. Camera AI tự nhận diện biển số, container, tải trọng; hoạt động được kết nối trực tiếp với hải quan. Vài năm trước, khách hàng từng mất 3–4 giờ ở cảng cho một bộ lệnh giao dịch.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Muốn lấy hay hạ một container, chủ hàng và nhà xe phải xuống tận cảng để làm lệnh giao dịch, di chuyển, chờ đợi rồi hoàn tất thủ tục trực tiếp. Một bộ lệnh có thể mất 3–4 giờ đồng hồ. Tại cổng, lái xe phải dừng và xuống xe làm thủ tục. Năm 2021, khi COVID-19 bùng phát mạnh, việc phải có mặt trực tiếp ở cảng trở thành trở ngại lớn cho cả khách hàng lẫn cảng.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Tháng 5/2021, Gemadept đưa ứng dụng SmartPort vào hai cảng Nam Hải Đình Vũ và Nam Đình Vũ. Theo ông Đoàn Trung Nguyên, Phó Giám đốc Cảng Nam Đình Vũ, giãn cách xã hội do COVID-19 là áp lực để cảng đẩy nhanh việc này. Khách hàng làm lệnh giao dịch và thanh toán trực tuyến, không cần xuống cảng.</p><p>Bước tiếp theo là cổng cảng. Nam Đình Vũ đưa vào vận hành cổng SmartGate ứng dụng AI, tự động nhận diện biển số xe, container, tải trọng. Việc nhận diện trước đây làm thủ công tại cổng nay do máy đảm nhận, lái xe không phải xuống xe. Dữ liệu đi thẳng sang hải quan thay vì qua bước trung gian. Trong trung tâm điều hành, người vận hành thiết bị nhận lệnh công việc qua màn hình.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Làm một bộ lệnh giao dịch: từ 3–4 giờ tại cảng xuống khoảng 30 phút trực tuyến.</li><li>Hai tháng đầu vận hành SmartPort: 15.000 lệnh giao dịch và 45.000 TEU container được xử lý qua hệ thống.</li><li>Tại cổng Nam Đình Vũ: lái xe không phải xuống xe làm thủ tục; toàn bộ hoạt động kết nối trực tiếp với hải quan.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người hưởng lợi trực tiếp là doanh nghiệp xuất nhập khẩu, các nhà xe và tài xế container. Nhà xe không phải cử người xuống cảng làm lệnh rồi ngồi chờ hàng giờ. Tài xế qua cổng mà không phải xuống xe. Ở trung tâm điều hành, nhân sự có thể phân bổ nguồn lực giữa các khu vực tùy cường độ khai thác. Tại cảng Gemalink cùng hệ thống, Tổng Giám đốc Simon Farhat cho biết cảng đang từng bước hướng tới mô hình “cảng thông minh, không giấy tờ”.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Ở Nam Đình Vũ, số hóa đi từ ngoài vào trong: trước hết đưa lệnh giao dịch lên mạng để khách khỏi phải đến cảng, sau đó mới tự động hóa cổng và nối dữ liệu với hải quan. Mỗi bước bớt đi một lần con người phải có mặt.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://nhandan.vn/tet2026/nen-tang-du-lieu-dinh-hinh-tuong-lai-cang-bien-5091.html" target="_blank" rel="noopener noreferrer">Báo Nhân Dân điện tử – 07/02/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="http://anhp.vn/tu-smartport-cua-gemadept-nghi-den-giac-mo-smart-logistics-tai-thanh-pho-hai-phong-d49627.html" target="_blank" rel="noopener noreferrer">Báo An ninh Hải Phòng – 12/09/2022</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://dantri.com.vn/kinh-doanh/doi-thay-dieu-ky-ben-trong-sieu-cang-o-thanh-pho-giau-co-bac-nhat-mien-bac-20260928210059792.htm" target="_blank" rel="noopener noreferrer">Báo Dân trí – 30/09/2026</a></li></ul></section>
                `
            },
            39: {
                category: "Doanh nghiệp",
                title: "Trợ lý AI: thêm cánh tay đắc lực cho dân văn phòng",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-office-ai-assistant-2026.webp",
                imageAlt: "Nhóm nhân viên văn phòng kiểm tra câu trả lời và nguồn trích dẫn của trợ lý AI",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>MobiGenius, nền tảng trợ lý ảo và tác tử AI của Tổng công ty Viễn thông MobiFone, đã được triển khai hoặc thử nghiệm tại Công an thành phố Hà Nội, Thành ủy Hà Nội, Vietsovpetro. Theo MobiFone, mức tiết kiệm thời gian ước tính chỉ 10–30%, tùy tác vụ. Chính sự khiêm tốn đó đáng chú ý.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Trong cơ quan, doanh nghiệp, nhiều việc chuyên môn bắt đầu bằng tra cứu: tìm đúng văn bản giữa nhiều tệp, nhiều định dạng; lấy số liệu từ những cơ sở dữ liệu lớn; rồi tổng hợp, phân tích, lập báo cáo. Các bước này phần lớn làm bằng tay và phụ thuộc vào việc người làm biết tài liệu nằm ở đâu, có kỹ năng truy vấn dữ liệu hay không. Kho tài liệu càng lớn, thời gian cho khâu tìm kiếm càng dài.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>MobiGenius chuyển việc tìm tay sang hỏi – đáp. Tài liệu được đưa vào hệ thống, bóc tách cả bảng biểu và các thực thể; người dùng đặt câu hỏi và nhận câu trả lời có trích dẫn nguồn để tự kiểm tra lại. Với dữ liệu có cấu trúc, công cụ Data Agent truy vấn và phân tích các cơ sở dữ liệu từ hàng triệu đến hàng chục triệu bản ghi.</p><p>Với các quy trình lặp lại, công cụ MobiFlow cho phép thiết kế luồng công việc tự động bằng giao diện kéo – thả và tích hợp qua API, không phụ thuộc hoàn toàn vào lập trình viên. Tổ chức có thể dùng nền tảng web công khai hoặc triển khai riêng theo dự án.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Nền tảng web công khai: khoảng 4.000 người dùng.</li><li>Các dự án triển khai riêng tại tổ chức, doanh nghiệp: tổng quy mô khoảng 20.000 người dùng.</li><li>Thời gian và khối lượng xử lý công việc: tiết kiệm ước tính 10–30% tùy tác vụ (MobiFone tự đánh giá).</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người hưởng lợi là những người làm chuyên môn phải tra cứu và viết báo cáo hằng ngày: cán bộ ở cơ quan công an, cơ quan đảng, người lao động tại Vietsovpetro, nhân viên nội bộ MobiFone. Việc tìm đúng đoạn văn bản, đúng con số được rút ngắn. Vì câu trả lời có dẫn nguồn, người dùng vẫn giữ quyền kiểm tra và chịu trách nhiệm về kết luận của mình. Mức tiết kiệm 10–30% cho thấy công cụ bớt đi một phần việc, không làm thay toàn bộ.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Con số đáng tin nhất ở đây lại là con số khiêm tốn. Trợ lý AI trong công sở không thay người làm báo cáo; nó bớt đi phần tìm kiếm, và để lại nguồn để con người tự kiểm tra.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://vnexpress.net/khoa-hoc-cong-nghe/ai4vn-2026/giai-phap/nen-tang-agentic-va-tro-ly-ao-mobigenius-224" target="_blank" rel="noopener noreferrer">VnExpress – Hồ sơ giải pháp AI4VN 2026 – không ghi ngày</a></li></ul></section>
                `
            },
            40: {
                category: "Doanh nghiệp",
                title: "Rút ngắn hơn 400 km bằng một chiếc điện thoại",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-laichau-livestream-agriculture-2026.webp",
                imageAlt: "Phụ nữ dân tộc ở Lai Châu livestream và đóng gói nông sản địa phương",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Hơn 400 km đường đèo dốc từng khiến Lai Châu gần như “cách biệt” với thị trường tiêu thụ nông sản lớn nhất miền Bắc. Từ tháng 8/2025, Viettel Post cùng tỉnh mở lớp dạy bà con bán hàng trên mạng. Nay khoảng 20 phụ nữ dân tộc ở Lai Châu đã tự livestream bán nông sản của mình.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Chè, mắc ca, chuối, gạo Séng Cù, mật ong, khoai sâm… Lai Châu có nhiều nông sản ngon nhưng ở rất xa. Quãng đường hơn 400 km ngoằn ngoèo qua đèo dốc ngăn sản phẩm đến với người mua ở miền xuôi. Người dân chủ yếu bán ở chợ phiên truyền thống. Chụp ảnh sản phẩm, mở gian hàng trực tuyến hay đóng gói cho những chuyến hàng xa còn là chuyện xa lạ, và nhiều người hoài nghi việc bán hàng qua mạng.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Tháng 8/2025, Viettel Post khởi xướng dự án “Hành trình nông sản”, phối hợp với UBND tỉnh Lai Châu. Các lớp tập huấn được mở: người dân học chụp ảnh sản phẩm, viết mô tả, tạo gian hàng trực tuyến và tự livestream. Chuyên gia logistics của Viettel Post giúp chuẩn hóa khâu đóng gói, bảo quản, vận chuyển để “mỗi gói chè, mỗi chai mật ong giữ nguyên hương vị vùng cao khi đến tay khách hàng”.</p><p>Hạ tầng đã sẵn: 100% trung tâm xã và hơn 98% thôn bản của Lai Châu có sóng di động và Internet. Có cả người từ nơi khác đến góp sức, như chị Vũ Bích Hồng (TikToker “Cô Ba Hồng”), chuyển lên Lai Châu sinh sống gần hai năm và trực tiếp hỗ trợ bà con livestream.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Sau chưa đầy ba tháng, hashtag #HanhTrinhNongSan đạt gần 30 triệu lượt xem trên TikTok (lượt xem, không phải người mua).</li><li>Phiên livestream 3–4/11/2025 tại xã Bình Lư: 1.613 đơn hàng, doanh thu gần 260 triệu đồng, hơn 1 tấn miến dong được tiêu thụ.</li><li>Khoảng 20 phụ nữ dân tộc đã biết livestream bán hàng; có người thu nhập ổn định 10 triệu đồng/tháng, có hộ bán được 300 tấn khoai sâm trong hai tháng.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Thay đổi lớn nhất thuộc về bà con, đặc biệt là phụ nữ dân tộc ở Lai Châu. Từ hoài nghi ban đầu, bà con dần tin vào công nghệ khi những đơn hàng đầu tiên từ Hà Nội, Quảng Ninh, Đà Nẵng bắt đầu “nổ”. Nông sản không còn chỉ chờ người mua ở chợ phiên. Theo Phó Chủ tịch UBND tỉnh Tống Thanh Hải, nhờ nền tảng số, người dân “không chỉ bán được nông sản mà còn xây dựng được thương hiệu riêng”.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Khi sóng di động đã phủ tới thôn bản, khoảng cách còn lại không nằm ở đường đèo mà ở kỹ năng. Dạy người tại chỗ cách bán hàng, đóng gói và giao hàng đi xa, Lai Châu rút ngắn được hơn 400 km bằng chiếc điện thoại.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://tuoitre.vn/350-tan-nong-san-va-cach-kinh-doanh-khong-khoang-cach-cua-lai-chau-20251107095902652.htm" target="_blank" rel="noopener noreferrer">Tuổi Trẻ Online – 07/11/2025</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://ttvhbinhlu.laichau.gov.vn/index.php/Tin-tu-Tam-Duong/phien-livestream-hanh-trinh-nong-san-lai-chau-binh-lu-vuon-minh-thu-hut-hon-867-nghin-luot-xem-doanh-thu-gan-260-trieu-dong-7829.html" target="_blank" rel="noopener noreferrer">Trang Thông tin điện tử huyện Tam Đường (Lai Châu) – 05/11/2025</a></li></ul></section>
                `
            },
            41: {
                category: "Doanh nghiệp",
                title: "Ba thao tác, mười giây xác thực: bớt một bước chờ ở sân bay",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-airport-biometric-kiosk-2026.webp",
                imageAlt: "Hành khách được hướng dẫn xác thực khuôn mặt tại kiosk sinh trắc học sân bay",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Trên chuyến VN7545 của Vietnam Airlines từ Hà Nội đi Huế tháng 8/2026, 92% hành khách làm thủ tục trực tuyến hoặc bằng sinh trắc học. Ở nhà ga T1 Nội Bài, kiosk sinh trắc học ghi nhận khoảng 3.000–4.000 lượt khách mỗi ngày. Mỗi lần xác thực mất khoảng 10 giây.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Đi một chuyến bay nội địa, hành khách quen với việc xuất trình giấy tờ ở nhiều điểm: quầy làm thủ tục, cửa an ninh, cửa lên máy bay. Mỗi lần là một lần nhân viên đối chiếu gương mặt với giấy tờ bằng mắt. Vào khung giờ cao điểm và các dịp nghỉ lễ, áp lực dồn lên khu làm thủ tục. Thẻ lên máy bay in giấy cũng là thứ nhỏ nhưng lặp lại trên mọi chuyến bay.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Nay, gương mặt thay cho việc chìa giấy tờ. Hành khách có thể làm thủ tục trực tuyến từ trước, hoặc xác thực bằng khuôn mặt ngay tại sân bay. Tại nhà ga T1, Cảng hàng không quốc tế Nội Bài đưa vào khai thác hệ thống kiosk sinh trắc học với ba bước: quét thẻ lên máy bay, quét căn cước gắn chip, nhìn thẳng vào camera để hệ thống nhận diện khuôn mặt.</p><p>Tình nguyện viên đứng cạnh hướng dẫn từng thao tác, nhất là cho người cao tuổi và người lần đầu sử dụng. Với Vietnam Airlines, cách làm này còn gắn với chương trình “Bay nhẹ”: bớt thẻ in, bớt giấy trên mỗi chuyến, như trên chuyến VN7545 đến Huế.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Xác thực tại kiosk sinh trắc học: khoảng 10 giây với ba thao tác.</li><li>Kiosk tại Nội Bài: khoảng 3.000–4.000 lượt hành khách sử dụng mỗi ngày (8/2026), tăng từ khoảng 2.000–3.000 lượt (7/2026).</li><li>Chuyến VN7545 Hà Nội – Huế: 92% hành khách làm thủ tục trực tuyến hoặc bằng sinh trắc học.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người được lợi trực tiếp là hành khách, nhất là vào mùa cao điểm. Không phải lấy giấy tờ ra ở mỗi chặng kiểm tra, thủ tục gói gọn trong vài thao tác. Người cao tuổi, người lần đầu dùng có tình nguyện viên hướng dẫn. Với nhân viên sân bay và hãng bay, việc đối chiếu người với giấy tờ được máy hỗ trợ, góp phần giảm áp lực ở các khung giờ đông khách.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Mỗi thay đổi đều rất nhỏ: bớt một lần xuất trình giấy tờ, bớt một tấm thẻ in. Nhưng khi hàng nghìn lượt khách mỗi ngày cùng làm như vậy, nhà ga bớt được áp lực giờ cao điểm mà không cần xây thêm quầy.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://spirit.vietnamairlines.com/spirit-channel/vtv-gan-4-000-luot-khach-ngay-lam-thu-tuc-bang-sinh-trac-hoc-tai-noi-bai.html" target="_blank" rel="noopener noreferrer">VTV (đăng lại trên Vietnam Airlines Spirit) – 05/08/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="http://vov.vn/xa-hoi/san-bay-noi-bai-trien-khai-kiosk-sinh-trac-hoc-rut-ngan-thoi-gian-check-in-post1313014.vov" target="_blank" rel="noopener noreferrer">Báo điện tử VOV – 07/07/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://baochinhphu.vn/bay-nhe-toi-hue-them-mot-hanh-trinh-xanh-cung-vietnam-airlines-102260826141829254.htm" target="_blank" rel="noopener noreferrer">Báo điện tử Chính phủ – 26/08/2026</a></li></ul></section>
                `
            },
            42: {
                category: "Doanh nghiệp",
                title: "Từ 15 phút giảm còn 1 phút 13 giây: Khi công nghệ số rút ngắn đường đi của mẫu xét nghiệm",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-hospital-pneumatic-sample-2026.webp",
                imageAlt: "Điều dưỡng đưa hộp mẫu xét nghiệm có chip vào hệ thống ống khí nén",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Tại Bệnh viện Đa khoa Tâm Anh, mẫu máu vừa lấy xong được đóng vào hộp vận chuyển chuyên dụng, đưa vào hệ thống ống khí nén nối các tòa nhà. Theo bệnh viện, thời gian đưa mẫu tới Trung tâm Xét nghiệm giảm từ khoảng 15 phút xuống khoảng 1 phút 13 giây.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Một lượt khám ở bệnh viện lớn kéo theo nhiều khâu chờ nối tiếp nhau: xếp hàng làm thủ tục ở khu tiếp đón, chờ mẫu xét nghiệm được chuyển từ nơi lấy mẫu tới phòng xét nghiệm, chờ kết quả và hồ sơ các lần khám trước đến tay bác sĩ. Theo bệnh viện, riêng khâu vận chuyển mẫu từng mất khoảng 15 phút. Mỗi khâu chậm vài phút, cộng lại thành thời gian người bệnh phải ở lại bệnh viện lâu hơn.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Tâm Anh thay đổi ở những khâu ít ai nhìn thấy. Ngay khi điều dưỡng đóng nắp hộp vận chuyển chuyên dụng, mẫu bệnh phẩm đi vào hệ thống khí nén. Mỗi hộp gắn chip định danh, ghi lại thời điểm lấy mẫu, rời trạm và đến phòng xét nghiệm, để bệnh viện theo dõi toàn bộ quá trình và tìm ra điểm nghẽn.</p><p>Ở khu tiếp đón của Tâm Anh TP.HCM, người bệnh không phải xếp hàng ở quầy: tại một trong 34 kiosk, họ tự xác thực thông tin, kiểm tra quyền lợi bảo hiểm y tế, thanh toán dịch vụ ban đầu và nhận số thứ tự khám. Khi vào phòng khám, bác sĩ xem toàn bộ lịch sử khám chữa bệnh trên một màn hình bệnh án điện tử.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Vận chuyển mẫu xét nghiệm: từ khoảng 15 phút xuống khoảng 1 phút 13 giây (theo bệnh viện, không nêu phạm vi và cách đo).</li><li>34 kiosk tự phục vụ tại khu tiếp đón Tâm Anh TP.HCM; theo bệnh viện, một lượt làm thủ tục tại kiosk mất khoảng một phút.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Theo mô tả của bệnh viện, người bệnh được lợi ở chỗ bớt xếp hàng và bớt chờ. Một bệnh nhân 56 tuổi, được bài viết gọi là ông Việt, tự hoàn tất thủ tục tại kiosk trong khoảng một phút. Với bác sĩ, dữ liệu có sẵn ngay khi bắt đầu khám. BS.CKII Trần Thị Thanh Trúc, Trưởng khoa Nội Tổng hợp, nói: “Giá trị lớn nhất của bệnh án điện tử không nằm ở việc lưu trữ nhiều dữ liệu hơn mà ở chỗ mọi dữ liệu cần thiết đều có mặt ngay khi cuộc khám bắt đầu.”</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Những thay đổi đáng kể trong bệnh viện đôi khi nằm ở chỗ ít ai để ý: một đường ống nối các tòa nhà, một con chip trên hộp đựng mẫu. Bớt vài phút ở mỗi khâu, người bệnh bớt được thời gian chờ.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://tamanhhospital.vn/tin-tuc/ban-do-tri-tue-trong-hanh-trinh-kham-chua-benh-tai-he-thong-benh-vien-da-khoa-tam-anh/" target="_blank" rel="noopener noreferrer">Bệnh viện Đa khoa Tâm Anh (tamanhhospital.vn) – 29/08/2026</a></li></ul></section>
                `
            },
            43: {
                category: "Doanh nghiệp",
                title: "AI - Cánh tay đắc lực giúp giáo viên hiểu học sinh hơn",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-ai-online-class-teacher-2026.webp",
                imageAlt: "Giáo viên trực tuyến theo dõi mức độ tiếp thu của học sinh với trợ lý AI",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Uniclass, lớp học trực tuyến do Công ty cổ phần Giáo dục Educa Corporation ra mắt tháng 12/2024, đặt giáo viên tiểu học và THCS ở trung tâm. AI được giao phần quan sát: camera theo dõi biểu hiện học sinh, công nghệ chỉnh phát âm, hệ thống ghi lại quá trình học để giáo viên điều chỉnh cách dạy.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Học trực tuyến có một điểm yếu quen thuộc: giáo viên chỉ nhìn thấy học sinh qua những ô hình nhỏ trên màn hình. Khó biết em nào đang theo kịp, em nào đã bỏ lỡ bài. Phát âm của từng em khó được sửa kỹ khi cả lớp cùng học. Sau buổi học, giáo viên thường chỉ còn điểm bài kiểm tra để đánh giá mức độ tiếp thu, trong khi những gì diễn ra trong giờ học khó được ghi lại.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Uniclass chọn bắt đầu từ giáo viên. Đội ngũ được tuyển từ các trường tiểu học, THCS trọng điểm và trường chuẩn quốc gia, dựa trên chuyên môn, kinh nghiệm và năng lực sư phạm; trước khi đứng lớp, giáo viên được đào tạo nội bộ để thống nhất phương pháp và cách tổ chức lớp trực tuyến. Cô Nguyễn Thanh Tâm, giáo viên chủ nhiệm Trường Tiểu học Phenikaa, hơn 10 năm kinh nghiệm, tham gia xây dựng chương trình Tiếng Việt.</p><p>Công nghệ được đặt vào vai trợ lý. Camera AI theo dõi biểu hiện của học sinh trong lớp; công nghệ I-speak của Edupia chỉnh phát âm; dữ liệu về kết quả và quá trình học được hệ thống ghi nhận, giúp giáo viên đánh giá mức độ tiếp thu và xác định nội dung cần củng cố.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Uniclass ra mắt tháng 12/2024; doanh nghiệp chưa công bố số học viên, số giáo viên hay kết quả học tập của riêng nền tảng này.</li><li>Educa Corporation, đơn vị phát triển, cho biết đã có 10 triệu lượt học viên trên các sản phẩm của mình (số liệu toàn công ty).</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Theo doanh nghiệp, học sinh được học với giáo viên từ các trường trọng điểm, được sửa phát âm, và quá trình học được ghi lại để giáo viên điều chỉnh cách dạy cho từng em. Ông Lê Tuấn Nghĩa, Tổng giám đốc Uniclass, nói: “AI chỉ thực sự có ý nghĩa khi giúp giáo viên hiểu học sinh rõ hơn, từ đó có thêm cơ sở để điều chỉnh phương pháp giảng dạy phù hợp với từng em.” Cô Tâm nhấn mạnh việc giúp học sinh “hiểu vì sao phải làm như vậy”.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Ở lớp học trực tuyến, câu hỏi đáng đặt ra không phải AI làm được gì, mà AI giúp giáo viên thấy thêm điều gì về học sinh. Còn hiệu quả thực sự vẫn phải chờ những con số về kết quả học tập.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://vnexpress.net/uniclass-lay-doi-ngu-giao-vien-lam-nen-tang-dao-tao-5116053.html" target="_blank" rel="noopener noreferrer">VnExpress (nội dung được tài trợ) – 08/09/2026</a></li></ul></section>
                `
            },
            44: {
                category: "Người dân",
                title: "Drone rời ruộng lúa bay vào cứu trợ vùng tâm lũ",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-flood-relief-drone-2026.webp",
                imageAlt: "Nhóm tình nguyện điều khiển drone đưa nhu yếu phẩm vào khu dân cư bị ngập",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Tháng 10/2025, lũ sau bão số 10, 11 cô lập nhiều xóm ở miền Bắc. Một nhóm “phi công” drone từ khắp các tỉnh tự tập hợp, mang những chiếc máy thường ngày phun thuốc, bón phân ra vùng ngập. Mỗi chuyến bay vài phút, chở khoảng 50kg hàng, chi phí chừng 50.000 đồng.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Ở những điểm ngập sâu, nước chảy xiết, xuồng máy khó ngược dòng. Tại Quế Nham, trên màn hình flycam, xóm nhỏ như ốc đảo giữa biển nước, gần 40 hộ bị ngập sâu. Bà con cần nước uống, đồ ăn, thuốc men, pin sạc. Kỹ sư Nguyễn Xuân Huy nhớ rằng trong các trận lũ trước, đội cứu trợ nào cũng dùng xuồng, và đã có những tai nạn đáng tiếc do nước xoáy, có khi thiệt mạng. Đưa hàng bằng thuyền vào những nơi như vậy luôn tiềm ẩn rủi ro.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Sau khi lũ về, ngày 9–10/10, nhóm drone thiện nguyện được lập chỉ trong vài giờ, từ kết nối của những người từng làm cứu trợ cùng nhau. Ban đầu có 12 thành viên, hơn 10 chiếc drone và nhiều flycam. Họ là người bay dịch vụ nông nghiệp lâu năm, kỹ sư, bạn trẻ đến từ Kiên Giang, Long An, Đắk Lắk, Hà Tĩnh, Hà Nội… Người mang máy, người góp máy phát điện, người lái ô tô chở thiết bị.</p><p>Flycam bay trước, khảo sát vùng ngập, đo khoảng cách và điểm nhận hàng. Sau đó drone T50 treo túi hàng trên dây dài khoảng 30m, bay 5–6 phút mỗi chuyến, thả xuống cho bà con. Máy phát điện chạy liên tục để kịp sạc pin. Nơi nước chảy chậm, nhóm chuyển sang ca nô, phối hợp với đội ca nô từ Hà Tĩnh ra.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Tại Quế Nham, 50 túi hàng được drone đưa vào điểm ngập, không gặp sự cố nào.</li><li>Mỗi drone T50 tải được 40–50kg hàng; theo anh Nguyễn Xuân Huy, chi phí khoảng 50.000 đồng cho một chuyến chở 50kg.</li><li>Cùng ca nô, nhóm đưa hàng tấn đồ ăn, nước uống, thuốc men, đèn pin, sạc dự phòng tới bà con bị cô lập ở Bắc Ninh và Hà Nội.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người được lợi là bà con ở những xóm bị nước cô lập. Có điểm ngập không điện, không hoa tiêu, người dân nháy đèn pin làm tín hiệu để drone thả đúng chỗ. “Đèn nhấp nháy nhiều nơi trong điểm ngập, chúng tôi nhìn màn hình xúc động lắm vì bà con đang trông đợi mình”, anh Nguyễn Hữu Thiện Trí kể. Với người đi cứu, rủi ro cũng giảm: “Cứu trợ bằng drone an toàn hơn nhiều, nếu rơi máy bay mình chỉ mất tiền”, anh Huy nói.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Chiếc drone ngày thường phun thuốc trên ruộng, gặp lũ lại thành phương tiện cứu trợ. Công nghệ đã có sẵn trong nông nghiệp; điều làm nên khác biệt là những người biết điều khiển nó và sẵn sàng lên đường.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://tuoitre.vn/phi-doi-drone-vao-tam-lu-20251019104146574.htm" target="_blank" rel="noopener noreferrer">Tuổi Trẻ Online – 19/10/2025</a></li></ul></section>
                `
            },
            45: {
                category: "Người dân",
                title: "Khi thổ cẩm không còn phụ thuộc vào bước chân du khách",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-brocade-online-orders-2026.webp",
                imageAlt: "Phụ nữ Mông chụp ảnh và đóng gói sản phẩm thổ cẩm để bán trực tuyến",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Trước dịch COVID-19, toàn bộ doanh thu của Hợp tác xã Mường Hoa (xã Tả Van, Lào Cai) đến từ khách du lịch đi ngang qua bản. Mất khách, chị Sùng Thị Lan học bán hàng qua mạng. Nay 70% doanh thu đến từ đơn đặt hàng thổ cẩm; mạng lưới lớn từ 9 thành viên thành hơn 300 phụ nữ.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Hợp tác xã Mường Hoa thành lập năm 2018 với 9 thành viên, làm đồ thổ cẩm truyền thống. Trước đại dịch, 100% doanh thu đến từ khách du lịch trekking dọc tuyến Sa Pa – Tả Van. Khách đi qua thì có người mua; khách không đến thì gần như không có đơn hàng. Khi COVID-19 làm đứt dòng khách, nguồn thu ấy mất theo. Và bản khi đó chưa có Internet. “Chúng tôi hoàn toàn không biết online là gì vì bản chưa có Internet”, chị Lan kể.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Chị Lan, 36 tuổi, người Mông, Giám đốc hợp tác xã, tham gia khóa học chuyển đổi số do dự án GREAT (Chính phủ Úc tài trợ) và KisStartup tổ chức. “Sau nhiều buổi học, chúng tôi mới hiểu Facebook dùng để tiếp cận thị trường, Zalo có thể chăm sóc khách hàng”, chị nói. Hợp tác xã lập fanpage, chụp ảnh sản phẩm và đăng bán. “Chúng tôi lập fanpage Hợp tác xã Mường Hoa và bắt đầu có đơn hàng dù dịch vẫn còn.”</p><p>Thay đổi lớn nhất nằm ở cách bán: từ chờ khách đi ngang qua mua đồ lưu niệm, hợp tác xã chuyển sang nhận đơn đặt hàng thổ cẩm theo tiêu chuẩn chất lượng cao. Chị Lan cũng mở các buổi chia sẻ nhỏ cho phụ nữ trong bản về cách dùng điện thoại, đăng bài, chụp ảnh sản phẩm.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Mạng lưới: từ 9 thành viên ban đầu thành hơn 300 phụ nữ ở nhiều địa phương.</li><li>Doanh thu: từ 100% phụ thuộc khách du lịch sang 70% đến từ đơn đặt hàng thổ cẩm chất lượng cao.</li><li>Thu nhập: phụ nữ tham gia có trung bình 300.000–700.000 đồng/tháng từ việc làm sản phẩm thủ công.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Với những người phụ nữ trong mạng lưới, nghề dệt không còn phụ thuộc vào việc hôm nay có đoàn khách nào đi qua. Mỗi tháng, họ có trung bình 300.000–700.000 đồng từ chính sản phẩm thủ công của mình. Kỹ năng dùng điện thoại, đăng bài, chụp ảnh được truyền từ người này sang người khác trong bản. Bà Vũ Thị Quỳnh Anh, Phó trưởng nhóm dự án GREAT, nhận xét: “Chị Lan là ví dụ điển hình cho chuyển đổi số phù hợp với năng lực của doanh nghiệp siêu nhỏ.”</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Câu chuyện này không dừng ở chỗ bà con vùng cao biết dùng Facebook. Điều đáng nói là một hợp tác xã nhỏ đã đổi được vị thế của mình: từ ngồi chờ khách đi qua sang chủ động nhận đơn hàng.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://tuoitre.vn/khong-con-canh-cho-khach-du-lich-nguoi-phu-nu-mong-giup-ca-ban-doi-doi-nho-chuyen-doi-so-20251128222150066.htm" target="_blank" rel="noopener noreferrer">Tuổi Trẻ Online – 29/11/2025</a></li></ul></section>
                `
            },
            46: {
                category: "Người dân",
                title: "40 triệu đồng và một ứng dụng giao hàng cho quê nhà",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-local-delivery-startup-2026.webp",
                imageAlt: "Nhà sáng lập trẻ kết nối cửa hàng và tài xế giao hàng tại đô thị ven biển",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Cha mất, Dương Nguyễn Quốc Huy rời công ty phần mềm, về La Gi ở với mẹ. Với khoảng 40 triệu đồng, anh dựng VN SHIP, ứng dụng giao hàng, gọi xe cho quê mình. Sau khoảng 5 tháng, VN SHIP đã kết nối hơn 700 cửa hàng và tạo việc làm cho hơn 20 tài xế.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Huy sinh năm 1996, tốt nghiệp ngành Công nghệ thông tin năm 2020 rồi vào làm ở một công ty phần mềm. Về quê, anh lập trang Lagi Reviews, tự đi, tự quay, tự viết về quán ăn, cảnh đẹp của thị xã La Gi (Bình Thuận cũ, nay thuộc Lâm Đồng). Những chuyến đi cho anh thấy một khoảng trống: nhiều cửa hàng có sản phẩm tốt nhưng chưa đủ điều kiện đầu tư bán hàng trực tuyến, trong khi nhu cầu gọi xe, giao đồ ăn, gửi hàng, mua hộ của người dân ngày càng lớn.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Từ giới thiệu quán, Huy chuyển sang xây một nền tảng nối ba bên: cửa hàng, khách hàng và tài xế, ở quy mô vừa với một đô thị địa phương. Những ngày đầu, anh làm gần hết mọi việc: tự tìm cửa hàng, giới thiệu dịch vụ, tìm tài xế, theo dõi đơn, xử lý từng sự cố. “Mình làm từ nhỏ thôi. Có cửa hàng nào tham gia thì kết nối trước, có đơn thì xử lý, rồi vừa làm vừa điều chỉnh”, Huy kể.</p><p>Ít vốn, anh tự học và đưa công nghệ vào cả khâu thiết kế, làm video, truyền thông. “Với người khởi nghiệp ít vốn, công nghệ có thể là một đòn bẩy. Mình không có nhiều tiền thì phải biết tận dụng những thứ mình có”, anh nói.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Sau khoảng 5 tháng: hơn 700 cửa hàng kết nối, khoảng 120–220 đơn hàng mỗi ngày.</li><li>Hơn 20 tài xế có việc làm, thu nhập khoảng 3–12 triệu đồng/tháng tùy thời gian và hiệu quả làm việc.</li><li>Trang Lagi Reviews đạt hơn 120.000 người theo dõi.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Với Huy, mỗi cửa hàng tham gia là một hộ kinh doanh có thêm cơ hội tiếp cận khách hàng; mỗi tài xế có thêm đơn là một người lao động có thêm thu nhập, ngay tại quê. Anh cũng là Bí thư Chi đoàn phường Phước Hội, qua mô hình “Em nuôi của Đoàn” hỗ trợ 3 học sinh khó khăn, mỗi em 500.000 đồng/tháng. “Khởi nghiệp không chỉ để tạo thu nhập. Nếu có thể tạo việc làm, hỗ trợ cửa hàng và giúp đỡ người khó khăn thì việc mình làm sẽ ý nghĩa hơn”, anh nói.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Ở một đô thị nhỏ, khoảng trống của kinh tế số không nằm ở công nghệ cao, mà ở những nhu cầu rất gần: giao một món ăn, gửi một món đồ. Người hiểu quê mình nhất lại là người nhìn thấy nó trước.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://tienphong.vn/roi-cong-ty-lon-chang-trai-ve-que-khoi-nghiep-voi-ung-dung-giao-hang-post1874938.tpo" target="_blank" rel="noopener noreferrer">Báo Tiền Phong – 13/09/2026</a></li></ul></section>
                `
            },
            47: {
                category: "Người dân",
                title: "Tìm lại gương mặt liệt sĩ từ ký ức gia đình",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-martyr-photo-restoration-2026.webp",
                imageAlt: "Gia đình cùng nhóm tình nguyện xem và góp ý bản phục dựng một bức ảnh cũ",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Liệt sĩ Huỳnh Văn Quên không còn tấm ảnh nào đủ rõ để đối chiếu. Nhóm tình nguyện TeamLee mất gần nửa tháng lần theo lời kể của gia đình để dựng lại gương mặt ông. Tháng 7/2026, bức di ảnh được trao cho vợ ông, bà Nguyễn Thị Lệ.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Nhiều gia đình liệt sĩ không có một di ảnh rõ ràng để thờ. Ảnh cũ phai mờ, hư hỏng, gần như mất đường nét; có trường hợp không còn hình ảnh nào để đối chiếu. Hài cốt liệt sĩ Huỳnh Văn Quên được tìm thấy tại Công viên Lê Thị Riêng (phường Hòa Hưng, TP.HCM), nhưng gương mặt ông chỉ còn trong trí nhớ người thân. Người đã hy sinh cách đây hàng chục năm, con cháu sau này khó có một hình ảnh để biết về họ.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Năm 2021, anh Phạm Văn Tuấn (44 tuổi) bắt đầu nhận những bức ảnh liệt sĩ gửi đến xưởng in của mình. Thấy nhiều gia đình thiếu di ảnh, anh đề nghị in miễn phí và cùng các thành viên duy trì việc phục dựng.</p><p>Với ảnh cũ, nhóm xử lý, phục hồi bằng kỹ năng và công nghệ. Với trường hợp gần như không còn ảnh, cách làm đi từ ký ức: người thân kể lại khuôn mặt, mái tóc, vóc dáng; các thành viên phác họa rồi phục dựng. Bản dựng được gửi về gia đình xem trước; chưa giống thì chỉnh theo góp ý. Chỉ khi gia đình xác nhận đúng với ký ức, bức ảnh mới được in thành di ảnh. Tại TP.HCM, Bộ Tư lệnh TP.HCM phối hợp Công an TP.HCM và các địa phương kết nối thân nhân liệt sĩ với nhóm.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Sau 5 năm (từ 2021), nhóm đã phục dựng và in miễn phí hơn 10.000 bức ảnh.</li><li>Trong đợt thực hiện tại TP.HCM, 20 thành viên tình nguyện tham gia; 150 bức di ảnh đã được trao đến các gia đình.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người nhận là vợ, mẹ, con cháu các liệt sĩ. Bà Lê Thị Khi (phường Bình Đông) đặt di ảnh chồng do TeamLee phục dựng lên bàn thờ, thay cho tấm ảnh đã cũ màu. “Có gia đình vừa khóc vừa mừng. Bao nhiêu năm không có di ảnh để thờ, giờ có một bức ảnh đặt lên bàn thờ. Anh em trong nhóm đứng đó cũng không cầm được nước mắt”, anh Tuấn kể. Gần 1.000 bức khác đang được phục dựng, dự kiến trao trước ngày 27/7/2027.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Khi bức ảnh gốc đã mất, ký ức người thân trở thành nguồn dữ liệu. Nhưng công nghệ chỉ làm đúng việc của nó khi gia đình là người nói lời cuối: gương mặt này đã đúng là người thân của họ hay chưa.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://vietnamnet.vn/nguoi-tre-phuc-dung-guong-mat-liet-si-huynh-van-quen-tu-ky-uc-2550460.html" target="_blank" rel="noopener noreferrer">VietNamNet – 01/09/2026</a></li></ul></section>
                `
            },
            48: {
                category: "Người dân",
                title: "Ba chiếc máy tính cũ trong kho và phòng tin học đầu tiên ở vùng biên",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-border-school-old-computers-2026.webp",
                imageAlt: "Thầy giáo sửa máy tính cũ để học sinh vùng biên được thực hành tin học",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Năm 2020, khi thầy Hoàng Dương Hòa về Trường tiểu học và THCS A Ngo (nay thuộc xã La Lay, Quảng Trị), học sinh ở đây chưa từng chạm tay vào bàn phím. Thầy tìm trong kho ba chiếc máy tính gần 20 năm tuổi, tự tay sửa lại. Đó là phòng tin học đầu tiên của trường.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>A Ngo nằm sát biên giới Việt – Lào; học trò phần lớn là con em đồng bào Pa Kô, Vân Kiều. Năm 2020, môn tin học ở trường “gần như là con số không tròn trĩnh”. Không phòng học, không thiết bị. Các em chỉ biết máy tính qua tivi hoặc nhìn thoáng qua ở ủy ban xã. Có em chưa từng thấy máy vi tính ngoài đời thực. Với học sinh dân tộc thiểu số, tin học lại càng khó vì có cả tiếng Anh. Trường còn nhiều điểm lẻ nằm rải rác, chưa có phòng máy.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Thầy Hòa học sư phạm tin học ở Huế, từng làm lập trình viên tại một chi nhánh của Tập đoàn FPT rồi bỏ việc sau một năm để về quê đi dạy. Ở A Ngo, thầy sửa, lau chùi những chiếc máy cũ; cùng đồng nghiệp tự đóng, tự hàn từng chiếc bàn gỗ, khoét lỗ luồn dây. Với các điểm trường chưa có phòng tin học, thầy chở 5–6 chiếc laptop, dây sạc và cục phát wifi trên những con đường trơn trượt tới lớp.</p><p>Cách dạy cũng đổi. Thầy bỏ lối lý thuyết khô khan, dùng trò chơi để dạy gõ phím, dạy làm video, và tự viết ứng dụng Android không cần máy chủ để học sinh học mọi lúc mọi nơi. Thầy còn dạy các em gõ dấu tiếng Việt trên điện thoại để về chỉ lại cho cha mẹ.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Lần đầu tiên, 100% học sinh của trường được học tin học thực hành; thầy Hòa hiện dạy 12 lớp ở 4 điểm trường.</li><li>Theo Phó hiệu trưởng Ngô Duy Hưng, trường là đơn vị đầu tiên dạy tin học tại các điểm trường lẻ của huyện Đakrông (cũ).</li><li>Năm 2021, một học sinh đoạt giải nhì Đại sứ Du lịch Quảng Trị bằng video về văn hóa Pa Kô; nhiều lứa sau đoạt giải tin học trẻ cấp huyện, cấp tỉnh.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Những đứa trẻ từng ngại chạm vào con chuột nay gõ được tên mình, trình bày ý tưởng bằng PowerPoint. Thầy Hòa còn tham gia tổ công nghệ số cộng đồng của xã, giúp bà con ngồi tại nhà làm dịch vụ công trực tuyến, tích hợp giấy tờ vào VNeID. Thầy Hưng nói, với những gia đình mà con em “ăn chưa đủ no, áo mặc chưa đủ ấm”, “chưa ai nghĩ giờ đây các em học sinh ấy có thể ngồi gõ máy vi tính, click chuột mở internet”.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Phòng tin học đầu tiên ở A Ngo không bắt đầu từ một dự án mua sắm thiết bị. Nó bắt đầu từ ba chiếc máy cũ trong kho, một người biết sửa và chịu chở máy tới từng điểm trường.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://thanhnien.vn/chiec-may-tinh-20-nam-tuoi-va-phong-tin-hoc-dau-tien-cua-thay-giao-quang-tri-185251120161954051.htm" target="_blank" rel="noopener noreferrer">Báo Thanh Niên – 20/11/2025</a></li></ul></section>
                `
            },
            49: {
                category: "Người dân",
                title: "Cô giáo Toán ở Thốt Nốt và hơn mười năm tự đổi cách dạy",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-teacher-digital-learning-2026.webp",
                imageAlt: "Cô giáo hướng dẫn học sinh học Toán và kỹ năng sống bằng công cụ số",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Hơn 20 năm gắn bó với Trường THCS Thốt Nốt (TP. Cần Thơ), Nhà giáo ưu tú Đỗ Thị Ngọc Duyên đi từ những slide PowerPoint đầu tiên đến dạy học trực tuyến, rồi một phần mềm thực tế ảo dạy kỹ năng sống. Hành trang là chiếc máy chiếu cũ và chiếc laptop đã mòn phím.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Những năm đầu cô đứng lớp, “ứng dụng CNTT” trong trường phổ thông chủ yếu là soạn giáo án trên máy và trình chiếu PowerPoint. Với nhiều thầy cô lớn tuổi, làm quen với máy chiếu, chuột, bàn phím đã là cả một thử thách. Giờ Toán chủ yếu là những con số khô khan. Kỹ năng sống thì dạy bằng vài trang lý thuyết khó nhớ, trong khi học trò phải đối diện bạo lực học đường, tai nạn thương tích, nguy cơ từ mạng xã hội.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Cô bắt đầu bằng việc đưa hình ảnh, sơ đồ, đoạn phim ngắn vào giờ Toán. Năm 2014, cô dự thi “Bài giảng điện tử E-learning” của Bộ GD&amp;ĐT với bài giảng thiết kế như một lớp học trực tuyến. Khi COVID-19 buộc thầy trò gặp nhau qua màn hình, cô rà lại toàn bộ quy trình: tiết nào cần trò chơi, tiết nào thảo luận nhóm, bài nào để học sinh tự khám phá. Từ đó thành sáng kiến hệ thống hóa công cụ dạy học trực tuyến.</p><p>Rồi đến “Phần mềm Hướng dẫn Kỹ năng sống”: thay vì đọc lý thuyết, học sinh bước vào tình huống mô phỏng: bị rủ rê thử thách nguy hiểm, gặp người lạ có hành vi bất thường, chứng kiến cháy nổ. Các em chọn cách xử lý, hệ thống phản hồi ngay để thấy hậu quả của từng lựa chọn.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Năm 2014: giải Khuyến khích cấp quốc gia cuộc thi Bài giảng điện tử E-learning; ba bài giảng được đưa vào kho học liệu chung.</li><li>Sáng kiến dạy – học Toán trực tuyến được Tổng Liên đoàn Lao động Việt Nam trao Bằng khen.</li><li>Phần mềm kỹ năng sống cho lứa tuổi 6–15 được UBND TP. Cần Thơ đề cử vào Sách vàng Sáng tạo Việt Nam năm 2023.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Học sinh được thực hành cách xử lý tình huống nguy hiểm trên màn hình, thay vì chỉ đọc lý thuyết. Đồng nghiệp là nhóm hưởng lợi thứ hai: cô hướng dẫn thầy cô trong trường từng thao tác, tham gia tập huấn giáo viên nhiều địa phương qua lớp trực tuyến, chia sẻ cách dùng AI để soạn bài, theo dõi tiến bộ học sinh. Nguyên tắc cô giữ: “Mọi cái mới cuối cùng cũng phải phục vụ những giá trị ấy” – tình yêu thương, lòng nhân ái, sự trung thực và cái đẹp.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Năng lực số của một giáo viên không đến sau một khóa tập huấn. Ở Thốt Nốt, nó được bồi đắp qua từng chặng: một cuộc thi năm 2014, một mùa dịch, rồi một nỗi lo về an toàn của học trò.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://baochinhphu.vn/nha-giao-uu-tu-do-thi-ngoc-duyen-ngon-lua-chuyen-doi-so-tu-lop-hoc-o-thot-not-102251116133542989.htm" target="_blank" rel="noopener noreferrer">Báo Điện tử Chính phủ – 16/11/2025</a></li></ul></section>
                `
            },
            50: {
                category: "Người dân",
                title: "Khi trợ lý ảo hiểu được lời hỏi đời thường của người dân",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-rural-ai-procedure-assistant-2026.webp",
                imageAlt: "Người dân vùng cao dùng điện thoại hỏi trợ lý ảo về thủ tục hành chính",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều đáng nhớ nhất</h3><p>Ở xã Sơn Động (Bắc Ninh), người dân không cần biết tên thủ tục. Chỉ cần quét mã QR và hỏi như ngày thường: “Cần giấy tờ gì để làm căn cước?”. Trợ lý ảo do một cán bộ Công an xã tự xây dựng sẽ trả lời. Hàng nghìn câu hỏi lặp lại đã được giải đáp như thế.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước đó</h3><p>Sau khi hợp nhất thị trấn An Châu với các xã An Bá, Vĩnh An, xã Sơn Động có khoảng 24.394 dân, 14 dân tộc cùng sinh sống; đồng bào dân tộc thiểu số chiếm 50–60%. Địa hình đồi núi chia cắt, nhiều thôn, bản ở xa trung tâm. Phần lớn câu hỏi về cư trú, căn cước, định danh điện tử mang tính phổ biến và lặp lại. Muốn hỏi, người dân phải tự tìm đến cơ quan công an, tốn thời gian và tiền đi lại.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều gì đã thay đổi</h3><p>Trung úy La Đức Mạnh, Tổ An ninh Công an xã, xây dựng một trợ lý ảo trên nền ChatGPT, nạp vào đó cơ sở dữ liệu đã chuẩn hóa về cư trú, căn cước công dân, định danh điện tử và các quy định về an ninh trật tự. Ngày 10/4, “Trung úy Sơn Động AI” chính thức hoạt động.</p><p>Người dân quét mã QR niêm yết tại trụ sở Công an xã hoặc trên các kênh thông tin chính thức, rồi hỏi bằng lời thường, không cần thuật ngữ pháp lý. “Người dân không cần phải hỏi đúng tên thủ tục”, anh Mạnh nói. Trợ lý chỉ trả lời trong phạm vi dữ liệu đã được kiểm duyệt; với nội dung nghiệp vụ chuyên sâu, hệ thống hướng dẫn người dân liên hệ trực tiếp Công an xã.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết quả</h3><ul class="list-disc pl-5 space-y-2"><li>Sau hơn hai tháng hoạt động, hàng nghìn câu hỏi lặp đi lặp lại được trợ lý ảo tiếp nhận và giải đáp tự động.</li><li>Áp lực cho cán bộ trực ban giảm đáng kể; công an xã có thêm thời gian cho hồ sơ phức tạp và nghiệp vụ chuyên sâu.</li><li>Người dân ở thôn, bản xa không còn phải mất nhiều thời gian, chi phí đi lại chỉ để hỏi những thủ tục đơn giản.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá trị mang lại</h3><p>Người được lợi rõ nhất là bà con ở những thôn, bản xa trung tâm: một câu hỏi về giấy xác nhận cư trú không còn đồng nghĩa với một chuyến đi. Qua trợ lý ảo, người dân còn được hướng dẫn dùng VNeID và làm dịch vụ công trực tuyến. Với cán bộ, những câu hỏi giống nhau được chuyển cho máy. Anh Mạnh nói mình xây dựng “người đồng đội ảo” này để “hiểu được đúng nhu cầu và cách diễn đạt bình dị nhất của bà con”.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Rào cản với người dân vùng cao nhiều khi không nằm ở thủ tục, mà ở việc không biết gọi tên thủ tục. Một trợ lý hiểu được lời hỏi đời thường đã gỡ đúng chỗ vướng đó.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://suckhoedoisong.vn/gan-dan-tu-khong-gian-so-ky-cuoi-cong-an-xa-dua-ai-den-voi-nguoi-dan-169260604153207372.htm" target="_blank" rel="noopener noreferrer">Báo Sức khỏe &amp; Đời sống – 06/06/2026</a></li></ul></section>
                `
            },
            51: {
                category: "Người dân",
                title: "Chuyển đổi số cấp xã bắt đầu từ một vấn đề rất cụ thể",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-commune-online-queue-2026.webp",
                imageAlt: "Người dân lấy số trực tuyến trong khi công chức theo dõi hàng đợi tại trung tâm cấp xã",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Đáng Nhớ Nhất</h3><p>Anh Trần Viết Hồng không phải kỹ sư công nghệ. Anh là công chức phụ trách thi đua – khen thưởng kiêm công nghệ thông tin của xã Đan Hải (Hà Tĩnh). Sau hai tháng viết mã buổi tối trên máy tính cá nhân, anh làm ra hệ thống lấy số trực tuyến, thay hẳn phần mềm thuê ngoài.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước Đó</h3><p>Từ khi vận hành chính quyền địa phương hai cấp, Trung tâm Phục vụ hành chính công xã Đan Hải luôn đông người. Lấy được số thứ tự rồi, nhiều người vẫn phải chờ hàng giờ mới tới lượt. Thiệt nhất là người cao tuổi sức khỏe yếu và người làm nghề tự do vốn eo hẹp thời gian. Anh Nguyễn Tiến Thủy ở thôn Phú Cường kể có khi phải chờ tại Trung tâm “cả tiếng đồng hồ”. Xã cũng phải trả tiền bản quyền phần mềm, máy chủ và hỗ trợ kỹ thuật cho đối tác bên ngoài.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Gì Đã Thay Đổi</h3><p>Được lãnh đạo xã gợi ý, động viên, anh Hồng bắt tay làm. Không phòng nghiên cứu, không ngân sách hỗ trợ, anh dùng máy tính cá nhân; suốt 2 tháng, xong việc chuyên môn, tối đến anh lại ngồi viết mã. Có lúc vướng bài toán đồng bộ dữ liệu theo thời gian thực, anh tưởng muốn bỏ cuộc. Rồi anh lắng nghe góp ý của đồng nghiệp, phản hồi của bà con để hệ thống đơn giản nhất.</p><p>Từ ngày 20/7/2026, cách làm đổi hẳn. Trước đây, người dân phải đến Trung tâm lấy số rồi ngồi chờ. Nay, chỉ cần điện thoại có Internet, bà con lấy số từ nhà hoặc nơi làm việc, xem hệ thống đang phục vụ đến số mấy rồi căn giờ đến. Người chưa quen điện thoại thông minh vẫn có cây lấy số tại chỗ.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết Quả</h3><ul class="list-disc pl-5 space-y-2"><li>Hệ thống vận hành chính thức từ 20/7/2026, thay thế hoàn toàn phần mềm thuê ngoài.</li><li>Trong tổng số gần 1.800 lượt giao dịch tại Trung tâm, đã có hàng trăm người dân chủ động lấy số từ xa.</li><li>Theo Phó Chủ tịch UBND xã Phạm Xuân Lương, xã tiết kiệm khoảng 50 triệu đồng mỗi năm tiền thuê bản quyền phần mềm, phí máy chủ và hỗ trợ kỹ thuật.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá Trị Mang Lại</h3><p>Với anh Thủy, người vì đặc thù công việc “ít khi được rời vị trí”, thay đổi rất cụ thể: “Nếu như trước đây có khi phải chờ tại Trung tâm cả tiếng đồng hồ thì giờ đây, khoảng thời gian đó tôi vẫn có thể giải quyết được các việc khác”. Người chưa dùng điện thoại thông minh không bị bỏ lại. Còn xã thì làm chủ được công cụ của mình: theo ông Lương, mọi sự cố phát sinh đều được anh Hồng xử lý ngay tại chỗ.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Người hiểu rõ nhất nỗi khổ xếp hàng ở xã là người ngồi sau quầy. Khi chính người ấy tự làm được công cụ, xã vừa bớt giờ chờ cho dân, vừa bớt một khoản thuê ngoài mỗi năm.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://baohatinh.vn/cong-chuc-viet-phan-mem-giup-nguoi-dan-lay-so-thu-tu-tu-xa-post315223.html" target="_blank" rel="noopener noreferrer">Báo Hà Tĩnh – 08/08/2026</a></li></ul></section>
                `
            },
            52: {
                category: "Người dân",
                title: "Số hóa chùa Keo và cả ký ức của làng Hành Thiện",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-keo-pagoda-digital-heritage-2026.webp",
                imageAlt: "Nhóm nghiên cứu quét 3D chùa cổ và ghi lại lời kể của bậc cao niên",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Đáng Nhớ Nhất</h3><p>Ở làng Hành Thiện (nay là thôn 9, xã Xuân Hồng, Ninh Bình), dự án số hóa không dừng ở chùa Keo, Di tích quốc gia đặc biệt. Ê kíp còn khảo cứu tư liệu Hán Nôm cất giữ trong các dòng họ, gia đình, và ghi hình các bậc cao niên kể lại tri thức dân gian của làng.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước Đó</h3><p>Chùa Keo Hành Thiện được xếp hạng Di tích quốc gia đặc biệt năm 2016; lễ hội chùa vào Danh mục Di sản văn hóa phi vật thể quốc gia năm 2019. Quanh chùa là cả một làng cổ: chùa Đĩnh Lan, miếu Tam Giáp, Nhà lưu niệm cố Tổng Bí thư Trường Chinh, những ngôi nhà cổ, con ngõ lát gạch đỏ. Nhưng nhiều tư liệu cổ, nhất là tư liệu Hán Nôm, nằm rải rác ở các di tích, dòng họ, gia đình. Tri thức dân gian và ký ức cộng đồng gắn với lớp người cao tuổi.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Gì Đã Thay Đổi</h3><p>Từ năm 2023, dự án do kiến trúc sư Đỗ Vũ Lợi chủ trì bắt đầu từ việc nghiên cứu tư liệu lịch sử, đặc biệt là Hán Nôm, và khảo sát thực địa để nhận diện giá trị kiến trúc, mỹ thuật của di tích. Từ đó, dự án dựng mô hình 3D, bản đồ số và dữ liệu chuẩn hóa. Không gian di tích được số hóa bằng thực tế ảo VR360; bản đồ số gắn mã QR và NFC để tra cứu.</p><p>Rồi phạm vi mở rộng ra cả làng. Tư liệu Hán Nôm ở các dòng họ, gia đình được khảo cứu, số hóa; các bậc cao niên được ghi hình, phỏng vấn. Tất cả được đưa lên website “Làng Hành Thiện”, để người dân và du khách có thể tìm hiểu, trải nghiệm làng từ xa.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết Quả</h3><ul class="list-disc pl-5 space-y-2"><li>Website “Làng Hành Thiện” cho phép tra cứu về chùa Keo, chùa Đĩnh Lan, miếu Tam Giáp, Nhà lưu niệm cố Tổng Bí thư Trường Chinh và nhiều công trình khác trong làng.</li><li>Di tích đã có mô hình 3D, bản đồ số tích hợp mã QR, NFC và không gian thực tế ảo VR360; khối tư liệu Hán Nôm đang được số hóa, biên dịch để từng bước công bố.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá Trị Mang Lại</h3><p>Theo ông Đặng Ngọc Kỳ, Phó trưởng Ban Quản lý Di tích chùa Keo Hành Thiện, nhờ dữ liệu trực tuyến, bản đồ số và VR360, “người dân, nhất là những người con xa quê, du khách có thể tìm hiểu không gian di tích một cách thuận tiện”. Những điều các cụ cao niên kể lại được ghi hình, lưu giữ. Vào cuối tuần và ngày lễ, nhiều người chọn tham quan các điểm di tích trong thôn; địa phương có thêm điều kiện phát triển du lịch trải nghiệm nông thôn.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Một ngôi chùa chỉ được hiểu trọn khi đặt trong ngôi làng đã sinh ra nó. Số hóa ở Hành Thiện có giá trị vì ghi lại cả những thứ nằm ngoài hàng rào di tích: tư liệu của các dòng họ và lời kể của người lớn tuổi.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://bnews.vn/so-hoa-di-san-lang-que-gan-voi-phat-trien-du-lich/428260.html" target="_blank" rel="noopener noreferrer">Bnews – Thông tấn xã Việt Nam – 10/07/2026</a></li></ul></section>
                `
            },
            53: {
                category: "Người dân",
                title: "Khi người trẻ vùng cao tự kể văn hóa của bản mình trên mạng",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-highland-youth-culture-online-2026.webp",
                imageAlt: "Người trẻ vùng cao tự quay video giới thiệu âm nhạc, ẩm thực và homestay",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Đáng Nhớ Nhất</h3><p>Một đoạn video ngắn: anh Sùng Mạnh Hùng, thanh niên người Mông, mặc trang phục truyền thống, cùng du khách nước ngoài múa những động tác cắt cỏ, đập lúa, sàng mèn mén. Video thu hút 7,5 triệu lượt xem trên TikTok. Ở vùng cao Tuyên Quang, người trẻ đang tự kể chuyện văn hóa của bản mình.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước Đó</h3><p>Những câu chuyện dân gian, lễ hội truyền thống, tri thức bản địa phần lớn chỉ hiện hữu trong ký ức của bản làng. Người ngoài muốn biết thường chỉ có những bài thuyết minh khô cứng. Năm 2018, khi mấy chàng trai Tày ở xã Thượng Lâm nảy ra ý tưởng làm homestay theo phong cách người trẻ, những ngày đầu đón khách là quãng thời gian gian nan, nhiều âu lo.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Gì Đã Thay Đổi</h3><p>Người trẻ tự cầm điện thoại kể chuyện. Anh Hùng vừa múa vừa kể về văn hóa Mông trên TikTok, YouTube, Facebook, không cầu kỳ dàn dựng. Anh Nguyễn Thiện Ngay, cán bộ Trung tâm dịch vụ công xã Phố Bảng, đưa Lễ hội hoa Lê, Lễ ra đồng, lễ cúng Thần rừng của người Pu Péo lên TikTok. Anh Sùng Minh Thành ở xã Pà Vầy Sủ lập câu lạc bộ nhạc cụ dân tộc Mông và trang Facebook riêng cho câu lạc bộ.</p><p>Với nhóm “Tài Ngào miền cổ tích Thượng Lâm”, thay đổi đi thẳng vào sinh kế. Nhờ bạn bè giới thiệu và chiếc điện thoại thông minh, các anh tự tìm hiểu trên mạng cách làm du lịch, lập fanpage “Homestay Tài Ngào”, đăng ảnh hồ, điểm tham quan và món đặc sản quê nhà.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết Quả</h3><ul class="list-disc pl-5 space-y-2"><li>Homestay Tài Ngào: trung bình mỗi tháng đón khoảng 250–300 lượt khách.</li><li>Tài khoản TikTok của anh Sùng Mạnh Hùng: 9,7 triệu lượt thích, gần 500 nghìn người theo dõi.</li><li>Câu lạc bộ nhạc cụ Mông của anh Sùng Minh Thành: hơn 100 thành viên, đã giao lưu văn hóa ở Hà Nội, Thái Nguyên, Lào Cai và tỉnh Vân Nam (Trung Quốc).</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá Trị Mang Lại</h3><p>Với nhóm thanh niên Tày ở Thượng Lâm, cảnh sắc và món ăn quê nhà thành nguồn khách đều đặn cho homestay. Với hơn 100 thành viên câu lạc bộ, tiếng khèn Mông có dịp vang ở nhiều nơi trong và ngoài nước. Anh Thành nói mỗi video, mỗi hình ảnh chia sẻ “không đơn thuần là nội dung trên không gian mạng, mà còn là cách để kể câu chuyện về quê hương, con người và bản sắc dân tộc đến với cộng đồng rộng lớn hơn”.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Người giữ văn hóa bản hiệu quả nhiều khi chính là người trẻ trong bản. Khi họ tự quay, tự đăng, văn hóa có thêm người xem; và như ở homestay Tài Ngào, có thêm khách tìm đến ở.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://baotuyenquang.com.vn/multimedia/emagazine/202605/bai-2-su-gia-van-hoa-thoi-cong-nghe-8526d3a/" target="_blank" rel="noopener noreferrer">Báo Tuyên Quang – 28/05/2026</a></li></ul></section>
                `
            },
            54: {
                category: "Người dân",
                title: "Khi người Suối Giàng xây kênh triệu view, chè quê đi xa hơn",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-suoigiang-tea-creator-2026.webp",
                imageAlt: "Cô gái Mông quay video về chè Shan tuyết và nghề làm chè ở Suối Giàng",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Đáng Nhớ Nhất</h3><p>Cuối năm 2023, chị Sổng Thị Mai, cô gái Mông sinh năm 1998 ở Suối Giàng (Lào Cai), bắt đầu làm kênh chỉ để “lưu lại những khoảnh khắc trong cuộc sống hằng ngày”. Nay kênh có gần 1 triệu người theo dõi, xoay quanh cây chè Shan tuyết và nghề làm chè của người Mông.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước Đó</h3><p>Suối Giàng có đồi chè cổ thụ, mây núi, những phiên chợ truyền thống và nghề làm chè của người Mông. Nhưng những người trẻ muốn kể chuyện quê chưa qua đào tạo quay phim, dựng hình. Anh Trang A Vũ, thôn Bản Mới, kể lúc mới làm, vì thiếu kinh nghiệm và kỹ thuật, một video dài khoảng 1,5–2 phút thường mất hơn một ngày mới xong. Duy trì kênh cũng không dễ: đi lại, thời tiết, công việc gia đình đều ảnh hưởng tới việc quay, dựng.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Gì Đã Thay Đổi</h3><p>Những người trẻ ở xã Văn Chấn tự học và tự làm kênh. Chị Mai quay cây chè, nghề làm chè truyền thống và nếp sinh hoạt của đồng bào Mông. Anh Vũ, bắt đầu từ tháng 7/2025, giới thiệu cảnh quan và văn hóa vùng Suối Giàng. Anh Giàng A Cánh ở thôn Pang Cáng tự đầu tư máy quay, flycam và tự học dựng video qua Internet.</p><p>Khi tay nghề khá lên, họ chú trọng hơn đến nội dung: đời sống sinh hoạt, ẩm thực, phong tục, cảnh quan vùng cao. Theo bài báo, chính sự chân thực, gần gũi khiến những thước phim do người bản địa tự quay thu hút người xem.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết Quả</h3><ul class="list-disc pl-5 space-y-2"><li>Kênh của chị Sổng Thị Mai: gần 1 triệu người theo dõi.</li><li>Một số video của anh Giàng A Cánh đạt hàng trăm nghìn, thậm chí hàng triệu lượt xem.</li><li>Theo chị Mai, có những video giúp nhiều người biết đến chè Shan tuyết Suối Giàng hơn; có khách hàng tìm mua sản phẩm hoặc muốn đến tận nơi trải nghiệm.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá Trị Mang Lại</h3><p>Người làm chè Suối Giàng có thêm một cách để sản phẩm được biết đến: qua chính người trong bản kể. Với người trẻ, làm kênh là kỹ năng tự học được, từ chỗ mất hơn một ngày cho một video đến những clip hàng triệu lượt xem. Bà Nguyễn Thị Hà, Phó Chủ tịch UBND xã Văn Chấn, cho biết xã sẽ tiếp tục “tạo điều kiện để lực lượng thanh niên phát huy vai trò trong chuyển đổi số, đặc biệt là trong lĩnh vực quảng bá du lịch và sản phẩm nông nghiệp đặc trưng”.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Ở Suối Giàng, người kể chuyện chè Shan tuyết không phải một chiến dịch quảng bá, mà là cô gái Mông lớn lên giữa đồi chè. Khi người trong cuộc tự kể, sản phẩm ở bản xa có thêm người biết, thêm người tìm mua.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://baolaocai.vn/ke-chuyen-que-huong-tren-khong-gian-so-post899220.html" target="_blank" rel="noopener noreferrer">Báo Lào Cai – 09/05/2026</a></li></ul></section>
                `
            },
            55: {
                category: "Người dân",
                title: "“Người gác đồi” của hai nữ sinh lớp 6, lớp 7",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-student-landslide-edge-ai-2026.webp",
                imageAlt: "Hai nữ sinh thử nghiệm cảm biến và AI cảnh báo sạt lở trên mô hình đồi",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Đáng Nhớ Nhất</h3><p>Hai nữ sinh một trường THCS ở Gia Lai tự hỏi: làm sao có một “người gác đồi” hoạt động liên tục, kể cả trong đêm tối, để người dân kịp sơ tán khi có nguy cơ sạt lở? Câu trả lời là một thiết bị biết phân biệt rung do xe chạy với dấu hiệu sạt lở.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước Đó</h3><p>Nguy cơ sạt lở có thể đe dọa chính gia đình các em và người dân trong khu vực. Cảnh báo sớm cần một thứ canh chừng liên tục, phát hiện dấu hiệu bất thường để người dân kịp sơ tán. Nhưng nếu chỉ dùng các ngưỡng cảm biến đơn giản, thiết bị dễ báo động giả vì những rung động thông thường trong khu dân cư, như xe cộ chạy qua.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Gì Đã Thay Đổi</h3><p>Nguyễn Lê Diễm My (lớp 7A1) và Hồ Lê Bảo Châu (lớp 6A2), Trường THCS Nhơn Tân (xã An Nhơn Tây), không dừng ở ngưỡng cảm biến. Các em thử đưa một mô hình trí tuệ nhân tạo chạy ngay trên thiết bị (Edge AI), huấn luyện qua nền tảng Edge Impulse để phân loại ba trạng thái: bình thường, rung do xe chạy, và dấu hiệu sạt lở.</p><p>Tiếp đó là cơ chế “khóa kép”: hệ thống kết hợp độ ẩm đất, góc nghiêng và xác suất nhận diện sạt lở của AI, để hạn chế báo động giả do những rung động thông thường. Khi xác suất sạt lở vượt 75%, hệ thống kích hoạt cảnh báo và truyền tín hiệu trực tiếp tới điện thoại của người dân và chính quyền địa phương.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết Quả</h3><ul class="list-disc pl-5 space-y-2"><li>Theo nhóm tác giả, tín hiệu cảnh báo tới điện thoại người dân và chính quyền chỉ sau khoảng 0,5 giây.</li><li>Đề tài là một trong 3 giải nhất (trên 150 đề tài dự thi) của Cuộc thi sáng tạo thanh thiếu niên, nhi đồng tỉnh Gia Lai lần thứ I – năm 2026.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá Trị Mang Lại</h3><p>Các em bắt đầu từ nỗi lo sạt lở ở chính nơi mình sinh sống. Nếu tiếp tục được hoàn thiện, giải pháp chi phí thấp này có thể giúp người dân và chính quyền có thêm thời gian phản ứng trước thiên tai. Với học sinh, cuộc thi là nơi được đặt câu hỏi, thử nghiệm, và theo Phó Chủ tịch UBND tỉnh Lâm Hải Giang, được chấp nhận cả những lần chưa thành công để tiếp tục hoàn thiện ý tưởng.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Với cảnh báo thiên tai, cái khó không chỉ là phát hiện nguy cơ, mà là không báo nhầm. Hai nữ sinh lớp 6, lớp 7 đã chọn đúng bài toán ấy: dạy máy biết đâu là rung của xe, đâu là rung của đất.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://danviet.vn/khong-ngo-hai-nu-sinh-lop-6-lop-7-o-gia-lai-lai-nghi-ra-cong-nghe-canh-bao-sat-lo-dat-chi-sau-05-giay-d1454410.html" target="_blank" rel="noopener noreferrer">Báo Dân Việt – 26/08/2026</a></li></ul></section>
                `
            },
            56: {
                category: "Người dân",
                title: "Chuyển đổi số ở Na Chiềng: bắt đầu từ một tin nhắn",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-highland-village-digital-message-2026.webp",
                imageAlt: "Trưởng bản trẻ dùng điện thoại trao đổi thông tin với người dân vùng cao",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Đáng Nhớ Nhất</h3><p>Chiều muộn, cuộc họp dân ở bản Na Chiềng (xã Thiên Phủ, Thanh Hóa) vừa xong, điện thoại của trưởng bản Hà Văn Đốc liên tục sáng lên: hộ hỏi thủ tục, người hỏi lịch làm việc của cán bộ xã, thanh niên hỏi việc làm. Anh từng làm ở Bắc Ninh, thu nhập khoảng 14–15 triệu đồng/tháng.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước Đó</h3><p>Trưởng bản vừa truyền đạt chủ trương, vừa trả lời đủ loại câu hỏi. Ở các cuộc họp, người dân đặt nhiều câu hỏi ngoài những gì trưởng bản chuẩn bị; họp xong, anh Đốc phải đến từng hộ để giải thích. Nhà anh cách bản hơn 6 km. Ở bản Tây Tiến, xã Mường Lý, anh Mua A Sử thấy một khó khăn khác: bản ở xa, điều kiện khó khăn, nếu nông sản không bán được đi nơi khác thì quanh năm bà con chỉ sản xuất tự cung, tự cấp.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Gì Đã Thay Đổi</h3><p>Đốc tốt nghiệp Học viện Hành chính và Quản trị công năm 2018. Năm 2024, anh về quê làm hợp đồng ở cơ sở với thu nhập gần 5 triệu đồng/tháng, rồi được dân bầu làm trưởng bản. Không muốn chỉ tiếp nhận và truyền đạt chủ trương, anh lập các nhóm Zalo để trao đổi công việc với ban quản lý bản, thông báo và tuyên truyền tới người dân. Loa phát thanh vẫn được giữ cho những hộ chưa quen công nghệ.</p><p>Anh Sử có bằng cử nhân Công nghệ thông tin, từng đi làm với lương gần 15 triệu đồng/tháng. Làm trưởng bản Tây Tiến, anh tìm hiểu mô hình sản xuất mới và thường xuyên hướng dẫn bà con bán nông sản địa phương theo hình thức trực tuyến.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết Quả</h3><ul class="list-disc pl-5 space-y-2"><li>Theo anh Đốc, nhờ các nhóm Zalo, thông tin trong bản “được truyền đi nhanh hơn”.</li><li>Xã Thiên Phủ từ 13 bản sắp xếp còn 6 bản; theo Chủ tịch UBND xã Phan Văn Đại, cán bộ ở cả 6 bản đều có trình độ đại học hoặc cao đẳng.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá Trị Mang Lại</h3><p>Với người dân Na Chiềng, hỏi thủ tục hay lịch làm việc của xã giờ có thể bắt đầu bằng một tin nhắn cho trưởng bản. Công nghệ cũng đặt ra việc mới: một số thành viên ban quản lý lớn tuổi chưa quen máy tính, nên anh Đốc và đồng chí Bí thư phải làm hết phần việc ấy. Ông Bùi Minh Huệ, 71 tuổi, người bản Na Chiềng, nói: “Dân nhìn vào cách làm. Có việc thì có đứng ra không, có công bằng không, nói có đi đôi với làm không.”</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Ở bản vùng cao, chuyển đổi số có khi bắt đầu từ một nhóm Zalo và một trưởng bản trẻ biết dùng nó. Nhưng như người Na Chiềng nói, lòng tin vẫn đến từ cách làm, không phải từ bằng cấp hay công cụ.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://vietnamnet.vn/bai-1-cu-nhan-9x-bo-viec-luong-15-trieu-ve-que-lam-truong-ban-2550041.html" target="_blank" rel="noopener noreferrer">VietNamNet – 14/09/2026</a></li></ul></section>
                `
            },
            57: {
                category: "Người dân",
                title: "Người Việt tự dạy máy đọc di sản bằng công cụ của chính mình",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-hannom-ai-reader-2026.webp",
                imageAlt: "Nhà nghiên cứu dùng điện thoại và máy tính bảng nhận dạng tư liệu Hán Nôm",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Đáng Nhớ Nhất</h3><p>Chữ Nôm được người Việt dùng suốt hơn một thiên niên kỷ, nhưng hơn 90% tư liệu Hán Nôm vẫn chưa được dịch sang chữ Quốc ngữ. Theo PGS.TS Đinh Điền, ChatGPT, Gemini hay DeepSeek chưa thể hiểu được chữ Nôm. Một nhóm nhà khoa học ở TP.HCM đã tự làm lấy công cụ đọc thứ chữ ấy.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước Đó</h3><p>Hàng triệu trang sắc phong, châu bản, gia phả, địa bạ, văn bia, hoành phi, câu đối vẫn chủ yếu nằm dưới dạng ảnh hoặc bản số hóa. Muốn biết trong đó viết gì, phải nhờ người đọc được Hán Nôm, mà số người như vậy ngày càng ít. AI phổ biến trên thế giới chỉ xử lý được chữ Hán hiện đại. Theo PGS.TS Đinh Điền, nếu không sớm dùng công nghệ để nhận dạng và chuyển đổi, nhiều tư liệu quý sẽ bị mai một bởi thời gian.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Gì Đã Thay Đổi</h3><p>PGS.TS Đinh Điền, Giám đốc Trung tâm Ngôn ngữ học Tính toán, Trường ĐH Khoa học tự nhiên (ĐH Quốc gia TP.HCM), cùng cộng sự đi từng bước. Giai đoạn 1, hệ thống chỉ xử lý được văn bản đã ở dạng chữ. Giai đoạn 2 nhận dạng được chữ trên ảnh, vốn là dạng của gần như toàn bộ tư liệu Hán Nôm hiện nay.</p><p>Sản phẩm là hệ sinh thái Kim Hán Nôm chạy trên web, Android và iOS. Trước đây, muốn đọc một bức hoành phi phải tìm người biết chữ. Nay người dân dùng điện thoại chụp hoành phi, câu đối, sắc phong, gia phả; với ảnh ở đền chùa, di tích, chữ Quốc ngữ hiện ngay trên nền ảnh gốc.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết Quả</h3><ul class="list-disc pl-5 space-y-2"><li>Độ chính xác chuyển tự: trên 99% với văn bản dạng chữ thuộc các lĩnh vực phổ biến như văn học, lịch sử, địa lý.</li><li>Kho dữ liệu Hán Nôm lớn nhất từ trước đến nay tại Việt Nam: 200.000 ảnh trang văn bản, 750.000 cặp câu song ngữ, hơn 1 triệu câu đơn ngữ.</li><li>Đề tài giai đoạn 2 được nghiệm thu, đánh giá hoàn thành loại xuất sắc.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá Trị Mang Lại</h3><p>Một gia đình còn giữ cuốn gia phả hay tờ sắc phong cũ nay có thể tự chụp ảnh và đọc phần chuyển tự, không phải chờ chuyên gia. Cơ quan, doanh nghiệp, cá nhân có thể tích hợp các tính năng này qua giao diện kết nối (API). Với văn bia quá mờ, chữ viết tay hay kiểu chữ đặc biệt, kết quả vẫn cần chuyên gia Hán Nôm hiệu đính.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Có những khoảng trống công nghệ mà người Việt phải chủ động và tự xử lý bài toán của riêng mình.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://tuoitre.vn/ai-mo-canh-cua-tiep-can-di-san-han-nom-sau-hon-1000-nam-100260726164556536.htm" target="_blank" rel="noopener noreferrer">Tuổi Trẻ Online – 26/07/2026</a></li></ul></section>
                `
            },
            58: {
                category: "Người dân",
                title: "Tự chủ AI bắt đầu từ khâu gán nhãn dữ liệu",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-ai-data-labeling-grid-2026.webp",
                imageAlt: "Kỹ sư điện gán nhãn ảnh nhiệt để huấn luyện AI phát hiện nguy cơ trên lưới",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Đáng Nhớ Nhất</h3><p>Muốn AI nhận ra nguy cơ trên lưới điện, trước hết phải có thật nhiều ảnh đã gán nhãn. Kỹ sư Lê Công Hiếu ở Điện lực Quảng Trị cùng cộng sự tự viết công cụ gán nhãn thay cho phần mềm nước ngoài, tiết kiệm khoảng 20.000 USD mỗi tài khoản mỗi năm.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước Đó</h3><p>Kiểm tra lưới điện là việc thường xuyên của ngành điện. Trước đây, công việc này chủ yếu làm thủ công, tốn nhiều nhân lực và thời gian. Ảnh nhiệt chụp từ thiết bị bay cũng được phân tích bằng tay. Muốn giao việc đọc ảnh cho máy, đơn vị cần một lượng lớn dữ liệu đã gán nhãn để huấn luyện mô hình, trong khi dùng phần mềm gán nhãn nước ngoài tốn khoảng 20.000 USD cho mỗi tài khoản mỗi năm.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Gì Đã Thay Đổi</h3><p>Anh Hiếu, sinh năm 1982, thạc sĩ Công nghệ thông tin, Phó trưởng phòng Viễn thông và Công nghệ thông tin, đã gần 20 năm gắn bó với PC Quảng Trị. Anh bắt đầu từ phần nền: một nền tảng phát triển ứng dụng web chạy được cùng lúc trên web, điện thoại và máy tính để bàn.</p><p>Anh và cộng sự tự viết công cụ gán nhãn dữ liệu phục vụ huấn luyện AI. Việc kiểm tra lưới điện cũng đổi cách làm: ảnh chụp từ thiết bị bay được phân tích tự động để phát hiện nguy cơ mất an toàn, thay cho soi ảnh thủ công. Giải pháp này đoạt giải nhì Hội thi sáng tạo khoa học kỹ thuật toàn quốc lần thứ 17 năm 2023.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết Quả</h3><ul class="list-disc pl-5 space-y-2"><li>Công cụ gán nhãn tự viết đã xử lý hơn 156.000 hình ảnh với trên 302.000 nhãn đối tượng.</li><li>Phân tích ảnh nhiệt tự động từ dữ liệu flycam: giảm 50–60% thời gian xử lý dữ liệu bay và hơn 90% thời gian phân tích ảnh nhiệt so với làm thủ công.</li><li>Nền tảng ứng dụng web: giảm khoảng 30–40% chi phí phát triển phần mềm (ước tính).</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá Trị Mang Lại</h3><p>Với những người kiểm tra lưới điện, phần việc phân tích ảnh vốn tốn nhiều nhân lực, thời gian nay được máy làm trước, giúp giảm chi phí kiểm tra hiện trường. Đơn vị chủ động hơn trong nghiên cứu, phát triển công nghệ. Theo ông Phan Văn Vĩnh, Phó Giám đốc PC Quảng Trị, các sáng kiến của anh Hiếu đã mang lại giá trị kinh tế hàng tỉ đồng và giúp tiết kiệm đáng kể nguồn nhân lực.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Trí tuệ nhân tạo cần dữ liệu, và dữ liệu cần được gán nhãn. Khi công cụ cho khâu ấy phải trả phí bằng ngoại tệ theo từng tài khoản, một kỹ sư tự viết lấy đã giúp đơn vị làm chủ phần nền móng nhất của bài toán AI.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://nld.com.vn/ky-su-dien-luc-quang-tri-voi-nhieu-sang-kien-ai-giup-tiet-kiem-hang-ti-dong-196260403093747678.htm" target="_blank" rel="noopener noreferrer">Báo Người Lao Động – 03/04/2026</a></li></ul></section>
                `
            },
            59: {
                category: "Người dân",
                title: "Không còn phải xuống kho tìm bản vẽ giấy",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-water-network-gis-2026.webp",
                imageAlt: "Kỹ sư cấp nước cùng dùng bản đồ GIS để tra cứu đường ống và đồng hồ",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Đáng Nhớ Nhất</h3><p>Ở Công ty CP Cấp nước Trung An (TP.HCM), mỗi tuyến ống từng nằm trong một file AutoCAD hay bản vẽ giấy dưới kho. Chị Nguyễn Thị Kim Yến đưa mạng lưới ống, đồng hồ khách hàng lên bản đồ số. 11 sáng kiến của chị trong 5 năm làm lợi cho đơn vị hơn 4,5 tỷ đồng mỗi năm.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước Đó</h3><p>Trung An phục vụ khoảng 240.000 khách hàng. Trước đây, mỗi tuyến ống cấp nước được cập nhật trên phần mềm AutoCAD; phòng ban nào muốn xem dữ liệu thì phòng kỹ thuật phải chép file, chuyển file. Muốn tra hồ sơ cũ, các bộ phận phải xuống kho tìm bản vẽ giấy, dễ thất lạc, hư hỏng theo thời gian. Ngay việc thu tiền nước cũng có lúc rối: con cái đã đóng tiền, người lớn ở nhà không biết lại đóng lần nữa.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Gì Đã Thay Đổi</h3><p>Chị Yến, Phó Trưởng phòng Kỹ thuật, có chuyên môn quản lý tài nguyên và môi trường. Trên nền hệ thống thông tin địa lý (GIS) mà Sawaco cung cấp chung cho các đơn vị, chị đưa GIS vào quản lý, vận hành mạng lưới cấp nước, quản lý đồng hồ khách hàng và giám sát dữ liệu.</p><p>Thay vì mỗi tuyến ống là một file riêng, nay thông tin đường ống, đồng hồ khách hàng nằm trên cơ sở dữ liệu chung; các phòng ban, đội được cấp quyền xem. “Tất cả tài sản của chúng tôi đều được cập nhật lên hệ thống GIS”, chị Yến cho biết. Chị tiếp tục dùng WebGIS, dashboard và giải pháp tự động hóa cho việc giám sát thất thoát nước, phân tích sản lượng.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết Quả</h3><ul class="list-disc pl-5 space-y-2"><li>11 sáng kiến trong 5 năm, làm lợi cho đơn vị hơn 4,5 tỷ đồng mỗi năm.</li><li>Toàn bộ tài sản mạng lưới được cập nhật lên hệ thống GIS, dùng chung cho các phòng ban.</li><li>Chị được trao Giải thưởng Tôn Đức Thắng lần thứ 26 – năm 2026.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá Trị Mang Lại</h3><p>Với khách hàng, thay đổi hiện ra ở chuyện nhỏ: nhân viên thu tiền biết chính xác nhà nào đã đóng, nhà nào chưa, tránh cảnh một hóa đơn trả hai lần. Các phòng ban tự tra cứu dữ liệu mạng lưới thay vì chờ chép file. Với thợ trẻ trong đơn vị, chị Yến là người tận tình kèm cặp, tạo động lực để họ nâng cao tay nghề.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Hệ thống GIS là nền chung, nhưng biến nó thành công cụ cho từng việc cụ thể, từ tra một tuyến ống đến thu đúng một hóa đơn, cần một người trong nghề kiên trì suốt nhiều năm.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://www.sggp.org.vn/giai-thuong-ton-duc-thang-lan-thu-26-nam-2026-vinh-danh-11-ky-su-co-nhieu-sang-kien-post867899.html" target="_blank" rel="noopener noreferrer">Báo Sài Gòn Giải Phóng – 20/08/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://tuoitre.vn/cap-nuoc-trung-an-ung-dung-gis-nang-cao-chat-luong-phuc-vu-20240808081454593.htm" target="_blank" rel="noopener noreferrer">Tuổi Trẻ Online – 08/08/2024</a></li></ul></section>
                `
            },
            60: {
                category: "Người dân",
                title: "Một mã QR – điểm tựa lòng tin cho du khách quốc tế đến với Khánh Hòa",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-khanhhoa-tourist-qr-assistance-2026.webp",
                imageAlt: "Du khách quốc tế quét mã QR để nhận hỗ trợ đa ngôn ngữ tại Khánh Hòa",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Đáng Nhớ Nhất</h3><p>Ở Khánh Hòa, du khách quốc tế gặp sự cố như mất tài sản, mất hộ chiếu hay tai nạn không cần cài thêm ứng dụng nào. Chỉ cần quét mã QR để mở hệ thống trên trình duyệt, bằng 5 ngôn ngữ, và gửi đề nghị hỗ trợ. Người làm ra nó là bốn cán bộ Công an tỉnh.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước Đó</h3><p>Tám tháng đầu năm 2026, Khánh Hòa đón hơn 18 triệu lượt khách, tăng gần 40% so với năm 2025; trong đó khoảng 6,3 triệu lượt khách quốc tế, tăng gần 70%. Lượng khách lớn đi kèm những nguy cơ mà cơ quan công an chỉ ra: lộ, mất, chiếm đoạt dữ liệu cá nhân, gian lận thương mại, tội phạm xuyên quốc gia. Một người khách gặp sự cố ở xứ lạ cần biết thông tin pháp luật ở đâu và trình báo với ai, bằng ngôn ngữ mình hiểu.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Gì Đã Thay Đổi</h3><p>Nhóm tác giả gồm Thượng tá Huỳnh Đức Trung, Phó trưởng Phòng An ninh mạng và phòng chống tội phạm sử dụng công nghệ cao; Đại úy Nguyễn Đức Duy, Phòng Tham mưu; Đại úy Đinh Hồ Trâm Anh và Đại úy Phạm Trung Kiên, Phòng Quản lý xuất nhập cảnh. Họ xây dựng hệ thống Khanh Hoa Travel Assistance, công bố ngày 02/9/2026 tại sân bay Cam Ranh.</p><p>Du khách chỉ quét mã QR tại sân bay, khách sạn hay điểm tham quan; giao diện tự chuyển giữa tiếng Việt, Anh, Trung, Hàn, Nga. Trợ lý AI trả lời câu hỏi, nhưng chỉ được diễn giải dựa trên kho dữ liệu pháp luật đã kiểm duyệt. Khi có sự cố, hệ thống thu thập thông tin, hình ảnh, định vị GPS và tự chuyển hồ sơ đến đơn vị công an gần nhất.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết Quả</h3><ul class="list-disc pl-5 space-y-2"><li>Sau hơn một tuần công bố: 2.879 lượt đăng nhập; tiếp nhận, xử lý hơn 10 đề nghị hỗ trợ từ du khách quốc tế.</li><li>Ngày 15/9/2026, đại diện hơn 300 doanh nghiệp lữ hành, cơ sở lưu trú được tập huấn để cùng triển khai hệ thống.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá Trị Mang Lại</h3><p>Với du khách, khoảng cách tới cơ quan công an rút lại còn một lần quét mã: không phải cài thêm ứng dụng, không phải tự dò số điện thoại, không phải diễn đạt bằng tiếng Việt. Vị trí GPS đi kèm giúp hồ sơ đến thẳng đơn vị công an gần nhất. Khách sạn, doanh nghiệp lữ hành có thêm một công cụ để hướng dẫn khách của mình.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Với một người khách đang gặp sự cố ở xứ lạ, mỗi bước cài đặt là thêm một rào cản. Bỏ được bước ấy, dịch vụ công đến với người cần nó nhanh hơn, dù người đó chỉ ở lại vài ngày.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://cand.vn/trien-khai-phan-mem-ho-tro-du-khach-quoc-te-do-cong-an-khanh-hoa-xay-dung-post822119.html" target="_blank" rel="noopener noreferrer">Báo Công an nhân dân – 15/09/2026</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://kenh14.vn/cong-an-tinh-ra-mat-he-thong-ho-tro-phap-ly-va-an-toan-cho-khach-du-lich-quoc-te-215260904131540633.chn" target="_blank" rel="noopener noreferrer">Kênh 14 (theo Báo Khánh Hòa điện tử) – 04/09/2026</a></li></ul></section>
                `
            },
            61: {
                category: "Người dân",
                title: "Đánh giá 117 giáo viên: giảm từ 2–3 tuần còn 2–3 ngày",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-school-workflow-evaluation-2026.webp",
                imageAlt: "Giáo viên vận hành hệ thống đánh giá và xử lý hồ sơ trực tuyến trong trường học",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Đáng Nhớ Nhất</h3><p>Ở Trường THPT Thủ Đức (TP.HCM), mỗi đợt đánh giá quý cho 117 giáo viên có khi kéo dài 2–3 tuần. Nay việc đó xong trong 2–3 ngày. Phần mềm làm nên thay đổi do chính thầy Nguyễn Hải Đăng, Tổ trưởng Tổ Tin học, viết sau nhiều đêm mày mò.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước Đó</h3><p>Mỗi đợt đánh giá quý, giáo viên phải điền hàng chục tiêu chí. Tổ trưởng chuyên môn tổng hợp bằng tay, rồi ban giám hiệu rà soát, ký duyệt. Phụ huynh, học sinh muốn rút học bạ hay xin xác nhận giấy tờ phải đến trường nhiều lần để nộp hồ sơ, bổ sung, chờ phản hồi rồi quay lại nhận kết quả; có khi mất hàng tuần. Đăng ký học, đánh giá giáo viên làm thủ công hoặc qua các biểu mẫu trực tuyến đơn lẻ, thiếu liên thông.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Gì Đã Thay Đổi</h3><p>“Tôi tự hỏi tại sao mình không thử xây dựng một phần mềm để giảm tải những thủ tục giấy tờ không đáng có”, thầy Đăng kể. Phần mềm Quản lý công việc trực tuyến ban đầu chỉ giải quyết thủ tục hành chính cho phụ huynh, học sinh, rồi dần tích hợp thêm nhiều chức năng thay cho nhiều nền tảng riêng lẻ. Hiệu trưởng đặt hàng, trao quyền và tạo điều kiện; hệ thống vận hành chính thức từ đầu năm học 2025–2026.</p><p>Nay giáo viên nộp đánh giá trực tuyến, tổ trưởng xem và phản hồi ngay trên hệ thống, dữ liệu chuyển tiếp lên ban giám hiệu phê duyệt. Học sinh đăng ký môn học, ngoại ngữ tự chọn, sự kiện ở cùng một nơi. Phụ huynh gửi yêu cầu và theo dõi tiến độ hồ sơ trực tuyến.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết Quả</h3><ul class="list-disc pl-5 space-y-2"><li>Đánh giá quý cho 117 giáo viên: từ 2–3 tuần xuống 2–3 ngày.</li><li>Thủ tục hành chính cho phụ huynh, học sinh: từ có khi hàng tuần xuống còn vài ngày.</li><li>Đăng ký môn học, đánh giá thi đua, đánh giá chuẩn giáo viên, chuẩn hiệu trưởng, hiệu phó đều làm trên cùng một hệ thống.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá Trị Mang Lại</h3><p>Theo thầy Đỗ Vũ Ngọc Trung, Phó Hiệu trưởng, đánh giá quý là chức năng được đánh giá cao nhất: giáo viên theo dõi được toàn bộ tiến trình xử lý, tăng tính minh bạch, công khai. Phụ huynh không phải đến trường nhiều lần chỉ để nộp và nhận giấy tờ. Thầy Đăng đang phát triển thêm các mô-đun kế toán, quản lý lương và thống kê dữ liệu.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Phần mềm này không đến từ một gói thầu. Nó đến từ một thầy giáo biết quy trình trong trường vướng ở đâu, và một hiệu trưởng sẵn sàng đặt hàng, trao quyền cho giáo viên của mình.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://dantri.com.vn/giao-duc/thay-giao-so-hoa-toan-bo-hoat-dong-nha-truong-minh-bach-xep-loai-giao-vien-20260718084803307.htm" target="_blank" rel="noopener noreferrer">Báo Dân trí – 18/07/2026</a></li></ul></section>
                `
            },
            62: {
                category: "Người dân",
                title: "Drone giá rẻ nhưng chất lượng không hề rẻ",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-forest-lowcost-drone-mapping-2026.webp",
                imageAlt: "Kiểm lâm dùng drone giá rẻ và điểm khống chế mặt đất để lập bản đồ rừng",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Đáng Nhớ Nhất</h3><p>Bản đồ hiện trạng rừng hằng năm ở Hải Phòng chưa khớp với thực tế. Cán bộ kiểm lâm Đỗ Tuấn Anh dùng thiết bị bay không người lái chi phí thấp, kết hợp lưới điểm khống chế mặt đất để làm bản đồ. Sai số đo đạc còn 10–20 cm, chính xác hơn 25–100 lần cách làm thủ công.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước Đó</h3><p>“Một trong những bất cập chính của ngành lâm nghiệp thành phố hiện nay là hệ thống dữ liệu, bản đồ công bố hiện trạng rừng hằng năm của các quận, huyện chưa chính xác so với thực tế”, anh Tuấn Anh nói. Theo anh, tiêu chuẩn đo đạc, khảo sát của ngành không cao, còn nhiều khu rừng núi hiểm trở, khó khảo sát trực tiếp. Ông Vũ Ngọc Tỉnh, 25 năm tuần rừng ở Gia Luận (đặc khu Cát Hải), kể có người trong tổ đi vài ngày vẫn lạc lối ra.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Gì Đã Thay Đổi</h3><p>Ảnh chụp từ thiết bị bay giá rẻ tự nó chưa đạt độ chính xác của khảo sát truyền thống. Anh Tuấn Anh bố trí thêm một hệ thống lưới điểm khống chế mặt đất để cải thiện độ chính xác của phép nội suy quang học, đưa ảnh từ drone giá rẻ tiệm cận các phương pháp khảo sát truyền thống. Giải pháp được đưa vào hoạt động thực tiễn và đoạt giải cao tại hội thi sáng tạo kỹ thuật.</p><p>Bản đồ số hóa hiện trạng rừng được tích hợp vào điện thoại, máy tính bảng để hỗ trợ kiểm tra rừng. Cán bộ kiểm lâm đối chiếu quy hoạch rừng, hiện trạng sử dụng đất trên dữ liệu số, bớt phải vào những khu rừng sâu, hiểm trở.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết Quả</h3><ul class="list-disc pl-5 space-y-2"><li>Sai số đo đạc: 10–20 cm.</li><li>Độ chính xác: cải thiện 25–100 lần so với giải pháp thủ công hiện tại của ngành lâm nghiệp.</li><li>Giai đoạn 2020–2025, cán bộ, công chức Chi cục Kiểm lâm Hải Phòng đoạt 5 giải thưởng tại Hội thi Sáng tạo Kỹ thuật của Liên đoàn Lao động thành phố.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá Trị Mang Lại</h3><p>Người được lợi trực tiếp là cán bộ kiểm lâm và các tổ tuần rừng. Khai thác dữ liệu trực tuyến giúp họ giảm những chuyến vào địa hình rừng sâu, hiểm trở, qua đó an toàn hơn. Việc đối chiếu quy hoạch, thẩm định các dự án liên quan đến đất lâm nghiệp cũng dễ dàng hơn. Khó khăn vẫn còn: kinh phí thiết bị lớn, đội ngũ có độ tuổi trung bình cao.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Độ chính xác không nhất thiết phải mua bằng thiết bị đắt tiền. Ở Hải Phòng, nó đến từ một cán bộ kiểm lâm biết đặt thêm những điểm mốc trên mặt đất cho một chiếc drone giá rẻ.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://mst.gov.vn/kiem-lam-hai-phong-ung-dung-chuyen-doi-so-trong-quan-ly-bao-ve-rung-197251108163236057.htm" target="_blank" rel="noopener noreferrer">Cổng Thông tin điện tử Bộ Khoa học và Công nghệ (theo Báo Hải Phòng) – 09/11/2025</a></li><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://baohaiphong.vn/kiem-lam-hai-phong-ung-dung-chuyen-doi-so-trong-quan-ly-bao-ve-rung-520999.html" target="_blank" rel="noopener noreferrer">Báo Hải Phòng – 18/09/2025</a></li></ul></section>
                `
            },
            63: {
                category: "Người dân",
                title: "Từ bài học STEM đến mô hình cảnh báo lũ và sạt lở",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-student-flood-landslide-warning-2026.webp",
                imageAlt: "Ba học sinh thử mô hình cảm biến và camera AI cảnh báo lũ, sạt lở",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Đáng Nhớ Nhất</h3><p>Trong khoảng 10 giờ thi, chia làm hai ngày, ba học sinh Trường THPT Bình Tân (TP.HCM) đi từ ý tưởng đến mô hình một hệ thống cảnh báo lũ lụt và sạt lở ứng dụng camera AI. Sản phẩm đạt giải nhất bảng C cuộc thi AI Hackathon 2025.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước Đó</h3><p>Nhóm xuất phát từ thực tế thời tiết cực đoan gây bão lũ và sạt lở ở một số địa phương. Khi nước dâng, người dân cần được báo đủ sớm để di tản. Khi đất đá sạt xuống, xe cộ cần được chặn trước khi đi vào vùng nguy hiểm. Nguyễn Khánh Duy (lớp 11B9), Trang Thành Đạt và Nguyễn Đăng Khôi (lớp 12A9) chọn giải cả hai bài toán trong một hệ thống.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Gì Đã Thay Đổi</h3><p>Giai đoạn trước lũ, nhóm chế tạo hộp đa năng gồm cảm biến mưa, nhiệt độ, độ ẩm và cảm biến siêu âm đo mực nước. Khi mực nước tăng đến mức báo động, đèn chuyển màu và còi báo hiệu để người dân kịp di tản. Giai đoạn sau lũ, camera và cảm biến siêu âm theo dõi sạt lở; khi phát hiện đất đá chuyển động, hệ thống kích hoạt động cơ chặn phương tiện đi vào vùng nguy hiểm.</p><p>Khó nhất là lập trình. “Có lúc mất kết nối mạng hoặc sai số cảm biến khiến tụi mình phải chỉnh đi chỉnh lại liên tục”, Khôi kể. Theo Đạt, 80% kiến thức nhóm dùng đến từ môn STEM ở trường, nơi cô Lê Ngọc Quỳnh Mai hướng dẫn nhóm.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết Quả</h3><ul class="list-disc pl-5 space-y-2"><li>Từ ý tưởng đến mô hình: khoảng 10 giờ, chia thành hai ngày thi.</li><li>Giải nhất bảng C cuộc thi AI Hackathon 2025.</li><li>80% kiến thức dùng cho sản phẩm đến từ môn STEM ở trường (theo nhóm).</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá Trị Mang Lại</h3><p>Sản phẩm hiện mới là mô hình dự thi, chưa được lắp đặt ở địa phương nào. Nhưng ba học sinh đã biến bài học STEM, nơi các em làm việc nhóm để giải quyết vấn đề thực tế, thành một mô hình có đủ cảm biến, cảnh báo và cơ cấu chặn xe. “Dự án này tụi mình đặt rất nhiều tâm huyết. Mong một ngày có thể được ứng dụng thật sự tại các vùng thường xuyên bị bão lũ”, nhóm chia sẻ.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Cảnh báo thiên tai không nhất thiết bắt đầu từ trung tâm dữ liệu lớn. Một hộp cảm biến, một chiếc camera đặt đúng chỗ, và học sinh phổ thông đã đủ kiến thức để dựng mô hình ấy trong mười giờ.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://muctim.tuoitre.vn/thiet-bi-canh-bao-lu-va-sat-lo-made-by-teen-101251222112449369.htm" target="_blank" rel="noopener noreferrer">Tuổi Trẻ Online (Mực Tím) – 23/12/2025</a></li></ul></section>
                `
            },
            64: {
                category: "Người dân",
                title: "Drone phun thuốc, mỗi héc ta tiết kiệm hơn 1 triệu đồng",
                date: "Câu chuyện năm 2026",
                image: "assets/images/story-rice-field-spraying-drone-2026.webp",
                imageAlt: "Nông dân cùng vận hành drone phun thuốc trên cánh đồng lúa",
                content: `
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Đáng Nhớ Nhất</h3><p>Ở xã Long Điền (TP.HCM), 30 hội viên nông dân góp nhau đầu tư khoảng 800 triệu đồng cho hai thiết bị bay phun thuốc. Theo người nông dân, mỗi héc ta tiết kiệm khoảng 750.000 đồng tiền thuốc và 350.000 đồng tiền công. Đến nay, hơn 450 ha lúa ở đây đã được phun bằng drone.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Trước Đó</h3><p>Chi phí sản xuất cao, lao động thủ công nhiều là nỗi lo quen thuộc của nông dân trồng lúa. Trước đây, người dân phải lội ruộng phun thuốc bảo vệ thực vật. Người phun tiếp xúc trực tiếp với thuốc. Bước chân lội ruộng giẫm đạp lên lúa, làm hụt năng suất. Nhà nào phun nhà nấy thì sâu bệnh vẫn có đường lây từ ruộng này sang ruộng khác, hiệu quả phòng trừ hạn chế.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Điều Gì Đã Thay Đổi</h3><p>Giữa tháng 4/2024, 30 hội viên nông dân xã Long Điền liên kết thành lập Chi hội Nông dân nghề nghiệp ứng dụng thiết bị bay không người lái trong sản xuất nông nghiệp. Chi hội đầu tư khoảng 800 triệu đồng mua hai thiết bị bay T50 và T25 để phun thuốc bảo vệ thực vật. Người không còn phải lội ruộng; nhiều thửa được phun đồng loạt trên diện rộng.</p><p>Ông Nguyễn Văn Hùng có 3,5 ha lúa ở Long Điền. Vụ Đông Xuân 2024–2025, ông đạt năng suất hơn 8 tấn/ha; theo ông, drone có đóng góp không nhỏ. Phun đồng loạt khiến sâu bệnh không có điều kiện lây lan từ vùng này sang vùng khác. Chi hội còn mở rộng dịch vụ sang các khu vực lân cận, và drone được dùng cả cho hồ tiêu, ca cao, bưởi da xanh, thanh long.</p></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Kết Quả</h3><ul class="list-disc pl-5 space-y-2"><li>Mỗi héc ta tiết kiệm khoảng 750.000 đồng tiền thuốc và 350.000 đồng chi phí nhân công (theo người nông dân).</li><li>Năng suất lúa tăng 3–5%, tương đương khoảng 300 kg/ha, nhờ hạn chế giẫm đạp khi lội ruộng phun thuốc.</li><li>Hơn 450 ha lúa tại Long Điền đã được phun thuốc bằng drone.</li></ul></section>
                    <section><h3 class="text-[#FFC21A] font-extrabold uppercase tracking-wide mb-2">Giá Trị Mang Lại</h3><p>Người nông dân bớt những buổi lội ruộng và hạn chế tiếp xúc trực tiếp với thuốc bảo vệ thực vật. Tiền thuốc, tiền công giảm ngay trên từng héc ta. Ở HTX Nông nghiệp ứng dụng công nghệ cao Lá Xanh cùng xã, ông Lê Cảnh Đạt, Chủ tịch Hội đồng quản trị, cho biết ứng dụng công nghệ giúp HTX nâng cao chất lượng, giá trị sản phẩm, mở thêm dịch vụ, tạo việc làm và tăng thu nhập cho thành viên.</p></section>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl text-white"><strong class="text-[#FFC21A] block uppercase tracking-wide mb-2">Thông điệp từ câu chuyện</strong>Thiết bị đắt không nhất thiết phải do từng hộ tự mua. Khi 30 nông dân góp lại thành một chi hội, chiếc drone trở thành dịch vụ chung, và lợi ích được đo ngay bằng tiền trên từng héc ta ruộng.</blockquote>
                    <section class="pt-4 border-t border-[#C9D3F0]/20"><h3 class="text-white font-extrabold mb-2">Nguồn tham khảo</h3><ul class="space-y-2 text-sm"><li><a class="text-[#FFC21A] underline underline-offset-2 hover:text-white" href="https://nld.com.vn/drone-ra-dong-nong-dan-nhan-hon-196260617121156662.htm" target="_blank" rel="noopener noreferrer">Báo Người Lao Động – 18/06/2026</a></li></ul></section>
                `
            }
        };
        function resetArticleModalScroll() {
            const modal = document.getElementById('articleModal');
            const articleBody = document.getElementById('articleModalBody');

            if (modal) modal.scrollTop = 0;
            if (articleBody) articleBody.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }

        function openArticleModal(id) {
            const article = articlesData[id];
            if (!article) return;
            document.getElementById('modalCategory').innerText = article.category;
            document.getElementById('modalTitle').innerText = article.title;
            document.getElementById('modalDate').innerHTML = `<i class="fa-regular fa-calendar mr-1"></i> ${article.date}`;
            const modalImage = document.getElementById('modalImage');
            modalImage.src = article.image;
            modalImage.alt = article.imageAlt;
            document.getElementById('modalContent').innerHTML = article.content;
            resetArticleModalScroll();
            
            const modal = document.getElementById('articleModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';

            requestAnimationFrame(resetArticleModalScroll);
        }

        function closeArticleModal() {
            const modal = document.getElementById('articleModal');
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
            resetArticleModalScroll();
            document.body.style.overflow = '';
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeArticleModal();
            }
        });

        // Event Section Tab Switcher (Mặc định 10/10; hỗ trợ 09/10 và 08/10)
        function switchEventTab(day) {
            const tab10 = document.getElementById('tabEvent10');
            const tab09 = document.getElementById('tabEvent09');
            const tab08 = document.getElementById('tabEvent08');
            const panel10 = document.getElementById('eventPanel10');
            const panel09 = document.getElementById('eventPanel09');
            const panel08 = document.getElementById('eventPanel08');

            if (!tab10 || !tab09 || !tab08 || !panel10 || !panel09 || !panel08) return;

            const tabs = { '10': tab10, '09': tab09, '08': tab08 };
            const panels = { '10': panel10, '09': panel09, '08': panel08 };
            const inactiveClass = "min-w-0 flex-1 py-3.5 px-2 sm:px-6 rounded-xl text-[#C9D3F0] hover:text-white bg-transparent transition-all duration-300 flex items-center justify-center cursor-pointer select-none";
            const mainActiveClass = "min-w-0 flex-1 py-3.5 px-2 sm:px-6 rounded-xl text-[#0B1B4D] bg-gradient-to-r from-[#FFC21A] via-[#FFD452] to-[#FFC21A] shadow-[0_4px_20px_rgba(255,194,26,0.4)] transition-all duration-300 flex items-center justify-center cursor-pointer select-none";
            const secondaryActiveClass = "min-w-0 flex-1 py-3.5 px-2 sm:px-6 rounded-xl text-white bg-gradient-to-r from-[#2F6BFF] to-[#13307A] shadow-[0_4px_20px_rgba(47,107,255,0.4)] transition-all duration-300 flex items-center justify-center cursor-pointer select-none";

            if (!tabs[day] || !panels[day]) return;

            Object.entries(tabs).forEach(([tabDay, tab]) => {
                tab.className = tabDay === day
                    ? (tabDay === '10' ? mainActiveClass : secondaryActiveClass)
                    : inactiveClass;
            });

            Object.values(panels).forEach((panel) => panel.classList.add('hidden', 'opacity-0'));
            panels[day].classList.remove('hidden');
            setTimeout(() => panels[day].classList.remove('opacity-0'), 15);
        }

        // ScrollSpy Menu Navigation Active Highlighting
        function updateScrollSpy() {
            const sections = [
                { id: 'hero', navHref: '#hero' },
                { id: 'tru-cot', navHref: '#hero' },
                { id: 'ket-qua', navHref: '#ket-qua' },
                { id: 'su-kien', navHref: '#su-kien' },
                { id: 'cau-chuyen', navHref: '#cau-chuyen' },
                { id: 'tao-avatar', navHref: '#tao-avatar' },
                { id: 'dang-ky-qr', navHref: '#tao-avatar' }
            ];

            const scrollPos = window.scrollY + 180;
            let activeHref = '#hero';

            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 80) {
                activeHref = '#tao-avatar';
            } else {
                for (let i = sections.length - 1; i >= 0; i--) {
                    const el = document.getElementById(sections[i].id);
                    if (el && scrollPos >= el.offsetTop) {
                        activeHref = sections[i].navHref;
                        break;
                    }
                }
            }

            // Desktop Header Links Highlighting
            document.querySelectorAll('header nav a[href^="#"]').forEach(link => {
                if (link.getAttribute('href') === activeHref) {
                    link.classList.add('text-[#FFC21A]', 'border-b-2', 'border-[#FFC21A]');
                    link.classList.remove('text-[#C9D3F0]');
                } else {
                    link.classList.remove('text-[#FFC21A]', 'border-b-2', 'border-[#FFC21A]');
                    link.classList.add('text-[#C9D3F0]');
                }
            });

            // Mobile Drawer Links Highlighting
            document.querySelectorAll('#mobileMenu a[href^="#"]').forEach(link => {
                if (link.getAttribute('href') === activeHref) {
                    link.classList.add('bg-[#13307A]', 'text-[#FFC21A]', 'font-extrabold', 'border-l-4', 'border-[#FFC21A]');
                    link.classList.remove('text-white');
                } else {
                    link.classList.remove('bg-[#13307A]', 'text-[#FFC21A]', 'font-extrabold', 'border-l-4', 'border-[#FFC21A]');
                    link.classList.add('text-white');
                }
            });
        }

        window.addEventListener('scroll', updateScrollSpy, { passive: true });
        window.addEventListener('load', function() {
            initCanvas();
            updateScrollSpy();
        });
        document.addEventListener('DOMContentLoaded', updateScrollSpy);
