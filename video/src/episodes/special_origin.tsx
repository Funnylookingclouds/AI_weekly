/** SPECIAL EDITION – "When was AI first mentioned?" – relay with all four presenters. */
import React from "react";
import { interpolate } from "remotion";
import { C as T } from "../theme";
import { CHARACTERS } from "../presenter/characters";
import { word, seg, type Show } from "../presenter/Show";
import { P, HAND, PaperCard, Title, Source, Hand, Stamp, useTwos, clamp } from "../presenter/kit";

export const WEEK_LABEL = "SPECIAL";
export const SEG_COLOR: Record<string, string> = { hook: T.amber, y1955: T.amber, y1956: T.cyan, y1950: T.pink, loop: T.purple };
const TAG = "AI BOUNCE · SPECIAL EDITION";
const TYPE = "DejaVu Sans Mono, monospace";
const SRC_PROP = "McCarthy, Minsky, Rochester & Shannon, Dartmouth AI proposal, Aug 31 1955 (AI Magazine reprint)";
const SRC_TUR = "A. M. Turing, \"Computing Machinery and Intelligence\", Mind, Oct 1950";

const Typed: React.FC<{ text: string; from?: number; speed?: number; size?: number; style?: React.CSSProperties }> = ({ text, from = 0, speed = 1.4, size = 34, style }) => {
  const g = useTwos();
  const n = Math.floor(interpolate(g, [from, from + text.length * speed], [0, text.length], clamp));
  return <div style={{ fontFamily: TYPE, fontSize: size, whiteSpace: "pre-wrap", ...style }}>{text.slice(0, n)}<span style={{ opacity: n < text.length && g % 10 < 5 ? 1 : 0 }}>▌</span></div>;
};
const Person: React.FC<{ s?: number; c?: string }> = ({ s = 120, c = P.ink }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><circle cx={12} cy={7} r={4} fill="none" stroke={c} strokeWidth={1.4} /><path d="M4 22 C4 15.5 8 13.2 12 13.2 C16 13.2 20 15.5 20 22" fill="none" stroke={c} strokeWidth={1.4} /></svg>
);

// ---------- hook (Rune) ----------
const FirstMentioned: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="sp0" rot={-1.2} tag={TAG}>
      <Title sub="special edition">When was AI first mentioned?</Title>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 60, marginTop: 50 }}>
        <div style={{ fontFamily: HAND, fontSize: 300, color: P.mustard, lineHeight: 1, transform: `rotate(${Math.sin(g / 8) * 8}deg)` }}>?</div>
        <div style={{ position: "relative" }}>
          <div style={{ padding: "24px 34px", border: `4px solid ${P.ink}`, borderRadius: "36px 36px 8px 36px", fontSize: 50, fontWeight: 800, background: P.paper2 }}>ChatGPT?</div>
          {g > 70 && <svg width={300} height={110} style={{ position: "absolute", left: 0, top: 0 }}><line x1={10} y1={95} x2={290} y2={15} stroke={P.red} strokeWidth={9} strokeLinecap="round" /></svg>}
        </div>
      </div>
      <div style={{ position: "absolute", right: 30, top: 480 }}><Stamp at={74}>WAY BEFORE</Stamp></div>
    </PaperCard>
  );
};

