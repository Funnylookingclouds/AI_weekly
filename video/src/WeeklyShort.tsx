import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./theme";
import { WORDS, at, FPS, TOTAL_SEC, segStart } from "./timing";
import * as S from "./Scenes";
import { SceneTransition, TRANSITIONS, GlitchDefs, Shockwave, LightSweep, Particles, Overlay, useBeatPulse } from "./Effects";

type Beat = { t: number; C: React.FC; sfx?: "whoosh" | "pop" };

const BEATS: Beat[] = [
  { t: 0, C: S.MoneyHook },
  { t: at("hook", "and"), C: S.NotEvenTop, sfx: "whoosh" },
  { t: segStart("news1"), C: S.RiemannTitle, sfx: "whoosh" },
  { t: at("news1", "167"), C: S.Years167, sfx: "whoosh" },
  { t: at("news1", "proof", 1), C: S.LeanCheck, sfx: "whoosh" },
  { t: at("news1", "experts"), C: S.UnderReview, sfx: "pop" },
  { t: at("news1", "if"), C: S.Historic, sfx: "whoosh" },
  { t: segStart("news2"), C: S.SavesLives, sfx: "whoosh" },
  { t: at("news2", "an", 0), C: S.Ultrasound, sfx: "whoosh" },
  { t: at("news2", "found"), C: S.BarCompare, sfx: "pop" },
  { t: at("news2", "and"), C: S.SwedishData, sfx: "whoosh" },
  { t: segStart("news3"), C: S.Quickie, sfx: "pop" },
  { t: at("news3", "inkling"), C: S.Laptop, sfx: "whoosh" },
  { t: at("news3", "smart"), C: S.PrivateData, sfx: "pop" },
  { t: segStart("loop"), C: S.Recap, sfx: "whoosh" },
  { t: at("loop", "and"), C: S.LoopOut, sfx: "whoosh" },
];

const SEG_COLOR: Record<string, string> = { hook: C.green, news1: C.amber, news2: C.pink, news3: C.amber, loop: C.cyan };
const segOf = (t: number) => [...WORDS].reverse().find((w) => w.start <= t + 0.01)?.segment ?? "hook";

const SEG_LABEL: Record<string, string> = { hook: "", news1: "1/3", news2: "2/3", news3: "3/3", loop: "" };

const Background: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = useBeatPulse();
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: 450, left: -300 + Math.sin(f / 90) * 120, top: 100 + Math.cos(f / 110) * 140, background: `radial-gradient(circle, ${C.purple}44, transparent 65%)` }} />
      <div style={{ position: "absolute", width: 1000, height: 1000, borderRadius: 500, right: -400 + Math.cos(f / 100) * 120, top: 900 + Math.sin(f / 80) * 160, background: `radial-gradient(circle, ${C.cyan}33, transparent 65%)` }} />
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(${C.text}0d 2px, transparent 2px), linear-gradient(90deg, ${C.text}0d 2px, transparent 2px)`,
        backgroundSize: "90px 90px", backgroundPosition: `0 ${(f * 0.6) % 90}px`,
        transform: `scale(${1 + pulse * 0.012})`, opacity: 0.7 + pulse * 0.6,
      }} />
      <Particles />
    </AbsoluteFill>
  );
};

const Header: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const seg = [...WORDS].reverse().find((w) => w.start <= t)?.segment ?? "hook";
  const prog = t / TOTAL_SEC;
  return (
    <div style={{ position: "absolute", top: 120, left: 70, right: 70, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: FONT }}>
      <div style={{ position: "absolute", top: 70, left: 0, right: 0, height: 6, borderRadius: 3, background: "#ffffff14" }}>
        <div style={{ width: `${prog * 100}%`, height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${C.purple}, ${C.cyan})`, boxShadow: `0 0 16px ${C.cyan}` }} />
      </div>
      <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: 3, color: C.text }}>
        <span style={{ color: C.cyan }}>AI</span> SOLVED <span style={{ color: C.muted, fontWeight: 700 }}>· WK 47</span>
      </div>
      {SEG_LABEL[seg] && (
        <div style={{ fontSize: 34, fontWeight: 900, color: C.bg, background: C.cyan, padding: "8px 22px", borderRadius: 12 }}>{SEG_LABEL[seg]}</div>
      )}
    </div>
  );
};

