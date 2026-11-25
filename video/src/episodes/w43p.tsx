/** Week 43 – ENSEMBLE: new cast presents together on the 2.5D studio stage. Voice: scripts/episodes/2026-w43-en.* */
import React from "react";
import { interpolate } from "remotion";
import { C as T } from "../theme";
import { CHARACTERS } from "../presenter/characters";
import { word, seg, type Show } from "../presenter/Show";
import { P, HAND, PaperCard, Title, Source, Hand, Stamp, BarPair, useTwos, clamp } from "../presenter/kit";
import { ComicBurst } from "../presenter/banana";

export const WEEK_LABEL = "WK 43";
export const SEG_COLOR: Record<string, string> = { hook: T.purple, c1: T.cyan, l1: T.amber, c2: T.cyan, p1: T.green, ch1: T.green, w1: T.amber, loop: T.purple };
const TAG = "AI BOUNCE · WK 43";
const FPS = 60;
const rel = (s: string, w: string, start: number, nth = 0) => Math.round((word(s, w, nth) - start) * FPS);
const SRC_W = "Guan et al., Nature (Oct 14, 2026) · Phys.org · MIT";
const SRC_D = "Hugging Face · TechRepublic · MarkTechPost (benchmarks self-reported)";
const SRC_R = "The Neuron AI digest (Oct 22, 2026)";
const MONO = "DejaVu Sans Mono, monospace";
const TINT = { hook: "#8b5cf6", weather: "#3b82f6", warn: "#f59e0b", dna: "#22c55e", lab: "#f97316" };

// ---------- hook ----------
const Future: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="w43a" rot={-1.2} tag={TAG}>
      <Title sub="this week AI got better at…">Seeing weeks into the future</Title>
      <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 60 }}>
        {[1, 2, 3, 4, 5, 6].map((w, i) => (
          <div key={w} style={{ width: 120, height: 150, border: `4px solid ${P.ink}`, borderRadius: 12, background: P.paper2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `translateY(${g > i * 5 ? 0 : -60}px) rotate(${(i - 2.5) * 3}deg)`, opacity: g > i * 5 ? 1 : 0 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: P.muted }}>WEEK</div><div style={{ fontSize: 60, fontWeight: 900 }}>{w}</div>
          </div>
        ))}
      </div>
      <Hand size={48} style={{ textAlign: "center", marginTop: 30, transformOrigin: "center" }} show={g > 40}>🔮 →</Hand>
    </PaperCard>
  );
};

