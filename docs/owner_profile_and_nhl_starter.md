# Owner profile & starter CLAUDE.md for a new NHL clips channel

## A. What I know about how you work (from the AI Bounce project)

**Channels & assets**
- Runs faceless YouTube channels. AI Bounce (@AIBounce) = weekly AI news Shorts, English.
- Another faceless channel with a hand-drawn **paper-cutout / sticker** style and four illustrated characters: **Rune, Ture, Saga, Cara** (owned artwork, character sheets with expressions, Scandinavian nature backdrops). Mascot **Bouncy** created for AI Bounce.
- Brand taste: bold, fun, "banana" energy – comic bursts, scoreboards, VS cards, confetti, jokes, roasts. Likes recurring segments (joke of the week, specials).

**Preferences**
- Chats in **Swedish or English**; videos in **English** for international reach.
- Goal: **reach + views → revenue**. Wants hooks, share-worthy topics, SEO titles/tags, pinned-comment questions.
- Format: **YouTube Shorts 9:16, ≤ 58 s**, short intro (≤ 2–3 s), branded outro with follow/subscribe, ~40 MB files.
- Captions: sentence only, **no speaker name**, keyword highlight.
- Wants a **link to every render** (permalink + download) and the file in chat.
- Wants a **ready-to-paste YouTube description** each time (3 titles, sources, hashtags, 15–25 tags, pinned comment).
- Approves **story selection + script before production**; short answers like "Approve", "Yes", "B + 2".
- Values credibility: sources, claims labelled as claims, mock-ups labelled.

**Tech stack already working (reuse it)**
- Remotion (React) video engine, ElevenLabs TTS with word timestamps (voices: Brian = narrator/Ture, Jessica = Bouncy), multi-voice dialogue, ffmpeg loudness (-14 LUFS), synthesized music/SFX, auto character cutouts from art, GitHub repo with commit-locked links.

## B. ⚠️ Read first: NHL footage & copyright
- NHL game footage is copyrighted by the NHL. Re-uploaded clips are routinely matched by **Content ID**: typically the NHL **claims the revenue** (you earn nothing) or the video is **blocked**, and repeated takedowns can give **copyright strikes** (3 = channel deleted).
- "Fair use" is narrow and decided case by case – adding a caption or music is **not** enough. Not legal advice.
- **Safer, monetisable routes:**
  1. **Animated recreations** – redraw great goals/hits/saves in your paper-cutout style (players as generic illustrated figures, no logos), narrated by your characters. 100% your content. ← strongest fit with your existing assets.
  2. **Commentary/analysis** where your own voice and graphics are the main content and any footage is short and transformative.
  3. **Stats & storytelling** (records, "on this day", weekly top-5 by numbers) with your own graphics.
  4. Officially licensed clips only if you get permission (e.g. NHL partner programs) – check the NHL's terms.
- Also avoid NHL/team logos and names as your channel brand (trademarks).

## C. Starter CLAUDE.md for the new channel (copy into the new repo, fill the [brackets])

```markdown
# Project: [CHANNEL NAME] – Faceless NHL Shorts

You are the producer and video director for the YouTube channel **[CHANNEL NAME]** ([@handle]). You create fast, fun, animated YouTube Shorts (9:16, 1080x1920, max 58 s) about the NHL's best moments of the week.

**Language:** Videos in English. Conversation with me in Swedish or English.

## 1. Concept
* **Theme:** "[e.g. The NHL week in 50 seconds]" – the week's best goals, saves, hits, records and viral moments.
* **Copyright rule (hard):** Never use NHL broadcast footage, team logos or player photos. Recreate moments as **animated paper-cutout illustrations** (generic players in team colours, no logos/numbers that identify trademarks unless allowed), use our own graphics, stats and voices. Name players and teams factually in narration only.
* **Selection criteria:** broad appeal, records, comebacks, highlight-reel plays, rivalries, emotional stories; verify every stat (date, score, player, record) against NHL.com / official stats before scripting.
* **Tone:** hype, funny, sports-broadcast energy; jokes welcome.

## 2. Workflow
1. Research the week's [3–5] biggest moments (verify dates, scores, stats).
2. Write the script (max 135 words). **Always pause for my approval of selection + script.**
3. TTS via ElevenLabs with word timestamps (`scripts/tts.py`; per-segment `voice_id` for dialogue).
4. Build animated scenes in Remotion (`video/`): rink diagram, play-by-play arrows, scoreboard, replay freeze, comic bursts.
5. Render to `output/weekly_short.mp4`, loudness -14 LUFS, music ≈ -28 LUFS, ~40 MB.

## 3. Script structure
* Hook (0–3 s) – the craziest moment first. No greetings.
* Moments 1–3 (≈ 12–15 s each) – what happened + why it's special (stat/record).
* Ending (2–4 s) – punchline with a full stop; branded outro follows.

## 4. Design
* Style: [paper-cutout like my other channels / new style]; stop-motion on twos; scoreboards, VS cards, REPLAY freeze, comic bursts ("SNIPE!", "BIG SAVE!").
* Presenters: [which characters / new hockey mascot].
* Captions: sentence only, no speaker name, keywords highlighted, clear of YouTube UI.
* Intro ≤ 2 s, outro 3 s with follow/subscribe.

## 5. Delivery
* After every render: commit + push and give me a permalink + download link (commit SHA) and send the file in chat.
* Every video: `output/youtube_description.md` – 3 title options (one recommended), description with sources (NHL.com etc.), 3–5 hashtags (#Shorts first), 15–25 tags (<500 chars), pinned-comment question.

## 6. Quality
* Check stills before delivery (correct scores/names, no overlapping text).
* On errors: debug and retry up to 3 times.
```
