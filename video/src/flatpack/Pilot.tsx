/**
 * SOME ASSEMBLY RAGE – Pilot Short "BJÖRKSNÄP" (42.5 s, 9:16, 60 fps).
 * Four furniture characters unpack a pallet, fight about the manual, screw, bonk, rage – Lotta the lamp
 * finishes it in 2 seconds – then Lefty the leftover screw shows up and the shelf collapses. Outro: follow for more.
 * Everything is driven by the timelines below (seconds).
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, random } from "remotion";
import type { Expr } from "../cast/rig";
import { Alvin, C, Furni, LUCKY, Lefty, type Emote, type FurniId } from "./furni";
import { Outro, OUTRO_LEN } from "./Outro";

export const FPS = 60;
const STORY = 39.0;
export const PILOT_LEN = Math.round((STORY + OUTRO_LEN) * FPS);
const INK = C.ink;

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const back = (p: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

// =============================================================================== timelines
type Who = FurniId | "alvin" | "lefty" | "all";
const COLOR: Record<Who, string> = { duke: C.tomato, pia: C.teal, gus: C.grape, lotta: C.gum, alvin: "#94a3b8", lefty: "#94a3b8", all: C.sun };

/** expression + emote keys */
const MOOD: Record<FurniId, [number, Expr, Emote][]> = {
  duke: [[0, "neutral", "none"], [0.8, "surprised", "shock"], [2.6, "happy", "joy"], [5.2, "smug", "sparkle"], [7.0, "neutral", "none"], [8.7, "smug", "sparkle"], [11.6, "smug", "none"], [12.4, "happy", "music"], [15.4, "surprised", "shock"], [16.9, "confused", "confused"], [18.6, "surprised", "none"], [19.8, "angry", "rage"], [23.3, "angry", "grawlix"], [24.4, "surprised", "shock"], [25.8, "neutral", "none"], [27.2, "surprised", "shock"], [29.4, "confused", "confused"], [30.6, "laugh", "music"], [33.0, "happy", "none"], [34.2, "confused", "confused"], [35.6, "scared", "sweat"], [36.7, "angry", "storm"]],
  pia: [[0, "neutral", "none"], [0.8, "surprised", "shock"], [2.6, "happy", "joy"], [7.0, "smug", "none"], [8.7, "surprised", "shock"], [10.0, "angry", "rage"], [11.6, "angry", "storm"], [12.4, "angry", "none"], [14.7, "angry", "rage"], [16.9, "angry", "storm"], [18.6, "scared", "sweat"], [19.8, "angry", "grawlix"], [21.4, "angry", "storm"], [22.4, "angry", "grawlix"], [24.4, "surprised", "shock"], [25.8, "neutral", "none"], [27.2, "surprised", "shock"], [29.4, "love", "love"], [30.6, "happy", "joy"], [32.3, "smug", "none"], [34.2, "confused", "confused"], [35.6, "scared", "sweat"], [36.7, "angry", "grawlix"]],
  gus: [[0, "neutral", "zzz"], [0.8, "surprised", "shock"], [2.6, "love", "love"], [5.2, "happy", "music"], [7.0, "neutral", "none"], [10.0, "scared", "sweat"], [12.4, "happy", "music"], [15.4, "confused", "confused"], [18.0, "happy", "joy"], [19.8, "happy", "sparkle"], [21.4, "sad", "sad"], [24.3, "surprised", "shock"], [25.8, "neutral", "none"], [27.2, "surprised", "shock"], [29.4, "love", "love"], [30.6, "laugh", "music"], [34.2, "confused", "confused"], [35.6, "scared", "sweat"], [36.7, "sad", "sad"]],
  lotta: [[0, "neutral", "zzz"], [0.8, "surprised", "shock"], [2.0, "neutral", "zzz"], [25.8, "neutral", "none"], [27.2, "smug", "sparkle"], [30.6, "happy", "joy"], [34.2, "neutral", "none"], [36.7, "smug", "sparkle"]],
};

/** movement waypoints: [t, x, y, duration] */
const MOVE: Record<FurniId, [number, number, number, number][]> = {
  duke: [[0, -400, 60, 0], [6.6, -180, 90, 0.8]],
  gus: [[0, -150, 210, 0], [6.6, -420, 215, 0.8], [18.0, -70, 235, 0.6], [20.6, -330, 205, 0.5], [24.3, -110, 240, 0.4]],
  pia: [[0, 260, 170, 0], [6.6, 260, 150, 0.6]],
  lotta: [[0, 500, 40, 0], [26.9, 340, 20, 0.7]],
};
const YAW: Record<FurniId, number> = { duke: 0.32, gus: 0.25, pia: -0.3, lotta: -0.3 };
const HEAD: Record<Who, number> = { duke: 360, pia: 270, gus: 260, lotta: 405, alvin: 75, lefty: 95, all: 0 };

type Bub = { who: Who; t0: number; t1: number; text: string; kind?: "say" | "shout" | "whisper" | "grawlix" };
const BUBBLES: Bub[] = [
  { who: "duke", t0: 1.0, t1: 2.4, text: "IT'S HERE!!!", kind: "shout" },
  { who: "gus", t0: 3.7, t1: 5.1, text: "I LOVE FLAT-PACK DAY!" },
  { who: "duke", t0: 5.3, t1: 6.7, text: "Five minutes. Tops." },
  { who: "pia", t0: 7.2, t1: 8.6, text: "Step one: READ the manual." },
  { who: "duke", t0: 8.7, t1: 10.0, text: "Manuals are a SUGGESTION." },
  { who: "alvin", t0: 13.0, t1: 14.2, text: "Ow. Ow. OW!" },
  { who: "pia", t0: 15.4, t1: 16.8, text: "THAT'S BACKWARDS!", kind: "shout" },
  { who: "duke", t0: 16.9, t1: 18.0, text: "It's… a design choice." },
  { who: "gus", t0: 20.0, t1: 21.2, text: "Fixed it!" },
  { who: "duke", t0: 21.5, t1: 22.5, text: "YOU BROKE IT!", kind: "shout" },
  { who: "pia", t0: 22.4, t1: 23.4, text: "YOU DIDN'T READ!", kind: "shout" },
  { who: "duke", t0: 23.3, t1: 24.2, text: "WHERE'S THE HEX KEY?!", kind: "shout" },
  { who: "alvin", t0: 24.5, t1: 25.6, text: "…help.", kind: "whisper" },
  { who: "lotta", t0: 26.0, t1: 26.9, text: "*sigh*", kind: "whisper" },
  { who: "lotta", t0: 29.3, t1: 30.4, text: "Done." },
  { who: "duke", t0: 31.0, t1: 32.3, text: "TEAMWORK!", kind: "shout" },
  { who: "pia", t0: 32.3, t1: 33.2, text: "…Sure.", kind: "whisper" },
  { who: "lefty", t0: 34.2, t1: 35.6, text: "Uh… where do I go?" },
  { who: "all", t0: 37.0, t1: 38.8, text: "#@%&!!", kind: "grawlix" },
];

