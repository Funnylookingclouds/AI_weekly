import sys
from pathlib import Path
import cv2
import numpy as np

SRC = Path(sys.argv[1]); OUT = Path(sys.argv[2])
img = cv2.imread(str(SRC / "3af66d13-image.jpg"))
H, W = img.shape[:2]

def head(rect, name, lower=1.0):
    x, y, w, h = rect
    gm = np.zeros((H, W), np.uint8)
    bgd, fgd = np.zeros((1, 65)), np.zeros((1, 65))
    cv2.grabCut(img, gm, rect, bgd, fgd, 8, cv2.GC_INIT_WITH_RECT)
    m = np.where((gm == 1) | (gm == 3), 255, 0).astype(np.uint8)[y:y + h, x:x + w]
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((11, 11), np.uint8))
    n, lab, stats, _ = cv2.connectedComponentsWithStats(m)
    m = np.where(lab == 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA]), 255, 0).astype(np.uint8)
    # close the sticker along the image bottom between its outer edges
    bot = m[-12:, :].max(axis=0)
    xs = np.where(bot > 0)[0]
    bar = m.copy()
    if len(xs):
        bar[-3:, xs.min():xs.max() + 1] = 255
    fill = bar.copy(); ff = np.zeros((h + 2, w + 2), np.uint8)
    for seed in [(0, 0), (w - 1, 0), (0, h // 3), (w - 1, h // 3)]:
        if fill[seed[1], seed[0]] == 0:
            cv2.floodFill(fill, ff, seed, 128)
    m = np.where(fill == 128, 0, 255).astype(np.uint8)
    # shoulders/shirt: fill the convex hull in the lower part of the sticker
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    hull = np.zeros_like(m); cv2.drawContours(hull, [cv2.convexHull(max(cnts, key=cv2.contourArea))], -1, 255, cv2.FILLED)
    hull[: int(h * lower)] = 0
    roi = img[y:y + h, x:x + w].astype(int)
    B, G, R = roi[:, :, 0], roi[:, :, 1], roi[:, :, 2]
    v = roi.max(axis=2)
    rock = (np.abs(R - G) < 16) & (np.abs(G - B) < 18) & (v > 55) & (v < 210) & ~(B > R + 6)
    add = np.where(rock, 0, hull).astype(np.uint8)
    add = cv2.morphologyEx(add, cv2.MORPH_OPEN, np.ones((7, 7), np.uint8))
    m = cv2.bitwise_or(m, add)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    n, lab, stats, _ = cv2.connectedComponentsWithStats(m)
    m = np.where(lab == 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA]), 255, 0).astype(np.uint8)
    full = np.zeros((H, W), np.uint8); full[y:y + h, x:x + w] = m
    ys, xs2 = np.where(full > 0)
    y0, y1, x0, x1 = ys.min(), ys.max(), xs2.min(), xs2.max()
    a = cv2.GaussianBlur(full, (5, 5), 0)
    rgba = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA); rgba[:, :, 3] = a
    cv2.imwrite(str(OUT / name), rgba[y0:y1 + 1, x0:x1 + 1])
    print(name, x1 - x0, y1 - y0)

head((300, 690, 440, 396), "rune_watch.png")
head((775, 700, 470, 386), "rune_think.png", 0.6)
head((1300, 680, 440, 406), "rune_smile.png", 0.62)
