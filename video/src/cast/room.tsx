/**
 * Studio v3 – "Room": an angled 2.5D paper studio corner (two walls meeting at 30–45°, floor
 * planks running into depth), ceiling spotlights with visible cones, a wall monitor that holds
 * the board (diegetic graphics), an LED topic sign on the wall, blurred foreground props, and a
 * live camera (push-in, whip-pan with motion blur, angle change per plate).
 */
import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { FONT } from "../theme";

const CREAM = "#f3ead6", INK = "#2b2622";
export const mix = (a: string, b: string, k: number) => {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const c = [16, 8, 0].map((s) => Math.round(((pa >> s) & 255) * (1 - k) + ((pb >> s) & 255) * k));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

/** room geometry for a camera angle a ∈ [-1, 1] (corner moves left/right) */
export const geo = (a: number) => {
  const CX = 540 + a * 230, CT = 40, CB = 1160;
  const wallTop = (x: number) => CT - Math.abs(x - CX) * 0.36;
  const floorY = (x: number) => CB + Math.abs(x - CX) * 0.42;
  return { CX, CT, CB, wallTop, floorY };
};

export const Room: React.FC<{ tint: string; angle: number }> = ({ tint, angle }) => {
  const f = useCurrentFrame();
  const { CX, CT, CB, wallTop, floorY } = geo(angle);
  const L = -800, R = 1880;
  const wallL = mix(tint, CREAM, 0.62), wallR = mix(tint, "#2a2233", 0.45);
  const floorC = mix(tint, "#5b3b24", 0.7);
  const warm = "#ffe7b0";
  // perspective seams on a wall: spacing shrinks towards the corner
  const seams = (side: -1 | 1) => [...Array(9)].map((_, k) => {
    const d = Math.pow((k + 1) / 9, 1.35) * 900;
    const x = CX + side * d;
    return <line key={`${side}${k}`} x1={x} y1={wallTop(x)} x2={x} y2={floorY(x)} stroke={INK} strokeOpacity={0.09} strokeWidth={3} />;
  });
  const base = (x: number, off: number) => floorY(x) - off;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: mix(tint, "#0b0d18", 0.75) }}>
      <svg width={1080} height={1920} style={{ position: "absolute", overflow: "visible" }}>
        <defs>
          <linearGradient id="rmL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={mix(wallL, "#000000", 0.45)} /><stop offset="1" stopColor={wallL} /></linearGradient>
          <linearGradient id="rmR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={wallR} /><stop offset="1" stopColor={mix(wallR, "#000000", 0.5)} /></linearGradient>
          <linearGradient id="rmF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={mix(floorC, "#000000", 0.35)} /><stop offset="0.5" stopColor={floorC} /><stop offset="1" stopColor={mix(floorC, "#000000", 0.55)} /></linearGradient>
          <radialGradient id="rmPool" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={warm} stopOpacity={0.55} /><stop offset="1" stopColor={warm} stopOpacity={0} /></radialGradient>
          <radialGradient id="rmRug" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={tint} stopOpacity={0.55} /><stop offset="0.8" stopColor={tint} stopOpacity={0.35} /><stop offset="1" stopColor={tint} stopOpacity={0} /></radialGradient>
          <filter id="rmGrain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={3} /><feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0.12 0" /><feComposite in2="SourceGraphic" operator="in" /></filter>
        </defs>
        {/* walls */}
        <path d={`M${L} ${wallTop(L)} L${CX} ${CT} L${CX} ${CB} L${L} ${floorY(L)} Z`} fill="url(#rmL)" />
        <path d={`M${CX} ${CT} L${R} ${wallTop(R)} L${R} ${floorY(R)} L${CX} ${CB} Z`} fill="url(#rmR)" />
        {seams(-1)}{seams(1)}
        {/* wainscot rail following the perspective */}
        {[-1, 1].map((s) => <path key={s} d={`M${CX} ${base(CX, 230)} L${s < 0 ? L : R} ${base(s < 0 ? L : R, 230 + Math.abs((s < 0 ? L : R) - CX) * 0.08)}`} stroke={CREAM} strokeOpacity={0.5} strokeWidth={8} />)}
        {/* window on the right wall (warm daylight) */}
        {(() => {
          const x0 = CX + 140, x1 = CX + 360;
          const p = (x: number, y: number) => `${x} ${wallTop(x) + y + (x - CX) * 0.05}`;
          return <g>
            <path d={`M${p(x0, 420)} L${p(x1, 420)} L${p(x1, 980)} L${p(x0, 980)} Z`} fill={mix(warm, tint, 0.25)} opacity={0.9} />
            <path d={`M${p((x0 + x1) / 2, 420)} L${p((x0 + x1) / 2, 980)} M${p(x0, 700)} L${p(x1, 700)}`} stroke={INK} strokeWidth={10} />
            <path d={`M${p(x0, 420)} L${p(x1, 420)} L${p(x1, 980)} L${p(x0, 980)} Z`} fill="none" stroke={INK} strokeWidth={12} />
          </g>;
        })()}
        {/* corner shadow */}
        <path d={`M${CX - 60} ${CT} L${CX + 60} ${CT} L${CX + 60} ${CB} L${CX - 60} ${CB} Z`} fill="#000" opacity={0.18} style={{ filter: "blur(20px)" }} />
        {/* floor */}
        <path d={`M${L} ${floorY(L)} L${CX} ${CB} L${R} ${floorY(R)} L${R} 2100 L${L} 2100 Z`} fill="url(#rmF)" />
        {[...Array(15)].map((_, k) => {
          const ang = Math.PI * (0.06 + 0.88 * (k / 14));
          return <line key={k} x1={CX} y1={CB} x2={CX + Math.cos(ang) * 2600 * (k % 2 ? 1 : 1)} y2={CB + Math.sin(ang) * 2600} stroke={INK} strokeOpacity={0.16} strokeWidth={3} />;
        })}
        {[0.12, 0.3, 0.55, 0.9].map((d, k) => <path key={k} d={`M${L} ${floorY(L) + d * 700} Q ${CX} ${CB + d * 760} ${R} ${floorY(R) + d * 700}`} stroke={INK} strokeOpacity={0.1} strokeWidth={3} fill="none" />)}
        {/* skirting board */}
        <path d={`M${L} ${floorY(L)} L${CX} ${CB} L${R} ${floorY(R)}`} stroke={mix(INK, tint, 0.2)} strokeWidth={14} fill="none" />
        {/* rug + light pools under the cast */}
        <ellipse cx={540} cy={1440} rx={560} ry={120} fill="url(#rmRug)" />
        <ellipse cx={540} cy={1440} rx={520} ry={110} fill="none" stroke={CREAM} strokeOpacity={0.35} strokeWidth={6} strokeDasharray="22 14" />
        <ellipse cx={330} cy={1450} rx={300} ry={80} fill="url(#rmPool)" />
        <ellipse cx={760} cy={1450} rx={300} ry={80} fill="url(#rmPool)" />
        {/* window light patch on the floor */}
        <path d={`M${CX + 160} ${CB + 120} L${CX + 420} ${CB + 160} L${CX + 760} ${CB + 520} L${CX + 360} ${CB + 470} Z`} fill={warm} opacity={0.12} style={{ filter: "blur(16px)" }} />
        <rect width={1080} height={1920} filter="url(#rmGrain)" opacity={0.6} />
      </svg>
    </AbsoluteFill>
  );
};

