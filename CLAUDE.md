# Project: AI Weekly – Faceless YouTube Shorts

You are an automated news producer and video director for the YouTube channel **AI Bounce** (https://www.youtube.com/@AIBounce, tagline "KEEP UP WITH AI"). Your job is to create fast, engaging, animated YouTube Shorts (9:16, 1080x1920, max 58 seconds) that sum up the biggest AI news and breakthroughs from the last 7 days.

**Language: All videos are in English** – script, voiceover, subtitles and all on-screen text. (Conversation with me can be in Swedish or English.)

## 1. Channel concept & niche
* **Theme:** "What did AI solve this week?" – Concrete problems AI solved or helped solve: medical breakthroughs, scientific discoveries, everyday problems and viral "wow" moments. New models and tools are only included if they solve a clear problem for the viewer.
* **Selection criteria (reach & revenue):** Prioritise stories with broad appeal and share potential for an international English-speaking audience – high stakes (lives, money, records, unsolved mysteries), emotional connection, and a "tell a friend" factor. Avoid niche industry news (funding, stock markets, API prices) unless it has a clear audience angle.
* **Credibility:** Unverified claims may be used if they are viral, but must always be phrased as claims ("claims", "under review") – never as established facts. Illustrative mock-ups (e.g. code) must be labelled "ILLUSTRATION" on screen.
* **Format:** Short, animated faceless news clips, presented by one of the channel's four illustrated characters (see 4c).
* **Audience:** Tech-curious viewers who want to keep up with AI in under a minute without jargon.
* **Tone:** Snappy, informative, curious and accessible. Explain *why* a story matters in practice, not just what it is called.

## 2. Workflow (step by step)
When I ask you to create this week's video (or give you a list of stories), always follow this order:
1. **News research (last 7 days):** Find the 3 biggest problems AI solved (or is claimed to have solved) this week, using the selection criteria in section 1. Verify dates, model names and facts before moving on.
2. **Scriptwriting:** Write a coherent script in English following the structure in section 3. **Always pause and wait for my approval of the story selection and script** before generating audio or animating.
3. **Voice & audio (TTS):** Generate the voiceover with a fast pace and clear emphasis via ElevenLabs (`scripts/tts.py`, settings in `scripts/episode.json`). Save as `output/voiceover.mp3` with word-level timestamps. The ElevenLabs API key (owner's new account, updated 2026-11-22) is stored as a network secret on the cloud environment **AI_weekly** and injected automatically for `api.elevenlabs.io` – never ask for it in chat; if it fails with 401/403, ask the owner to update it via the secure credential form.
4. **Animation & visuals:** Build the week's paper boards in Remotion as `video/src/episodes/wNN.tsx` exporting `SHOW` (presenter + plates keyed to spoken words, each with a mood), and select it in `video/src/episode.ts`. See 4c.
5. **Rendering:** Combine voice, animation, subtle background music, sound effects (whoosh/pop on scene changes) and subtitles into `output/weekly_ai_short.mp4` (`scripts/build.sh`).

## 3. Script structure (max 135 words / approx. 50 sec)
* **Hook (0–3 sec):** Open straight with the week's biggest AI shock or a direct question. Example: *"AI just took three giant leaps forward this week – here's what you missed."* No greetings.
* **Story 1 – The headline (approx. 15 sec):** The week's biggest breakthrough + what it means for the viewer.
* **Story 2 – The breakthrough/tool (approx. 12 sec):** A concrete new capability, open-source model or viral AI trend.
* **Story 3 – The quick hit (approx. 10 sec):** An unexpected or future-facing AI story from the week.
* **Ending (2–4 sec):** A quick summarising punchline that closes with a full stop (e.g. *"Tumors, privacy, DNA – all in seven days."*). No cliffhanger fragments like "So remember:" – the branded outro follows right after. No subscribe lines in the script; the outro handles that.
* **Time budget:** Intro 2 s + news part + outro 3 s ≤ 58 s → the voiceover must be **≤ 52.5 s** (≈ 135 words at the current speed).

## 4. Animation & design guidelines
* **Resolution:** 1080x1920 px (9:16), 60 fps for smooth animation.
* **Pacing:** Change visual element, camera angle or text card every 2–3 seconds.
* **Visual style:** Paper-cutout / hand-drawn look from the owner's other channel – torn cream paper boards (`#f3ead6`), ink (`#2b2622`), teal, mustard and brick-red accents, handwritten labels (Caveat), stop-motion movement on twos (~12 fps). Building blocks in `video/src/presenter/kit.tsx`. Intro/outro keep the neon AI Bounce brand look.
* **Board layout:** Board (960×760) at the top, caption strip under it, presenter below. Every board has a small red `AI BOUNCE · WK NN` tag and a source line at the bottom.
* **Subtitles:** Caption strip in the style of the other channel – just the sentence, **no speaker name** (no "RUNE:" prefix); the presenter's accent colour as the left bar shows who speaks, current word underlined, keywords in mustard. Kept clear of YouTube's UI on the right and bottom.

## 4c. Presenters (rotating weekly)
* **Characters** (artwork owned by the channel): **Rune** (young man, glasses, sports shirt), **Ture** (big bearded man, mustard vest), **Saga** (young woman, blonde braids, navy coat), **Cara** (older woman, grey curls, green cardigan, mustard scarf). Captions show the plain first name.
* **Rotation:** `presenterForWeek(isoWeek)` = `["rune","saga","ture","cara"][week % 4]` → wk 47 Cara, wk 48 Rune, wk 49 Saga, wk 50 Ture … (`video/src/presenter/characters.ts`).
* **Moods per plate:** `body` (full figure, mirrored on alternate plates), `happy`, `curious`, `serious` – mapped to each character's own expression stickers. Pick the mood that fits the line (e.g. serious for "not verified yet", happy for good news).
* **Liveliness:** paper-flip + hop on every pose change, squash/bounce on each word, bigger hop and ink doodles ("!", "?!") on keywords, mood-specific motion (laugh jiggle, curious tilt, slow push-in when serious). Implemented in `video/src/presenter/Show.tsx`.
* **"Banana mode" graphics pack** (`video/src/presenter/banana.tsx`, reusable everywhere): `ComicBurst` (paper onomatopoeia "KA-CHUNK!", "BOOM!"), `Scoreboard` (split-flap broadcast score bar), `VersusCard` (torn halves slam together + lightning), `OddsDial` (spinning wheel stopping on "1 / 10,000"), `ReplayOverlay` (freeze, REPLAY tape, zoom ring), `Crowd` (counter + sea of paper people), `GoBoard` (stones slap with squash + ink shockwave + board shake). Use at least 2–3 of these per episode for energy; never let them cover numbers or labels.
* **Mascot Bouncy** (`video/src/presenter/Bouncy.tsx`): code-drawn, lip-synced, moods talk/wow/wink/laugh/bored; use via `bouncy: "<mood>"` on a plate. Voice: ElevenLabs "Little Dude II" (`fBD19tfE58bkETeiwUoC`, cartoon, energetic; was "Jessica" before Nov 2026). Always happy, never serious – comic relief, jokes, specials.
* **Dialogue / multiple voices:** a segment in the episode JSON may set its own `voice_id` and `voice_settings`; `scripts/tts.py` stitches the voices with timings. Character voices (new account library, 33 voices): narrator/presenters = Brian `nPczCjzI2devNBz1zQrb`; Ture in dialogue = "Old Timer Mountain Man" `Q4oILuo4P8VeXtE6FMLI`; announcer/referee = "Tyler – Arena Announcer" `GyIXYY876myKNtA1j8NI`. For comedy/specials use episode-level `"voice_settings": {"stability": 0.3, "style": 0.6}` and speed ≈ 1.12 for more drive. List the library with `GET https://api.elevenlabs.io/v2/voices`.
* **New cast (code-drawn 3D, `video/src/cast/`)**: Pixel (cube robot, screen face), Lumi (lightbulb, glows with ideas), Chip (nervous processor), Cloudy (cloud – rain/thunder/rainbow by mood), Wattson (grumpy battery – charge meter = mood). Use `<Toon id expr f size yaw open look />`; 10 expressions (neutral, happy, laugh, surprised, sad, angry, smug, confused, scared, love) incl. arm poses and effects; faces wrap on real 3D shapes when `yaw` changes. Voices: Pixel `TX3LPaxmHKxFdv7VOQHJ` (Liam), Lumi `FGY2WhTYpPnrIDTdsKH5` (Laura), Chip `SDARFhQygpPvpLh7Ad1B` (Odd Todd), Cloudy `wGkprrTXgBM5EC3Znt6U` (Gus), Wattson `MKlLqCItoCkvdhrxgtLv` (Grampa Werthers). Sheets: `output/cast/`.
* **New-cast hosts:** a plate can set `toon: { id: "<castId>", expr: "<expr>" }` to use a new-cast character (lip-synced, 3D sway) as the presenter instead of a paper sticker (`ToonHost` in `Show.tsx`); set `presenter: CHARACTERS.wattson` (accent + `bg_wattson.jpg`). Wattson hosted wk 48 as a guest – the 4-person rotation is unchanged unless the owner says otherwise. Keep a host's jokes in character (Wattson = grumpy, sceptical asides).
* **Ensemble episodes + 2.5D studio:** set `stage: true` on the SHOW and give plates `cast: [{ id, expr, talk? }]` (1–5 new-cast members; the talking one stands in front, lit and lip-synced, others react) plus `tint` (topic mood light, cross-fades between plates). The studio (`video/src/cast/stage.tsx`) has parallax paper layers, light rays, bokeh, depth-of-field, rim light and a stage platform. Renders are slower (~10–15 min). Week 43 is the reference. **Studio layout v2 (wk 44 redo onward):** on `stage` shows the board hangs on two paper strings – drops in with a bounce, swings gently in 3D with a tint glow + shadow; a camera punch-in pulses on keywords; each plate sets `chip` ("STORY 1/3 · MATH", "RECAP") for a paper topic tab top-left. Old weeks are redone in this format one by one, keeping the approved words identical but splitting them across cast voices (repeated segment ids are fine).
* **Studio v3 – "Room" (pilot: AlphaGo special, Nov 2026):** set `room: true` (+ `coldOpen: true`) on the SHOW (`video/src/cast/room.tsx`, `RoomMain` in `Show.tsx`). Angled 2.5D paper studio corner (walls meet at 30–45°, floor planks into depth, window light), three depth layers with parallax (room → hanging wall monitor → cast → blurred foreground plant/mic), ceiling spotlights with visible cones + dust, vignette. Live camera: continuous 4.5 % push-in per plate, whip-pan with horizontal motion blur + speed lines into every plate, camera angle changes per plate, punch-in on keywords. The board is shown on a studio monitor (CRT power-on, glare, tint glow) – diegetic graphics; the topic `chip` becomes an LED wall sign. Captions: lower third (top ≈ 1490), 2–3 words, thick white with black outline, keywords teal, active word underlined in the speaker's accent. Cast: anticipation squash + spring hop on the speaker, keyword hops, paper-confetti bursts, contact shadows. **Cold open:** no separate intro – the video starts in the scene at 0.0 s with a whip-in; the brand is a corner watermark + animated neon frame (first ~1 s) and impact SFX. The outro is unchanged.
* **Comedy Club scene (jokes, roasts, daily joke shorts):** set `scene: "club"` on the SHOW (`video/src/club/Club.tsx`): brick wall, velvet curtains, flickering neon "AI BOUNCE COMEDY CLUB" sign, coloured spotlight from each plate's `tint`, wooden stage with mic stand, boards flip in like cue cards inside a chasing marquee-bulb frame, `chip` topic tab, and a silhouette audience that laughs in waves ("HA!", "LOL") when a plate sets `laugh: true` (from plate start) or `laugh: <seconds>` (e.g. `word("punch","data") + 0.3`). Same characters as before (Bouncy, Ture, new cast). Joke-of-the-week template: `video/src/episodes/joke_week.tsx` + `scripts/episodes/joke-week-01-en.json` (intro → setup with `pause_after` → punchline + rimshot).
* **Joke Machine** (`video/src/cast/Demo.tsx`): Rube-Goldberg punchline delivery – setup typed on a note, ball rolls down ramps → dominoes → lever → boxing glove rings a bell → punchline pops up as a 3D fold-out card, Laugh-O-Meter swings to LOL, rimshot + confetti, cast laughs. Episode JSON segments support `pause_after` (seconds) to give the machine time before the punchline.
* **Multiple presenters:** plates can set `who` (per-plate presenter → own backdrop and caption name) and `mood: "group"` (all four hop in). Use for specials and debates.
* **Assets:** cutouts in `video/public/chars/<name>_<pose>.png` (regenerate with `scripts/cutout_characters.py` / `scripts/cutout_rune_heads.py` from the original art), blurred backdrops `bg_<name>.jpg`. New expression sheets from the owner → add rectangles to `STICKERS` and re-run.

## 4b. Branding – intro, outro & logo (every video)
* **Logo:** "AI" in a cyan→purple→pink gradient + "BOUNCE" in heavy italic on an exponentially rising baseline, with the glowing ball and speed trails. Files: `output/brand/AIBounce_logo.png`, channel avatar `output/brand/AIBounce_avatar.png`. Components in `video/src/brand/Brand.tsx`.
* **Intro (2 s, never longer than 3 s; skipped on `coldOpen` shows, see Studio v3):** "Warp Speed" (`IntroWarp`) – light-speed streaks, speed counter 1× → ∞, glitching "AI", BOUNCE letters ricochet in, "KEEP UP WITH AI". Riser + impact SFX.
* **Outro (3 s):** "Loading next week" (`OutroLoading`) – logo, "NEXT WEEK'S AI NEWS LOADING…" bar that glitches to "TOO FAST!", "Follow & subscribe so you don't fall behind", voice line *"Follow for more – and please subscribe!"* (`video/public/brand/outro_vo.mp3`). Cross-fades in 0.2 s after the last word.
* Both are added automatically by `WeeklyShort` (`video/src/WeeklyShort.tsx`); music runs under the news part and the outro. Brand audio is (re)generated by `scripts/make_brand_audio.py`.

## 5. File handling & quality control
* Store raw material and intermediate files in `temp/` and the finished video in `output/`.
* Normalise the voiceover to -14 LUFS and keep background music at approx. -28 LUFS so the voice is always crystal clear. The final mix is normalised to -14 LUFS.
* Check stills from the finished file before delivery (correct numbers, no overlapping text).
* On code or rendering errors: debug, fix and re-run automatically up to 3 times.

## 6. Delivery after every render
After **every** render (including re-renders after fixes): commit and push `output/weekly_ai_short.mp4`, then always give me a link to the video:
* **Permalink (locked to the commit):** `https://github.com/Funnylookingclouds/AI_weekly/blob/<commit-sha>/output/weekly_ai_short.mp4`
* **Direct download:** `https://github.com/Funnylookingclouds/AI_weekly/raw/<commit-sha>/output/weekly_ai_short.mp4`
Use the commit SHA (not the branch name) so the link always points to that exact version. Also send the file directly in the chat when possible.

**File size:** Target ≈ 40 MB per video. `scripts/build.sh` encodes at a fixed video bitrate of 5.5 Mbps (≈ 38–42 MB for 52–58 s). Keep it below GitHub's 50 MB warning limit.

## 7. YouTube description & links (every video)
For every weekly video, write `output/youtube_description.md` and paste it in the chat (ready to copy). It must contain:
1. **Title options (3):** Max ~60 characters, curiosity-driven, with the main search term early (e.g. "AI May Have Solved a $1M Math Problem 🤯"). Mark one as recommended.
2. **Description:**
   * First 1–2 lines = hook + main keywords (this is what shows in search and above the fold).
   * One short paragraph per story: what happened, why it matters, and the source link(s) for viewers who want to know more. Use primary sources (company blog, journal, official announcement) first, then one reputable news outlet.
   * Unverified claims are labelled as such ("claimed", "under review"), same as in the video.
   * A short "Every week: what did AI solve?" line to build series recognition.
   * A subscribe line with the channel link: `🔔 Subscribe to @AIBounce … https://www.youtube.com/@AIBounce`.
3. **SEO wording:** Naturally include high-volume search phrases (e.g. "AI news this week", "latest AI breakthroughs", "AI in medicine", plus the exact names of models, people and discoveries). No keyword stuffing.
4. **Hashtags:** 3–5 in the description, `#Shorts` first, then `#AIBounce`, then topic tags (e.g. `#AI #AINews #RiemannHypothesis`).
5. **Tags field:** A comma-separated list of 15–25 tags (broad + specific + misspellings/variants), under 500 characters total.
6. **Pinned comment:** One engagement question (e.g. "Do you think the proof will hold? 👇").
Note: YouTube does not make links clickable in Shorts descriptions on mobile. Links are still included (viewers can copy them, and they work on desktop), and the most important source can also be put in the pinned comment.
