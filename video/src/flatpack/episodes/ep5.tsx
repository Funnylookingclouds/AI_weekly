/** SOME ASSEMBLY RAGE – Ep. 5 "The Wardrobe of Doom, part 1: It Won't Fit" (FLÄRPA). */
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { C } from "../furni";
import type { FurniId } from "../furni";
import {
  type Bub, type BurstT, type CamKey, type Cue, type MoodKey, type MoveKey, type Voice, type Who,
  EpisodeAudio, FPS, HEAD, INK, LogoStamp, Overlays, Piece, Scoreboard, Stage, Versus,
  clamp, fitBubbles, flashAt, furniNode, leftyNode, makeCam, makeSpeaking, moodAt, posAt,
} from "../kit";
import { DOOR_X, DoorFrame, EndCard, FrontDoor, GiantBox, WARD, wardrobePieces } from "../wardrobe";
import { Outro, OUTRO_LEN } from "../Outro";
import VOICE_RAW from "../ep5.voice.json";

const VOICE = VOICE_RAW as Voice[];
const STORY = 24.5;
export const EP5_LEN = Math.round((STORY + OUTRO_LEN) * FPS);
const T_IN = 0.6, WEDGE = 12.0, RIP = 15.0;

const MOOD: Record<FurniId, MoodKey[]> = {
  duke: [[0, "neutral", "none"], [1.2, "surprised", "shock"], [1.4, "happy", "joy"], [4.8, "smug", "sparkle"], [6.7, "angry", "rage"], [9.2, "angry", "none"], [WEDGE, "surprised", "shock"], [12.8, "confused", "confused"], [15.0, "happy", "joy"], [16.0, "neutral", "none"], [17.4, "scared", "sweat"], [18.6, "scared", "sweat"], [21.4, "confused", "confused"]],
  pia: [[0, "neutral", "none"], [1.2, "surprised", "shock"], [2.6, "smug", "none"], [4.3, "angry", "rage"], [6.7, "angry", "none"], [9.2, "angry", "storm"], [WEDGE, "surprised", "shock"], [12.8, "angry", "storm"], [15.2, "surprised", "shock"], [16.0, "angry", "none"], [18.6, "angry", "grawlix"], [21.4, "angry", "storm"]],
  gus: [[0, "happy", "none"], [1.2, "surprised", "shock"], [1.6, "love", "love"], [6.7, "happy", "music"], [9.2, "scared", "sweat"], [WEDGE, "surprised", "shock"], [15.0, "happy", "joy"], [18.6, "scared", "sweat"], [21.4, "confused", "confused"]],
  lotta: [[0, "neutral", "zzz"]],
};
const MOVE: Record<FurniId, MoveKey[]> = {
  duke: [[0, 160, 150, 0], [6.6, 220, 160, 0.5], [12.6, 140, 160, 0.5]],
  pia: [[0, -330, 160, 0], [2.4, -190, 175, 0.4]],
  gus: [[0, -470, 225, 0], [6.6, 400, 110, 0.5], [12.6, -440, 240, 0.5]],
  lotta: [[0, -660, -10, 0]],
};
const YAW: Record<FurniId, number> = { duke: 0.45, gus: 0.4, pia: 0.45, lotta: 0.3 };

const BUBBLES: Bub[] = [
  { who: "duke", t0: 1.4, t1: 2.5, text: "The wardrobe's here!", kind: "shout" },
  { who: "pia", t0: 2.7, t1: 4.6, text: "Box: two meters. Door: one meter." },
  { who: "duke", t0: 4.8, t1: 6.6, text: "So we push harder." },
  { who: "gus", t0: 7.2, t1: 8.2, text: "Tilt it! Tilt it!" },
  { who: "pia", t0: 9.2, t1: 10.8, text: "It's not TILTING, it's STUCK!", kind: "shout" },
  { who: "duke", t0: 12.8, t1: 14.9, text: "…New plan. We build it right here." },
  { who: "pia", t0: 16.0, t1: 17.3, text: "Duke. The door is blocked." },
  { who: "duke", t0: 17.4, t1: 18.5, text: "…So?" },
  { who: "pia", t0: 18.6, t1: 19.6, text: "WE'RE TRAPPED.", kind: "shout" },
  { who: "lefty", t0: 21.4, t1: 23.0, text: "Uh… how do I get out?" },
];
fitBubbles(BUBBLES, VOICE);
const speaking = makeSpeaking(BUBBLES, VOICE);

