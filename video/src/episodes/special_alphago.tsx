/** SPECIAL EDITION 4 – "The move that shocked the world" (AlphaGo, Move 37) – relay + banana graphics. */
import React from "react";
import { interpolate } from "remotion";
import { C as T } from "../theme";
import { CHARACTERS } from "../presenter/characters";
import { word, seg, type Show } from "../presenter/Show";
import { P, HAND, PaperCard, Title, Source, Hand, InkChip, useTwos, clamp } from "../presenter/kit";
import { ComicBurst, Scoreboard, VersusCard, OddsDial, ReplayOverlay, Crowd, GoBoard, type Stone } from "../presenter/banana";

export const WEEK_LABEL = "SPECIAL";
export const SEG_COLOR: Record<string, string> = { hook: T.amber, match: T.cyan, move37: T.pink, comeback: T.green, loop: T.purple };
const TAG = "AI BOUNCE · SPECIAL · MOVE 37";
const SRC = "Google DeepMind – AlphaGo (deepmind.google)";
const FPS = 60;
/** frames from plate start to a word */
const rel = (segName: string, w: string, plateStart: number, nth = 0) => Math.round((word(segName, w, nth) - plateStart) * FPS);

const Human: React.FC<{ s?: number }> = ({ s = 170 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><circle cx={12} cy={7} r={4.2} fill={`${P.red}44`} stroke={P.ink} strokeWidth={1.4} /><path d="M4 22 C4 15.5 8 13.2 12 13.2 C16 13.2 20 15.5 20 22" fill={`${P.red}22`} stroke={P.ink} strokeWidth={1.4} /></svg>
);
const BASE: Stone[] = [
  { x: 3, y: 3, c: "b", at: 0 }, { x: 7, y: 7, c: "w", at: 4 }, { x: 3, y: 7, c: "b", at: 8 }, { x: 7, y: 3, c: "w", at: 12 },
  { x: 5, y: 3, c: "b", at: 16 }, { x: 4, y: 6, c: "w", at: 20 },
];

// ---------- hook (Rune) ----------
const T0 = 0;
const Odds: React.FC = () => (
  <PaperCard seed="ag0" rot={-1.2} tag={TAG}>
    <Title sub="special edition">One move. One chance in…</Title>
    <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}><OddsDial /></div>
    <ComicBurst text="WHAT?!" at={rel("hook", "played", T0)} x={700} y={560} color={P.red} size={0.9} />
  </PaperCard>
);

// ---------- match (Ture, commentator) ----------
const Versus: React.FC = () => (
  <PaperCard seed="ag1" rot={1} tag={TAG}>
    <Title sub="March 2016 · Seoul">The match of the decade</Title>
    <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
      <VersusCard left={<InkChip s={190} />} right={<Human s={190} />} leftLabel="AlphaGo" rightLabel="Lee Sedol" />
    </div>
    <Source>{SRC}</Source>
  </PaperCard>
);
const Trophies: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="ag2" rot={-0.9} tag={TAG}>
      <Title sub="the opponent">Lee Sedol: 18 world titles</Title>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 92px)", gap: 6, marginTop: 50, justifyContent: "center" }}>
        {[...Array(18)].map((_, i) => (
          <svg key={i} width={92} height={110} viewBox="0 0 24 28" style={{ transform: `translateY(${g > i * 2 ? 0 : -60}px) rotate(${(i % 3 - 1) * 5}deg)`, opacity: g > i * 2 ? 1 : 0 }}>
            <path d="M7 3h10v4a5 5 0 0 1-10 0V3Z M5 4H3v2a3 3 0 0 0 4 3 M19 4h2v2a3 3 0 0 1-4 3 M12 12v5 M8 24h8 M9 17h6v7H9z" fill={`${P.mustard}88`} stroke={P.ink} strokeWidth={1.2} strokeLinejoin="round" />
          </svg>
        ))}
      </div>
      <Source>{SRC}</Source>
    </PaperCard>
  );
};
const Positions: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="ag3" rot={1.1} tag={TAG}>
      <Title sub="the ancient board game">Go</Title>
      <div style={{ display: "flex", alignItems: "center", gap: 36, marginTop: 20 }}>
        <GoBoard stones={BASE} size={400} />
        <div>
          <div style={{ fontSize: 34, fontWeight: 800 }}>possible positions</div>
          <div style={{ fontSize: 96, fontWeight: 900, color: P.red, lineHeight: 1 }}>10<sup style={{ fontSize: 50 }}>170</sup></div>
          <div style={{ fontSize: 34, fontWeight: 800, marginTop: 20, opacity: g > 50 ? 1 : 0 }}>atoms in the universe</div>
          <div style={{ fontSize: 70, fontWeight: 900, color: P.muted, lineHeight: 1, opacity: g > 50 ? 1 : 0 }}>~10<sup style={{ fontSize: 36 }}>80</sup></div>
        </div>
      </div>
      <Source>{SRC} · observable universe ≈ 10^80 atoms</Source>
    </PaperCard>
  );
};
const Audience: React.FC = () => (
  <PaperCard seed="ag4" rot={-1} tag={TAG}>
    <Title sub="watching worldwide">The whole world tuned in</Title>
    <div style={{ marginTop: 20 }}><Crowd to={200} /></div>
    <Source>{SRC}</Source>
  </PaperCard>
);

