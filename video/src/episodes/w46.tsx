import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, random } from "remotion";
import { C, FONT, MONO } from "../theme";
import { Scramble, GlitchText, StaggerText } from "../Effects";
import { useSpring, clamp, Stage, Glow, Chip } from "../ui";
import { at, segStart } from "../timing";
import type { Beat } from "../types";

// ---------- shared icons ----------
const Doctor: React.FC<{ size?: number; color?: string; dim?: number }> = ({ size = 120, color = C.muted, dim = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ opacity: 1 - dim * 0.65 }}>
    <circle cx={12} cy={7} r={4.2} fill={color} />
    <path d="M3.5 22 C3.5 15.5 7.5 13 12 13 C16.5 13 20.5 15.5 20.5 22 Z" fill={color} />
    <path d="M9 14.5 V18.5 A2 2 0 0 0 13 18.5" stroke={C.bg} strokeWidth={1.2} fill="none" />
    <circle cx={13} cy={18.6} r={0.9} fill={C.bg} />
  </svg>
);

const AIChip: React.FC<{ size?: number; color?: string }> = ({ size = 220, color = C.cyan }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ filter: `drop-shadow(0 0 24px ${color})` }}>
    {[5, 9.5, 14.5, 19].map((p) => (
      <g key={p} stroke={color} strokeWidth={1.1} strokeLinecap="round">
        <line x1={p} y1={1.5} x2={p} y2={4.5} /><line x1={p} y1={19.5} x2={p} y2={22.5} />
        <line x1={1.5} y1={p} x2={4.5} y2={p} /><line x1={19.5} y1={p} x2={22.5} y2={p} />
      </g>
    ))}
    <rect x={4.5} y={4.5} width={15} height={15} rx={3} fill={`${color}22`} stroke={color} strokeWidth={1.3} />
    <text x={12} y={14.6} textAnchor="middle" fontSize={7} fontWeight={900} fill={color} fontFamily={FONT}>AI</text>
  </svg>
);

const BrainIcon: React.FC<{ size?: number; color?: string; draw?: number }> = ({ size = 360, color = C.pink, draw = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 20px ${color})` }}>
    <g fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeDasharray={600} strokeDashoffset={600 * (1 - draw)}>
      <path d="M50 15 C38 8 22 14 22 28 C12 32 10 46 18 52 C12 62 20 76 32 74 C36 86 50 88 50 78" />
      <path d="M50 15 C62 8 78 14 78 28 C88 32 90 46 82 52 C88 62 80 76 68 74 C64 86 50 88 50 78" />
      <path d="M50 15 V78 M30 34 C36 36 38 42 36 48 M70 34 C64 36 62 42 64 48 M28 60 C34 58 40 62 40 66 M72 60 C66 58 60 62 60 66" />
    </g>
  </svg>
);

const Lock: React.FC<{ size?: number; color?: string; open?: number }> = ({ size = 160, color = C.cyan, open = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d={`M7.5 11 V8 a4.5 4.5 0 0 1 9 0 V${11 - open * 3}`} stroke={color} strokeWidth={2} fill="none" />
    <rect x={5} y={11} width={14} height={10} rx={2.2} fill={color} />
    <circle cx={12} cy={15.6} r={1.6} fill={C.bg} />
  </svg>
);

// ---------- HOOK ----------
export const EightExperts: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ai = spring({ frame: f - 40, fps, config: { damping: 9 } });
  const dim = interpolate(f, [55, 80], [0, 1], clamp);
  return (
    <Stage>
      <div style={{ fontSize: 46, fontWeight: 800, color: C.muted, letterSpacing: 6 }}>BRAIN TUMOR EXPERTS</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 150px)", gap: 18, marginTop: 30 }}>
        {[...Array(8)].map((_, i) => {
          const s = spring({ frame: f - i * 3, fps, config: { damping: 11 } });
          return <div key={i} style={{ transform: `scale(${s})`, display: "flex", justifyContent: "center" }}><Doctor size={140} color={C.text} dim={dim} /></div>;
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 40 }}>
        <div style={{ fontSize: 110, fontWeight: 900, color: C.pink, opacity: ai }}>VS</div>
        <div style={{ transform: `scale(${ai}) rotate(${(1 - ai) * -90}deg)` }}><AIChip size={230} /></div>
      </div>
      <div style={{ marginTop: 20, opacity: dim }}><Chip color={C.green}>AI WINS</Chip></div>
    </Stage>
  );
};

export const OnlyTheStart: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useSpring(0, 9);
  return (
    <Stage>
      <div style={{ fontSize: 60, fontWeight: 800, color: C.muted, opacity: s }}>…and that's only</div>
      <div style={{ fontSize: 150, fontWeight: 900, lineHeight: 1, marginTop: 10 }}>
        <Glow color={C.purple}><StaggerText text="THE START" delay={6} style={{ color: C.text }} /></Glow>
      </div>
      <div style={{ display: "flex", gap: 30, marginTop: 70 }}>
        {[C.pink, C.cyan, C.green].map((c, i) => {
          const p = spring({ frame: f - 25 - i * 8, fps, config: { damping: 10 } });
          return <div key={i} style={{ width: 200, height: 200, borderRadius: 40, border: `5px solid ${c}`, background: `${c}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 110, fontWeight: 900, color: c, transform: `translateY(${(1 - p) * 300}px) rotate(${(1 - p) * 40}deg)`, opacity: p }}>{i + 1}</div>;
        })}
      </div>
    </Stage>
  );
};