/** camera keys: [t, x, y, zoom, transition seconds (0 = cut)] */
const CAM: [number, number, number, number, number][] = [
  [0, 40, -300, 1.1, 0], [0.75, 40, -240, 1.03, 0.5], [5.2, -260, -260, 1.25, 0.5], [6.6, 40, -240, 1.0, 0.6],
  [11.6, 250, -200, 1.55, 0], [12.4, -20, -230, 1.25, 0], [15.4, 250, -200, 1.5, 0], [16.9, -170, -250, 1.55, 0],
  [18.0, -40, -230, 1.15, 0.5], [21.4, 40, -240, 1.03, 0], [24.3, -300, 40, 1.6, 0], [25.8, 430, -280, 1.35, 0.7],
  [27.2, 80, -240, 1.0, 0.4], [29.2, 300, -270, 1.45, 0], [30.6, 40, -240, 1.03, 0.3], [33.0, 400, 60, 1.1, 0.8],
  [34.0, 130, 110, 1.9, 0.4], [35.6, 40, -240, 1.03, 0.3], [37.0, 40, -250, 1.05, 1.5],
];
const SHAKES: [number, number][] = [[0.75, 30], [10.7, 18], [11.6, 14], [14.8, 8], [18.8, 10], [19.3, 10], [19.8, 14], [21.4, 22], [22.8, 12], [27.6, 6], [28.2, 6], [28.8, 8], [36.6, 34], [36.8, 16]];
const FLASHES = [11.6, 21.4, 22.8, 36.8];

type BurstT = [number, number, number, string, string, number];
const BURSTS: BurstT[] = [
  [0.75, 40, -460, "KA-THUNK!", C.sun, -8], [3.0, 40, -360, "RIIIP!", C.mint, 6], [10.05, 180, -330, "YOINK!", C.sky, -10],
  [12.6, -60, -260, "ZZRRT!", C.sun, 8], [13.8, 60, -150, "ZZRRT!", C.sun, -6], [14.85, 60, -300, "CLUNK.", "#cbd5e1", 4],
  [18.8, -40, -260, "BONK!", C.gum, -8], [19.3, 120, -220, "BONK!", C.gum, 9], [19.8, -120, -330, "BOINK!", C.tomato, -5],
  [21.4, 60, -700, "KRAKOOM!", "#e5e7eb", 3], [27.6, -160, -340, "KA-CHUNK!", C.mint, -8], [28.2, 220, -250, "KA-CHUNK!", C.sky, 7],
  [28.8, 40, -520, "KA-CHUNK!", C.sun, -4], [36.6, 40, -220, "CRASH!", C.tomato, -6],
];

// =============================================================================== state helpers
const camAt = (t: number) => {
  let cur = { x: CAM[0][1], y: CAM[0][2], z: CAM[0][3] };
  for (let i = 1; i < CAM.length; i++) {
    const [kt, x, y, z, d] = CAM[i];
    if (t < kt) break;
    const p = d > 0 ? ease(clamp((t - kt) / d)) : 1;
    cur = { x: lerp(cur.x, x, p), y: lerp(cur.y, y, p), z: lerp(cur.z, z, p) };
  }
  let sx = 0, sy = 0;
  for (const [st, a] of SHAKES) if (t >= st && t < st + 0.8) { const k = a * Math.exp(-(t - st) * 7); sx += Math.sin((t - st) * 70) * k; sy += Math.cos((t - st) * 55) * k * 0.8; }
  return { ...cur, sx, sy };
};
const moodAt = (id: FurniId, t: number) => {
  let k = MOOD[id][0];
  for (const m of MOOD[id]) if (m[0] <= t) k = m;
  return { expr: k[1], emote: k[2], since: t - k[0] };
};
const posAt = (id: FurniId, t: number) => {
  const W = MOVE[id];
  let x = W[0][1], y = W[0][2], walk = 0;
  for (let i = 1; i < W.length; i++) {
    const [kt, kx, ky, d] = W[i];
    if (t < kt) break;
    const p = clamp((t - kt) / d);
    x = lerp(x, kx, ease(p)); y = lerp(y, ky, ease(p));
    if (p < 1) walk = Math.abs(Math.sin(p * Math.PI * 3)) * 38;
  }
  return { x, y, walk };
};

// =============================================================================== shelf pieces
type Pose = { x: number; y: number; r: number; flip?: number };
type PieceDef = { id: string; w: number; h: number; built: Pose; pile: Pose; fall: Pose; color: string; ev: [number, string][] };
const BOX: Pose = { x: 0, y: -150, r: 0 };
const PIECES: PieceDef[] = [
  { id: "back", w: 236, h: 400, built: { x: 0, y: -215, r: 0 }, pile: { x: -20, y: -150, r: -9 }, fall: { x: 10, y: -14, r: -88 }, color: C.mint, ev: [[0, "box"], [3.36, "pile"], [14.8, "backwards"], [27.3, "built"], [36.6, "fall"]] },
  { id: "left", w: 24, h: 430, built: { x: -124, y: -215, r: 0 }, pile: { x: -190, y: 60, r: 82 }, fall: { x: -250, y: 66, r: 96 }, color: C.sun, ev: [[0, "box"], [3.2, "pile"], [12.4, "built"], [19.8, "off"], [27.6, "built"], [36.6, "fall"]] },
  { id: "bot", w: 250, h: 24, built: { x: 0, y: -12, r: 0 }, pile: { x: 70, y: 84, r: 3 }, fall: { x: 40, y: 92, r: 8 }, color: C.sun, ev: [[0, "box"], [3.28, "pile"], [13.6, "built"], [36.6, "fall"]] },
  { id: "right", w: 24, h: 430, built: { x: 124, y: -215, r: 0 }, pile: { x: 210, y: 70, r: -84 }, fall: { x: 260, y: 74, r: -98 }, color: C.sun, ev: [[0, "box"], [3.44, "pile"], [27.9, "built"], [36.6, "fall"]] },
  { id: "s1", w: 226, h: 18, built: { x: 0, y: -148, r: 0 }, pile: { x: -60, y: 100, r: -4 }, fall: { x: -120, y: 104, r: -12 }, color: C.sun, ev: [[0, "box"], [3.52, "pile"], [28.2, "built"], [36.6, "fall"]] },
  { id: "s2", w: 226, h: 18, built: { x: 0, y: -284, r: 0 }, pile: { x: 130, y: 106, r: 6 }, fall: { x: 150, y: 110, r: 14 }, color: C.sun, ev: [[0, "box"], [3.6, "pile"], [28.5, "built"], [36.6, "fall"]] },
  { id: "top", w: 272, h: 26, built: { x: 0, y: -432, r: 0 }, pile: { x: 30, y: 122, r: -2 }, fall: { x: -30, y: 124, r: -6 }, color: C.tomato, ev: [[0, "box"], [3.68, "pile"], [28.8, "built"], [36.6, "fall"]] },
];
const OFF: Pose = { x: -260, y: 64, r: 74 };

