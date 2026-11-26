/** SOME ASSEMBLY RAGE – Ep. 9 "Drill Day" (VÄLTA wall shelf). */
import React from "react";
import { AbsoluteFill, Sequence, random, useCurrentFrame } from "remotion";
import type { Expr } from "../../cast/rig";
import { Alvin, C, LUCKY } from "../furni";
import type { FurniId } from "../furni";
import {
  type Bub, type BurstT, type CamKey, type Cue, type MoodKey, type MoveKey, type PieceDef, type Voice, type Who,
  Confetti, EpisodeAudio, FPS, HEAD, INK, LogoStamp, Overlays, Piece, Scoreboard, Stage,
  clamp, ease, fitBubbles, flashAt, furniNode, leftyNode, lerp, makeCam, makeSpeaking, moodAt, posAt,
} from "../kit";
import { Junior } from "../junior";
import { Outro, OUTRO_LEN } from "../Outro";
import VOICE_RAW from "../ep9.voice.json";

const VOICE = VOICE_RAW as Voice[];
const STORY = 20.5;
export const EP9_LEN = Math.round((STORY + OUTRO_LEN) * FPS);
const SHELF = { x: 60, y: -470 }, HOLE = { x: 40, y: -300 };
const PSSH = 3.1, PLUG = 4.7, CLOCK = 5.8, LEVEL = 12.8, TIP = 15.3, UNPLUG = 16.1;

const MOOD: Record<FurniId, MoodKey[]> = {
  pia: [[0, "smug", "sparkle"], [1.6, "angry", "none"], [PSSH, "surprised", "shock"], [3.3, "angry", "storm"], [PLUG, "neutral", "none"], [6.3, "laugh", "music"], [6.8, "angry", "storm"], [7.6, "angry", "grawlix"], [8.6, "angry", "storm"], [10.0, "angry", "rage"], [11.2, "angry", "grawlix"], [LEVEL, "happy", "joy"], [TIP, "surprised", "shock"], [UNPLUG, "angry", "grawlix"], [17.0, "scared", "sweat"]],
  duke: [[0, "neutral", "none"], [1.6, "smug", "sparkle"], [2.7, "happy", "music"], [PSSH, "surprised", "shock"], [PLUG, "happy", "none"], [6.3, "confused", "confused"], [6.8, "angry", "rage"], [7.6, "angry", "storm"], [8.6, "angry", "grawlix"], [10.0, "angry", "rage"], [11.2, "angry", "storm"], [LEVEL, "happy", "joy"], [TIP, "surprised", "shock"], [UNPLUG, "angry", "storm"], [17.0, "confused", "confused"]],
  gus: [[0, "happy", "none"], [PSSH, "surprised", "shock"], [4.2, "happy", "joy"], [4.9, "happy", "sparkle"], [6.8, "happy", "music"], [LEVEL, "happy", "joy"], [TIP, "scared", "sweat"], [UNPLUG, "surprised", "shock"], [17.0, "sad", "sad"]],
  lotta: [[0, "neutral", "zzz"], [15.6, "surprised", "shock"], [16.4, "neutral", "zzz"]],
};
const MOVE: Record<FurniId, MoveKey[]> = {
  pia: [[0, 250, 0, 0]],
  duke: [[0, -110, -20, 0]],
  gus: [[0, -470, 110, 0], [4.2, 40, -60, 0.5], [UNPLUG, -330, 130, 0.5]],
  lotta: [[0, 660, -10, 0]],
};
const YAW: Record<FurniId, number> = { duke: 0.45, gus: -0.1, pia: -0.4, lotta: -0.4 };
const JMOVE: MoveKey[] = [[0, -300, 210, 0], [14.0, -50, 30, 0.5]];

