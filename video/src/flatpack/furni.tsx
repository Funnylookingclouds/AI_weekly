/**
 * SOME ASSEMBLY RAGE – the four furniture characters (code-drawn 2.5D, real box geometry + lighting,
 * faces wrap on the 3D shapes, 10 expressions from the shared rig) and the orbiting emotion symbols.
 *
 *  Duke  – tall bookcase (tomato)   overconfident, never reads instructions, books for hair
 *  Pia   – chest of drawers (teal)  manual purist, round glasses, labelled drawers that pop out
 *  Gus   – armchair (grape)         big, gentle, hungry, solves everything with a tiny hammer
 *  Lotta – floor lamp (bubblegum)   tiny deadpan grandma lamp, lights up when she finishes the job
 */
import "@fontsource/luckiest-guy/400.css";
import React from "react";
import { Arms, Face, INK, StickerFilter, boxGeo, shade, type Expr } from "../cast/rig";

export const LUCKY = "'Luckiest Guy', 'Inter', sans-serif";
export const C = {
  tomato: "#FF5A4E", sun: "#FFC93C", mint: "#3DDC97", sky: "#4CC9F0", grape: "#9B5DE5", gum: "#F15BB5",
  teal: "#2EC4B6", cream: "#FFF4E0", wood: "#E8B67A", woodD: "#C98A4B", ink: INK,
};

export type FurniId = "duke" | "pia" | "gus" | "lotta";
export const FURNI: { id: FurniId; name: string; tag: string; color: string; traits: string[] }[] = [
  { id: "duke", name: "DUKE", tag: "the bookcase", color: C.tomato, traits: ["\"Instructions are a suggestion\"", "never reads the manual", "books for hair, ego for shelves"] },
  { id: "pia", name: "PIA", tag: "the chest of drawers", color: C.teal, traits: ["\"Step four. STEP. FOUR.\"", "labels every screw", "drawers pop out when she's mad"] },
  { id: "gus", name: "GUS", tag: "the armchair", color: C.grape, traits: ["big, soft, accidentally destructive", "tiny hammer for everything", "\"Is there a canteen?\""] },
  { id: "lotta", name: "LOTTA", tag: "the floor lamp", color: C.gum, traits: ["silent, deadpan, ancient", "finishes the build in 3 seconds", "lights up when she's done"] },
];

/** Emotion symbols that orbit / hover around a character. */
export type Emote = "none" | "rage" | "storm" | "grawlix" | "joy" | "love" | "music" | "confused" | "shock" | "sad" | "sweat" | "sparkle" | "zzz";

type BP = { expr: Expr; yaw: number; open: number; blink: boolean; f: number };

const GROUND = 222;
const Feet: React.FC<{ xs: number[]; y: number; color?: string }> = ({ xs, y, color = C.woodD }) => (
  <g>{xs.map((x, i) => <g key={i}><rect x={x - 9} y={y - 6} width={18} height={GROUND - y + 6} rx={4} fill={color} stroke={INK} strokeWidth={4} /><ellipse cx={x + (x < 0 ? -6 : 6)} cy={GROUND} rx={22} ry={11} fill="#1f2937" stroke={INK} strokeWidth={4} /></g>)}</g>
);

const poly = (pts: { x: number; y: number }[]) => pts.map((p) => `${p.x},${p.y}`).join(" ");

