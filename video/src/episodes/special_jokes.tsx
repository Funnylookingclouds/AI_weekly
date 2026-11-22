/** SPECIAL EDITION 5 – "Can AI be funny? Jokes then vs. now" – hosted by Bouncy. */
import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { C as T } from "../theme";
import { CHARACTERS } from "../presenter/characters";
import { word, seg, type Show } from "../presenter/Show";
import { P, HAND, PaperCard, Title, Source, Hand, Stamp, useTwos, clamp } from "../presenter/kit";
import { ComicBurst, VersusCard } from "../presenter/banana";
import { Confetti } from "../presenter/Bouncy";

export const WEEK_LABEL = "SPECIAL";
export const SEG_COLOR: Record<string, string> = { hook: T.purple, y23: T.amber, y23b: T.amber, y24: T.cyan, y26: T.pink, loop: T.purple };
const TAG = "AI BOUNCE · SPECIAL · AI JOKES";
const SRC23 = "Jentzsch & Kersting, \"ChatGPT is fun, but it is not funny!\" (WASSA 2023)";
const SRC24 = "Gorenz & Schwarz, PLOS ONE (Jul 2024)";
const FPS = 60;
const rel = (s: string, w: string, start: number, nth = 0) => Math.round((word(s, w, nth) - start) * FPS);

/** Sepia "old" paper overlay for 2023 boards. */
const Aged: React.FC = () => <div style={{ position: "absolute", inset: -34, background: "radial-gradient(ellipse at 50% 50%, #c9a46a22, #8a6a3a55)", mixBlendMode: "multiply", pointerEvents: "none" }} />;
const YearTag: React.FC<{ y: string; c: string }> = ({ y, c }) => (
  <div style={{ position: "absolute", right: 0, top: 0, padding: "4px 18px", border: `5px solid ${P.ink}`, background: c, fontSize: 50, fontWeight: 900, transform: "rotate(5deg)" }}>{y}</div>
);
const JokeCard: React.FC<{ q: string; a: string; showA: boolean; icon: React.ReactNode }> = ({ q, a, showA, icon }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 30 }}>
    <div style={{ flexShrink: 0 }}>{icon}</div>
    <div>
      <div style={{ fontSize: 46, fontWeight: 900, lineHeight: 1.15 }}>{q}</div>
      <div style={{ fontFamily: HAND, fontSize: 52, color: P.red, marginTop: 14, opacity: showA ? 1 : 0, transform: `translateX(${showA ? 0 : -30}px)` }}>{a}</div>
    </div>
  </div>
);

// ---------- hook ----------
const ThenVsNow: React.FC = () => (
  <PaperCard seed="jk0" rot={-1.2} tag={TAG}>
    <Title sub="special edition">Can AI actually be funny?</Title>
    <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
      <VersusCard w={860} h={420} left={<div style={{ fontSize: 84, fontWeight: 900, color: P.muted }}>2023</div>} right={<div style={{ fontSize: 84, fontWeight: 900, color: P.red }}>2026</div>} leftLabel="AI jokes then" rightLabel="AI jokes now" />
    </div>
  </PaperCard>
);