// ---------- move 37 (Saga) ----------
const M37 = word("move37", "game");
const Move37: React.FC = () => (
  <PaperCard seed="ag5" rot={1} tag={TAG}>
    <div style={{ display: "flex", justifyContent: "center" }}><Scoreboard left="ALPHAGO" right="LEE" a={1} b={0} label="GAME 2 · MOVE 37" /></div>
    <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
      <GoBoard size={470} stones={[...BASE, { x: 5, y: 7, c: "b", at: 24 }, { x: 6, y: 5, c: "w", at: 30 }, { x: 8, y: 4, c: "b", at: rel("move37", "thirtyseven", M37), hl: true }]} />
    </div>
    <ComicBurst text="KA-CHUNK!" at={rel("move37", "thirtyseven", M37) + 2} x={720} y={420} size={0.85} />
  </PaperCard>
);
const M37B = word("move37", "commentators");
const Mistake: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="ag6" rot={-1} tag={TAG}>
      <Title sub="commentators' first reaction">A mistake…?</Title>
      <div style={{ position: "relative", display: "flex", justifyContent: "center", marginTop: 10 }}>
        <GoBoard size={430} stones={[...BASE, { x: 5, y: 7, c: "b", at: 0 }, { x: 6, y: 5, c: "w", at: 0 }, { x: 8, y: 4, c: "b", at: 0, hl: true }]} />
        <ReplayOverlay cx={240 + 430 * 0.8 + 20} cy={430 * 0.4 + 10} at={4} />
      </div>
      {["huh?", "a mistake?!", "strange…"].map((t, i) => (
        <div key={t} style={{ position: "absolute", right: 10 + (i % 2) * 40, top: 160 + i * 120, padding: "10px 20px", border: `4px solid ${P.ink}`, borderRadius: 30, background: P.paper2, fontFamily: HAND, fontSize: 44, transform: `scale(${g > 14 + i * 10 ? 1 : 0}) rotate(${(i - 1) * 6}deg)` }}>{t}</div>
      ))}
      <Source>{SRC}</Source>
    </PaperCard>
  );
};
const M37C = word("move37", "it");
const Overturned: React.FC = () => {
  const g = useTwos();
  const crack = interpolate(g, [rel("move37", "overturns", M37C), rel("move37", "overturns", M37C) + 12], [0, 1], clamp);
  return (
    <PaperCard seed="ag7" rot={0.8} tag={TAG}>
      <div style={{ display: "flex", justifyContent: "center" }}><Scoreboard left="ALPHAGO" right="LEE" a={2} b={0} prevA={1} prevB={0} label="AFTER GAME 2" flipAt={12} /></div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 40, marginTop: 50 }}>
        <svg width={320} height={260} viewBox="0 0 32 26">
          <path d="M2 4 Q9 2 16 5 Q23 2 30 4 V23 Q23 21 16 24 Q9 21 2 23 Z" fill={P.paper2} stroke={P.ink} strokeWidth={1} />
          <line x1={16} y1={5} x2={16} y2={24} stroke={P.ink} strokeWidth={0.8} />
          {[8, 11, 14, 17].map((y) => <line key={y} x1={4} y1={y} x2={14} y2={y} stroke={P.muted} strokeWidth={0.5} />)}
          <path d="M16 3 L14 9 L18 13 L13 18 L16 25" stroke={P.red} strokeWidth={1.4} fill="none" strokeDasharray={40} strokeDashoffset={40 * (1 - crack)} />
        </svg>
        <div><div style={{ fontSize: 60, fontWeight: 900, lineHeight: 1.05 }}>Centuries of<br />Go wisdom</div><Hand size={48} color={P.red} show={crack > 0.5}>…overturned</Hand></div>
      </div>
      <ComicBurst text="BOOM!" at={rel("move37", "overturns", M37C)} x={230} y={560} color={P.red} size={0.75} />
      <Source>{SRC}</Source>
    </PaperCard>
  );
};