// ---------- weather ----------
const C1 = seg("c1");
const FixErrors: React.FC = () => {
  const g = useTwos();
  const fix = interpolate(g, [rel("c1", "fix", C1), rel("c1", "models", C1) + 20], [0, 1], clamp);
  const pts = (k: number) => [...Array(30)].map((_, i) => `${40 + i * 28},${200 + Math.sin(i / 4) * 70 + (1 - k) * Math.sin(i * 1.7) * 55}`).join(" ");
  return (
    <PaperCard seed="w43b" rot={1} tag={TAG}>
      <Title sub="ML corrects the errors of existing models">Smarter weather models</Title>
      <svg width={880} height={380} style={{ marginTop: 10 }}>
        <polyline points={pts(0)} fill="none" stroke={P.muted} strokeWidth={4} strokeDasharray="10 8" />
        <polyline points={pts(fix)} fill="none" stroke={P.teal} strokeWidth={8} strokeLinejoin="round" opacity={fix} />
        <text x={40} y={360} fontFamily={HAND} fontSize={34} fill={P.muted}>raw model</text>
        <text x={560} y={360} fontFamily={HAND} fontSize={34} fill={P.teal} opacity={fix}>AI-corrected</text>
      </svg>
      <Source>{SRC_W}</Source>
    </PaperCard>
  );
};
const C1B = word("c1", "and");
const Doubled: React.FC = () => (
  <PaperCard seed="w43c" rot={-1} tag={TAG}>
    <Title sub="forecast skill, 2–6 weeks ahead">Doubled</Title>
    <div style={{ marginTop: 6 }}><BarPair a={38} b={76} la="before" lb="with AI" H={330} ta="1×" tb="2×" /></div>
    <div style={{ position: "absolute", right: 10, top: 110 }}><Stamp at={rel("c1", "nature", C1B)} size={44} color={P.green} rot={8}>NATURE</Stamp></div>
    <Source>{SRC_W} · must hold across seasons</Source>
  </PaperCard>
);
const L1 = seg("l1");
const Warnings: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="w43d" rot={1} tag={TAG}>
      <Title sub="what it could mean">Earlier warnings</Title>
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 50 }}>
        {[{ l: "heat waves", c: P.red, d: "M12 3v10a4 4 0 1 0 0.01 0Z M12 3a2 2 0 0 1 2 2v8" }, { l: "floods", c: P.teal, d: "M2 16q5-4 10 0t10 0M2 20q5-4 10 0t10 0M12 3l4 7h-8z" }].map((it, i) => (
          <div key={it.l} style={{ textAlign: "center", transform: `scale(${g > rel("l1", i ? "floods" : "heat", L1) ? 1 : 0})` }}>
            <svg width={220} height={220} viewBox="0 0 24 24"><path d={it.d} stroke={it.c} strokeWidth={1.6} fill={`${it.c}33`} strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div style={{ fontSize: 44, fontWeight: 900, color: it.c }}>{it.l}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 10, bottom: 50 }}><Stamp at={20} size={40} color={P.mustard} rot={-4}>⚠ WEEKS EARLIER</Stamp></div>
    </PaperCard>
  );
};
const PlanRain: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="w43e" rot={-1} tag={TAG}>
      <Title sub="Cloudy's new calendar">"I finally get to plan my rain"</Title>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 110px)", gap: 8, marginTop: 30, justifyContent: "center" }}>
        {[...Array(14)].map((_, i) => <div key={i} style={{ height: 100, border: `3px solid ${P.ink}`, borderRadius: 8, background: P.paper2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50 }}>{[3, 9].includes(i) && g > 10 + i * 2 ? "🌧️" : i === 6 && g > 30 ? "🌈" : ""}</div>)}
      </div>
    </PaperCard>
  );
};

// ---------- DNA ----------
const P1 = seg("p1");
const CarbonX: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="w43f" rot={1} tag={TAG}>
      <Title sub="open AI model · Hugging Face">Carbon-X: chat with DNA</Title>
      <svg width={880} height={400} style={{ marginTop: 10 }}>
        {[...Array(20)].map((_, i) => { const x = 40 + i * 42, ph = i * 0.6 + g / 14; const y1 = 200 + Math.sin(ph) * 120, y2 = 200 - Math.sin(ph) * 120; return <g key={i}><line x1={x} y1={y1} x2={x} y2={y2} stroke={P.ink} strokeWidth={3} /><circle cx={x} cy={y1} r={13} fill={P.green} stroke={P.ink} strokeWidth={2} /><circle cx={x} cy={y2} r={13} fill={P.mustard} stroke={P.ink} strokeWidth={2} /></g>; })}
      </svg>
      <div style={{ position: "absolute", right: 30, top: 300, padding: "14px 20px", border: `4px solid ${P.ink}`, borderRadius: "28px 28px 6px 28px", background: P.paper2, fontSize: 34, fontWeight: 800, transform: `scale(${g > rel("p1", "chat", P1) ? 1 : 0})` }}>"hi DNA 👋"</div>
      <Source>{SRC_D}</Source>
    </PaperCard>
  );
};
const P1B = word("p1", "ask");
const ChatDemo: React.FC = () => {
  const g = useTwos();
  const ans = "This change may disrupt how the gene is read…";
  const n = Math.floor(interpolate(g, [40, 120], [0, ans.length], clamp));
  return (
    <PaperCard seed="w43g" rot={-1} tag={TAG}>
      <Title sub="in plain English">Ask the genome</Title>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 30 }}>
        <div style={{ alignSelf: "flex-end", maxWidth: 620, padding: "16px 22px", borderRadius: "28px 28px 6px 28px", background: `${P.green}44`, border: `4px solid ${P.ink}`, fontSize: 36, fontWeight: 800 }}>What does the mutation at <span style={{ fontFamily: MONO }}>…GATTACA…</span> do?</div>
        <div style={{ alignSelf: "flex-start", maxWidth: 680, padding: "16px 22px", borderRadius: "28px 28px 28px 6px", background: P.paper2, border: `4px solid ${P.ink}`, fontSize: 34, fontWeight: 700, minHeight: 60, opacity: g > 30 ? 1 : 0 }}>{ans.slice(0, n)}<span style={{ opacity: n < ans.length && g % 20 < 10 ? 1 : 0 }}>▌</span></div>
      </div>
      <div style={{ position: "absolute", right: 12, bottom: 50, fontSize: 20, color: P.muted, letterSpacing: 2 }}>ILLUSTRATION</div>
      <Source>{SRC_D}</Source>
    </PaperCard>
  );
};
const CH1 = seg("ch1");
const Laptop: React.FC = () => (
  <PaperCard seed="w43h" rot={1} tag={TAG}>
    <Title sub="no cloud needed">Runs on a laptop</Title>
    <svg width={880} height={400} viewBox="0 0 100 46" style={{ marginTop: 20 }}>
      <rect x={28} y={4} width={44} height={28} rx={2} fill="#ffffffaa" stroke={P.ink} strokeWidth={1.2} />
      <path d="M22 34 H78 L74 40 H26 Z" fill={`${P.ink}22`} stroke={P.ink} strokeWidth={1.2} strokeLinejoin="round" />
      {[...Array(6)].map((_, i) => <circle key={i} cx={36 + i * 5.5} cy={18 + Math.sin(i) * 5} r={1.6} fill={i % 2 ? P.green : P.mustard} />)}
    </svg>
    <Source>{SRC_D}</Source>
  </PaperCard>
);
const CH1B = word("ch1", "though");
const NotTested: React.FC = () => (
  <PaperCard seed="w43i" rot={-1} tag={TAG}>
    <Title sub="Chip's honest footnote">…though</Title>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 40, marginTop: 60 }}>
      <svg width={220} height={260} viewBox="0 0 22 26"><path d="M8 2 H14 V9 L20 22 Q21 24 18 24 H4 Q1 24 2 22 L8 9 Z" fill={`${P.teal}33`} stroke={P.ink} strokeWidth={1} /><path d="M5 17 H17" stroke={P.ink} strokeWidth={0.6} /></svg>
      <Stamp at={rel("ch1", "tested", CH1B)} size={60} color={P.red} rot={-6}>NOT LAB-TESTED YET</Stamp>
    </div>
    <Source>{SRC_D}</Source>
  </PaperCard>
);

