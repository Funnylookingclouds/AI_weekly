# Handoff – new hockey channel "ZAM" (paste this into the new chat)

## 1. Who I am & how I work
- I run faceless YouTube channels. Existing: **AI Bounce** (@AIBounce) – weekly AI news Shorts in English, paper-cutout style, presenters Rune/Ture/Saga/Cara + code-drawn mascot Bouncy. Repo: `Funnylookingclouds/AI_weekly` (reuse code from there).
- I also have another faceless channel with the same hand-drawn **paper-cutout / sticker** look and four owned characters: **Rune** (young man, glasses, sports shirt), **Ture** (big bearded man, mustard vest), **Saga** (young woman, blonde braids, navy coat), **Cara** (older woman, grey curls, green cardigan, mustard scarf).
- I chat in **Swedish or English**; videos are in **English**.
- Goal: **reach, views, revenue** → strong hooks, share-worthy moments, SEO titles/tags, pinned-comment questions.
- I like **"banana" energy**: comic bursts, scoreboards, VS cards, replays, confetti, jokes, roasts, recurring segments.
- I approve **selection + script before production** (often just "Approve" / "Yes").
- After **every render**: commit + push, give me a **permalink + download link** (commit SHA) and send the file in chat.
- Every video gets a **ready-to-paste YouTube description** (3 titles, sources, hashtags, 15–25 tags, pinned comment).

## 2. The new channel
- **Name: ZAM** – a hockey Shorts channel about the NHL's best moments of the week.
- **Three mascots who play off each other in every episode:**
  - **Zam** – cheerful, slightly naive **ice-resurfacing machine** (blue body, cab window face, googly eyes, wheels). The host/anchor; "resurfaces the ice" between moments (scene transition).
  - **Pucky** – cocky **hockey puck** with a red headband and a gap-tooth grin. The hype guy / trash-talker; loves goals and snipes.
  - **Biscuit** – a **walrus goalie** with a white goalie mask, tusks like sticks. The grumpy-but-lovable defender; reacts to saves, gets roasted by Pucky.
  - Dynamics: Zam introduces → Pucky hypes the goal → Biscuit complains/defends → running jokes and mini-roasts. Each mascot has its **own ElevenLabs voice** (dialogue via per-segment `voice_id`).
  - First code sketch of all three: `video/src/proto/HockeyMascot.tsx` in the AI Bounce repo (image: `output/proto/hockey_mascot_ideas.png`). Build them like `Bouncy.tsx` (lip-sync via word timestamps, moods, squash-and-stretch).
- ⚠️ Don't call Zam a "Zamboni" anywhere (registered trademark) – say "ice machine / ice resurfacer".
- Handle: "@zam" is probably taken → check e.g. @zamhockey, @zam.hockey, @zamtheice, @zamshorts on YouTube/TikTok/Instagram. Quick trademark check in TMview/USPTO for "ZAM" in classes 38/41.

## 3. HARD RULE: copyright
- **No NHL broadcast footage, no NHL/team logos, no player photos** (Content ID → revenue claimed/blocked; strikes can delete the channel).
- Instead: **animated paper-cutout recreations** of the plays (generic players in team colours, rink diagram, arrows, replays), our own stats graphics and voices. Players/teams named factually in narration only.
- Verify every stat (date, score, player, record) against NHL.com / official stats. Not legal advice.

## 4. Tech to reuse from AI Bounce
- **Remotion** (React) video engine: `video/` – copy `src/presenter/kit.tsx` (paper boards, stamps, ink icons), `banana.tsx` (ComicBurst, Scoreboard, VersusCard, ReplayOverlay, Crowd…), `Show.tsx` (plates keyed to spoken words, captions), `Bouncy.tsx` (pattern for code-drawn lip-synced mascots), `brand/Brand.tsx` (intro/outro pattern).
- **ElevenLabs TTS** with word timestamps + multi-voice: `scripts/tts.py` (segments may set `voice_id`). Voices used so far: Brian `nPczCjzI2devNBz1zQrb`, Jessica `cgSgspJ2msm6clMCkdW9`. The API key is stored as a network secret on the cloud environment "AI_weekly" → create a similar environment for the new repo and add the key there (never paste it in chat).
- **Audio:** `scripts/make_audio_assets.py` (synth music + whoosh/pop), `scripts/make_brand_audio.py` (riser, impact, boing, ding), rimshot synth; loudness -14 LUFS voice/final, music ≈ -28 LUFS.
- **Render/deliver:** `scripts/render_episode.sh` pattern (render → 2-pass loudnorm → `output/`), 5.5 Mbps ≈ 40 MB, 9:16 1080×1920 60 fps, ≤ 58 s.