/** spotlight cones from two ceiling lamps + dust in the beams (screen blend, drawn above the cast) */
export const RoomLights: React.FC<{ tint: string }> = ({ tint }) => {
  const f = useCurrentFrame();
  const warm = "#ffe2a8";
  const lamps = [{ x: 300, tx: 330 }, { x: 790, tx: 760 }];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", mixBlendMode: "screen" }}>
        <defs>
          <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={warm} stopOpacity={0.5} /><stop offset="1" stopColor={warm} stopOpacity={0.02} /></linearGradient>
        </defs>
        {lamps.map((l, k) => {
          const flick = 0.9 + 0.1 * Math.sin(f / 7 + k * 2) * Math.sin(f / 13);
          return <path key={k} d={`M${l.x - 30} 30 L${l.x + 30} 30 L${l.tx + 280} 1470 L${l.tx - 280} 1470 Z`} fill="url(#cone)" opacity={0.6 * flick} style={{ filter: "blur(14px)" }} />;
        })}
        {[...Array(30)].map((_, i) => {
          const l = lamps[i % 2];
          const p = ((random(`d${i}`) + f * 0.0012 * (1 + random(`v${i}`))) % 1);
          const y = 80 + p * 1350;
          const spread = (y / 1470) * 260;
          const x = l.x + (l.tx - l.x) * (y / 1470) + (random(`x${i}`) - 0.5) * 2 * spread + Math.sin(f / 40 + i) * 12;
          return <circle key={i} cx={x} cy={y} r={2 + random(`r${i}`) * 3} fill={warm} opacity={0.5 * Math.sin(p * Math.PI)} />;
        })}
      </svg>
      {/* lamp housings peeking from the ceiling */}
      {lamps.map((l, k) => (
        <svg key={k} width={160} height={120} style={{ position: "absolute", left: l.x - 80, top: -30, overflow: "visible" }}>
          <path d="M80 0 L80 40" stroke={INK} strokeWidth={6} />
          <path d={`M40 40 L120 40 L140 100 L20 100 Z`} fill={INK} transform={`rotate(${k ? 14 : -14} 80 70)`} />
          <ellipse cx={80} cy={100} rx={56} ry={10} fill={warm} transform={`rotate(${k ? 14 : -14} 80 70)`} style={{ filter: `drop-shadow(0 0 18px ${warm})` }} />
        </svg>
      ))}
    </AbsoluteFill>
  );
};