// ---------- 1955 (Ture) ----------
const Aug1955: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="sp1" rot={1} tag={TAG}>
      <Title sub="the day the name was born">Our story starts…</Title>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
        <div style={{ width: 380, border: `5px solid ${P.ink}`, borderRadius: 16, background: P.paper2, overflow: "hidden", transform: `rotate(-3deg) scale(${g > 3 ? 1 : 0.4})`, boxShadow: "6px 8px 0 #0002" }}>
          <div style={{ background: P.teal, color: "#fff", textAlign: "center", fontSize: 40, fontWeight: 900, padding: 8, letterSpacing: 4 }}>AUGUST</div>
          <div style={{ textAlign: "center", fontSize: 160, fontWeight: 900, lineHeight: 1.1, fontFamily: TYPE }}>31</div>
          <div style={{ textAlign: "center", fontSize: 64, fontWeight: 900, paddingBottom: 12, color: P.red }}>1955</div>
        </div>
      </div>
      <Source>{SRC_PROP}</Source>
    </PaperCard>
  );
};
const McCarthy: React.FC = () => (
  <PaperCard seed="sp2" rot={-0.9} tag={TAG}>
    <Title sub="a young mathematician">John McCarthy</Title>
    <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 40 }}>
      <div style={{ width: 260, height: 300, border: `5px solid ${P.ink}`, background: "#e8dcc0", display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-4deg)", boxShadow: "6px 8px 0 #0002" }}><Person s={200} c={P.muted} /></div>
      <div style={{ flex: 1 }}>
        <Typed text={"FUNDING PROPOSAL\nto: Rockefeller\n    Foundation"} from={6} size={36} />
        <Hand size={40} color={P.muted} style={{ marginTop: 20 }}>portrait: illustration</Hand>
      </div>
    </div>
    <Source>{SRC_PROP} · Stanford Engineering</Source>
  </PaperCard>
);
const FourNames: React.FC = () => {
  const g = useTwos();
  const names = ["John McCarthy", "Marvin Minsky", "Nathaniel Rochester", "Claude Shannon"];
  return (
    <PaperCard seed="sp3" rot={1.1} tag={TAG}>
      <Title sub="the four who signed it">The proposal team</Title>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 40 }}>
        {names.map((n, i) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", border: `4px solid ${P.ink}`, borderRadius: 14, background: [`${P.mustard}33`, `${P.teal}33`, `${P.red}33`, `${P.green}33`][i], transform: `rotate(${(i % 2 ? 2 : -2)}deg) scale(${g > 4 + i * 14 ? 1 : 0})` }}>
            <Person s={70} /><div style={{ fontSize: 34, fontWeight: 900 }}>{n}</div>
          </div>
        ))}
      </div>
      <Source>{SRC_PROP}</Source>
    </PaperCard>
  );
};
const TheTitle: React.FC = () => {
  const g = useTwos();
  const hl = interpolate(g, [180, 205], [0, 1], clamp);
  return (
    <PaperCard seed="sp4" rot={-0.7} tag={TAG}>
      <Title sub="…right in the title">A brand-new term</Title>
      <div style={{ marginTop: 40, padding: "30px 34px", background: "#fffdf4", border: `3px solid ${P.ink}`, boxShadow: "6px 8px 0 #0002", fontFamily: TYPE, fontSize: 38, lineHeight: 1.5, transform: "rotate(-1deg)" }}>
        A PROPOSAL FOR THE<br />DARTMOUTH SUMMER RESEARCH<br />PROJECT ON{" "}
        <span style={{ position: "relative", fontWeight: 900 }}>
          <span style={{ position: "absolute", left: -6, right: -6, top: 4, bottom: 0, background: "#f7d84a", transformOrigin: "left", transform: `scaleX(${hl})`, zIndex: 0 }} />
          <span style={{ position: "relative" }}>ARTIFICIAL INTELLIGENCE</span>
        </span>
      </div>
      <div style={{ position: "absolute", right: 20, bottom: 60 }}><Stamp at={200} color={P.red} size={52}>FIRST USE</Stamp></div>
      <Source>{SRC_PROP} · OED</Source>
    </PaperCard>
  );
};

