/** PROTOTYPE – "AI joke of the week" segment, told by the mascot Bouncy. */
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { P, HAND, PaperCard, clamp, onTwos } from "../presenter/kit";
import { ComicBurst } from "../presenter/banana";
import { Bouncy, Confetti, mouthOpen } from "../presenter/Bouncy";
import { FONT } from "../theme";
import words from "../../public/joke/words.json";

type Wd = { word: string; display: string; start: number; end: number; segment: string; keyword: boolean };
const WORDS = words as Wd[];
const FPS = 60;
const first = (seg: string) => WORDS.find((w) => w.segment === seg)!.start;
const SETUP = first("setup"), PUNCH = first("punch");
export const JOKE_LEN = Math.ceil((WORDS[WORDS.length - 1].end + 2.4) * FPS);

const Caption: React.FC<{ t: number }> = ({ t }) => {
  const seg = t < SETUP - 0.1 ? "intro" : t < PUNCH - 0.1 ? "setup" : "punch";
  const ws = WORDS.filter((w) => w.segment === seg);
  return (
    <div style={{ position: "absolute", left: 60, right: 170, top: 1010, background: "#fffdf7", borderLeft: `12px solid #A855F7`, borderRadius: 8, padding: "22px 28px", boxShadow: "0 10px 30px #0006", fontFamily: FONT, fontSize: 46, fontWeight: 800, color: P.ink, lineHeight: 1.25 }}>
      {ws.map((w, i) => {
        const on = t >= w.start, active = on && t < w.end + 0.05;
        return <span key={i} style={{ opacity: on ? 1 : 0.35, color: w.keyword && on ? P.mustard : P.ink, borderBottom: active ? `5px solid ${P.mustard}` : "5px solid transparent" }}>{w.display} </span>;
      })}
    </div>
  );
};

const Board: React.FC<{ t: number }> = ({ t }) => {
  const f = useCurrentFrame();
  const g = onTwos(f);
  const setupOn = t >= SETUP;
  const punchOn = t >= PUNCH;
  const slap = interpolate(f, [Math.round(PUNCH * FPS), Math.round(PUNCH * FPS) + 8], [2.2, 1], clamp);
  return (
    <PaperCard seed="joke" rot={-1.2} tag="AI BOUNCE · JOKE OF THE WEEK">
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ fontSize: 56, fontWeight: 900 }}>AI joke of the week</div>
        <div style={{ fontSize: 60, transform: `rotate(${Math.sin(g / 6) * 12}deg)` }}>🤖</div>
      </div>
      <div style={{ fontFamily: HAND, fontSize: 40, color: P.mustard }}>certified groan-worthy</div>
      <div style={{ marginTop: 40, fontSize: 58, fontWeight: 900, lineHeight: 1.15, opacity: setupOn ? 1 : 0, transform: `translateX(${setupOn ? 0 : -40}px)` }}>Why did the AI<br />cross the road?</div>
      {punchOn && (
        <div style={{ marginTop: 34, padding: "18px 26px", background: `${P.mustard}55`, border: `5px solid ${P.ink}`, borderRadius: 16, fontSize: 52, fontWeight: 900, transform: `rotate(2deg) scale(${slap})`, display: "inline-block" }}>
          It was trained on<br /><span style={{ color: P.red }}>chicken data!</span> 🐔
        </div>
      )}
    </PaperCard>
  );
};

export const JokeProto: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const end = WORDS[WORDS.length - 1].end;
  const mood = t > end + 0.1 ? "laugh" : t >= PUNCH ? "talk" : t >= SETUP + 0.9 && t < PUNCH ? "wow" : "talk";
  const enter = interpolate(f, [0, 18], [900, 0], { ...clamp });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Img src={staticFile("chars/bg_saga.jpg")} style={{ width: 1080, height: 1920, objectFit: "cover", transform: "scale(1.08)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 40%, #0009 100%)" }} />
      <AbsoluteFill style={{ top: 200, alignItems: "center" }}><Board t={t} /></AbsoluteFill>
      <div style={{ position: "absolute", left: 300, top: 1200, transform: `translateX(${enter}px)` }}>
        <Bouncy size={480} mood={mood} open={mouthOpen(WORDS, t)} />
      </div>
      <Caption t={t} />
      <ComicBurst text="BA-DUM-TSS!" at={Math.round((end + 0.15) * FPS)} x={830} y={890} color={P.red} size={0.75} dur={80} rot={8} />
      <Confetti at={Math.round((end + 0.15) * FPS)} />
      <Audio src={staticFile("joke/voiceover.mp3")} />
      <Sequence from={Math.round((end + 0.15) * FPS)}><Audio src={staticFile("brand/rimshot.wav")} volume={0.8} /></Sequence>
      <Audio src={staticFile("music.wav")} volume={0.6} />
    </AbsoluteFill>
  );
};
