#!/usr/bin/env python3
"""SOME ASSEMBLY RAGE – synthesise royalty-free music + SFX for the pilot (no external assets).

Outputs video/public/flatpack/:
  music.wav            42.5 s score with mood sections (happy / tense / magic / stop), -26 LUFS
  sfx_*.wav            rip, ratchet, bonk, chunk, crash, thunder, scratch, pop, roll, whoosh, thunk
  babble_<who>.wav     cartoon gibberish voice loops (pitch per character), used under speech bubbles
"""
import json, subprocess, sys, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "video/public/flatpack"
TMP = ROOT / "temp"
OUT.mkdir(parents=True, exist_ok=True); TMP.mkdir(exist_ok=True)
SR = 48000
rng = np.random.default_rng(7)


def write(path, x, peak=0.9):
    x = np.asarray(x, dtype=float)
    m = np.max(np.abs(x)) or 1
    x = x / m * peak
    st = np.stack([x, x], 1) if x.ndim == 1 else x
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(st, -1, 1) * 32767).astype(np.int16).tobytes())


def lp(x, a):
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc += a * (v - acc); y[i] = acc
    return y


def hz(m): return 440 * 2 ** ((m - 69) / 12)
def T(d): return np.arange(int(SR * d)) / SR


# ---------------------------------------------------------------- instruments
def marimba(f, d=0.35):
    t = T(d)
    return (np.sin(2*np.pi*f*t) + 0.35*np.sin(2*np.pi*f*4*t)*np.exp(-t*30) + 0.15*np.sin(2*np.pi*f*10*t)*np.exp(-t*60)) * np.exp(-t*9)


def pizz(f, d=0.25):
    t = T(d)
    saw = 2 * ((f * t) % 1) - 1
    return lp(saw * np.exp(-t*16), 0.25)


def bass(f, d=0.3):
    t = T(d)
    return (np.sin(2*np.pi*f*t) + 0.4*np.sin(4*np.pi*f*t)) * np.exp(-t*7) * np.minimum(1, t/0.005)


def kick(d=0.25):
    t = T(d); return np.sin(2*np.pi*(45 + 110*np.exp(-t*35))*t) * np.exp(-t*14)


def clap(d=0.15):
    t = T(d); n = rng.standard_normal(len(t)); return (n - lp(n, 0.2)) * np.exp(-t*30)


def shaker(d=0.06):
    t = T(d); n = rng.standard_normal(len(t)); return (n - lp(n, 0.5)) * np.exp(-t*70) * 0.4


def wood(f=900, d=0.08):
    t = T(d); return np.sin(2*np.pi*f*t) * np.exp(-t*60)


def put(buf, s, at):
    a = int(at * SR)
    if a >= len(buf): return
    b = min(len(buf), a + len(s)); buf[a:b] += s[:b - a]


# ---------------------------------------------------------------- music
DUR, BPM = 42.5, 124
beat = 60 / BPM
SECTIONS = [(0, 10.4, "happy"), (10.4, 25.8, "tense"), (25.8, 27.2, "hush"), (27.2, 30.6, "magic"),
            (30.6, 34.0, "happy"), (34.0, 39.0, "stop"), (39.0, DUR, "happy")]
MUSIC_NAME = "music.wav"
if len(sys.argv) > 1:  # episode-specific score: scripts/flatpack_audio.py scripts/episodes/flatpack-ep2.json
    _ep = json.loads(Path(sys.argv[1]).read_text())
    SECTIONS = [tuple(x) for x in _ep["music"]]
    DUR = float(_ep.get("dur", DUR))
    MUSIC_NAME = f"music_{_ep['id']}.wav"
mus = np.zeros(int(SR * DUR))
HAPPY = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]]  # C G Am F
TENSE = [[57, 60, 64], [52, 56, 59]]                               # Am E


def sect(t):
    for a, b, k in SECTIONS:
        if a <= t < b: return k
    return "stop"