// ---------- 1956 (Saga) ----------
const TwoMonthsTen: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="sp5" rot={1} tag={TAG}>
      <Title sub="the plan">2 months · 10 people</Title>
      <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 40 }}>
        <div style={{ display: "flex", gap: 14 }}>
          {["JUN", "JUL"].map((m, i) => <div key={m} style={{ width: 150, height: 170, border: `4px solid ${P.ink}`, borderRadius: 12, background: P.paper2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, fontWeight: 900, transform: `rotate(${i ? 4 : -4}deg) scale(${g > i * 8 ? 1 : 0})` }}>{m}</div>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 80px)", gap: 4 }}>
          {[...Array(10)].map((_, i) => <div key={i} style={{ opacity: g > 16 + i * 3 ? 1 : 0 }}><Person s={80} /></div>)}
        </div>
      </div>
      <Hand size={46} style={{ marginTop: 30 }} show={g > 50}>a summer workshop</Hand>
      <Source>{SRC_PROP} ("a 2 month, 10 man study")</Source>
    </PaperCard>
  );
};
const Dartmouth: React.FC = () => (
  <PaperCard seed="sp6" rot={-1} tag={TAG}>
    <Title sub="summer 1956">Dartmouth College</Title>
    <svg width={880} height={400} style={{ marginTop: 20 }}>
      <rect x={180} y={170} width={520} height={200} fill={`${P.red}33`} stroke={P.ink} strokeWidth={5} />
      <path d="M160 175 L440 70 L720 175 Z" fill={P.paper2} stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />
      <rect x={410} y={20} width={60} height={60} fill={P.paper2} stroke={P.ink} strokeWidth={5} /><path d="M400 22 L440 -10 L480 22" fill={`${P.teal}66`} stroke={P.ink} strokeWidth={5} />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={215 + i * 80} y={210} width={40} height={60} fill={`${P.mustard}88`} stroke={P.ink} strokeWidth={4} />)}
      <rect x={410} y={290} width={60} height={80} fill={P.ink} />
      <line x1={60} y1={370} x2={820} y2={370} stroke={P.ink} strokeWidth={6} />
      {[90, 790].map((x) => <g key={x}><line x1={x} y1={370} x2={x} y2={300} stroke={P.ink} strokeWidth={6} /><circle cx={x} cy={270} r={45} fill={`${P.green}66`} stroke={P.ink} strokeWidth={5} /></g>)}
    </svg>
    <Source>Dartmouth College · drawing: illustration</Source>
  </PaperCard>
);
const BoldIdea: React.FC = () => (
  <PaperCard seed="sp7" rot={1.2} tag={TAG}>
    <Title sub="their bold idea (paraphrased)">Could a machine simulate it?</Title>
    <div style={{ marginTop: 40, padding: "26px 30px", borderLeft: `10px solid ${P.mustard}`, background: "#fffdf4" }}>
      <Typed text={"“Every feature of intelligence\ncan be described so precisely\nthat a machine could\nsimulate it.”"} from={4} speed={1.1} size={38} />
    </div>
    <Source>{SRC_PROP}</Source>
  </PaperCard>
);