// ---------- NEWS 1: brain tumors ----------
export const TumorTitle: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(0);
  const draw = interpolate(f, [0, 60], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <Stage>
      <Chip color={C.amber}>MAYO CLINIC · AMP 2026</Chip>
      <div style={{ position: "relative", marginTop: 30 }}>
        <BrainIcon size={380} draw={draw} />
        <div style={{ position: "absolute", left: 220, top: 120, width: 60, height: 60, borderRadius: 30, background: C.amber, opacity: 0.4 + 0.4 * Math.sin(f / 6), boxShadow: `0 0 40px ${C.amber}` }} />
      </div>
      <div style={{ fontSize: 100, fontWeight: 900, transform: `scale(${s})` }}>
        AI <span style={{ color: C.muted }}>vs</span> <span style={{ color: C.pink }}><Scramble text="TUMORS" delay={6} /></span>
      </div>
    </Stage>
  );
};

export const CaseGrid: React.FC = () => {
  const f = useCurrentFrame();
  const shown = Math.floor(interpolate(f, [0, 70], [0, 100], clamp));
  return (
    <Stage>
      <div style={{ fontSize: 130, fontWeight: 900, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}><Glow color={C.cyan}>{shown}</Glow></div>
      <div style={{ fontSize: 44, fontWeight: 800, color: C.muted, letterSpacing: 4, marginBottom: 30 }}>REAL BRAIN TUMOR CASES</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 46px)", gap: 8 }}>
        {[...Array(100)].map((_, i) => {
          const on = i < shown;
          const hue = [C.pink, C.purple, C.amber, C.cyan][Math.floor(random(`c${i}`) * 4)];
          return <div key={i} style={{ width: 46, height: 46, borderRadius: 10, background: on ? `${hue}aa` : "#ffffff10", transform: `scale(${on ? 1 : 0.6})`, boxShadow: on ? `0 0 12px ${hue}66` : undefined }} />;
        })}
      </div>
      <div style={{ marginTop: 34 }}><Chip color={C.purple} delay={40}>52 POSSIBLE TUMOR TYPES</Chip></div>
    </Stage>
  );
};

export const TissueScan: React.FC = () => {
  const f = useCurrentFrame();
  const lx = 380 + Math.sin(f / 18) * 220;
  const ly = 300 + Math.cos(f / 23) * 140;
  return (
    <Stage>
      <div style={{ position: "relative", width: 900, height: 620, borderRadius: 30, overflow: "hidden", border: `3px solid ${C.bg2}`, background: "#FCE7F3" }}>
        <svg width={900} height={620}>
          {[...Array(140)].map((_, i) => (
            <circle key={i} cx={random(`tx${i}`) * 900} cy={random(`ty${i}`) * 620} r={8 + random(`tr${i}`) * 22}
              fill={random(`tc${i}`) > 0.55 ? "#7C3AED" : "#DB2777"} opacity={0.25 + random(`to${i}`) * 0.4} />
          ))}
        </svg>
        <div style={{ position: "absolute", left: lx - 130, top: ly - 130, width: 260, height: 260, borderRadius: 130, border: `10px solid ${C.cyan}`, boxShadow: `0 0 40px ${C.cyan}, inset 0 0 60px ${C.cyan}55`, background: "#ffffff22" }} />
        <div style={{ position: "absolute", left: lx + 100, top: ly - 170, padding: "8px 18px", borderRadius: 10, background: C.bg, color: C.cyan, fontSize: 28, fontWeight: 900, fontFamily: MONO }}>
          ANALYZING…
        </div>
      </div>
      <div style={{ marginTop: 34 }}><Chip color={C.pink}>TISSUE IMAGES</Chip></div>
    </Stage>
  );
};

