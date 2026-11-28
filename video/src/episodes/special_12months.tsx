/** SPECIAL EDITION – "How fast is AI really moving? 12 months measured" – relay. */
import React from "react";
import { interpolate } from "remotion";
import { C as T } from "../theme";
import { CHARACTERS } from "../presenter/characters";
import { word, seg, type Show } from "../presenter/Show";
import { P, HAND, PaperCard, Title, Source, Hand, Stamp, useTwos, clamp } from "../presenter/kit";

export const WEEK_LABEL = "SPECIAL";
export const SEG_COLOR: Record<string, string> = { hook: T.amber, skill: T.cyan, cost: T.green, real: T.pink, loop: T.purple };
const TAG = "AI BOUNCE · SPECIAL · 12 MONTHS";
const SRC_METR = "METR: GPT-5.1-Codex-Max eval (Nov 2025), Frontier Risk Report (May 2026), Q4 update (Nov 2026)";
const SRC_EPOCH = "Epoch AI, \"The plunging price of thought\" (Sep 2026)";
const MONO = "DejaVu Sans Mono, monospace";

const Clock: React.FC<{ s?: number; show?: boolean; t?: number }> = ({ s = 60, show = true, t = 0 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" style={{ transform: `scale(${show ? 1 : 0})` }}>
    <circle cx={12} cy={12} r={10} fill={P.paper2} stroke={P.ink} strokeWidth={1.6} />
    <line x1={12} y1={12} x2={12} y2={6} stroke={P.ink} strokeWidth={1.6} strokeLinecap="round" />
    <line x1={12} y1={12} x2={12 + Math.cos(t) * 5} y2={12 + Math.sin(t) * 5} stroke={P.red} strokeWidth={1.4} strokeLinecap="round" />
  </svg>
);

// ---------- hook (Rune) ----------
const TwelveMonths: React.FC = () => {
  const g = useTwos();
  const months = ["NOV 2025", "FEB 2026", "MAY 2026", "AUG 2026", "NOV 2026"];
  const k = Math.min(months.length - 1, Math.floor(g / 22));
  return (
    <PaperCard seed="tm0" rot={-1.2} tag={TAG}>
      <Title sub="special edition">How fast is AI really moving?</Title>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 60, marginTop: 50 }}>
        <div style={{ width: 340, border: `5px solid ${P.ink}`, borderRadius: 16, background: P.paper2, overflow: "hidden", transform: `rotate(${k % 2 ? 3 : -3}deg)`, boxShadow: "6px 8px 0 #0002" }}>
          <div style={{ background: P.red, color: "#fff", textAlign: "center", fontSize: 34, fontWeight: 900, padding: 8 }}>MEASURING</div>
          <div style={{ textAlign: "center", fontSize: 72, fontWeight: 900, padding: "36px 0", fontFamily: MONO }}>{months[k]}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 170, fontWeight: 900, lineHeight: 1, color: P.teal }}>12</div>
          <Hand size={52} style={{ transformOrigin: "center" }}>months</Hand>
        </div>
      </div>
    </PaperCard>
  );
};