// ---------------------------------------------------------------------------
const Duke: React.FC<BP> = ({ expr, yaw, open, blink, f }) => {
  const W = 170, H = 330, D = 80;
  const g = boxGeo(W, H, D, yaw, 0.22, C.tomato);
  const sh = [g.at([-W / 2, 0, 0]), g.at([W / 2, 0, 0])] as [{ x: number; y: number }, { x: number; y: number }];
  const top = g.at([0, H / 2, 0]);
  const angry = expr === "angry";
  const books = ["#4CC9F0", "#FFC93C", "#3DDC97", "#F15BB5", "#9B5DE5", "#fff4e0"];
  return (
    <g>
      <Feet xs={[-50, 50]} y={160} />
      <Arms sh={sh} expr={expr} f={f} color={shade(C.tomato, 1.15)} />
      {g.faces.map((fc) => <polygon key={fc.id} points={poly(fc.pts)} fill={fc.fill} stroke={INK} strokeWidth={6} strokeLinejoin="round" />)}
      {g.faces.some((x) => x.id === "front") && (
        <g transform={g.m}>
          {/* inset frame + two shelves of books */}
          <rect x={-W / 2 + 14} y={-H / 2 + 14} width={W - 28} height={H - 28} rx={6} fill="none" stroke={shade(C.tomato, 0.7)} strokeWidth={4} />
          {[30, 100].map((y, r) => (
            <g key={y}>
              <rect x={-W / 2 + 18} y={y} width={W - 36} height={58} fill={shade(C.tomato, 0.55)} />
              {books.map((c, i) => { const bw = 18 + ((i * 7 + r * 3) % 9); const x = -W / 2 + 22 + books.slice(0, i).reduce((a, _, k) => a + 18 + ((k * 7 + r * 3) % 9) + 2, 0); const tilt = angry ? Math.sin(f / 2 + i) * 6 : i === 4 && r === 1 ? 14 : 0; return x + bw < W / 2 - 18 && <rect key={i} x={x} y={y + 6 + (i % 3) * 3} width={bw} height={52 - (i % 3) * 3} rx={2} fill={c} stroke={INK} strokeWidth={3} transform={`rotate(${tilt} ${x + bw / 2} ${y + 58})`} />; })}
              <rect x={-W / 2 + 18} y={y + 56} width={W - 36} height={8} fill={shade(C.tomato, 1.1)} stroke={INK} strokeWidth={3} />
            </g>
          ))}
          <g transform="translate(0 -70)"><Face th={{ mode: "flat", R: 72, E: 24, lid: shade(C.tomato, 0.9), iris: "#1d4ed8" }} expr={expr} yaw={yaw} open={open} blink={blink} f={f} /></g>
        </g>
      )}
      {/* book "quiff" on top */}
      <g transform={`translate(${top.x} ${top.y - 4}) rotate(${-8 + Math.sin(f / 18) * 3})`}>
        {[["#FFC93C", 70], ["#4CC9F0", 60], ["#3DDC97", 66]].map(([c, w], i) => <rect key={i} x={-Number(w) / 2 + i * 6 - 6} y={-16 - i * 15} width={Number(w)} height={15} rx={3} fill={String(c)} stroke={INK} strokeWidth={3.5} transform={`rotate(${i * 7 - 6})`} />)}
      </g>
    </g>
  );
};

