#!/usr/bin/env python3
"""Generate voiceover via ElevenLabs with word-level timestamps.

Outputs:
  temp/voiceover_raw.mp3      raw TTS audio
  temp/words.json             [{word, display, start, end, segment, keyword}]
  output/voiceover.mp3        loudness-normalised (-14 LUFS)

The API key is injected by the session's network proxy; set ELEVENLABS_API_KEY
locally if running elsewhere.
"""
import base64, json, os, re, subprocess, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ep = json.loads((ROOT / "scripts/episode.json").read_text())
(ROOT / "temp").mkdir(exist_ok=True)
(ROOT / "output").mkdir(exist_ok=True)

seg_texts = [s["tts"] for s in ep["segments"]]
text = " ".join(seg_texts)

body = json.dumps({
    "text": text,
    "model_id": ep["model_id"],
    "language_code": ep.get("language", "en"),
    "voice_settings": {"stability": 0.4, "similarity_boost": 0.8, "style": 0.35,
                       "use_speaker_boost": True, "speed": ep["speed"]},
}).encode()
req = urllib.request.Request(
    f"https://api.elevenlabs.io/v1/text-to-speech/{ep['voice_id']}/with-timestamps",
    data=body,
    headers={"Content-Type": "application/json",
             "xi-api-key": os.environ.get("ELEVENLABS_API_KEY", "proxy-injected")},
)
with urllib.request.urlopen(req, timeout=180) as r:
    data = json.load(r)

raw = ROOT / "temp/voiceover_raw.mp3"
raw.write_bytes(base64.b64decode(data["audio_base64"]))
al = data.get("normalized_alignment") or data["alignment"]
chars, starts, ends = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]

# Map character offsets to segment index
seg_bounds, pos = [], 0
for i, t in enumerate(seg_texts):
    seg_bounds.append((pos, pos + len(t), ep["segments"][i]["id"]))
    pos += len(t) + 1

def seg_at(i):
    for a, b, sid in seg_bounds:
        if a <= i < b + 1:
            return sid
    return seg_bounds[-1][2]

kw = {k.lower() for k in ep["keywords"]}
dmap = ep["display_map"]
words, cur, cs, ce, ci = [], "", None, None, 0
for i, ch in enumerate(chars + [" "]):
    if ch.isspace():
        if cur.strip("–-—"):
            clean = re.sub(r"[^\wåäöÅÄÖ:]", "", cur).rstrip(":")
            base = clean.lower()
            disp = cur
            if base in dmap:
                disp = re.sub(re.escape(clean), dmap[base], cur, flags=re.I)
            words.append({"word": cur, "display": disp, "start": round(cs, 3), "end": round(ce, 3),
                          "segment": seg_at(ci), "keyword": base in kw or base.split(":")[0] in kw})
        cur, cs = "", None
    else:
        if cs is None:
            cs, ci = starts[i], i
        cur += ch
        ce = ends[i]

(ROOT / "temp/words.json").write_text(json.dumps(words, ensure_ascii=False, indent=1))

subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw),
                "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000",
                "-b:a", "192k", str(ROOT / "output/voiceover.mp3")], check=True)
print(f"{len(words)} words, duration {words[-1]['end']:.2f}s")