const BUBBLES: Bub[] = [
  { who: "pia", t0: 0.2, t1: 1.5, text: "First, we find the stud." },
  { who: "duke", t0: 1.6, t1: 2.6, text: "I AM the stud." },
  { who: "pia", t0: 3.3, t1: 4.2, text: "THAT'S A PIPE!", kind: "shout" },
  { who: "gus", t0: 4.9, t1: 5.7, text: "Fixed it!" },
  { who: "alvin", t0: 8.8, t1: 12.3, text: "Left! No, MY left!", kind: "shout" },
  { who: "pia", t0: 13.0, t1: 14.0, text: "Perfectly level." },
  { who: "junior", t0: 14.4, t1: 15.1, text: "Look!" },
  { who: "lefty", t0: 18.2, t1: 19.8, text: "Uh… was I holding that up?" },
];
fitBubbles(BUBBLES, VOICE);
const speaking = makeSpeaking(BUBBLES, VOICE);

const CAM: CamKey[] = [
  [0, 250, -250, 1.5, 0], [1.6, -110, -280, 1.5, 0], [2.7, 0, -330, 1.0, 0.3], [4.9, 40, -200, 1.45, 0.3], [CLOCK, -60, -520, 1.05, 0.4],
  [6.4, -110, -280, 1.5, 0.2], [6.8, 60, -420, 1.05, 0.4], [8.8, 60, -480, 1.45, 0.4], [12.4, 60, -420, 1.0, 0.3], [14.0, 0, -330, 1.0, 0.3],
  [TIP, 40, -350, 0.92, 0.2], [17.0, 260, 60, 1.2, 0.6], [18.0, 200, 100, 1.8, 0.4], [19.9, 0, -300, 0.95, 0.3],
];
const cam = makeCam(CAM, [[1.7, 6], [2.8, 8], [PSSH, 14], [PLUG, 10], [6.25, 22], [7.4, 6], [8.6, 6], [10.0, 8], [TIP + 0.3, 20], [15.9, 26], [UNPLUG, 12]]);
const FLASHES = [7.6, 11.2, UNPLUG];
const BURSTS: BurstT[] = [
  [1.7, -40, -380, "BRRRRT!", C.sun, -6], [PSSH, 120, -430, "PSSSHHT!", C.sky, 6], [6.25, -110, -480, "CLONK!", C.gum, -8],
  [TIP + 0.3, 60, -620, "CREAK…", "#cbd5e1", 4], [15.9, 0, -300, "CRASH!", C.tomato, -6], [UNPLUG, 40, -420, "PSSSHHT!", C.sky, -6],
];
const SFX: Cue[] = [
  [0.3, "sfx_pop", 0.25], [0.6, "sfx_pop", 0.25], [0.9, "sfx_pop", 0.25], [1.2, "sfx_pop", 0.3], [1.7, "sfx_ratchet", 0.9], [2.7, "sfx_ratchet", 0.9],
  [PSSH, "sfx_rip", 0.7], [PSSH, "sfx_whoosh", 0.8], [4.2, "sfx_roll", 0.5], [PLUG, "sfx_thunk", 0.8], [CLOCK, "sfx_whoosh", 0.5], [6.25, "sfx_bonk", 1],
  [6.3, "brand/boing.wav", 0.4], [7.4, "sfx_ratchet", 0.6], [7.6, "sfx_thunder", 0.5], [8.6, "sfx_ratchet", 0.6], [10.0, "sfx_chunk", 0.8], [11.2, "sfx_thunder", 0.5],
  [12.0, "sfx_pop", 0.5], [LEVEL, "brand/ding.wav", 0.7], [13.0, "sfx_pop", 0.7], [14.8, "sfx_pop", 0.5], [TIP + 0.3, "sfx_scratch", 0.4], [15.9, "sfx_crash", 1],
  [UNPLUG, "sfx_whoosh", 0.8], [UNPLUG, "sfx_rip", 0.6], [17.0, "sfx_roll", 0.8],
];
const lp = (x: number, y: number, r: number) => ({ x, y, r });
const PIECES: PieceDef[] = [
  { id: "bl", w: 20, h: 70, built: lp(-110, 40, 0), pile: lp(-160, 520, 90), fall: lp(-200, 540, 120), color: "#cbd5e1", ev: [[0, "pile"], [7.4, "built"], [15.9, "fall"]] },
  { id: "br", w: 20, h: 70, built: lp(110, 40, 0), pile: lp(-120, 525, 80), fall: lp(150, 545, 70), color: "#cbd5e1", ev: [[0, "pile"], [8.6, "built"], [15.9, "fall"]] },
  { id: "board", w: 320, h: 22, built: lp(0, 0, 0), pile: lp(-40, 535, 3), fall: lp(-20, 530, -8), color: C.sun, ev: [[0, "pile"], [10.0, "built"], [15.9, "fall"]] },
];