// ---------- robot labs ----------
const W1 = seg("w1");
const RobotLab: React.FC = () => {
  const g = useTwos();
  const m = Math.round(interpolate(g, [rel("w1", "215", W1) - 10, rel("w1", "million", W1) + 10], [0, 215], clamp));
  const a = Math.sin(g / 12) * 20;
  return (
    <PaperCard seed="w43j" rot={1} tag={TAG}>
      <Title sub="new startup by OpenAI's former science chief">Warp Sciences</Title>
      <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 20 }}>
        <svg width={380} height={380} viewBox="0 0 40 40">
          <rect x={6} y={34} width={14} height={4} fill={P.muted} stroke={P.ink} strokeWidth={0.6} />
          <g transform={`rotate(${a} 13 34)`}><rect x={11.5} y={18} width={3} height={16} fill={P.mustard} stroke={P.ink} strokeWidth={0.6} />
            <g transform={`rotate(${-a * 2} 13 18)`}><rect x={13} y={16.5} width={14} height={3} fill={P.mustard} stroke={P.ink} strokeWidth={0.6} /><path d="M27 15 L31 15 L30 22 Q29 24 27.5 22 Z" fill={`${P.green}88`} stroke={P.ink} strokeWidth={0.6} /></g></g>
          <circle cx={13} cy={34} r={2} fill={P.ink} />
        </svg>
        <div><div style={{ fontSize: 120, fontWeight: 900, color: P.green, lineHeight: 1 }}>${m}M</div><Hand size={42}>for robot chemistry labs</Hand></div>
      </div>
      <div style={{ position: "absolute", right: 10, top: 110 }}><Stamp at={0} size={36} rot={6}>QUICK HIT</Stamp></div>
      <Source>{SRC_R} · Kevin Weil</Source>
    </PaperCard>
  );
};
const W1B = word("w1", "robots");
const Kaboom: React.FC = () => (
  <PaperCard seed="w43k" rot={-1} tag={TAG}>
    <Title sub="Wattson approves (for once)">Robots doing chemistry</Title>
    <div style={{ display: "flex", justifyContent: "center", marginTop: 60 }}>
      <svg width={260} height={300} viewBox="0 0 22 26"><path d="M8 2 H14 V9 L20 22 Q21 24 18 24 H4 Q1 24 2 22 L8 9 Z" fill="#a3e635aa" stroke={P.ink} strokeWidth={1} /></svg>
    </div>
    <ComicBurst text="KA-BOOM!" at={rel("w1", "blow", W1B)} x={460} y={420} color={P.red} size={0.9} dur={90} />
  </PaperCard>
);

