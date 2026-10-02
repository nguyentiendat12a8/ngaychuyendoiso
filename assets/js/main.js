AOS.init({ once: true, duration: 1200 });

        // Countdown (Đếm ngược 24/7 đến Ngày Chuyển đổi số Quốc gia 10/10/2026)
        let targetDate = new Date('October 10, 2026 00:00:00').getTime();
        if (targetDate - new Date().getTime() <= 0) {
            // Tự động duy trì đếm ngược 9 ngày 02 giờ 20 phút nếu máy trạm vượt mốc
            targetDate = new Date().getTime() + (9 * 24 * 3600 * 1000) + (2 * 3600 * 1000) + (20 * 60 * 1000) + 15000;
        }

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
                    containerEl.className = 'w-full';
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
                        const target = +counter.getAttribute('data-target');
                        let count = 0;
                        const increment = target / 45;
                        const updateCount = () => {
                            count += increment;
                            if (count < target) {
                                counter.innerText = Math.ceil(count);
                                setTimeout(updateCount, 45);
                            } else {
                                counter.innerText = target;
                            }
                        };
                        updateCount();
                    });
                }
            });
        }, { threshold: 0.5 });
        const metricsSection = document.getElementById('ket-qua');
        if (metricsSection) observer.observe(metricsSection);

        // Canvas Avatar Generator
        const canvas = document.getElementById('avatarCanvas');
        const ctx = canvas.getContext('2d');
        let uploadedImage = null;

        const frameImg = new Image();
        const FRAME_URL = 'assets/images/avatar-frame.png';
        
        frameImg.onload = function() {
            renderAvatarFrame();
        };

        frameImg.src = FRAME_URL;

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
            }
        });

        document.getElementById('zoomRange').addEventListener('input', renderAvatarFrame);

        function downloadAvatar() {
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
                category: "Chính phủ số",
                title: "Đột phá VNeID & dịch vụ công không giấy tờ: Mang lại giá trị thực cho 100 triệu dân",
                date: "28/09",
                image: "assets/images/story-1.webp",
                content: `
                    <p class="font-semibold text-white">Bước ngoặt lịch sử của Việt Nam trong tiến trình số hóa toàn diện bộ máy quản trị công. Lần đầu tiên, 100% kết quả thủ tục hành chính tại tất cả các bộ, ngành và 34 tỉnh, thành phố đều được cấp bản điện tử có giá trị pháp lý tương đương bản giấy.</p>
                    <p>Trước đây, người dân phải mang theo hàng loạt giấy tờ tùy thân, bản sao chứng thực khi thực hiện các thủ tục như đăng ký đất đai, cấp phép kinh doanh hay làm thủ tục bảo hiểm. Hiện nay, thông qua ứng dụng Định danh điện tử quốc gia (VNeID) tích hợp trí tuệ nhân tạo, thông tin của người dân được tự động đối soát với Cơ sở dữ liệu quốc gia về dân cư.</p>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl italic text-white">
                        “Mục tiêu cao nhất của Chính phủ số không phải là tạo ra nhiều hệ thống công nghệ, mà là cắt giảm tối đa chi phí thời gian và đi lại cho người dân & doanh nghiệp.”
                    </blockquote>
                    <p>Thống kê trong quý III cho thấy, tỷ lệ cắt giảm thời gian xử lý thủ tục hành chính đạt 42.5%, tiết kiệm cho xã hội hàng ngàn tỷ đồng mỗi năm. Đây chính là minh chứng rõ nét nhất cho tinh thần: <strong>Chuyển đổi số lấy người dân làm trung tâm - Từ kiến trúc nền tảng đến kết quả thực chất.</strong></p>
                `
            },
            2: {
                category: "Kinh tế số nông thôn",
                title: "Nông dân 4.0: Đưa nông sản Việt vươn tầm toàn cầu nhờ mã vùng trồng số",
                date: "25/09",
                image: "assets/images/story-2.webp",
                content: `
                    <p class="font-semibold text-white">Chuyển đổi số không chỉ diễn ra tại các đô thị lớn hay các tập đoàn công nghệ hàng đầu, mà đang len lỏi vào từng đồng ruộng, vườn cây của người nông dân Việt Nam.</p>
                    <p>Tại Đồng bằng sông Cửu Long và Tây Nguyên, dự án số hóa mã vùng trồng và liên thông dữ liệu truy xuất nguồn gốc chuỗi cung ứng nông sản đã đạt tỷ lệ bao phủ hơn 80%. Mỗi quả sầu riêng, xoài hay cà phê xuất khẩu đều mang một mã QR gắn với dữ liệu nhật ký canh tác số trên nền tảng dùng chung quốc gia.</p>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#F7931E] rounded-r-xl italic text-white">
                        “Nhờ có mã vùng trồng số và giao dịch trực tiếp trên sàn e-commerce quốc tế, thu nhập của gia đình tôi tăng hơn 35% so với bán qua thương lái truyền thống.” - Chia sẻ từ nông dân vùng trồng sầu riêng Đắk Lắk.
                    </blockquote>
                    <p>Nhờ hạ tầng mạng 5G phủ sóng 99% vùng nông thôn cùng sự hỗ trợ tích cực của Tổ công nghệ số cộng đồng, người nông dân giờ đây có thể tự tin bán hàng qua hình thức livestream xuyên biên giới, mở ra định hướng phát triển kinh tế số nông thôn bền vững và đột phá.</p>
                `
            },
            3: {
                category: "Y tế số & dữ liệu",
                title: "Hồ sơ sức khỏe điện tử toàn dân: Kết nối liên thông 34 tỉnh, thành",
                date: "20/09",
                image: "assets/images/story-3.webp",
                content: `
                    <p class="font-semibold text-white">Hệ thống Hồ sơ sức khỏe điện tử toàn dân chính thức kết nối liên thông dữ liệu giữa tất cả bệnh viện tuyến Trung ương, tuyến tỉnh và trạm y tế xã trên toàn quốc.</p>
                    <p>Giờ đây, khi đến khám tại bất kỳ cơ sở y tế nào, bác sĩ chỉ cần truy cập lịch sử y khoa của bệnh nhân qua mã định danh VNeID (đã được sự đồng ý của bệnh nhân), giúp giảm thiểu tối đa xét nghiệm trùng lặp và rút ngắn thời gian chẩn đoán.</p>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#2F6BFF] rounded-r-xl italic text-white">
                        “Liên thông dữ liệu xét nghiệm và hồ sơ bệnh án giúp tiết kiệm thời gian khám bệnh tới 50% và tối ưu hóa chi phí cho quỹ Bảo hiểm y tế.”
                    </blockquote>
                    <p>Bên cạnh đó, trợ lý AI y tế tích hợp hỗ trợ phân tích hình ảnh X-quang, MRI và dự báo sớm nguy cơ bệnh mãn tính, mang lại dịch vụ chăm sóc sức khỏe chất lượng cao cho mọi người dân.</p>
                `
            },
            4: {
                category: "Giáo dục số",
                title: "Trợ lý AI học đường: Cá nhân hóa lộ trình học cho hàng triệu học sinh",
                date: "15/09",
                image: "assets/images/story-4.webp",
                content: `
                    <p class="font-semibold text-white">Chương trình ứng dụng Trợ lý trí tuệ nhân tạo (AI) học đường được triển khai đồng bộ tại các trường phổ thông toàn quốc, tạo nên làn gió mới trong phương pháp dạy và học.</p>
                    <p>Hệ thống học liệu số quốc gia kết hợp AI giúp tự động phân tích điểm mạnh, điểm yếu của từng học sinh để gợi ý bài tập và video giảng dạy phù hợp. Điều này giúp thu hẹp đáng kể khoảng cách chất lượng giáo dục giữa vùng thành thị và các khu vực miền núi, hải đảo.</p>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#FFC21A] rounded-r-xl italic text-white">
                        “AI không thay thế giáo viên mà trở thành công cụ đắc lực hỗ trợ thầy cô cá nhân hóa giáo án, giúp học sinh phát huy tối đa năng lực tư duy sáng tạo.”
                    </blockquote>
                    <p>Đến nay, hơn 95% trường học đã hoàn thành kết nối internet tốc độ cao và ứng dụng lớp học thông minh, sẵn sàng cho thế hệ công dân số tương lai.</p>
                `
            },
            5: {
                category: "Đô thị thông minh",
                title: "Trung tâm Điều hành IOC quốc gia: Quản trị đô thị dựa trên dữ liệu thời gian thực",
                date: "10/09",
                image: "assets/images/story-5.webp",
                content: `
                    <p class="font-semibold text-white">Mô hình Trung tâm Điều hành thông minh (IOC) được nâng cấp và liên thông toàn diện từ Trung ương đến địa phương, trở thành 'bộ não số' trong quản trị đô thị hiện đại.</p>
                    <p>Thông qua hàng triệu cảm biến IoT và camera AI giám sát giao thông, môi trường, an ninh trật tự, hệ thống IOC tự động phân tích và cảnh báo sớm các sự cố như ùn tắc giao thông, ngập lụt hay ô nhiễm không khí cho các cơ quan chức năng xử lý tức thời.</p>
                    <blockquote class="p-4 my-4 bg-[#13307A]/60 border-l-4 border-[#F7931E] rounded-r-xl italic text-white">
                        “100% phản ánh của người dân gửi qua ứng dụng Đô thị thông minh đều được tiếp nhận, phân loại tự động và giải quyết trong thời gian cam kết với tỷ lệ hài lòng đạt trên 98%.”
                    </blockquote>
                    <p>IOC giúp chuyển đổi phương thức quản lý đô thị từ bị động ứng phó sang chủ động dự báo và điều hành dựa trên dữ liệu thời gian thực.</p>
                `
            }
        };

        function openArticleModal(id) {
            const article = articlesData[id];
            if (!article) return;
            document.getElementById('modalCategory').innerText = article.category;
            document.getElementById('modalTitle').innerText = article.title;
            document.getElementById('modalDate').innerHTML = `<i class="fa-regular fa-calendar mr-1"></i> ${article.date}`;
            document.getElementById('modalImage').src = article.image;
            document.getElementById('modalContent').innerHTML = article.content;
            
            const modal = document.getElementById('articleModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        }

        function closeArticleModal() {
            const modal = document.getElementById('articleModal');
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
            document.body.style.overflow = '';
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeArticleModal();
            }
        });

        // Event Section Tab Switcher (Mặc định 10/10, chuyển sang 09/10)
        function switchEventTab(day) {
            const tab10 = document.getElementById('tabEvent10');
            const tab09 = document.getElementById('tabEvent09');
            const panel10 = document.getElementById('eventPanel10');
            const panel09 = document.getElementById('eventPanel09');

            if (!tab10 || !tab09 || !panel10 || !panel09) return;

            if (day === '10') {
                tab10.className = "flex-1 py-3.5 px-4 sm:px-6 rounded-xl text-[#0B1B4D] bg-gradient-to-r from-[#FFC21A] via-[#FFD452] to-[#FFC21A] shadow-[0_4px_20px_rgba(255,194,26,0.4)] transition-all duration-300 flex items-center justify-center cursor-pointer select-none";
                tab09.className = "flex-1 py-3.5 px-4 sm:px-6 rounded-xl text-[#C9D3F0] hover:text-white bg-transparent transition-all duration-300 flex items-center justify-center cursor-pointer select-none";

                panel09.classList.add('hidden', 'opacity-0');
                panel10.classList.remove('hidden');
                setTimeout(() => panel10.classList.remove('opacity-0'), 15);
            } else {
                tab09.className = "flex-1 py-3.5 px-4 sm:px-6 rounded-xl text-white bg-gradient-to-r from-[#2F6BFF] to-[#13307A] shadow-[0_4px_20px_rgba(47,107,255,0.4)] transition-all duration-300 flex items-center justify-center cursor-pointer select-none";
                tab10.className = "flex-1 py-3.5 px-4 sm:px-6 rounded-xl text-[#C9D3F0] hover:text-white bg-transparent transition-all duration-300 flex items-center justify-center cursor-pointer select-none";

                panel10.classList.add('hidden', 'opacity-0');
                panel09.classList.remove('hidden');
                setTimeout(() => panel09.classList.remove('opacity-0'), 15);
            }
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
