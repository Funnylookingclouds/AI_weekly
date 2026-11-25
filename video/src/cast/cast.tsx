/**
 * Five new AI Bounce characters, code-drawn in 3D-shaded paper-sticker style:
 *  Pixel   – hyper cube robot with a screen face (box geometry, real faces + lighting)
 *  Lumi    – lightbulb genius who glows when she gets an idea (glass sphere + screw base)
 *  Chip    – nervous little processor (thin box, gold pins as arms/legs)
 *  Cloudy  – sleepy, goofy cloud that rains when sad (3D cluster of shaded puffs)
 *  Wattson – grumpy battery whose charge meter shows his mood (cylinder)
 */
import React from "react";
import { INK, Arms, Face, StickerFilter, boxGeo, lambert, rot, scr, shade, type Expr, type V3 } from "./rig";

export type CastId = "pixel" | "lumi" | "chip" | "cloudy" | "wattson";
export const CAST: { id: CastId; name: string; tag: string; traits: string[]; accent: string; voice: string }[] = [
  { id: "pixel", name: "PIXEL", tag: "the hyper cube", traits: ["runs at 60 fps – emotionally", "screen face, glitches when excited", "loves memes & speed"], accent: "#0ea5e9", voice: "TX3LPaxmHKxFdv7VOQHJ" },
  { id: "lumi", name: "LUMI", tag: "the bright idea", traits: ["literally lights up with ideas", "smart, a bit smug", "glows brighter when happy"], accent: "#eab308", voice: "FGY2WhTYpPnrIDTdsKH5" },
  { id: "chip", name: "CHIP", tag: "the nervous processor", traits: ["90% anxiety, 10% silicon", "sweats when overclocked", "taps his pin-feet nonstop"], accent: "#16a34a", voice: "SDARFhQygpPvpLh7Ad1B" },
  { id: "cloudy", name: "CLOUDY", tag: "the cloud storage", traits: ["chill, goofy, always sleepy", "rains when sad, thunders when mad", "rainbow when laughing"], accent: "#60a5fa", voice: "wGkprrTXgBM5EC3Znt6U" },
  { id: "wattson", name: "WATTSON", tag: "the grumpy battery", traits: ["charge meter = mood meter", "sparks fly when angry", "hates video calls"], accent: "#f97316", voice: "MKlLqCItoCkvdhrxgtLv" },
];

type BP = { expr: Expr; yaw: number; open: number; blink: boolean; look: { x: number; y: number }; f: number };

// ---------------------------------------------------------------------------
const Pixel: React.FC<BP> = ({ expr, yaw, open, blink, look, f }) => {
  const pitch = 0.3;
  const g = boxGeo(190, 175, 175, yaw, pitch, "#38bdf8");
  const top = g.at([0, 87.5, 0]);
  const glitch = expr === "laugh" || expr === "surprised" ? Math.sin(f * 2.3) * 3 : 0;
  const sh = [g.at([-95, -15, 0]), g.at([95, -15, 0])] as [{ x: number; y: number }, { x: number; y: number }];
  const legs = [g.at([-45, -87.5, 0]), g.at([45, -87.5, 0])];
  return (
    <g>
      {legs.map((l, i) => <g key={i}><line x1={l.x} y1={l.y - 6} x2={l.x} y2={l.y + 40} stroke={INK} strokeWidth={14} strokeLinecap="round" /><ellipse cx={l.x + (i ? 10 : -10)} cy={l.y + 46} rx={24} ry={12} fill="#1e293b" stroke={INK} strokeWidth={4} /></g>)}
      <Arms sh={sh} expr={expr} f={f} color="#7dd3fc" />
      {g.faces.map((fc) => (
        <g key={fc.id}>
          <polygon points={fc.pts.map((p) => `${p.x},${p.y}`).join(" ")} fill={fc.fill} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          {fc.id === "front" && (
            <g transform={g.m}>
              <rect x={-78} y={-70} width={156} height={130} rx={22} fill="#0b1220" stroke={INK} strokeWidth={5} />
              <g transform={`translate(${glitch} 0)`} opacity={0.97}>
                <Face th={{ mode: "flat", R: 92, E: 27, lid: "#0b1220", screen: true }} expr={expr} yaw={0} open={open} blink={blink} look={look} f={f} />
              </g>
              {[...Array(6)].map((_, i) => <line key={i} x1={-74} x2={74} y1={-60 + i * 22 + (f % 22)} y2={-60 + i * 22 + (f % 22)} stroke="#ffffff10" strokeWidth={3} />)}
            </g>
          )}
        </g>
      ))}
      <line x1={top.x} y1={top.y} x2={top.x + yaw * 10} y2={top.y - 55} stroke={INK} strokeWidth={6} />
      <circle cx={top.x + yaw * 10} cy={top.y - 62} r={13} fill={expr === "surprised" || expr === "angry" ? "#ef4444" : "#facc15"} stroke={INK} strokeWidth={4} style={{ filter: "drop-shadow(0 0 10px #facc15)" }} />
    </g>
  );
};

