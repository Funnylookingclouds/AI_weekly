/**
 * SOME ASSEMBLY RAGE – shared episode kit. An episode file (episodes/epN.tsx) only defines its timelines
 * (moods, moves, bubbles, camera, bursts, SFX), its furniture pieces and any special props, then renders <Stage>.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, random } from "remotion";
import type { Expr } from "../cast/rig";
import { C, Furni, LUCKY, Lefty, type Emote, type FurniId } from "./furni";

export const FPS = 60;
export const INK = C.ink;
export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
export const back = (p: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export type Who = FurniId | "alvin" | "lefty" | "junior" | "all" | "duke+pia";
export const COLOR: Record<Who, string> = { duke: C.tomato, pia: C.teal, gus: C.grape, lotta: C.gum, alvin: "#94a3b8", lefty: "#94a3b8", junior: C.sun, all: C.sun, "duke+pia": C.sun };
export const HEAD: Record<string, number> = { duke: 360, pia: 270, gus: 260, lotta: 405, alvin: 75, lefty: 95, junior: 170 };
export type Voice = { file: string; dur: number; words: { w: string; s: number; e: number }[] } | null;
export type Bub = { who: Who; t0: number; t1: number; text: string; kind?: "say" | "shout" | "whisper" | "grawlix" };
export const VDELAY = 0.05;
export type CamKey = [number, number, number, number, number];
export type MoodKey = [number, Expr, Emote];
export type MoveKey = [number, number, number, number];
export type BurstT = [number, number, number, string, string, number];
export type Cue = [number, string, number];

// ------------------------------------------------------------------ timeline helpers
export const makeCam = (CAM: CamKey[], SHAKES: [number, number][]) => (t: number) => {
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
export type Cam = ReturnType<ReturnType<typeof makeCam>>;
export const moodAt = (keys: MoodKey[], t: number) => {
  let k = keys[0];
  for (const m of keys) if (m[0] <= t) k = m;
  return { expr: k[1], emote: k[2], since: t - k[0] };
};
export const posAt = (W: MoveKey[], t: number) => {
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
/** stretch bubbles to fit their voice line, but close when the next bubble opens */
export const fitBubbles = (B: Bub[], V: Voice[]) => B.forEach((b, i) => { const v = V[i]; const nx = B[i + 1]; if (v) b.t1 = Math.max(b.t1, Math.min(b.t0 + VDELAY + v.dur + 0.25, nx ? Math.max(b.t1, nx.t0) : 99)); });
export const makeSpeaking = (B: Bub[], V: Voice[]) => (who: string, t: number) => B.some((b, i) => {
  const v = V[i]; if (!v || !b.who.split("+").includes(who)) return false;
  const lt = t - b.t0 - VDELAY; return v.words.some((w) => lt >= w.s - 0.02 && lt <= w.e + 0.02);
});

// ------------------------------------------------------------------ characters as world items
export const S = 460, SCALE = S / 600, GROUND = (222 + 560) * SCALE;
export const furniNode = (id: FurniId, p: { x: number; y: number }, o: { expr: Expr; emote: Emote; since: number; frame: number; yaw: number; talk: boolean; hop: number; glow?: number; squash?: number }) => {
  const ds = 1 + (p.y - 100) * 0.0011;
  return (
    <g key={id} transform={`translate(${p.x} ${p.y}) scale(${ds}) translate(${-S / 2} ${-GROUND})`}>
      <Furni id={id} expr={o.expr} emote={o.emote} emoteAge={o.since * FPS} f={o.frame} size={S} yaw={o.yaw} talk={o.talk} hop={o.hop / SCALE} glow={o.glow ?? 0} squash={o.squash ?? 0} />
    </g>
  );
};
/** Lefty rolls in from the right at t0 to x, optional flee time (rolls back out). */
export const leftyNode = (t: number, frame: number, t0: number, x: number, y: number, talk: boolean, flee?: number) => {
  if (t < t0) return null;
  const a = clamp((t - t0) / 1.0);
  let lx = lerp(900, x, ease(a)), rot = a < 1 ? 90 + (1 - ease(a)) * 1440 : Math.sin(t * 3) * 4;
  const hop = t > t0 + 1 && t < t0 + 1.3 ? Math.sin(((t - t0 - 1) / 0.3) * Math.PI) * 40 : 0;
  if (flee !== undefined && t > flee) { const b = clamp((t - flee) / 0.6); lx = lerp(x, 1300, b * b); rot = 90 + b * 1440; }
  return <g key="lefty" transform={`translate(${lx} ${y - 60 - hop}) rotate(${rot})`}><Lefty f={frame} size={0.75} talk={talk} /></g>;
};