const poseOf = (p: PieceDef, s: string): Pose => s === "box" ? BOX : s === "pile" ? p.pile : s === "fall" ? p.fall : s === "off" ? OFF : s === "backwards" ? { ...p.built, flip: 1 } : { ...p.built, flip: 0 };
const pieceAt = (p: PieceDef, t: number) => {
  let i = 0;
  for (let k = 0; k < p.ev.length; k++) if (p.ev[k][0] <= t) i = k;
  const [kt, s] = p.ev[i];
  const to = poseOf(p, s);
  const from = i > 0 ? poseOf(p, p.ev[i - 1][1]) : to;
  const fall = s === "fall";
  const d = fall ? 0.45 : s === "pile" ? 0.5 : 0.32;
  const raw = clamp((t - kt) / d);
  const pp = fall ? raw * raw : back(raw);
  const arc = fall ? 0 : Math.sin(raw * Math.PI) * (s === "pile" ? 220 : 110);
  return {
    x: lerp(from.x, to.x, pp), y: lerp(from.y, to.y, pp) - arc, r: lerp(from.r, to.r, raw < 1 ? pp : 1) + (s === "pile" ? (1 - raw) * 540 : 0),
    flip: lerp(from.flip ?? 0, to.flip ?? 0, clamp(raw * 1.2)), hidden: s === "box" || (s === "pile" && raw <= 0),
    snapAge: t - kt, state: s,
  };
};

const Piece: React.FC<{ def: PieceDef; t: number }> = ({ def, t }) => {
  const s = pieceAt(def, t);
  if (s.hidden) return null;
  const { w, h } = def;
  const d = 14;
  const flipScale = Math.cos(s.flip * Math.PI);
  const showBack = flipScale < 0;
  const col = def.id === "back" && showBack ? "#a0703f" : def.color;
  return (
    <g transform={`translate(${s.x} ${s.y}) rotate(${s.r}) scale(${Math.abs(flipScale) * (def.id === "back" ? 1 : 1) || 0.02} 1)`}>
      <path d={`M${-w / 2} ${-h / 2} l ${d} ${-d * 0.7} h ${w} v ${h} l ${-d} ${d * 0.7} Z`} fill={C.woodD} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={3} fill={col} stroke={INK} strokeWidth={5} />
      {def.id === "back" && !showBack && <g opacity={0.35}>{[-60, 0, 60].map((x) => <circle key={x} cx={x} cy={-60} r={30} fill="#fff" />)}<path d={`M${-w / 2 + 20} 120 Q 0 60 ${w / 2 - 20} 120`} stroke="#fff" strokeWidth={14} fill="none" /></g>}
      {def.id === "back" && showBack && (
        <g transform="rotate(180) scale(-1 1)">
          <text x={0} y={-40} textAnchor="middle" fontFamily={LUCKY} fontSize={30} fill="#5b3a1a">THIS SIDE IN ▲</text>
          <text x={0} y={30} textAnchor="middle" fontFamily={LUCKY} fontSize={22} fill="#5b3a1a">NOT FINISHED SIDE</text>
          {[...Array(6)].map((_, i) => <line key={i} x1={-100} y1={70 + i * 18} x2={100} y2={70 + i * 18} stroke="#8a5a2b" strokeWidth={3} />)}
        </g>
      )}
      {w < 40 && [-h / 2 + 30, -h / 2 + 100, 0, h / 2 - 100, h / 2 - 30].map((y) => <circle key={y} cx={0} cy={y} r={4} fill={INK} opacity={0.5} />)}
      {h < 40 && w > 100 && [-w / 2 + 16, w / 2 - 16].map((x) => <circle key={x} cx={x} cy={0} r={4} fill={INK} opacity={0.5} />)}
    </g>
  );
};

const shelfWobble = (t: number) => {
  let r = 0;
  for (const b of [18.8, 19.3, 19.8]) if (t >= b && t < b + 1.2) r += Math.sin((t - b) * 30) * 5 * Math.exp(-(t - b) * 4);
  if (t >= 35.9 && t < 36.6) r += Math.sin((t - 35.9) * 26) * (1 + (t - 35.9) * 10);
  return r;
};

