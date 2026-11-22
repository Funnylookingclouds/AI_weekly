#!/usr/bin/env bash
# Full pipeline: TTS -> audio assets -> Remotion render -> loudness check -> output/
# Edit scripts/episode.json for each week (after the script is approved).
set -euo pipefail
cd "$(dirname "$0")/.."

attempt() { # retry up to 3 times (CLAUDE.md §5)
  local n=1; until "$@"; do
    [[ $n -ge 3 ]] && { echo "FAILED after 3 attempts: $*"; return 1; }
    echo "Retry $n: $*"; n=$((n+1)); sleep 2; done
}

attempt python3 scripts/tts.py
attempt python3 scripts/make_audio_assets.py
cp output/voiceover.mp3 video/public/voiceover.mp3
cp temp/words.json video/src/data/words.json
(cd video && [[ -d node_modules ]] || npm install --no-audit --no-fund)
(cd video && attempt npx remotion render src/index.ts WeeklyShort ../temp/video_raw.mp4 --codec=h264 --crf=18 --audio-bitrate=256k --log=error)
cp temp/video_raw.mp4 output/weekly_ai_short.mp4
ffmpeg -hide_banner -i output/weekly_ai_short.mp4 -af ebur128 -f null - 2>&1 | grep -A1 "Integrated loudness" | tail -1
ffprobe -v error -show_entries format=duration:stream=width,height,r_frame_rate -of compact output/weekly_ai_short.mp4