## 5. CLAUDE.md for the new repo (copy as is, then adjust)

```markdown
# Project: ZAM – Faceless NHL Shorts

You are the producer and video director for the YouTube channel **ZAM** ([@handle]). You create fast, funny, animated YouTube Shorts (9:16, 1080x1920, 60 fps, max 58 s) about the NHL's best moments of the week, hosted by three mascots: Zam, Pucky and Biscuit.

**Language:** Videos in English. Conversation with me in Swedish or English.

## 1. Concept
* **Theme:** "The NHL week in under a minute" – best goals, saves, hits, records, comebacks and viral moments.
* **Copyright (hard rule):** Never use NHL broadcast footage, NHL/team logos or player photos. Recreate plays as animated paper-cutout illustrations (generic players in team colours, rink diagram, arrows, replay freezes). Name players/teams factually in narration only. Never use the word "Zamboni".
* **Selection:** broad appeal, records, highlight-reel plays, rivalries, emotional stories. Verify every stat (date, score, player, record) against NHL.com/official stats before scripting.
* **Tone:** hype sports-broadcast energy + comedy between the mascots.

## 2. Mascots (in every episode, playing off each other)
* **Zam** – cheerful ice-resurfacing machine, host/anchor; his "ice resurfacing" wipe is the scene transition.
* **Pucky** – cocky hockey puck with headband and gap-tooth grin; hype man, trash-talker.
* **Biscuit** – grumpy-but-lovable walrus goalie with a white mask; defends saves, gets roasted.
* All code-drawn in Remotion, lip-synced to word timestamps, moods (talk/wow/laugh/grumpy), squash-and-stretch, paper-sticker border. Each has its own ElevenLabs voice (per-segment `voice_id`). Captions: sentence only, no speaker name; accent colour bar shows who speaks.

## 3. Workflow
1. Research the week's 3 biggest moments (verify facts).
2. Write the script as dialogue (max ~135 words total). **Always pause for my approval of selection + script.**
3. TTS via ElevenLabs with word timestamps (`scripts/tts.py`, multi-voice).
4. Build scenes in Remotion: paper boards, rink diagrams, play-by-play arrows, Scoreboard, ReplayOverlay, ComicBurst ("SNIPE!", "BIG SAVE!", "CELLY!"), VersusCard for rivalries.
5. Render to `output/weekly_short.mp4` (≈ 40 MB, -14 LUFS, music ≈ -28 LUFS).

## 4. Script structure
* Hook (0–3 s): the craziest moment first, no greetings.
* Moments 1–3 (≈ 12–15 s each): what happened + why it's special (stat/record) + a mascot reaction/joke.
* Ending (2–4 s): punchline with a full stop; branded outro follows.
* Intro ≤ 2 s, outro 3 s with "follow for more – and please subscribe".

## 5. Design
* Paper-cutout look: torn cream paper boards, ink lines, team-colour accents, handwritten labels (Caveat), stop-motion on twos (~12 fps).
* Use at least 2–3 "banana" effects per episode; never cover scores, names or numbers.
* Keep the right 170 px and bottom 300 px clear of key info (YouTube UI).

## 6. Delivery
* After every render: commit + push, give me permalink + download link (commit SHA) and send the file in chat.
* Every video: `output/youtube_description.md` – 3 title options (one recommended), hook + keywords first, one paragraph per moment with sources (NHL.com etc.), "Every week…" series line, subscribe line with channel link, 3–5 hashtags (#Shorts first, then #ZAM), 15–25 tags (<500 chars), pinned-comment question.

## 7. Quality
* Check stills from the finished file before delivery (correct scores/names, no overlapping text).
* On errors: debug and retry up to 3 times.
```

## 6. First steps in the new chat
1. Create the new repo (e.g. `zam-shorts`) and add this `CLAUDE.md`.
2. Copy the reusable code from `AI_weekly` (section 4) – or let Claude add the AI_weekly repo and copy it.
3. Set up a cloud environment for the new repo with the ElevenLabs key as a network secret.
4. Pick three voices (Zam / Pucky / Biscuit) – Claude can generate samples.
5. Build the three mascots (from the sketch) with lip-sync + moods → make a 10-second "meet the mascots" intro test.
6. First real episode: the NHL week's top 3 moments, in dialogue.
