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
                        <div class="w-full bg-gradient-to-r from-[#FBAB18] via-[#E65925] to-[#FBAB18] text-[#7A0C12] font-black p-4 sm:p-5 rounded-2xl text-center shadow-2xl border border-white/40">
                            <div class="text-sm sm:text-lg flex items-center justify-center gap-1.5 sm:gap-2 uppercase tracking-wider font-black mb-1.5 leading-tight">
                                <span class="text-base sm:text-xl">🎉</span>
                                <span class="whitespace-normal">CHÀO MỪNG NGÀY CHUYỂN ĐỔI SỐ QUỐC GIA 10/10</span>
                                <span class="text-base sm:text-xl">🎉</span>
                            </div>
                            <span class="text-xs sm:text-sm font-bold text-[#7A0C12]/90 block leading-relaxed">Hành động cùng Chuyển đổi số Quốc gia – Nâng cao hiệu quả quản trị và tạo giá trị thực cho Người dân!</span>
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
        const ctx = canvas ? canvas.getContext('2d') : null;
        let uploadedImage = null;

        const frameImg = new Image();
        const FINAL_FRAME_URL = 'assets/images/avatar-frame-final.png';
        
        frameImg.onload = function() {
            renderAvatarFrame();
        };

        function updateAvatarFrame() {
            if (window.location.protocol === 'file:' && window.__localAvatarFrame) {
                frameImg.src = window.__localAvatarFrame;
            } else {
                frameImg.src = FINAL_FRAME_URL;
            }
            if (frameImg.complete && frameImg.naturalWidth > 0) {
                renderAvatarFrame();
            }
        }

        function initCanvas() {
            if (!canvas) return;
            canvas.width = 800;
            canvas.height = 800;
            updateAvatarFrame();
            renderAvatarFrame();
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initCanvas);
        } else {
            initCanvas();
        }

        if (window.location.protocol === 'file:') {
            window.__loadLocalAvatarFrame = function() {
                updateAvatarFrame();
            };
            const localFrameScript = document.createElement('script');
            localFrameScript.src = 'assets/js/avatar-frame.local.js';
            localFrameScript.onerror = function() {
                console.error('Không tải được ảnh khung cho bản xem local. Hãy chạy npm run build.');
            };
            document.head.appendChild(localFrameScript);
        } else {
            updateAvatarFrame();
        }

        function renderAvatarFrame() {
            if (!ctx) return;
            const size = 800;
            ctx.clearRect(0, 0, size, size);

            // Match the transparent portrait opening in avatar-frame-final.png.
            const cx = 400;
            const cy = 440;
            const r = 278;

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
                ctx.fillStyle = '#7A0C12';
                ctx.fillRect(0, 0, size, size);
                ctx.fillStyle = '#FFF6E6';
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
                    nameDisplay.classList.add('font-semibold', 'text-[#FBAB18]');
                }
                const reader = new FileReader();
                reader.onload = function(evt) {
                    uploadedImage = new Image();
                    uploadedImage.onload = function() {
                        renderAvatarFrame();
                        if (downloadBtn) {
                            downloadBtn.disabled = false;
                            downloadBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                            downloadBtn.classList.add('hover:bg-[#E65925]', 'hover:scale-105', 'cursor-pointer');
                        }
                    }
                    uploadedImage.src = evt.target.result;
                }
                reader.readAsDataURL(file);
            } else {
                if (nameDisplay) {
                    nameDisplay.innerText = 'Chưa chọn tệp nào';
                    nameDisplay.classList.add('italic');
                    nameDisplay.classList.remove('font-semibold', 'text-[#FBAB18]');
                }
                if (downloadBtn) {
                    downloadBtn.disabled = true;
                    downloadBtn.classList.add('opacity-50', 'cursor-not-allowed');
                    downloadBtn.classList.remove('hover:bg-[#E65925]', 'hover:scale-105', 'cursor-pointer');
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
            pCtx.fillStyle = 'rgba(251, 171, 24, 0.35)';
            pCtx.strokeStyle = 'rgba(230, 89, 37, 0.12)';

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
        // Card metadata stays in the initial bundle. Full article bodies are loaded on demand.
        const articlesData = {
            "1": {
                "category": "Cơ quan nhà nước",
                "title": "Chuyển đổi số thay đổi cách người dân đi máy bay",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-vneid-airport-2026.webp",
                "imageAlt": "Hành khách sử dụng điện thoại tại cổng nhận diện khuôn mặt ở sân bay"
            },
            "2": {
                "category": "Cơ quan nhà nước",
                "title": "Từ thuế khoán đến chiếc điện thoại: Chuyển đổi số thay đổi cách hộ kinh doanh nộp thuế",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-tax-mobile-2026.webp",
                "imageAlt": "Chủ hộ kinh doanh kê khai thuế điện tử trên điện thoại tại cửa hàng"
            },
            "3": {
                "category": "Cơ quan nhà nước",
                "title": "Mỗi cử tri một định danh: Khi dữ liệu số đi vào ngày hội toàn dân",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-digital-voter-2026.webp",
                "imageAlt": "Cử tri sử dụng định danh điện tử tại điểm bỏ phiếu"
            },
            "4": {
                "category": "Cơ quan nhà nước",
                "title": "Chuyển đổi số trong các cơ quan Đảng từ việc nộp đảng phí",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-electronic-party-procedures-2026.webp",
                "imageAlt": "Cán bộ hỗ trợ thực hiện thủ tục và thanh toán điện tử trên điện thoại"
            },
            "5": {
                "category": "Cơ quan nhà nước",
                "title": "Hà Nội: Chuẩn hóa thủ tục trước, rồi mới đưa lên mạng",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-hanoi-digital-procedure-2026.webp",
                "imageAlt": "Người dân được hỗ trợ giải quyết thủ tục bằng dữ liệu số tại trung tâm hành chính"
            },
            "6": {
                "category": "Cơ quan nhà nước",
                "title": "Khi dịch vụ công vượt qua rào cản địa giới hành chính",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-cross-province-service-2026.webp",
                "imageAlt": "Người lao động nộp hồ sơ hộ tịch tại nơi làm việc để được xử lý liên tỉnh"
            },
            "7": {
                "category": "Cơ quan nhà nước",
                "title": "Kiosk thông minh giúp người dân tự tin trên môi trường số",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-smart-kiosk-langson-2026.webp",
                "imageAlt": "Người cao tuổi được hướng dẫn sử dụng kiosk dịch vụ công thông minh tại Lạng Sơn"
            },
            "8": {
                "category": "Cơ quan nhà nước",
                "title": "Số hóa ngay từ quầy: Cách chuyển đổi số giúp chính quyền cơ sở xử lý hồ sơ đất đai đúng hạn",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-land-record-digitization-2026.webp",
                "imageAlt": "Cán bộ số hóa hồ sơ đất đai ngay tại quầy tiếp nhận ở Ninh Bình"
            },
            "9": {
                "category": "Cơ quan nhà nước",
                "title": "Nền tảng số dùng chung: Một thay đổi lớn trong đầu tư chuyển đổi số của cơ quan nhà nước",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-shared-digital-platform-2026.webp",
                "imageAlt": "Các cơ quan cùng khai thác một nền tảng số và dữ liệu dùng chung"
            },
            "10": {
                "category": "Cơ quan nhà nước",
                "title": "“Lên đời” cho Internet: Hạ tầng thầm lặng của chuyển đổi số",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-ipv6-infrastructure-2026.webp",
                "imageAlt": "Kỹ sư mạng vận hành hạ tầng IPv6 kết nối các dịch vụ và thiết bị số"
            },
            "11": {
                "category": "Cơ quan nhà nước",
                "title": "Hơn 72 tỷ USD giá trị tăng thêm của kinh tế số: Đo được mới quản lý được",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-digital-economy-measurement-2026.webp",
                "imageAlt": "Nhóm chuyên gia phân tích số liệu đóng góp của kinh tế số tại Việt Nam"
            },
            "12": {
                "category": "Cơ quan nhà nước",
                "title": "Muốn dạy bà con “lên sàn”, trước hết phải có chiếc điện thoại",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-border-smartphone-commerce-2026.webp",
                "imageAlt": "Người dân vùng biên Lai Châu học dùng điện thoại để bán nông sản trực tuyến"
            },
            "13": {
                "category": "Cơ quan nhà nước",
                "title": "Khi bác sĩ “tự tay” thiết kế lại quy trình cấp cứu bằng chuyển đổi số",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-emergency-digital-workflow-2026.webp",
                "imageAlt": "Bác sĩ và điều dưỡng vận hành quy trình phân loại cấp cứu trên hệ thống số"
            },
            "14": {
                "category": "Cơ quan nhà nước",
                "title": "Tìm một mẫu bệnh phẩm: từ 5 phút còn 20 giây",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-pathology-sample-indexing-2026.webp",
                "imageAlt": "Kỹ thuật viên sắp xếp mẫu bệnh phẩm trong hộp chuẩn và quản lý vị trí trên máy tính"
            },
            "15": {
                "category": "Cơ quan nhà nước",
                "title": "Chợ quê vùng Khmer bớt đếm tiền lẻ",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-khmer-market-cashless-2026.webp",
                "imageAlt": "Tiểu thương tại chợ quê Vĩnh Long nhận thanh toán bằng điện thoại"
            },
            "16": {
                "category": "Cơ quan nhà nước",
                "title": "Tờ giấy chuyển viện không còn nỗi lo sợ ướt mỗi lần qua đò",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-camau-digital-referral-2026.webp",
                "imageAlt": "Người dân Cà Mau xem giấy chuyển viện điện tử trên điện thoại khi đi đò"
            },
            "17": {
                "category": "Cơ quan nhà nước",
                "title": "Nơi gieo mầm kỹ năng số vùng biên",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-border-digital-literacy-2026.webp",
                "imageAlt": "Người dân vùng biên Nghệ An học kỹ năng số trong phòng máy cộng đồng"
            },
            "18": {
                "category": "Cơ quan nhà nước",
                "title": "Cục Tần số phát hiện hàng nghìn tàu khách, tàu du lịch vi phạm nhờ đối soát dữ liệu",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-radio-frequency-data-2026.webp",
                "imageAlt": "Chuyên viên đối soát dữ liệu đăng kiểm tàu và giấy phép tần số trên bản đồ biển"
            },
            "19": {
                "category": "Doanh nghiệp",
                "title": "Từ tài sản thế chấp đến dữ liệu: Một cách mới để doanh nghiệp nhỏ tiếp cận vốn",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-data-based-sme-lending-2026.webp",
                "imageAlt": "Chủ doanh nghiệp nhỏ trao đổi khoản vay dựa trên dữ liệu bán hàng và dòng tiền"
            },
            "20": {
                "category": "Doanh nghiệp",
                "title": "Giảm từ 12% lỗi xuống 0,5% số sản phẩm lỗi: Khi dữ liệu thay đổi cách một nhà máy vận hành",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-smart-plastic-factory-2026.webp",
                "imageAlt": "Kỹ sư theo dõi dữ liệu chất lượng theo thời gian thực trong nhà máy nhựa thông minh"
            },
            "21": {
                "category": "Doanh nghiệp",
                "title": "Tự động một việc nhỏ, tiết kiệm lớn: Khi AI đi vào từng cửa hàng",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-ai-retail-replenishment-2026.webp",
                "imageAlt": "Nhân viên siêu thị theo dõi dự báo bổ sung hàng tự động trên máy tính bảng"
            },
            "22": {
                "category": "Doanh nghiệp",
                "title": "Khi công nghệ đảm nhiệm phần thủ tục, người mua không phải chờ lâu",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-digital-pharmacy-service-2026.webp",
                "imageAlt": "Dược sĩ sử dụng thiết bị di động để phục vụ và tư vấn khách hàng"
            },
            "23": {
                "category": "Doanh nghiệp",
                "title": "Từ thất bại đến tăng trưởng gấp 3: Khi dữ liệu đổi cách Sunhouse bán hàng xuyên biên giới",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-cross-border-ecommerce-data-2026.webp",
                "imageAlt": "Nhóm thương mại điện tử Việt Nam phân tích dữ liệu và thiết kế sản phẩm cho thị trường Mỹ"
            },
            "24": {
                "category": "Doanh nghiệp",
                "title": "Cảng Cát Lái: Khi chuyển đổi số giảm thời gian cho logistics",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-catlai-smart-port-2026.webp",
                "imageAlt": "Xe container đi qua cổng cảng tự động sau khi hoàn tất thủ tục trực tuyến"
            },
            "25": {
                "category": "Doanh nghiệp",
                "title": "Từ 18 lên 30 container mỗi giờ: Khi dữ liệu giúp cảng quốc tế Hateco vận hành nhanh hơn",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-hateco-ocr-port-2026.webp",
                "imageAlt": "Cảng container Hải Phòng vận hành cẩu và cổng tự động bằng dữ liệu"
            },
            "26": {
                "category": "Doanh nghiệp",
                "title": "Khi AI biến chỗ trống trên tàu thành vé rẻ hơn",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-ai-railway-flexible-fare-2026.webp",
                "imageAlt": "Hành khách chọn vé tàu giảm giá theo chặng trống do hệ thống AI xác định"
            },
            "27": {
                "category": "Doanh nghiệp",
                "title": "Hợp đồng 256 triệu USD và nấc thang mới của kỹ sư Việt",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-vietnam-global-engineers-2026.webp",
                "imageAlt": "Đội ngũ kỹ sư Việt Nam triển khai dự án chuyển đổi số cho khách hàng quốc tế"
            },
            "28": {
                "category": "Doanh nghiệp",
                "title": "Nuôi tôm thời 4.0, người nuôi bớt phải đánh cược",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-smart-shrimp-farm-2026.webp",
                "imageAlt": "Người nuôi tôm theo dõi cảm biến chất lượng nước và dữ liệu ao nuôi"
            },
            "29": {
                "category": "Doanh nghiệp",
                "title": "Khi dữ liệu thay đổi cách vận hành lưới điện",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-electric-grid-smart-meter-2026.webp",
                "imageAlt": "Kỹ sư điện theo dõi công tơ đo xa và dữ liệu vận hành lưới điện"
            },
            "30": {
                "category": "Doanh nghiệp",
                "title": "“Khoảng dừng” đúng lúc: Khi AI giúp người dùng tránh bị lừa",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-ai-scam-pause-warning-2026.webp",
                "imageAlt": "Người dùng dừng lại trước cảnh báo rủi ro khi chuẩn bị chuyển tiền"
            },
            "31": {
                "category": "Doanh nghiệp",
                "title": "Nhờ dữ liệu, nhà máy đã giảm 68% thời gian dừng máy",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-orion-smart-factory-2026.webp",
                "imageAlt": "Kỹ sư theo dõi dữ liệu máy móc và năng lượng trong phòng điều hành nhà máy"
            },
            "32": {
                "category": "Doanh nghiệp",
                "title": "Từ 60 giây xuống 10 giây: Khi chuẩn hóa mở đường cho số hóa",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-cleanroom-standardization-2026.webp",
                "imageAlt": "Công nhân phòng sạch quét và sắp xếp vật liệu trên hệ thống giá kệ chuẩn hóa"
            },
            "33": {
                "category": "Doanh nghiệp",
                "title": "Từ 10 ngày xuống 2 ngày: Khi dữ liệu rút ngắn hành trình vay vốn của doanh nghiệp",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-sme-data-loan-2026.webp",
                "imageAlt": "Chủ doanh nghiệp nhỏ trao đổi khoản vay dựa trên hóa đơn và dữ liệu dòng tiền"
            },
            "34": {
                "category": "Doanh nghiệp",
                "title": "Duyệt thẻ tín dụng: từ hàng giờ còn dưới 5 phút",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-ai-credit-card-approval-2026.webp",
                "imageAlt": "Nhân viên ngân hàng giám sát hệ thống AI hỗ trợ phê duyệt thẻ tín dụng"
            },
            "35": {
                "category": "Doanh nghiệp",
                "title": "Những cung đường cao tốc an toàn hơn nhờ chuyển đổi số",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-ai-smart-highway-2026.webp",
                "imageAlt": "Trung tâm điều hành dùng camera AI phát hiện sự cố và cảnh báo trên cao tốc"
            },
            "36": {
                "category": "Doanh nghiệp",
                "title": "Đầu tư mạnh cho công nghệ giúp giảm các chi phí của Ngân hàng",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-digital-bank-efficiency-2026.webp",
                "imageAlt": "Khách hàng giao dịch trên điện thoại trong trung tâm vận hành ngân hàng số"
            },
            "37": {
                "category": "Doanh nghiệp",
                "title": "Chuyển đổi số trong quản lý điện năng: hiệu quả hơn, an toàn hơn",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-drone-power-transmission-2026.webp",
                "imageAlt": "Kỹ sư dùng thiết bị bay và dữ liệu nhiệt để kiểm tra đường dây truyền tải điện"
            },
            "38": {
                "category": "Doanh nghiệp",
                "title": "Từ 3–4 giờ giảm xuống 30 phút ở Cảng Nam Đình Vũ: Nơi các thủ tục được đưa lên môi trường số",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-namdinhvu-smartport-2026.webp",
                "imageAlt": "Xe container đi qua cổng cảng tự động kết nối trực tiếp với hải quan"
            },
            "39": {
                "category": "Doanh nghiệp",
                "title": "Trợ lý AI: thêm cánh tay đắc lực cho dân văn phòng",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-office-ai-assistant-2026.webp",
                "imageAlt": "Nhóm nhân viên văn phòng kiểm tra câu trả lời và nguồn trích dẫn của trợ lý AI"
            },
            "40": {
                "category": "Doanh nghiệp",
                "title": "Rút ngắn hơn 400 km bằng một chiếc điện thoại",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-laichau-livestream-agriculture-2026.webp",
                "imageAlt": "Phụ nữ dân tộc ở Lai Châu livestream và đóng gói nông sản địa phương"
            },
            "41": {
                "category": "Doanh nghiệp",
                "title": "Ba thao tác, mười giây xác thực: bớt một bước chờ ở sân bay",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-airport-biometric-kiosk-2026.webp",
                "imageAlt": "Hành khách được hướng dẫn xác thực khuôn mặt tại kiosk sinh trắc học sân bay"
            },
            "42": {
                "category": "Doanh nghiệp",
                "title": "Từ 15 phút giảm còn 1 phút 13 giây: Khi công nghệ số rút ngắn đường đi của mẫu xét nghiệm",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-hospital-pneumatic-sample-2026.webp",
                "imageAlt": "Điều dưỡng đưa hộp mẫu xét nghiệm có chip vào hệ thống ống khí nén"
            },
            "43": {
                "category": "Doanh nghiệp",
                "title": "AI - Cánh tay đắc lực giúp giáo viên hiểu học sinh hơn",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-ai-online-class-teacher-2026.webp",
                "imageAlt": "Giáo viên trực tuyến theo dõi mức độ tiếp thu của học sinh với trợ lý AI"
            },
            "44": {
                "category": "Người dân",
                "title": "Drone rời ruộng lúa bay vào cứu trợ vùng tâm lũ",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-flood-relief-drone-2026.webp",
                "imageAlt": "Nhóm tình nguyện điều khiển drone đưa nhu yếu phẩm vào khu dân cư bị ngập"
            },
            "45": {
                "category": "Người dân",
                "title": "Khi thổ cẩm không còn phụ thuộc vào bước chân du khách",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-brocade-online-orders-2026.webp",
                "imageAlt": "Phụ nữ Mông chụp ảnh và đóng gói sản phẩm thổ cẩm để bán trực tuyến"
            },
            "46": {
                "category": "Người dân",
                "title": "40 triệu đồng và một ứng dụng giao hàng cho quê nhà",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-local-delivery-startup-2026.webp",
                "imageAlt": "Nhà sáng lập trẻ kết nối cửa hàng và tài xế giao hàng tại đô thị ven biển"
            },
            "47": {
                "category": "Người dân",
                "title": "Tìm lại gương mặt liệt sĩ từ ký ức gia đình",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-martyr-photo-restoration-2026.webp",
                "imageAlt": "Gia đình cùng nhóm tình nguyện xem và góp ý bản phục dựng một bức ảnh cũ"
            },
            "48": {
                "category": "Người dân",
                "title": "Ba chiếc máy tính cũ trong kho và phòng tin học đầu tiên ở vùng biên",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-border-school-old-computers-2026.webp",
                "imageAlt": "Thầy giáo sửa máy tính cũ để học sinh vùng biên được thực hành tin học"
            },
            "49": {
                "category": "Người dân",
                "title": "Cô giáo Toán ở Thốt Nốt và hơn mười năm tự đổi cách dạy",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-teacher-digital-learning-2026.webp",
                "imageAlt": "Cô giáo hướng dẫn học sinh học Toán và kỹ năng sống bằng công cụ số"
            },
            "50": {
                "category": "Người dân",
                "title": "Khi trợ lý ảo hiểu được lời hỏi đời thường của người dân",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-rural-ai-procedure-assistant-2026.webp",
                "imageAlt": "Người dân vùng cao dùng điện thoại hỏi trợ lý ảo về thủ tục hành chính"
            },
            "51": {
                "category": "Người dân",
                "title": "Chuyển đổi số cấp xã bắt đầu từ một vấn đề rất cụ thể",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-commune-online-queue-2026.webp",
                "imageAlt": "Người dân lấy số trực tuyến trong khi công chức theo dõi hàng đợi tại trung tâm cấp xã"
            },
            "52": {
                "category": "Người dân",
                "title": "Số hóa chùa Keo và cả ký ức của làng Hành Thiện",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-keo-pagoda-digital-heritage-2026.webp",
                "imageAlt": "Nhóm nghiên cứu quét 3D chùa cổ và ghi lại lời kể của bậc cao niên"
            },
            "53": {
                "category": "Người dân",
                "title": "Khi người trẻ vùng cao tự kể văn hóa của bản mình trên mạng",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-highland-youth-culture-online-2026.webp",
                "imageAlt": "Người trẻ vùng cao tự quay video giới thiệu âm nhạc, ẩm thực và homestay"
            },
            "54": {
                "category": "Người dân",
                "title": "Khi người Suối Giàng xây kênh triệu view, chè quê đi xa hơn",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-suoigiang-tea-creator-2026.webp",
                "imageAlt": "Cô gái Mông quay video về chè Shan tuyết và nghề làm chè ở Suối Giàng"
            },
            "55": {
                "category": "Người dân",
                "title": "“Người gác đồi” của hai nữ sinh lớp 6, lớp 7",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-student-landslide-edge-ai-2026.webp",
                "imageAlt": "Hai nữ sinh thử nghiệm cảm biến và AI cảnh báo sạt lở trên mô hình đồi"
            },
            "56": {
                "category": "Người dân",
                "title": "Chuyển đổi số ở Na Chiềng: bắt đầu từ một tin nhắn",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-highland-village-digital-message-2026.webp",
                "imageAlt": "Trưởng bản trẻ dùng điện thoại trao đổi thông tin với người dân vùng cao"
            },
            "57": {
                "category": "Người dân",
                "title": "Người Việt tự dạy máy đọc di sản bằng công cụ của chính mình",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-hannom-ai-reader-2026.webp",
                "imageAlt": "Nhà nghiên cứu dùng điện thoại và máy tính bảng nhận dạng tư liệu Hán Nôm"
            },
            "58": {
                "category": "Người dân",
                "title": "Tự chủ AI bắt đầu từ khâu gán nhãn dữ liệu",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-ai-data-labeling-grid-2026.webp",
                "imageAlt": "Kỹ sư điện gán nhãn ảnh nhiệt để huấn luyện AI phát hiện nguy cơ trên lưới"
            },
            "59": {
                "category": "Người dân",
                "title": "Không còn phải xuống kho tìm bản vẽ giấy",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-water-network-gis-2026.webp",
                "imageAlt": "Kỹ sư cấp nước cùng dùng bản đồ GIS để tra cứu đường ống và đồng hồ"
            },
            "60": {
                "category": "Người dân",
                "title": "Một mã QR – điểm tựa lòng tin cho du khách quốc tế đến với Khánh Hòa",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-khanhhoa-tourist-qr-assistance-2026.webp",
                "imageAlt": "Du khách quốc tế quét mã QR để nhận hỗ trợ đa ngôn ngữ tại Khánh Hòa"
            },
            "61": {
                "category": "Người dân",
                "title": "Đánh giá 117 giáo viên: giảm từ 2–3 tuần còn 2–3 ngày",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-school-workflow-evaluation-2026.webp",
                "imageAlt": "Giáo viên vận hành hệ thống đánh giá và xử lý hồ sơ trực tuyến trong trường học"
            },
            "62": {
                "category": "Người dân",
                "title": "Drone giá rẻ nhưng chất lượng không hề rẻ",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-forest-lowcost-drone-mapping-2026.webp",
                "imageAlt": "Kiểm lâm dùng drone giá rẻ và điểm khống chế mặt đất để lập bản đồ rừng"
            },
            "63": {
                "category": "Người dân",
                "title": "Từ bài học STEM đến mô hình cảnh báo lũ và sạt lở",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-student-flood-landslide-warning-2026.webp",
                "imageAlt": "Ba học sinh thử mô hình cảm biến và camera AI cảnh báo lũ, sạt lở"
            },
            "64": {
                "category": "Người dân",
                "title": "Drone phun thuốc, mỗi héc ta tiết kiệm hơn 1 triệu đồng",
                "date": "Câu chuyện năm 2026",
                "image": "assets/images/story-rice-field-spraying-drone-2026.webp",
                "imageAlt": "Nông dân cùng vận hành drone phun thuốc trên cánh đồng lúa"
            }
        };
        function resetArticleModalScroll() {
            const modal = document.getElementById('articleModal');
            const articleBody = document.getElementById('articleModalBody');

            if (modal) modal.scrollTop = 0;
            if (articleBody) articleBody.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }

        window.__storyContents = window.__storyContents || Object.create(null);
        const articleContentLoads = new Map();
        let articleRequestId = 0;

        function loadArticleContent(id) {
            if (Object.prototype.hasOwnProperty.call(window.__storyContents, id)) {
                return Promise.resolve(window.__storyContents[id]);
            }
            if (articleContentLoads.has(id)) return articleContentLoads.get(id);

            const load = new Promise((resolve, reject) => {
                const script = document.createElement('script');
                const storyNumber = String(id).padStart(2, '0');
                script.src = `assets/data/stories/story-${storyNumber}.js`;
                script.async = true;
                script.onload = () => {
                    script.remove();
                    if (Object.prototype.hasOwnProperty.call(window.__storyContents, id)) {
                        resolve(window.__storyContents[id]);
                    } else {
                        reject(new Error(`Dữ liệu bài ${id} không hợp lệ`));
                    }
                };
                script.onerror = () => {
                    script.remove();
                    reject(new Error(`Không tải được dữ liệu bài ${id}`));
                };
                document.head.appendChild(script);
            }).finally(() => articleContentLoads.delete(id));

            articleContentLoads.set(id, load);
            return load;
        }

        async function openArticleModal(id) {
            const article = articlesData[id];
            if (!article) return;
            const requestId = ++articleRequestId;
            document.getElementById('modalCategory').innerText = article.category;
            document.getElementById('modalTitle').innerText = article.title;
            document.getElementById('modalDate').innerHTML = `<i class="fa-regular fa-calendar mr-1"></i> ${article.date}`;
            const modalImage = document.getElementById('modalImage');
            modalImage.src = article.image;
            modalImage.alt = article.imageAlt;
            const modalContent = document.getElementById('modalContent');
            modalContent.setAttribute('aria-busy', 'true');
            modalContent.innerHTML = `
                <div class="py-12 flex flex-col items-center justify-center gap-3 text-center text-[#2B2B2B]">
                    <i class="fa-solid fa-circle-notch fa-spin text-2xl text-[#FBAB18]" aria-hidden="true"></i>
                    <p class="font-semibold">Đang tải nội dung câu chuyện...</p>
                </div>
            `;
            resetArticleModalScroll();

            const modal = document.getElementById('articleModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';

            requestAnimationFrame(resetArticleModalScroll);

            try {
                const content = await loadArticleContent(id);
                if (requestId !== articleRequestId) return;
                modalContent.innerHTML = content;
                modalContent.removeAttribute('aria-busy');
                resetArticleModalScroll();
            } catch (error) {
                if (requestId !== articleRequestId) return;
                console.error(error);
                modalContent.removeAttribute('aria-busy');
                modalContent.innerHTML = `
                    <div class="py-10 px-4 flex flex-col items-center justify-center gap-4 text-center">
                        <i class="fa-solid fa-triangle-exclamation text-2xl text-[#FBAB18]" aria-hidden="true"></i>
                        <p class="text-[#2B2B2B] font-bold">Chưa tải được nội dung bài viết.</p>
                        <button id="retryArticleLoad" type="button" class="px-5 py-2.5 rounded-xl bg-[#FBAB18] text-[#7A0C12] text-sm font-extrabold hover:bg-[#E65925] transition-colors">Thử tải lại</button>
                    </div>
                `;
                document.getElementById('retryArticleLoad')?.addEventListener('click', () => openArticleModal(id), { once: true });
            }
        }

        function closeArticleModal() {
            articleRequestId += 1;
            const modal = document.getElementById('articleModal');
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
            resetArticleModalScroll();
            const libraryModal = document.getElementById('storiesLibraryModal');
            const libraryIsOpen = libraryModal && !libraryModal.classList.contains('hidden');
            document.body.style.overflow = libraryIsOpen ? 'hidden' : '';
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const articleModal = document.getElementById('articleModal');
                if (articleModal && !articleModal.classList.contains('hidden')) {
                    closeArticleModal();
                    return;
                }

                const libraryModal = document.getElementById('storiesLibraryModal');
                if (libraryModal && !libraryModal.classList.contains('hidden') && typeof window.closeStoriesLibrary === 'function') {
                    window.closeStoriesLibrary();
                }
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
            const inactiveClass = "min-w-0 flex-1 py-3.5 px-2 sm:px-6 rounded-xl text-[#FFF6E6] hover:text-white bg-transparent transition-all duration-300 flex items-center justify-center cursor-pointer select-none";
            const mainActiveClass = "min-w-0 flex-1 py-3.5 px-2 sm:px-6 rounded-xl text-[#7A0C12] bg-gradient-to-r from-[#FBAB18] via-[#FBAB18] to-[#FBAB18] shadow-[0_4px_20px_rgba(251,171,24,0.4)] transition-all duration-300 flex items-center justify-center cursor-pointer select-none";
            const secondaryActiveClass = "min-w-0 flex-1 py-3.5 px-2 sm:px-6 rounded-xl text-white bg-gradient-to-r from-[#E65925] to-[#B5121B] shadow-[0_4px_20px_rgba(230,89,37,0.4)] transition-all duration-300 flex items-center justify-center cursor-pointer select-none";

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
                    link.classList.add('text-[#FBAB18]', 'border-b-2', 'border-[#FBAB18]');
                    link.classList.remove('text-[#FFF6E6]');
                } else {
                    link.classList.remove('text-[#FBAB18]', 'border-b-2', 'border-[#FBAB18]');
                    link.classList.add('text-[#FFF6E6]');
                }
            });

            // Mobile Drawer Links Highlighting
            document.querySelectorAll('#mobileMenu a[href^="#"]').forEach(link => {
                if (link.getAttribute('href') === activeHref) {
                    link.classList.add('bg-[#B5121B]', 'text-[#FBAB18]', 'font-extrabold', 'border-l-4', 'border-[#FBAB18]');
                    link.classList.remove('text-white');
                } else {
                    link.classList.remove('bg-[#B5121B]', 'text-[#FBAB18]', 'font-extrabold', 'border-l-4', 'border-[#FBAB18]');
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
