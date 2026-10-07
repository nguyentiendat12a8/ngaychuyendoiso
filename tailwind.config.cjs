module.exports = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Be Vietnam Pro', 'sans-serif'],
                    },
                    colors: {
                        brand: {
                            a1: '#7A0C12', // B2 Đỏ trầm
                            a2: '#B5121B', // B1 Đỏ son
                            a3: '#E65925', // B5 Cam đất
                            a4: '#FBAB18', // B4 Vàng nghệ
                            a5: '#E65925', // B5 Cam đất
                            a6: '#FFF6E6', // B3 Kem
                            subtext: '#FFF6E6' // Chữ sáng trên nền đỏ
                        }
                    },
                    animation: {
                        'float': 'float 9s ease-in-out infinite',
                        'float-delayed': 'float 9s ease-in-out 4.5s infinite',
                        'pulse-glow': 'pulseGlow 5s ease-in-out infinite',
                        'shimmer': 'shimmer 8s infinite linear',
                    },
                    keyframes: {
                        float: {
                            '0%, 100%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-12px)' },
                        },
                        pulseGlow: {
                            '0%, 100%': { opacity: '0.3', filter: 'blur(30px)' },
                            '50%': { opacity: '0.7', filter: 'blur(45px)' },
                        },
                        shimmer: {
                            '0%': { backgroundPosition: '-200% 0' },
                            '100%': { backgroundPosition: '200% 0' },
                        }
                    }
                }
            }
        };
module.exports.content = ["./index.html", "./assets/js/*.js"];
