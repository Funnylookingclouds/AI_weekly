#!/usr/bin/env bash
# Two-pass loudnorm (-14 LUFS) of a rendered flat-pack episode: flatpack_finish.sh temp/raw.mp4 output/flatpack/out.mp4
set -euo pipefail
IN=$1; O=$2
J=$(ffmpeg -hide_banner -i "$IN" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -y -loglevel error -i "$IN" -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true" -ar 48000 -c:a aac -b:a 256k -movflags +faststart "$O"
ffmpeg -hide_banner -i "$O" -af ebur128 -f null - 2>&1 | grep -A1 "Integrated loudness" | tail -1
ffprobe -v error -show_entries format=duration,size -of compact "$O"