// ------------------------------------------------------------------ furniture pieces
export type Pose = { x: number; y: number; r: number; flip?: number };
export type PieceState = ReturnType<typeof pieceAt>;
export type PieceDef = { id: string; w: number; h: number; built: Pose; pile: Pose; fall: Pose; off?: Pose; color: string; ev: [number, string][]; box?: Pose; draw?: (s: PieceState, def: PieceDef) => React.ReactNode; knob?: boolean; label?: string };
const BOX: Pose = { x: 0, y: -150, r: 0 };
const OFF: Pose = { x: -260, y: 64, r: 74 };
const poseOf = (p: PieceDef, s: string): Pose => s === "box" ? (p.box ?? BOX) : s === "pile" ? p.pile : s === "fall" ? p.fall : s === "off" ? (p.off ?? OFF) : s === "backwards" ? { ...p.built, flip: 1 } : s === "upside" ? { ...p.built, r: p.built.r + 180 } : { ...p.built, flip: 0 };
export const Room: React.FC<{ t: number; angry?: boolean; wall?: [string, string] }> = ({ t, angry = false, wall = ["#bff0dc", "#a6e6cc"] }) => {
  const sec = t * (angry ? 40 : 6);
  return (
    <g>
      {/* wallpaper */}
      <rect x={-2400} y={-2800} width={4800} height={2760} fill={wall[0]} />
      {[...Array(40)].map((_, i) => <rect key={i} x={-2400 + i * 120} y={-2800} width={56} height={2760} fill={wall[1]} />)}
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


export const PalletBox: React.FC<{ t: number; name: string; drop?: number | null; flap?: number; flat?: number; x?: number }> = ({ t, name, drop = null, flap: flapT = 2.95, flat: flatT = 6.0, x: bx = 40 }) => {
  const fall = drop === null ? 1 : clamp((t - drop) / 0.45);
  const land0 = drop === null ? -99 : drop + 0.45;
  const y = lerp(-1900, 0, fall * fall);
  const land = t > land0 && t < land0 + 1 ? Math.exp(-(t - land0) * 10) * Math.sin((t - land0) * 40) * 0.12 : 0;
  const flap = clamp((t - flapT) / 0.3);
  const flat = clamp((t - flatT) / 0.25);
  const boxSy = 1 - flat * 0.86;
  return (
    <g transform={`translate(${bx} ${y - 10}) scale(${1 + land} ${1 - land})`}>
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
        <text x={-150} y={-195} fontFamily={LUCKY} fontSize={44} fill={INK}>{name}</text>
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
export const shade2 = (hex: string, k: number) => { const n = parseInt(hex.slice(1), 16); return `rgb(${[16, 8, 0].map((s) => Math.min(255, Math.round(((n >> s) & 255) * k))).join(",")})`; };


export const Manual: React.FC<{ f: number; name?: string; page?: "cover" | "C" | "eyes" }> = ({ f, name = "BJÖRKSNÄP", page = "cover" }) => (
  <g>
    <rect x={-60} y={-80} width={120} height={160} rx={6} fill="#fff" stroke={INK} strokeWidth={6} />
    <rect x={-60} y={-80} width={120} height={34} fill={C.sky} stroke={INK} strokeWidth={5} />
    <text x={0} y={-56} textAnchor="middle" fontFamily={LUCKY} fontSize={17} fill={INK}>{name}</text>
    {page === "C" ? (
      <g><text x={0} y={52} textAnchor="middle" fontFamily={LUCKY} fontSize={92} fill={C.tomato} stroke={INK} strokeWidth={4} paintOrder="stroke">C</text>
        <g transform={`translate(${36 + Math.sin(f / 4) * 4} -6) scale(0.5)`}><circle cy={-30} r={18} fill="#fff" stroke={INK} strokeWidth={5} /><path d="M0 -12 V 22 M0 0 l -34 10 M0 22 l -14 26 M0 22 l 14 26" stroke={INK} strokeWidth={6} strokeLinecap="round" /></g></g>
    ) : (
    <g transform={`translate(0 18) rotate(${page === "eyes" ? 0 : Math.sin(f / 6) * 6})`}>
      <circle cy={-30} r={18} fill="#fff" stroke={INK} strokeWidth={4} /><path d="M-14 -46 h28 l -4 -10 h-20 Z" fill={C.tomato} stroke={INK} strokeWidth={3} />
      <circle cx={-6} cy={-30} r={2.5} fill={INK} /><circle cx={6} cy={-30} r={2.5} fill={INK} /><path d="M-6 -20 q 6 4 12 0" stroke={INK} strokeWidth={2.5} fill="none" />
      {page === "eyes" ? <path d="M0 -12 V 22 M0 22 l -14 26 M0 22 l 14 26 M0 0 Q -20 -10 -8 -30 M0 0 Q 20 -10 8 -30" stroke={INK} strokeWidth={5} strokeLinecap="round" fill="none" /> : <path d="M0 -12 V 22 M0 22 l -14 26 M0 22 l 14 26 M0 0 l 22 -14 M0 0 l -22 10" stroke={INK} strokeWidth={5} strokeLinecap="round" />}
    </g>
    )}
  </g>
);


export const Burst: React.FC<{ x: number; y: number; text: string; color: string; rot: number; age: number }> = ({ x, y, text, color, rot, age }) => {
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

export const Bubble: React.FC<{ b: Bub; ax: number; ay: number; t: number; v?: Voice }> = ({ b, ax, ay, t, v }) => {
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
      <div style={{ position: "absolute", left: jag ? 30 : 46, right: 30, top: 0, height: h, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: LUCKY, fontSize: fs, lineHeight: 1.05, color: kind === "grawlix" ? "#fff" : INK, WebkitTextStroke: kind === "grawlix" ? `4px ${INK}` : undefined, paintOrder: "stroke", fontStyle: kind === "whisper" ? "italic" : undefined, letterSpacing: kind === "grawlix" ? 8 : 1 }}><span>{(() => {
        const ws = b.text.split(" ");
        const lt = t - b.t0 - VDELAY;
        const vw = v && v.words.length === ws.length ? v.words : null;
        return ws.map((w, k) => { const on = vw && lt >= vw[k].s - 0.03 && lt < (k + 1 < vw.length ? vw[k + 1].s : vw[k].e + 0.3); return <span key={k} style={{ color: on ? (jag ? C.tomato : "#e8890c") : undefined, textDecoration: on ? "underline" : undefined, textDecorationThickness: 6, textUnderlineOffset: 8 }}>{w}{k < ws.length - 1 ? " " : ""}</span>; });
      })()}</span></div>
    </div>
  );
};


export const Confetti: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const a = t - t0;
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


export const pieceAt = (p: PieceDef, t: number) => {
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

/** default board renderer: laminated panel with wood edge, holes, optional drawer knob + label */
export const Piece: React.FC<{ def: PieceDef; t: number }> = ({ def, t }) => {
  const s = pieceAt(def, t);
  if (s.hidden) return null;
  if (def.draw) return <g transform={`translate(${s.x} ${s.y}) rotate(${s.r})`}>{def.draw(s, def)}</g>;
  const { w, h } = def;
  const d = 14;
  const fs = Math.cos(s.flip * Math.PI);
  return (
    <g transform={`translate(${s.x} ${s.y}) rotate(${s.r}) scale(${Math.abs(fs) || 0.02} 1)`}>
      <path d={`M${-w / 2} ${-h / 2} l ${d} ${-d * 0.7} h ${w} v ${h} l ${-d} ${d * 0.7} Z`} fill={C.woodD} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={3} fill={fs < 0 ? "#a0703f" : def.color} stroke={INK} strokeWidth={5} />
      {def.knob && <circle cx={0} cy={0} r={Math.min(12, h / 5)} fill={C.sun} stroke={INK} strokeWidth={4} />}
      {def.label && <g><rect x={-46} y={-h / 2 + 8} width={92} height={22} rx={3} fill="#fff" stroke={INK} strokeWidth={3} /><text x={0} y={-h / 2 + 25} textAnchor="middle" fontFamily={LUCKY} fontSize={15} fill={INK}>{def.label}</text></g>}
      {w < 40 && [-h / 2 + 30, 0, h / 2 - 30].map((y) => <circle key={y} cx={0} cy={y} r={4} fill={INK} opacity={0.5} />)}
      {h < 40 && w > 100 && [-w / 2 + 16, w / 2 - 16].map((x) => <circle key={x} cx={x} cy={0} r={4} fill={INK} opacity={0.5} />)}
    </g>
  );
};

// ------------------------------------------------------------------ HUD overlays
export const StepCounter: React.FC<{ t: number; n: number | null; of: number; bad?: boolean }> = ({ t, n, of, bad = false }) => {
  if (n === null) return null;
  const done = n >= of;
  return (
    <div style={{ position: "absolute", left: 40, top: 200, padding: "14px 26px", background: done ? C.mint : bad ? C.tomato : "#fff", border: `6px solid ${INK}`, borderRadius: 20, fontFamily: LUCKY, fontSize: 48, color: INK, boxShadow: `8px 8px 0 ${INK}`, transform: `rotate(-4deg) scale(${1 + (bad ? Math.sin(t * 50) * 0.04 : 0)})` }}>
      STEP {n} <span style={{ fontSize: 34 }}>OF {of}</span> {done ? "✔" : bad ? "↩" : ""}
    </div>
  );
};
export const Scoreboard: React.FC<{ t: number; t0: number; t1: number; cells: [string, string | number, string][]; top?: number }> = ({ t, t0, t1, cells, top = 330 }) => {
  if (t < t0 || t > t1) return null;
  const y = t < t0 + 0.25 ? -200 + ((t - t0) / 0.25) * (top + 200) : t > t1 - 0.25 ? top - ((t - (t1 - 0.25)) / 0.25) * (top + 200) : top;
  return (
    <div style={{ position: "absolute", left: 60, top: y, width: 800, display: "flex", border: `6px solid ${INK}`, borderRadius: 18, overflow: "hidden", boxShadow: `8px 8px 0 ${INK}`, fontFamily: LUCKY }}>
      {cells.map(([lab, val, col], i) => (
        <React.Fragment key={i}>
          <div style={{ flex: 1, background: col, color: "#fff", fontSize: 40, padding: "14px 16px", WebkitTextStroke: `2px ${INK}`, whiteSpace: "nowrap" }}>{lab}</div>
          <div style={{ minWidth: 100, padding: "6px 10px 0", background: "#111827", color: C.sun, fontSize: 60, textAlign: "center" }}>{val}</div>
        </React.Fragment>
      ))}
    </div>
  );
};
export const Versus: React.FC<{ t: number; t0: number; left: string; right: string; lc?: string; rc?: string }> = ({ t, t0, left, right, lc = C.tomato, rc = C.teal }) => {
  const a = t - t0;
  if (a < 0 || a > 0.9) return null;
  const inP = back(clamp(a / 0.18)), outP = clamp((a - 0.72) / 0.18);
  const bolt = "M0 -120 L-46 10 L-6 10 L-34 130 L52 -30 L10 -30 L40 -120 Z";
  const big = (txt: string) => ({ fontFamily: LUCKY, fontSize: txt.length > 6 ? 120 : 170, color: "#fff", WebkitTextStroke: `7px ${INK}`, transform: "rotate(-8deg)" });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, background: lc, clipPath: "polygon(0 0, 62% 0, 38% 100%, 0 100%)", transform: `translateX(${(-1 + inP) * 700 - outP * 900}px)`, display: "flex", alignItems: "center" }}>
        <div style={{ marginLeft: 60, marginTop: -500, ...big(left) }}>{left}</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, background: rc, clipPath: "polygon(62% 0, 100% 0, 100% 100%, 38% 100%)", transform: `translateX(${(1 - inP) * 700 + outP * 900}px)`, display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
        <div style={{ marginRight: 150, marginBottom: 520, ...big(right) }}>{right}</div>
      </div>
      <div style={{ position: "absolute", left: 340, top: 760, width: 400, height: 400, transform: `scale(${inP * (1 - outP)}) rotate(${Math.sin(a * 40) * 4}deg)` }}>
        <svg width={400} height={400} viewBox="-200 -200 400 400"><path d={bolt} transform="scale(1.4)" fill={C.sun} stroke={INK} strokeWidth={8} strokeLinejoin="round" /></svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: LUCKY, fontSize: 150, color: "#fff", WebkitTextStroke: `7px ${INK}` }}>VS</div>
      </div>
    </AbsoluteFill>
  );
};
export const LogoStamp: React.FC<{ t: number; t0: number; sub: string }> = ({ t, t0, sub }) => {
  const a = t - t0;
  if (a < 0 || a > 1.7) return null;
  const s = a < 0.15 ? 2 - a / 0.15 : 1;
  const out = clamp((a - 1.45) / 0.25);
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: 230, textAlign: "center", transform: `scale(${s * (1 - out)}) rotate(-5deg)`, opacity: 1 - out, fontFamily: LUCKY }}>
      <span style={{ display: "inline-block", background: "#fff", border: `7px solid ${INK}`, borderRadius: 18, padding: "10px 30px", boxShadow: `10px 10px 0 ${INK}`, fontSize: 64, color: INK }}>SOME ASSEMBLY <span style={{ color: C.tomato }}>RAGE!</span></span>
      <div style={{ fontSize: 38, color: "#fff", WebkitTextStroke: `3px ${INK}`, marginTop: 14 }}>{sub}</div>
    </div>
  );
};
export const flashAt = (t: number, times: number[]) => times.reduce((a, ft) => a + (t >= ft && t < ft + 0.25 ? (Math.floor((t - ft) * 30) % 2 ? 0.2 : 0.75) * (1 - (t - ft) / 0.25) : 0), 0);
export const dustNode = (t: number, t0: number, x: number, y: number, key: string) => { const a = (t - t0) / 0.8; if (a < 0 || a > 1) return null; return <g key={key}>{[...Array(8)].map((_, i) => { const ang = (i / 8) * Math.PI; return <circle key={i} cx={x + Math.cos(ang) * (80 + a * 260) * (i % 2 ? 1 : -1)} cy={y - Math.sin(ang) * a * 60} r={30 + a * 50} fill="#fff" stroke={INK} strokeWidth={4} opacity={1 - a} />; })}</g>; };

