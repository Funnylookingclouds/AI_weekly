# AI Veckonyheter – Faceless YouTube Shorts

Pipeline for the weekly "Vad har AI löst den här veckan?" Short. See `CLAUDE.md` for the editorial rules.

## Weekly workflow
1. Research + script draft → `temp/manus_<datum>.md` (await approval).
2. Put the approved script into `scripts/episode.json` (`tts` text per segment; numbers spelled out, `display_map` turns them back into digits in the subtitles; `keywords` are highlighted).
3. Update scenes in `video/src/Scenes.tsx` and the beat list in `video/src/WeeklyShort.tsx` (beats are anchored to spoken words via `at(segment, word)`).
4. `scripts/build.sh` → `output/voiceover.mp3` (-14 LUFS) and `output/weekly_ai_short.mp4` (1080x1920, 60 fps).

Preview while editing: `cd video && npm run studio`.

## Requirements
- ElevenLabs key: injected by the cloud environment's proxy (or set `ELEVENLABS_API_KEY` locally).
- Node 18+, Python 3 + numpy, ffmpeg.
- Music and SFX are synthesised by `scripts/make_audio_assets.py` (royalty-free, no external assets).