const Drill: React.FC<{ spin: boolean; f: number }> = ({ spin, f }) => (
  <g>
    <rect x={-10} y={0} width={34} height={64} rx={10} fill="#1f2937" stroke={INK} strokeWidth={4} />
    <rect x={-30} y={-34} width={110} height={44} rx={16} fill={C.tomato} stroke={INK} strokeWidth={5} />
    <rect x={78} y={-20} width={20} height={16} fill="#475569" stroke={INK} strokeWidth={3} />
    <g transform={`translate(98 -12) scale(1 ${spin ? Math.cos(f) : 1})`}><path d="M0 -5 L50 -2 L56 0 L50 2 L0 5 Z" fill="#cbd5e1" stroke={INK} strokeWidth={3} />{[10, 22, 34].map((x) => <line key={x} x1={x} y1={-4} x2={x + 6} y2={4} stroke={INK} strokeWidth={2} />)}</g>
  </g>
);
const StudFinder: React.FC<{ f: number }> = ({ f }) => (
  <g><rect x={-34} y={-50} width={68} height={100} rx={16} fill={C.sun} stroke={INK} strokeWidth={5} />
    <rect x={-22} y={-36} width={44} height={30} rx={4} fill="#0f172a" /><text x={0} y={-15} textAnchor="middle" fontFamily={LUCKY} fontSize={14} fill="#5eead4">STUD?</text>
    <circle cx={0} cy={24} r={9} fill={Math.floor(f / 10) % 2 ? C.tomato : "#7f1d1d"} stroke={INK} strokeWidth={3} /></g>
);
const Clock: React.FC<{ spin: number }> = ({ spin }) => (
  <g><circle r={110} fill="#fff" stroke={INK} strokeWidth={10} /><circle r={92} fill={C.cream} />
    {[...Array(12)].map((_, i) => <circle key={i} cx={Math.sin((i / 12) * Math.PI * 2) * 78} cy={-Math.cos((i / 12) * Math.PI * 2) * 78} r={6} fill={INK} />)}
    <line x1={0} y1={0} x2={Math.sin(spin / 12) * 45} y2={-Math.cos(spin / 12) * 45} stroke={INK} strokeWidth={10} strokeLinecap="round" />
    <line x1={0} y1={0} x2={Math.sin(spin) * 70} y2={-Math.cos(spin) * 70} stroke={C.tomato} strokeWidth={6} strokeLinecap="round" /></g>
);
const Water: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  if (t < t0 || t > t1 + 1.2) return null;
  return <g>{[...Array(80)].map((_, i) => {
    const life = 1.1;
    const a = ((t - t0) + (i / 80) * life) % life;
    const birth = t - a;
    if (birth < t0 || birth > t1) return null;
    const vx = 260 + random(`wx${i}`) * 420, vy = -520 - random(`wy${i}`) * 260;
    const x = HOLE.x + vx * a * (i % 3 === 0 ? -0.6 : 1), y = HOLE.y + vy * a + 1300 * a * a;
    return <path key={i} d="M0 -14 q -10 16 0 22 q 10 -6 0 -22" transform={`translate(${x} ${y}) rotate(${a * 200}) scale(2.2)`} fill="#7dd3fc" stroke={INK} strokeWidth={3} opacity={1 - a / life} />;
  })}</g>;
};

