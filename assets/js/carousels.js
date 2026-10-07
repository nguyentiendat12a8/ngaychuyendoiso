document.addEventListener('DOMContentLoaded', function () {
            const storiesSplideElement = document.getElementById('storiesSplide');
            if (storiesSplideElement) {
                const storyList = storiesSplideElement.querySelector('.splide__list');
                const toggleWrap = document.getElementById('storiesToggleWrap');
                const toggleButton = document.getElementById('storiesToggle');
                const toggleLabel = document.getElementById('storiesToggleLabel');
                const status = document.getElementById('storiesStatus');
                const libraryModal = document.getElementById('storiesLibraryModal');
                const libraryBody = document.getElementById('storiesLibraryBody');
                const libraryGrid = document.getElementById('storiesLibraryGrid');
                const libraryCount = document.getElementById('storiesLibraryCount');
                const previewPerCategory = 5;
                const allSlides = storyList ? Array.from(storyList.children) : [];
                const categoryCounts = new Map();
                const previewSlides = [];

                allSlides.forEach((slide) => {
                    const article = slide.querySelector('article[data-story-id]');
                    const storyId = article ? Number(article.dataset.storyId) : 0;
                    const story = storyId && typeof articlesData !== 'undefined' ? articlesData[storyId] : null;
                    const category = story ? story.category : 'Khác';
                    const count = categoryCounts.get(category) || 0;
                    categoryCounts.set(category, count + 1);
                    if (article && story) {
                        article.setAttribute('role', 'button');
                        article.setAttribute('tabindex', '0');
                        article.setAttribute('aria-label', `Đọc bài: ${story.title}`);
                    }
                    if (count < previewPerCategory) previewSlides.push(slide);
                });

                let storiesSplide = null;
                let libraryBuilt = false;

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
                        autoScroll: hasMultipleStories && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? {
                            speed: 1.5,
                            pauseOnHover: true,
                            pauseOnFocus: true,
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

                function buildStoryLibrary() {
                    if (!libraryGrid || libraryBuilt) return;
                    const fragment = document.createDocumentFragment();
                    let cardCount = 0;

                    allSlides.forEach((slide) => {
                        const sourceArticle = slide.querySelector('article[data-story-id]');
                        if (!sourceArticle) return;

                        const wrapper = document.createElement('div');
                        wrapper.className = 'min-w-0 h-full';
                        const article = sourceArticle.cloneNode(true);
                        const title = article.querySelector('h3')?.textContent.trim() || 'Câu chuyện chuyển đổi số';
                        article.setAttribute('role', 'button');
                        article.setAttribute('tabindex', '0');
                        article.setAttribute('aria-label', `Đọc bài: ${title}`);
                        wrapper.appendChild(article);
                        fragment.appendChild(wrapper);
                        cardCount += 1;
                    });

                    libraryGrid.replaceChildren(fragment);
                    libraryBuilt = true;
                    if (libraryCount) libraryCount.textContent = `${cardCount} câu chuyện`;
                }

                window.openStoriesLibrary = function () {
                    if (!libraryModal) return;
                    buildStoryLibrary();
                    libraryModal.classList.remove('hidden');
                    libraryModal.classList.add('flex');
                    if (toggleButton) toggleButton.setAttribute('aria-expanded', 'true');
                    document.body.style.overflow = 'hidden';
                    if (libraryBody) libraryBody.scrollTo({ top: 0, left: 0, behavior: 'auto' });
                    requestAnimationFrame(() => document.getElementById('storiesLibraryClose')?.focus({ preventScroll: true }));
                };

                window.closeStoriesLibrary = function () {
                    if (!libraryModal) return;
                    libraryModal.classList.add('hidden');
                    libraryModal.classList.remove('flex');
                    if (toggleButton) toggleButton.setAttribute('aria-expanded', 'false');
                    const articleModal = document.getElementById('articleModal');
                    if (!articleModal || articleModal.classList.contains('hidden')) document.body.style.overflow = '';
                    toggleButton?.focus({ preventScroll: true });
                };

                function updateLibraryButton() {
                    if (!toggleWrap || !toggleButton || !toggleLabel || !status) return;
                    toggleWrap.classList.toggle('hidden', allSlides.length <= previewSlides.length);
                    toggleButton.setAttribute('aria-expanded', 'false');
                    toggleLabel.textContent = 'Xem thêm câu chuyện';
                    status.textContent = `Đang hiển thị ${previewSlides.length} bài tiêu biểu.`;
                }

                mountStories(previewSlides);
                updateLibraryButton();

                if (toggleButton) {
                    toggleButton.addEventListener('click', window.openStoriesLibrary);
                }

                document.addEventListener('click', (event) => {
                    const card = event.target.closest('article[data-story-id]');
                    if (!card) return;
                    openArticleModal(Number(card.dataset.storyId));
                });

                document.addEventListener('keydown', (event) => {
                    if (event.key !== 'Enter' && event.key !== ' ') return;
                    const card = event.target.closest('article[data-story-id]');
                    if (!card) return;
                    event.preventDefault();
                    openArticleModal(Number(card.dataset.storyId));
                });

                document.getElementById('storiesLibraryClose')?.addEventListener('click', window.closeStoriesLibrary);
                libraryModal?.addEventListener('click', (event) => {
                    if (event.target === libraryModal) window.closeStoriesLibrary();
                });
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
                    autoScroll: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? false : {
                        speed: 0.7,
                        pauseOnHover: true,
                        pauseOnFocus: true,
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
            const button = document.getElementById('mobileMenuButton');
            if (menu && icon) {
                if (menu.classList.contains('hidden')) {
                    menu.classList.remove('hidden');
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                    button?.setAttribute('aria-expanded', 'true');
                    button?.setAttribute('aria-label', 'Đóng menu điều hướng');
                } else {
                    menu.classList.add('hidden');
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                    button?.setAttribute('aria-expanded', 'false');
                    button?.setAttribute('aria-label', 'Mở menu điều hướng');
                }
            }
        }

        document.addEventListener('DOMContentLoaded', function () {
            document.getElementById('mobileMenuButton')?.addEventListener('click', toggleMobileMenu);
            document.querySelectorAll('#mobileMenu a').forEach((link) => {
                link.addEventListener('click', () => {
                    if (!document.getElementById('mobileMenu')?.classList.contains('hidden')) toggleMobileMenu();
                });
            });
        });