n8 = int(DUR / (beat / 2))
for k in range(n8):
    t0 = k * beat / 2
    s = sect(t0)
    barI = int(t0 / (beat * 4))
    st = k % 8
    if s == "happy":
        ch = HAPPY[barI % 4]
        seq = [ch[0], ch[1], ch[2], ch[1] + 12, ch[2], ch[1], ch[0] + 12, ch[2]]
        put(mus, 0.28 * marimba(hz(seq[st] + 12)), t0)
        if st % 2 == 0: put(mus, 0.4 * bass(hz(ch[0] - 24)), t0)
        if st in (0, 4): put(mus, 0.55 * kick(), t0)
        if st in (2, 6): put(mus, 0.22 * clap(), t0)
        put(mus, shaker(), t0); put(mus, shaker(), t0 + beat / 4)
    elif s == "tense":
        ch = TENSE[barI % 2]
        seq = [ch[0], ch[0], ch[2], ch[0], ch[1], ch[0], ch[2], ch[1]]
        put(mus, 0.32 * pizz(hz(seq[st])), t0)
        if st % 2 == 1: put(mus, 0.45 * bass(hz(ch[0] - 24), 0.18), t0)
        put(mus, 0.12 * wood(1200 if st % 2 else 800), t0)
        if st in (0, 4): put(mus, 0.5 * kick(), t0)
        if st == 7 and barI % 2: put(mus, 0.25 * clap(), t0)
    elif s == "magic":
        for j in range(4):
            m = [60, 64, 67, 71, 72, 76, 79, 83][(st * 4 + j) % 8] + 12 * ((k // 8) % 2)
            put(mus, 0.16 * marimba(hz(m + 12), 0.5), t0 + j * beat / 8)
# hush pad + magic pad
t = np.arange(len(mus)) / SR
pad = sum(np.sin(2*np.pi*hz(m)*t) for m in (60, 64, 67, 71))
env = np.zeros_like(t)
env[(t >= 25.8) & (t < 30.6)] = 1
env = lp(env, 0.0004)
mus += 0.05 * pad * env
fade = np.minimum(1, t / 0.3) * np.minimum(1, (DUR - t) / 0.8)
mus *= fade
write(TMP / "fp_music_raw.wav", mus)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(TMP / "fp_music_raw.wav"),
                "-af", "loudnorm=I=-26:TP=-6:LRA=11", "-ar", str(SR), str(OUT / MUSIC_NAME)], check=True)

# ---------------------------------------------------------------- sfx
def noise(d): return rng.standard_normal(int(SR * d))


t = T(0.5); n = noise(0.5)
write(OUT / "sfx_rip.wav", (n - lp(n, 0.15)) * (np.abs(np.sin(t * 160)) ** 0.5) * np.exp(-t * 4) * np.minimum(1, t / 0.02), 0.6)

rat = np.zeros(int(SR * 0.9))
for i in range(14):
    put(rat, 0.8 * wood(2400 + (i % 2) * 400, 0.03) + 0.3 * shaker(0.03), i * 0.06)
write(OUT / "sfx_ratchet.wav", rat, 0.55)

t = T(0.35)
write(OUT / "sfx_bonk.wav", np.sin(2*np.pi*(700*np.exp(-t*12) + 160)*t) * np.exp(-t*14) + 0.4*wood(500, 0.35), 0.8)

t = T(0.3)
ch = np.sin(2*np.pi*(120 + 300*np.exp(-t*40))*t) * np.exp(-t*18) + 0.5 * wood(1500, 0.3) + 0.3 * (noise(0.3) * np.exp(-t*50))
write(OUT / "sfx_chunk.wav", ch, 0.85)

crash = np.zeros(int(SR * 1.6))
for i in range(16):
    at = 0.03 * i + rng.random() * 0.25 + (0 if i < 6 else 0.25)
    put(crash, (0.5 + rng.random()) * wood(250 + rng.random() * 900, 0.25) * 2, at)
cn = noise(1.6); tt = T(1.6)
crash += 0.6 * lp(cn, 0.08) * np.exp(-tt * 3)
put(crash, 1.2 * kick(0.4), 0)
write(OUT / "sfx_crash.wav", crash, 0.95)