// ---------- 2023 ----------
const Y23 = seg("y23");
const Asks: React.FC = () => {
  const g = useTwos();
  const n = Math.round(interpolate(g, [rel("y23", "one", Y23), rel("y23", "times", Y23)], [0, 1008], clamp));
  return (
    <PaperCard seed="jk1" rot={1} tag={TAG}>
      <Aged /><YearTag y="2023" c="#e8d9b0" />
      <Title sub="researchers kept asking ChatGPT…">"Tell me a joke"</Title>
      <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 50 }}>
        <div style={{ padding: "22px 30px", border: `4px solid ${P.ink}`, borderRadius: "36px 36px 36px 8px", background: P.paper2, fontSize: 40, fontWeight: 800 }}>Tell me a joke 🙂</div>
        <div><div style={{ fontSize: 130, fontWeight: 900, color: P.red, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{n.toLocaleString("en-US")}</div><Hand size={46}>times</Hand></div>
      </div>
      <Source>{SRC23}</Source>
    </PaperCard>
  );
};
const SameJoke: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="jk2" rot={-0.9} tag={TAG}>
      <Aged /><YearTag y="2023" c="#e8d9b0" />
      <Title sub="over 90% of answers were…">The same 25 jokes</Title>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 86px)", gap: 8, marginTop: 30, justifyContent: "center" }}>
        {[...Array(25)].map((_, i) => <div key={i} style={{ height: 70, border: `3px solid ${P.ink}`, borderRadius: 8, background: P.paper2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, transform: `scale(${g > i * 1.5 ? 1 : 0}) rotate(${(i % 5 - 2) * 3}deg)` }}>😐</div>)}
      </div>
      <div style={{ position: "absolute", right: 20, bottom: 50 }}><Stamp at={45} size={60}>SAME JOKE</Stamp></div>
      <Source>{SRC23}</Source>
    </PaperCard>
  );
};
const S1 = word("y23", "the", 1);
const Scarecrow: React.FC = () => {
  const g = useTwos();
  const pa = rel("y23", "because", S1);
  return (
    <PaperCard seed="jk3" rot={1} tag={TAG}>
      <Aged /><YearTag y="2023" c="#e8d9b0" />
      <Title sub="ChatGPT's #1 most-told joke">The number one hit</Title>
      <JokeCard q="Why did the scarecrow win an award?" a="…he was outstanding in his field." showA={g > pa}
        icon={<svg width={200} height={240} viewBox="0 0 20 24"><line x1={10} y1={4} x2={10} y2={24} stroke={P.ink} strokeWidth={1} /><line x1={2} y1={10} x2={18} y2={10} stroke={P.ink} strokeWidth={1} /><circle cx={10} cy={5} r={3} fill={`${P.mustard}`} stroke={P.ink} strokeWidth={0.6} /><path d="M5 3 L15 3 L13 1 L7 1 Z" fill="#8a5a2b" stroke={P.ink} strokeWidth={0.5} /><path d="M6 10 L14 10 L13 17 L7 17 Z" fill={`${P.teal}88`} stroke={P.ink} strokeWidth={0.6} />{[0, 1, 2].map((i) => <path key={i} d={`M${2 + i * 6} 24 l1 -3 l1 3`} stroke={P.green} strokeWidth={0.6} fill="none" />)}</svg>} />
      <ComicBurst text="ba-dum-tss…" at={pa + 100} x={700} y={560} color="#c8bfae" size={0.55} dur={70} rot={-4} />
      <Source>{SRC23}</Source>
    </PaperCard>
  );
};
const Y23B = seg("y23b");
const Tomato: React.FC = () => {
  const g = useTwos();
  const pa = rel("y23b", "it", Y23B);
  return (
    <PaperCard seed="jk4" rot={-1} tag={TAG}>
      <Aged /><YearTag y="2023" c="#e8d9b0" />
      <Title sub="#2 most-told">Number two</Title>
      <JokeCard q="Why did the tomato turn red?" a="…it saw the salad dressing." showA={g > pa}
        icon={<svg width={200} height={200} viewBox="0 0 20 20"><circle cx={10} cy={11} r={8} fill={g > pa ? "#d9412b" : "#e8743b"} stroke={P.ink} strokeWidth={0.7} /><path d="M7 3 L10 5 L13 3 L11 6 L9 6 Z" fill={P.green} stroke={P.ink} strokeWidth={0.5} /><ellipse cx={6.5} cy={12} rx={1.5} ry={0.8} fill="#f9a8d4" opacity={g > pa ? 1 : 0} /><ellipse cx={13.5} cy={12} rx={1.5} ry={0.8} fill="#f9a8d4" opacity={g > pa ? 1 : 0} /><circle cx={8} cy={10} r={0.8} fill={P.ink} /><circle cx={12} cy={10} r={0.8} fill={P.ink} /></svg>} />
      <div style={{ position: "absolute", right: 20, bottom: 60 }}><Stamp at={pa + 40} size={44} color={P.muted} rot={6}>YAWN…</Stamp></div>
      <Source>{SRC23}</Source>
    </PaperCard>
  );
};

// ---------- 2024 ----------
const Funnier: React.FC = () => {
  const g = useTwos();
  const a = interpolate(g, [20, 70], [0, 1], clamp);
  return (
    <PaperCard seed="jk5" rot={1.1} tag={TAG}>
      <YearTag y="2024" c={`${P.teal}66`} />
      <Title sub="who wrote the funnier joke? (blind test)">One year later…</Title>
      <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 26 }}>
        {[{ l: "ChatGPT", v: 70, c: P.teal }, { l: "Humans", v: 25, c: P.muted }, { l: "Equal", v: 5, c: P.mustard }].map((r) => (
          <div key={r.l} style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 200, fontSize: 40, fontWeight: 900 }}>{r.l}</div>
            <div style={{ width: 560 * (r.v / 70) * a, height: 70, border: `4px solid ${P.ink}`, borderRadius: 10, background: `repeating-linear-gradient(-45deg, ${r.c}aa 0 12px, ${r.c}66 12px 24px)` }} />
            <div style={{ fontSize: 44, fontWeight: 900, opacity: a }}>~{r.v}%</div>
          </div>
        ))}
      </div>
      <ComicBurst text="WHAT?!" at={72} x={740} y={150} color={P.red} size={0.6} />
      <Source>{SRC24} · ChatGPT-3.5 vs. human-written jokes</Source>
    </PaperCard>
  );
};