export const Score97: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [4, 60], [0, 0.97], { ...clamp, easing: Easing.out(Easing.cubic) });
  const R = 260;
  const circ = 2 * Math.PI * R;
  return (
    <Stage>
      <div style={{ position: "relative", width: 640, height: 640 }}>
        <svg width={640} height={640} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={320} cy={320} r={R} stroke="#ffffff14" strokeWidth={44} fill="none" />
          <circle cx={320} cy={320} r={R} stroke={C.green} strokeWidth={44} fill="none" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={circ * (1 - p)} style={{ filter: `drop-shadow(0 0 20px ${C.green})` }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 190, fontWeight: 900, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}><Glow color={C.green}>{Math.round(p * 100)}%</Glow></div>
          <div style={{ fontSize: 40, fontWeight: 800, color: C.muted, letterSpacing: 4 }}>ACCURACY</div>
        </div>
      </div>
    </Stage>
  );
};

export const Leaderboard: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const top = spring({ frame: f, fps, config: { damping: 10 } });
  return (
    <Stage>
      <div style={{ display: "flex", alignItems: "center", gap: 30, padding: "24px 40px", borderRadius: 30, border: `4px solid ${C.amber}`, background: `${C.amber}1a`, transform: `scale(${top})`, boxShadow: `0 0 50px ${C.amber}55` }}>
        <div style={{ fontSize: 90, fontWeight: 900, color: C.amber }}>#1</div>
        <AIChip size={140} color={C.amber} />
        <div style={{ fontSize: 70, fontWeight: 900 }}>AI · 97%</div>
      </div>
      <div style={{ fontSize: 40, fontWeight: 800, color: C.muted, letterSpacing: 3, margin: "50px 0 24px" }}>BEHIND IT: ALL 8 SPECIALISTS</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 160px)", gap: 20 }}>
        {[...Array(8)].map((_, i) => {
          const s = spring({ frame: f - 14 - i * 4, fps, config: { damping: 14 } });
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `translateY(${(1 - s) * 120}px)`, opacity: s }}>
              <Doctor size={110} color={C.muted} />
              <div style={{ fontSize: 30, fontWeight: 800, color: C.muted }}>Expert</div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

export const TeamUp: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 12 } });
  const b = spring({ frame: f - 10, fps, config: { damping: 12 } });
  const arrow = interpolate(f, [25, 55], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  return (
    <Stage>
      <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
        <div style={{ transform: `translateX(${(1 - a) * -300}px)`, opacity: a }}><Doctor size={240} color={C.text} /></div>
        <div style={{ fontSize: 120, fontWeight: 900, color: C.muted, opacity: b }}>+</div>
        <div style={{ transform: `translateX(${(1 - b) * 300}px)`, opacity: b }}><AIChip size={220} /></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 50 }}>
        <svg width={120} height={140} viewBox="0 0 24 28" style={{ transform: `translateY(${(1 - arrow) * 60}px)`, opacity: arrow, filter: `drop-shadow(0 0 16px ${C.green})` }}>
          <path d="M12 2 L22 13 H15.5 V26 H8.5 V13 H2 Z" fill={C.green} />
        </svg>
        <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 1.05, opacity: arrow }}>DOCTORS<br /><span style={{ color: C.green }}>MORE ACCURATE</span></div>
      </div>
    </Stage>
  );
};

// ---------- NEWS 2: Signal proof ----------
export const SignalTitle: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(0, 10);
  return (
    <Stage>
      <Chip color={C.cyan}>GOOGLE DEEPMIND</Chip>
      <div style={{ fontSize: 82, fontWeight: 900, marginTop: 24 }}><Scramble text="ALPHAPROOF CODE" speed={1.3} /></div>
      <div style={{ position: "relative", marginTop: 50, transform: `scale(${s})` }}>
        <div style={{ width: 520, padding: "34px 40px", borderRadius: "50px 50px 50px 12px", background: "#3A76F0", fontSize: 50, fontWeight: 800, boxShadow: "0 0 60px #3A76F088" }}>
          Private chat 💬
          <div style={{ fontSize: 32, fontWeight: 700, opacity: 0.8, marginTop: 8 }}>end-to-end encrypted</div>
        </div>
        <div style={{ position: "absolute", right: -60, top: -60, transform: `rotate(${Math.sin(f / 10) * 8}deg)` }}><Lock size={150} color={C.amber} /></div>
      </div>
      <div style={{ marginTop: 40, fontSize: 44, fontWeight: 800, color: C.muted }}>Signal's encryption code</div>
    </Stage>
  );
};

