/**
 * 2.5D paper studio: layered set with parallax camera drift, volumetric light rays, coloured
 * rim light, bokeh, depth-of-field on far layers, stage platform with floor reflection.
 * `tint` sets the mood light per topic (cross-fade by changing it over time).
 */
import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { Toon, type CastId } from "./cast";
import type { Expr } from "./rig";

const CREAM = "#f3ead6", INK = "#2b2622";
const mix = (a: string, b: string, k: number) => {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const c = [16, 8, 0].map((s) => Math.round(((pa >> s) & 255) * (1 - k) + ((pb >> s) & 255) * k));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

/** torn-edge silhouette path across the width */
const ridge = (seed: string, y: number, amp: number, step = 60, w = 1500) => {
  let d = `M-200 1920 L-200 ${y}`;
  for (let x = -200; x <= w; x += step) d += ` L${x} ${y - Math.abs(Math.sin(x / 210 + random(seed) * 6)) * amp - random(`${seed}${x}`) * amp * 0.25}`;
  return d + ` L${w} 1920 Z`;
};

export const Studio: React.FC<{ tint: string }> = ({ tint }) => {
  const f = useCurrentFrame();
  const cam = Math.sin(f / 240) * 45; // camera drift (px at depth 1)
  const deep = mix(tint, "#0b1020", 0.55);
  const warm = mix(tint, "#fff3d6", 0.7);
  const layer = (depth: number) => `translateX(${cam * depth}px)`;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: `linear-gradient(180deg, ${deep} 0%, ${mix(tint, "#1b1530", 0.35)} 45%, ${mix(tint, "#2b1d14", 0.5)} 100%)` }}>
      {/* far bokeh (strong blur = depth of field) */}
      <AbsoluteFill style={{ transform: layer(0.15), filter: "blur(10px)" }}>
        {[...Array(26)].map((_, i) => {
          const x = random(`bk${i}`) * 1300 - 100, y = random(`by${i}`) * 1200;
          const r = 30 + random(`br${i}`) * 70;
          const tw = 0.25 + 0.35 * Math.abs(Math.sin(f / 60 + i));
          return <div key={i} style={{ position: "absolute", left: x + Math.sin(f / 90 + i) * 20, top: y - (f * 0.15 * (1 + (i % 3))) % 200, width: r, height: r, borderRadius: "50%", background: i % 3 ? warm : tint, opacity: tw }} />;
        })}
      </AbsoluteFill>
      {/* volumetric light rays from top-left */}
      <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.55 }}>
        {[...Array(6)].map((_, i) => {
          const a = -28 + i * 9 + Math.sin(f / 120 + i) * 3;
          return <div key={i} style={{ position: "absolute", left: 80, top: -300, width: 120 + i * 30, height: 2600, transformOrigin: "50% 0", transform: `rotate(${a}deg)`, background: `linear-gradient(180deg, ${warm}55, transparent 75%)`, filter: "blur(18px)" }} />;
        })}
      </AbsoluteFill>
      {/* far paper skyline (blurred) */}
      <svg width={1080} height={1920} style={{ position: "absolute", transform: layer(0.3), filter: "blur(4px)" }}>
        <path d={ridge("far", 1080, 160, 90)} fill={mix(tint, CREAM, 0.25)} opacity={0.35} />
      </svg>
      {/* mid paper hills with paper edge + shading */}
      <svg width={1080} height={1920} style={{ position: "absolute", transform: layer(0.6), filter: "blur(1.5px)" }}>
        <defs><linearGradient id="midg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={mix(tint, CREAM, 0.55)} /><stop offset="1" stopColor={mix(tint, "#1a1410", 0.4)} /></linearGradient></defs>
        <path d={ridge("mid", 1230, 120, 70)} fill={CREAM} transform="translate(0 -10)" opacity={0.85} />
        <path d={ridge("mid", 1230, 120, 70)} fill="url(#midg)" />
      </svg>
      {/* stage platform */}
      <svg width={1080} height={1920} style={{ position: "absolute", transform: layer(0.9) }}>
        <defs>
          <radialGradient id="stg" cx="0.5" cy="0.35" r="0.7"><stop offset="0" stopColor={mix(tint, CREAM, 0.8)} /><stop offset="1" stopColor={mix(tint, "#3b2a1c", 0.45)} /></radialGradient>
          <radialGradient id="spot" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff" stopOpacity={0.55} /><stop offset="1" stopColor="#fff" stopOpacity={0} /></radialGradient>
        </defs>
        <ellipse cx={540} cy={1700} rx={640} ry={150} fill={CREAM} />
        <ellipse cx={540} cy={1690} rx={620} ry={140} fill="url(#stg)" stroke={INK} strokeWidth={5} />
        <ellipse cx={540} cy={1730} rx={600} ry={110} fill={tint} opacity={0.18} />
        <ellipse cx={540} cy={1680} rx={330} ry={70} fill="url(#spot)" />
      </svg>
      {/* vignette + light falloff */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 40%, transparent 45%, #000a 100%)" }} />
    </AbsoluteFill>
  );
};

export type Member = { id: CastId; expr: Expr; talk?: boolean };
/**
 * Puts 1–5 cast members on the stage. The speaker stands in front (bigger, lit, lip-synced),
 * the others stand back, slightly darker, looking at the speaker. Coloured rim light from `tint`.
 */
export const Ensemble: React.FC<{ members: Member[]; t: number; open: number; tint: string; i: number }> = ({ members, t, open, tint, i }) => {
  const f = Math.round(t * 60);
  const n = members.length;
  const speakerIdx = Math.max(0, members.findIndex((m) => m.talk));
  const slots = n === 1 ? [540] : n === 2 ? (i % 2 ? [700, 340] : [380, 740])
    : n === 3 ? (() => { const side = [200, 880]; let j = 0; return members.map((_, k) => (k === speakerIdx ? 540 : side[j++])); })()
    : members.map((_, k) => 140 + k * (800 / (n - 1)));
  const order = members.map((m, k) => ({ m, k })).sort((a, b) => (a.k === speakerIdx ? 1 : 0) - (b.k === speakerIdx ? 1 : 0));
  return (
    <>
      {order.map(({ m, k }) => {
        const front = k === speakerIdx && n <= 3;
        const size = n >= 4 ? 280 : front ? 460 : 350;
        const x = slots[k];
        const sx = slots[speakerIdx];
        const lookX = k === speakerIdx ? Math.sin(t / 2) * 0.3 : Math.max(-1, Math.min(1, (sx - x) / 250));
        const top = 1700 - size * 1.3 * (550 / 600);
        return (
          <div key={m.id} style={{ position: "absolute", left: x - size / 2, top, filter: `drop-shadow(0 0 22px ${tint}aa) ${front || n >= 4 ? "" : "brightness(0.82) saturate(0.9)"}`, zIndex: front ? 2 : 1 }}>
            <Toon id={m.id} expr={m.expr} f={f + k * 17} size={size} yaw={k === speakerIdx ? Math.sin(t / 1.5) * 0.3 : lookX * 0.5} open={m.talk ? open : 0} look={{ x: lookX, y: -0.1 }} />
          </div>
        );
      })}
    </>
  );
};
