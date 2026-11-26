/**
 * "AI Bounce Comedy Club" – the setting for joke / roast / comedy shorts.
 * Brick back wall, velvet curtains, flickering neon sign, coloured spotlight + haze,
 * wooden stage with mic stand, marquee-bulb frame for the board, laughing audience silhouettes.
 */
import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { FONT } from "../theme";

const INK = "#2b2622";
const hex = (c: string, a: number) => c + Math.round(a * 255).toString(16).padStart(2, "0");

/** Brick wall + curtains + neon + spotlight. `tint` = spotlight/neon colour. */
export const ComedyClub: React.FC<{ tint: string }> = ({ tint }) => {
  const f = useCurrentFrame();
  const flick = random(`nf${Math.floor(f / 4)}`) > 0.93 ? 0.35 : 1; // neon flicker
  const rows = 34, cols = 9;
  return (
    <AbsoluteFill style={{ background: "#1a0d0b", overflow: "hidden" }}>
      {/* bricks */}
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {[...Array(rows)].map((_, r) => [...Array(cols + 1)].map((_, c) => {
          const x = c * 130 - (r % 2 ? 65 : 0), y = r * 58;
          const v = random(`b${r}-${c}`);
          return <rect key={`${r}-${c}`} x={x + 3} y={y + 3} width={124} height={52} rx={4} fill={`rgb(${110 + v * 40},${48 + v * 18},${38 + v * 12})`} />;
        }))}
      </svg>
      {/* warm wash + spotlight pool on the wall */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 38% at 50% 70%, ${hex(tint, 0.45)}, transparent 70%), radial-gradient(ellipse 80% 60% at 50% 40%, #ffb86b22, #000c 95%)` }} />
      {/* neon sign above the board */}
      <div style={{ position: "absolute", top: 8, width: "100%", lineHeight: 1, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 54, letterSpacing: 4, color: "#fff", opacity: flick, textShadow: `0 0 8px #fff, 0 0 22px ${tint}, 0 0 46px ${tint}, 0 0 90px ${tint}` }}>
        AI BOUNCE <span style={{ fontSize: 34, fontStyle: "normal", letterSpacing: 8, color: "#fff", textShadow: `0 0 8px #fff, 0 0 22px #22d3ee, 0 0 46px #22d3ee` }}>COMEDY CLUB</span>
      </div>
      {/* spotlight cone from top-right */}
      <div style={{ position: "absolute", left: 120, top: -200, width: 840, height: 2000, background: `linear-gradient(180deg, ${hex(tint, 0)} 0%, ${hex("#fff3d6", 0.16)} 55%, ${hex("#fff3d6", 0.05)} 100%)`, clipPath: "polygon(46% 0, 54% 0, 100% 100%, 0 100%)", mixBlendMode: "screen", filter: "blur(6px)" }} />
      {/* haze */}
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{ position: "absolute", left: -300 + ((f * (0.4 + i * 0.15) + i * 400) % 1700), top: 1100 + i * 110, width: 700, height: 220, borderRadius: "50%", background: "#ffffff0d", filter: "blur(40px)" }} />
      ))}
      {/* stage floor */}
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs><linearGradient id="flr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6b3f22" /><stop offset="1" stopColor="#2a160b" /></linearGradient></defs>
        <path d="M-40 1640 L1120 1640 L1120 1920 L-40 1920 Z" fill="url(#flr)" />
        {[...Array(9)].map((_, i) => <line key={i} x1={540 + (i - 4) * 70} y1={1640} x2={540 + (i - 4) * 260} y2={1920} stroke="#00000055" strokeWidth={3} />)}
        <rect x={-40} y={1634} width={1160} height={12} fill="#c08a4e" />
        <ellipse cx={540} cy={1700} rx={420} ry={60} fill={hex(tint, 0.35)} style={{ mixBlendMode: "screen" } as React.CSSProperties} />
      </svg>
      <Curtain side="left" f={f} />
      <Curtain side="right" f={f} />
    </AbsoluteFill>
  );
};