const CAM: CamKey[] = [
  [0, 400, -330, 1.0, 0], [1.4, 100, -220, 1.2, 0.3], [2.7, -60, -190, 1.3, 0], [4.8, 160, -200, 1.45, 0], [6.7, 260, -300, 0.95, 0.3],
  [9.2, -190, -190, 1.5, 0], [11.9, 300, -300, 0.95, 0], [12.8, 140, -210, 1.45, 0], [15.0, 120, -250, 0.92, 0.3], [16.0, -190, -190, 1.5, 0],
  [17.4, 140, -210, 1.55, 0], [18.6, 0, -250, 1.0, 0.2], [20.2, 220, 60, 1.2, 0.6], [21.2, 120, 120, 1.85, 0.4], [23.1, 0, -250, 0.95, 0.3],
];
const cam = makeCam(CAM, [[1.2, 14], [4.3, 10], [7.0, 6], [8.4, 8], [9.3, 12], [10.3, 6], [WEDGE, 30], [RIP, 16], [18.6, 18]]);
const FLASHES = [9.3, 18.6];
const BURSTS: BurstT[] = [
  [4.3, -190, -330, "BONK!", C.gum, -8], [7.0, 420, -560, "HNNGH!", C.sun, 6], [10.2, 420, -620, "CREAK!", "#cbd5e1", -5],
  [WEDGE, 400, -420, "KA-THUNK!", C.sun, -6], [RIP, 300, -420, "RIIIP!", C.mint, 8],
];
const SFX: Cue[] = [
  [0.05, "brand/ding.wav", 0.7], [0.3, "sfx_whoosh", 0.4], [T_IN, "sfx_roll", 0.6], [1.15, "sfx_thunk", 0.8], [2.9, "sfx_ratchet", 0.5], [4.3, "sfx_bonk", 0.9],
  [7.0, "sfx_thunk", 0.4], [7.6, "sfx_thunk", 0.4], [8.3, "sfx_whoosh", 0.5], [9.3, "sfx_thunder", 0.8], [10.2, "sfx_scratch", 0.3], [11.0, "sfx_thunk", 0.8],
  [WEDGE, "sfx_thunk", 1], [RIP, "sfx_rip", 1], [15.1, "sfx_crash", 0.6], [18.6, "sfx_thunder", 0.9], [20.2, "sfx_roll", 0.8], [23.1, "sfx_pop", 0.8],
];