const PROOF_LINES = [
  "lemma ratchet_secrecy :",
  "  ∀ k, derive k ≠ leak k",
  "theorem session_auth :",
  "  verify (sign m sk) pk",
  "lemma no_key_reuse :",
  "  nonce n₁ ≠ nonce n₂",
  "theorem forward_secrecy :",
  "  compromise t → safe (< t)",
  "lemma decrypt_encrypt :",
  "  dec k (enc k m) = m",
];
export const ProofStream: React.FC = () => {
  const f = useCurrentFrame();
  const scroll = f * 3.2;
  return (
    <Stage>
      <div style={{ width: 920, height: 620, borderRadius: 28, background: "#020617", border: `2px solid ${C.bg2}`, overflow: "hidden", position: "relative", boxShadow: `0 0 60px ${C.cyan}22` }}>
        <div style={{ display: "flex", gap: 12, padding: "20px 28px", background: C.bg2, alignItems: "center", position: "relative", zIndex: 2 }}>
          {[C.red, C.amber, C.green].map((c) => <div key={c} style={{ width: 20, height: 20, borderRadius: 10, background: c }} />)}
          <div style={{ marginLeft: 18, fontSize: 28, color: C.muted, fontFamily: MONO }}>libsignal.lean</div>
          <div style={{ marginLeft: "auto", fontSize: 22, color: C.muted, fontWeight: 700, letterSpacing: 2 }}>ILLUSTRATION</div>
        </div>
        <div style={{ position: "absolute", top: 80 - (scroll % (PROOF_LINES.length * 56)), left: 0, right: 0, padding: "0 32px", fontFamily: MONO, fontSize: 32, lineHeight: "56px" }}>
          {[...PROOF_LINES, ...PROOF_LINES, ...PROOF_LINES].map((l, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", whiteSpace: "pre", color: l.startsWith(" ") ? C.text : C.purple }}>
              <span>{l}</span><span style={{ color: C.green, fontWeight: 900 }}>✓</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 34 }}><Chip color={C.green}>MATHEMATICALLY CHECKED</Chip></div>
    </Stage>
  );
};

export const MillionsFourWeeks: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Stage>
      <div style={{ fontSize: 140, fontWeight: 900, lineHeight: 1 }}><Glow color={C.cyan}><GlitchText seed="mil">MILLIONS</GlitchText></Glow></div>
      <div style={{ fontSize: 46, fontWeight: 800, color: C.muted, letterSpacing: 4, marginTop: 10 }}>OF LINES OF PROOF</div>
      <div style={{ display: "flex", gap: 24, marginTop: 70 }}>
        {[1, 2, 3, 4].map((w, i) => {
          const s = spring({ frame: f - 15 - i * 9, fps, config: { damping: 10 } });
          return (
            <div key={w} style={{ width: 180, height: 200, borderRadius: 24, background: C.bg2, border: `3px solid ${C.purple}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `rotateY(${(1 - s) * 90}deg)`, opacity: s }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: C.muted }}>WEEK</div>
              <div style={{ fontSize: 90, fontWeight: 900 }}>{w}</div>
              <div style={{ fontSize: 40, color: C.green, fontWeight: 900 }}>✓</div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

const Bug: React.FC<{ x: number; y: number; caught: number; r: number }> = ({ x, y, caught, r }) => (
  <div style={{ position: "absolute", left: x - 90, top: y - 90, width: 180, height: 180 }}>
    <svg width={180} height={180} viewBox="0 0 24 24" style={{ transform: `rotate(${r}deg)` }}>
      <g stroke={caught ? C.muted : C.red} strokeWidth={1.4} strokeLinecap="round">
        <line x1={7} y1={9} x2={3} y2={7} /><line x1={17} y1={9} x2={21} y2={7} />
        <line x1={6.5} y1={13} x2={2.5} y2={13} /><line x1={17.5} y1={13} x2={21.5} y2={13} />
        <line x1={7} y1={17} x2={3} y2={19} /><line x1={17} y1={17} x2={21} y2={19} />
      </g>
      <ellipse cx={12} cy={13.5} rx={5.2} ry={6.5} fill={caught ? C.muted : C.red} />
      <circle cx={12} cy={6.5} r={2.8} fill={caught ? C.muted : C.red} />
    </svg>
    {caught > 0 && (
      <div style={{ position: "absolute", inset: -20, borderRadius: "50%", border: `8px solid ${C.green}`, transform: `scale(${caught})`, boxShadow: `0 0 30px ${C.green}` }} />
    )}
  </div>
);
export const BugsCaught: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c1 = f > 40 ? spring({ frame: f - 40, fps, config: { damping: 9 } }) : 0;
  const c2 = f > 75 ? spring({ frame: f - 75, fps, config: { damping: 9 } }) : 0;
  const x1 = c1 ? 330 : interpolate(f, [0, 40], [-100, 330]);
  const x2 = c2 ? 750 : interpolate(f, [0, 75], [1180, 750]);
  return (
    <Stage>
      <div style={{ fontSize: 56, fontWeight: 900, color: C.muted, letterSpacing: 2 }}>2 OLD BUGS SLIPPED IN…</div>
      <div style={{ position: "relative", width: 1080, height: 420 }}>
        <Bug x={x1} y={210} caught={c1} r={c1 ? 0 : Math.sin(f / 3) * 12 + 90} />
        <Bug x={x2} y={210} caught={c2} r={c2 ? 0 : Math.sin(f / 3) * 12 - 90} />
      </div>
      <div style={{ fontSize: 110, fontWeight: 900, opacity: c2 ? 1 : 0, transform: `scale(${c2 || 0.5})` }}>
        <Glow color={C.green}><span style={{ color: C.green }}>CAUGHT BOTH</span></Glow>
      </div>
    </Stage>
  );
};

// ---------- NEWS 3: AlphaGenome 2 ----------
export const QuickHit: React.FC = () => {
  const s = useSpring(0, 6, 200);
  return (
    <Stage>
      <svg width={260} height={260} viewBox="0 0 24 24" style={{ transform: `scale(${s}) rotate(${(1 - s) * 30}deg)`, filter: `drop-shadow(0 0 40px ${C.amber})` }}>
        <path d="M13 2 L4 14 H11 L10 22 L20 9 H13 Z" fill={C.amber} />
      </svg>
      <div style={{ fontSize: 140, fontWeight: 900, letterSpacing: -2, transform: `scale(${2.2 - 1.2 * s})`, opacity: s }}><GlitchText seed="qh46">QUICK HIT</GlitchText></div>
    </Stage>
  );
};

export const Helix: React.FC = () => {
  const f = useCurrentFrame();
  const N = 22;
  return (
    <Stage>
      <Chip color={C.cyan}>ALPHAGENOME 2</Chip>
      <svg width={900} height={560} style={{ marginTop: 20 }}>
        {[...Array(N)].map((_, i) => {
          const y = 20 + i * 24;
          const ph = i * 0.55 + f / 12;
          const x1 = 450 + Math.sin(ph) * 260;
          const x2 = 450 - Math.sin(ph) * 260;
          const front = Math.cos(ph) > 0;
          const hit = i === 7 || i === 15;
          return (
            <g key={i}>
              <line x1={x1} y1={y} x2={x2} y2={y} stroke={hit ? C.amber : "#ffffff30"} strokeWidth={hit ? 7 : 4} />
              <circle cx={x1} cy={y} r={front ? 13 : 8} fill={C.cyan} opacity={front ? 1 : 0.5} />
              <circle cx={x2} cy={y} r={front ? 8 : 13} fill={C.purple} opacity={front ? 0.5 : 1} />
            </g>
          );
        })}
      </svg>
      <div style={{ fontSize: 56, fontWeight: 900 }}>Reads DNA <span style={{ color: C.cyan }}>cell type by cell type</span></div>
    </Stage>
  );
};

export const TwiceAsMany: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g1 = spring({ frame: f - 4, fps, config: { damping: 14 } });
  const g2 = spring({ frame: f - 24, fps, config: { damping: 12 } });
  const W = 760;
  const Row: React.FC<{ label: string; v: number; g: number; color: string; tag: string }> = ({ label, v, g, color, tag }) => (
    <div style={{ marginBottom: 46 }}>
      <div style={{ fontSize: 40, fontWeight: 800, marginBottom: 12 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: W * v * Math.min(g, 1.05), height: 90, borderRadius: 20, background: `linear-gradient(90deg, ${color}66, ${color})`, boxShadow: `0 0 30px ${color}66` }} />
        <div style={{ fontSize: 60, fontWeight: 900, color, opacity: g }}>{tag}</div>
      </div>
    </div>
  );
  return (
    <Stage>
      <div style={{ fontSize: 44, fontWeight: 800, color: C.muted, letterSpacing: 3, marginBottom: 40 }}>GENE-CHANGING VARIANTS FOUND</div>
      <div style={{ width: 960 }}>
        <Row label="Previous best model" v={0.4} g={g1} color={C.muted} tag="1×" />
        <Row label="AlphaGenome 2" v={0.78} g={g2} color={C.green} tag="≈2×" />
      </div>
      <div style={{ marginTop: 10 }}><Chip color={C.amber} delay={45}>CLUES TO WHERE DISEASES BEGIN</Chip></div>
    </Stage>
  );
};

// ---------- LOOP ----------
export const Recap46: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const big = spring({ frame: f - 28, fps, config: { damping: 8 } });
  const items: { c: string; l: string; icon: React.ReactNode }[] = [
    { c: C.pink, l: "Tumors", icon: <BrainIcon size={150} color={C.pink} /> },
    { c: C.cyan, l: "Privacy", icon: <Lock size={120} color={C.cyan} /> },
    { c: C.green, l: "DNA", icon: <span style={{ fontSize: 100, fontWeight: 900, color: C.green, fontFamily: MONO }}>🧬</span> },
  ];
  return (
    <Stage>
      <div style={{ display: "flex", gap: 46 }}>
        {items.map((it, i) => {
          const s = spring({ frame: f - i * 7, fps, config: { damping: 10 } });
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `translateY(${(1 - s) * 200}px)`, opacity: s }}>
              <div style={{ width: 220, height: 220, borderRadius: 50, border: `5px solid ${it.c}`, background: `${it.c}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>{it.icon}</div>
              <div style={{ fontSize: 40, fontWeight: 800, marginTop: 16 }}>{it.l}</div>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 170, fontWeight: 900, marginTop: 60, transform: `scale(${big})` }}>
        <Glow color={C.cyan}>7</Glow> <StaggerText text="DAYS" delay={30} style={{ color: C.cyan }} />
      </div>
    </Stage>
  );
};

export const LoopOut46: React.FC = () => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 60], [0.5, 1.2], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <Stage>
      <div style={{ display: "flex", alignItems: "center", gap: 30, transform: `scale(${z})` }}>
        <AIChip size={240} />
        <div style={{ fontSize: 110, fontWeight: 900, color: C.pink }}>VS</div>
        <div style={{ fontSize: 200, fontWeight: 900 }}><Glow color={C.text}>8</Glow></div>
      </div>
    </Stage>
  );
};