const Curtain: React.FC<{ side: "left" | "right"; f: number }> = ({ side, f }) => {
  const w = 120;
  return (
    <svg width={w + 40} height={1920} style={{ position: "absolute", top: 0, [side]: -20 } as React.CSSProperties}>
      <defs><linearGradient id={`cv${side}`} x1="0" y1="0" x2="1" y2="0">
        {[0, 0.2, 0.4, 0.6, 0.8, 1].map((o, i) => <stop key={o} offset={o} stopColor={i % 2 ? "#5b0a14" : "#a3122a"} />)}
      </linearGradient></defs>
      <path d={`M0 0 L${w} 0 Q${w + 10 + Math.sin(f / 50) * 8} 960 ${w + 30} 1920 L0 1920 Z`} fill={`url(#cv${side})`} transform={side === "right" ? `translate(${w + 40} 0) scale(-1 1)` : undefined} />
    </svg>
  );
};

/** Theatre-marquee frame of chasing light bulbs behind the board. */
export const Marquee: React.FC<{ tint: string }> = ({ tint }) => {
  const f = useCurrentFrame();
  const x0 = 34, y0 = 150, W = 1012, H = 850, step = 46;
  const pts: [number, number][] = [];
  for (let x = x0; x <= x0 + W; x += step) pts.push([x, y0]);
  for (let y = y0 + step; y <= y0 + H; y += step) pts.push([x0 + W, y]);
  for (let x = x0 + W - step; x >= x0; x -= step) pts.push([x, y0 + H]);
  for (let y = y0 + H - step; y > y0; y -= step) pts.push([x0, y]);
  const chase = Math.floor(f / 5);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <rect x={x0} y={y0} width={W} height={H} rx={26} fill="#120806" stroke="#c9a14a" strokeWidth={10} />
      <rect x={x0 + 18} y={y0 + 18} width={W - 36} height={H - 36} rx={16} fill="none" stroke={hex(tint, 0.6)} strokeWidth={4} />
      {pts.map(([x, y], i) => {
        const on = (i + chase) % 3 === 0;
        return <g key={i}><circle cx={x} cy={y} r={on ? 15 : 11} fill={on ? "#fff6c9" : "#7a5a2a"} style={{ filter: on ? "drop-shadow(0 0 10px #ffd36b)" : undefined }} /></g>;
      })}
    </svg>
  );
};

/** Mic stand next to the performer. */
export const MicStand: React.FC<{ x: number }> = ({ x }) => (
  <svg width={160} height={560} style={{ position: "absolute", left: x - 80, top: 1180 }}>
    <line x1={80} y1={90} x2={80} y2={520} stroke="#222" strokeWidth={10} />
    <line x1={80} y1={90} x2={40} y2={40} stroke="#222" strokeWidth={8} />
    <rect x={14} y={6} width={40} height={56} rx={18} fill="#3a3a3a" stroke={INK} strokeWidth={4} transform="rotate(-38 34 34)" />
    <ellipse cx={80} cy={524} rx={60} ry={14} fill="#111" />
  </svg>
);

const BUBBLES = ["HA!", "HAHA", "LOL", "HA HA!", "😂", "HAH!"];
/** Foreground audience row; `laughFrom` (frame within the current plate, or null) makes them laugh. */
export const Audience: React.FC<{ laughing: boolean; lf: number }> = ({ laughing, lf: lf0 }) => {
  const f = useCurrentFrame();
  const lf = lf0 % 140; // laughter rolls in waves
  const n = 9;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", pointerEvents: "none", overflow: "visible" }}>
      {[...Array(n)].map((_, i) => {
        const x = 20 + i * 130 + random(`ax${i}`) * 30;
        const r = 62 + random(`ar${i}`) * 18;
        const bob = laughing ? Math.abs(Math.sin((lf + i * 5) / 4)) * 22 : Math.sin((f + i * 30) / 40) * 3;
        const y = 1870 - bob;
        return (
          <g key={i}>
            <ellipse cx={x} cy={y + r * 1.6} rx={r * 1.3} ry={r * 1.1} fill="#0a0505" />
            <circle cx={x} cy={y} r={r} fill="#0a0505" />
            {laughing && lf > i * 3 && lf < 110 + i * 3 && (i % 2 === 0 || i === 3) && (() => {
              const k = Math.min(1, (lf - i * 3) / 8);
              return <text x={x} y={y - r - 90 - (lf - i * 3) * 1.6} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={72 * k} fill="#fff6c9" stroke={INK} strokeWidth={3} paintOrder="stroke" transform={`rotate(${(i - 4) * 4} ${x} ${y})`}>{BUBBLES[i % BUBBLES.length]}</text>;
            })()}
          </g>
        );
      })}
    </svg>
  );
};
