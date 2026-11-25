/**
 * Cast rig – shared 3D-ish face, expression system, arms and sticker outline for the new
 * code-drawn AI Bounce characters. Faces are projected onto the body's real 3D shape
 * (sphere / cylinder / flat plane) so they wrap around when the character turns.
 */
import React from "react";

export const INK = "#2b2622";
export const CREAM = "#fbf6ea";

export type Expr = "neutral" | "happy" | "laugh" | "surprised" | "sad" | "angry" | "smug" | "confused" | "scared" | "love";
export const EXPRS: Expr[] = ["neutral", "happy", "laugh", "surprised", "sad", "angry", "smug", "confused", "scared", "love"];

type Brow = { y: number; a: number };
type Preset = {
  bl: Brow; br: Brow; lidT: number; lidB: number; pupil: number; pupL?: number; arcs?: boolean; hearts?: boolean;
  mouth: { w: number; c: number; o: number; skew?: number; teeth?: boolean; tongue?: boolean; wavy?: boolean };
  blush: number; tears?: boolean; tear?: boolean; sweat?: boolean; vein?: boolean; q?: boolean;
};
const b = (y: number, a: number): Brow => ({ y, a });
export const PRESET: Record<Expr, Preset> = {
  neutral: { bl: b(0, 0), br: b(0, 0), lidT: 0.12, lidB: 0, pupil: 1, mouth: { w: 0.45, c: 0.2, o: 0 }, blush: 0.3 },
  happy: { bl: b(-6, -4), br: b(-6, -4), lidT: 0.04, lidB: 0.3, pupil: 1.05, mouth: { w: 0.7, c: 0.75, o: 0.35, teeth: true }, blush: 0.6 },
  laugh: { bl: b(-10, -6), br: b(-10, -6), lidT: 0, lidB: 0, pupil: 1, arcs: true, mouth: { w: 0.85, c: 0.8, o: 1, teeth: true, tongue: true }, blush: 0.85, tears: true },
  surprised: { bl: b(-18, 4), br: b(-18, 4), lidT: 0, lidB: 0, pupil: 0.55, mouth: { w: 0.24, c: 0, o: 0.95 }, blush: 0.15 },
  sad: { bl: b(-4, 22), br: b(-4, 22), lidT: 0.32, lidB: 0, pupil: 1.25, mouth: { w: 0.42, c: -0.55, o: 0.06 }, blush: 0.2, tear: true },
  angry: { bl: b(6, -26), br: b(6, -26), lidT: 0.38, lidB: 0.05, pupil: 0.85, mouth: { w: 0.55, c: -0.35, o: 0.4, teeth: true }, blush: 0, vein: true },
  smug: { bl: b(-2, -8), br: b(-14, 6), lidT: 0.48, lidB: 0.08, pupil: 1, mouth: { w: 0.5, c: 0.45, o: 0, skew: 0.7 }, blush: 0.4 },
  confused: { bl: b(-12, 8), br: b(4, -10), lidT: 0.1, lidB: 0, pupil: 1, pupL: 0.7, mouth: { w: 0.42, c: 0, o: 0.05, wavy: true }, blush: 0.2, q: true },
  scared: { bl: b(-14, 24), br: b(-14, 24), lidT: 0, lidB: 0, pupil: 0.4, mouth: { w: 0.62, c: -0.25, o: 0.5, teeth: true }, blush: 0, sweat: true },
  love: { bl: b(-8, -4), br: b(-8, -4), lidT: 0, lidB: 0.1, pupil: 1, hearts: true, mouth: { w: 0.65, c: 0.7, o: 0.25 }, blush: 1 },
};

// ---------------------------------------------------------------------------
// colour + 3D helpers
// ---------------------------------------------------------------------------
export const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * k))));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};
export type V3 = [number, number, number];
export const rot = (p: V3, yaw: number, pitch: number): V3 => {
  const [x0, y0, z0] = p;
  const x1 = x0 * Math.cos(yaw) + z0 * Math.sin(yaw);
  const z1 = -x0 * Math.sin(yaw) + z0 * Math.cos(yaw);
  const y2 = y0 * Math.cos(pitch) - z1 * Math.sin(pitch);
  const z2 = y0 * Math.sin(pitch) + z1 * Math.cos(pitch);
  return [x1, y2, z2];
};
export const scr = (v: V3) => ({ x: v[0], y: -v[1], z: v[2] });
const LIGHT: V3 = (() => { const v: V3 = [-0.45, 0.75, 0.5]; const l = Math.hypot(...v); return [v[0] / l, v[1] / l, v[2] / l]; })();
export const lambert = (n: V3) => Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);

