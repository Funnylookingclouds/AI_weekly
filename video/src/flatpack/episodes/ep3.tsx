/** SOME ASSEMBLY RAGE – Ep. 3 "Is That… Your Baby?" (KNÄCK chair) – introduces Junior. */
import React from "react";
import { AbsoluteFill, Sequence, random, useCurrentFrame } from "remotion";
import { Arms, Face, StickerFilter, boxGeo, shade, type Expr } from "../../cast/rig";
import { C } from "../furni";
import type { FurniId } from "../furni";
import {
  type Bub, type BurstT, type CamKey, type Cue, type MoodKey, type MoveKey, type PieceDef, type Voice, type Who,
  EpisodeAudio, FPS, HEAD, INK, LogoStamp, Manual, Overlays, PalletBox, Piece, Stage, StepCounter, Versus,
  back, clamp, dustNode, fitBubbles, flashAt, furniNode, leftyNode, makeCam, makeSpeaking, moodAt, posAt,
} from "../kit";
import { Outro, OUTRO_LEN } from "../Outro";
import { Junior } from "../junior";
import VOICE_RAW from "../ep3.voice.json";

const VOICE = VOICE_RAW as Voice[];
const STORY = 30.5;
export const EP3_LEN = Math.round((STORY + OUTRO_LEN) * FPS);
const CHAIR = { x: 90, y: 90 };

const MOOD: Record<FurniId, MoodKey[]> = {
  gus: [[0, "love", "love"], [2.0, "happy", "joy"], [2.8, "love", "none"], [9.5, "scared", "sweat"], [11.1, "confused", "confused"], [13.4, "surprised", "none"], [14.6, "surprised", "shock"], [15.6, "love", "love"], [17.5, "laugh", "music"], [24.0, "happy", "none"], [26.7, "love", "love"]],
  duke: [[0, "neutral", "none"], [2.0, "happy", "none"], [2.8, "smug", "sparkle"], [3.9, "angry", "none"], [6.3, "angry", "rage"], [7.9, "angry", "storm"], [9.5, "surprised", "shock"], [11.1, "confused", "confused"], [13.4, "surprised", "none"], [14.6, "surprised", "shock"], [16.0, "scared", "sweat"], [17.5, "confused", "confused"], [21.2, "laugh", "music"], [24.0, "happy", "none"], [26.7, "laugh", "music"]],
  pia: [[0, "neutral", "none"], [2.0, "happy", "none"], [2.8, "angry", "none"], [3.9, "angry", "rage"], [6.3, "angry", "grawlix"], [7.9, "angry", "storm"], [9.5, "surprised", "shock"], [11.1, "confused", "confused"], [11.9, "scared", "sweat"], [13.4, "surprised", "none"], [14.6, "surprised", "shock"], [16.0, "scared", "sweat"], [18.9, "surprised", "shock"], [19.9, "angry", "storm"], [22.3, "angry", "grawlix"], [24.0, "angry", "none"], [26.7, "confused", "confused"]],
  lotta: [[0, "neutral", "zzz"], [16.0, "surprised", "shock"], [16.8, "neutral", "zzz"]],
};
const MOVE: Record<FurniId, MoveKey[]> = {
  gus: [[0, -430, 40, 0]],
  duke: [[0, -130, 140, 0]],
  pia: [[0, 310, 150, 0]],
  lotta: [[0, 600, 0, 0]],
};
const YAW: Record<FurniId, number> = { duke: 0.4, gus: 0.35, pia: -0.4, lotta: -0.4 };
const JMOVE: MoveKey[] = [[0, CHAIR.x, CHAIR.y, 0], [14.25, 90, 200, 0.35], [17.5, 170, 118, 1.2], [26.8, 240, 125, 0.4], [28.9, 1050, 230, 0.9]];