// =============================================================================== set pieces
const Room: React.FC<{ t: number }> = ({ t }) => {
  const angry = (t > 10 && t < 25.8) || t > 36.6;
  const sec = t * (angry ? 40 : 6);
  return (
    <g>
      {/* wallpaper */}
      <rect x={-2400} y={-2800} width={4800} height={2760} fill="#bff0dc" />
      {[...Array(40)].map((_, i) => <rect key={i} x={-2400 + i * 120} y={-2800} width={56} height={2760} fill="#a6e6cc" />)}
      {[...Array(120)].map((_, i) => <circle key={`d${i}`} cx={-2400 + (i % 20) * 240 + (Math.floor(i / 20) % 2) * 120} cy={-2700 + Math.floor(i / 20) * 260} r={9} fill={C.sun} opacity={0.6} />)}
      {/* window */}
      <g transform="translate(-720 -1060)">
        <rect x={-20} y={-20} width={460} height={560} rx={18} fill="#fff" stroke={INK} strokeWidth={8} />
        <rect x={0} y={0} width={420} height={520} fill="url(#sky)" />
        {[0, 1].map((k) => { const x = ((t * 18 + k * 260) % 620) - 120; return <g key={k} transform={`translate(${x} ${110 + k * 150})`}><ellipse rx={70} ry={30} fill="#fff" /><ellipse cx={40} cy={-18} rx={44} ry={30} fill="#fff" /></g>; })}
        <line x1={210} y1={0} x2={210} y2={520} stroke="#fff" strokeWidth={16} /><line x1={0} y1={260} x2={420} y2={260} stroke="#fff" strokeWidth={16} />
        <rect x={-50} y={530} width={520} height={34} rx={8} fill={C.wood} stroke={INK} strokeWidth={6} />
        <g transform="translate(360 470)"><rect x={-30} y={0} width={60} height={60} rx={8} fill={C.tomato} stroke={INK} strokeWidth={5} />{[-1, 0, 1].map((s) => <ellipse key={s} cx={s * 22} cy={-30} rx={14} ry={34} fill={C.mint} stroke={INK} strokeWidth={4} transform={`rotate(${s * 25} ${s * 22} 0)`} />)}</g>
      </g>
      {/* clock (spins wildly during fights) */}
      <g transform="translate(120 -1250)">
        <circle r={110} fill="#fff" stroke={INK} strokeWidth={10} /><circle r={92} fill={C.cream} />
        {[...Array(12)].map((_, i) => <circle key={i} cx={Math.sin((i / 12) * Math.PI * 2) * 78} cy={-Math.cos((i / 12) * Math.PI * 2) * 78} r={6} fill={INK} />)}
        <line x1={0} y1={0} x2={Math.sin(sec / 12) * 45} y2={-Math.cos(sec / 12) * 45} stroke={INK} strokeWidth={10} strokeLinecap="round" />
        <line x1={0} y1={0} x2={Math.sin(sec) * 70} y2={-Math.cos(sec) * 70} stroke={C.tomato} strokeWidth={6} strokeLinecap="round" />
      </g>
      {/* framed picture */}
      <g transform="translate(560 -1120) rotate(4)">
        <rect x={-150} y={-120} width={300} height={240} fill={C.sun} stroke={INK} strokeWidth={9} />
        <rect x={-126} y={-96} width={252} height={192} fill="#fff" />
        <circle cx={-40} cy={-10} r={50} fill={C.gum} /><rect x={10} y={-50} width={90} height={110} fill={C.sky} /><path d="M-110 80 L-40 10 L20 70 L60 30 L110 80 Z" fill={C.mint} />
      </g>
      {/* baseboard + floor */}
      <rect x={-2400} y={-80} width={4800} height={40} fill="#fff" stroke={INK} strokeWidth={6} />
      <rect x={-2400} y={-40} width={4800} height={2400} fill={C.wood} />
      {[...Array(31)].map((_, i) => { const x = -3000 + i * 200; return <line key={i} x1={x * 0.35 + 40} y1={-40} x2={x * 2.2} y2={2000} stroke={C.woodD} strokeWidth={5} opacity={0.6} />; })}
      {[60, 220, 460, 800].map((y) => <line key={y} x1={-2400} y1={y} x2={2400} y2={y} stroke={C.woodD} strokeWidth={3} opacity={0.35} />)}
      {/* rug */}
      <ellipse cx={40} cy={150} rx={680} ry={150} fill={C.tomato} stroke={INK} strokeWidth={7} />
      <ellipse cx={40} cy={150} rx={620} ry={124} fill={C.sun} />
      <ellipse cx={40} cy={150} rx={520} ry={96} fill="none" stroke={C.gum} strokeWidth={14} strokeDasharray="40 26" />
    </g>
  );
};

const PalletBox: React.FC<{ t: number }> = ({ t }) => {
  const fall = clamp((t - 0.3) / 0.45);
  const y = lerp(-1900, 0, fall * fall);
  const land = t > 0.75 ? Math.exp(-(t - 0.75) * 10) * Math.sin((t - 0.75) * 40) * 0.12 : 0;
  const flap = clamp((t - 2.95) / 0.3);
  const flat = clamp((t - 6.0) / 0.25);
  const boxSy = 1 - flat * 0.86;
  return (
    <g transform={`translate(40 ${y - 10}) scale(${1 + land} ${1 - land})`}>
      {/* pallet */}
      {[0, 1].map((k) => <g key={k} transform={`translate(0 ${-k * 22})`}>
        <path d="M-200 -20 l 30 -18 h 400 l -30 18 Z" fill={shade2(C.wood, 1.1)} stroke={INK} strokeWidth={4} />
        <rect x={-200} y={-20} width={400} height={22} fill={C.woodD} stroke={INK} strokeWidth={4} />
      </g>)}
      {[-170, -10, 150].map((x) => <rect key={x} x={x} y={-20} width={40} height={22} fill="#8a5a2b" stroke={INK} strokeWidth={3} />)}
      {/* box */}
      <g transform={`translate(0 -44) scale(1 ${boxSy})`}>
        <path d="M-170 -250 l 34 -22 h 340 l -34 22 Z" fill="#c99556" stroke={INK} strokeWidth={5} />
        <path d="M170 -250 l 34 -22 v 250 l -34 22 Z" fill="#b07d42" stroke={INK} strokeWidth={5} />
        <rect x={-170} y={-250} width={340} height={250} fill="#d9a766" stroke={INK} strokeWidth={6} />
        <text x={-150} y={-195} fontFamily={LUCKY} fontSize={44} fill={INK}>BJÖRKSNÄP</text>
        <g transform="translate(110 -205)"><circle r={36} fill={C.mint} stroke={INK} strokeWidth={4} /><text y={10} textAnchor="middle" fontFamily={LUCKY} fontSize={22} fill={C.tomato}>SKRÜV</text></g>
        <g transform="translate(-110 -90)"><rect x={-26} y={-60} width={52} height={92} fill="none" stroke={INK} strokeWidth={5} />{[-30, 0].map((y) => <line key={y} x1={-26} y1={y} x2={26} y2={y} stroke={INK} strokeWidth={4} />)}</g>
        <g transform="translate(20 -80)">{[-28, 28].map((x) => <g key={x} transform={`translate(${x} 0)`}><circle cy={-38} r={11} fill={INK} /><path d="M-12 -22 h24 v34 h-24 Z M-12 12 l -6 28 M12 12 l 6 28" stroke={INK} strokeWidth={6} fill={INK} /></g>)}<text y={70} textAnchor="middle" fontFamily={LUCKY} fontSize={18} fill={INK}>2-PERSON BUILD</text></g>
        <text x={140} y={-40} textAnchor="middle" fontFamily={LUCKY} fontSize={40} fill={C.tomato}>↑</text>
        {/* flaps */}
        {flap > 0 && [-1, 1].map((s) => <path key={s} d={`M${s * 4} -250 L${s * 170} -250 L${s * (170 + 40 * flap)} ${-250 - 110 * Math.sin(flap * 2)} L${s * (4 + 20 * flap)} ${-250 - 110 * Math.sin(flap * 2)} Z`} fill="#c99556" stroke={INK} strokeWidth={5} strokeLinejoin="round" />)}
      </g>
    </g>
  );
};
const shade2 = (hex: string, k: number) => { const n = parseInt(hex.slice(1), 16); return `rgb(${[16, 8, 0].map((s) => Math.min(255, Math.round(((n >> s) & 255) * k))).join(",")})`; };