/** vignette: corners fall into shadow (topmost scene layer) */
export const Vignette: React.FC<{ tint: string }> = ({ tint }) => (
  <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse 80% 70% at 50% 46%, transparent 50%, ${mix(tint, "#000000", 0.85)}cc 100%)` }} />
);

/** blurred props closest to the camera (depth of field) */
export const Foreground: React.FC<{ tint: string }> = ({ tint }) => {
  const f = useCurrentFrame();
  const dark = mix(tint, "#120e0c", 0.8);
  const rim = mix(tint, "#ffffff", 0.3);
  const sway = Math.sin(f / 70) * 2;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", filter: "blur(7px)" }}>
      {/* paper plant, bottom-left */}
      <svg width={420} height={520} style={{ position: "absolute", left: -110, top: 1530, overflow: "visible" }}>
        <g transform={`rotate(${sway} 210 470)`}>
          {[...Array(7)].map((_, k) => {
            const a = -70 + k * 22;
            return <path key={k} d="M210 470 C 180 330, 160 230, 210 120 C 250 230, 240 330, 210 470 Z" fill={k % 2 ? mix("#2f6b4f", tint, 0.2) : mix("#3f8a62", tint, 0.15)} stroke={rim} strokeOpacity={0.5} strokeWidth={4} transform={`rotate(${a} 210 470)`} />;
          })}
        </g>
        <path d="M110 430 L310 430 L285 560 L135 560 Z" fill={mix("#b4483b", dark, 0.5)} stroke={rim} strokeOpacity={0.4} strokeWidth={4} />
      </svg>
      {/* desk mic + paper stack, bottom-right */}
      <svg width={420} height={420} style={{ position: "absolute", left: 830, top: 1620, overflow: "visible" }}>
        <rect x={60} y={230} width={330} height={60} rx={6} fill={mix(CREAM, dark, 0.35)} transform="rotate(-6 200 260)" />
        <rect x={80} y={190} width={300} height={50} rx={6} fill={mix(CREAM, dark, 0.2)} transform="rotate(4 200 210)" />
        <path d="M120 190 L170 40" stroke={dark} strokeWidth={18} strokeLinecap="round" />
        <rect x={135} y={-60} width={90} height={150} rx={45} fill={dark} stroke={rim} strokeOpacity={0.6} strokeWidth={5} transform="rotate(18 180 15)" />
      </svg>
    </AbsoluteFill>
  );
};

/** LED topic sign mounted on the wall (replaces the paper tab in room shows) */
export const LedSign: React.FC<{ label: string; tint: string; lf: number }> = ({ label, tint, lf }) => {
  const on = lf < 6 ? (lf % 2 ? 0.3 : 1) : 1; // power-on flicker
  const glow = mix(tint, "#ffffff", 0.35);
  return (
    <div style={{ position: "absolute", left: 44, top: 70, padding: "10px 22px", background: "#0d0f14", border: `4px solid ${INK}`, borderRadius: 12, boxShadow: `0 0 0 3px #ffffff22 inset, 0 0 30px ${tint}88, 6px 10px 0 #0006`, transform: "rotate(-1.5deg)" }}>
      <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 30, letterSpacing: 4, color: glow, opacity: on, textShadow: `0 0 8px ${glow}, 0 0 22px ${tint}` }}>
        <span style={{ color: "#ff5a4f", textShadow: "0 0 10px #ff5a4f" }}>●</span> {label}
      </div>
    </div>
  );
};