// ---------------------------------------------------------------------------
const Pia: React.FC<BP> = ({ expr, yaw, open, blink, f }) => {
  const W = 210, H = 220, D = 110;
  const g = boxGeo(W, H, D, yaw, 0.22, C.teal);
  const sh = [g.at([-W / 2, 10, 0]), g.at([W / 2, 10, 0])] as [{ x: number; y: number }, { x: number; y: number }];
  const pop = expr === "angry" ? Math.abs(Math.sin(f / 3)) * 26 : expr === "surprised" || expr === "scared" ? 30 : expr === "laugh" ? Math.abs(Math.sin(f / 4)) * 14 : 0;
  const labels = ["SCREWS", "MORE SCREWS"];
  return (
    <g>
      <Feet xs={[-62, 62]} y={108} />
      <Arms sh={sh} expr={expr} f={f} color={shade(C.teal, 1.2)} />
      {g.faces.map((fc) => <polygon key={fc.id} points={poly(fc.pts)} fill={fc.fill} stroke={INK} strokeWidth={6} strokeLinejoin="round" />)}
      {g.faces.some((x) => x.id === "front") && (
        <g transform={g.m}>
          <rect x={-W / 2 + 12} y={-H / 2 + 12} width={W - 24} height={96} rx={10} fill={shade(C.teal, 1.12)} stroke={INK} strokeWidth={4} />
          {[0, 1].map((k) => {
            const y = 0 + k * 52, out = k === 1 ? pop : pop * 0.45;
            return (
              <g key={k} transform={`translate(0 ${out * 0.5})`}>
                {out > 1 && <rect x={-W / 2 + 14} y={y + 46} width={W - 28} height={out * 0.5} fill={shade(C.teal, 0.5)} stroke={INK} strokeWidth={3} />}
                <rect x={-W / 2 + 12} y={y} width={W - 24} height={46} rx={6} fill={shade(C.teal, out > 1 ? 1.2 : 1.05)} stroke={INK} strokeWidth={4} />
                <rect x={-34} y={y + 8} width={68} height={14} rx={2} fill="#fff" stroke={INK} strokeWidth={2} />
                <text x={0} y={y + 19} fontSize={9.5} textAnchor="middle" fontFamily={LUCKY} fill={INK}>{labels[k]}</text>
                <circle cx={0} cy={y + 33} r={6} fill={C.sun} stroke={INK} strokeWidth={3} />
              </g>
            );
          })}
          <g transform="translate(0 -52)">
            <Face th={{ mode: "flat", R: 62, E: 19, lid: shade(C.teal, 1.0), iris: "#7c3aed" }} expr={expr} yaw={yaw} open={open} blink={blink} f={f} />
            {/* round glasses */}
            {[-1, 1].map((s) => <circle key={s} cx={s * 62 * Math.sin(0.36)} cy={-62 * Math.sin(0.1)} r={27} fill="#ffffff22" stroke={INK} strokeWidth={5} />)}
            <path d={`M${-62 * Math.sin(0.36) + 27} -7 q ${62 * Math.sin(0.36) - 27} -9 ${2 * (62 * Math.sin(0.36) - 27)} 0`} stroke={INK} strokeWidth={5} fill="none" />
          </g>
        </g>
      )}
      {/* highlighter behind the "ear" */}
      {(() => { const p = g.at([W / 2 - 6, H / 2 - 20, D / 2]); return <g transform={`translate(${p.x} ${p.y}) rotate(-35)`}><rect x={-7} y={-42} width={14} height={50} rx={4} fill={C.sun} stroke={INK} strokeWidth={3} /><rect x={-7} y={-52} width={14} height={14} rx={3} fill="#f97316" stroke={INK} strokeWidth={3} /></g>; })()}
    </g>
  );
};