const Manual: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={-60} y={-80} width={120} height={160} rx={6} fill="#fff" stroke={INK} strokeWidth={6} />
    <rect x={-60} y={-80} width={120} height={34} fill={C.sky} stroke={INK} strokeWidth={5} />
    <text x={0} y={-56} textAnchor="middle" fontFamily={LUCKY} fontSize={17} fill={INK}>BJÖRKSNÄP</text>
    {/* our own pictogram helper "Mr. Manual" */}
    <g transform={`translate(0 18) rotate(${Math.sin(f / 6) * 6})`}>
      <circle cy={-30} r={18} fill="#fff" stroke={INK} strokeWidth={4} /><path d="M-14 -46 h28 l -4 -10 h-20 Z" fill={C.tomato} stroke={INK} strokeWidth={3} />
      <circle cx={-6} cy={-30} r={2.5} fill={INK} /><circle cx={6} cy={-30} r={2.5} fill={INK} /><path d="M-6 -20 q 6 4 12 0" stroke={INK} strokeWidth={2.5} fill="none" />
      <path d="M0 -12 V 22 M0 22 l -14 26 M0 22 l 14 26 M0 0 l 22 -14 M0 0 l -22 10" stroke={INK} strokeWidth={5} strokeLinecap="round" />
    </g>
  </g>
);

// =============================================================================== overlays
const Burst: React.FC<{ x: number; y: number; text: string; color: string; rot: number; age: number }> = ({ x, y, text, color, rot, age }) => {
  const s = age < 0.12 ? (age / 0.12) * 1.25 : age < 0.22 ? 1.25 - ((age - 0.12) / 0.1) * 0.25 : 1;
  const out = clamp((age - 0.65) / 0.15);
  const pts = [...Array(22)].map((_, i) => { const a = (i / 22) * Math.PI * 2; const r = i % 2 ? 150 : 200 + random(`${text}${i}`) * 30; return `${Math.cos(a) * r * 1.35},${Math.sin(a) * r * 0.8}`; }).join(" ");
  return (
    <div style={{ position: "absolute", left: x - 300, top: y - 200, width: 600, height: 400, transform: `rotate(${rot}deg) scale(${s * (1 - out)})`, opacity: 1 - out }}>
      <svg width={600} height={400} viewBox="-300 -200 600 400"><polygon points={pts} fill={color} stroke={INK} strokeWidth={9} strokeLinejoin="round" /></svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LUCKY, fontSize: text.length > 8 ? 74 : 92, color: "#fff", WebkitTextStroke: `5px ${INK}`, paintOrder: "stroke", textShadow: `6px 6px 0 ${INK}` }}>{text}</div>
    </div>
  );
};

const Bubble: React.FC<{ b: Bub; ax: number; ay: number; t: number }> = ({ b, ax, ay, t }) => {
  const age = t - b.t0, left = b.t1 - t;
  const s = age < 0.15 ? back(age / 0.15) : left < 0.12 ? clamp(left / 0.12) : 1;
  const kind = b.kind ?? "say";
  const fs = kind === "shout" ? 62 : kind === "grawlix" ? 110 : kind === "whisper" ? 46 : 52;
  const w = Math.min(760, Math.max(260, b.text.length * fs * 0.52 + 90));
  const lines = Math.ceil((b.text.length * fs * 0.52) / (w - 90));
  const h = lines * fs * 1.1 + 70;
  const bx = clamp(ax - w / 2, 36, 1080 - 150 - w);
  const by = clamp(ay - h - 70, 190, 1420);
  const col = COLOR[b.who];
  const jag = kind === "shout" || kind === "grawlix";
  const tailX = clamp(ax, bx + 40, bx + w - 40);
  const shake = jag ? Math.sin(t * 60) * 3 : 0;
  return (
    <div style={{ position: "absolute", left: bx + shake, top: by, width: w, height: h + 70, transform: `scale(${s})`, transformOrigin: `${tailX - bx}px ${h + 60}px` }}>
      <svg width={w} height={h + 70} style={{ position: "absolute", overflow: "visible" }}>
        {jag ? (
          <polygon points={[...Array(28)].map((_, i) => { const a = (i / 28) * Math.PI * 2; const r = i % 2 ? 1 : 1.12; return `${w / 2 + Math.cos(a) * (w / 2) * r},${h / 2 + Math.sin(a) * (h / 2) * r}`; }).join(" ")} fill={kind === "grawlix" ? C.tomato : C.sun} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        ) : (
          <rect x={0} y={0} width={w} height={h} rx={h / 2.4} fill="#fff" stroke={INK} strokeWidth={kind === "whisper" ? 5 : 7} strokeDasharray={kind === "whisper" ? "16 10" : undefined} />
        )}
        {b.who !== "all" && <path d={`M${tailX - bx - 26} ${h - 8} L${ax - bx} ${h + 60} L${tailX - bx + 26} ${h - 8} Z`} fill={jag ? C.sun : "#fff"} stroke={INK} strokeWidth={6} strokeLinejoin="round" />}
        {b.who !== "all" && <path d={`M${tailX - bx - 22} ${h - 10} L${tailX - bx + 22} ${h - 10}`} stroke={jag ? C.sun : "#fff"} strokeWidth={10} />}
        {!jag && <rect x={22} y={h * 0.22} width={12} height={h * 0.56} rx={6} fill={col} />}
      </svg>
      <div style={{ position: "absolute", left: jag ? 30 : 46, right: 30, top: 0, height: h, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: LUCKY, fontSize: fs, lineHeight: 1.05, color: kind === "grawlix" ? "#fff" : INK, WebkitTextStroke: kind === "grawlix" ? `4px ${INK}` : undefined, paintOrder: "stroke", fontStyle: kind === "whisper" ? "italic" : undefined, letterSpacing: kind === "grawlix" ? 8 : 1 }}>{b.text}</div>
    </div>
  );
};