// ---------- 2026 ----------
const Y26 = seg("y26");
const Now26: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="jk6" rot={-1} tag={TAG}>
      <YearTag y="2026" c={`${P.red}88`} />
      <Title sub="a brand-new joke">Fresh from 2026</Title>
      <div style={{ position: "relative" }}>
        <div style={{ marginTop: 60, fontSize: 56, fontWeight: 900, lineHeight: 1.15, opacity: g > rel("y26", "i", Y26) ? 1 : 0 }}>"I told my AI to<br />stop overthinking."</div>
      </div>
      <div style={{ position: "absolute", right: 30, bottom: 60 }}><Stamp at={rel("y26", "written", Y26)} size={52} color={P.teal}>WRITTEN BY AI</Stamp></div>
    </PaperCard>
  );
};
const SURE = word("y26", "sure");
const Punch26: React.FC = () => {
  const g = useTwos();
  const endF = Math.round((word("y26", "seconds") + 0.5 - SURE) * FPS);
  const slap = interpolate(g, [0, 8], [2, 1], clamp);
  return (
    <PaperCard seed="jk7" rot={1} tag={TAG}>
      <YearTag y="2026" c={`${P.red}88`} />
      <Title sub="it said…">"Sure –</Title>
      <div style={{ marginTop: 40, padding: "24px 30px", background: `${P.mustard}55`, border: `5px solid ${P.ink}`, borderRadius: 16, fontSize: 58, fontWeight: 900, lineHeight: 1.15, transform: `rotate(-2deg) scale(${slap})`, display: "inline-block" }}>
        let me think about that<br />for <span style={{ color: P.red }}>30 seconds</span>."
      </div>
      <div style={{ marginTop: 30, display: "flex", gap: 9 }}>{[...Array(30)].map((_, i) => <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: g > 20 + i * 4 ? P.teal : "#0001", border: `2px solid ${P.ink}` }} />)}</div>
      <ComicBurst text="BA-DUM-TSS!" at={endF} x={720} y={620} color={P.red} size={0.8} dur={90} rot={6} />
      <Sequence from={endF}><Audio src={staticFile("brand/rimshot.wav")} volume={0.8} /></Sequence>
      <Confetti at={endF} />
      <Source>Written by an AI (Claude) for AI Bounce, 2026</Source>
    </PaperCard>
  );
};

// ---------- ending ----------
const GrowingUp: React.FC = () => {
  const g = useTwos();
  const p = interpolate(g, [6, 50], [0, 1], clamp);
  return (
    <PaperCard seed="jk8" rot={-1} tag={TAG}>
      <Title sub="…AI comedy is growing up">From scarecrows to self-roasts</Title>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 40, marginTop: 50 }}>
        <div style={{ fontSize: 150, filter: "grayscale(0.7)", opacity: 1 - p * 0.5 }}>🌾</div>
        <svg width={260} height={80}><path d={`M10 40 L${10 + 220 * p} 40`} stroke={P.red} strokeWidth={10} strokeLinecap="round" />{p > 0.95 && <path d="M200 15 L245 40 L200 65" stroke={P.red} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />}</svg>
        <div style={{ fontSize: 150, transform: `scale(${p}) rotate(${Math.sin(g / 6) * 10}deg)` }}>😂</div>
      </div>
      <div style={{ textAlign: "center", fontSize: 54, fontWeight: 900, marginTop: 30, opacity: p }}>2023 → 2026</div>
      <Source>{SRC23} · {SRC24}</Source>
    </PaperCard>
  );
};

export const SHOW: Show = {
  presenter: CHARACTERS.bouncy,
  plates: [
    { t: 0, C: ThenVsNow, mood: "body", from: "top", bouncy: "talk" },
    { t: Y23, C: Asks, mood: "body", from: "left", bouncy: "talk" },
    { t: word("y23", "over"), C: SameJoke, mood: "body", bouncy: "wow" },
    { t: S1, C: Scarecrow, mood: "body", from: "left", bouncy: "bored" },
    { t: Y23B, C: Tomato, mood: "body", from: "right", bouncy: "bored" },
    { t: seg("y24"), C: Funnier, mood: "body", from: "top", bouncy: "wow" },
    { t: Y26, C: Now26, mood: "body", from: "left", bouncy: "wink" },
    { t: SURE, C: Punch26, mood: "body", from: "top", bouncy: "talk" },
    { t: seg("loop"), C: GrowingUp, mood: "body", from: "left", bouncy: "laugh" },
  ],
};