// ---------- capability (Ture) ----------
const Yardstick: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="tm1" rot={1} tag={TAG}>
      <Title sub="METR's yardstick">How long a task can AI finish?</Title>
      <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 50 }}>
        <div style={{ textAlign: "center" }}>
          <Clock s={220} t={g / 6} />
          <Hand size={40} color={P.muted} style={{ transformOrigin: "center" }}>task length =<br />human expert time</Hand>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 10 }}>
            {[...Array(10)].map((_, i) => <div key={i} style={{ width: 44, height: 44, borderRadius: 22, border: `3px solid ${P.ink}`, background: i < 5 && g > 20 + i * 4 ? P.green : "transparent" }} />)}
          </div>
          <div style={{ fontSize: 44, fontWeight: 900, marginTop: 20 }}>AI succeeds <span style={{ color: P.green }}>half</span> the time</div>
          <Hand size={36} color={P.muted}>= the "50% time horizon"</Hand>
        </div>
      </div>
      <Source>{SRC_METR}</Source>
    </PaperCard>
  );
};
const ThreeToTwelve: React.FC = () => {
  const g = useTwos();
  const Row: React.FC<{ label: string; n: number; c: string; from: number }> = ({ label, n, c, from }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 30 }}>
      <div style={{ width: 230, fontSize: 38, fontWeight: 900 }}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, width: 440 }}>{[...Array(n)].map((_, i) => <Clock key={i} s={46} show={g > from + i * 2} t={i} />)}</div>
      <div style={{ fontSize: 60, fontWeight: 900, color: c, whiteSpace: "nowrap", opacity: g > from + n * 2 ? 1 : 0 }}>{n === 3 ? "~3 h" : "~12 h"}</div>
    </div>
  );
  return (
    <PaperCard seed="tm2" rot={-0.9} tag={TAG}>
      <Title sub="tasks AI completes half the time">From 3 hours to 12</Title>
      <div style={{ marginTop: 50 }}>
        <Row label="Nov 2025" n={3} c={P.muted} from={4} />
        <Row label="Spring 2026" n={12} c={P.teal} from={40} />
      </div>
      <Hand size={34} color={P.muted}>wide uncertainty: spring estimate 5–61 h</Hand>
      <Source>{SRC_METR}</Source>
    </PaperCard>
  );
};
const Doubling: React.FC = () => {
  const g = useTwos();
  const p = interpolate(g, [4, 70], [0, 1], clamp);
  const steps = 4;
  const pts: string[] = [];
  for (let i = 0; i <= 60; i++) { const x = i / 60; if (x > p) break; pts.push(`${40 + x * 780},${330 - (Math.pow(2, x * steps) - 1) / (Math.pow(2, steps) - 1) * 290}`); }
  return (
    <PaperCard seed="tm3" rot={1.1} tag={TAG}>
      <Title sub="roughly every 3.5 months">It doubles</Title>
      <svg width={880} height={370} style={{ marginTop: 20 }}>
        <line x1={40} y1={340} x2={840} y2={340} stroke={P.ink} strokeWidth={4} /><line x1={40} y1={340} x2={40} y2={20} stroke={P.ink} strokeWidth={4} />
        {[...Array(steps)].map((_, i) => { const x = (i + 1) / steps; return x <= p + 0.01 && <g key={i}><line x1={40 + x * 780} y1={340} x2={40 + x * 780} y2={330 - (Math.pow(2, x * steps) - 1) / (Math.pow(2, steps) - 1) * 290} stroke={P.muted} strokeWidth={2} strokeDasharray="6 6" /><text x={40 + x * 780 - 22} y={366} fontSize={28} fontFamily={HAND} fill={P.ink}>×{Math.pow(2, i + 1)}</text></g>; })}
        <polyline points={pts.join(" ")} fill="none" stroke={P.red} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <Source>{SRC_METR} · doubling ≈ 3.6 months (95% CI 2.1–4.9)</Source>
    </PaperCard>
  );
};
const TenX: React.FC = () => (
  <PaperCard seed="tm4" rot={-1} tag={TAG}>
    <Title sub="2 × 2 × 2 × 2 ≈ every 3.5 months">That's about…</Title>
    <div style={{ display: "flex", justifyContent: "center", marginTop: 60 }}><Stamp at={6} size={120} color={P.teal} rot={-6}>10× / YEAR</Stamp></div>
    <Hand size={46} style={{ textAlign: "center", marginTop: 50, transformOrigin: "center" }}>longer tasks, every year</Hand>
    <Source>{SRC_METR}</Source>
  </PaperCard>
);