// ------------------------------------------------------------------ stage (room + world + foreground), optional split screen
export const World: React.FC<{ t: number; cam: Cam; items: { y: number; node: React.ReactNode }[]; wall?: [string, string]; angry?: boolean }> = ({ t, cam, items, wall, angry }) => {
  const sorted = [...items].sort((a, b) => a.y - b.y);
  return (
    <g>
      <g transform={`translate(${540 + cam.sx} ${960 + cam.sy}) scale(${cam.z}) translate(${-cam.x * 0.85} ${-cam.y})`}><Room t={t} angry={angry} wall={wall} /></g>
      <g transform={`translate(${540 + cam.sx} ${960 + cam.sy}) scale(${cam.z}) translate(${-cam.x} ${-cam.y})`}>{sorted.map((it) => it.node)}</g>
      <g transform={`translate(${540 + cam.sx} ${960 + cam.sy}) scale(${cam.z * 1.25}) translate(${-cam.x * 1.25 - 760} ${-cam.y + 480})`}>
        <rect x={-90} y={0} width={180} height={170} rx={20} fill={C.grape} stroke={INK} strokeWidth={8} />
        {[-2, -1, 0, 1, 2].map((s) => <ellipse key={s} cx={s * 50} cy={-90} rx={36} ry={120} fill={C.mint} stroke={INK} strokeWidth={6} transform={`rotate(${s * 18 + Math.sin(t * 2 + s) * 3} ${s * 50} 0)`} />)}
      </g>
    </g>
  );
};
export const Stage: React.FC<{ t: number; cam: Cam; items: { y: number; node: React.ReactNode }[]; wall?: [string, string]; angry?: boolean; storm?: number; split?: [Cam, Cam] | null; children?: React.ReactNode }> = ({ t, cam, items, wall, angry, storm = 0, split = null, children }) => (
  <AbsoluteFill style={{ background: wall?.[0] ?? "#bff0dc", overflow: "hidden" }}>
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4CC9F0" /><stop offset="1" stopColor="#bdeaff" /></linearGradient>
        <clipPath id="topHalf"><polygon points="0,0 1080,0 1080,900 0,1020" /></clipPath>
        <clipPath id="botHalf"><polygon points="0,1020 1080,900 1080,1920 0,1920" /></clipPath>
      </defs>
      {split ? (
        <g>
          <g clipPath="url(#topHalf)"><World t={t} cam={split[0]} items={items} wall={wall} angry={angry} /></g>
          <g clipPath="url(#botHalf)"><World t={t} cam={split[1]} items={items} wall={wall} angry={angry} /></g>
          <polyline points="0,1020 1080,900" stroke={INK} strokeWidth={22} /><polyline points="0,1020 1080,900" stroke={C.sun} strokeWidth={10} />
        </g>
      ) : <World t={t} cam={cam} items={items} wall={wall} angry={angry} />}
      <rect width={1080} height={1920} fill="#1e1b4b" opacity={storm} />
    </svg>
    {children}
  </AbsoluteFill>
);

