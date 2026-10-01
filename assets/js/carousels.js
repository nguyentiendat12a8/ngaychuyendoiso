document.addEventListener('DOMContentLoaded', function () {
            const storiesSplideElement = document.getElementById('storiesSplide');
            if (storiesSplideElement) {
                const storiesSplide = new Splide('#storiesSplide', {
                    type: 'loop',
                    drag: 'free',
                    focus: 'center',
                    perPage: 3,
                    gap: 24,
                    pagination: false,
                    arrows: true,
                    autoScroll: {
                        speed: 0.6,
                        pauseOnHover: true,
                        pauseOnFocus: false,
                        rewind: false
                    },
                    breakpoints: {
                        640: { perPage: 1, gap: 16 },
                        1024: { perPage: 2, gap: 20 },
                        1280: { perPage: 3, gap: 24 }
                    }
                });
                storiesSplide.mount(window.splide.Extensions);
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