// ---------- cost (Saga) ----------
const Cheaper: React.FC = () => {
  const g = useTwos();
  const s = interpolate(g, [10, 70], [1, 1 / 2.4], clamp);
  return (
    <PaperCard seed="tm5" rot={1} tag={TAG}>
      <Title sub="same performance, smaller bill">And it's getting cheaper</Title>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 420, position: "relative" }}>
        <svg width={420} height={300} viewBox="0 0 42 30" style={{ position: "absolute", transform: "rotate(-8deg)", opacity: g > 10 ? 0.5 : 0 }}><path d="M2 4 H28 L40 15 L28 26 H2 Z" fill="none" stroke={P.muted} strokeWidth={0.6} strokeDasharray="1.5 1" /></svg>
        <Hand size={40} color={P.muted} style={{ position: "absolute", left: 20, top: 30 }} show={g > 10}>a year ago</Hand>
        <Hand size={44} color={P.green} style={{ position: "absolute", right: 20, bottom: 40 }} show={g > 70}>today: a fraction</Hand>
        <svg width={420} height={300} viewBox="0 0 42 30" style={{ transform: `scale(${s}) rotate(-8deg)` }}>
          <path d="M2 4 H28 L40 15 L28 26 H2 Z" fill={`${P.mustard}66`} stroke={P.ink} strokeWidth={1} strokeLinejoin="round" />
          <circle cx={32} cy={15} r={2.2} fill={P.paper} stroke={P.ink} strokeWidth={0.8} />
          <text x={6} y={19.5} fontSize={11} fontWeight={900} fill={P.ink}>$$$</text>
        </svg>
      </div>
      <Source>{SRC_EPOCH}</Source>
    </PaperCard>
  );
};
const ThirteenFold: React.FC = () => {
  const g = useTwos();
  const qs = [1, 0.53, 0.28, 0.15, 0.077];
  return (
    <PaperCard seed="tm6" rot={-1.1} tag={TAG}>
      <Title sub="cost of the same performance">≈ 13× cheaper per year</Title>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 40, height: 380, marginTop: 20 }}>
        {qs.map((q, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ width: 120, height: 300 * q, background: `repeating-linear-gradient(-45deg, ${P.green}99 0 10px, ${P.green}55 10px 20px)`, border: `4px solid ${P.ink}`, borderBottom: "none", transform: `scaleY(${g > i * 8 ? 1 : 0})`, transformOrigin: "bottom" }} />
            <div style={{ width: 140, height: 5, background: P.ink, marginLeft: -10 }} />
            <div style={{ fontFamily: HAND, fontSize: 34 }}>{i === 0 ? "start" : `Q${i}`}</div>
          </div>
        ))}
      </div>
      <Hand size={38} color={P.muted}>about −47% every quarter (since 2023)</Hand>
      <Source>{SRC_EPOCH}</Source>
    </PaperCard>
  );
};

// ---------- real world (Cara) ----------
const ClippingsBase: React.FC<{ phase: 0 | 1 }> = ({ phase }) => {
  const g = useTwos();
  const show2 = phase === 1 || g > Math.round((31.1 - 27.6) * 60);
  const show3 = phase === 1 ? g > 8 : false;
  const Clip: React.FC<{ h: string; s: string; rot: number; x: number; y: number; show: boolean }> = ({ h, s, rot, x, y, show }) => (
    <div style={{ position: "absolute", left: x, top: y, width: 430, padding: "18px 22px", background: "#fffdf4", border: `3px solid ${P.ink}`, boxShadow: "6px 8px 0 #0002", transform: `rotate(${rot}deg) scale(${show ? 1 : 0})` }}>
      <div style={{ fontSize: 16, color: P.muted, letterSpacing: 2, fontWeight: 800 }}>AI BOUNCE · {s}</div>
      <div style={{ fontSize: 34, fontWeight: 900, lineHeight: 1.15, marginTop: 6 }}>{h}</div>
    </div>
  );
  return (
    <PaperCard seed="tm7" rot={0.8} tag={TAG}>
      <Title sub="this autumn alone">What does that look like?</Title>
      <div style={{ position: "relative", height: 470 }}>
        <Clip h="AI claims proofs of famous math problems" s="WK 44 · CLAIM" rot={-4} x={0} y={40} show={show2} />
        <Clip h="Riemann Hypothesis proof claimed with AI" s="WK 47 · UNDER REVIEW" rot={3} x={430} y={20} show={show2} />
        <Clip h="AI beats 8 brain tumor experts – 97%" s="WK 46 · CONFERENCE TEST" rot={-2} x={200} y={230} show={show3} />
      </div>
      <Source>AI Bounce wk 44, 46, 47 – see those episodes for sources</Source>
    </PaperCard>
  );
};