// ------------------------------------------------------------------ overlays bundle
export const Overlays: React.FC<{ t: number; cam: Cam; bubbles: Bub[]; voice: Voice[]; heads: (who: Who) => { x: number; y: number }; bursts: BurstT[] }> = ({ t, cam, bubbles, voice, heads, bursts }) => {
  const toScreen = (wx: number, wy: number) => ({ x: 540 + (wx - cam.x) * cam.z + cam.sx, y: 960 + (wy - cam.y) * cam.z + cam.sy });
  return (
    <>
      {bursts.map(([bt, x, y, txt, col, rot], i) => t >= bt && t < bt + 0.85 && (() => { const p = toScreen(x, y); return <Burst key={`bu${i}`} x={p.x} y={p.y} text={txt} color={col} rot={rot} age={t - bt} />; })())}
      {bubbles.map((b, i) => {
        if (t < b.t0 || t >= b.t1) return null;
        let p: { x: number; y: number };
        if (b.who === "all") p = { x: 540, y: 820 };
        else if (b.who === "duke+pia") { const a = heads("duke"), c = heads("pia"); p = toScreen((a.x + c.x) / 2, Math.min(a.y, c.y)); }
        else { const h = heads(b.who); p = toScreen(h.x, h.y); }
        return <Bubble key={`b${i}`} b={b} ax={p.x} ay={p.y} t={t} v={voice[i]} />;
      })}
    </>
  );
};

