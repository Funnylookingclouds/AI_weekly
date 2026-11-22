/** SPECIAL EDITION 6 – "Has AI ever won a roast battle?" – Bouncy hosts, mini roast vs. Ture. */
import React from "react";
import { Audio, Img, Sequence, interpolate, staticFile } from "remotion";
import { C as T } from "../theme";
import { CHARACTERS } from "../presenter/characters";
import { word, seg, type Show } from "../presenter/Show";
import { P, HAND, PaperCard, Title, Source, Hand, Stamp, useTwos, clamp } from "../presenter/kit";
import { ComicBurst, Scoreboard, VersusCard } from "../presenter/banana";
import { Bouncy, Confetti } from "../presenter/Bouncy";

export const WEEK_LABEL = "SPECIAL";
export const SEG_COLOR: Record<string, string> = { hook: T.pink, facts: T.amber, settle: T.purple, ture1: T.amber, bouncy1: T.purple, ture2: T.amber, loop: T.pink };
const TAG = "AI BOUNCE · SPECIAL · ROAST BATTLE";
const FPS = 60;
const rel = (s: string, w: string, start: number, nth = 0) => Math.round((word(s, w, nth) - start) * FPS);
const SRC_FACTS = "UnHerd (2023, NY – single report) · Streets of Toronto · Daily Californian (SF)";

const Flames: React.FC<{ n?: number; at?: number; w?: number }> = ({ n = 5, at = 0, w = 600 }) => {
  const g = useTwos() - at;
  if (g < 0) return null;
  return (
    <svg width={w} height={160} style={{ position: "absolute", left: (880 - w) / 2, bottom: 40 }}>
      {[...Array(n)].map((_, i) => {
        const x = (i + 0.5) * (w / n);
        const h = 80 + Math.abs(Math.sin((g + i * 7) / 4)) * 60;
        return <g key={i}><path d={`M${x - 34} 160 Q${x - 40} ${160 - h * 0.6} ${x} ${160 - h} Q${x + 40} ${160 - h * 0.6} ${x + 34} 160 Z`} fill={P.red} stroke={P.ink} strokeWidth={4} /><path d={`M${x - 16} 160 Q${x - 18} ${160 - h * 0.35} ${x} ${160 - h * 0.55} Q${x + 18} ${160 - h * 0.35} ${x + 16} 160 Z`} fill={P.mustard} /></g>;
      })}
    </svg>
  );
};
const Mic: React.FC<{ s?: number }> = ({ s = 220 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><rect x={8} y={2} width={8} height={12} rx={4} fill={`${P.muted}88`} stroke={P.ink} strokeWidth={1.3} />{[5, 8, 11].map((y) => <line key={y} x1={9} y1={y} x2={15} y2={y} stroke={P.ink} strokeWidth={0.6} />)}<path d="M5 11 a7 7 0 0 0 14 0" stroke={P.ink} strokeWidth={1.3} fill="none" /><line x1={12} y1={18} x2={12} y2={22} stroke={P.ink} strokeWidth={1.3} /><line x1={8} y1={22} x2={16} y2={22} stroke={P.ink} strokeWidth={1.3} /></svg>
);

// ---------- hook ----------
const Hook: React.FC = () => (
  <PaperCard seed="ro0" rot={-1.2} tag={TAG}>
    <Title sub="special edition">Has AI ever won a roast battle?</Title>
    <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}><Mic /></div>
    <Flames at={10} />
    <div style={{ position: "absolute", right: 20, top: 200 }}><Stamp at={rel("hook", "yes", 0)} size={58} color={P.green}>YES…</Stamp></div>
    <div style={{ position: "absolute", right: 30, top: 320 }}><Stamp at={rel("hook", "sometimes", 0)} size={40} color={P.muted} rot={6}>SOMETIMES</Stamp></div>
  </PaperCard>
);