// ---------------------------------------------------------------------------
const Lumi: React.FC<BP> = ({ expr, yaw, open, blink, look, f }) => {
  const id = React.useId().replace(/:/g, "");
  const bright = { happy: 1, laugh: 1, love: 1, surprised: 0.9, smug: 0.75, neutral: 0.6, confused: 0.45, angry: 0.7, sad: 0.2, scared: 0.3 }[expr];
  const flick = expr === "scared" ? (Math.sin(f * 1.7) > 0.3 ? 0.4 : 1) : 1;
  const R = 98, cy = -45;
  const fil = (x: number, y: number) => `${x * Math.cos(yaw)} ${cy + y}`;
  return (
    <g>
      <defs>
        <radialGradient id={`gl${id}`} cx={0.38 - yaw * 0.15} cy={0.32} r={0.75}><stop offset="0%" stopColor="#fffdf2" /><stop offset="55%" stopColor="#fff1a8" /><stop offset="100%" stopColor="#f2c14e" /></radialGradient>
        <radialGradient id={`ha${id}`}><stop offset="0%" stopColor="#fde047" stopOpacity={0.55 * bright * flick} /><stop offset="100%" stopColor="#fde047" stopOpacity={0} /></radialGradient>
        <linearGradient id={`mt${id}`} x1="0" x2="1"><stop offset="0" stopColor="#6b7280" /><stop offset={0.35 - yaw * 0.2} stopColor="#e5e7eb" /><stop offset="1" stopColor="#4b5563" /></linearGradient>
      </defs>
      <circle cx={0} cy={cy} r={R * 1.9} fill={`url(#ha${id})`} />
      {bright > 0.85 && [...Array(10)].map((_, i) => { const a = (i / 10) * Math.PI * 2 + f / 40; return <line key={i} x1={Math.cos(a) * (R + 22)} y1={cy + Math.sin(a) * (R + 22)} x2={Math.cos(a) * (R + 50)} y2={cy + Math.sin(a) * (R + 50)} stroke="#facc15" strokeWidth={8} strokeLinecap="round" />; })}
      <Arms sh={[{ x: -40, y: 58 }, { x: 40, y: 58 }]} expr={expr} f={f} color="#9ca3af" />
      {/* screw base */}
      <path d={`M${-44} ${40} L${44} ${40} L${34} ${72} L${-34} ${72} Z`} fill={`url(#mt${id})`} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      {[0, 1, 2, 3].map((k) => <rect key={k} x={-34 + k * 1.5} y={72 + k * 14} width={68 - k * 3} height={14} rx={7} fill={`url(#mt${id})`} stroke={INK} strokeWidth={4} />)}
      <path d={`M-16 128 Q0 146 16 128 Z`} fill={INK} />
      {/* glass bulb */}
      <path d={`M${fil(-14, 96)} L${fil(-8, 80)} L${fil(-3, 90)} L${fil(3, 80)} L${fil(8, 90)} L${fil(14, 96)}`} stroke={shade("#f97316", 0.8 + bright * 0.4)} strokeWidth={5} fill="none" strokeLinejoin="round" opacity={0.35 + bright * 0.5} style={{ filter: `drop-shadow(0 0 ${6 + bright * 10}px #fb923c)` }} />
      <circle cx={0} cy={cy} r={R} fill={`url(#gl${id})`} stroke={INK} strokeWidth={6} opacity={0.9} />

      <Face th={{ mode: "sphere", R, E: 25, lid: "#fde68a", iris: "#a16207" }} expr={expr} yaw={yaw} pitch={0.05} open={open} blink={blink} look={look} f={f} />
      <ellipse cx={-38 - yaw * 30} cy={cy - 48} rx={20} ry={11} transform={`rotate(-35 ${-38 - yaw * 30} ${cy - 48})`} fill="#fff" opacity={0.8} />
    </g>
  );
};