// ---------------------------------------------------------------------------
const Gus: React.FC<BP> = ({ expr, yaw, open, blink, f }) => {
  const col = C.grape;
  const back = boxGeo(270, 250, 56, yaw, 0.22, col);
  const seat = boxGeo(270, 76, 170, yaw, 0.22, "#B48AF0");
  // place boxes: backrest behind & above, seat in front & low, armrests on the sides
  const off = (geo: ReturnType<typeof boxGeo>, dx: number, dy: number, dz: number) => {
    const p = back.at([dx, dy, dz]);
    return { tf: `translate(${p.x} ${p.y})`, geo };
  };
  const seatP = off(seat, 0, -150, 60);
  const armL = boxGeo(52, 120, 200, yaw, 0.22, "#8A4FD6");
  const armR = boxGeo(52, 120, 200, yaw, 0.22, "#8A4FD6");
  const aL = off(armL, -160, -128, 50), aR = off(armR, 160, -128, 50);
  const far = Math.sin(yaw) > 0 ? [aL] : [aR];
  const near = Math.sin(yaw) > 0 ? [aR] : [aL];
  const Box = ({ tf, geo }: { tf: string; geo: ReturnType<typeof boxGeo> }) => <g transform={tf}>{geo.faces.map((fc) => <polygon key={fc.id} points={poly(fc.pts)} fill={fc.fill} stroke={INK} strokeWidth={6} strokeLinejoin="round" />)}</g>;
  const sh = [back.at([-185, -70, 60]), back.at([185, -70, 60])] as [{ x: number; y: number }, { x: number; y: number }];
  return (
    <g>
      <Feet xs={[-110, 110]} y={192} color={C.woodD} />
      {far.map((a, i) => <Box key={i} {...a} />)}
      <g>{back.faces.map((fc) => <polygon key={fc.id} points={poly(fc.pts)} fill={fc.fill} stroke={INK} strokeWidth={6} strokeLinejoin="round" />)}</g>
      {back.faces.some((x) => x.id === "front") && (
        <g transform={back.m}>
          {/* tufted buttons */}
          {[-80, 0, 80].map((x) => <circle key={x} cx={x} cy={-88} r={6} fill={shade(col, 0.7)} stroke={INK} strokeWidth={2.5} />)}
          <g transform="translate(0 -18)"><Face th={{ mode: "flat", R: 74, E: 22, lid: shade(col, 1.0), iris: "#16a34a" }} expr={expr} yaw={yaw} open={open} blink={blink} f={f} /></g>
        </g>
      )}
      <Box {...seatP} />
      {/* cushion seam */}
      {(() => { const a = back.at([-120, -112, 120]), b2 = back.at([120, -112, 120]); return <path d={`M${a.x} ${a.y} Q${(a.x + b2.x) / 2} ${a.y + 10} ${b2.x} ${b2.y}`} stroke={shade(col, 0.75)} strokeWidth={4} fill="none" />; })()}
      {near.map((a, i) => <Box key={i} {...a} />)}
      <Arms sh={sh} expr={expr} f={f} color={shade(col, 1.25)} scale={1.25} />
    </g>
  );
};

