with open(r'D:\CDSQG\Công việc ngày 1010\source\styles\tailwind.css', 'r', encoding='utf-8') as f:
    content = f.read()

new_styles = """
        /* Animation 3 Vòng Vẽ Cùng Lúc & Lõi Logo Xuất Hiện Cuối Cùng */
        .ring-v3-anim {
            stroke-dasharray: 1600;
            stroke-dashoffset: 1600;
            animation: ringDrawArc 1.3s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards;
        }

        .ring-v2-anim {
            stroke-dasharray: 2500;
            stroke-dashoffset: 2500;
            animation: ringDrawArc 1.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards;
        }

        .ring-v1-anim {
            stroke-dasharray: 3400;
            stroke-dashoffset: 3400;
            animation: ringDrawArc 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards;
        }

        .ring-pill-anim {
            stroke-dasharray: 500;
            stroke-dashoffset: 500;
            animation: ringDrawArc 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards;
        }

        .ring-core-anim {
            transform-origin: 1600px 580px;
            animation: corePopIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 1.3s both;
        }

        .badge-v3-pop {
            animation: badgePopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 1.2s both;
        }

        .badge-v2-pop {
            animation: badgePopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 1.3s both;
        }

        .badge-v1-pop {
            animation: badgePopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 1.4s both;
        }

        @keyframes ringDrawArc {
            0% {
                stroke-dashoffset: 3400;
                opacity: 0.2;
            }
            100% {
                stroke-dashoffset: 0;
                opacity: 1;
            }
        }

        @keyframes corePopIn {
            0% {
                opacity: 0;
                transform: scale(0) rotate(-45deg);
            }
            75% {
                opacity: 1;
                transform: scale(1.15) rotate(5deg);
            }
            100% {
                opacity: 1;
                transform: scale(1) rotate(0deg);
            }
        }

        @keyframes badgePopIn {
            0% {
                opacity: 0;
                transform: translateY(16px) scale(0.7);
            }
            70% {
                opacity: 1;
                transform: translateY(-3px) scale(1.05);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
"""

idx = content.find("/* Animation")
if idx != -1:
    content_updated = content[:idx] + new_styles.strip() + "\n"
    with open(r'D:\CDSQG\Công việc ngày 1010\source\styles\tailwind.css', 'w', encoding='utf-8') as f:
        f.write(content_updated)
    print("Updated tailwind.css simultaneous animation styles successfully!")
else:
    print("Pattern not found in tailwind.css")