/** Visible, depth-sorted, lit faces of a box + affine matrix of the front face (local px, y down). */
export const boxGeo = (w: number, h: number, d: number, yaw: number, pitch: number, color: string) => {
  const [hw, hh, hd] = [w / 2, h / 2, d / 2];
  const F: { id: string; n: V3; c: V3[] }[] = [
    { id: "front", n: [0, 0, 1], c: [[-hw, hh, hd], [hw, hh, hd], [hw, -hh, hd], [-hw, -hh, hd]] },
    { id: "back", n: [0, 0, -1], c: [[hw, hh, -hd], [-hw, hh, -hd], [-hw, -hh, -hd], [hw, -hh, -hd]] },
    { id: "right", n: [1, 0, 0], c: [[hw, hh, hd], [hw, hh, -hd], [hw, -hh, -hd], [hw, -hh, hd]] },
    { id: "left", n: [-1, 0, 0], c: [[-hw, hh, -hd], [-hw, hh, hd], [-hw, -hh, hd], [-hw, -hh, -hd]] },
    { id: "top", n: [0, 1, 0], c: [[-hw, hh, -hd], [hw, hh, -hd], [hw, hh, hd], [-hw, hh, hd]] },
    { id: "bottom", n: [0, -1, 0], c: [[-hw, -hh, hd], [hw, -hh, hd], [hw, -hh, -hd], [-hw, -hh, -hd]] },
  ];
  const faces = F.map((f) => {
    const n = rot(f.n, yaw, pitch);
    const pts = f.c.map((p) => scr(rot(p, yaw, pitch)));
    return { id: f.id, nz: n[2], pts, z: pts.reduce((a, p) => a + p.z, 0) / 4, fill: shade(color, 0.55 + 0.6 * lambert(n)) };
  }).filter((f) => f.nz > 0.01).sort((a, b2) => a.z - b2.z);
  const c = scr(rot([0, 0, hd], yaw, pitch));
  const ex = scr(rot([1, 0, hd], yaw, pitch));
  const ey = scr(rot([0, -1, hd], yaw, pitch));
  const m = `matrix(${ex.x - c.x},${ex.y - c.y},${ey.x - c.x},${ey.y - c.y},${c.x},${c.y})`;
  return { faces, m, at: (p: V3) => scr(rot(p, yaw, pitch)) };
};

// ---------------------------------------------------------------------------
// Face
// ---------------------------------------------------------------------------
export type FaceTheme = { mode: "sphere" | "cylinder" | "flat"; R: number; E: number; lid: string; iris?: string; screen?: boolean };
type Pr = { x: number; y: number; sx: number; sy: number; z: number };
const project = (theta: number, phi: number, th: FaceTheme, yaw: number, pitch: number): Pr => {
  const R = th.R;
  if (th.mode === "flat") return { x: R * Math.sin(theta), y: -R * Math.sin(phi), sx: 1, sy: 1, z: 1 };
  if (th.mode === "cylinder") {
    const a = theta + yaw;
    return { x: R * Math.sin(a), y: -R * Math.sin(phi), sx: Math.max(0.12, Math.cos(a)), sy: 1, z: Math.cos(a) };
  }
  const [x, y, z] = rot([Math.sin(theta) * Math.cos(phi), Math.sin(phi), Math.cos(theta) * Math.cos(phi)], yaw, pitch);
  return { x: R * x, y: -R * y, sx: Math.max(0.12, Math.cos(theta + yaw)), sy: Math.max(0.3, Math.cos(phi - pitch)), z };
};

const heart = (s: number) => `M0 ${s * 0.35} C ${-s * 1.1} ${-s * 0.35} ${-s * 0.45} ${-s * 1.05} 0 ${-s * 0.45} C ${s * 0.45} ${-s * 1.05} ${s * 1.1} ${-s * 0.35} 0 ${s * 0.35} Z`;