// ---------------------------------------------------------------------------
const Lotta: React.FC<BP & { glow: number }> = ({ expr, yaw, open, blink, f, glow }) => {
  const id = React.useId().replace(/:/g, "");
  const rt = 62, rb = 104, top = -230, bot = -90, ry = 0.26;
  const hl = Math.max(0.1, Math.min(0.85, 0.32 - yaw * 0.3));
  return (
    <g>
      <defs>
        <linearGradient id={`sh${id}`} x1="0" x2="1"><stop offset="0" stopColor={shade(C.gum, 0.6)} /><stop offset={hl} stopColor={shade(C.gum, 1.25)} /><stop offset={Math.min(1, hl + 0.3)} stopColor={C.gum} /><stop offset="1" stopColor={shade(C.gum, 0.5)} /></linearGradient>
        <radialGradient id={`gl${id}`}><stop offset="0" stopColor="#fff7c2" stopOpacity={0.95} /><stop offset="0.5" stopColor="#ffe066" stopOpacity={0.4} /><stop offset="1" stopColor="#ffe066" stopOpacity={0} /></radialGradient>
      </defs>
      {glow > 0.01 && <ellipse cx={0} cy={bot + 120} rx={260 * (0.7 + glow * 0.4)} ry={320 * (0.7 + glow * 0.4)} fill={`url(#gl${id})`} opacity={glow} />}
      {/* base + pole */}
      <rect x={-8} y={bot} width={16} height={GROUND - bot - 8} fill="#d1d5db" stroke={INK} strokeWidth={4} />
      <ellipse cx={0} cy={GROUND} rx={78} ry={20} fill={shade(C.gum, 0.7)} stroke={INK} strokeWidth={5} />
      <ellipse cx={0} cy={GROUND - 10} rx={78} ry={20} fill={shade(C.gum, 0.95)} stroke={INK} strokeWidth={5} />
      <Arms sh={[{ x: -6, y: bot + 40 }, { x: 6, y: bot + 40 }]} expr={expr} f={f} color="#e5e7eb" scale={0.95} />
      {/* bulb peeking under shade */}
      <ellipse cx={0} cy={bot + 6} rx={26} ry={20} fill={glow > 0.2 ? "#fff7c2" : "#f3f4f6"} stroke={INK} strokeWidth={4} style={{ filter: glow > 0.2 ? "drop-shadow(0 0 20px #ffe066)" : undefined }} />
      {/* shade (truncated cone) */}
      <path d={`M${-rt} ${top} L${-rb} ${bot} A ${rb} ${rb * ry} 0 0 0 ${rb} ${bot} L${rt} ${top} Z`} fill={`url(#sh${id})`} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <ellipse cx={0} cy={top} rx={rt} ry={rt * ry} fill={shade(C.gum, 1.3)} stroke={INK} strokeWidth={5} />
      {/* scalloped trim */}
      {[...Array(9)].map((_, i) => { const a = Math.PI - (i / 8) * Math.PI; return <circle key={i} cx={Math.cos(a) * rb} cy={bot + Math.sin(a) * rb * ry} r={9} fill={C.sun} stroke={INK} strokeWidth={3} />; })}
      {/* silver bun finial */}
      <circle cx={0} cy={top - 22} r={20} fill="#cbd5e1" stroke={INK} strokeWidth={4} />
      <path d={`M-12 ${top - 28} q 12 -10 24 0`} stroke="#94a3b8" strokeWidth={3} fill="none" />
      <g transform={`translate(0 ${(top + bot) / 2 + 4})`}>
        <Face th={{ mode: "cylinder", R: (rt + rb) / 2, E: 17, lid: shade(C.gum, 1.0), iris: "#475569" }} expr={expr} yaw={yaw} open={open} blink={blink} f={f} />
        {/* half-moon reading glasses on a chain */}
        {Math.cos(yaw) > 0.3 && <g transform={`scale(${Math.cos(yaw)} 1)`}>
          {[-1, 1].map((s) => <path key={s} d={`M${s * 29 - 20} 6 h40 a20 16 0 0 1 -40 0 Z`} fill="#ffffff33" stroke={INK} strokeWidth={4} />)}
          <path d="M-49 8 Q -70 70 0 76 Q 70 70 49 8" stroke="#e5c07b" strokeWidth={2.5} fill="none" strokeDasharray="4 3" />
        </g>}
      </g>
    </g>
  );
};

// ---------------------------------------------------------------------------
// Emotion symbols
// ---------------------------------------------------------------------------
const bolt = "M0 -34 L-14 2 L-2 2 L-10 34 L16 -8 L3 -8 L12 -34 Z";
const star = (r: number) => [...Array(10)].map((_, i) => { const a = (i / 10) * Math.PI * 2 - Math.PI / 2; const rr = i % 2 ? r * 0.45 : r; return `${i ? "L" : "M"}${Math.cos(a) * rr} ${Math.sin(a) * rr}`; }).join(" ") + "Z";
const heartP = (s: number) => `M0 ${s * 0.35} C ${-s * 1.1} ${-s * 0.35} ${-s * 0.45} ${-s * 1.05} 0 ${-s * 0.45} C ${s * 0.45} ${-s * 1.05} ${s * 1.1} ${-s * 0.35} 0 ${s * 0.35} Z`;
const cloudP = "M-70 20 Q-95 20 -92 -2 Q-100 -34 -62 -36 Q-52 -70 -12 -60 Q12 -88 44 -62 Q86 -66 82 -28 Q104 -10 84 14 Q76 24 60 20 Z";

