/** PROTOTYPE – mascot ideas for a new hockey channel (code-drawn, paper-sticker style). */
import React from "react";
import { AbsoluteFill } from "remotion";
import { P, HAND } from "../presenter/kit";
import { FONT } from "../theme";

const Sticker: React.FC<{ children: React.ReactNode; label: string; sub: string }> = ({ children, label, sub }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 340 }}>
    <div style={{ width: 320, height: 320, borderRadius: "50%", background: P.paper2, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 24px #0005" }}>{children}</div>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, marginTop: 18, color: "#fff" }}>{label}</div>
    <div style={{ fontFamily: HAND, fontSize: 34, color: "#cfe8ff", textAlign: "center" }}>{sub}</div>
  </div>
);
const Eyes: React.FC<{ y?: number }> = ({ y = -10 }) => (
  <>{[-30, 30].map((x) => <g key={x}><ellipse cx={x} cy={y} rx={18} ry={22} fill="#fff" stroke={P.ink} strokeWidth={5} /><circle cx={x + 4} cy={y + 3} r={9} fill={P.ink} /><circle cx={x} cy={y - 2} r={3} fill="#fff" /></g>)}</>
);

/** 1. "Pucky" – a hockey puck with a gap-tooth grin and a headband */
const Pucky = () => (
  <svg width={280} height={280} viewBox="-140 -140 280 280">
    <ellipse cx={0} cy={40} rx={110} ry={40} fill="#111" stroke={P.ink} strokeWidth={5} />
    <rect x={-110} y={-40} width={220} height={80} fill="#1c1c1c" />
    <ellipse cx={0} cy={-40} rx={110} ry={40} fill="#2b2b2b" stroke={P.ink} strokeWidth={5} />
    <rect x={-110} y={-62} width={220} height={16} fill={P.red} />
    <Eyes y={-8} />
    <path d="M-40 26 Q0 60 40 26 Z" fill="#7f1d1d" stroke={P.ink} strokeWidth={4} />
    <rect x={-8} y={26} width={10} height={12} fill="#fff" stroke={P.ink} strokeWidth={2} />
    <path d="M-125 -10 Q-150 -40 -135 -70 M125 -10 Q150 -40 135 -70" stroke={P.ink} strokeWidth={8} fill="none" strokeLinecap="round" />
  </svg>
);
/** 2. "Zam" – a happy ice resurfacer (Zamboni-style machine, generic) */
const Zam = () => (
  <svg width={290} height={260} viewBox="-150 -120 300 250">
    <rect x={-120} y={-40} width={240} height={110} rx={24} fill="#3b82f6" stroke={P.ink} strokeWidth={5} />
    <rect x={-60} y={-100} width={120} height={70} rx={14} fill="#bfdbfe" stroke={P.ink} strokeWidth={5} />
    <Eyes y={10} />
    <path d="M-35 42 Q0 70 35 42" stroke={P.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
    {[-80, 80].map((x) => <circle key={x} cx={x} cy={80} r={26} fill="#222" stroke={P.ink} strokeWidth={5} />)}
    <path d="M-140 100 H140" stroke="#93c5fd" strokeWidth={10} strokeLinecap="round" />
  </svg>
);
/** 3. "Biscuit the Walrus" – goalie mask walrus */
const Walrus = () => (
  <svg width={280} height={280} viewBox="-140 -140 280 280">
    <circle r={110} fill="#a16207" stroke={P.ink} strokeWidth={5} />
    <path d="M-70 -90 Q0 -130 70 -90 L80 -10 Q0 10 -80 -10 Z" fill="#f8fafc" stroke={P.ink} strokeWidth={5} />
    {[-50, -20, 10, 40].map((x) => <line key={x} x1={x} y1={-95} x2={x + 6} y2={-15} stroke={P.ink} strokeWidth={3} />)}
    <Eyes y={-45} />
    <ellipse cx={0} cy={30} rx={55} ry={34} fill="#d6a76a" stroke={P.ink} strokeWidth={5} />
    <path d="M-22 50 L-26 110 M22 50 L26 110" stroke="#fff" strokeWidth={14} strokeLinecap="round" />
    <path d="M-22 50 L-26 110 M22 50 L26 110" stroke={P.ink} strokeWidth={3} fill="none" />
  </svg>
);

export const HockeyMascots: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#0b2545,#13315c)", alignItems: "center", justifyContent: "center", gap: 40 }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "#fff" }}>Hockey mascot ideas</div>
    <div style={{ display: "flex", gap: 30 }}>
      <Sticker label="Pucky" sub="cocky puck, gap-tooth grin">{<Pucky />}</Sticker>
      <Sticker label="Zam" sub="cheerful ice machine">{<Zam />}</Sticker>
      <Sticker label="Biscuit" sub="walrus goalie">{<Walrus />}</Sticker>
    </div>
  </AbsoluteFill>
);