const BUBBLES: Bub[] = [
  { who: "gus", t0: 0.2, t1: 1.9, text: "It's… so… SMALL." },
  { who: "duke", t0: 2.8, t1: 3.8, text: "Back goes here." },
  { who: "pia", t0: 3.9, t1: 5.4, text: "No. The back goes HERE." },
  { who: "duke", t0: 6.3, t1: 7.9, text: "I've built a hundred chairs!", kind: "shout" },
  { who: "pia", t0: 7.9, t1: 9.4, text: "You've built ZERO chairs!", kind: "shout" },
  { who: "gus", t0: 9.5, t1: 11.0, text: "Careful! You're HURTING him!", kind: "shout" },
  { who: "duke+pia", t0: 11.1, t1: 11.8, text: "…Him?" },
  { who: "junior", t0: 14.6, t1: 15.5, text: "…Dad?" },
  { who: "gus", t0: 15.6, t1: 16.9, text: "He called me DAD!", kind: "shout" },
  { who: "junior", t0: 18.9, t1: 19.8, text: "…Mom?" },
  { who: "pia", t0: 19.9, t1: 21.1, text: "I'm a DRESSER!", kind: "shout" },
  { who: "duke", t0: 21.2, t1: 22.2, text: "Congrats, Mom." },
  { who: "lefty", t0: 25.2, t1: 26.6, text: "Uh… where do I go?" },
  { who: "junior", t0: 26.7, t1: 27.6, text: "Brother!", kind: "shout" },
  { who: "lefty", t0: 27.7, t1: 28.8, text: "…Oh no.", kind: "whisper" },
  { who: "pia", t0: 22.3, t1: 23.6, text: "#@%&!", kind: "grawlix" },
];
fitBubbles(BUBBLES, VOICE);
const speaking = makeSpeaking(BUBBLES, VOICE);

const CAM: CamKey[] = [
  [0, -400, -170, 1.6, 0], [2.0, -150, -220, 1.1, 0.4], [2.8, -130, -200, 1.45, 0], [3.9, 310, -170, 1.45, 0], [6.3, 90, -230, 1.0, 0],
  [7.9, 310, -170, 1.55, 0], [9.4, 90, -150, 1.25, 0], [9.5, -430, -160, 1.6, 0], [11.1, 90, -230, 1.05, 0], [13.4, 90, -60, 1.5, 0.3],
  [14.6, 90, 20, 1.9, 0.4], [15.6, -430, -160, 1.5, 0], [16.6, 90, -230, 0.95, 0.3], [17.5, 210, -40, 1.3, 0.4], [19.9, 310, -170, 1.6, 0],
  [21.2, -130, -200, 1.5, 0], [22.3, 310, -170, 1.6, 0], [24.0, 380, 60, 1.2, 0.6], [25.0, 310, 100, 1.65, 0.4], [28.8, 90, -230, 0.95, 0.3],
];
const cam = makeCam(CAM, [[5.4, 18], [8.0, 12], [9.4, 14], [13.4, 10], [16.0, 12], [22.3, 14]]);
const FLASHES = [8.0, 22.3];
const BURSTS: BurstT[] = [
  [2.05, -150, -330, "RIIIP!", C.mint, 6], [9.4, 90, -260, "CLUNK!", "#cbd5e1", -6], [13.4, 90, -300, "KA-CHUNK!", C.sky, 5],
  [16.0, 90, -560, "AAAAAH!", C.tomato, -4], [26.7, 250, -200, "", C.sun, 0],
].filter((b) => b[3] !== "") as BurstT[];
const SFX: Cue[] = [
  [0.3, "brand/boing.wav", 0.3], [2.0, "sfx_rip", 0.9], [2.25, "sfx_pop", 0.6], [2.45, "sfx_pop", 0.6], [5.4, "sfx_thunk", 0.8], [6.6, "sfx_ratchet", 0.6],
  [6.9, "sfx_chunk", 0.6], [8.0, "sfx_thunder", 0.9], [9.4, "sfx_chunk", 0.9], [11.9, "sfx_whoosh", 0.6], [12.1, "sfx_pop", 0.4], [12.4, "sfx_pop", 0.4],
  [12.7, "sfx_pop", 0.4], [13.0, "sfx_pop", 0.4], [13.4, "sfx_chunk", 1], [14.3, "sfx_shimmer", 0.7], [15.6, "brand/ding.wav", 0.5], [16.0, "sfx_scratch", 0.6],
  [17.5, "sfx_roll", 0.4], [22.3, "sfx_thunder", 0.8], [24.0, "sfx_roll", 0.8], [28.9, "sfx_whoosh", 0.7], [28.9, "sfx_roll", 0.8],
];