const Sym: React.FC<{ kind: Emote; i: number; f: number }> = ({ kind, i, f }) => {
  switch (kind) {
    case "rage": case "storm":
      return <path d={bolt} fill={C.sun} stroke={INK} strokeWidth={4} strokeLinejoin="round" transform={`rotate(${i * 40 + Math.sin(f / 2 + i) * 12}) scale(${1 + (Math.floor(f / 3 + i) % 2) * 0.15})`} />;
    case "grawlix": {
      const g = ["#", "@", "%", "&", "!", "$"][i % 6];
      return <text fontFamily={LUCKY} fontSize={58} textAnchor="middle" dy={20} fill={[C.tomato, C.sun, C.grape, C.sky][i % 4]} stroke={INK} strokeWidth={3} paintOrder="stroke" transform={`rotate(${Math.sin(f / 3 + i) * 20})`}>{g}</text>;
    }
    case "joy": case "sparkle":
      return <path d={star(kind === "joy" ? 30 : 22)} fill={i % 2 ? C.sun : "#fff"} stroke={INK} strokeWidth={4} strokeLinejoin="round" transform={`rotate(${f * 3 + i * 30}) scale(${0.8 + Math.abs(Math.sin(f / 6 + i)) * 0.4})`} />;
    case "love":
      return <path d={heartP(30)} fill={i % 2 ? C.gum : C.tomato} stroke={INK} strokeWidth={4} transform={`scale(${1 + Math.sin(f / 4 + i) * 0.15})`} />;
    case "music":
      return <g transform={`rotate(${Math.sin(f / 8 + i) * 15})`} fill={[C.mint, C.sky, C.gum][i % 3]} stroke={INK} strokeWidth={4}><ellipse cx={-10} cy={18} rx={14} ry={10} /><path d="M2 18 V-30 L22 -22 V-12 L4 -18" strokeLinejoin="round" /></g>;
    case "confused":
      return <text fontFamily={LUCKY} fontSize={70} textAnchor="middle" dy={24} fill={C.sky} stroke={INK} strokeWidth={4} paintOrder="stroke" transform={`rotate(${Math.sin(f / 7 + i) * 25})`}>?</text>;
    case "shock":
      return <text fontFamily={LUCKY} fontSize={76} textAnchor="middle" dy={26} fill={C.tomato} stroke={INK} strokeWidth={4} paintOrder="stroke" transform={`scale(${1 + (Math.floor(f / 4 + i) % 2) * 0.2})`}>!</text>;
    case "sad": case "sweat":
      return <path d="M0 -26 q -18 28 0 40 q 18 -12 0 -40" fill="#7dd3fc" stroke={INK} strokeWidth={4} />;
    case "zzz":
      return <text fontFamily={LUCKY} fontSize={48} textAnchor="middle" fill={C.sky} stroke={INK} strokeWidth={3} paintOrder="stroke">Z</text>;
    default: return null;
  }
};

