/** Week 48 – presenter: WATTSON (new cast, grumpy battery). Voice/words: scripts/episodes/2026-w48-en.* */
import React from "react";
import { interpolate, random } from "remotion";
import { C as T } from "../theme";
import { CHARACTERS } from "../presenter/characters";
import { word, seg, type Show } from "../presenter/Show";
import { P, HAND, PaperCard, Title, Source, Hand, Stamp, useTwos, clamp } from "../presenter/kit";
import { ComicBurst, Scoreboard } from "../presenter/banana";

export const WEEK_LABEL = "WK 48";
export const SEG_COLOR: Record<string, string> = { hook: T.amber, news1: T.amber, news2: T.green, news3: T.cyan, loop: T.pink };
const TAG = "AI BOUNCE · WK 48";
const FPS = 60;
const rel = (s: string, w: string, start: number, nth = 0) => Math.round((word(s, w, nth) - start) * FPS);
const SRC_RH = "Lean FRO & Mathlib statement (Nov 21) · Scientific American · Nature";
const SRC_PROT = "OpenAI research post & preprint (Nov 24) · Unite.ai · claim, not peer-reviewed";
const SRC_PH = "Reuters (Nov 2026)";
const MONO = "DejaVu Sans Mono, monospace";

// ---------- hook ----------
export const Mystery: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="w48a" rot={-1.2} tag={TAG}>
      <Title sub="math's biggest mystery…">The checks are coming in</Title>
      <div style={{ position: "relative", display: "flex", justifyContent: "center", marginTop: 50 }}>
        <div style={{ fontFamily: MONO, fontSize: 110, fontWeight: 900 }}>ζ(s) = 0</div>
        <svg width={260} height={260} viewBox="0 0 24 24" style={{ position: "absolute", left: 300 + Math.sin(g / 10) * 160, top: -40 }}><circle cx={10} cy={10} r={7} fill="#ffffff66" stroke={P.ink} strokeWidth={1.6} /><line x1={15} y1={15} x2={22} y2={22} stroke={P.ink} strokeWidth={2.6} strokeLinecap="round" /></svg>
      </div>
      <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 60 }}>
        {["✓", "✓", "?"].map((c, i) => <div key={i} style={{ width: 120, height: 120, border: `5px solid ${P.ink}`, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, fontWeight: 900, color: c === "?" ? P.mustard : P.green, transform: `scale(${g > 20 + i * 12 ? 1 : 0}) rotate(${(i - 1) * 6}deg)` }}>{c}</div>)}
      </div>
    </PaperCard>
  );
};
export const H2 = word("hook", "i'm");
export const NewHost: React.FC = () => (
  <PaperCard seed="w48b" rot={1} tag={TAG}>
    <div style={{ fontSize: 44, fontWeight: 800, color: P.muted }}>Your new host:</div>
    <div style={{ fontSize: 130, fontWeight: 900, color: "#f97316", lineHeight: 1 }}>WATTSON</div>
    <Hand size={56} color={P.ink}>the grumpy battery</Hand>
    <div style={{ marginTop: 30, fontSize: 36, fontWeight: 700 }}>✦ charge meter = mood meter<br />✦ allergic to hype</div>
    <div style={{ position: "absolute", right: 20, bottom: 30 }}><Stamp at={rel("hook", "let's", H2)} size={44} rot={-6}>LET'S GET THIS OVER WITH</Stamp></div>
  </PaperCard>
);