// ---------- comeback (Cara) ----------
const CB = seg("comeback");
const Game4: React.FC = () => (
  <PaperCard seed="ag8" rot={-1} tag={TAG}>
    <div style={{ display: "flex", justifyContent: "center" }}><Scoreboard left="ALPHAGO" right="LEE" a={3} b={0} label="GAME 4" /></div>
    <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
      <GoBoard size={470} stones={[...BASE, { x: 2, y: 5, c: "b", at: 20 }, { x: 6, y: 2, c: "w", at: 30 }, { x: 4, y: 4, c: "b", at: 40 }]} />
    </div>
    <Hand size={46} rot={-6} style={{ position: "absolute", right: 0, top: 260, width: 190, lineHeight: 1.1 }}>Lee strikes back…</Hand>
  </PaperCard>
);
const GT = word("comeback", "gods");
const GodsTouch: React.FC = () => (
  <PaperCard seed="ag9" rot={1.1} tag={TAG}>
    <div style={{ display: "flex", justifyContent: "center" }}><Scoreboard left="ALPHAGO" right="LEE" a={3} b={1} prevA={3} prevB={0} label="GAME 4 · MOVE 78" flipAt={rel("comeback", "wins", GT)} /></div>
    <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
      <GoBoard size={470} stones={[...BASE, { x: 2, y: 5, c: "b", at: 0 }, { x: 6, y: 2, c: "w", at: 0 }, { x: 4, y: 4, c: "b", at: 0 }, { x: 6, y: 6, c: "w", at: 2, hl: true }]} />
    </div>
    <ComicBurst text="GOD'S TOUCH!" at={4} x={460} y={420} color={P.green} size={0.85} dur={70} />
    <Source>{SRC} · Move 78 also ~1 in 10,000</Source>
  </PaperCard>
);

// ---------- ending (all four) ----------
const Final: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="ag10" rot={-1} tag={TAG}>
      <div style={{ display: "flex", justifyContent: "center" }}><Scoreboard left="ALPHAGO" right="LEE" a={4} b={1} prevA={3} prevB={1} label="FINAL" flipAt={10} /></div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 30, marginTop: 60 }}>
        <svg width={170} height={170}><circle cx={85} cy={85} r={70} fill="#1c1a18" stroke={P.ink} strokeWidth={5} /><ellipse cx={60} cy={60} rx={18} ry={12} fill="#ffffff44" /></svg>
        <div style={{ fontFamily: HAND, fontSize: 110, color: P.red }}>+</div>
        <svg width={170} height={170}><circle cx={85} cy={85} r={70} fill="#f6f1e6" stroke={P.ink} strokeWidth={5} /><ellipse cx={60} cy={60} rx={18} ry={12} fill="#ffffffaa" /></svg>
      </div>
      <Hand size={56} style={{ textAlign: "center", marginTop: 30, transformOrigin: "center" }} show={g > 40}>both sides showed us something new</Hand>
      <Source>{SRC}</Source>
    </PaperCard>
  );
};

const { rune, ture, saga, cara } = CHARACTERS;
export const SHOW: Show = {
  presenter: rune,
  plates: [
    { t: T0, C: Odds, mood: "body", from: "top", who: rune },
    { t: seg("match"), C: Versus, mood: "happy", from: "top", who: ture },
    { t: word("match", "winner"), C: Trophies, mood: "body", from: "left", who: ture },
    { t: word("match", "at"), C: Positions, mood: "curious", who: ture },
    { t: word("match", "over"), C: Audience, mood: "happy", from: "left", who: ture },
    { t: M37, C: Move37, mood: "curious", from: "top", who: saga },
    { t: M37B, C: Mistake, mood: "serious", from: "left", who: saga },
    { t: M37C, C: Overturned, mood: "happy", who: saga },
    { t: CB, C: Game4, mood: "serious", from: "left", who: cara },
    { t: GT, C: GodsTouch, mood: "happy", from: "top", who: cara },
    { t: seg("loop"), C: Final, mood: "group", from: "top" },
  ],
};