/** Ring of symbols orbiting on a tilted ellipse; `layer` splits behind/in-front of the body for real 2.5D depth. */
export const EmoteRing: React.FC<{ emote: Emote; f: number; age: number; layer: "back" | "front"; cy?: number; rx?: number }> = ({ emote, f, age, layer, cy = -120, rx = 230 }) => {
  if (emote === "none") return null;
  const pop = Math.min(1, age / 10) * (1 + Math.max(0, 1 - age / 14) * 0.35); // pop-in with overshoot
  const n = emote === "grawlix" ? 5 : emote === "rage" ? 5 : emote === "storm" ? 3 : 6;
  const speed = emote === "rage" || emote === "grawlix" ? 0.06 : emote === "storm" ? 0.04 : emote === "sad" ? 0.015 : 0.03;
  const out: React.ReactNode[] = [];
  if (emote !== "sad" && emote !== "zzz") {
    for (let i = 0; i < n; i++) {
      const a = f * speed + (i / n) * Math.PI * 2;
      const z = Math.sin(a);
      if ((z < 0) !== (layer === "back")) continue;
      const x = Math.cos(a) * rx * pop, y = cy + z * 50 + Math.sin(f / 9 + i) * 10;
      const s = (0.75 + 0.35 * (z + 1) / 2) * pop * 1.35;
      out.push(<g key={i} transform={`translate(${x} ${y}) scale(${s})`} opacity={layer === "back" ? 0.75 : 1}><Sym kind={emote} i={i} f={f} /></g>);
    }
  }
  if (layer === "front") {
    // head-top extras
    if (emote === "storm" || emote === "sad") {
      const flash = emote === "storm" && Math.floor(f / 5) % 4 === 0;
      out.push(
        <g key="cloud" transform={`translate(${Math.sin(f / 20) * 12} ${-400 + Math.sin(f / 13) * 6}) scale(${pop * 1.25})`}>
          {emote === "storm" && flash && <path d="M-6 16 L-26 70 L-6 66 L-20 120 L22 50 L2 54 L16 16 Z" fill={C.sun} stroke={INK} strokeWidth={4} strokeLinejoin="round" />}
          {[...Array(6)].map((_, k) => { const t = ((f * 1.6 + k * 17) % 60) / 60; return <line key={k} x1={-60 + k * 24} y1={18 + t * 110} x2={-64 + k * 24} y2={34 + t * 110} stroke="#60a5fa" strokeWidth={5} strokeLinecap="round" opacity={1 - t} />; })}
          <path d={cloudP} fill={emote === "storm" ? (flash ? "#9ca3af" : "#4b5563") : "#94a3b8"} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <path d="M-40 -20 q 10 -12 24 -6" stroke="#fff6" strokeWidth={5} fill="none" strokeLinecap="round" />
        </g>,
      );
    }
    if (emote === "rage") {
      [-1, 1].forEach((s) => [0, 1, 2].forEach((k) => {
        const t = ((f + k * 12) % 36) / 36;
        out.push(<circle key={`st${s}${k}`} cx={s * (60 + t * 70)} cy={-330 - t * 120} r={18 + t * 26} fill="#fff" stroke={INK} strokeWidth={3.5} opacity={1 - t} />);
      }));
    }
    if (emote === "sweat") [0, 1, 2].forEach((k) => { const t = ((f + k * 15) % 45) / 45; out.push(<g key={`sw${k}`} transform={`translate(${(k - 1) * 120} ${-300 + t * 80}) scale(${pop})`} opacity={1 - t}><Sym kind="sweat" i={k} f={f} /></g>); });
    if (emote === "zzz") [0, 1, 2].forEach((k) => { const t = ((f + k * 25) % 75) / 75; out.push(<g key={`z${k}`} transform={`translate(${90 + t * 80} ${-300 - t * 140}) scale(${0.6 + t * 0.7})`} opacity={1 - t}><Sym kind="zzz" i={k} f={f} /></g>); });
  }
  return <g>{out}</g>;
};

// ---------------------------------------------------------------------------
const BODY: Record<FurniId, React.FC<BP & { glow: number }>> = { duke: Duke, pia: Pia, gus: Gus, lotta: Lotta };

export type FurniProps = {
  id: FurniId; expr: Expr; f: number; size?: number; yaw?: number; talk?: boolean; emote?: Emote; emoteAge?: number;
  hop?: number; glow?: number; still?: boolean; squash?: number;
};