// ---------- news 1: Riemann claim check ----------
export const N1 = seg("news1");
export const Remember: React.FC = () => (
  <PaperCard seed="w48c" rot={-0.9} tag={TAG}>
    <Title sub="claim check · from wk 47">Remember this?</Title>
    <div style={{ marginTop: 40, padding: "24px 30px", background: "#fffdf4", border: `4px solid ${P.ink}`, transform: "rotate(-2deg)", boxShadow: "6px 8px 0 #0002" }}>
      <div style={{ fontSize: 22, letterSpacing: 2, color: P.muted, fontWeight: 800 }}>AI BOUNCE · WK 47</div>
      <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1 }}>Riemann Hypothesis proof claimed with Claude</div>
    </div>
    <div style={{ position: "absolute", right: 20, bottom: 60 }}><Stamp at={20} size={48} color={P.muted} rot={8}>CLAIMED</Stamp></div>
    <Source>{SRC_RH} · Claude is made by Anthropic</Source>
  </PaperCard>
);
export const N1B = word("news1", "on");
export const LeanOK: React.FC = () => {
  const g = useTwos();
  const okAt = rel("news1", "correct", N1B);
  return (
    <PaperCard seed="w48d" rot={1} tag={TAG}>
      <Title sub="Saturday, Nov 21">Computer check: done</Title>
      <div style={{ marginTop: 30, padding: 22, border: `4px dashed ${P.ink}`, borderRadius: 14, fontFamily: MONO, fontSize: 30, lineHeight: 1.6, position: "relative" }}>
        <div style={{ position: "absolute", right: 12, top: 6, fontFamily: "Inter, sans-serif", fontSize: 20, color: P.muted, letterSpacing: 2 }}>ILLUSTRATION</div>
        {["> lake build", "  checking proof…", "  ✔ no errors"].map((l, i) => <div key={i} style={{ opacity: g > i * 30 ? 1 : 0, color: i === 2 ? P.green : P.ink, whiteSpace: "pre" }}>{l}</div>)}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}><Stamp at={okAt} size={60} color={P.green}>LEAN + MATHLIB: CORRECT ✓</Stamp></div>
      <ComicBurst text="CERTIFIED!" at={okAt + 4} x={760} y={600} color={P.green} size={0.55} />
      <Source>{SRC_RH}</Source>
    </PaperCard>
  );
};
export const N1C = word("news1", "top");
export const Reactions: React.FC = () => {
  const g = useTwos();
  const gb = rel("news1", "garbled", N1C);
  return (
    <PaperCard seed="w48e" rot={-1} tag={TAG}>
      <Title sub="what top mathematicians say">Impressed… mostly</Title>
      <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 30 }}>
        <div style={{ alignSelf: "flex-start", padding: "16px 24px", border: `4px solid ${P.ink}`, borderRadius: "30px 30px 30px 6px", background: `${P.green}33`, fontSize: 38, fontWeight: 800 }}>"a historic milestone – if correct"<div style={{ fontFamily: HAND, fontSize: 30, color: P.muted }}>— James Maynard</div></div>
        <div style={{ alignSelf: "flex-end", padding: "16px 24px", border: `4px solid ${P.ink}`, borderRadius: "30px 30px 6px 30px", background: `${P.red}33`, fontSize: 38, fontWeight: 800, transform: `scale(${g > gb ? 1 : 0})` }}>"garbled"<div style={{ fontFamily: HAND, fontSize: 30, color: P.muted }}>— Andrew Granville, on the write-up</div></div>
      </div>
      <div style={{ position: "absolute", left: 10, bottom: 50 }}><Stamp at={rel("news1", "human", N1C)} size={42} color={P.mustard} rot={-4}>HUMAN REVIEW: IN PROGRESS</Stamp></div>
      <Source>{SRC_RH}</Source>
    </PaperCard>
  );
};
export const N1D = word("news1", "fine");
export const PeerReview: React.FC = () => {
  const g = useTwos();
  const sand = interpolate(g, [0, 90], [0, 1], clamp);
  return (
    <PaperCard seed="w48f" rot={1} tag={TAG}>
      <Title sub="Wattson's excitement level">Wake me at peer review</Title>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 60, marginTop: 30 }}>
        <svg width={200} height={300} viewBox="0 0 20 30">
          <path d="M3 2 H17 M3 28 H17 M4 2 C4 10 16 12 16 15 C16 18 4 20 4 28 M16 2 C16 10 4 12 4 15 C4 18 16 20 16 28" stroke={P.ink} strokeWidth={1} fill="none" />
          <path d={`M6 ${4 + sand * 8} Q10 ${6 + sand * 8} 14 ${4 + sand * 8} L10 14 Z`} fill={P.mustard} />
          <path d={`M5 27 Q10 ${27 - sand * 8} 15 27 Z`} fill={P.mustard} />
        </svg>
        <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.6 }}>
          <div>☑ computer check</div><div style={{ color: P.muted }}>☐ human review</div><div style={{ color: P.muted }}>☐ peer review</div><div style={{ color: P.muted }}>☐ Wattson excited</div>
        </div>
      </div>
      <Source>{SRC_RH}</Source>
    </PaperCard>
  );
};