// ---------- facts: map with three cities ----------
const CITIES = [
  { n: "New York", x: 640, y: 250, res: "AI WIN*", c: P.teal, note: "2023 · ChatGPT bot beat a comic" },
  { n: "Toronto", x: 560, y: 150, res: "AI: ONLY 2 WINS", c: P.mustard, note: "comics vs. AI avatar" },
  { n: "San Francisco", x: 110, y: 270, res: "HUMAN WIN", c: P.red, note: "rapper beat AI Confucius" },
];
const MapBoard: React.FC<{ stage: number }> = ({ stage }) => {
  const g = useTwos();
  return (
    <PaperCard seed="ro1" rot={1} tag={TAG}>
      <Title sub="real AI vs. human roast battles">The scoreboard so far</Title>
      <div style={{ position: "relative", height: 470, marginTop: 10 }}>
        <svg width={880} height={420} viewBox="0 0 880 420">
          <path d="M40 120 Q120 60 260 90 Q400 40 560 80 Q700 60 800 140 Q840 220 760 300 Q640 360 520 330 Q380 380 240 340 Q100 320 60 250 Z" fill={`${P.green}22`} stroke={P.ink} strokeWidth={4} strokeDasharray="10 6" />
          <text x={300} y={330} fontFamily={HAND} fontSize={36} fill={P.muted}>North America</text>
        </svg>
        {CITIES.map((c, i) => {
          if (i > stage) return null;
          const fresh = i === stage;
          const s = fresh ? interpolate(g, [0, 8], [0, 1], clamp) : 1;
          return (
            <div key={c.n} style={{ position: "absolute", left: c.x - 20, top: c.y - 60, transform: `scale(${s})`, transformOrigin: "20px 60px" }}>
              <svg width={40} height={60} viewBox="0 0 20 30"><path d="M10 29 C4 19 1 15 1 10 a9 9 0 0 1 18 0 c0 5 -3 9 -9 19 Z" fill={c.c} stroke={P.ink} strokeWidth={1.5} /><circle cx={10} cy={10} r={3.5} fill={P.paper2} /></svg>
              <div style={{ position: "absolute", left: c.x > 600 ? -230 : 46, top: -10, width: 240, fontSize: 30, fontWeight: 900 }}>{c.n}</div>
            </div>
          );
        })}
        {stage >= 0 && (() => { const c = CITIES[stage]; return (
          <div style={{ position: "absolute", left: 20, bottom: 0, display: "flex", alignItems: "center", gap: 20 }}>
            <Stamp at={8} size={44} color={c.c} rot={-4}>{c.res}</Stamp>
            <Hand size={38} color={P.ink}>{c.note}</Hand>
          </div>); })()}
      </div>
      <Source>{SRC_FACTS}{stage === 0 ? " · *single report" : ""}</Source>
    </PaperCard>
  );
};
const NY: React.FC = () => <MapBoard stage={0} />;
const TO: React.FC = () => <MapBoard stage={1} />;
const SF: React.FC = () => <MapBoard stage={2} />;

// ---------- settle it ----------
const Settle: React.FC = () => (
  <PaperCard seed="ro2" rot={-1} tag={TAG}>
    <Title sub="the AI Bounce roast battle">Let's settle it!</Title>
    <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
      <VersusCard w={860} h={440} left={<Img src={staticFile("chars/ture_laugh.png")} style={{ height: 250 }} />} right={<div style={{ transform: "scale(0.42)", margin: -120 }}><Bouncy size={420} bounce={false} mood="wink" /></div>} leftLabel="TURE" rightLabel="BOUNCY" />
    </div>
    <ComicBurst text="DING DING!" at={rel("settle", "ture", seg("settle"))} x={700} y={130} color={P.mustard} size={0.6} />
  </PaperCard>
);