const Clippings: React.FC = () => <ClippingsBase phase={0} />;
const Clippings2: React.FC = () => <ClippingsBase phase={1} />;

// ---------- ending (all four) ----------
const Summary: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="tm8" rot={-1} tag={TAG}>
      <Title sub="…in just one year">12 months of AI</Title>
      <div style={{ display: "flex", justifyContent: "center", gap: 60, marginTop: 60 }}>
        <div style={{ textAlign: "center", transform: `scale(${g > 4 ? 1 : 0}) rotate(-4deg)` }}>
          <div style={{ fontSize: 150, fontWeight: 900, color: P.teal, lineHeight: 1 }}>10×</div><Hand size={46} style={{ transformOrigin: "center" }}>longer tasks</Hand>
        </div>
        <div style={{ textAlign: "center", transform: `scale(${g > 60 ? 1 : 0}) rotate(4deg)` }}>
          <div style={{ fontSize: 150, fontWeight: 900, color: P.green, lineHeight: 1 }}>13×</div><Hand size={46} style={{ transformOrigin: "center" }}>cheaper</Hand>
        </div>
      </div>
      <Source>{SRC_METR} · {SRC_EPOCH}</Source>
    </PaperCard>
  );
};

const { rune, ture, saga, cara } = CHARACTERS;
export const SHOW: Show = {
  presenter: rune,
  stage: true,
  poster: { title: "How fast is AI really improving?", kicker: "SPECIAL EDITION \u00b7 12 MONTHS" },
  plates: [
    { t: 0, C: TwelveMonths, mood: "body", tint: "#8b5cf6", chip: "SPECIAL · 12 MONTHS", cast: [{ id: "pixel", expr: "surprised", talk: true }, { id: "lumi", expr: "happy" }, { id: "chip", expr: "scared" }] },
    { t: seg("skill"), C: Yardstick, mood: "body", tint: "#06b6d4", chip: "SKILL · TASK LENGTH", cast: [{ id: "pixel", expr: "neutral", talk: true }, { id: "lumi", expr: "surprised" }] },
    { t: word("skill", "november"), C: ThreeToTwelve, mood: "body", tint: "#06b6d4", chip: "SKILL · TASK LENGTH", cast: [{ id: "lumi", expr: "surprised", talk: true }, { id: "pixel", expr: "happy" }] },
    { t: word("skill", "that"), C: Doubling, mood: "body", tint: "#ef4444", chip: "SKILL · DOUBLING", cast: [{ id: "chip", expr: "scared", talk: true }, { id: "lumi", expr: "surprised" }] },
    { t: word("skill", "that's"), C: TenX, mood: "body", tint: "#ef4444", chip: "SKILL · 10× A YEAR", cast: [{ id: "chip", expr: "surprised", talk: true }, { id: "lumi", expr: "love" }] },
    { t: seg("cost"), C: Cheaper, mood: "body", tint: "#22c55e", chip: "COST · CHEAPER", cast: [{ id: "wattson", expr: "smug", talk: true }, { id: "pixel", expr: "happy" }] },
    { t: word("cost", "epoch"), C: ThirteenFold, mood: "body", tint: "#22c55e", chip: "COST · 13× CHEAPER", cast: [{ id: "wattson", expr: "surprised", talk: true }, { id: "pixel", expr: "laugh" }] },
    { t: seg("real"), C: Clippings, mood: "body", tint: "#f59e0b", chip: "IN REAL LIFE", cast: [{ id: "cloudy", expr: "happy", talk: true }, { id: "chip", expr: "surprised" }] },
    { t: word("real", "and"), C: Clippings2, mood: "body", tint: "#f59e0b", chip: "IN REAL LIFE", cast: [{ id: "cloudy", expr: "surprised", talk: true }, { id: "chip", expr: "love" }] },
    { t: seg("loop"), C: Summary, mood: "body", tint: "#8b5cf6", chip: "ONE YEAR", cast: [{ id: "wattson", expr: "smug" }, { id: "chip", expr: "happy" }, { id: "lumi", expr: "happy", talk: true }, { id: "pixel", expr: "laugh" }, { id: "cloudy", expr: "laugh" }] },
  ],
};