// ---------------------------------------------------------------------------
const Chip: React.FC<BP> = ({ expr, yaw, open, blink, look, f }) => {
  const g = boxGeo(175, 175, 34, yaw, 0.22, "#256d4a");
  const tap = (i: number) => Math.max(0, Math.sin(f / 3 + i * Math.PI)) * 10;
  const legs = [g.at([-40, -87.5, 0]), g.at([40, -87.5, 0])];
  const sh = [g.at([-88, 5, 17]), g.at([88, 5, 17])] as [{ x: number; y: number }, { x: number; y: number }];
  return (
    <g>
      {legs.map((l, i) => <g key={i}><path d={`M${l.x} ${l.y} L${l.x} ${l.y + 40 - tap(i)} L${l.x + (i ? 18 : -18)} ${l.y + 44 - tap(i)}`} stroke="#d4a017" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d={`M${l.x} ${l.y} L${l.x} ${l.y + 40 - tap(i)} L${l.x + (i ? 18 : -18)} ${l.y + 44 - tap(i)}`} stroke={INK} strokeWidth={3} fill="none" opacity={0.5} /></g>)}
      <Arms sh={sh} expr={expr} f={f} color="#d4a017" glove="#fde68a" />
      {g.faces.map((fc) => (
        <g key={fc.id}>
          <polygon points={fc.pts.map((p) => `${p.x},${p.y}`).join(" ")} fill={fc.fill} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          {fc.id === "front" && (
            <g transform={g.m}>
              {[-60, -30, 0, 30, 60].map((y) => <g key={y}><rect x={-102} y={y - 5} width={16} height={10} rx={3} fill="#d4a017" stroke={INK} strokeWidth={2.5} /><rect x={86} y={y - 5} width={16} height={10} rx={3} fill="#d4a017" stroke={INK} strokeWidth={2.5} /></g>)}
              {[-60, -30, 0, 30, 60].map((x) => <rect key={x} x={x - 5} y={-102} width={10} height={16} rx={3} fill="#d4a017" stroke={INK} strokeWidth={2.5} />)}
              <rect x={-70} y={-70} width={140} height={140} rx={10} fill="#1f5a3c" stroke="#0f2e1f" strokeWidth={3} />
              {[...Array(5)].map((_, i) => <path key={i} d={`M${-70} ${-50 + i * 25} h ${12 + (i % 2) * 10} v 8`} stroke="#d4a01755" strokeWidth={3} fill="none" />)}
              <circle cx={-56} cy={-56} r={6} fill="#d4a017" />
              <text x={38} y={64} fontSize={20} fontWeight={900} fill="#d4a01799" fontFamily="DejaVu Sans Mono, monospace">AI</text>
              <Face th={{ mode: "flat", R: 86, E: 27, lid: "#1f5a3c", iris: "#16a34a" }} expr={expr} yaw={0} open={open} blink={blink} look={look} f={f} />
            </g>
          )}
        </g>
      ))}
    </g>
  );
};

