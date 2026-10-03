import numpy as np

def cubic_bezier_length(p0, p1, p2, p3, steps=100):
    t = np.linspace(0, 1, steps)
    # B(t) = (1-t)^3 p0 + 3(1-t)^2 t p1 + 3(1-t) t^2 p2 + t^3 p3
    pts = np.zeros((steps, 2))
    for i in range(steps):
        ti = t[i]
        pts[i] = ((1-ti)**3 * p0 + 
                  3*(1-ti)**2 * ti * p1 + 
                  3*(1-ti) * ti**2 * p2 + 
                  ti**3 * p3)
    diffs = np.diff(pts, axis=0)
    lens = np.sqrt((diffs**2).sum(axis=1))
    return lens.sum()

# vong-1:
# M1361.7,258.7
# c177.4-131.6, 428-94.4, 559.6,83 -> p1 = p0 + (177.4, -131.6), p2 = p0 + (428, -94.4), p3 = p0 + (559.6, 83)
# s94.4,428, -83,559.6 -> p1 = 2*p3_prev - p2_prev, p2 = p3_prev + (94.4, 428), p3 = p3_prev + (-83, 559.6)
# s-428,94.4, -559.6,-83
# c-60.5-81.6, -87.7-183.1, -76.1-284

# Since stroke-dasharray can use a safe value larger than path length (e.g. 3500 for vong-1, 2500 for vong-2, 1800 for vong-3, 500 for doan-nhan), let's verify exact lengths!

# vong-1: radius ~ 470 -> circumference ~ 2 * pi * 470 * (315/360) ≈ 2580
# vong-2: radius ~ 340 -> circumference ~ 2 * pi * 340 * (320/360) ≈ 1900
# vong-3: radius ~ 210 -> circumference ~ 2 * pi * 210 * (311/360) ≈ 1140
# doan-nhan: radius ~ 530 -> arc ~ 2 * pi * 530 * (20/360) ≈ 185

print("Approx path lengths:")
print("vong-1:", 2580)
print("vong-2:", 1900)
print("vong-3:", 1140)
print("doan-nhan:", 185)