export const FlatpackEp9: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cm = cam(t);
  const items: { y: number; node: React.ReactNode }[] = [];
  // wall shelf (tips at TIP)
  const tip = t < TIP ? 0 : t < 15.9 ? -38 * ease(clamp((t - TIP) / 0.6)) : 0;
  const decor = t > 12.0 && t < 15.9;
  items.push({ y: -75, node: <g key="shelf" transform={`translate(${SHELF.x} ${SHELF.y})`}>
    <g transform={`rotate(${tip} 110 0)`}>{PIECES.map((p) => <Piece key={p.id} def={p} t={t} />)}
      {decor && <g>{[["#4CC9F0", -120, 70], ["#F15BB5", -96, 60], ["#3DDC97", -74, 76]].map(([c, x, h], i) => <rect key={i} x={Number(x)} y={-11 - Number(h)} width={20} height={Number(h)} rx={3} fill={String(c)} stroke={INK} strokeWidth={3} transform={`scale(${clamp((t - 12.0 - i * 0.1) / 0.2)})`} />)}
        <g transform={`translate(80 -11) scale(${clamp((t - 12.3) / 0.2)})`}><rect x={-26} y={-44} width={52} height={44} rx={8} fill={C.tomato} stroke={INK} strokeWidth={4} />{[-1, 0, 1].map((s) => <ellipse key={s} cx={s * 16} cy={-66} rx={10} ry={26} fill={C.mint} stroke={INK} strokeWidth={3} transform={`rotate(${s * 22} ${s * 16} -44)`} />)}</g>
        {t > 14.8 && <rect x={-150} y={-40} width={14} height={30} rx={2} fill={C.sun} stroke={INK} strokeWidth={3} />}
        {t > 12.6 && <g transform="translate(0 -24)"><rect x={-60} y={-12} width={120} height={24} rx={6} fill={C.mint} stroke={INK} strokeWidth={4} /><rect x={-16} y={-6} width={32} height={12} rx={6} fill="#ecfccb" stroke={INK} strokeWidth={2} /><circle cx={t > LEVEL ? 0 : -10 + Math.sin(t * 12) * 6} cy={0} r={4} fill={C.sun} /></g>}
      </g>}
    </g>
  </g> });
  // hole + water
  if (t > 2.9) items.push({ y: -74, node: <circle key="hole" cx={HOLE.x} cy={HOLE.y} r={10} fill="#1f2937" stroke={INK} strokeWidth={3} /> });
  items.push({ y: 500, node: <g key="water"><Water t={t} t0={PSSH} t1={PLUG} /><Water t={t} t0={UNPLUG} t1={STORY + 5} /></g> });
  // wall clock: hangs, falls on Duke at CLOCK, lands on the floor
  {
    const d = posAt(MOVE.duke, t);
    let cx = 120, cy = -1250, r = 0, s = 1;
    if (t > CLOCK) { const a = clamp((t - CLOCK) / 0.45); cx = lerp(120, d.x, a); cy = lerp(-1250, d.y - 420, a * a); r = a * 200; s = lerp(1, 0.55, a); }
    if (t > CLOCK + 0.45) { const a = clamp((t - CLOCK - 0.45) / 0.5); cx = lerp(d.x, d.x + 160, a); cy = lerp(d.y - 420, 90, a) - Math.sin(a * Math.PI) * 120; r = 200 + a * 300; s = 0.55; }
    items.push({ y: t > CLOCK + 0.5 ? 95 : -90, node: <g key="clock" transform={`translate(${cx} ${cy}) rotate(${r}) scale(${s})`}><Clock spin={t * 6} /></g> });
  }
  const pos = { pia: posAt(MOVE.pia, t), duke: posAt(MOVE.duke, t), gus: posAt(MOVE.gus, t), lotta: posAt(MOVE.lotta, t) };
  (Object.keys(MOOD) as FurniId[]).forEach((id) => {
    const m = moodAt(MOOD[id], t), p = pos[id];
    let hop = p.walk + (m.since < 0.35 ? Math.sin((m.since / 0.35) * Math.PI) * 55 : 0);
    if (id === "duke" && t > 6.8 && t < 10.4) hop += Math.abs(Math.sin(t * 6)) * 60; // reaching up to the brackets
    if ((id === "duke" || id === "pia") && t > 6.8 && t < 12.4) hop += Math.abs(Math.sin(t * 7 + (id === "pia" ? 1 : 0))) * 16;
    if (t > LEVEL && t < 14 && id !== "lotta") hop += Math.abs(Math.sin(t * 8 + id.length)) * 40;
    items.push({ y: p.y, node: furniNode(id, p, { ...m, frame, yaw: YAW[id], talk: speaking(id, t), hop }) });
  });
  // props in hands
  const d = pos.duke, pp = pos.pia;
  if (t < 6.6) items.push({ y: d.y + 2, node: <g key="drill" transform={`translate(${d.x + 120} ${d.y - 260}) rotate(${t > 2.6 && t < PSSH ? -8 : 0})`}><Drill spin={(t > 1.6 && t < 2.2) || (t > 2.6 && t < PSSH)} f={frame} /></g> });
  if (t < 3.0) items.push({ y: pp.y + 2, node: <g key="stud" transform={`translate(${pp.x - 140} ${pp.y - 200}) rotate(${Math.sin(t * 6) * 10})`}><StudFinder f={frame} /></g> });
  if (t > 2.6 && t < PSSH) items.push({ y: 300, node: <g key="sparks">{[...Array(8)].map((_, i) => { const a = ((t * 5 + i / 8) % 1); return <line key={i} x1={HOLE.x} y1={HOLE.y} x2={HOLE.x + Math.cos(i) * 80 * a} y2={HOLE.y + Math.sin(i * 1.7) * 60 * a} stroke={C.sun} strokeWidth={5} opacity={1 - a} />; })}</g> });
  // Alvin screwing the brackets
  if (t > 6.8 && t < 12.4) {
    const onRight = t > 8.6;
    const ax = SHELF.x + (onRight ? 110 : -110) + 30, ay = SHELF.y + 70;
    items.push({ y: -70, node: <g key="alvin" transform={`translate(${ax} ${ay})`}><Alvin f={frame} spin={(t * 900) % 360} size={0.75} /></g> });
  }
  // Junior: walks under the shelf, hops up and places ONE book
  {
    const jp = posAt(JMOVE, t);
    const hop = t > 14.5 && t < 15.1 ? Math.sin(((t - 14.5) / 0.6) * Math.PI) * 240 : 0;
    const jexpr: Expr = t < TIP ? "happy" : t < 17 ? "scared" : "sad";
    items.push({ y: jp.y, node: <g key="junior" transform={`translate(${jp.x} ${jp.y - hop}) scale(1.2) translate(-150 -392)`}><Junior f={frame} expr={jexpr} talk={speaking("junior", t)} awake walk={jp.walk > 0 ? t : 0} yaw={0.2} /></g> });
  }
  const lefty = leftyNode(t, frame, 17.0, 200, 262, speaking("lefty", t));
  if (lefty) items.push({ y: 262, node: lefty });

  const jp = posAt(JMOVE, t);
  const heads = (w: Who) => {
    if (w === "alvin") return { x: SHELF.x + (t > 8.6 ? 140 : -80), y: SHELF.y - 40 };
    if (w === "junior") return { x: jp.x, y: jp.y - 280 };
    if (w === "lefty") return { x: 200, y: 262 - HEAD.lefty };
    return { x: pos[w as FurniId].x, y: pos[w as FurniId].y - HEAD[w] };
  };
  const args = Math.min(99, Math.max(1, Math.floor((t - 7.0) * 9)));
  return (
    <Stage t={t} cam={cm} items={items} wall={["#ffe4cc", "#ffd6b0"]} angry={t > 6.8 && t < 12.4} storm={t > 6.8 && t < 12.4 ? 0.08 : 0} hideClock>
      <Overlays t={t} cam={cm} bubbles={BUBBLES} voice={VOICE} heads={heads} bursts={BURSTS} />
      <Scoreboard t={t} t0={7.0} t1={12.4} cells={[["BRACKETS", t > 8.6 ? 2 : 1, C.sky], ["ARGUMENTS", args, C.tomato]]} />
      <Confetti t={t} t0={13.0} />
      <LogoStamp t={t} t0={1.7} sub="EP. 9 · DRILL DAY" />
      <AbsoluteFill style={{ background: "#fff", opacity: flashAt(t, FLASHES) }} />
      {t > STORY - 0.01 && <AbsoluteFill style={{ opacity: clamp((t - STORY) / 0.2) }}><Sequence from={Math.round(STORY * FPS)} layout="none"><Outro /></Sequence></AbsoluteFill>}
      <EpisodeAudio music="flatpack/music_ep9.wav" sfx={SFX} bubbles={BUBBLES} voice={VOICE} />
    </Stage>
  );
};