// ---------------------------------------------------------------------------
const PUFFS: [number, number, number, number][] = [
  [0, 0, 30, 88], [-92, -8, -6, 64], [94, -4, -6, 62], [-48, 62, -14, 60], [52, 66, -18, 64], [0, 40, -40, 72], [-140, -26, -34, 44], [142, -22, -34, 44],
];
const Cloudy: React.FC<BP> = ({ expr, yaw, open, blink, look, f }) => {
  const id = React.useId().replace(/:/g, "");
  const dark = expr === "angry" ? 0.62 : expr === "sad" ? 0.82 : 1;
  const base = "#f1f5f9";
  const puffs = PUFFS.map(([x, y, z, r]) => { const v = rot([x, y, z] as V3, yaw * 0.8, 0.08); return { ...scr(v), r }; }).sort((a, b) => a.z - b.z);
  const main = scr(rot([0, 0, 30], yaw * 0.8, 0.08));
  const bob = (i: number) => Math.sin(f / 12 + i) * 3;
  const hands = expr === "angry" || expr === "surprised" ? [[-150, -60], [150, -60]] : expr === "laugh" ? [[-120, 70], [120, 70]] : expr === "confused" ? [[-160, 40], [70, -110]] : [[-165, 50], [165, 50]];
  return (
    <g>
      <defs><radialGradient id={`cp${id}`} cx={0.35} cy={0.3} r={0.8}><stop offset="0%" stopColor="#ffffff" /><stop offset="65%" stopColor={shade(base, dark)} /><stop offset="100%" stopColor={shade("#cbd5e1", dark)} /></radialGradient></defs>
      {(expr === "happy" || expr === "laugh" || expr === "love") && (
        <g opacity={0.9}>{["#ef4444", "#f97316", "#facc15", "#22c55e", "#3b82f6", "#8b5cf6"].map((c, i) => <path key={c} d={`M${-200 + i * 11} 30 A ${200 - i * 11} ${200 - i * 11} 0 0 1 ${200 - i * 11} 30`} stroke={c} strokeWidth={11} fill="none" />)}</g>
      )}
      {expr === "sad" && [...Array(14)].map((_, i) => { const t = ((f * 1.6 + i * 23) % 120) / 120; return <line key={i} x1={-120 + (i * 37) % 240} y1={90 + t * 160} x2={-124 + (i * 37) % 240} y2={108 + t * 160} stroke="#60a5fa" strokeWidth={6} strokeLinecap="round" opacity={1 - t} />; })}
      {expr === "angry" && Math.floor(f / 6) % 3 !== 0 && <path d="M10 95 L-20 150 L8 150 L-18 210" stroke="#facc15" strokeWidth={12} fill="none" strokeLinejoin="round" />}
      {hands.map(([hx, hy], i) => <circle key={i} cx={hx} cy={hy + bob(i + 3)} r={24} fill={`url(#cp${id})`} stroke={INK} strokeWidth={5} />)}
      {puffs.map((p, i) => <circle key={i} cx={p.x} cy={p.y + bob(i)} r={p.r} fill={`url(#cp${id})`} stroke={INK} strokeWidth={5} />)}
      <g transform={`translate(${main.x} ${main.y + bob(0) + 6})`}>
        <Face th={{ mode: "sphere", R: 88, E: 22, lid: shade("#e2e8f0", dark), iris: "#0ea5e9" }} expr={expr} yaw={yaw * 0.8} pitch={0.08} open={open} blink={blink} look={look} f={f} />
      </g>
      {expr === "neutral" && [0, 1].map((k) => { const t = ((f + k * 40) % 80) / 80; return <text key={k} x={110 + t * 30} y={-90 - t * 60} fontSize={30 + k * 10} fontWeight={900} fill={INK} opacity={1 - t} fontFamily="Inter, sans-serif">z</text>; })}
    </g>
  );
};