/** A furniture character with idle life, talk flap, sticker outline, ground shadow and orbiting emotes. */
export const Furni: React.FC<FurniProps> = ({ id, expr, f, size = 380, yaw = 0, talk = false, emote = "none", emoteAge = 99, hop = 0, glow = 0, still = false, squash = 0 }) => {
  const fid = React.useId().replace(/:/g, "");
  const B = BODY[id];
  const blink = !still && (f + id.length * 37) % 160 < 6;
  const open = talk ? Math.abs(Math.sin(f / 3.2)) * (0.6 + 0.4 * Math.abs(Math.sin(f / 7))) : 0;
  const bob = still ? 0 : Math.sin(f / 14 + id.length) * 6;
  const shake = expr === "angry" ? Math.sin(f * 1.7) * 4 : expr === "laugh" ? Math.sin(f / 1.6) * 4 : expr === "scared" ? Math.sin(f * 1.9) * 3 : 0;
  const sq = 1 + open * 0.05 + squash;
  const sway = still ? 0 : Math.sin(f / 50 + id.length) * 0.07;
  const tilt = expr === "confused" ? -6 : 0;
  return (
    <svg width={size} height={size * 1.6} viewBox="-300 -560 600 960" style={{ overflow: "visible" }}>
      <defs><StickerFilter id={`st${fid}`} r={8} /></defs>
      <ellipse cx={0} cy={232} rx={170 - hop * 0.3} ry={24} fill="#0003" />
      <EmoteRing emote={emote} f={f} age={emoteAge} layer="back" />
      <g transform={`translate(${shake} ${bob - hop}) rotate(${tilt} 0 200) translate(0 200) scale(${1 / sq} ${sq}) translate(0 -200)`} filter={`url(#st${fid})`}>
        <B expr={expr} yaw={yaw + sway} open={open} blink={blink} f={f} glow={glow} />
      </g>
      <EmoteRing emote={emote} f={f} age={emoteAge} layer="front" />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Props with faces: Alvin the hex key, Lefty the leftover screw
// ---------------------------------------------------------------------------
const Eyes: React.FC<{ x: number; y: number; r: number; look?: number; f: number; sad?: boolean }> = ({ x, y, r, look = 0, f, sad }) => {
  const bl = f % 140 < 5;
  return <g>{[-1, 1].map((s) => <g key={s} transform={`translate(${x + s * r * 1.15} ${y})`}><ellipse rx={r} ry={bl ? r * 0.12 : r * 1.15} fill="#fff" stroke={INK} strokeWidth={r * 0.22} />{!bl && <circle cx={look * r * 0.4} cy={r * 0.25} r={r * 0.5} fill={INK} />}{!bl && <circle cx={look * r * 0.4 - r * 0.18} cy={r * 0.05} r={r * 0.17} fill="#fff" />}{sad && <line x1={-r} y1={-r * 1.5 - s * r * 0.3} x2={r} y2={-r * 1.5 + s * r * 0.3} stroke={INK} strokeWidth={r * 0.25} strokeLinecap="round" />}</g>)}</g>;
};

export const Alvin: React.FC<{ f: number; spin?: number; size?: number; look?: number }> = ({ f, spin = 0, size = 1, look = 0 }) => (
  <g transform={`scale(${size}) rotate(${spin})`}>
    <path d="M-12 -90 L12 -90 L12 6 L80 6 L80 30 L-12 30 Z" fill="#cbd5e1" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M-6 -84 L4 -84 L4 18" stroke="#fff" strokeWidth={5} fill="none" opacity={0.7} />
    <path d="M18 18 L76 18" stroke="#94a3b8" strokeWidth={5} />
    <Eyes x={0} y={-58} r={11} look={look} f={f} />
    <path d="M-8 -30 q 8 7 16 0" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
  </g>
);

export const Lefty: React.FC<{ f: number; size?: number; talk?: boolean }> = ({ f, size = 1, talk = false }) => {
  const o = talk ? Math.abs(Math.sin(f / 3)) * 10 : 0;
  return (
    <g transform={`scale(${size})`}>
      <path d="M-12 10 L-12 92 L0 112 L12 92 L12 10 Z" fill="#cbd5e1" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      {[24, 40, 56, 72, 86].map((y) => <line key={y} x1={-14} y1={y} x2={14} y2={y + 7} stroke={INK} strokeWidth={4} />)}
      <path d="M-52 14 Q-54 -50 0 -52 Q54 -50 52 14 Z" fill="#e2e8f0" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M-30 -30 q 10 -12 26 -12" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M0 -52 q -6 -22 6 -34 q -2 14 8 20" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      <Eyes x={0} y={-20} r={12} f={f} sad />
      <ellipse cx={0} cy={2} rx={6 + o * 0.2} ry={2 + o * 0.5} fill={INK} />
    </g>
  );
};