tt = T(2.2); tn = noise(2.2)
thunder = lp(tn, 0.01) * 12 * np.exp(-tt * 1.4) * (1 + 0.6 * np.sin(tt * 9)) + (tn - lp(tn, 0.3)) * np.exp(-tt * 30) * 0.8
write(OUT / "sfx_thunder.wav", thunder, 0.9)

tt = T(0.7)
f = 500 + 350 * np.sin(tt * 14) * np.exp(-tt * 2)
ph = np.cumsum(f) / SR
scratch = (2 * (ph % 1) - 1) * 0.6 + (noise(0.7) - lp(noise(0.7), 0.3)) * 0.3
write(OUT / "sfx_scratch.wav", lp(scratch, 0.35) * np.exp(-tt * 2.5), 0.7)

tt = T(0.15)
write(OUT / "sfx_pop.wav", np.sin(2*np.pi*(1100*np.exp(-tt*25) + 300)*tt) * np.exp(-tt*35), 0.5)

roll = np.zeros(int(SR * 1.0))
for i in range(18):
    put(roll, wood(3000 + rng.random() * 1500, 0.02), i * 0.055)
write(OUT / "sfx_roll.wav", roll, 0.35)

tt = T(0.6); wn = noise(0.6)
env = np.sin(np.pi * tt / 0.6) ** 2
write(OUT / "sfx_whoosh.wav", (lp(wn, 0.05) * (1 - tt / 0.6) * 3 + (wn - lp(wn, 0.3)) * tt / 0.6 * 0.5) * env, 0.45)

tt = T(0.9)
thunk = 1.6 * kick(0.9) + lp(noise(0.9), 0.05) * np.exp(-tt * 6) * 3 + wood(180, 0.9) * 0.8
write(OUT / "sfx_thunk.wav", thunk, 0.95)

tt = T(1.2)  # magic shimmer
sh = sum(np.sin(2*np.pi*hz(84 + i * 3)*tt) * np.exp(-((tt - i * 0.07) ** 2) * 200) for i in range(14))
write(OUT / "sfx_shimmer.wav", sh, 0.5)

# ---------------------------------------------------------------- babble voices
PITCH = {"duke": 165, "pia": 290, "gus": 105, "lotta": 220, "alvin": 420, "lefty": 520}
for who, p in PITCH.items():
    out = np.zeros(int(SR * 3.0)); pos = 0.0
    while pos < 2.9:
        d = 0.07 + rng.random() * 0.08
        tt = T(d)
        f0 = p * (0.85 + rng.random() * 0.35)
        vib = np.sin(2*np.pi*f0*tt + 0.6*np.sin(2*np.pi*6*tt))
        formant = np.sin(2*np.pi*f0*(2 + rng.integers(0, 3))*tt) * 0.5
        syl = (np.sign(vib) * 0.3 + vib * 0.7 + formant) * np.sin(np.pi * tt / d) ** 1.5
        put(out, lp(syl, 0.3 if p < 200 else 0.45), pos)
        pos += d + (0.02 if rng.random() > 0.15 else 0.12)
    write(OUT / f"babble_{who}.wav", out, 0.5)

# burp (low formant croak) + referee whistle
tt = T(0.7)
f0 = 70 + 25 * np.sin(tt * 30) * np.exp(-tt * 2)
ph = np.cumsum(f0) / SR
src = np.sign(np.sin(2 * np.pi * ph)) * 0.6 + np.sin(2 * np.pi * ph * 3) * 0.3
write(OUT / "sfx_burp.wav", lp(src, 0.06) * np.sin(np.pi * np.minimum(1, tt / 0.7)) ** 0.6 * (1 + 0.5 * np.sin(tt * 55)), 0.9)
tt = T(0.9)
wh = np.sin(2 * np.pi * (2900 + 180 * np.sign(np.sin(2 * np.pi * 28 * tt))) * tt) * np.minimum(1, tt / 0.02) * np.minimum(1, (0.9 - tt) / 0.05)
write(OUT / "sfx_whistle.wav", wh + 0.2 * noise(0.9) * np.exp(-tt * 3), 0.5)
print("flatpack audio ok")