// ---------- ending ----------
const Recap: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="w43l" rot={1} tag={TAG}>
      <Title sub="all in…">This week AI solved</Title>
      <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 40 }}>
        {[{ l: "weather", s: "🌦️", c: P.teal }, { l: "DNA", s: "🧬", c: P.green }, { l: "robot labs", s: "🤖", c: P.mustard }].map((it, i) => (
          <div key={it.l} style={{ textAlign: "center", transform: `scale(${g > i * 6 ? 1 : 0})` }}>
            <div style={{ width: 200, height: 200, border: `4px solid ${P.ink}`, borderRadius: 30, background: `${it.c}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 100 }}>{it.s}</div>
            <Hand size={42} color={P.ink} style={{ textAlign: "center", transformOrigin: "center" }}>{it.l}</Hand>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", fontSize: 90, fontWeight: 900, marginTop: 10, opacity: g > 24 ? 1 : 0 }}>7 days</div>
    </PaperCard>
  );
};

export const SHOW: Show = {
  presenter: CHARACTERS.wattson,
  stage: true,
  plates: [
    { t: 0, C: Future, mood: "body", from: "top", tint: TINT.hook, cast: [{ id: "lumi", expr: "happy", talk: true }, { id: "cloudy", expr: "neutral" }] },
    { t: C1, C: FixErrors, mood: "body", from: "left", tint: TINT.weather, cast: [{ id: "cloudy", expr: "happy", talk: true }, { id: "lumi", expr: "surprised" }] },
    { t: C1B, C: Doubled, mood: "body", tint: TINT.weather, cast: [{ id: "cloudy", expr: "laugh", talk: true }, { id: "lumi", expr: "happy" }] },
    { t: L1, C: Warnings, mood: "body", from: "left", tint: TINT.warn, cast: [{ id: "lumi", expr: "smug", talk: true }, { id: "cloudy", expr: "surprised" }] },
    { t: seg("c2"), C: PlanRain, mood: "body", tint: TINT.weather, cast: [{ id: "cloudy", expr: "love", talk: true }, { id: "lumi", expr: "laugh" }] },
    { t: P1, C: CarbonX, mood: "body", from: "top", tint: TINT.dna, cast: [{ id: "pixel", expr: "happy", talk: true }, { id: "chip", expr: "surprised" }] },
    { t: P1B, C: ChatDemo, mood: "body", tint: TINT.dna, cast: [{ id: "pixel", expr: "surprised", talk: true }, { id: "chip", expr: "happy" }] },
    { t: CH1, C: Laptop, mood: "body", from: "left", tint: TINT.dna, cast: [{ id: "chip", expr: "happy", talk: true }, { id: "pixel", expr: "love" }] },
    { t: CH1B, C: NotTested, mood: "body", tint: TINT.dna, cast: [{ id: "chip", expr: "scared", talk: true }, { id: "pixel", expr: "confused" }] },
    { t: W1, C: RobotLab, mood: "body", from: "top", tint: TINT.lab, cast: [{ id: "wattson", expr: "neutral", talk: true }, { id: "chip", expr: "surprised" }] },
    { t: W1B, C: Kaboom, mood: "body", tint: TINT.lab, cast: [{ id: "wattson", expr: "smug", talk: true }, { id: "chip", expr: "scared" }] },
    { t: seg("loop"), C: Recap, mood: "body", from: "left", tint: TINT.hook, cast: [{ id: "wattson", expr: "smug" }, { id: "chip", expr: "happy" }, { id: "lumi", expr: "happy", talk: true }, { id: "pixel", expr: "laugh" }, { id: "cloudy", expr: "laugh" }] },
  ],
};
