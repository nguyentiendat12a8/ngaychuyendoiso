module.exports = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Be Vietnam Pro', 'sans-serif'],
                    },
                    colors: {
                        brand: {
                            a1: '#0B1B4D', // Chàm đêm (Nền chính)
                            a2: '#13307A', // Chàm sâu (Gradient nền)
                            a3: '#2F6BFF', // Xanh tín hiệu
                            a4: '#FFC21A', // Vàng nắng
                            a5: '#F7931E', // Cam ấm
                            a6: '#F4F1EA', // Ngà (Nền sáng)
                            subtext: '#C9D3F0' // Xanh xám nhạt
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