// ---------------------------------------------------------------------------
const LEVEL: Record<Expr, [number, string]> = {
  neutral: [3, "#22c55e"], happy: [4, "#22c55e"], laugh: [5, "#22c55e"], love: [5, "#ec4899"], surprised: [3, "#facc15"],
  sad: [1, "#ef4444"], angry: [4, "#f97316"], smug: [4, "#22c55e"], confused: [2, "#facc15"], scared: [1, "#ef4444"],
};
const Wattson: React.FC<BP> = ({ expr, yaw, open, blink, look, f }) => {
  const id = React.useId().replace(/:/g, "");
  const r = 80, H = 215, top = -H / 2 - 10, bot = H / 2 - 10, ry = r * 0.28;
  const hl = Math.max(0.08, Math.min(0.85, 0.32 - yaw * 0.3));
  const [lvl, col] = LEVEL[expr];
  const blinkLow = lvl === 1 && Math.floor(f / 10) % 2 === 0;
  const meterA = 1.05 + yaw;
  const mx = r * Math.sin(meterA), msx = Math.cos(meterA);
  return (
    <g>
      <defs>
        <linearGradient id={`bd${id}`} x1="0" x2="1"><stop offset="0" stopColor="#111827" /><stop offset={hl} stopColor="#4b5563" /><stop offset={Math.min(1, hl + 0.25)} stopColor="#1f2937" /><stop offset="1" stopColor="#030712" /></linearGradient>
        <linearGradient id={`cu${id}`} x1="0" x2="1"><stop offset="0" stopColor="#9a3412" /><stop offset={hl} stopColor="#fdba74" /><stop offset={Math.min(1, hl + 0.25)} stopColor="#ea580c" /><stop offset="1" stopColor="#7c2d12" /></linearGradient>
      </defs>
      {[-34, 34].map((x, i) => <g key={i}><line x1={x} y1={bot + ry - 6} x2={x} y2={bot + ry + 34} stroke={INK} strokeWidth={14} strokeLinecap="round" /><ellipse cx={x + (i ? 10 : -10)} cy={bot + ry + 40} rx={22} ry={11} fill="#111827" stroke={INK} strokeWidth={4} /></g>)}
      <Arms sh={[{ x: -r + 4, y: 0 }, { x: r - 4, y: 0 }]} expr={expr} f={f} color="#9ca3af" />
      <ellipse cx={0} cy={bot} rx={r} ry={ry} fill="#030712" stroke={INK} strokeWidth={5} />
      <rect x={-r} y={top} width={2 * r} height={bot - top} fill={`url(#bd${id})`} />
      <path d={`M${-r} ${top} L${-r} ${top + 62} A ${r} ${ry} 0 0 0 ${r} ${top + 62} L${r} ${top} Z`} fill={`url(#cu${id})`} />
      <path d={`M${-r} ${top} L${-r} ${bot} A ${r} ${ry} 0 0 0 ${r} ${bot} L${r} ${top}`} fill="none" stroke={INK} strokeWidth={6} />
      <ellipse cx={0} cy={top} rx={r} ry={ry} fill={shade("#fdba74", 0.95)} stroke={INK} strokeWidth={5} />
      <rect x={-22} y={top - 24} width={44} height={22} fill="#d1d5db" stroke={INK} strokeWidth={4} />
      <ellipse cx={0} cy={top - 24} rx={22} ry={7} fill="#f3f4f6" stroke={INK} strokeWidth={4} />
      {msx > 0.15 && (
        <g transform={`translate(${mx} ${bot - 40}) scale(${msx} 1)`}>
          <rect x={-15} y={-108} width={30} height={112} rx={6} fill="#030712" stroke="#6b7280" strokeWidth={3} />
          {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={-10} y={-18 - k * 21} width={20} height={16} rx={3} fill={k < lvl && !(blinkLow && k === 0) ? col : "#1f2937"} style={{ filter: k < lvl ? `drop-shadow(0 0 6px ${col})` : undefined }} />)}
        </g>
      )}
      <g transform={`translate(0 ${top + 112})`}>
        <Face th={{ mode: "cylinder", R: r, E: 22, lid: "#374151", iris: "#f97316" }} expr={expr} yaw={yaw} open={open} blink={blink} look={look} f={f} />
      </g>
      {(expr === "angry" || expr === "surprised") && [0, 1, 2].map((k) => { const show = Math.floor(f / 4 + k) % 3 === 0; const a = -1.2 + k * 1.2; return show && <path key={k} d={`M${Math.cos(a) * 40} ${top - 30 + Math.sin(a) * 10} l ${Math.cos(a) * 18} -14 l -8 8 l ${Math.cos(a) * 22} -16`} stroke="#facc15" strokeWidth={6} fill="none" strokeLinejoin="round" />; })}
    </g>
  );
};

// ---------------------------------------------------------------------------
const BODY: Record<CastId, React.FC<BP>> = { pixel: Pixel, lumi: Lumi, chip: Chip, cloudy: Cloudy, wattson: Wattson };

/** Character with idle life (bob, squash on talk, laugh shake, scared shiver), sticker outline and ground shadow. */
export const Toon: React.FC<{ id: CastId; expr: Expr; f: number; size?: number; yaw?: number; open?: number; look?: { x: number; y: number }; still?: boolean }> = ({ id, expr, f, size = 300, yaw = 0, open = 0, look = { x: 0, y: 0 }, still = false }) => {
  const fid = React.useId().replace(/:/g, "");
  const B = BODY[id];
  const blink = !still && f % 170 < 6;
  const bob = still ? 0 : Math.sin(f / 14) * 6;
  const shake = expr === "laugh" ? Math.sin(f / 1.6) * 4 : expr === "scared" ? Math.sin(f * 1.9) * 2.5 : 0;
  const hop = expr === "surprised" ? -14 : 0;
  const sq = 1 + open * 0.04;
  const sway = still ? 0 : Math.sin(f / 50) * 0.06;
  return (
    <svg width={size} height={size * 1.3} viewBox="-230 -300 460 600" style={{ overflow: "visible" }}>
      <defs><StickerFilter id={`st${fid}`} /></defs>
      <ellipse cx={0} cy={250} rx={130 + bob * 2} ry={20} fill="#0004" />
      <g transform={`translate(${shake} ${bob + hop}) scale(${1 / sq} ${sq})`} filter={`url(#st${fid})`}>
        <B expr={expr} yaw={yaw + sway} open={open} blink={blink} look={look} f={f} />
      </g>
    </svg>
  );
};
export { lambert };