export const FlatpackEp5: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cm = cam(t);
  const items: { y: number; node: React.ReactNode }[] = [];
  const doorOpen = clamp((t - 0.3) / 0.3);
  items.push({ y: -100, node: <FrontDoor key="door" open={doorOpen} /> });
  const pushing = t > 6.9 && t < WEDGE + 0.2;
  const push = pushing ? Math.sin(t * 7) * 0.6 : 0;
  const tilt = t > 8.2 && t < 11.0 ? Math.sin(((t - 8.2) / 2.8) * Math.PI) * -9 : 0;
  items.push({ y: -55, node: <DoorFrame key="frame" /> });
  items.push({ y: -60, node: <GiantBox key="box" t={t} tIn={T_IN} push={push} tilt={tilt} tWedge={WEDGE} tRip={RIP} /> });
  const ev = { back: [[0, "box"], [RIP + 0.1, "pile"]], left: [[0, "box"], [RIP + 0.15, "pile"]], right: [[0, "box"], [RIP + 0.2, "pile"]], bot: [[0, "box"], [RIP + 0.25, "pile"]], top: [[0, "box"], [RIP + 0.3, "pile"]], doorL: [[0, "box"], [RIP + 0.35, "pile"]], doorR: [[0, "box"], [RIP + 0.4, "pile"]] } as Record<string, [number, string][]>;
  items.push({ y: 45, node: <g key="ward" transform={`translate(${WARD.x} ${WARD.y})`}>{wardrobePieces(ev, () => 0, t).map((p) => <Piece key={p.id} def={p} t={t} />)}</g> });

  const pos = { duke: posAt(MOVE.duke, t), pia: posAt(MOVE.pia, t), gus: posAt(MOVE.gus, t), lotta: posAt(MOVE.lotta, t) };
  (Object.keys(MOOD) as FurniId[]).forEach((id) => {
    const m = moodAt(MOOD[id], t), p = pos[id];
    let hop = p.walk + (m.since < 0.35 ? Math.sin((m.since / 0.35) * Math.PI) * 55 : 0);
    let squash = 0;
    if ((id === "duke" || id === "gus") && pushing) { squash = Math.max(0, Math.sin(t * 7 + (id === "gus" ? 1 : 0))) * 0.12; hop += Math.abs(Math.sin(t * 7)) * 10; }
    if (t > 18.6 && t < 21 && id !== "lotta") hop += Math.abs(Math.sin(t * 12 + id.length)) * 30;
    items.push({ y: p.y, node: furniNode(id, p, { ...m, frame, yaw: YAW[id], talk: speaking(id, t), hop, squash }) });
  });
  // tape measure: extends from Pia to the box, snaps back into her face
  if (t > 2.6 && t < 4.6) {
    const p = pos.pia;
    const ext = t < 3.6 ? clamp((t - 2.6) / 0.6) : 1 - clamp((t - 4.2) / 0.12);
    const x0 = p.x + 120, y0 = p.y - 150, len = (DOOR_X - 40 - x0) * ext;
    items.push({ y: p.y + 3, node: <g key="tape"><rect x={x0} y={y0 - 8} width={Math.max(0, len)} height={16} fill={C.sun} stroke={INK} strokeWidth={3} />{[...Array(Math.max(0, Math.floor(len / 40)))].map((_, i) => <line key={i} x1={x0 + i * 40} y1={y0 - 8} x2={x0 + i * 40} y2={y0} stroke={INK} strokeWidth={3} />)}<rect x={x0 - 34} y={y0 - 30} width={56} height={56} rx={10} fill={C.tomato} stroke={INK} strokeWidth={5} /></g> });
  }
  const lefty = leftyNode(t, frame, 20.2, 120, 262, speaking("lefty", t));
  if (lefty) items.push({ y: 262, node: lefty });

  const heads = (w: Who) => w === "lefty" ? { x: 120, y: 262 - HEAD.lefty } : { x: pos[w as FurniId].x, y: pos[w as FurniId].y - HEAD[w] };
  const angry = (t > 9.2 && t < 12.0) || t > 18.6;
  return (
    <Stage t={t} cam={cm} items={items} wall={["#d7f5e3", "#c2eed4"]} angry={angry} storm={t > 18.6 && t < 20.5 ? 0.14 : 0}>
      <Overlays t={t} cam={cm} bubbles={BUBBLES} voice={VOICE} heads={heads} bursts={BURSTS} />
      <Scoreboard t={t} t0={6.9} t1={11.8} cells={[["BOX", 1, C.sun], ["DOOR", 0, C.tomato]]} />
      <Versus t={t} t0={11.0} left="BOX" right="DOOR" lc={C.sun} rc={C.tomato} />
      <LogoStamp t={t} t0={2.8} sub="THE WARDROBE OF DOOM · PART 1" />
      <EndCard t={t} t0={23.2} text="PART 2 →" />
      <AbsoluteFill style={{ background: "#fff", opacity: flashAt(t, FLASHES) }} />
      {t > STORY - 0.01 && <AbsoluteFill style={{ opacity: clamp((t - STORY) / 0.2) }}><Sequence from={Math.round(STORY * FPS)} layout="none"><Outro /></Sequence></AbsoluteFill>}
      <EpisodeAudio music="flatpack/music_ep5.wav" sfx={SFX} bubbles={BUBBLES} voice={VOICE} />
    </Stage>
  );
};
