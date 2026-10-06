document.addEventListener('DOMContentLoaded', function () {
            const storiesSplideElement = document.getElementById('storiesSplide');
            if (storiesSplideElement) {
                const storyList = storiesSplideElement.querySelector('.splide__list');
                const toggleWrap = document.getElementById('storiesToggleWrap');
                const toggleButton = document.getElementById('storiesToggle');
                const toggleLabel = document.getElementById('storiesToggleLabel');
                const toggleIcon = document.getElementById('storiesToggleIcon');
                const status = document.getElementById('storiesStatus');
                const previewPerCategory = 5;
                const allSlides = storyList ? Array.from(storyList.children) : [];
                const categoryCounts = new Map();
                const previewSlides = [];

                allSlides.forEach((slide) => {
                    const article = slide.querySelector('article[onclick^="openArticleModal("]');
                    const match = article && article.getAttribute('onclick').match(/openArticleModal\((\d+)\)/);
                    const story = match && typeof articlesData !== 'undefined' ? articlesData[Number(match[1])] : null;
                    const category = story ? story.category : 'Khác';
                    const count = categoryCounts.get(category) || 0;
                    categoryCounts.set(category, count + 1);
                    if (count < previewPerCategory) previewSlides.push(slide);
                });

                let expanded = false;
                let storiesSplide = null;

                function mountStories(slides) {
                    if (!storyList) return;
                    storyList.replaceChildren(...slides);
                    const hasMultipleStories = slides.length > 1;
                    storiesSplideElement.classList.toggle('max-w-xl', !hasMultipleStories);
                    storiesSplideElement.classList.toggle('mx-auto', !hasMultipleStories);
                    storiesSplide = new Splide('#storiesSplide', {
                        type: hasMultipleStories ? 'loop' : 'slide',
                        drag: 'free',
                        focus: 'center',
                        perPage: hasMultipleStories ? 3 : 1,
                        gap: 24,
                        pagination: false,
                        arrows: hasMultipleStories,
                        autoScroll: hasMultipleStories ? {
                            speed: 1.8,
                            pauseOnHover: true,
                            pauseOnFocus: false,
                            rewind: false
                        } : false,
                        breakpoints: {
                            640: { perPage: 1, gap: 16 },
                            1024: { perPage: 2, gap: 20 },
                            1280: { perPage: 3, gap: 24 }
                        }
                    });
                    storiesSplide.mount(window.splide.Extensions);
                }

                function updateToggle() {
                    if (!toggleWrap || !toggleButton || !toggleLabel || !status) return;
                    const visibleCount = expanded ? allSlides.length : previewSlides.length;
                    toggleWrap.classList.toggle('hidden', allSlides.length <= previewSlides.length);
                    toggleButton.setAttribute('aria-expanded', String(expanded));
                    toggleLabel.textContent = expanded ? 'Thu gọn danh sách' : 'Xem thêm câu chuyện';
                    status.textContent = expanded
                        ? `Đang hiển thị toàn bộ ${allSlides.length} câu chuyện.`
                        : `Đang hiển thị ${visibleCount} bài tiêu biểu.`;
                    if (toggleIcon) toggleIcon.classList.toggle('rotate-180', expanded);
                }

                mountStories(previewSlides);
                updateToggle();

                if (toggleButton) {
                    toggleButton.addEventListener('click', function () {
                        expanded = !expanded;
                        if (storiesSplide) storiesSplide.destroy(true);
                        mountStories(expanded ? allSlides : previewSlides);
                        updateToggle();
                        if (!expanded) storiesSplideElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    });
                }
            }

            // Partner Continuous Marquee Reel Splide Initialization
            const partnerSplideElement = document.getElementById('partnerSplide');
            if (partnerSplideElement) {
                const partnerSplide = new Splide('#partnerSplide', {
                    type: 'loop',
                    drag: 'free',
                    autoWidth: true,
                    gap: 20,
                    arrows: false,
                    pagination: false,
                    autoScroll: {
                        speed: 0.7,
                        pauseOnHover: true,
                        pauseOnFocus: false,
                        rewind: false
                    }
                });
                partnerSplide.mount(window.splide.Extensions);
            }
        });

        // Mobile Menu Navigation Toggle
        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            const icon = document.getElementById('mobileMenuIcon');
            if (menu && icon) {
                if (menu.classList.contains('hidden')) {
                    menu.classList.remove('hidden');
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    menu.classList.add('hidden');
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        }