const StepCounter: React.FC<{ t: number }> = ({ t }) => {
  if (t < 12.2 || t > 30.6) return null;
  const n = t < 13.6 ? 1 : t < 14.8 ? 2 : t < 19.8 ? 3 : t < 27.3 ? 2 : t < 28.9 ? Math.min(46, 2 + Math.floor((t - 27.3) * 28)) : 47;
  const bad = t >= 19.8 && t < 20.6;
  const done = n === 47;
  const pop = Math.max(0, 1 - (t - 12.2) / 0.25);
  return (
    <div style={{ position: "absolute", left: 40, top: 200, padding: "14px 26px", background: done ? C.mint : bad ? C.tomato : "#fff", border: `6px solid ${INK}`, borderRadius: 20, fontFamily: LUCKY, fontSize: 48, color: INK, boxShadow: `8px 8px 0 ${INK}`, transform: `rotate(-4deg) scale(${1 - pop * 0.5 + (bad ? Math.sin(t * 50) * 0.04 : 0)})` }}>
      STEP {n} <span style={{ fontSize: 34 }}>OF 47</span> {done ? "✔" : bad ? "↩" : ""}
    </div>
  );
};

const Scoreboard: React.FC<{ t: number }> = ({ t }) => {
  if (t < 21.6 || t > 25.6) return null;
  const n = Math.min(99, Math.floor((t - 21.6) * 30) + 1);
  const y = t < 21.85 ? -200 + ((t - 21.6) / 0.25) * 400 : t > 25.35 ? 200 - ((t - 25.35) / 0.25) * 400 : 200;
  return (
    <div style={{ position: "absolute", left: 80, top: y + 130, width: 760, display: "flex", border: `6px solid ${INK}`, borderRadius: 18, overflow: "hidden", boxShadow: `8px 8px 0 ${INK}`, fontFamily: LUCKY }}>
      <div style={{ flex: 1.3, background: C.tomato, color: "#fff", fontSize: 42, padding: "14px 18px", WebkitTextStroke: `2px ${INK}` }}>ARGUMENTS</div>
      <div style={{ width: 130, background: "#111827", color: C.sun, fontSize: 64, textAlign: "center", paddingTop: 6 }}>{n}</div>
      <div style={{ flex: 1, background: C.teal, color: "#fff", fontSize: 42, padding: "14px 18px", WebkitTextStroke: `2px ${INK}` }}>STEPS</div>
      <div style={{ width: 100, background: "#111827", color: C.mint, fontSize: 64, textAlign: "center", paddingTop: 6 }}>2</div>
    </div>
  );
};

const Versus: React.FC<{ t: number }> = ({ t }) => {
  const a = t - 10.7;
  if (a < 0 || a > 0.9) return null;
  const inP = back(clamp(a / 0.18)), outP = clamp((a - 0.72) / 0.18);
  const bolt = "M0 -120 L-46 10 L-6 10 L-34 130 L52 -30 L10 -30 L40 -120 Z";
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, background: C.tomato, clipPath: "polygon(0 0, 62% 0, 38% 100%, 0 100%)", transform: `translateX(${(-1 + inP) * 700 - outP * 900}px)`, display: "flex", alignItems: "center" }}>
        <div style={{ marginLeft: 60, marginTop: -500, fontFamily: LUCKY, fontSize: 170, color: "#fff", WebkitTextStroke: `7px ${INK}`, transform: "rotate(-8deg)" }}>DUKE</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, background: C.teal, clipPath: "polygon(62% 0, 100% 0, 100% 100%, 38% 100%)", transform: `translateX(${(1 - inP) * 700 + outP * 900}px)`, display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
        <div style={{ marginRight: 170, marginBottom: 520, fontFamily: LUCKY, fontSize: 170, color: "#fff", WebkitTextStroke: `7px ${INK}`, transform: "rotate(-8deg)" }}>PIA</div>
      </div>
      <div style={{ position: "absolute", left: 340, top: 760, width: 400, height: 400, transform: `scale(${inP * (1 - outP)}) rotate(${Math.sin(a * 40) * 4}deg)` }}>
        <svg width={400} height={400} viewBox="-200 -200 400 400"><path d={bolt} transform="scale(1.4)" fill={C.sun} stroke={INK} strokeWidth={8} strokeLinejoin="round" /></svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LUCKY, fontSize: 150, color: "#fff", WebkitTextStroke: `7px ${INK}` }}>VS</div>
      </div>
    </AbsoluteFill>
  );
};

const Confetti: React.FC<{ t: number }> = ({ t }) => {
  const a = t - 30.6;
  if (a < 0 || a > 3.2) return null;
  const cols = [C.tomato, C.sun, C.mint, C.sky, C.grape, C.gum];
  return (
    <AbsoluteFill>
      {[...Array(90)].map((_, i) => {
        const x0 = 540 + (random(`cx${i}`) - 0.5) * 300, vx = (random(`vx${i}`) - 0.5) * 1500, vy = -900 - random(`vy${i}`) * 1100;
        const x = x0 + vx * a, y = 1000 + vy * a + 900 * a * a;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 18, height: 30, background: cols[i % 6], border: `3px solid ${INK}`, transform: `rotate(${a * 600 + i * 40}deg) scaleX(${Math.cos(a * 12 + i)})` }} />;
      })}
    </AbsoluteFill>
  );
};

const LogoStamp: React.FC<{ t: number }> = ({ t }) => {
  const a = t - 1.25;
  if (a < 0 || a > 1.7) return null;
  const s = a < 0.15 ? 2 - a / 0.15 : 1;
  const out = clamp((a - 1.45) / 0.25);
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: 230, textAlign: "center", transform: `scale(${s * (1 - out)}) rotate(-5deg)`, opacity: 1 - out, fontFamily: LUCKY }}>
      <span style={{ display: "inline-block", background: "#fff", border: `7px solid ${INK}`, borderRadius: 18, padding: "10px 30px", boxShadow: `10px 10px 0 ${INK}`, fontSize: 64, color: INK }}>SOME ASSEMBLY <span style={{ color: C.tomato }}>RAGE!</span></span>
      <div style={{ fontSize: 38, color: "#fff", WebkitTextStroke: `3px ${INK}`, marginTop: 14 }}>EP. 1 · THE BOOKCASE</div>
    </div>
  );
};