// ---------- roasts ----------
const RoastCard: React.FC<{ line: React.ReactNode; by: string; a: number; b: number; pa?: number; pb?: number; flipAt: number; burst: string; burstAt: number; c: string }> = ({ line, by, a, b, pa, pb, flipAt, burst, burstAt, c }) => (
  <PaperCard seed={`ro${by}${a}${b}`} rot={by === "TURE" ? -1 : 1} tag={TAG}>
    <div style={{ display: "flex", justifyContent: "center" }}><Scoreboard left="TURE" right="BOUNCY" a={a} b={b} prevA={pa} prevB={pb} label="ROAST" flipAt={flipAt} /></div>
    <div style={{ marginTop: 40, padding: "24px 30px", background: `${c}33`, border: `5px solid ${P.ink}`, borderRadius: "40px 40px 40px 10px", fontSize: 50, fontWeight: 900, lineHeight: 1.15 }}>{line}</div>
    <Hand size={40} color={P.muted} style={{ marginTop: 12 }}>— {by.toLowerCase()}</Hand>
    <Flames at={burstAt} n={4} w={460} />
    <ComicBurst text={burst} at={burstAt} x={720} y={560} color={P.red} size={0.75} dur={70} />
    <Sequence from={burstAt}><Audio src={staticFile("pop.wav")} volume={0.6} /></Sequence>
  </PaperCard>
);
const T1 = seg("ture1"), B1 = seg("bouncy1");
const Roast1: React.FC = () => <RoastCard by="TURE" c={P.mustard} a={1} b={0} pa={0} pb={0} flipAt={rel("ture1", "edges", T1) + 20} burst="OOF!" burstAt={rel("ture1", "edges", T1) + 20} line={<>"Bouncy, you're so round, even your opinions have <span style={{ color: P.red }}>no edges</span>."</>} />;
const Roast2: React.FC = () => <RoastCard by="BOUNCY" c="#A855F7" a={1} b={1} pa={1} pb={0} flipAt={rel("bouncy1", "model", B1) + 20} burst="BURN!" burstAt={rel("bouncy1", "model", B1) + 20} line={<>"Ture, your beard has more <span style={{ color: P.red }}>parameters</span> than my whole model."</>} />;
const Okay: React.FC = () => (
  <PaperCard seed="ro5" rot={-1} tag={TAG}>
    <div style={{ display: "flex", justifyContent: "center" }}><Scoreboard left="TURE" right="BOUNCY" a={1} b={1} label="ROAST" /></div>
    <div style={{ marginTop: 70, textAlign: "center", fontFamily: HAND, fontSize: 90, color: P.ink }}>"…okay.<br />That was good."</div>
  </PaperCard>
);

// ---------- ending ----------
const Tie: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="ro6" rot={1} tag={TAG}>
      <div style={{ display: "flex", justifyContent: "center" }}><Scoreboard left="HUMANS" right="AI" a={1} b={1} label="FINAL" /></div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 80 }}><Stamp at={rel("loop", "tie", seg("loop"))} size={130} color={P.green} rot={-8}>TIE!</Stamp></div>
      <Hand size={46} style={{ textAlign: "center", marginTop: 40, transformOrigin: "center" }} show={g > 30}>the roast war continues…</Hand>
      <Confetti at={rel("loop", "tie", seg("loop"))} />
      <Source>{SRC_FACTS} · roast lines written for AI Bounce</Source>
    </PaperCard>
  );
};

const { ture } = CHARACTERS;
const FACTS = seg("facts");
export const SHOW: Show = {
  presenter: CHARACTERS.bouncy,
  plates: [
    { t: 0, C: Hook, mood: "body", from: "top", bouncy: "talk" },
    { t: FACTS, C: NY, mood: "body", from: "left", bouncy: "talk" },
    { t: word("facts", "but"), C: TO, mood: "body", bouncy: "wow" },
    { t: word("facts", "and"), C: SF, mood: "body", bouncy: "talk" },
    { t: seg("settle"), C: Settle, mood: "body", from: "top", bouncy: "wink" },
    { t: T1, C: Roast1, mood: "happy", from: "left", who: ture },
    { t: B1, C: Roast2, mood: "body", from: "right", bouncy: "talk" },
    { t: seg("ture2"), C: Okay, mood: "happy", from: "left", who: ture },
    { t: seg("loop"), C: Tie, mood: "body", from: "top", bouncy: "laugh" },
  ],
};