// ---------- news 2: proteins ----------
export const Protein: React.FC = () => {
  const g = useTwos();
  const pts = [...Array(90)].map((_, i) => { const a = i * 0.55; const coil = i > 20 && i < 70; const rr = coil ? 38 : 8; return `${110 + i * 7.4 + Math.cos(a) * rr},${220 + Math.sin(i / 14) * 90 + Math.sin(a) * rr + Math.sin(g / 20 + i / 10) * 6}`; });
  return (
    <PaperCard seed="w48g" rot={-1} tag={TAG}>
      <Title sub="using plain reasoning + code">GPT-6 designs proteins</Title>
      <svg width={880} height={440} style={{ marginTop: 10 }}>
        <polyline points={pts.join(" ")} fill="none" stroke={P.teal} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} strokeDasharray={3000} strokeDashoffset={interpolate(g, [0, 60], [3000, 0], clamp)} />
        <polyline points={pts.join(" ")} fill="none" stroke={P.ink} strokeWidth={3} strokeLinejoin="round" strokeDasharray={3000} strokeDashoffset={interpolate(g, [0, 60], [3000, 0], clamp)} />
      </svg>
      <div style={{ position: "absolute", right: 10, top: 110 }}><Stamp at={10} size={36} color={P.green} rot={6}>OPENAI</Stamp></div>
      <Source>{SRC_PROT}</Source>
    </PaperCard>
  );
};
export const N2B = word("news2", "in");
export const Binders: React.FC = () => {
  const g = useTwos();
  const lit = Math.round(interpolate(g, [rel("news2", "35", N2B), rel("news2", "322", N2B) + 20], [0, 35], clamp));
  const hits = new Set([...Array(322)].map((_, i) => i).sort((a, b) => random(`p${a}`) - random(`p${b}`)).slice(0, lit));
  return (
    <PaperCard seed="w48h" rot={1} tag={TAG}>
      <Title sub="wet-lab tests by partner Onava">Designs that stuck</Title>
      <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(23, 20px)", gap: 3 }}>
          {[...Array(322)].map((_, i) => <div key={i} style={{ width: 20, height: 20, borderRadius: 10, border: `2px solid ${P.ink}`, background: hits.has(i) ? P.green : "transparent" }} />)}
        </div>
        <div><div style={{ fontSize: 110, fontWeight: 900, color: P.green, lineHeight: 1 }}>{lit}</div><Hand size={40}>of 322 bound</Hand><Hand size={34} color={P.muted}>≈ 10.9%</Hand></div>
      </div>
      <Source>{SRC_PROT}</Source>
    </PaperCard>
  );
};
export const N2C = word("news2", "great");
export const Replacement: React.FC = () => (
  <PaperCard seed="w48i" rot={-1} tag={TAG}>
    <Title sub="Wattson is not amused">"Next it'll design my replacement"</Title>
    <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
      <div style={{ width: 480, height: 360, background: "#1e3a5f", border: `5px solid ${P.ink}`, padding: 20, boxSizing: "border-box", position: "relative", fontFamily: MONO, color: "#bfdbfe" }}>
        <div style={{ fontSize: 26 }}>BLUEPRINT · WATTSON 2.0</div>
        <svg width={440} height={260} viewBox="0 0 44 26"><rect x={14} y={4} width={16} height={20} rx={2} fill="none" stroke="#bfdbfe" strokeWidth={0.5} strokeDasharray="1 0.6" /><rect x={19} y={2} width={6} height={2} fill="none" stroke="#bfdbfe" strokeWidth={0.5} /><text x={16.5} y={16} fontSize={4} fill="#bfdbfe">+∞%</text></svg>
        <div style={{ position: "absolute", right: 10, bottom: 8, fontSize: 18 }}>ILLUSTRATION</div>
      </div>
    </div>
    <ComicBurst text="ZZZT!" at={rel("news2", "replacement", N2C)} x={780} y={480} color={P.mustard} size={0.6} />
  </PaperCard>
);