const Eye: React.FC<{ side: -1 | 1; E: number; P: Preset; lidT: number; look: { x: number; y: number }; th: FaceTheme; f: number }> = ({ side, E, P, lidT, look, th, f }) => {
  const id = React.useId().replace(/:/g, "");
  const scr2 = !!th.screen;
  const glow = "#5eead4";
  if (P.arcs) {
    return <path d={`M${-E * 0.8} ${E * 0.25} Q0 ${-E * 0.95} ${E * 0.8} ${E * 0.25}`} stroke={scr2 ? glow : INK} strokeWidth={E * 0.24} fill="none" strokeLinecap="round" />;
  }
  const brow = side < 0 ? P.bl : P.br;
  const base = -E + 2 * E * lidT;
  const innerX = -side * E;
  const tilt = -brow.a * E * 0.012;
  const yAt = (x: number) => base + (x === innerX ? tilt : -tilt);
  const yb = E - 2 * E * P.lidB * 0.9;
  const pr = E * 0.42 * P.pupil * (side < 0 && P.pupL ? P.pupL : 1);
  const px = look.x * E * 0.32, py = look.y * E * 0.3 + E * 0.06;
  return (
    <g>
      <defs><clipPath id={`e${id}`}><ellipse rx={E * 0.82} ry={E} /></clipPath></defs>
      {scr2 ? (
        <ellipse rx={E * 0.62} ry={E * 0.88} fill={glow} style={{ filter: `drop-shadow(0 0 ${E * 0.3}px ${glow})` }} clipPath={`url(#e${id})`} />
      ) : (
        <ellipse rx={E * 0.82} ry={E} fill="#fff" stroke={INK} strokeWidth={E * 0.12} />
      )}
      <g clipPath={`url(#e${id})`}>
        {!scr2 && (P.hearts ? (
          <path d={heart(E * 0.62 * (1 + Math.sin(f / 5) * 0.08))} transform={`translate(${px} ${py})`} fill="#e11d48" stroke={INK} strokeWidth={E * 0.06} />
        ) : (
          <g transform={`translate(${px} ${py})`}>
            <circle r={pr * 1.38} fill={th.iris ?? "#3b82f6"} />
            <circle r={pr} fill={INK} />
            <circle cx={-pr * 0.45} cy={-pr * 0.55} r={pr * 0.42} fill="#fff" />
            <circle cx={pr * 0.5} cy={pr * 0.45} r={pr * 0.18} fill="#fff" />
          </g>
        ))}
        {scr2 && P.hearts && <path d={heart(E * 0.6)} transform={`translate(0 ${E * 0.1})`} fill="#f472b6" />}
        {lidT > 0.01 && <path d={`M${-E - 4} ${-E - 14} L${E + 4} ${-E - 14} L${E + 4} ${yAt(E)} L${-E - 4} ${yAt(-E)} Z`} fill={th.lid} />}
        {P.lidB > 0.01 && <path d={`M${-E - 4} ${E + 14} L${-E - 4} ${yb} Q0 ${yb - E * P.lidB * 0.9} ${E + 4} ${yb} L${E + 4} ${E + 14} Z`} fill={th.lid} />}
      </g>
      {lidT > 0.01 && !scr2 && <line x1={-E * 0.82} y1={yAt(-E)} x2={E * 0.82} y2={yAt(E)} stroke={INK} strokeWidth={E * 0.12} strokeLinecap="round" />}
    </g>
  );
};

const Mouth: React.FC<{ M: number; P: Preset; open: number; screen?: boolean; f: number }> = ({ M, P, open, screen, f }) => {
  const id = React.useId().replace(/:/g, "");
  const m = P.mouth;
  const o = Math.min(1, m.o + open * 0.75);
  const w = m.w * M, sk = m.skew ?? 0;
  const L = { x: -w, y: sk * M * 0.12 }, R = { x: w, y: -sk * M * 0.4 };
  const uy = m.c * M * 0.42;
  const ly = uy + o * M * 1.0 + (o > 0.03 ? M * 0.06 : 0);
  const stroke = screen ? "#5eead4" : INK;
  if (m.wavy && o < 0.2) {
    const d = [...Array(9)].map((_, i) => { const x = -w + (2 * w * i) / 8; return `${i ? "L" : "M"}${x} ${Math.sin(i * 1.6 + f / 6) * M * 0.08}`; }).join(" ");
    return <path d={d} stroke={stroke} strokeWidth={M * 0.14} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
  }
  if (o < 0.04) {
    return (
      <g>
        <path d={`M${L.x} ${L.y} Q0 ${uy * 1.6} ${R.x} ${R.y}`} stroke={stroke} strokeWidth={M * 0.14} fill="none" strokeLinecap="round" />
        {m.c > 0.3 && [L, R].map((p, i) => <path key={i} d={`M${p.x - (i ? -1 : 1) * M * 0.08} ${p.y - M * 0.12} q ${(i ? 1 : -1) * M * 0.1} ${M * 0.08} 0 ${M * 0.2}`} stroke={stroke} strokeWidth={M * 0.08} fill="none" strokeLinecap="round" />)}
      </g>
    );
  }
  const shape = `M${L.x} ${L.y} Q0 ${uy} ${R.x} ${R.y} Q0 ${ly} ${L.x} ${L.y} Z`;
  return (
    <g>
      <defs><clipPath id={`m${id}`}><path d={shape} /></clipPath></defs>
      <path d={shape} fill={screen ? "#04313a" : "#6b1a1a"} />
      <g clipPath={`url(#m${id})`}>
        {m.teeth && <path d={`M${L.x} ${L.y - M} L${R.x} ${R.y - M} L${R.x} ${R.y + M * 0.2} Q0 ${uy + M * 0.22} ${L.x} ${L.y + M * 0.2} Z`} fill={screen ? "#5eead4" : "#fff"} />}
        {(m.tongue || o > 0.55) && <ellipse cx={0} cy={ly - M * 0.1} rx={w * 0.5} ry={M * 0.28} fill={screen ? "#0d9488" : "#f472b6"} />}
      </g>
      <path d={shape} fill="none" stroke={stroke} strokeWidth={M * 0.12} strokeLinejoin="round" />
    </g>
  );
};