// --------------------------------------------------------------- KNÄCK pieces (chair at CHAIR)
const backPanel = (w: number, h: number) => (
  <g>
    <path d={`M${-w / 2} ${-h / 2} l 12 -8 h ${w} v ${h} l -12 8 Z`} fill={C.woodD} stroke={INK} strokeWidth={4} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill={C.mint} stroke={INK} strokeWidth={5} />
    {[-40, 0, 40].map((x) => <rect key={x} x={x - 9} y={-h / 2 + 22} width={18} height={h - 44} rx={9} fill={shade(C.mint, 0.85)} stroke={INK} strokeWidth={3} />)}
  </g>
);
const seatDraw = (s: { r: number }) => (
  <g>
    <rect x={-85} y={-13} width={170} height={26} rx={6} fill={C.woodD} stroke={INK} strokeWidth={5} />
    <rect x={-80} y={-30} width={160} height={20} rx={10} fill={C.sun} stroke={INK} strokeWidth={5} />
  </g>
);
const leg = (id: string, x: number, i: number, snap: number): PieceDef => ({ id, w: 18, h: 120, built: { x, y: -60, r: 0 }, pile: { x: -330 + i * 36, y: -10, r: 80 + i * 4 }, fall: { x, y: 0, r: 90 }, color: C.wood, ev: [[0, "box"], [2.2 + i * 0.06, "pile"], [snap, "built"]] });
const PIECES: PieceDef[] = [
  leg("l3", -50, 2, 13.4), leg("l4", 50, 3, 13.4),
  { id: "back", w: 150, h: 140, built: { x: 0, y: -205, r: 0 }, box: { x: 0, y: -200, r: 0 }, pile: { x: 0, y: -200, r: 0 }, fall: { x: 0, y: 0, r: 90 }, color: C.mint, ev: [[0, "box"], [9.4, "built"]], draw: () => backPanel(150, 140) },
  { id: "seat", w: 170, h: 26, built: { x: 0, y: -132, r: 0 }, pile: { x: -230, y: -20, r: -8 }, fall: { x: 0, y: 0, r: 0 }, color: C.sun, ev: [[0, "box"], [2.3, "pile"], [9.4, "upside"]], draw: seatDraw },
  leg("l1", -70, 0, 6.6), leg("l2", 70, 1, 6.9),
];

const Hearts: React.FC<{ t: number; t0: number; x: number; y: number }> = ({ t, t0, x, y }) => {
  const a = t - t0;
  if (a < 0 || a > 2) return null;
  const hp = (s: number) => `M0 ${s * 0.35} C ${-s * 1.1} ${-s * 0.35} ${-s * 0.45} ${-s * 1.05} 0 ${-s * 0.45} C ${s * 0.45} ${-s * 1.05} ${s * 1.1} ${-s * 0.35} 0 ${s * 0.35} Z`;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {[...Array(40)].map((_, i) => {
        const ang = random(`ha${i}`) * Math.PI * 2, sp = 500 + random(`hs${i}`) * 900;
        const px = x + Math.cos(ang) * sp * a, py = y + Math.sin(ang) * sp * a - 200 * a + 300 * a * a;
        return <path key={i} d={hp(26 + random(`hz${i}`) * 26)} transform={`translate(${px} ${py}) rotate(${Math.sin(a * 8 + i) * 20})`} fill={[C.gum, C.tomato, "#fff"][i % 3]} stroke={INK} strokeWidth={4} opacity={1 - a / 2} />;
      })}
    </svg>
  );
};

const ManualInsert: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const a = t - 11.9;
  if (a < 0 || a > 1.4) return null;
  const inP = back(clamp(a / 0.2)), out = clamp((a - 1.2) / 0.2);
  const flip = Math.abs(Math.cos(((a % 0.25) / 0.25) * Math.PI));
  return (
    <AbsoluteFill style={{ background: `rgba(30,27,75,${0.45 * (1 - out)})` }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <g transform={`translate(540 900) scale(${4.2 * inP * (1 - out)}) rotate(4)`}><g transform={`scale(${a > 0.9 ? 1 : 0.25 + flip * 0.75} 1)`}><Manual f={f} name="KNÄCK" page={a > 0.9 ? "eyes" : "cover"} /></g></g>
      </svg>
    </AbsoluteFill>
  );
};

