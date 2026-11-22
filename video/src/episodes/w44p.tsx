/** Week 44 – presenter format (Rune). Voice/words: scripts/episodes/2026-w44-en.* */
import React from "react";
import { interpolate, random } from "remotion";
import { C as T } from "../theme";
import { presenterForWeek } from "../presenter/characters";
import { word, seg, type Show } from "../presenter/Show";
import { P, HAND, PaperCard, Title, Source, Hand, Stamp, InkLine, useTwos, clamp } from "../presenter/kit";

export const WEEK_LABEL = "WK 44";
export const SEG_COLOR: Record<string, string> = { hook: T.amber, news1: T.amber, news2: T.cyan, news3: T.pink, loop: T.purple };
const TAG = "AI BOUNCE · WK 44";
const SRC_OAI = "OpenAI (Oct 26) · Al Jazeera · Unite.ai · claims, not yet peer-reviewed";
const SRC_GENIE = "Google DeepMind · TechCrunch (Oct 27) · research preview";
const SRC_META = "The Information via Interesting Engineering · unconfirmed by Meta";
const MONO = "DejaVu Sans Mono, monospace";

// ---------- small ink drawings ----------
const Folder: React.FC<{ label: string; c: string; show: boolean; rot: number }> = ({ label, c, show, rot }) => (
  <div style={{ width: 250, height: 190, position: "relative", transform: `rotate(${rot}deg) scale(${show ? 1 : 0})` }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 110, height: 34, background: `${c}55`, border: `4px solid ${P.ink}`, borderBottom: "none", borderRadius: "12px 12px 0 0" }} />
    <div style={{ position: "absolute", left: 0, top: 30, width: 250, height: 160, background: `${c}33`, border: `4px solid ${P.ink}`, borderRadius: "0 12px 12px 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 900, textAlign: "center", lineHeight: 1.1 }}>{label}</div>
  </div>
);
const Robot: React.FC<{ s?: number; g: number }> = ({ s = 300, g }) => {
  const blink = g % 90 < 6;
  return (
    <svg width={s} height={s * 1.25} viewBox="0 0 80 100">
      <line x1={40} y1={4} x2={40} y2={12} stroke={P.ink} strokeWidth={2} /><circle cx={40} cy={4} r={3} fill={P.red} />
      <rect x={18} y={12} width={44} height={30} rx={8} fill={P.paper2} stroke={P.ink} strokeWidth={2.4} />
      <rect x={23} y={17} width={34} height={20} rx={5} fill={`${P.teal}44`} stroke={P.ink} strokeWidth={1.6} />
      <ellipse cx={33} cy={26} rx={3} ry={blink ? 0.6 : 3} fill={P.ink} /><ellipse cx={47} cy={26} rx={3} ry={blink ? 0.6 : 3} fill={P.ink} />
      <path d="M33 32 Q40 36 47 32" stroke={P.ink} strokeWidth={1.6} fill="none" />
      <rect x={22} y={45} width={36} height={32} rx={6} fill={`${P.mustard}44`} stroke={P.ink} strokeWidth={2.4} />
      <path d={`M22 50 L10 ${62 + Math.sin(g / 8) * 3} M58 50 L70 ${56 - Math.sin(g / 8) * 4}`} stroke={P.ink} strokeWidth={3} strokeLinecap="round" />
      <path d="M30 77 V96 M50 77 V96" stroke={P.ink} strokeWidth={3.4} strokeLinecap="round" />
    </svg>
  );
};

// ---------- hook ----------
const ThreeProblems: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="w44a" rot={-1.2} tag={TAG}>
      <Title sub="claimed by AI">3 of the hardest problems</Title>
      <div style={{ display: "flex", gap: 30, justifyContent: "center", marginTop: 60 }}>
        <Folder label="MATH" c={P.mustard} show={g > 5} rot={-4} />
        <Folder label={"COMPUTER\nSCIENCE"} c={P.teal} show={g > 15} rot={2} />
        <Folder label="PHYSICS" c={P.red} show={g > 25} rot={5} />
      </div>
      <div style={{ position: "absolute", right: 30, top: 470 }}><Stamp at={60}>CLAIMED</Stamp></div>
      <Source>{SRC_OAI}</Source>
    </PaperCard>
  );
};
const SingleDay: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="w44b" rot={1} tag={TAG}>
      <Title sub="…in a single day">One announcement</Title>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <div style={{ width: 340, border: `5px solid ${P.ink}`, borderRadius: 18, background: P.paper2, overflow: "hidden", transform: `rotate(-3deg) scale(${g > 4 ? 1 : 0.4})` }}>
          <div style={{ background: P.red, color: "#fff", textAlign: "center", fontSize: 40, fontWeight: 900, padding: 8 }}>OCTOBER</div>
          <div style={{ textAlign: "center", fontSize: 170, fontWeight: 900, lineHeight: 1.1 }}>26</div>
          <div style={{ textAlign: "center", fontFamily: HAND, fontSize: 44, color: P.muted, paddingBottom: 10 }}>Monday</div>
        </div>
      </div>
    </PaperCard>
  );
};