// ---------- beat list ----------
export const WEEK_LABEL = "WK 46";
export const SEG_COLOR: Record<string, string> = { hook: C.cyan, news1: C.pink, news2: C.cyan, news3: C.green, loop: C.purple };

export const BEATS: Beat[] = [
  { t: 0, C: EightExperts },
  { t: at("hook", "and"), C: OnlyTheStart, sfx: "whoosh" },
  { t: segStart("news1"), C: TumorTitle, sfx: "whoosh" },
  { t: at("news1", "100"), C: CaseGrid, sfx: "whoosh" },
  { t: at("news1", "using"), C: TissueScan, sfx: "whoosh" },
  { t: at("news1", "it"), C: Score97, sfx: "pop" },
  { t: at("news1", "beating"), C: Leaderboard, sfx: "whoosh" },
  { t: at("news1", "even"), C: TeamUp, sfx: "whoosh" },
  { t: segStart("news2"), C: SignalTitle, sfx: "whoosh" },
  { t: at("news2", "mathematically"), C: ProofStream, sfx: "whoosh" },
  { t: at("news2", "millions"), C: MillionsFourWeeks, sfx: "pop" },
  { t: at("news2", "when"), C: BugsCaught, sfx: "whoosh" },
  { t: segStart("news3"), C: QuickHit, sfx: "pop" },
  { t: at("news3", "alphagenome"), C: Helix, sfx: "whoosh" },
  { t: at("news3", "finding"), C: TwiceAsMany, sfx: "pop" },
  { t: segStart("loop"), C: Recap46, sfx: "whoosh" },
  { t: at("loop", "so"), C: LoopOut46, sfx: "whoosh" },
];
