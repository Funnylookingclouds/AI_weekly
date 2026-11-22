import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { C, FONT, MONO } from "../theme";
import { Scramble, GlitchText, StaggerText } from "../Effects";
import { useSpring, clamp, Stage, Glow, Chip } from "../ui";
import { at, segStart } from "../timing";
import type { Beat } from "../types";

// ---------- HOOK ----------
export const MoneyHook: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [5, 85], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const val = Math.round(p * 1_000_000);
  const s = useSpring(0, 9);
  const txt = val.toLocaleString("en-US");
  return (
    <Stage>
      <div style={{ fontSize: 46, fontWeight: 700, color: C.muted, letterSpacing: 8, opacity: s }}>MATH PROBLEM WORTH</div>
      <div style={{ fontSize: 150, fontWeight: 900, transform: `scale(${0.6 + 0.4 * s})`, fontVariantNumeric: "tabular-nums", marginTop: 10 }}>
        <Glow color={C.green}><GlitchText seed="hook">{`$${txt}`}</GlitchText></Glow>
      </div>
      <div style={{ marginTop: 50 }}><Chip color={C.cyan} delay={30}>SOLVED BY AI?</Chip></div>
      {[...Array(14)].map((_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const r = interpolate(f, [60, 120], [0, 430], clamp);
        const o = interpolate(f, [60, 80, 130], [0, 1, 0], clamp);
        return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * r - 10, top: 440 + Math.sin(a) * r - 10, width: 20, height: 20, borderRadius: 4, background: i % 2 ? C.green : C.amber, opacity: o, transform: `rotate(${f * 6 + i * 20}deg)` }} />;
      })}
    </Stage>
  );
};

export const NotEvenTop: React.FC = () => {
  const s = useSpring(0, 8);
  const s2 = useSpring(18, 8);
  const f = useCurrentFrame();
  return (
    <Stage>
      <div style={{ fontSize: 60, fontWeight: 800, color: C.muted, transform: `translateY(${(1 - s) * 60}px)`, opacity: s }}>…and it's not even</div>
      <div style={{ fontSize: 120, fontWeight: 900, textAlign: "center", lineHeight: 1.05, marginTop: 30, transform: `scale(${s2})` }}>
        THIS WEEK'S<br /><Glow color={C.purple}><span style={{ color: C.purple }}>#1</span></Glow> STORY
      </div>
      <div style={{ fontSize: 200, fontWeight: 900, color: C.pink, marginTop: 10, transform: `rotate(${Math.sin(f / 6) * 8}deg) scale(${s2})` }}>?!</div>
    </Stage>
  );
};

// ---------- NEWS 1: Riemann ----------
const MATH_GLYPHS = ["∑", "π", "∞", "ζ", "∫", "√", "≈", "∂", "ℂ", "½"];
const FloatingGlyphs: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ top: -250, height: 1920 }}>
      {MATH_GLYPHS.map((g, i) => {
        const a = (i / MATH_GLYPHS.length) * Math.PI * 2 + f / 120;
        const r = 380 + (i % 3) * 70;
        const o = interpolate(f, [0, 20], [0, 0.35], clamp);
        return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * r - 40, top: 690 + Math.sin(a) * r * 1.25 - 50, fontSize: 70 + (i % 3) * 20, fontWeight: 900, color: [C.cyan, C.purple, C.amber][i % 3], opacity: o, transform: `rotate(${Math.sin(f / 40 + i) * 20}deg)`, fontFamily: MONO }}>{g}</div>;
      })}
    </AbsoluteFill>
  );
};

export const RiemannTitle: React.FC = () => {
  const s = useSpring(0);
  const f = useCurrentFrame();
  return (
    <Stage>
      <FloatingGlyphs />
      <Chip color={C.amber}>THURSDAY, NOV 20</Chip>
      <div style={{ fontSize: 96, fontWeight: 900, marginTop: 40, letterSpacing: -2, transform: `translateX(${(1 - s) * -300}px)`, opacity: s }}>
        <Scramble text="RIEMANN" />
      </div>
      <div style={{ fontSize: 96, fontWeight: 900, letterSpacing: -2, color: C.cyan, transform: `translateX(${(1 - s) * 300}px)`, opacity: s }}>
        <Glow color={C.cyan} size={30}><Scramble text="HYPOTHESIS" delay={8} /></Glow>
      </div>
      <div style={{ fontFamily: MONO, fontSize: 64, marginTop: 40, color: C.text, opacity: interpolate(f, [20, 40], [0, 1], clamp) }}>
        ζ(s) = 0 ⇒ Re(s) = ½
      </div>
      <div style={{ display: "flex", gap: 24, marginTop: 50, alignItems: "center" }}>
        <Chip color={C.text} delay={40}>Levent Alpöge</Chip>
        <span style={{ fontSize: 60, fontWeight: 900, opacity: interpolate(f, [50, 60], [0, 1], clamp) }}>+</span>
        <Chip color={C.purple} delay={55}>Claude (AI)</Chip>
      </div>
    </Stage>
  );
};