// ---------- news 1: OpenAI claims ----------
const LocalSmoothing: React.FC = () => {
  const g = useTwos();
  const s = interpolate(g, [10, 70], [0, 1], clamp);
  const pts = [...Array(90)].map((_, i) => {
    const x = 10 + i * 9.6;
    const jag = Math.sin(i * 1.7) * 60 + Math.sin(i * 3.1) * 40;
    const smooth = Math.sin(i / 9) * 70;
    return `${x},${150 + jag * (1 - s) + smooth * s}`;
  });
  return (
    <PaperCard seed="w44c" rot={-0.8} tag={TAG}>
      <Title sub="OpenAI says its models proved it">Local smoothing conjecture</Title>
      <svg width={880} height={300} style={{ marginTop: 30 }}><polyline points={pts.join(" ")} fill="none" stroke={P.teal} strokeWidth={6} strokeLinejoin="round" /></svg>
      <Hand size={50} show={g > 40}>in every dimension</Hand>
      <Source>{SRC_OAI}</Source>
    </PaperCard>
  );
};
const AlsoCracks: React.FC = () => {
  const g = useTwos();
  const a = (g * 3) % 360;
  return (
    <PaperCard seed="w44d" rot={1.1} tag={TAG}>
      <Title sub="…would also crack">2 famous math puzzles</Title>
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", marginTop: 40 }}>
        <div style={{ textAlign: "center", transform: `scale(${g > 4 ? 1 : 0})` }}>
          <svg width={300} height={300}>
            <circle cx={150} cy={150} r={130} fill={`${P.mustard}22`} stroke={P.ink} strokeWidth={4} strokeDasharray="10 8" />
            <line x1={150 - Math.cos((a * Math.PI) / 180) * 120} y1={150 - Math.sin((a * Math.PI) / 180) * 120} x2={150 + Math.cos((a * Math.PI) / 180) * 120} y2={150 + Math.sin((a * Math.PI) / 180) * 120} stroke={P.red} strokeWidth={8} strokeLinecap="round" />
          </svg>
          <div style={{ fontSize: 44, fontWeight: 900 }}>Kakeya</div>
          <Hand size={34} color={P.muted} style={{ transformOrigin: "center" }}>turning a needle</Hand>
        </div>
        <div style={{ textAlign: "center", transform: `scale(${g > 18 ? 1 : 0})` }}>
          <svg width={300} height={300}>
            {[...Array(7)].map((_, i) => <path key={i} d={`M20 ${60 + i * 30} Q150 ${10 + i * 30 + Math.sin(g / 10 + i) * 20} 280 ${60 + i * 30}`} stroke={i % 2 ? P.teal : P.ink} strokeWidth={4} fill="none" />)}
          </svg>
          <div style={{ fontSize: 44, fontWeight: 900 }}>Stein's restriction</div>
          <Hand size={34} color={P.muted} style={{ transformOrigin: "center" }}>waves & frequencies</Hand>
        </div>
      </div>
      <Source>{SRC_OAI}</Source>
    </PaperCard>
  );
};
const MoreClaims: React.FC = () => {
  const g = useTwos();
  const rows = [
    { f: "Computer science", t: "Exponential Time Hypothesis – refuted?", c: P.teal },
    { f: "Physics", t: "Yang–Mills result – manuscript not out yet", c: P.red },
  ];
  return (
    <PaperCard seed="w44e" rot={-1} tag={TAG}>
      <Title sub="plus new claims in…">Two more fields</Title>
      <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 34 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, transform: `translateX(${g > 6 + i * 14 ? 0 : -900}px)` }}>
            <div style={{ width: 26, height: 90, background: r.c, border: `3px solid ${P.ink}` }} />
            <div><div style={{ fontSize: 46, fontWeight: 900 }}>{r.f}</div><Hand size={40} color={P.muted}>{r.t}</Hand></div>
          </div>
        ))}
      </div>
      <Source>{SRC_OAI}</Source>
    </PaperCard>
  );
};
const CheckedNotReviewed: React.FC = () => {
  const g = useTwos();
  const lines = ["theorem local_smoothing (d : ℕ) :", "  ∀ p > p_d, ‖e^{it√-Δ} f‖ ≤ …", "  := by", "  …", "  exact key_estimate d"];
  return (
    <PaperCard seed="w44f" rot={0.9} tag={TAG}>
      <Title sub="computer-checked in Lean">The math proofs</Title>
      <div style={{ marginTop: 28, padding: 22, border: `4px dashed ${P.ink}`, borderRadius: 14, fontFamily: MONO, fontSize: 30, lineHeight: 1.6, position: "relative" }}>
        <div style={{ position: "absolute", right: 12, top: 6, fontFamily: "Inter, sans-serif", fontSize: 20, color: P.muted, letterSpacing: 2 }}>ILLUSTRATION</div>
        {lines.map((l, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", whiteSpace: "pre", opacity: g > i * 8 ? 1 : 0 }}>
            <span>{l}</span><span style={{ color: P.green, fontWeight: 900, opacity: g > i * 8 + 5 ? 1 : 0 }}>✓</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", right: 20, bottom: 70 }}><Stamp at={150} size={52}>NOT REVIEWED YET</Stamp></div>
      <Source>{SRC_OAI}</Source>
    </PaperCard>
  );
};

// ---------- news 2: Genie 4 ----------
const PromptToWorld: React.FC = () => {
  const g = useTwos();
  const text = "a snowy mountain village at dusk";
  const n = Math.floor(interpolate(g, [4, 50], [0, text.length], clamp));
  const w = interpolate(g, [50, 80], [0, 1], clamp);
  return (
    <PaperCard seed="w44g" rot={-1} tag={TAG}>
      <Title sub="text prompt → explorable world">Genie 4</Title>
      <div style={{ marginTop: 26, padding: "16px 22px", border: `4px solid ${P.ink}`, borderRadius: 40, fontSize: 36, fontWeight: 700, background: P.paper2 }}>
        ✎ {text.slice(0, n)}<span style={{ opacity: g % 20 < 10 ? 1 : 0 }}>|</span>
      </div>
      <svg width={880} height={320} style={{ marginTop: 20, opacity: w }}>
        <path d="M0 300 L180 110 L280 210 L430 60 L600 230 L720 140 L880 300 Z" fill={`${P.teal}33`} stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />
        <path d="M400 92 L430 60 L462 95 M150 140 L180 110 L210 142" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" />
        {[0, 1, 2].map((i) => <g key={i} transform={`translate(${300 + i * 110} 240)`}><rect width={70} height={50} fill={P.paper2} stroke={P.ink} strokeWidth={4} /><path d="M-8 2 L35 -28 L78 2" fill={`${P.red}88`} stroke={P.ink} strokeWidth={4} /><rect x={26} y={22} width={18} height={28} fill={`${P.mustard}`} /></g>)}
        {[...Array(26)].map((_, i) => <circle key={i} cx={(random(`sn${i}`) * 880 + g * 2) % 880} cy={(random(`sy${i}`) * 300 + g * 3) % 300} r={4} fill="#fff" stroke={P.ink} strokeWidth={1} />)}
      </svg>
      <Source>{SRC_GENIE}</Source>
    </PaperCard>
  );
};
const SoundDialogue: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="w44h" rot={1} tag={TAG}>
      <Title sub="new in Genie 4">Now with sound & dialogue</Title>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", marginTop: 50 }}>
        <svg width={360} height={300} viewBox="0 0 36 30">
          <path d="M3 11 H9 L16 5 V25 L9 19 H3 Z" fill={`${P.mustard}66`} stroke={P.ink} strokeWidth={1.2} strokeLinejoin="round" />
          {[0, 1, 2].map((i) => <path key={i} d={`M${20 + i * 4} ${9 - i * 2} Q${25 + i * 5} 15 ${20 + i * 4} ${21 + i * 2}`} stroke={P.teal} strokeWidth={1.4} fill="none" strokeLinecap="round" opacity={(g / 6 + i) % 3 < 2 ? 1 : 0.2} />)}
        </svg>
        <div style={{ position: "relative", transform: `scale(${g > 14 ? 1 : 0}) rotate(3deg)` }}>
          <div style={{ padding: "24px 30px", border: `4px solid ${P.ink}`, borderRadius: "36px 36px 36px 8px", background: P.paper2, fontFamily: HAND, fontSize: 52 }}>"Welcome, traveler!"</div>
        </div>
      </div>
      <Source>{SRC_GENIE}</Source>
    </PaperCard>
  );
};
const WeatherSwitch: React.FC = () => {
  const g = useTwos();
  const k = Math.floor(g / 30) % 3;
  const icons = [
    <svg key="s" width={260} height={260} viewBox="0 0 24 24"><circle cx={12} cy={12} r={5} fill={`${P.mustard}`} stroke={P.ink} strokeWidth={1.2} />{[...Array(8)].map((_, i) => { const a = (i / 8) * Math.PI * 2; return <line key={i} x1={12 + Math.cos(a) * 7.5} y1={12 + Math.sin(a) * 7.5} x2={12 + Math.cos(a) * 10} y2={12 + Math.sin(a) * 10} stroke={P.ink} strokeWidth={1.2} strokeLinecap="round" />; })}</svg>,
    <svg key="r" width={260} height={260} viewBox="0 0 24 24"><path d="M6 14 a4 4 0 0 1 1-7.8 A5.5 5.5 0 0 1 17.5 8 a3.2 3.2 0 0 1 .5 6 Z" fill={P.paper2} stroke={P.ink} strokeWidth={1.2} />{[7, 11, 15].map((x, i) => <line key={i} x1={x} y1={16 + ((g / 3 + i * 2) % 5)} x2={x - 1} y2={18.5 + ((g / 3 + i * 2) % 5)} stroke={P.teal} strokeWidth={1.3} strokeLinecap="round" />)}</svg>,
    <svg key="w" width={260} height={260} viewBox="0 0 24 24"><path d="M6 14 a4 4 0 0 1 1-7.8 A5.5 5.5 0 0 1 17.5 8 a3.2 3.2 0 0 1 .5 6 Z" fill={P.paper2} stroke={P.ink} strokeWidth={1.2} />{[7, 11, 15].map((x, i) => <text key={i} x={x - 1.5} y={19 + ((g / 4 + i) % 4)} fontSize={4} fill={P.ink}>✻</text>)}</svg>,
  ];
  return (
    <PaperCard seed="w44i" rot={-1.1} tag={TAG}>
      <Title sub="…while you play">Change the weather</Title>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 40, marginTop: 40 }}>
        {icons[k]}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {["sunny", "rain", "snow"].map((l, i) => <div key={l} style={{ fontFamily: HAND, fontSize: 56, color: i === k ? P.teal : P.muted, textDecoration: i === k ? "underline" : "none" }}>{i === k ? "▶ " : ""}{l}</div>)}
        </div>
      </div>
      <Source>{SRC_GENIE}</Source>
    </PaperCard>
  );
};