export const FlatpackEp3: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cm = cam(t);
  const items: { y: number; node: React.ReactNode }[] = [];
  items.push({ y: -40, node: <PalletBox key="box" t={t} name="KNÄCK" flap={1.9} flat={4.0} x={-170} /> });
  const born = t >= 14.2;
  if (!born) items.push({ y: CHAIR.y, node: <g key="chair" transform={`translate(${CHAIR.x} ${CHAIR.y})`}>{PIECES.map((p) => <Piece key={p.id} def={p} t={t} />)}</g> });

  const pos = { gus: posAt(MOVE.gus, t), duke: posAt(MOVE.duke, t), pia: posAt(MOVE.pia, t), lotta: posAt(MOVE.lotta, t) };
  (Object.keys(MOOD) as FurniId[]).forEach((id) => {
    const m = moodAt(MOOD[id], t), p = pos[id];
    let hop = p.walk + (m.since < 0.35 ? Math.sin((m.since / 0.35) * Math.PI) * 55 : 0);
    if ((id === "duke" || id === "pia") && t > 3.9 && t < 9.4) hop += Math.abs(Math.sin(t * 5 + (id === "pia" ? 1.5 : 0))) * 26;
    if ((id === "duke" || id === "pia") && t > 16.0 && t < 17.4) hop += Math.abs(Math.sin(t * 14)) * 40;
    if (id === "gus" && t > 15.6 && t < 18) hop += Math.abs(Math.sin(t * 8)) * 40;
    items.push({ y: p.y, node: furniNode(id, p, { ...m, frame, yaw: YAW[id], talk: speaking(id, t), hop }) });
  });
  // tug-of-war backrest
  if (t > 2.8 && t < 9.4) {
    const x = t < 3.9 ? -20 : CHAIR.x + Math.sin((t - 3.9) * 4.5) * 120 * Math.min(1, (9.4 - t) / 0.8);
    items.push({ y: 160, node: <g key="tug" transform={`translate(${x} ${CHAIR.y - 200}) rotate(${Math.sin(t * 9) * 6})`}>{backPanel(150, 140)}</g> });
  }
  // Junior
  if (born) {
    const jp = posAt(JMOVE, t);
    const awake = t >= 14.4;
    const jexpr: Expr = t < 15.6 ? "neutral" : t < 18.9 ? "love" : t < 21.2 ? "happy" : t < 24 ? "laugh" : t < 26.7 ? "neutral" : "happy";
    const hop = t > 26.7 && t < 27.6 ? Math.abs(Math.sin(t * 10)) * 40 : 0;
    items.push({ y: jp.y, node: <g key="junior" transform={`translate(${jp.x} ${jp.y - hop}) scale(1.45) translate(-150 -392)`}><Junior f={frame} expr={jexpr} talk={speaking("junior", t)} awake={awake} walk={jp.walk > 0 ? t : 0} yaw={t > 17.5 ? 0.3 : 0} /></g> });
    const d = dustNode(t, 14.2, CHAIR.x, CHAIR.y, "poof"); if (d) items.push({ y: CHAIR.y + 5, node: d });
  }
  const lefty = leftyNode(t, frame, 24.0, 380, 262, speaking("lefty", t), 28.8);
  if (lefty) items.push({ y: 262, node: lefty });

  const jp = posAt(JMOVE, t);
  const heads = (w: Who) => w === "junior" ? { x: jp.x, y: jp.y - 330 } : w === "lefty" ? { x: 380, y: 262 - HEAD.lefty } : { x: pos[w as FurniId].x, y: pos[w as FurniId].y - HEAD[w] };
  const gusScreen = { x: 540 + (pos.gus.x - cm.x) * cm.z, y: 960 + (pos.gus.y - 200 - cm.y) * cm.z };
  const n = t < 6.6 ? null : t < 6.9 ? 1 : t < 9.4 ? 2 : t < 11.9 ? 4 : t < 13.4 ? 1 : t < 22 ? 6 : null;
  const angry = (t > 3.9 && t < 11.0) || (t > 19.9 && t < 24.0);
  return (
    <Stage t={t} cam={cm} items={items} wall={["#ffe0ec", "#ffcfe0"]} angry={angry} storm={angry ? 0.1 : 0}>
      <Overlays t={t} cam={cm} bubbles={BUBBLES} voice={VOICE} heads={heads} bursts={BURSTS} />
      <StepCounter t={t} n={n} of={6} bad={t > 11.9 && t < 13.4} />
      <Hearts t={t} t0={15.6} x={gusScreen.x} y={gusScreen.y} />
      <ManualInsert t={t} f={frame} />
      <Versus t={t} t0={5.4} left="DUKE" right="PIA" />
      <LogoStamp t={t} t0={2.0} sub="EP. 3 · IS THAT… YOUR BABY?" />
      <AbsoluteFill style={{ background: "#fff", opacity: flashAt(t, FLASHES) }} />
      {t > STORY - 0.01 && <AbsoluteFill style={{ opacity: clamp((t - STORY) / 0.2) }}><Sequence from={Math.round(STORY * FPS)} layout="none"><Outro /></Sequence></AbsoluteFill>}
      <EpisodeAudio music="flatpack/music_ep3.wav" sfx={SFX} bubbles={BUBBLES} voice={VOICE} grawlix={[{ t: 22.3, whos: ["pia"] }]} />
    </Stage>
  );
};
