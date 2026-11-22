/** SPECIAL EDITION 3 – "How much electricity does AI really use?" – Rune vs. Ture debate. */
import React from "react";
import { interpolate } from "remotion";
import { C as T } from "../theme";
import { CHARACTERS } from "../presenter/characters";
import { word, seg, type Show } from "../presenter/Show";
import { P, HAND, PaperCard, Title, Source, Hand, Stamp, InkChip, useTwos, clamp } from "../presenter/kit";

export const WEEK_LABEL = "SPECIAL";
export const SEG_COLOR: Record<string, string> = { hook: T.amber, t1: T.amber, r1: T.cyan, t2: T.amber, r2: T.cyan, t3: T.amber, loop: T.purple };
const TAG = "AI BOUNCE · SPECIAL · ELECTRICITY";
const SRC_IEA = "IEA (Apr 2026) via Our World in Data & Carbon Brief";
const MONO = "DejaVu Sans Mono, monospace";

const Bolt: React.FC<{ s?: number; c?: string }> = ({ s = 120, c = P.mustard }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><path d="M13 2 L4 14 H11 L10 22 L20 9 H13 Z" fill={c} stroke={P.ink} strokeWidth={1.2} strokeLinejoin="round" /></svg>
);
/** Pie with one highlighted slice (pct of 100). */
const Pie: React.FC<{ pct: number; r?: number; p?: number; c?: string }> = ({ pct, r = 170, p = 1, c = P.red }) => {
  const a = (Math.max(pct, 0.6) / 100) * 2 * Math.PI * p;
  const x = r + Math.sin(a) * r, y = r - Math.cos(a) * r;
  return (
    <svg width={r * 2 + 10} height={r * 2 + 10} viewBox={`-5 -5 ${r * 2 + 10} ${r * 2 + 10}`}>
      <circle cx={r} cy={r} r={r} fill={`${P.teal}2a`} stroke={P.ink} strokeWidth={5} />
      <path d={`M${r} ${r} L${r} 0 A${r} ${r} 0 ${a > Math.PI ? 1 : 0} 1 ${x} ${y} Z`} fill={c} stroke={P.ink} strokeWidth={4} strokeLinejoin="round" />
    </svg>
  );
};

// ---------- hook (Rune) ----------
const EatingPower: React.FC = () => {
  const g = useTwos();
  const chomp = Math.abs(Math.sin(g / 6));
  return (
    <PaperCard seed="el0" rot={-1.2} tag={TAG}>
      <Title sub="special edition">Is AI eating the world's electricity?</Title>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 30, marginTop: 50 }}>
        <svg width={280} height={160}><path d="M0 80 Q70 20 140 80 T280 80" stroke={P.ink} strokeWidth={6} fill="none" />{[0, 1, 2].map((i) => <circle key={i} cx={((g * 4 + i * 90) % 280)} cy={80 + Math.sin(((g * 4 + i * 90) % 280) / 44.5) * -60 * 0} r={14} fill={P.mustard} stroke={P.ink} strokeWidth={3} />)}</svg>
        <div style={{ position: "relative" }}>
          <InkChip s={220} />
          <div style={{ position: "absolute", left: 60, top: 150, width: 100, height: 14 + chomp * 40, background: P.ink, borderRadius: "0 0 50px 50px" }} />
        </div>
      </div>
      <div style={{ position: "absolute", right: 30, top: 470 }}><Stamp at={70} color={P.teal}>LET'S CHECK</Stamp></div>
    </PaperCard>
  );
};

// ---------- Ture: 485 TWh ----------
const Meter485: React.FC = () => {
  const g = useTwos();
  const v = Math.round(interpolate(g, [6, 70], [0, 485], { ...clamp }));
  return (
    <PaperCard seed="el1" rot={1} tag={TAG}>
      <Title sub="data centers, 2025">That's a lot of power!</Title>
      <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 40 }}>
        <div style={{ width: 300, height: 300, borderRadius: 30, border: `6px solid ${P.ink}`, background: P.paper2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Bolt s={110} />
          <div style={{ fontFamily: MONO, fontSize: 30, marginTop: 10, padding: "4px 12px", background: P.ink, color: "#9fe", borderRadius: 6 }}>{String(v).padStart(4, "0")}</div>
        </div>
        <div>
          <div style={{ fontSize: 140, fontWeight: 900, lineHeight: 1, color: P.red }}>{v}</div>
          <Hand size={52}>terawatt-hours</Hand>
          <Hand size={34} color={P.muted}>(1 TWh = 1 billion kWh)</Hand>
        </div>
      </div>
      <Source>{SRC_IEA}</Source>
    </PaperCard>
  );
};