// ---------- news 3: Meta robot ----------
const RobotMax: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="w44j" rot={1} tag={TAG}>
      <Title sub="Meta's humanoid home robot">Meet "Max"</Title>
      <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 20 }}>
        <Robot s={300} g={g} />
        <div>
          <div style={{ fontSize: 110, fontWeight: 900, lineHeight: 1 }}>3</div>
          <Hand size={48}>months to build</Hand>
          <div style={{ marginTop: 30 }}><Stamp at={30} size={42} rot={-5}>REPORTEDLY</Stamp></div>
        </div>
      </div>
      <div style={{ position: "absolute", right: 10, bottom: 50 }}><Stamp at={0} size={40} rot={4} color={P.mustard}>QUICK HIT</Stamp></div>
      <Source>{SRC_META}</Source>
    </PaperCard>
  );
};
const FiveFingers: React.FC = () => {
  const g = useTwos();
  const lift = interpolate(g, [20, 60], [0, 1], clamp);
  return (
    <PaperCard seed="w44k" rot={-1} tag={TAG}>
      <Title sub="for picking up bottles and toys">Five-fingered hands</Title>
      <svg width={880} height={420} style={{ marginTop: 20 }}>
        <g transform={`translate(330 ${40 - lift * 30})`}>
          <rect x={60} y={0} width={120} height={70} rx={14} fill={P.paper2} stroke={P.ink} strokeWidth={5} />
          {[0, 1, 2, 3].map((i) => <rect key={i} x={68 + i * 28} y={66} width={20} height={70 + (i === 0 || i === 3 ? -10 : 0)} rx={9} fill={P.paper2} stroke={P.ink} strokeWidth={5} />)}
          <rect x={20} y={40} width={22} height={70} rx={10} fill={P.paper2} stroke={P.ink} strokeWidth={5} transform="rotate(-25 31 40)" />
        </g>
        <g transform={`translate(390 ${200 - lift * 30})`}>
          <rect x={20} y={0} width={44} height={22} rx={4} fill={`${P.teal}88`} stroke={P.ink} strokeWidth={4} />
          <rect x={0} y={22} width={84} height={170} rx={20} fill={`${P.teal}44`} stroke={P.ink} strokeWidth={5} />
        </g>
        <g transform="translate(640 270)"><rect width={110} height={110} rx={8} fill={`${P.red}55`} stroke={P.ink} strokeWidth={5} /><text x={30} y={78} fontSize={64} fontWeight={900} fill={P.ink}>A</text></g>
        <line x1={40} y1={400} x2={840} y2={400} stroke={P.ink} strokeWidth={5} />
      </svg>
      <Source>{SRC_META}</Source>
    </PaperCard>
  );
};