/** Word-synced captions, lower-middle, kept clear of the right-hand UI rail. */
type Chunk = { words: typeof WORDS; start: number; end: number };
const CHUNKS: Chunk[] = (() => {
  const out: Chunk[] = [];
  let cur: typeof WORDS = [];
  WORDS.forEach((w, i) => {
    cur.push(w);
    const len = cur.map((x) => x.display).join(" ").length;
    const brk = /[.,:;!?–]$/.test(w.word) || cur.length >= 3 || len > 18 || i === WORDS.length - 1;
    if (brk) { out.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end }); cur = []; }
  });
  return out;
})();

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const idx = CHUNKS.findIndex((c, i) => t >= c.start - 0.05 && t < (CHUNKS[i + 1]?.start ?? Infinity) - 0.05);
  const ch = CHUNKS[idx];
  if (!ch || t > ch.end + 0.6) return null;
  const pop = interpolate(t - ch.start, [0, 0.12], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 1200, left: 70, right: 170, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0 40px", fontFamily: FONT, transform: `scale(${pop})` }}>
      {ch.words.map((w, i) => {
        const active = t >= w.start && t < w.end + 0.08;
        const color = w.keyword ? (i % 2 ? C.purple : C.cyan) : C.text;
        const txt = w.display.replace(/[.,:;!?–]+$/, "").toUpperCase();
        const since = t - w.start;
        const kwPop = w.keyword ? interpolate(since, [0, 0.08, 0.2], [0.7, 1.12, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
        const line = w.keyword ? interpolate(since, [0.05, 0.25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
        return (
          <span key={i} style={{ position: "relative", display: "inline-block",
            fontSize: 92, fontWeight: 900, color, letterSpacing: -1, lineHeight: 1.15,
            WebkitTextStroke: "3px #020617", paintOrder: "stroke fill",
            textShadow: `0 8px 0 #020617, 0 0 ${active ? 34 : 0}px ${w.keyword ? color : "#ffffff55"}`,
            transform: `scale(${(active ? 1.05 : 1) * (since >= 0 ? kwPop : 1)}) translateY(${active ? -8 : 0}px) rotate(${w.keyword && active ? (i % 2 ? 2 : -2) : 0}deg)`,
            opacity: t >= w.start - 0.02 ? 1 : 0.45,
          }}>{txt}{line > 0 && <span style={{ position: "absolute", left: 0, bottom: 4, height: 10, width: `${line * 100}%`, borderRadius: 5, background: color, boxShadow: `0 0 18px ${color}` }} />}</span>
        );
      })}
    </div>
  );
};

export const WeeklyShort: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Background />
      {BEATS.map((b, i) => {
        const from = Math.round(b.t * FPS);
        const to = i + 1 < BEATS.length ? Math.round(BEATS[i + 1].t * FPS) : durationInFrames;
        const dur = to - from;
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={b.C.name}>
            <SceneTransition kind={TRANSITIONS[i % TRANSITIONS.length]} i={i} dur={i === BEATS.length - 1 ? dur + 999 : dur}><b.C /></SceneTransition>
            {i > 0 && (b.sfx === "pop" ? <Shockwave color={SEG_COLOR[segOf(b.t)]} /> : <LightSweep />)}
            {b.sfx && <Audio src={staticFile(`${b.sfx}.wav`)} volume={b.sfx === "whoosh" ? 0.55 : 0.6} />}
          </Sequence>
        );
      })}
      <Overlay />
      <GlitchDefs />
      <Header />
      <Captions />
      <Audio src={staticFile("voiceover.mp3")} />
      <Audio src={staticFile("music.wav")} />
    </AbsoluteFill>
  );
};

export const DURATION = Math.ceil(TOTAL_SEC * FPS);