export const Years167: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [10, 70], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const year = Math.round(1859 + p * (2026 - 1859));
  const s = useSpring(0, 10);
  return (
    <Stage>
      <div style={{ fontSize: 240, fontWeight: 900, lineHeight: 1, transform: `scale(${s})` }}>
        <Glow color={C.amber}>167</Glow><span style={{ fontSize: 90, color: C.muted }}> years</span>
      </div>
      <div style={{ fontSize: 48, fontWeight: 700, color: C.muted, marginTop: 10, letterSpacing: 4 }}><Scramble text="UNSOLVED MYSTERY" delay={10} speed={1.2} /></div>
      <div style={{ position: "relative", width: 800, height: 140, marginTop: 70 }}>
        <div style={{ position: "absolute", top: 60, left: 0, width: 800, height: 8, borderRadius: 4, background: C.bg2 }} />
        <div style={{ position: "absolute", top: 60, left: 0, width: 800 * p, height: 8, borderRadius: 4, background: `linear-gradient(90deg, ${C.purple}, ${C.amber})` }} />
        <div style={{ position: "absolute", top: 46, left: 800 * p - 18, width: 36, height: 36, borderRadius: 18, background: C.amber, boxShadow: `0 0 30px ${C.amber}` }} />
        <div style={{ position: "absolute", top: 100, left: 0, fontSize: 36, color: C.muted, fontWeight: 700 }}>1859</div>
        <div style={{ position: "absolute", top: 100, right: 0, fontSize: 36, color: C.muted, fontWeight: 700 }}>2026</div>
        <div style={{ position: "absolute", top: -10, left: 800 * p - 70, width: 140, textAlign: "center", fontSize: 40, fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>{year}</div>
      </div>
    </Stage>
  );
};

const LEAN = [
  "theorem riemann_hypothesis :",
  "  ∀ s : ℂ, ζ s = 0 →",
  "  0 < s.re → s.re < 1 →",
  "  s.re = 1 / 2 := by",
  "  exact zeta_zero_line s",
];
export const LeanCheck: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(0);
  return (
    <Stage>
      <div style={{ width: 900, borderRadius: 28, background: "#020617", border: `2px solid ${C.bg2}`, boxShadow: `0 30px 80px #000a, 0 0 60px ${C.cyan}22`, transform: `scale(${0.85 + 0.15 * s}) rotate(${(1 - s) * -4}deg)`, overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 12, padding: "22px 28px", background: C.bg2 }}>
          {[C.red, C.amber, C.green].map((c) => <div key={c} style={{ width: 22, height: 22, borderRadius: 11, background: c }} />)}
          <div style={{ marginLeft: 20, fontSize: 30, color: C.muted, fontFamily: MONO }}>proof.lean</div>
          <div style={{ marginLeft: "auto", fontSize: 24, color: C.muted, fontFamily: FONT, fontWeight: 700, letterSpacing: 2 }}>ILLUSTRATION</div>
        </div>
        <div style={{ padding: "30px 34px", fontFamily: MONO, fontSize: 34, lineHeight: 1.75 }}>
          {LEAN.map((line, i) => {
            const st = 8 + i * 14;
            const chars = Math.floor(interpolate(f, [st, st + 12], [0, line.length], clamp));
            const ok = f > st + 14;
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", whiteSpace: "pre" }}>
                <span style={{ color: i === 0 ? C.purple : C.text }}>{line.slice(0, chars)}</span>
                <span style={{ color: C.green, fontWeight: 900, opacity: ok ? 1 : 0, transform: `scale(${ok ? 1 : 0})` }}>✓</span>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ marginTop: 50 }}><Chip color={C.green} delay={80}>COMPUTERS CHECK EVERY STEP</Chip></div>
    </Stage>
  );
};

export const UnderReview: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(0, 7, 160);
  const mx = Math.sin(f / 14) * 120;
  const my = Math.cos(f / 18) * 60;
  return (
    <Stage>
      <div style={{ position: "relative", width: 360, height: 360 }}>
        <div style={{ position: "absolute", left: 60 + mx * 0.3, top: 40 + my * 0.3, width: 220, height: 220, borderRadius: 110, border: `22px solid ${C.cyan}`, boxShadow: `0 0 40px ${C.cyan}` }} />
        <div style={{ position: "absolute", left: 240 + mx * 0.3, top: 230 + my * 0.3, width: 130, height: 34, borderRadius: 17, background: C.cyan, transform: "rotate(45deg)", transformOrigin: "left center" }} />
      </div>
      <div style={{ marginTop: 40, padding: "24px 40px", border: `6px solid ${C.amber}`, borderRadius: 18, color: C.amber, fontSize: 64, fontWeight: 900, letterSpacing: 4, transform: `rotate(-6deg) scale(${2 - s})`, opacity: s }}>
        UNDER REVIEW
      </div>
      <div style={{ marginTop: 34, fontSize: 40, color: C.muted, fontWeight: 700 }}>Not yet verified by experts</div>
    </Stage>
  );
};

