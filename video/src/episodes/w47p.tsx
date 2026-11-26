/** Week 47 – presenter format (Cara). Voice/words: scripts/episodes/2026-w47-en.* */
import React from "react";
import { random } from "remotion";
import { C as T } from "../theme";
import { presenterForWeek } from "../presenter/characters";
import { word, seg, type Show } from "../presenter/Show";
import { P, HAND, PaperCard, Title, Source, Hand, Stamp, InkLine, InkChip, InkHeart, InkLaptop, InkLock, Gauge, BarPair, ecgPath, useTwos, clamp } from "../presenter/kit";
import { interpolate } from "remotion";

export const WEEK_LABEL = "WK 47";
export const SEG_COLOR: Record<string, string> = { hook: T.green, news1: T.amber, news2: T.pink, news3: T.amber, loop: T.cyan };
const TAG = "AI BOUNCE · WK 47";
const SRC_RH = "Alpöge's note via IBM Think, Unite.ai · claim, under review";
const SRC_HEART = "Journal of Cardiac Failure (press release) · ScienceDaily";
const SRC_INK = "Thinking Machines Lab";

// ---------- hook ----------
export const MillionProblem: React.FC = () => {
  const g = useTwos();
  const n = Math.round(interpolate(g, [5, 45], [0, 1_000_000], clamp));
  return (
    <PaperCard seed="mil" rot={-1.2} tag={TAG}>
      <Title sub="a math problem worth…">Solved by AI?</Title>
      <div style={{ fontSize: 150, fontWeight: 900, color: P.green, marginTop: 40, fontVariantNumeric: "tabular-nums" }}>${n.toLocaleString("en-US")}</div>
      <InkLine d="M10 30 Q220 5 440 30 T870 30" w={880} h={60} from={40} to={70} />
      <div style={{ position: "absolute", right: 30, top: 380 }}><Stamp at={50} color={P.red}>?!</Stamp></div>
      <Source>Clay Mathematics Institute · Millennium Prize Problems</Source>
    </PaperCard>
  );
};
export const NotEvenBiggest: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="big" rot={1} tag={TAG}>
      <Title sub="…and that's not even the biggest story">This week in AI</Title>
      <div style={{ display: "flex", gap: 36, justifyContent: "center", marginTop: 70 }}>
        {[P.teal, P.red, P.mustard].map((c, i) => (
          <div key={i} style={{ width: 230, height: 230, background: `${c}33`, border: `4px solid ${P.ink}`, transform: `rotate(${(i - 1) * 6}deg) scale(${g > 6 + i * 8 ? 1 : 0})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontSize: 140, color: c, boxShadow: "6px 8px 0 #0002" }}>{i + 1}</div>
        ))}
      </div>
    </PaperCard>
  );
};

// ---------- news 1: Riemann ----------
export const Riemann: React.FC = () => (
  <PaperCard seed="rh" rot={-0.8} tag={TAG}>
    <Title sub="Thursday, Nov 20">The Riemann Hypothesis</Title>
    <div style={{ fontSize: 64, fontFamily: "DejaVu Sans Mono, monospace", marginTop: 50, textAlign: "center" }}>ζ(s) = 0 ⇒ Re(s) = ½</div>
    <div style={{ display: "flex", gap: 30, justifyContent: "center", alignItems: "center", marginTop: 60 }}>
      <div style={{ padding: "14px 28px", border: `4px solid ${P.ink}`, borderRadius: 40, fontSize: 40, fontWeight: 800 }}>Levent Alpöge</div>
      <Hand size={80} color={P.red}>+</Hand>
      <div style={{ padding: "14px 28px", border: `4px solid ${P.teal}`, borderRadius: 40, fontSize: 40, fontWeight: 800, color: P.teal }}>Claude (AI)</div>
    </div>
    <Hand size={46} style={{ textAlign: "center", marginTop: 40 }}>claims a proof</Hand>
    <Source>{SRC_RH}</Source>
  </PaperCard>
);
export const Years167: React.FC = () => {
  const g = useTwos();
  const p = interpolate(g, [5, 60], [0, 1], clamp);
  const yr = Math.round(1859 + p * 167);
  return (
    <PaperCard seed="167" rot={1.2} tag={TAG}>
      <Title sub="unsolved mystery">167 years</Title>
      <svg width={880} height={260} style={{ marginTop: 80 }}>
        <line x1={20} y1={120} x2={860} y2={120} stroke={P.ink} strokeWidth={6} strokeLinecap="round" />
        <line x1={20} y1={120} x2={20 + 840 * p} y2={120} stroke={P.mustard} strokeWidth={14} strokeLinecap="round" />
        <circle cx={20 + 840 * p} cy={120} r={22} fill={P.mustard} stroke={P.ink} strokeWidth={4} />
        <text x={20} y={190} fontSize={40} fontFamily={HAND} fill={P.ink}>1859</text>
        <text x={760} y={190} fontSize={40} fontFamily={HAND} fill={P.ink}>2026</text>
        <text x={Math.min(700, 20 + 840 * p - 50)} y={70} fontSize={56} fontWeight={900} fill={P.ink}>{yr}</text>
      </svg>
      <Source>Riemann, 1859 · {SRC_RH}</Source>
    </PaperCard>
  );
};
export const ProofLines: React.FC = () => {
  const g = useTwos();
  const lines = ["theorem riemann_hypothesis :", "  ∀ s, ζ s = 0 → …", "  s.re = 1/2 := by", "  …", "  exact proof"];
  return (
    <PaperCard seed="lean" rot={-1} tag={TAG}>
      <Title sub="computers check every step">Written in Lean</Title>
      <div style={{ marginTop: 34, padding: 26, border: `4px dashed ${P.ink}`, borderRadius: 14, fontFamily: "DejaVu Sans Mono, monospace", fontSize: 34, lineHeight: 1.7, position: "relative" }}>
        <div style={{ position: "absolute", right: 12, top: 8, fontFamily: FONTS, fontSize: 20, color: P.muted, letterSpacing: 2 }}>ILLUSTRATION</div>
        {lines.map((l, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", opacity: g > i * 8 ? 1 : 0, whiteSpace: "pre" }}>
            <span>{l}</span><span style={{ color: P.green, fontWeight: 900, opacity: g > i * 8 + 6 ? 1 : 0 }}>✓</span>
          </div>
        ))}
      </div>
      <Source>{SRC_RH}</Source>
    </PaperCard>
  );
};
const FONTS = "Inter, sans-serif";
export const UnderReview: React.FC = () => (
  <PaperCard seed="rev" rot={0.8} tag={TAG}>
    <Title sub="experts are checking it now">Not verified yet</Title>
    <div style={{ display: "flex", justifyContent: "center", marginTop: 110 }}><Stamp at={4} size={96}>UNDER REVIEW</Stamp></div>
    <Source>{SRC_RH}</Source>
  </PaperCard>
);
export const Historic: React.FC = () => (
  <PaperCard seed="his" rot={-1.3} tag={TAG}>
    <Title sub="if it holds…">It would be historic</Title>
    <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 70, justifyContent: "center" }}>
      <svg width={260} height={260} viewBox="0 0 24 24"><path d="M7 3h10v3a5 5 0 0 1-10 0V3Z M5 4H3v2a3 3 0 0 0 4 3 M19 4h2v2a3 3 0 0 1-4 3 M12 11v5 M8 21h8 M9 16h6v5H9z" fill={`${P.mustard}55`} stroke={P.ink} strokeWidth={1.3} strokeLinejoin="round" /></svg>
      <div><div style={{ fontSize: 110, fontWeight: 900, color: P.green }}>$1M</div><Hand size={46}>Millennium Prize</Hand></div>
    </div>
    <Source>Clay Mathematics Institute · {SRC_RH}</Source>
  </PaperCard>
);

// ---------- news 2: heart ----------
export const SavesLives: React.FC = () => {
  const g = useTwos();
  const beat = 1 + (g % 45 < 6 ? 0.08 : 0);
  return (
    <PaperCard seed="life" rot={1} tag={TAG}>
      <Title sub="AI + one routine heart ultrasound">What saves lives</Title>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}><InkHeart s={260} beat={beat} /></div>
      <InkLine d={ecgPath(880, 160, 3)} w={880} h={160} color={P.red} from={0} to={60} width={6} len={2600} />
      <Source>{SRC_HEART}</Source>
    </PaperCard>
  );
};
export const HeartBars: React.FC = () => (
  <PaperCard seed="bars" rot={-0.8} tag={TAG}>
    <Title sub="hidden heart failure (HFpEF) found">Patients found</Title>
    <div style={{ marginTop: 10 }}><BarPair a={48} b={78} la="without AI" lb="with AI" H={330} /></div>
    <Source>{SRC_HEART}</Source>
  </PaperCard>
);
export const SwedishData: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="se" rot={1.2} tag={TAG}>
      <Title sub="trained on Swedish patient data">Sudden cardiac death</Title>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 30 }}>
        <svg width={150} height={94} viewBox="0 0 16 10" style={{ border: `3px solid ${P.ink}` }}><rect width={16} height={10} fill="#006AA7" /><rect x={5} width={2} height={10} fill="#FECC00" /><rect y={4} width={16} height={2} fill="#FECC00" /></svg>
        <Hand size={46} color={P.ink}>warning signs standard tests miss</Hand>
      </div>
      <div style={{ position: "relative" }}>
        <InkLine d={ecgPath(880, 200, 4)} w={880} h={200} color={P.teal} from={0} to={50} width={6} len={3200} />
        <svg width={880} height={200} style={{ position: "absolute", left: 0, top: 0, opacity: g > 50 ? 1 : 0 }}><ellipse cx={550} cy={40} rx={70} ry={50} fill="none" stroke={P.red} strokeWidth={6} /></svg>
      </div>
      <Source>UC Berkeley study, Nature · {SRC_HEART}</Source>
    </PaperCard>
  );
};

// ---------- news 3: Inkling ----------
export const QuickHit: React.FC = () => (
  <PaperCard seed="ink" rot={-1} tag={TAG}>
    <Title sub="free AI that runs offline">Inkling 2 Mini</Title>
    <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 50 }}>
      <InkLaptop s={460} />
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}><Stamp at={8} color={P.green} size={56}>FREE</Stamp><Stamp at={18} color={P.teal} size={44} rot={6}>OFFLINE</Stamp></div>
    </div>
    <div style={{ position: "absolute", right: 10, bottom: 50 }}><Stamp at={0} size={40} rot={-4}>QUICK HIT</Stamp></div>
    <Source>{SRC_INK}</Source>
  </PaperCard>
);
export const DataStays: React.FC = () => (
  <PaperCard seed="lock" rot={1} tag={TAG}>
    <Title sub="smart help, no cloud">Your data stays home</Title>
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 50, marginTop: 50 }}>
      <InkLaptop s={360} />
      <InkLock s={230} />
    </div>
    <Source>{SRC_INK}</Source>
  </PaperCard>
);

// ---------- ending ----------
export const Recap: React.FC = () => {
  const g = useTwos();
  const items = [{ l: "math", c: P.mustard, s: "ζ" }, { l: "hearts", c: P.red, s: "♥" }, { l: "privacy", c: P.green, s: "⌂" }];
  return (
    <PaperCard seed="recap" rot={-1} tag={TAG}>
      <Title sub="all in…">This week AI solved</Title>
      <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 40 }}>
        {items.map((it, i) => (
          <div key={i} style={{ textAlign: "center", transform: `scale(${g > i * 6 ? 1 : 0}) rotate(${(random(`r${i}`) - 0.5) * 10}deg)` }}>
            <div style={{ width: 200, height: 200, border: `4px solid ${P.ink}`, borderRadius: 30, background: `${it.c}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 110, color: it.c, fontWeight: 900 }}>{it.s}</div>
            <Hand size={44} color={P.ink} style={{ textAlign: "center", transformOrigin: "center" }}>{it.l}</Hand>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", fontSize: 90, fontWeight: 900, marginTop: 10, opacity: g > 24 ? 1 : 0 }}>7 days</div>
    </PaperCard>
  );
};

export const SHOW: Show = {
  presenter: presenterForWeek(47),
  plates: [
    { t: 0, C: MillionProblem, mood: "body", from: "top" },
    { t: word("hook", "and"), C: NotEvenBiggest, mood: "happy" },
    { t: seg("news1"), C: Riemann, mood: "curious", from: "left" },
    { t: word("news1", "a", 1), C: Years167, mood: "serious" },
    { t: word("news1", "proof", 1), C: ProofLines, mood: "curious", from: "left" },
    { t: word("news1", "experts"), C: UnderReview, mood: "serious", from: "top" },
    { t: word("news1", "if"), C: Historic, mood: "happy" },
    { t: seg("news2"), C: SavesLives, mood: "body", from: "left" },
    { t: word("news2", "found"), C: HeartBars, mood: "curious" },
    { t: word("news2", "and"), C: SwedishData, mood: "serious", from: "left" },
    { t: seg("news3"), C: QuickHit, mood: "happy", from: "top" },
    { t: word("news3", "smart"), C: DataStays, mood: "curious" },
    { t: seg("loop"), C: Recap, mood: "happy", from: "left" },
  ],
};
