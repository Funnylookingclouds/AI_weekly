#!/usr/bin/env python3
"""Cut presenter characters out of the channel's character art (owner-supplied).

- Full-body stickers on a flat grey background: flood-fill keying from the borders.
- Expression heads on character sheets (busy photo background): GrabCut seeded with a
  rectangle, holes filled, shirt recovered via convex hull minus grey-rock pixels.
Outputs transparent PNGs to video/public/chars/.
Usage: python3 -I scripts/cutout_characters.py <uploads_dir>
"""
import sys
from pathlib import Path
import cv2
import numpy as np

SRC = Path(sys.argv[1])
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "video/public/chars"
OUT.mkdir(parents=True, exist_ok=True)


def save_rgba(img_bgr, mask, name, pad=6):
    ys, xs = np.where(mask > 0)
    y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad, mask.shape[0])
    x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad, mask.shape[1])
    a = cv2.GaussianBlur(mask, (3, 3), 0)
    rgba = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2BGRA)
    rgba[:, :, 3] = a
    cv2.imwrite(str(OUT / name), rgba[y0:y1, x0:x1])
    print(name, x1 - x0, y1 - y0)


def key_flat(fname, name):
    img = cv2.imread(str(SRC / fname))
    h, w = img.shape[:2]
    ff = np.zeros((h + 2, w + 2), np.uint8)
    flags = 4 | cv2.FLOODFILL_MASK_ONLY | cv2.FLOODFILL_FIXED_RANGE | (255 << 8)
    for seed in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]:
        cv2.floodFill(img, ff, seed, 0, (14, 14, 14), (14, 14, 14), flags)
    bg = ff[1:-1, 1:-1]
    mask = np.where(bg > 0, 0, 255).astype(np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    # keep largest component
    n, lab, stats, _ = cv2.connectedComponentsWithStats(mask)
    k = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
    mask = np.where(lab == k, 255, 0).astype(np.uint8)
    save_rgba(img, mask, name)


def head(img, rect, name, lower=1.0):
    x, y, w, h = rect
    H, W = img.shape[:2]
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

# Rune Jr. – full body + expression heads (from his character sheet)
key_flat("e3f1d2ee-image.jpg", "runejr_body.png")
sheet = cv2.imread(str(SRC / "3af66d13-image.jpg"))
head(sheet, (300, 690, 440, 396), "runejr_head_watch.png")
head(sheet, (775, 700, 470, 386), "runejr_head_think.png", 0.6)
head(sheet, (1300, 680, 440, 406), "runejr_head_smile.png", 0.62)