/** horizontal streaks during a whip-pan */
export const SpeedLines: React.FC<{ k: number; dir: number }> = ({ k, dir }) => {
  if (k <= 0.02) return null;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: k, pointerEvents: "none" }}>
      {[...Array(26)].map((_, i) => {
        const y = random(`sl${i}`) * 1920, w = 300 + random(`sw${i}`) * 700;
        const x = (random(`sx${i}`) * 1400 - 300) - dir * k * 200;
        return <rect key={i} x={x} y={y} width={w} height={3 + random(`sh${i}`) * 6} rx={3} fill="#fff" opacity={0.35 + random(`so${i}`) * 0.4} />;
      })}
    </svg>
  );
};

/** paper confetti burst (keyword VFX) */
export const PaperBurst: React.FC<{ x: number; y: number; age: number; seed: string }> = ({ x, y, age, seed }) => {
  if (age < 0 || age > 0.7) return null;
  const cols = ["#3fd0c9", "#e8b84a", "#d9604f", CREAM];
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}>
      {[...Array(16)].map((_, i) => {
        const a = random(`${seed}a${i}`) * Math.PI * 2;
        const v = 420 + random(`${seed}v${i}`) * 520;
        const px = x + Math.cos(a) * v * age;
        const py = y + Math.sin(a) * v * age * 0.8 + 900 * age * age;
        return <rect key={i} x={px} y={py} width={16} height={10} fill={cols[i % 4]} stroke={INK} strokeWidth={2} opacity={1 - age / 0.7} transform={`rotate(${(age * 900 + i * 40) % 360} ${px} ${py})`} />;
      })}
    </svg>
  );
};

/** brand watermark + animated frame for cold opens (replaces the separate intro) */
export const BrandBug: React.FC = () => {
  const f = useCurrentFrame();
  const draw = Math.min(1, f / 40);
  const fade = f < 40 ? 1 : Math.max(0, 1 - (f - 40) / 30);
  const per = 2 * (1080 + 1920);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", opacity: fade }}>
        <defs><linearGradient id="bbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#22d3ee" /><stop offset="0.5" stopColor="#a855f7" /><stop offset="1" stopColor="#ec4899" /></linearGradient></defs>
        <rect x={8} y={8} width={1064} height={1904} rx={28} fill="none" stroke="url(#bbg)" strokeWidth={12} strokeDasharray={`${per * draw} ${per}`} style={{ filter: "drop-shadow(0 0 16px #a855f7)" }} />
      </svg>
      <div style={{ position: "absolute", right: 40, top: 76, fontFamily: FONT, fontWeight: 900, fontStyle: "italic", fontSize: 34, letterSpacing: -0.5, opacity: 0.88, transform: `scale(${f < 12 ? 0.6 + f / 30 : 1})`, transformOrigin: "100% 0", filter: "drop-shadow(0 3px 0 #000a)" }}>
        <span style={{ background: "linear-gradient(90deg,#22d3ee,#a855f7,#ec4899)", WebkitBackgroundClip: "text", color: "transparent" }}>AI</span>
        <span style={{ color: "#fff" }}> BOUNCE</span>
      </div>
    </AbsoluteFill>
  );
};