// =============================================================================== audio cues
const SFX: [number, string, number][] = [
  [0.28, "sfx_whoosh", 0.7], [0.75, "sfx_thunk", 1], [3.0, "sfx_rip", 0.9], [3.22, "sfx_pop", 0.6], [3.4, "sfx_pop", 0.6], [3.6, "sfx_pop", 0.6],
  [6.0, "sfx_pop", 0.7], [10.0, "sfx_whoosh", 0.8], [10.7, "sfx_thunk", 0.8], [11.6, "sfx_thunder", 0.9], [12.4, "sfx_ratchet", 0.8],
  [13.6, "sfx_ratchet", 0.8], [14.8, "sfx_chunk", 0.8], [18.8, "sfx_bonk", 0.9], [19.3, "sfx_bonk", 0.9], [19.8, "sfx_bonk", 1],
  [21.4, "sfx_thunder", 1], [22.8, "sfx_thunder", 0.7], [24.3, "sfx_pop", 0.8], [27.2, "sfx_shimmer", 0.8], [27.3, "sfx_whoosh", 0.5],
  [27.6, "sfx_chunk", 0.8], [27.9, "sfx_chunk", 0.8], [28.2, "sfx_chunk", 0.8], [28.5, "sfx_chunk", 0.8], [28.8, "sfx_chunk", 0.9],
  [30.6, "sfx_pop", 0.8], [30.7, "sfx_pop", 0.7], [33.0, "sfx_roll", 0.8], [34.0, "sfx_scratch", 0.8], [35.95, "sfx_bonk", 0.4],
  [36.6, "sfx_crash", 1], [36.8, "sfx_thunder", 0.8],
];
const BRAND: [number, string, number][] = [[19.85, "brand/boing.wav", 0.5], [29.05, "brand/ding.wav", 0.6]];