// ---------- news 3 ----------
export const N3 = seg("news3");
export const Timelines: React.FC = () => {
  const g = useTwos();
  const w = interpolate(g, [rel("news3", "shrinking", N3), rel("news3", "timelines", N3) + 20], [1, 0.55], clamp);
  return (
    <PaperCard seed="w48j" rot={1} tag={TAG}>
      <Title sub="big drug makers say">AI is shrinking discovery time</Title>
      <div style={{ marginTop: 60 }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: P.muted }}>early drug discovery</div>
        <div style={{ width: 860 * w, height: 80, border: `5px solid ${P.ink}`, borderRadius: 14, background: `repeating-linear-gradient(-45deg, ${P.teal}99 0 12px, ${P.teal}55 12px 24px)`, marginTop: 10 }} />
        <svg width={860} height={70}><path d={`M${860 * w + 10} 35 L 850 35`} stroke={P.red} strokeWidth={6} strokeDasharray="12 8" /><path d={`M${860 * w + 30} 20 L${860 * w + 10} 35 L${860 * w + 30} 50`} stroke={P.red} strokeWidth={6} fill="none" /></svg>
      </div>
      <div style={{ position: "absolute", right: 10, top: 110 }}><Stamp at={0} size={36} rot={6}>QUICK HIT</Stamp></div>
      <Source>{SRC_PH} · Novartis, Bristol Myers</Source>
    </PaperCard>
  );
};
export const N3B = word("news3", "but");
export const NoMiracles: React.FC = () => (
  <PaperCard seed="w48k" rot={-1} tag={TAG}>
    <Title sub="the reality check">Lilly: "don't expect miracles yet"</Title>
    <div style={{ display: "flex", justifyContent: "center", marginTop: 60 }}><Stamp at={rel("news3", "miracles", N3B)} size={90} color={P.red} rot={-6}>NO MIRACLES (YET)</Stamp></div>
    <Source>{SRC_PH} · Eli Lilly executive</Source>
  </PaperCard>
);

// ---------- ending ----------
export const ChargeMe: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="w48l" rot={1} tag={TAG}>
      <Title sub="all in…">Math · proteins · medicine</Title>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}><Scoreboard left="WEEK" right="DAYS" a={48} b={7} label="AI BOUNCE" /></div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 30, marginTop: 50 }}>
        <svg width={300} height={160} viewBox="0 0 30 16"><rect x={1} y={4} width={12} height={8} rx={2} fill="#9ca3af" stroke={P.ink} strokeWidth={0.6} /><rect x={13} y={5.5} width={4} height={1.5} fill={P.ink} /><rect x={13} y={9} width={4} height={1.5} fill={P.ink} /><path d={`M1 8 Q-5 8 -8 12`} stroke={P.ink} strokeWidth={0.8} fill="none" /></svg>
        <Hand size={60} color={P.red} show={g > rel("loop", "charge", seg("loop"))}>somebody charge me!</Hand>
      </div>
    </PaperCard>
  );
};

export const SHOW: Show = {
  presenter: CHARACTERS.wattson,
  plates: [
    { t: 0, C: Mystery, mood: "body", from: "top", toon: { id: "wattson", expr: "neutral" } },
    { t: H2, C: NewHost, mood: "body", toon: { id: "wattson", expr: "smug" } },
    { t: N1, C: Remember, mood: "body", from: "left", toon: { id: "wattson", expr: "confused" } },
    { t: N1B, C: LeanOK, mood: "body", toon: { id: "wattson", expr: "surprised" } },
    { t: N1C, C: Reactions, mood: "body", from: "left", toon: { id: "wattson", expr: "smug" } },
    { t: N1D, C: PeerReview, mood: "body", from: "top", toon: { id: "wattson", expr: "angry" } },
    { t: seg("news2"), C: Protein, mood: "body", from: "left", toon: { id: "wattson", expr: "surprised" } },
    { t: N2B, C: Binders, mood: "body", toon: { id: "wattson", expr: "happy" } },
    { t: N2C, C: Replacement, mood: "body", from: "top", toon: { id: "wattson", expr: "angry" } },
    { t: N3, C: Timelines, mood: "body", from: "left", toon: { id: "wattson", expr: "neutral" } },
    { t: N3B, C: NoMiracles, mood: "body", toon: { id: "wattson", expr: "smug" } },
    { t: seg("loop"), C: ChargeMe, mood: "body", from: "left", toon: { id: "wattson", expr: "sad" } },
  ],
};
