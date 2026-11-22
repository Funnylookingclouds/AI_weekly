/** Week 46 – presenter format (Ture). Voice/words: scripts/episodes/2026-w46-en.* */
import React from "react";
import { interpolate, random } from "remotion";
import { C as T } from "../theme";
import { presenterForWeek } from "../presenter/characters";
import { word, seg, type Show } from "../presenter/Show";
import { P, HAND, PaperCard, Title, Source, Hand, Stamp, InkDoctor, InkChip, InkLock, Gauge, BarPair, useTwos, clamp } from "../presenter/kit";

export const WEEK_LABEL = "WK 46";
export const SEG_COLOR: Record<string, string> = { hook: T.cyan, news1: T.pink, news2: T.cyan, news3: T.green, loop: T.purple };
const TAG = "AI BOUNCE · WK 46";
const SRC_TUMOR = "Inside Precision Medicine · AMP 2026 (Mayo Clinic) · conference result";
const SRC_PROOF = "Google DeepMind blog · The Next Web";
const SRC_GENOME = "Google DeepMind blog · TechRepublic";
const MONO = "DejaVu Sans Mono, monospace";

// ---------- hook ----------
const EightVsAI: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="vs46" rot={-1.2} tag={TAG}>
      <Title sub="who diagnoses better?">AI vs. 8 brain tumor experts</Title>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 50 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 100px)", gap: 8 }}>
          {[...Array(8)].map((_, i) => <div key={i} style={{ opacity: g > i * 3 ? 1 : 0 }}><InkDoctor fade={interpolate(g, [120, 150], [0, 1], clamp)} /></div>)}
        </div>
        <Hand size={100} color={P.red} rot={-8} show={g > 30}>vs</Hand>
        <div style={{ transform: `scale(${g > 40 ? 1 : 0})` }}><InkChip /></div>
      </div>
      <div style={{ position: "absolute", right: 30, top: 470 }}><Stamp at={70} color={P.green}>AI WINS</Stamp></div>
      <Source>{SRC_TUMOR}</Source>
    </PaperCard>
  );
};
const OnlyTheStart: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="start46" rot={1} tag={TAG}>
      <Title sub="…and that's only the start">This week in AI</Title>
      <div style={{ display: "flex", gap: 36, justifyContent: "center", marginTop: 70 }}>
        {[P.red, P.teal, P.green].map((c, i) => (
          <div key={i} style={{ width: 230, height: 230, background: `${c}33`, border: `4px solid ${P.ink}`, transform: `rotate(${(i - 1) * 6}deg) scale(${g > 6 + i * 8 ? 1 : 0})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontSize: 140, color: c, boxShadow: "6px 8px 0 #0002" }}>{i + 1}</div>
        ))}
      </div>
    </PaperCard>
  );
};

// ---------- news 1: brain tumors ----------
const MayoTest: React.FC = () => {
  const g = useTwos();
  const n = Math.floor(interpolate(g, [10, 90], [0, 100], clamp));
  return (
    <PaperCard seed="mayo" rot={-0.8} tag={TAG}>
      <Title sub="pathology conference">Mayo Clinic test</Title>
      <div style={{ display: "flex", gap: 40, marginTop: 30, alignItems: "flex-start" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 40px)", gap: 6 }}>
          {[...Array(100)].map((_, i) => <div key={i} style={{ width: 40, height: 40, border: `2px solid ${P.ink}`, borderRadius: 6, background: i < n ? `${P.teal}cc` : "transparent" }} />)}
        </div>
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 120, fontWeight: 900, lineHeight: 1 }}>{n}</div>
          <Hand size={48}>real brain tumor cases</Hand>
        </div>
      </div>
      <Source>{SRC_TUMOR}</Source>
    </PaperCard>
  );
};
const TumorTypes: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="types" rot={1.1} tag={TAG}>
      <Title sub="from tissue images">52 possible tumor types</Title>
      <div style={{ display: "flex", gap: 40, alignItems: "center", marginTop: 40 }}>
        <div style={{ width: 420, height: 200, border: `4px solid ${P.ink}`, borderRadius: 12, background: "#ffffffaa", position: "relative", overflow: "hidden" }}>
          {[...Array(40)].map((_, i) => <div key={i} style={{ position: "absolute", left: 60 + random(`tx${i}`) * 300, top: 20 + random(`ty${i}`) * 150, width: 12 + random(`tr${i}`) * 22, height: 12 + random(`tr${i}`) * 22, borderRadius: "50%", background: random(`tc${i}`) > 0.5 ? "#9b5fc0aa" : "#d0679aaa" }} />)}
          <div style={{ position: "absolute", left: 130 + Math.sin(g / 10) * 110, top: 30, width: 140, height: 140, borderRadius: "50%", border: `6px solid ${P.teal}` }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 56px)", gap: 8 }}>
          {[...Array(18)].map((_, i) => <div key={i} style={{ height: 40, border: `2px solid ${P.ink}`, borderRadius: 6, background: i === 11 && g > 50 ? P.mustard : "transparent", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>{i === 17 ? "…" : ""}</div>)}
        </div>
      </div>
      <Hand size={44} style={{ marginTop: 30 }} show={g > 50}>AI picks the one that matches</Hand>
      <Source>{SRC_TUMOR}</Source>
    </PaperCard>
  );
};
const Score97: React.FC = () => (
  <PaperCard seed="g97" rot={-0.8} tag={TAG}>
    <Title sub="diagnostic accuracy">The AI scored</Title>
    <div style={{ marginTop: 40 }}><Gauge value={97} /></div>
    <Source>{SRC_TUMOR} · not yet peer-reviewed</Source>
  </PaperCard>
);
const BeatAll: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="beat" rot={1.2} tag={TAG}>
      <Title sub="behind it: all eight specialists">#1 = AI</Title>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 30, padding: "16px 24px", border: `5px solid ${P.mustard}`, borderRadius: 18, width: 520, background: `${P.mustard}22` }}>
        <Hand size={80} color={P.mustard}>#1</Hand><InkChip s={110} /><div style={{ fontSize: 56, fontWeight: 900 }}>97%</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 100px)", gap: 4, marginTop: 40 }}>
        {[...Array(8)].map((_, i) => <div key={i} style={{ transform: `translateY(${g > 10 + i * 3 ? 0 : 60}px)`, opacity: g > 10 + i * 3 ? 1 : 0 }}><InkDoctor s={96} /></div>)}
      </div>
      <Source>{SRC_TUMOR}</Source>
    </PaperCard>
  );
};
const TeamUp: React.FC = () => {
  const g = useTwos();
  const up = interpolate(g, [20, 45], [0, 1], clamp);
  return (
    <PaperCard seed="team46" rot={-1} tag={TAG}>
      <Title sub="even better">Doctor + AI</Title>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 30, marginTop: 50 }}>
        <InkDoctor s={200} />
        <Hand size={120} color={P.red} show={g > 10}>+</Hand>
        <div style={{ opacity: g > 15 ? 1 : 0 }}><InkChip s={190} /></div>
        <svg width={120} height={200} viewBox="0 0 24 40" style={{ transform: `translateY(${(1 - up) * 80}px)`, opacity: up }}><path d="M12 2 L22 16 H15.5 V38 H8.5 V16 H2 Z" fill={P.teal} /></svg>
      </div>
      <Hand size={60} style={{ textAlign: "center", marginTop: 30, transformOrigin: "center" }} show={up > 0.5}>doctors got more accurate</Hand>
      <Source>{SRC_TUMOR}</Source>
    </PaperCard>
  );
};

// ---------- news 2: Signal proof ----------
const SignalChat: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="sig" rot={1} tag={TAG}>
      <Title sub="Google DeepMind">AlphaProof Code</Title>
      <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 50 }}>
        <div style={{ position: "relative" }}>
          <div style={{ padding: "26px 34px", borderRadius: "40px 40px 40px 10px", background: `${P.teal}33`, border: `4px solid ${P.ink}`, fontSize: 42, fontWeight: 800, width: 380 }}>Private chat 💬<div style={{ fontFamily: HAND, fontSize: 36, color: P.teal }}>end-to-end encrypted</div></div>
        </div>
        <div style={{ transform: `rotate(${Math.sin(g / 8) * 6}deg)` }}><InkLock s={210} /></div>
      </div>
      <Hand size={46} style={{ marginTop: 40 }}>checks the code behind Signal's private chats</Hand>
      <Source>{SRC_PROOF}</Source>
    </PaperCard>
  );
};
const ProofCheck: React.FC = () => {
  const g = useTwos();
  const lines = ["lemma ratchet_secrecy :", "  ∀ k, derive k ≠ leak k", "theorem session_auth :", "  verify (sign m sk) pk", "lemma decrypt_encrypt :", "  dec k (enc k m) = m"];
  return (
    <PaperCard seed="lean46" rot={-1} tag={TAG}>
      <Title sub="mathematically checked">Encryption code proof</Title>
      <div style={{ marginTop: 30, padding: 22, border: `4px dashed ${P.ink}`, borderRadius: 14, fontFamily: MONO, fontSize: 30, lineHeight: 1.6, position: "relative" }}>
        <div style={{ position: "absolute", right: 12, top: 6, fontFamily: "Inter, sans-serif", fontSize: 20, color: P.muted, letterSpacing: 2 }}>ILLUSTRATION</div>
        {lines.map((l, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", whiteSpace: "pre", opacity: g > i * 6 ? 1 : 0, color: l.startsWith(" ") ? P.ink : P.teal }}>
            <span>{l}</span><span style={{ color: P.green, fontWeight: 900, opacity: g > i * 6 + 5 ? 1 : 0 }}>✓</span>
          </div>
        ))}
      </div>
      <Source>{SRC_PROOF}</Source>
    </PaperCard>
  );
};
const MillionsWeeks: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="weeks" rot={1.2} tag={TAG}>
      <Title sub="lines of proof">Millions</Title>
      <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 60 }}>
        {[1, 2, 3, 4].map((w, i) => (
          <div key={w} style={{ width: 180, height: 220, border: `4px solid ${P.ink}`, borderRadius: 14, background: P.paper2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `rotate(${(i - 1.5) * 4}deg) scale(${g > 8 + i * 8 ? 1 : 0})`, boxShadow: "5px 7px 0 #0002" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: P.muted }}>WEEK</div>
            <div style={{ fontSize: 90, fontWeight: 900 }}>{w}</div>
            <div style={{ fontSize: 44, color: P.green, fontWeight: 900 }}>✓</div>
          </div>
        ))}
      </div>
      <Hand size={48} style={{ marginTop: 30 }} show={g > 45}>all in just four weeks</Hand>
      <Source>{SRC_PROOF}</Source>
    </PaperCard>
  );
};
const BugsCaught: React.FC = () => {
  const g = useTwos();
  const Bug: React.FC<{ caught: boolean }> = ({ caught }) => (
    <div style={{ position: "relative", width: 200, height: 200 }}>
      <svg width={200} height={200} viewBox="0 0 24 24">
        <g stroke={P.ink} strokeWidth={1.2} strokeLinecap="round"><line x1={7} y1={9} x2={3} y2={7} /><line x1={17} y1={9} x2={21} y2={7} /><line x1={6.5} y1={13} x2={2.5} y2={13} /><line x1={17.5} y1={13} x2={21.5} y2={13} /><line x1={7} y1={17} x2={3} y2={19} /><line x1={17} y1={17} x2={21} y2={19} /></g>
        <ellipse cx={12} cy={13.5} rx={5.2} ry={6.5} fill={`${P.red}55`} stroke={P.ink} strokeWidth={1.2} /><circle cx={12} cy={6.5} r={2.8} fill={`${P.red}55`} stroke={P.ink} strokeWidth={1.2} />
      </svg>
      {caught && <div style={{ position: "absolute", inset: -10, border: `8px solid ${P.green}`, borderRadius: "50%" }} />}
    </div>
  );
  return (
    <PaperCard seed="bugs" rot={-0.9} tag={TAG}>
      <Title sub="researchers slipped in…">2 old bugs</Title>
      <div style={{ display: "flex", justifyContent: "center", gap: 120, marginTop: 50 }}><Bug caught={g > 60} /><Bug caught={g > 80} /></div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}><Stamp at={90} color={P.green}>CAUGHT BOTH</Stamp></div>
      <Source>{SRC_PROOF}</Source>
    </PaperCard>
  );
};

// ---------- news 3: AlphaGenome ----------
const Helix: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="dna" rot={1} tag={TAG}>
      <Title sub="reads DNA cell type by cell type">AlphaGenome 2</Title>
      <svg width={880} height={420} style={{ marginTop: 20 }}>
        {[...Array(18)].map((_, i) => {
          const x = 30 + i * 46, ph = i * 0.6 + g / 14;
          const y1 = 210 + Math.sin(ph) * 150, y2 = 210 - Math.sin(ph) * 150;
          const hit = i === 6 || i === 13;
          return <g key={i}><line x1={x} y1={y1} x2={x} y2={y2} stroke={hit ? P.mustard : P.ink} strokeWidth={hit ? 7 : 3} /><circle cx={x} cy={y1} r={11} fill={P.teal} stroke={P.ink} strokeWidth={2} /><circle cx={x} cy={y2} r={11} fill={P.red} stroke={P.ink} strokeWidth={2} /></g>;
        })}
      </svg>
      <div style={{ position: "absolute", right: 10, bottom: 50 }}><Stamp at={0} size={40} rot={-4}>QUICK HIT</Stamp></div>
      <Source>{SRC_GENOME} · research use only</Source>
    </PaperCard>
  );
};
const TwiceAsMany: React.FC = () => (
  <PaperCard seed="twice" rot={-1} tag={TAG}>
    <Title sub="gene-changing variants found">Nearly 2× as many</Title>
    <div style={{ marginTop: 10 }}><BarPair a={40} b={78} la="previous best" lb="AlphaGenome 2" H={330} ta="1×" tb="≈2×" /></div>
    <Hand size={40} rot={-4} style={{ position: "absolute", right: 0, top: 20 }}>clues to where diseases begin</Hand>
    <Source>{SRC_GENOME}</Source>
  </PaperCard>
);

// ---------- ending ----------
const Recap: React.FC = () => {
  const g = useTwos();
  const items = [{ l: "tumors", c: P.red, s: "✚" }, { l: "privacy", c: P.teal, s: "🔒" }, { l: "DNA", c: P.green, s: "🧬" }];
  return (
    <PaperCard seed="recap46" rot={1} tag={TAG}>
      <Title sub="all in…">This week AI solved</Title>
      <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 40 }}>
        {items.map((it, i) => (
          <div key={i} style={{ textAlign: "center", transform: `scale(${g > i * 6 ? 1 : 0}) rotate(${(random(`q${i}`) - 0.5) * 10}deg)` }}>
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
  presenter: presenterForWeek(46),
  plates: [
    { t: 0, C: EightVsAI, mood: "body", from: "top" },
    { t: word("hook", "and"), C: OnlyTheStart, mood: "happy" },
    { t: seg("news1"), C: MayoTest, mood: "curious", from: "left" },
    { t: word("news1", "choosing"), C: TumorTypes, mood: "serious" },
    { t: word("news1", "it"), C: Score97, mood: "happy", from: "top" },
    { t: word("news1", "beating"), C: BeatAll, mood: "body", from: "left" },
    { t: word("news1", "even"), C: TeamUp, mood: "happy" },
    { t: seg("news2"), C: SignalChat, mood: "curious", from: "left" },
    { t: word("news2", "mathematically"), C: ProofCheck, mood: "serious" },
    { t: word("news2", "millions"), C: MillionsWeeks, mood: "happy", from: "top" },
    { t: word("news2", "when"), C: BugsCaught, mood: "serious", from: "left" },
    { t: seg("news3"), C: Helix, mood: "curious", from: "top" },
    { t: word("news3", "finding"), C: TwiceAsMany, mood: "happy" },
    { t: seg("loop"), C: Recap, mood: "body", from: "left" },
  ],
};