// ------------------------------------------------------------------ audio bundle
export const EpisodeAudio: React.FC<{ music: string; sfx: Cue[]; bubbles: Bub[]; voice: Voice[]; grawlix?: { t: number; whos: string[] }[] }> = ({ music, sfx, bubbles, voice, grawlix = [] }) => (
  <>
    <Audio src={staticFile(music)} volume={0.9} />
    {sfx.map(([st, n, v], i) => <Sequence key={`s${i}`} from={Math.round(st * FPS)} durationInFrames={Math.round(2.4 * FPS)}><Audio src={staticFile(n.includes("/") ? n : `flatpack/${n}.wav`)} volume={v} /></Sequence>)}
    {bubbles.map((b, i) => { const v = voice[i]; return v && <Sequence key={`vo${i}`} from={Math.round((b.t0 + VDELAY) * FPS)} durationInFrames={Math.round((v.dur + 0.3) * FPS)}><Audio src={staticFile(v.file)} volume={1} /></Sequence>; })}
    {grawlix.map((g, j) => (
      <React.Fragment key={`g${j}`}>
        {g.whos.map((w, k) => <Sequence key={k} from={Math.round(g.t * FPS)} durationInFrames={Math.round(1.5 * FPS)}><Audio src={staticFile(`flatpack/babble_${w}.wav`)} volume={0.55} playbackRate={1.2} loop startFrom={k * 30} /></Sequence>)}
        <Sequence from={Math.round((g.t + 0.05) * FPS)} durationInFrames={Math.round(1.4 * FPS)}><Audio src={staticFile("flatpack/sfx_bleep.wav")} volume={0.35} /></Sequence>
      </React.Fragment>
    ))}
  </>
);