export const Historic: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(0, 8);
  const pulse = 1 + Math.sin(f / 5) * 0.03;
  return (
    <Stage>
      <div style={{ fontSize: 50, fontWeight: 800, color: C.muted, letterSpacing: 6, opacity: s }}>IF IT HOLDS…</div>
      <div style={{ fontSize: 132, fontWeight: 900, marginTop: 20, transform: `scale(${s * pulse})`, background: `linear-gradient(90deg, ${C.cyan}, ${C.purple}, ${C.pink})`, WebkitBackgroundClip: "text", color: "transparent" }}>
        <Scramble text="HISTORIC" delay={4} speed={2.2} />
      </div>
      <div style={{ marginTop: 40 }}><Chip color={C.green} delay={20}>$1M MILLENNIUM PRIZE</Chip></div>
    </Stage>
  );
};

// ---------- NEWS 2: Heart ----------
const ecgPath = (w: number, h: number, beats: number) => {
  let d = `M0 ${h / 2}`;
  const bw = w / beats;
  for (let i = 0; i < beats; i++) {
    const x = i * bw;
    d += ` L${x + bw * 0.3} ${h / 2} L${x + bw * 0.38} ${h * 0.4} L${x + bw * 0.44} ${h / 2} L${x + bw * 0.5} ${h * 0.05} L${x + bw * 0.56} ${h * 0.9} L${x + bw * 0.62} ${h / 2} L${x + bw * 0.75} ${h * 0.42} L${x + bw * 0.85} ${h / 2} L${x + bw} ${h / 2}`;
  }
  return d;
};
const Heart: React.FC<{ size: number; color: string; beat: number }> = ({ size, color, beat }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `scale(${beat})`, filter: `drop-shadow(0 0 30px ${color})` }}>
    <path d="M50 88 C20 66 5 50 5 32 C5 18 16 8 29 8 C38 8 45 13 50 21 C55 13 62 8 71 8 C84 8 95 18 95 32 C95 50 80 66 50 88Z" fill={color} />
  </svg>
);

