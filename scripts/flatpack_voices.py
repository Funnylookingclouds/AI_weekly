#!/usr/bin/env python3
"""SOME ASSEMBLY RAGE – voice every speech bubble of an episode via ElevenLabs (word timestamps).
Usage: flatpack_voices.py scripts/episodes/flatpack-ep1.json
Writes video/public/flatpack/<ep>/line_<n>.wav (-16 LUFS, trimmed) and video/src/flatpack/<ep>.voice.json
"""
import base64, json, subprocess, sys, urllib.request
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
ep = json.loads(Path(sys.argv[1]).read_text())
VOICES = ep["voices"]; out_dir = ROOT / f"video/public/flatpack/{ep['id']}"; out_dir.mkdir(parents=True, exist_ok=True)
res = []
for n, ln in enumerate(ep["lines"]):
    if not ln.get("tts"): res.append(None); continue
    v = VOICES[ln["who"]]
    vs = {"stability": 0.32, "similarity_boost": 0.8, "style": 0.65, "use_speaker_boost": True, "speed": ep.get("speed", 1.12), **v.get("settings", {}), **ln.get("settings", {})}
    body = json.dumps({"text": ln["tts"], "model_id": "eleven_multilingual_v2", "voice_settings": vs}).encode()
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{v['id']}/with-timestamps", data=body,
                                 headers={"Content-Type": "application/json", "xi-api-key": "proxy-injected"})
    d = json.load(urllib.request.urlopen(req, timeout=180))
    raw = ROOT / f"temp/{ep['id']}_{n}.mp3"; raw.write_bytes(base64.b64decode(d["audio_base64"]))
    al = d.get("normalized_alignment") or d["alignment"]
    chars, st, en = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]
    # leading silence to subtract
    det = subprocess.run(["ffmpeg", "-i", str(raw), "-af", "silencedetect=n=-45dB:d=0.02", "-f", "null", "-"], capture_output=True, text=True).stderr
    lead = 0.0
    if "silence_start: " in det:
        first = float(det.split("silence_start: ")[1].split()[0])
        if first < 0.01: lead = max(0.0, float(det.split("silence_end: ")[1].split()[0]) - 0.03)
    words, cur, ws = [], "", None
    for c, s, e in zip(chars, st, en):
        if c.isspace():
            if cur: words.append({"w": cur, "s": round(ws - lead, 3), "e": round(pe - lead, 3)}); cur = ""
            continue
        if not cur: ws = s
        cur += c; pe = e
    if cur: words.append({"w": cur, "s": round(ws - lead, 3), "e": round(pe - lead, 3)})
    wav = out_dir / f"line_{n}.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af", f"atrim=start={lead},areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.08,areverse,apad=pad_dur=0.05,loudnorm=I=-16:TP=-1.5", "-ar", "48000", str(wav)], check=True)
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(wav)], capture_output=True, text=True).stdout)
    res.append({"file": f"flatpack/{ep['id']}/line_{n}.wav", "dur": round(dur, 2), "words": words})
    print(n, ln["who"], round(dur, 2), ln["tts"])
(ROOT / f"video/src/flatpack/{ep['id']}.voice.json").write_text(json.dumps(res, indent=1))