// ---------- Rune: 1.5% ----------
const WorldPie: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="el2" rot={-0.9} tag={TAG}>
      <Title sub="share of all the world's electricity">Data centers ≈ 1.5%</Title>
      <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 30 }}>
        <Pie pct={1.5} p={interpolate(g, [6, 30], [0, 1], clamp)} />
        <div>
          <div style={{ fontSize: 110, fontWeight: 900, color: P.red, lineHeight: 1 }}>1.5%</div>
          <Hand size={44} color={P.muted}>everything else:<br />homes, factories, trains…</Hand>
        </div>
      </div>
      <Source>{SRC_IEA}</Source>
    </PaperCard>
  );
};
const AIPart: React.FC = () => {
  const g = useTwos();
  const p = interpolate(g, [20, 60], [0, 1], clamp);
  return (
    <PaperCard seed="el3" rot={1.1} tag={TAG}>
      <Title sub="but AI is only part of it">AI-focused data centers</Title>
      <div style={{ marginTop: 50 }}>
        <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>All data centers · 485 TWh</div>
        <div style={{ width: 860, height: 90, border: `5px solid ${P.ink}`, borderRadius: 14, background: `${P.teal}33`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(155 / 485) * 100 * p}%`, background: `repeating-linear-gradient(-45deg, ${P.red}cc 0 12px, ${P.red}88 12px 24px)`, borderRight: `5px solid ${P.ink}` }} />
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginTop: 20, opacity: p }}>
          <div style={{ fontSize: 100, fontWeight: 900, color: P.red }}>155</div>
          <Hand size={50}>TWh for AI</Hand>
        </div>
      </div>
      <Source>Our World in Data (IEA data), 2025</Source>
    </PaperCard>
  );
};
const HalfPercent: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="el4" rot={-1} tag={TAG}>
      <Title sub="of all the world's electricity">AI ≈ 0.5%</Title>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 40, marginTop: 20, position: "relative" }}>
        <Pie pct={0.49} p={1} />
        <svg width={260} height={260} viewBox="0 0 24 24" style={{ position: "absolute", left: 300, top: -20, transform: `scale(${g > 10 ? 1 : 0})` }}><circle cx={10} cy={10} r={7} fill="#ffffff55" stroke={P.ink} strokeWidth={1.6} /><line x1={15} y1={15} x2={22} y2={22} stroke={P.ink} strokeWidth={2.4} strokeLinecap="round" /></svg>
        <div style={{ fontSize: 120, fontWeight: 900, color: P.red }}>½%</div>
      </div>
      <Source>Our World in Data (IEA data): 155 TWh = 0.49%</Source>
    </PaperCard>
  );
};

// ---------- Ture: no problem? ----------
const NoProblem: React.FC = () => (
  <PaperCard seed="el5" rot={1.2} tag={TAG}>
    <Title sub="Ture asks…">So… no problem at all?</Title>
    <div style={{ display: "flex", justifyContent: "center", marginTop: 90 }}><Stamp at={6} size={110} color={P.green} rot={-5}>NO PROBLEM?</Stamp></div>
  </PaperCard>
);

// ---------- Rune: doubling by 2030 ----------
const Double2030: React.FC = () => {
  const g = useTwos();
  const a = interpolate(g, [8, 30], [0, 1], clamp);
  const b = interpolate(g, [30, 70], [0, 1], clamp);
  const H = 320;
  return (
    <PaperCard seed="el6" rot={-1} tag={TAG}>
      <Title sub="IEA projection for data centers">Not so fast…</Title>
      <div style={{ position: "absolute", left: -6, top: 120 }}><Stamp at={0} size={30} color={P.red} rot={-8}>NO PROBLEM? ✗</Stamp></div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end", gap: 70, height: 420, marginTop: 10, paddingRight: 20 }}>
        {[{ y: "2025", v: 485, p: a, l: "≈1.5%", c: P.teal }, { y: "2030", v: 950, p: b, l: "≈3%", c: P.red }].map((d) => (
          <div key={d.y} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 56, fontWeight: 900, color: d.c, opacity: d.p }}>{d.l}</div>
            <div style={{ width: 200, height: H * (d.v / 950) * d.p, border: `5px solid ${P.ink}`, borderBottom: "none", borderRadius: "12px 12px 0 0", background: `repeating-linear-gradient(-45deg, ${d.c}99 0 12px, ${d.c}55 12px 24px)` }} />
            <div style={{ width: 240, height: 5, background: P.ink, marginLeft: -20 }} />
            <div style={{ fontSize: 40, fontWeight: 900 }}>{d.y}</div>
            <div style={{ fontFamily: HAND, fontSize: 34, color: P.muted }}>~{d.v} TWh</div>
          </div>
        ))}
      </div>
      <Source>IEA projection (Apr 2026) · Nature study: AI alone ~1% by 2030</Source>
    </PaperCard>
  );
};

// ---------- Ture: small today, growing fast ----------
const SmallButFast: React.FC = () => {
  const g = useTwos();
  const grow = interpolate(g, [4, 60], [0.3, 1], clamp);
  return (
    <PaperCard seed="el7" rot={1} tag={TAG}>
      <Title sub="the honest answer">Small today, growing fast</Title>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", height: 420 }}>
        <svg width={420} height={420} viewBox="0 0 40 40">
          <line x1={20} y1={40} x2={20} y2={40 - 30 * grow} stroke={P.green} strokeWidth={1.6} />
          {[0.35, 0.55, 0.75].map((h, i) => grow > h && <ellipse key={i} cx={20 + (i % 2 ? 4 : -4)} cy={40 - 30 * h} rx={4 * grow} ry={2 * grow} fill={`${P.green}aa`} stroke={P.ink} strokeWidth={0.5} />)}
          <g transform={`translate(20 ${40 - 30 * grow}) scale(${grow})`}><circle r={4} fill={P.mustard} stroke={P.ink} strokeWidth={0.6} /><path d="M-1 -1 L1 -1 M0 -2 V1" stroke={P.ink} strokeWidth={0.4} /></g>
        </svg>
      </div>
    </PaperCard>
  );
};

// ---------- ending (all four) ----------
const WatchThisSpace: React.FC = () => {
  const g = useTwos();
  const glow = 0.4 + 0.6 * Math.abs(Math.sin(g / 10));
  return (
    <PaperCard seed="el8" rot={-1} tag={TAG}>
      <Title sub="…watch this space">Half a percent now</Title>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 50, marginTop: 30 }}>
        <svg width={280} height={360} viewBox="0 0 24 30">
          <circle cx={12} cy={11} r={10} fill={P.mustard} opacity={glow * 0.35} />
          <path d="M12 2 a8 8 0 0 1 5 14 v4 h-10 v-4 a8 8 0 0 1 5 -14 Z" fill={`${P.mustard}`} fillOpacity={glow} stroke={P.ink} strokeWidth={1} />
          <rect x={8} y={21} width={8} height={3} fill={P.muted} stroke={P.ink} strokeWidth={0.8} /><rect x={9} y={24} width={6} height={2} fill={P.muted} stroke={P.ink} strokeWidth={0.8} />
        </svg>
        <div><div style={{ fontSize: 120, fontWeight: 900, color: P.red }}>0.5%</div><Hand size={46}>→ growing</Hand></div>
      </div>
      <Source>{SRC_IEA} · Nature (2026)</Source>
    </PaperCard>
  );
};

const { rune, ture } = CHARACTERS;
export const SHOW: Show = {
  presenter: rune,
  plates: [
    { t: 0, C: EatingPower, mood: "body", from: "top", who: rune },
    { t: seg("t1"), C: Meter485, mood: "happy", from: "right", who: ture },
    { t: seg("r1"), C: WorldPie, mood: "curious", from: "left", who: rune },
    { t: word("r1", "but"), C: AIPart, mood: "serious", from: "right", who: rune },
    { t: word("r1", "that's", 1), C: HalfPercent, mood: "happy", from: "left", who: rune },
    { t: seg("t2"), C: NoProblem, mood: "happy", from: "top", who: ture },
    { t: seg("r2"), C: Double2030, mood: "serious", from: "left", who: rune },
    { t: seg("t3"), C: SmallButFast, mood: "curious", from: "right", who: ture },
    { t: seg("loop"), C: WatchThisSpace, mood: "group", from: "top" },
  ],
};