export const SavesLives: React.FC = () => {
  const f = useCurrentFrame();
  const beatPhase = (f % 45) / 45;
  const beat = 1 + (beatPhase < 0.12 ? Math.sin((beatPhase / 0.12) * Math.PI) * 0.12 : 0);
  const draw = interpolate(f, [0, 100], [2400, 0], clamp);
  return (
    <Stage>
      <div style={{ position: "relative", width: 320, height: 320 }}>
        {[0, 1, 2].map((k) => {
          const ph = ((f + k * 15) % 45) / 45;
          return <div key={k} style={{ position: "absolute", left: 160 - ph * 300, top: 160 - ph * 300, width: ph * 600, height: ph * 600, borderRadius: "50%", border: `6px solid ${C.pink}`, opacity: (1 - ph) * 0.6 }} />;
        })}
        <div style={{ position: "absolute", inset: 0 }}><Heart size={320} color={C.pink} beat={beat} /></div>
      </div>
      <svg width={1000} height={220} style={{ marginTop: 30 }}>
        <path d={ecgPath(1000, 220, 3)} stroke={C.pink} strokeWidth={8} fill="none" strokeDasharray={2400} strokeDashoffset={draw} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 12px ${C.pink})` }} />
      </svg>
      <div style={{ fontSize: 96, fontWeight: 900, marginTop: 20 }}><Glow color={C.pink} size={30}><StaggerText text="SAVES LIVES" delay={8} /></Glow></div>
    </Stage>
  );
};

export const Ultrasound: React.FC = () => {
  const f = useCurrentFrame();
  const sweep = interpolate(f % 70, [0, 70], [-38, 38]);
  const s = useSpring(0);
  const found = f > 50;
  return (
    <Stage>
      <div style={{ position: "relative", width: 760, height: 620, transform: `scale(${0.8 + 0.2 * s})`, opacity: s }}>
        <svg width={760} height={620} viewBox="0 0 760 620">
          <defs>
            <radialGradient id="us" cx="50%" cy="0%" r="100%">
              <stop offset="0%" stopColor="#64748B" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0B1220" stopOpacity="1" />
            </radialGradient>
          </defs>
          <path d="M380 20 L60 560 A480 480 0 0 0 700 560 Z" fill="url(#us)" stroke={C.cyan} strokeWidth={4} />
          {[...Array(40)].map((_, i) => (
            <circle key={i} cx={200 + ((i * 97) % 360)} cy={180 + ((i * 53) % 340)} r={6 + (i % 5) * 3} fill="#CBD5E1" opacity={0.12 + (i % 4) * 0.05} />
          ))}
          <ellipse cx={390} cy={360} rx={110} ry={90} fill="#0F172A" stroke="#94A3B8" strokeWidth={6} opacity={0.9} />
          <g transform={`rotate(${sweep} 380 20)`}>
            <line x1={380} y1={20} x2={380} y2={560} stroke={C.cyan} strokeWidth={6} opacity={0.9} style={{ filter: `drop-shadow(0 0 10px ${C.cyan})` }} />
          </g>
          {found && <rect x={265} y={255} width={250} height={210} rx={14} fill="none" stroke={C.green} strokeWidth={8} strokeDasharray="30 14" />}
        </svg>
        {found && <div style={{ position: "absolute", left: 470, top: 210, padding: "10px 22px", borderRadius: 12, background: C.green, color: C.bg, fontSize: 34, fontWeight: 900 }}>AI: HEART FAILURE</div>}
      </div>
      <div style={{ marginTop: 20 }}><Chip color={C.cyan}>1 ROUTINE HEART ULTRASOUND</Chip></div>
    </Stage>
  );
};

export const BarCompare: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g1 = spring({ frame: f - 5, fps, config: { damping: 14 } });
  const g2 = spring({ frame: f - 30, fps, config: { damping: 12 } });
  const H = 560;
  const Bar: React.FC<{ v: number; g: number; color: string; label: string }> = ({ v, g, color, label }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 300 }}>
      <div style={{ fontSize: 110, fontWeight: 900, color, fontVariantNumeric: "tabular-nums" }}>{Math.round(v * Math.min(g, 1))}%</div>
      <div style={{ height: H, display: "flex", alignItems: "flex-end" }}>
        <div style={{ width: 220, height: H * (v / 100) * g, borderRadius: "24px 24px 0 0", background: `linear-gradient(180deg, ${color}, ${color}55)`, boxShadow: `0 0 50px ${color}66` }} />
      </div>
      <div style={{ fontSize: 44, fontWeight: 800, marginTop: 20, color: C.text }}>{label}</div>
    </div>
  );
  return (
    <Stage>
      <div style={{ fontSize: 44, fontWeight: 800, color: C.muted, letterSpacing: 3, marginBottom: 10 }}>HIDDEN HEART FAILURE FOUND</div>
      <div style={{ display: "flex", gap: 80, alignItems: "flex-end" }}>
        <Bar v={48} g={g1} color={C.muted} label="Without AI" />
        <Bar v={78} g={g2} color={C.green} label="With AI" />
      </div>
    </Stage>
  );
};

export const SwedishData: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(0);
  const draw = interpolate(f, [10, 90], [2400, 0], clamp);
  const warn = f > 70;
  return (
    <Stage>
      <div style={{ display: "flex", alignItems: "center", gap: 30, transform: `translateY(${(1 - s) * -80}px)`, opacity: s }}>
        <svg width={150} height={94} viewBox="0 0 16 10" style={{ borderRadius: 8 }}>
          <rect width={16} height={10} fill="#006AA7" />
          <rect x={5} width={2} height={10} fill="#FECC00" />
          <rect y={4} width={16} height={2} fill="#FECC00" />
        </svg>
        <div style={{ fontSize: 64, fontWeight: 900 }}>Swedish patient data</div>
      </div>
      <div style={{ position: "relative", marginTop: 70 }}>
        <svg width={1000} height={260}>
          <path d={ecgPath(1000, 260, 4)} stroke={C.cyan} strokeWidth={7} fill="none" strokeDasharray={2400} strokeDashoffset={draw} strokeLinejoin="round" />
          {warn && <circle cx={625} cy={30} r={46} fill="none" stroke={C.red} strokeWidth={8} opacity={0.6 + Math.sin(f / 4) * 0.4} />}
        </svg>
      </div>
      <div style={{ marginTop: 50, opacity: warn ? 1 : 0, transform: `scale(${warn ? 1 : 0.5})` }}>
        <Chip color={C.red}>⚠ WARNING: SUDDEN CARDIAC DEATH</Chip>
      </div>
      <div style={{ marginTop: 26, fontSize: 38, color: C.muted, fontWeight: 700, opacity: warn ? 1 : 0 }}>…that standard tests miss</div>
    </Stage>
  );
};

// ---------- NEWS 3: Inkling ----------
export const Quickie: React.FC = () => {
  const s = useSpring(0, 6, 200);
  const f = useCurrentFrame();
  return (
    <Stage>
      <svg width={260} height={260} viewBox="0 0 24 24" style={{ transform: `scale(${s}) rotate(${(1 - s) * 30}deg)`, filter: `drop-shadow(0 0 40px ${C.amber})` }}>
        <path d="M13 2 L4 14 H11 L10 22 L20 9 H13 Z" fill={C.amber} />
      </svg>
      <div style={{ fontSize: 140, fontWeight: 900, letterSpacing: -2, transform: `scale(${2.2 - 1.2 * s})`, opacity: s }}><GlitchText seed="qh">QUICK HIT</GlitchText></div>
    </Stage>
  );
};

export const Laptop: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(0);
  const bubble = (d: number) => spring({ frame: f - d, fps: 60, config: { damping: 12 } });
  return (
    <Stage>
      <div style={{ display: "flex", gap: 20, marginBottom: 40 }}>
        <Chip color={C.cyan}>INKLING 2 MINI</Chip>
      </div>
      <div style={{ transform: `perspective(1600px) rotateX(${(1 - s) * 30}deg) scale(${0.8 + 0.2 * s})`, opacity: s }}>
        <div style={{ width: 820, height: 500, borderRadius: "26px 26px 0 0", border: `16px solid #334155`, background: "#020617", padding: 30, boxSizing: "border-box", position: "relative" }}>
          <div style={{ position: "absolute", top: 18, right: 22, display: "flex", alignItems: "center", gap: 10, color: C.red, fontSize: 28, fontWeight: 900 }}>
            <svg width={34} height={34} viewBox="0 0 24 24"><path d="M2 8.5 C8 3 16 3 22 8.5 M5 12 C9.5 8 14.5 8 19 12 M8.5 15.5 C11 13.5 13 13.5 15.5 15.5" stroke={C.muted} strokeWidth={2.2} fill="none" strokeLinecap="round" /><line x1={3} y1={21} x2={21} y2={3} stroke={C.red} strokeWidth={2.6} /></svg>
            OFFLINE
          </div>
          <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ alignSelf: "flex-end", background: C.purple, padding: "18px 28px", borderRadius: "26px 26px 6px 26px", fontSize: 34, fontWeight: 700, transform: `scale(${bubble(15)})`, transformOrigin: "right" }}>Summarize my contract</div>
            <div style={{ alignSelf: "flex-start", background: C.bg2, padding: "18px 28px", borderRadius: "26px 26px 26px 6px", fontSize: 34, fontWeight: 700, transform: `scale(${bubble(40)})`, transformOrigin: "left", maxWidth: 600 }}>Done! 3 key points…</div>
          </div>
        </div>
        <div style={{ width: 960, height: 34, marginLeft: -70, background: "#475569", borderRadius: "0 0 30px 30px" }} />
      </div>
      <div style={{ marginTop: 50, display: "flex", gap: 24 }}>
        <Chip color={C.green} delay={50}>FREE</Chip>
        <Chip color={C.amber} delay={62}>RUNS LOCALLY</Chip>
      </div>
    </Stage>
  );
};