// =============================================================================== composition
export const FlatpackPilot: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = camAt(t);
  const toScreen = (wx: number, wy: number) => ({ x: 540 + (wx - cam.x) * cam.z + cam.sx, y: 960 + (wy - cam.y) * cam.z + cam.sy });
  const S = 460, SCALE = S / 600, GROUND = (222 + 560) * SCALE;

  // ------------------------------------------------------------ world items (depth sorted by y)
  const items: { y: number; node: React.ReactNode }[] = [];
  items.push({ y: -10, node: <PalletBox key="pallet" t={t} /> });
  const wob = shelfWobble(t);
  items.push({ y: 40, node: <g key="shelf" transform={`translate(40 40) rotate(${wob})`}>{PIECES.map((p) => <Piece key={p.id} def={p} t={t} />)}{t > 29.0 && t < 30.6 && [...Array(5)].map((_, i) => { const a = ((t - 29) * 3 + i * 0.2) % 1; return <path key={i} d="M0 -26 L6 -6 L26 0 L6 6 L0 26 L-6 6 L-26 0 L-6 -6 Z" transform={`translate(${-120 + i * 60} ${-420 + ((i * 97) % 380)}) scale(${Math.sin(a * Math.PI) * 1.4})`} fill="#fff" stroke={INK} strokeWidth={3} />; })}</g> });

  const pos: Record<FurniId, { x: number; y: number; walk: number }> = { duke: posAt("duke", t), pia: posAt("pia", t), gus: posAt("gus", t), lotta: posAt("lotta", t) };
  (Object.keys(MOOD) as FurniId[]).forEach((id) => {
    const p = pos[id], m = moodAt(id, t);
    const talk = BUBBLES.some((b) => (b.who === id || (b.who === "all" && id !== "lotta")) && t >= b.t0 && t < b.t1 && b.kind !== "whisper") || (id === "lotta" && t >= 29.3 && t < 30.0);
    let hop = p.walk + (m.since < 0.35 ? Math.sin((m.since / 0.35) * Math.PI) * 55 : 0);
    if (t > 30.6 && t < 33.0 && id !== "lotta") hop += Math.abs(Math.sin((t - 30.6) * 7 + id.length)) * 60;
    if (t > 0.75 && t < 1.1) hop += Math.sin(((t - 0.75) / 0.35) * Math.PI) * 90;
    const glow = id === "lotta" ? (t > 26.9 && t < 30.6 ? clamp((t - 26.9) / 0.4) : t >= 30.6 && t < 34 ? 0.5 : 0) : 0;
    const ds = 1 + (p.y - 100) * 0.0011;
    let yaw = YAW[id];
    if (id === "duke" && t > 12.4 && t < 15.4) yaw = 0.7; // facing the shelf while screwing
    items.push({
      y: p.y, node: (
        <g key={id} transform={`translate(${p.x} ${p.y}) scale(${ds}) translate(${-S / 2} ${-GROUND})`}>
          <Furni id={id} expr={m.expr} emote={m.emote} emoteAge={m.since * FPS} f={frame} size={S} yaw={yaw} talk={talk} hop={hop / SCALE} glow={glow} />
        </g>
      ),
    });
  });

  // manual: in Pia's hands, yoinked by Duke
  if (t > 6.9 && t < 11.0) {
    const pp = pos.pia;
    const a = clamp((t - 10.0) / 0.8);
    const mx = lerp(pp.x - 120, -1100, a), my = lerp(pp.y - 170, -900, a) - Math.sin(a * Math.PI) * 300;
    items.push({ y: pp.y + 1, node: <g key="manual" transform={`translate(${mx} ${my}) rotate(${-10 + a * 900}) scale(${clamp((t - 6.9) / 0.2)})`}><Manual f={frame} /></g> });
  }
  // Alvin the hex key
  {
    let ax = 150, ay = 150, rot = 90, sx = 1, sy = 1, vis = t > 3.15;
    const d = pos.duke;
    if (t < 3.6) { const a = clamp((t - 3.15) / 0.45); ax = lerp(40, 150, a); ay = lerp(-200, 150, a) - Math.sin(a * Math.PI) * 260; rot = a * 720 + 90; }
    else if (t >= 11.9 && t < 18.0) { const a = clamp((t - 11.9) / 0.4); ax = lerp(150, d.x + 160, a); ay = lerp(150, d.y - 150, a); rot = lerp(90, 0, a); const screwing = [12.4, 13.6].some((s) => t > s && t < s + 0.7); if (screwing) rot = (t * 1400) % 360; }
    else if (t >= 18.0 && t < 24.3) { const a = clamp((t - 18.0) / 0.4); ax = lerp(d.x + 160, -330, a); ay = lerp(d.y - 150, 195, a) - Math.sin(a * Math.PI) * 120; rot = lerp(0, 90, a); }
    else if (t >= 24.3) { ax = -330; ay = 195; rot = 90; const sq = clamp((t - 24.3) / 0.1) * (1 - clamp((t - 25.6) / 0.2)); sy = 1 - sq * 0.55; sx = 1 + sq * 0.3; }
    if (vis) items.push({ y: ay - 2, node: <g key="alvin" transform={`translate(${ax} ${ay}) scale(${sx} ${sy})`}><Alvin f={frame} spin={rot} size={0.8} look={-1} /></g> });
  }
  // Lefty the leftover screw
  if (t > 33.0) {
    const a = clamp((t - 33.0) / 1.0);
    const lx = lerp(900, 130, ease(a)), ly = 262;
    const rot = a < 1 ? 90 + (1 - ease(a)) * 1440 : 0;
    const hop = t > 34 && t < 34.3 ? Math.sin(((t - 34) / 0.3) * Math.PI) * 40 : 0;
    items.push({ y: ly, node: <g key="lefty" transform={`translate(${lx} ${ly - 60 - hop}) rotate(${a < 1 ? rot : Math.sin(t * 3) * 4})`}><Lefty f={frame} size={0.75} talk={t >= 34.2 && t < 35.5} /></g> });
  }
  // dust puffs on impacts
  const dust = (t0: number, x: number, y: number, key: string) => { const a = (t - t0) / 0.8; if (a < 0 || a > 1) return; items.push({ y: y + 5, node: <g key={key}>{[...Array(8)].map((_, i) => { const ang = (i / 8) * Math.PI; return <circle key={i} cx={x + Math.cos(ang) * (80 + a * 260) * (i % 2 ? 1 : -1)} cy={y - Math.sin(ang) * a * 60} r={30 + a * 50} fill="#fff" stroke={INK} strokeWidth={4} opacity={1 - a} />; })}</g> }); };
  dust(0.75, 40, 0, "d1"); dust(36.6, 40, 60, "d2");

  items.sort((a, b) => a.y - b.y);

  // ------------------------------------------------------------ screen-space overlays
  const heads: Record<Who, { x: number; y: number }> = {
    duke: { x: pos.duke.x, y: pos.duke.y - HEAD.duke }, pia: { x: pos.pia.x, y: pos.pia.y - HEAD.pia }, gus: { x: pos.gus.x, y: pos.gus.y - HEAD.gus },
    lotta: { x: pos.lotta.x, y: pos.lotta.y - HEAD.lotta }, alvin: { x: -330, y: 195 - HEAD.alvin }, lefty: { x: 130, y: 262 - HEAD.lefty }, all: { x: 40, y: -700 },
  };
  if (t < 18) heads.alvin = { x: pos.duke.x + 160, y: pos.duke.y - 230 };

  const flash = FLASHES.reduce((a, ft) => a + (t >= ft && t < ft + 0.25 ? (Math.floor((t - ft) * 30) % 2 ? 0.2 : 0.75) * (1 - (t - ft) / 0.25) : 0), 0);
  const outroIn = clamp((t - STORY) / 0.2);
  const stormTint = (t > 21.4 && t < 25.8) || t > 36.7 ? 0.22 : t > 11.6 && t < 21.4 ? 0.08 : 0;

  const W = 2400;
  return (
    <AbsoluteFill style={{ background: "#bff0dc", overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4CC9F0" /><stop offset="1" stopColor="#bdeaff" /></linearGradient></defs>
        {/* parallax: wall moves a bit slower than the floor/characters */}
        <g transform={`translate(${540 + cam.sx} ${960 + cam.sy}) scale(${cam.z}) translate(${-cam.x * 0.85} ${-cam.y})`}><Room t={t} /></g>
        <g transform={`translate(${540 + cam.sx} ${960 + cam.sy}) scale(${cam.z}) translate(${-cam.x} ${-cam.y})`}>{items.map((it) => it.node)}</g>
        {/* foreground plant (closer than everything → bigger parallax) */}
        <g transform={`translate(${540 + cam.sx} ${960 + cam.sy}) scale(${cam.z * 1.25}) translate(${-cam.x * 1.25 - 760} ${-cam.y + 480})`}>
          <rect x={-90} y={0} width={180} height={170} rx={20} fill={C.grape} stroke={INK} strokeWidth={8} />
          {[-2, -1, 0, 1, 2].map((s) => <ellipse key={s} cx={s * 50} cy={-90} rx={36} ry={120} fill={C.mint} stroke={INK} strokeWidth={6} transform={`rotate(${s * 18 + Math.sin(t * 2 + s) * 3} ${s * 50} 0)`} />)}
        </g>
        <rect width={W} height={1920} fill="#1e1b4b" opacity={stormTint} />
      </svg>
      {BURSTS.map(([bt, x, y, txt, col, rot], i) => t >= bt && t < bt + 0.85 && (() => { const p = toScreen(x, y); return <Burst key={i} x={p.x} y={p.y} text={txt} color={col} rot={rot} age={t - bt} />; })())}
      {BUBBLES.map((b, i) => { if (t < b.t0 || t >= b.t1) return null; const h = heads[b.who]; const p = b.who === "all" ? { x: 540, y: 820 } : toScreen(h.x, h.y); return <Bubble key={i} b={b} ax={p.x} ay={p.y} t={t} />; })}
      <StepCounter t={t} />
      <Scoreboard t={t} />
      <LogoStamp t={t} />
      <Confetti t={t} />
      <Versus t={t} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
      {t > STORY - 0.01 && <AbsoluteFill style={{ opacity: outroIn }}><Sequence from={Math.round(STORY * FPS)} layout="none"><Outro /></Sequence></AbsoluteFill>}

      {/* ---------------- audio ---------------- */}
      <Audio src={staticFile("flatpack/music.wav")} volume={0.9} />
      {SFX.map(([st, n, v], i) => <Sequence key={`s${i}`} from={Math.round(st * FPS)} durationInFrames={Math.round(2.4 * FPS)}><Audio src={staticFile(`flatpack/${n}.wav`)} volume={v} /></Sequence>)}
      {BRAND.map(([st, n, v], i) => <Sequence key={`b${i}`} from={Math.round(st * FPS)} durationInFrames={Math.round(2 * FPS)}><Audio src={staticFile(n)} volume={v} /></Sequence>)}
      {BUBBLES.filter((b) => b.who !== "lefty").flatMap((b, i) => (b.who === "all" ? (["duke", "pia", "gus"] as Who[]) : [b.who]).map((w, k) => (
        <Sequence key={`v${i}${k}`} from={Math.round(b.t0 * FPS)} durationInFrames={Math.round((b.t1 - b.t0 - 0.1) * FPS)}>
          <Audio src={staticFile(`flatpack/babble_${w}.wav`)} volume={b.kind === "whisper" ? 0.35 : b.kind === "shout" || b.kind === "grawlix" ? 0.9 : 0.7} playbackRate={b.kind === "shout" || b.kind === "grawlix" ? 1.15 : 1} loop startFrom={Math.round(((i * 37 + k * 23) % 90))} />
        </Sequence>
      )))}
      <Sequence from={Math.round(34.25 * FPS)}><Audio src={staticFile("flatpack/vo_lefty_where.wav")} volume={1} /></Sequence>
    </AbsoluteFill>
  );
};
