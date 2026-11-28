/** AI JOKE OF THE WEEK #1 – Bouncy at the AI Bounce Comedy Club. Voice: scripts/episodes/joke-week-01-en.* */
import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { C as T } from "../theme";
import { CHARACTERS } from "../presenter/characters";
import { seg, type Show } from "../presenter/Show";
import { P, HAND, PaperCard, Hand, Stamp, useTwos, clamp } from "../presenter/kit";
import { ComicBurst } from "../presenter/banana";
import { Confetti } from "../presenter/Bouncy";
import WORDS from "../data/words.json";

export const WEEK_LABEL = "JOKE";
export const SEG_COLOR: Record<string, string> = { intro: T.pink, setup: T.cyan, punch: T.amber };
const TAG = "AI BOUNCE · JOKE OF THE WEEK #1";
const FPS = 60;
const PUNCH = seg("punch");
const PEND = (WORDS as { end: number }[])[(WORDS as unknown[]).length - 1].end;

const Intro: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="jw1" rot={-1.5} tag={TAG}>
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <div style={{ fontSize: 50, fontWeight: 800, color: P.muted, letterSpacing: 6 }}>TONIGHT'S SET</div>
        <div style={{ fontSize: 120, fontWeight: 900, lineHeight: 1.0, marginTop: 10 }}>AI JOKE<br />OF THE WEEK</div>
        <div style={{ fontSize: 110, marginTop: 30, transform: `rotate(${Math.sin(g / 5) * 10}deg)` }}>🎤</div>
      </div>
      <div style={{ position: "absolute", right: 30, bottom: 40 }}><Stamp at={20} size={44} color={P.red} rot={-6}>CERTIFIED GROAN-WORTHY</Stamp></div>
    </PaperCard>
  );
};

const Setup: React.FC = () => {
  const g = useTwos();
  return (
    <PaperCard seed="jw2" rot={1} tag={TAG}>
      <Hand size={46} color={P.mustard}>the setup…</Hand>
      <div style={{ marginTop: 50, fontSize: 104, fontWeight: 900, lineHeight: 1.05 }}>Why did the AI<br />cross the road?</div>
      <div style={{ display: "flex", gap: 30, marginTop: 70, justifyContent: "center" }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ fontSize: 110, fontWeight: 900, color: P.teal, transform: `translateY(${-Math.abs(Math.sin((g + i * 8) / 7)) * 30}px)` }}>?</div>)}
      </div>
      <Hand size={40} color={P.muted} style={{ textAlign: "center", transformOrigin: "center" }} show={g > 90}>(thinking… 0.9 seconds)</Hand>
    </PaperCard>
  );
};

const Punch: React.FC = () => {
  const g = useTwos();
  const slap = interpolate(g, [0, 8], [2.4, 1], clamp);
  const end = Math.round((PEND - PUNCH) * FPS);
  return (
    <PaperCard seed="jw3" rot={-1} tag={TAG}>
      <Hand size={46} color={P.mustard}>the punchline:</Hand>
      <div style={{ marginTop: 40, padding: "30px 34px", background: `${P.mustard}55`, border: `6px solid ${P.ink}`, borderRadius: 22, fontSize: 84, fontWeight: 900, lineHeight: 1.1, transform: `rotate(2deg) scale(${slap})`, display: "inline-block" }}>
        It was trained on<br /><span style={{ color: P.red }}>chicken data!</span>
      </div>
      <div style={{ fontSize: 160, textAlign: "center", marginTop: 40, transform: `rotate(${Math.sin(g / 3) * 14}deg)` }}>🐔</div>
      <ComicBurst text="BA-DUM-TSS!" at={end + 6} x={600} y={560} color={P.red} size={0.8} dur={120} />
      <Confetti at={end + 6} />
      <Sequence from={end + 6}><Audio src={staticFile("brand/rimshot.wav")} volume={0.8} /></Sequence>
    </PaperCard>
  );
};

export const SHOW: Show = {
  presenter: CHARACTERS.bouncy,
  scene: "club",
  poster: { title: "Joke of the week", kicker: "COMEDY CLUB \u00b7 JOKE #1" },
  plates: [
    { t: 0, C: Intro, mood: "body", bouncy: "talk", tint: "#ec4899", chip: "JOKE OF THE WEEK" },
    { t: seg("setup"), C: Setup, mood: "body", from: "left", bouncy: "wow", tint: "#22d3ee", chip: "THE SETUP" },
    { t: PUNCH, C: Punch, mood: "body", bouncy: "talk", tint: "#f59e0b", chip: "THE PUNCHLINE", laugh: PEND + 0.1 },
  ],
};