export const Face: React.FC<{ th: FaceTheme; expr: Expr; yaw: number; pitch?: number; open?: number; blink?: boolean; look?: { x: number; y: number }; f: number }> = ({ th, expr, yaw, pitch = 0, open = 0, blink = false, look = { x: 0, y: 0 }, f }) => {
  const P = PRESET[expr];
  const lidT = blink && !P.arcs ? 1 : P.lidT;
  const E = th.E, M = E * 1.35;
  const at = (theta: number, phi: number) => project(theta, phi, th, yaw, pitch);
  const tf = (p: Pr, extraY = 0) => `translate(${p.x} ${p.y + extraY}) scale(${p.sx} ${p.sy})`;
  const vis = (p: Pr) => th.mode === "flat" || p.z > 0.06;
  const eyes = ([-1, 1] as const).map((s) => ({ s, p: at(s * 0.36, 0.1) }));
  const mouth = at(0, -0.36);
  const browStroke = th.screen ? "#5eead4" : INK;
  return (
    <g>
      {/* blush */}
      {P.blush > 0 && ([-1, 1] as const).map((s) => { const p = at(s * 0.62, -0.16); return vis(p) && <ellipse key={s} transform={tf(p)} rx={E * 0.7} ry={E * 0.38} fill="#f472b6" opacity={0.25 + P.blush * 0.45} />; })}
      {eyes.map(({ s, p }) => vis(p) && (
        <g key={s} transform={tf(p)}>
          <Eye side={s} E={E} P={P} lidT={lidT} look={look} th={th} f={f} />
          {(() => { const br = s < 0 ? P.bl : P.br; return <line x1={-E * 0.72} y1={0} x2={E * 0.72} y2={0} transform={`translate(0 ${-E * 1.42 + br.y}) rotate(${s < 0 ? -br.a : br.a})`} stroke={browStroke} strokeWidth={E * 0.26} strokeLinecap="round" />; })()}
        </g>
      ))}
      {vis(mouth) && <g transform={tf(mouth)}><Mouth M={M} P={P} open={open} screen={th.screen} f={f} /></g>}
      {/* extras */}
      {P.tears && eyes.map(({ s, p }) => vis(p) && [0, 1, 2].map((k) => { const t = ((f + k * 9) % 27) / 27; return <path key={`${s}${k}`} d={`M0 0 q -5 9 0 13 q 5 -4 0 -13`} transform={`translate(${p.x + s * (E * 0.9 + t * E * 1.4)} ${p.y - E * 0.1 + t * t * E * 1.6}) scale(${E / 14})`} fill="#7dd3fc" stroke={INK} strokeWidth={1.2} opacity={1 - t} />; }))}
      {P.tear && vis(eyes[0].p) && (() => { const t = (f % 60) / 60; const p = eyes[0].p; return <path d="M0 0 q -6 11 0 16 q 6 -5 0 -16" transform={`translate(${p.x - E * 0.3} ${p.y + E * 0.9 + t * E * 2.2}) scale(${E / 13})`} fill="#7dd3fc" stroke={INK} strokeWidth={1.2} opacity={1 - t * 0.6} />; })()}
      {P.sweat && (() => { const p = at(0.78, 0.42); const t = (f % 50) / 50; return <path d="M0 0 q -9 15 0 21 q 9 -6 0 -21" transform={`translate(${p.x} ${p.y + t * E * 1.2}) scale(${E / 11})`} fill="#93c5fd" stroke={INK} strokeWidth={1.5} />; })()}
      {P.vein && (() => { const p = at(0.55, 0.62); const s = 1 + Math.abs(Math.sin(f / 4)) * 0.25; return <g transform={`translate(${p.x} ${p.y}) scale(${(E / 16) * s})`} stroke="#dc2626" strokeWidth={3.5} strokeLinecap="round" fill="none"><path d="M-9 -3 q 6 0 6 -6 M3 -9 q 0 6 6 6 M9 3 q -6 0 -6 6 M-3 9 q 0 -6 -6 -6" /></g>; })()}
      {P.q && <text x={th.R * 0.75} y={-th.R * 0.95 + Math.sin(f / 8) * 6} fontSize={E * 2.6} fontWeight={900} fill={INK} fontFamily="Inter, sans-serif">?</text>}
      {P.hearts && [0, 1, 2].map((k) => { const t = ((f + k * 20) % 60) / 60; return <path key={k} d={heart(E * 0.5)} transform={`translate(${(k - 1) * th.R * 0.6} ${-th.R * 0.9 - t * th.R * 0.8})`} fill="#f43f5e" stroke={INK} strokeWidth={2} opacity={1 - t} />; })}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Arms (noodle arms + cartoon gloves), posed by expression
// ---------------------------------------------------------------------------
type Hand = [number, number];
const POSE: Record<Expr, [Hand, Hand]> = {
  neutral: [[-45, 75], [45, 75]],
  happy: [[-70, 45], [70, -95]],
  laugh: [[40, 55], [-40, 55]],
  surprised: [[-70, -95], [70, -95]],
  sad: [[-15, 100], [15, 100]],
  angry: [[-65, -35], [65, -35]],
  smug: [[30, 35], [60, 45]],
  confused: [[-55, 65], [-25, -110]],
  scared: [[35, -55], [-35, -55]],
  love: [[30, 10], [-30, 10]],
};
export const Arms: React.FC<{ sh: [{ x: number; y: number }, { x: number; y: number }]; expr: Expr; f: number; color: string; glove?: string; scale?: number }> = ({ sh, expr, f, color, glove = "#fff", scale = 1 }) => {
  const pose = POSE[expr];
  return (
    <g>
      {sh.map((s, i) => {
        let [hx, hy] = pose[i];
        hx *= scale; hy *= scale;
        if (expr === "happy" && i === 1) hx += Math.sin(f / 4) * 22 * scale;
        if (expr === "angry") { hy += Math.sin(f / 2 + i) * 8; }
        if (expr === "laugh") { hy += Math.sin(f / 2.2) * 5; }
        if (expr === "scared") { hx += Math.sin(f * 1.3 + i) * 3; }
        const ex = s.x + hx, ey = s.y + hy;
        const mx = (s.x + ex) / 2 + (i ? 1 : -1) * 22 * scale, my = (s.y + ey) / 2 + 12 * scale;
        const fist = expr === "angry";
        const r = 15 * scale;
        return (
          <g key={i}>
            <path d={`M${s.x} ${s.y} Q${mx} ${my} ${ex} ${ey}`} stroke={INK} strokeWidth={13 * scale} fill="none" strokeLinecap="round" />
            <path d={`M${s.x} ${s.y} Q${mx} ${my} ${ex} ${ey}`} stroke={color} strokeWidth={6 * scale} fill="none" strokeLinecap="round" />
            <circle cx={ex} cy={ey} r={fist ? r * 0.9 : r} fill={glove} stroke={INK} strokeWidth={4 * scale} />
            {!fist && <ellipse cx={ex + (i ? 1 : -1) * r * 0.75} cy={ey - r * 0.35} rx={r * 0.38} ry={r * 0.55} fill={glove} stroke={INK} strokeWidth={3 * scale} />}
            {fist && <path d={`M${ex - r * 0.5} ${ey - r * 0.2} h ${r}`} stroke={INK} strokeWidth={2.5 * scale} />}
          </g>
        );
      })}
    </g>
  );
};

/** Thick cream paper-sticker border + soft drop shadow, as an SVG filter. */
export const StickerFilter: React.FC<{ id: string; r?: number }> = ({ id, r = 9 }) => (
  <filter id={id} x="-35%" y="-35%" width="170%" height="170%">
    <feMorphology in="SourceAlpha" operator="dilate" radius={r} result="d" />
    <feFlood floodColor={CREAM} result="cr" />
    <feComposite in="cr" in2="d" operator="in" result="outline" />
    <feGaussianBlur in="d" stdDeviation={7} result="bl" />
    <feOffset in="bl" dx={4} dy={12} result="off" />
    <feFlood floodColor="#000" floodOpacity={0.35} result="sc" />
    <feComposite in="sc" in2="off" operator="in" result="shadow" />
    <feMerge><feMergeNode in="shadow" /><feMergeNode in="outline" /><feMergeNode in="SourceGraphic" /></feMerge>
  </filter>
);