// ---------- 1950 (Cara) ----------
const EvenOlder: React.FC = () => {
  const g = useTwos();
  const p = interpolate(g, [6, 50], [0, 1], clamp);
  const yr = Math.round(1956 - p * 6);
  return (
    <PaperCard seed="sp8" rot={-1} tag={TAG}>
      <Title sub="rewind…">The question is even older</Title>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 40, marginTop: 70 }}>
        <svg width={200} height={200} viewBox="0 0 24 24" style={{ transform: `rotate(${-g * 6}deg)` }}><path d="M12 3 a9 9 0 1 1 -8.5 6" fill="none" stroke={P.ink} strokeWidth={1.8} strokeLinecap="round" /><path d="M1.5 4.5 L3.5 9.5 L8.5 7.5" fill="none" stroke={P.ink} strokeWidth={1.8} strokeLinecap="round" /></svg>
        <div style={{ fontSize: 170, fontWeight: 900, fontFamily: TYPE, color: p >= 1 ? P.red : P.ink }}>{yr}</div>
      </div>
    </PaperCard>
  );
};
const Turing: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="sp9" rot={1} tag={TAG}>
      <Title sub="1950 · journal Mind">Alan Turing asked…</Title>
      <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 50 }}>
        <div style={{ width: 230, height: 300, border: `5px solid ${P.ink}`, background: "#efe4c8", padding: 16, boxSizing: "border-box", transform: "rotate(-4deg)", boxShadow: "6px 8px 0 #0002", fontFamily: TYPE }}>
          <div style={{ fontSize: 44, fontWeight: 900, textAlign: "center" }}>MIND</div>
          <div style={{ fontSize: 18, textAlign: "center", marginTop: 8 }}>OCTOBER 1950</div>
          <div style={{ fontSize: 17, marginTop: 30, lineHeight: 1.3 }}>COMPUTING MACHINERY AND INTELLIGENCE<br />— A. M. TURING</div>
        </div>
        <div style={{ padding: "30px 36px", border: `5px solid ${P.ink}`, borderRadius: "40px 40px 40px 8px", background: P.paper2, fontSize: 64, fontWeight: 900, transform: `scale(${g > 40 ? 1 : 0}) rotate(2deg)` }}>“Can machines<br />think?”</div>
      </div>
      <Source>{SRC_TUR}</Source>
    </PaperCard>
  );
};
const ImitationGame: React.FC = () => {
  const g = useTwos();
  const Box: React.FC<{ l: string; c: string; x: number; show: boolean; icon: React.ReactNode }> = ({ l, c, x, show, icon }) => (
    <div style={{ position: "absolute", left: x, top: 40, width: 220, textAlign: "center", transform: `scale(${show ? 1 : 0})` }}>
      <div style={{ height: 180, border: `4px solid ${P.ink}`, borderRadius: 16, background: `${c}33`, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
      <div style={{ fontFamily: HAND, fontSize: 40, marginTop: 6 }}>{l}</div>
    </div>
  );
  return (
    <PaperCard seed="sp10" rot={-1} tag={TAG}>
      <Title sub="today we call it the Turing test">The imitation game</Title>
      <div style={{ position: "relative", height: 380, marginTop: 20 }}>
        <Box l="human" c={P.green} x={0} show={g > 4} icon={<Person s={130} />} />
        <Box l="machine" c={P.teal} x={240} show={g > 12} icon={<div style={{ fontSize: 90, fontWeight: 900, color: P.teal, fontFamily: TYPE }}>AI</div>} />
        <div style={{ position: "absolute", left: 490, top: 20, width: 12, height: 260, background: P.ink }} />
        <Box l="judge" c={P.mustard} x={540} show={g > 20} icon={<div style={{ fontFamily: HAND, fontSize: 130, color: P.red }}>?</div>} />
        <Hand size={42} style={{ position: "absolute", left: 120, top: 300 }} show={g > 40}>can the judge tell which is the machine?</Hand>
      </div>
      <Source>{SRC_TUR}</Source>
    </PaperCard>
  );
};

// ---------- ending (all four) ----------
const SeventyOne: React.FC = () => {
  const g = useTwos();
  const p = interpolate(g, [4, 60], [0, 1], clamp);
  const marks = [{ y: 1950, l: "the question" }, { y: 1955, l: "the name" }, { y: 2026, l: "in your pocket" }];
  const X = (y: number) => (y === 1950 ? 110 : y === 1955 ? 340 : 760); // broken axis
  const end = 60 + 760 * p;
  return (
    <PaperCard seed="sp11" rot={1} tag={TAG}>
      <Title sub="…later, that idea fits in your pocket">71 years</Title>
      <svg width={880} height={320} style={{ marginTop: 50 }}>
        <line x1={60} y1={140} x2={Math.min(end, 470)} y2={140} stroke={P.ink} strokeWidth={8} strokeLinecap="round" />
        {end > 530 && <line x1={530} y1={140} x2={end} y2={140} stroke={P.ink} strokeWidth={8} strokeLinecap="round" />}
        {end > 480 && <path d="M478 160 L498 120 M502 160 L522 120" stroke={P.ink} strokeWidth={6} strokeLinecap="round" />}
        {marks.map((m, i) => X(m.y) <= end + 1 && (
          <g key={m.y}><circle cx={X(m.y)} cy={140} r={22} fill={[P.mustard, P.teal, P.red][i]} stroke={P.ink} strokeWidth={4} />
            <text x={X(m.y)} y={95} textAnchor="middle" fontSize={50} fontWeight={900} fill={P.ink}>{m.y}</text>
            <text x={X(m.y)} y={215} textAnchor="middle" fontSize={40} fontFamily={HAND} fill={P.muted}>{m.l}</text></g>
        ))}
        {p >= 1 && <g transform="translate(735 238)"><rect width={50} height={80} rx={9} fill={P.paper2} stroke={P.ink} strokeWidth={4} /><rect x={8} y={10} width={34} height={52} rx={3} fill={`${P.teal}66`} /></g>}
      </svg>
    </PaperCard>
  );
};

const { rune, ture, saga, cara } = CHARACTERS;
export const SHOW: Show = {
  presenter: rune,
  stage: true,
  poster: { title: "Who invented \"artificial intelligence\"?", kicker: "SPECIAL EDITION \u00b7 AI HISTORY" },
  plates: [
    { t: 0, C: FirstMentioned, mood: "body", tint: "#8b5cf6", chip: "SPECIAL · AI ORIGINS", cast: [{ id: "lumi", expr: "surprised", talk: true }, { id: "wattson", expr: "smug" }, { id: "pixel", expr: "happy" }] },
    { t: seg("y1955"), C: Aug1955, mood: "body", tint: "#f59e0b", chip: "1955 · THE PROPOSAL", cast: [{ id: "wattson", expr: "neutral", talk: true }, { id: "lumi", expr: "surprised" }] },
    { t: word("y1955", "a"), C: McCarthy, mood: "body", tint: "#f59e0b", chip: "1955 · THE PROPOSAL", cast: [{ id: "wattson", expr: "smug", talk: true }, { id: "lumi", expr: "happy" }] },
    { t: word("y1955", "with"), C: FourNames, mood: "body", tint: "#f59e0b", chip: "1955 · THE PROPOSAL", cast: [{ id: "wattson", expr: "happy", talk: true }, { id: "lumi", expr: "surprised" }] },
    { t: word("y1955", "and", 1), C: TheTitle, mood: "body", tint: "#f59e0b", chip: "1955 · THE NAME", cast: [{ id: "wattson", expr: "surprised", talk: true }, { id: "lumi", expr: "love" }] },
    { t: seg("y1956"), C: TwoMonthsTen, mood: "body", tint: "#22c55e", chip: "1956 · DARTMOUTH", cast: [{ id: "pixel", expr: "happy", talk: true }, { id: "chip", expr: "surprised" }] },
    { t: word("y1956", "at"), C: Dartmouth, mood: "body", tint: "#22c55e", chip: "1956 · DARTMOUTH", cast: [{ id: "pixel", expr: "laugh", talk: true }, { id: "chip", expr: "happy" }] },
    { t: word("y1956", "their"), C: BoldIdea, mood: "body", tint: "#22c55e", chip: "1956 · THE BIG IDEA", cast: [{ id: "pixel", expr: "surprised", talk: true }, { id: "chip", expr: "confused" }] },
    { t: seg("y1950"), C: EvenOlder, mood: "body", tint: "#3b82f6", chip: "1950 · TURING", cast: [{ id: "cloudy", expr: "neutral", talk: true }, { id: "wattson", expr: "surprised" }] },
    { t: word("y1950", "alan"), C: Turing, mood: "body", tint: "#3b82f6", chip: "1950 · TURING", cast: [{ id: "cloudy", expr: "confused", talk: true }, { id: "wattson", expr: "neutral" }] },
    { t: word("y1950", "and"), C: ImitationGame, mood: "body", tint: "#3b82f6", chip: "1950 · TURING", cast: [{ id: "cloudy", expr: "happy", talk: true }, { id: "wattson", expr: "smug" }] },
    { t: seg("loop"), C: SeventyOne, mood: "body", tint: "#8b5cf6", chip: "71 YEARS LATER", cast: [{ id: "wattson", expr: "smug" }, { id: "chip", expr: "happy" }, { id: "lumi", expr: "happy", talk: true }, { id: "pixel", expr: "laugh" }, { id: "cloudy", expr: "laugh" }] },
  ],
};
