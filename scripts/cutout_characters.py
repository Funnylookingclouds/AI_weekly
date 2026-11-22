#!/usr/bin/env python3
"""Cut the AI Bounce presenters (Rune, Ture, Saga, Cara) out of the owner's character art.

- Full-body stickers on a flat grey background: flood-fill keying from the borders.
- Stickers on character sheets (busy photo background): GrabCut seeded with a rectangle,
  holes filled, then the lower part completed with the convex hull minus pixels that
  look like the local background (colours sampled just outside the rectangle).
Outputs transparent PNGs to video/public/chars/<name>_<pose>.png
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

# source files (uploaded by the channel owner)
BODY = {"rune": "e3f1d2ee", "ture": "1969236a", "saga": "876e73d4", "cara": "1c79c8cf"}
SHEET = {"rune": "3af66d13", "ture": "f6e4bff3", "saga": "20a2d2c6", "cara": "223160b6"}
# sticker rectangles on each sheet (x, y, w, h), lower = where hull completion starts
STICKERS = {
    "rune": {},  # heads: scripts/cutout_rune_heads.py (rock-tuned variant gives cleaner edges)
    "ture": {"laugh": (440, 690, 340, 396, 0.6),
             "phone": (775, 690, 400, 396, 0.6), "watch": (1185, 690, 400, 396, 0.6)},
    "saga": {"smile": (395, 670, 380, 416, 0.6),
             "watch": (745, 670, 520, 416, 0.6), "surprised": (1255, 670, 400, 416, 0.6)},
    "cara": {"laugh": (555, 740, 390, 346, 0.55),
             "smile": (935, 740, 380, 346, 0.55), "watch": (1310, 740, 420, 346, 0.55)},
}


def save_rgba(img, mask, name, pad=4):
    ys, xs = np.where(mask > 0)
    y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad, mask.shape[0])
    x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad, mask.shape[1])
    rgba = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
    rgba[:, :, 3] = cv2.GaussianBlur(mask, (5, 5), 0)
    cv2.imwrite(str(OUT / name), rgba[y0:y1, x0:x1])
    print(name, x1 - x0, y1 - y0)


def largest(m):
    n, lab, stats, _ = cv2.connectedComponentsWithStats(m)
    return np.where(lab == 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA]), 255, 0).astype(np.uint8)


def key_flat(fname, name):
    img = cv2.imread(str(SRC / f"{fname}-image.jpg"))
    h, w = img.shape[:2]
    ff = np.zeros((h + 2, w + 2), np.uint8)
    flags = 4 | cv2.FLOODFILL_MASK_ONLY | cv2.FLOODFILL_FIXED_RANGE | (255 << 8)
    for seed in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]:
        cv2.floodFill(img, ff, seed, 0, (14, 14, 14), (14, 14, 14), flags)
    mask = np.where(ff[1:-1, 1:-1] > 0, 0, 255).astype(np.uint8)
    mask = largest(cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8)))
    save_rgba(img, mask, name)


def sticker(img, rect, name):
    x, y, w, h, lower = rect
    H, W = img.shape[:2]
    gm = np.zeros((H, W), np.uint8)
    cv2.grabCut(img, gm, (x, y, w, h), np.zeros((1, 65)), np.zeros((1, 65)), 8, cv2.GC_INIT_WITH_RECT)
    m = largest(cv2.morphologyEx(np.where((gm == 1) | (gm == 3), 255, 0).astype(np.uint8)[y:y + h, x:x + w],
                                 cv2.MORPH_CLOSE, np.ones((11, 11), np.uint8)))
    # close along image bottom (stickers are cut by the sheet edge) and fill holes
    bar = m.copy()
    if y + h >= H - 2:
        xs = np.where(m[-12:, :].max(axis=0) > 0)[0]
        if len(xs):
            bar[-3:, xs.min():xs.max() + 1] = 255
    fill = bar.copy(); ff = np.zeros((h + 2, w + 2), np.uint8)
    for seed in [(0, 0), (w - 1, 0), (0, h // 3), (w - 1, h // 3)]:
        if fill[seed[1], seed[0]] == 0:
            cv2.floodFill(fill, ff, seed, 128)
    m = np.where(fill == 128, 0, 255).astype(np.uint8)
    if lower < 1.0:
        cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        hull = np.zeros_like(m)
        cv2.drawContours(hull, [cv2.convexHull(max(cnts, key=cv2.contourArea))], -1, 255, cv2.FILLED)
        hull[: int(h * lower)] = 0
        # background colour model: pixels outside the GrabCut mask but inside the rect
        roi = img[y:y + h, x:x + w].astype(np.float32)
        bgpix = roi[(m == 0)]
        if len(bgpix) > 200:
            k = 6
            _, _, centers = cv2.kmeans(bgpix[np.random.default_rng(0).choice(len(bgpix), min(len(bgpix), 6000), replace=False)],
                                       k, None, (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 1.0), 3, cv2.KMEANS_PP_CENTERS)
            d = np.min(np.linalg.norm(roi[:, :, None, :] - centers[None, None, :, :], axis=3), axis=2)
            bglike = d < 26
        else:
            bglike = np.zeros(m.shape, bool)
        add = np.where(bglike, 0, hull).astype(np.uint8)
        add = cv2.morphologyEx(add, cv2.MORPH_OPEN, np.ones((7, 7), np.uint8))
        m = largest(cv2.morphologyEx(cv2.bitwise_or(m, add), cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8)))
    full = np.zeros((H, W), np.uint8); full[y:y + h, x:x + w] = m
    save_rgba(img, full, name, pad=0)


if __name__ == "__main__":
    only = sys.argv[2:] or list(BODY)
    for c in only:
        key_flat(BODY[c], f"{c}_body.png")
        sheet = cv2.imread(str(SRC / f"{SHEET[c]}-image.jpg"))
        for pose, rect in STICKERS[c].items():
            sticker(sheet, rect, f"{c}_{pose}.png")