export const PrivateData: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(0, 9);
  const shake = f > 25 && f < 45 ? Math.sin(f * 2) * 6 : 0;
  return (
    <Stage>
      <svg width={360} height={420} viewBox="0 0 24 28" style={{ transform: `scale(${s}) translateX(${shake}px)`, filter: `drop-shadow(0 0 40px ${C.green})` }}>
        <path d="M12 1 L22 5 V13 C22 20 17.5 25 12 27 C6.5 25 2 20 2 13 V5 Z" fill={`${C.green}33`} stroke={C.green} strokeWidth={1.4} />
        <rect x={8} y={12} width={8} height={7} rx={1.2} fill={C.green} />
        <path d="M9.5 12 V10 a2.5 2.5 0 0 1 5 0 V12" stroke={C.green} strokeWidth={1.4} fill="none" />
      </svg>
      <div style={{ fontSize: 76, fontWeight: 900, marginTop: 30, textAlign: "center", lineHeight: 1.1 }}>
        Your data<br /><span style={{ color: C.green }}>stays with you</span>
      </div>
    </Stage>
  );
};

// ---------- LOOP ----------
export const Recap: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = [
    { c: C.amber, t: "ζ", l: "Math" },
    { c: C.pink, t: "♥", l: "Heart" },
    { c: C.green, t: "⌂", l: "Privacy" },
  ];
  const big = spring({ frame: f - 30, fps, config: { damping: 8 } });
  return (
    <Stage>
      <div style={{ display: "flex", gap: 50 }}>
        {items.map((it, i) => {
          const s = spring({ frame: f - i * 7, fps, config: { damping: 10 } });
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `translateY(${(1 - s) * 200}px)`, opacity: s }}>
              <div style={{ width: 220, height: 220, borderRadius: 50, border: `5px solid ${it.c}`, background: `${it.c}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 120, fontWeight: 900, color: it.c }}>{it.t}</div>
              <div style={{ fontSize: 40, fontWeight: 800, marginTop: 16 }}>{it.l}</div>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 170, fontWeight: 900, marginTop: 60, transform: `scale(${big})` }}>
        <Glow color={C.cyan}>7</Glow> <StaggerText text="DAYS" delay={34} style={{ color: C.cyan }} />
      </div>
    </Stage>
  );
};

export const LoopOut: React.FC = () => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 60], [0.4, 1.25], { ...clamp, easing: Easing.in(Easing.cubic) });
  const o = interpolate(f, [0, 10], [0, 1], clamp);
  return (
    <Stage>
      <div style={{ fontSize: 50, fontWeight: 700, color: C.muted, letterSpacing: 8, opacity: o }}>MATH PROBLEM WORTH</div>
      <div style={{ fontSize: 150, fontWeight: 900, transform: `scale(${z})`, opacity: o }}>
        <Glow color={C.green}><GlitchText seed="loop">$1,000,000</GlitchText></Glow>
      </div>
    </Stage>
  );
};

// ---------- beat list ----------
export const WEEK_LABEL = "WK 47";
export const BEATS: Beat[] = [
  { t: 0, C: MoneyHook },
  { t: at("hook", "and"), C: NotEvenTop, sfx: "whoosh" },
  { t: segStart("news1"), C: RiemannTitle, sfx: "whoosh" },
  { t: at("news1", "167"), C: Years167, sfx: "whoosh" },
  { t: at("news1", "proof", 1), C: LeanCheck, sfx: "whoosh" },
  { t: at("news1", "experts"), C: UnderReview, sfx: "pop" },
  { t: at("news1", "if"), C: Historic, sfx: "whoosh" },
  { t: segStart("news2"), C: SavesLives, sfx: "whoosh" },
  { t: at("news2", "an", 0), C: Ultrasound, sfx: "whoosh" },
  { t: at("news2", "found"), C: BarCompare, sfx: "pop" },
  { t: at("news2", "and"), C: SwedishData, sfx: "whoosh" },
  { t: segStart("news3"), C: Quickie, sfx: "pop" },
  { t: at("news3", "inkling"), C: Laptop, sfx: "whoosh" },
  { t: at("news3", "smart"), C: PrivateData, sfx: "pop" },
  { t: segStart("loop"), C: Recap, sfx: "whoosh" },
];

export const SEG_COLOR: Record<string, string> = { hook: C.green, news1: C.amber, news2: C.pink, news3: C.amber, loop: C.cyan };