// ---------- ending ----------
const Recap: React.FC = () => {
  const g = useTwos();
  const items = [{ l: "proofs", c: P.mustard, s: "∑" }, { l: "worlds", c: P.teal, s: "⛰" }, { l: "robots", c: P.red, s: "🤖" }];
  return (
    <PaperCard seed="w44r" rot={1} tag={TAG}>
      <Title sub="all in…">This week in AI</Title>
      <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 40 }}>
        {items.map((it, i) => (
          <div key={i} style={{ textAlign: "center", transform: `scale(${g > i * 6 ? 1 : 0}) rotate(${(random(`w44q${i}`) - 0.5) * 10}deg)` }}>
            <div style={{ width: 200, height: 200, border: `4px solid ${P.ink}`, borderRadius: 30, background: `${it.c}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 100, color: it.c, fontWeight: 900 }}>{it.s}</div>
            <Hand size={44} color={P.ink} style={{ textAlign: "center", transformOrigin: "center" }}>{it.l}</Hand>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", fontSize: 90, fontWeight: 900, marginTop: 10, opacity: g > 24 ? 1 : 0 }}>7 days</div>
    </PaperCard>
  );
};

export const SHOW: Show = {
  presenter: presenterForWeek(44),
  plates: [
    { t: 0, C: ThreeProblems, mood: "body", from: "top" },
    { t: word("hook", "in", 1), C: SingleDay, mood: "happy" },
    { t: seg("news1"), C: LocalSmoothing, mood: "curious", from: "left" },
    { t: word("news1", "which"), C: AlsoCracks, mood: "happy" },
    { t: word("news1", "plus"), C: MoreClaims, mood: "curious", from: "left" },
    { t: word("news1", "the", 1), C: CheckedNotReviewed, mood: "serious", from: "top" },
    { t: seg("news2"), C: PromptToWorld, mood: "body", from: "left" },
    { t: word("news2", "now"), C: SoundDialogue, mood: "happy" },
    { t: word("news2", "and", 1), C: WeatherSwitch, mood: "curious", from: "left" },
    { t: seg("news3"), C: RobotMax, mood: "curious", from: "top" },
    { t: word("news3", "with"), C: FiveFingers, mood: "body" },
    { t: seg("loop"), C: Recap, mood: "happy", from: "left" },
  ],
};
