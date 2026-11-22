import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./theme";
import { WORDS, at, FPS, TOTAL_SEC, segStart } from "./timing";
import * as S from "./Scenes";

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

const SEG_LABEL: Record<string, string> = { hook: "", news1: "1/3", news2: "2/3", news3: "3/3", loop: "" };

const Background: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: 450, left: -300 + Math.sin(f / 90) * 120, top: 100 + Math.cos(f / 110) * 140, background: `radial-gradient(circle, ${C.purple}44, transparent 65%)` }} />
      <div style={{ position: "absolute", width: 1000, height: 1000, borderRadius: 500, right: -400 + Math.cos(f / 100) * 120, top: 900 + Math.sin(f / 80) * 160, background: `radial-gradient(circle, ${C.cyan}33, transparent 65%)` }} />
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(${C.text}0d 2px, transparent 2px), linear-gradient(90deg, ${C.text}0d 2px, transparent 2px)`,
        backgroundSize: "90px 90px", backgroundPosition: `0 ${(f * 0.6) % 90}px`,
      }} />
    </AbsoluteFill>
  );
};

const Header: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const seg = [...WORDS].reverse().find((w) => w.start <= t)?.segment ?? "hook";
  return (
    <div style={{ position: "absolute", top: 120, left: 70, right: 70, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: FONT }}>
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
        return (
          <span key={i} style={{
            fontSize: 92, fontWeight: 900, color, letterSpacing: -1, lineHeight: 1.15,
            WebkitTextStroke: "3px #020617", paintOrder: "stroke fill",
            textShadow: `0 8px 0 #020617, 0 0 ${active ? 34 : 0}px ${w.keyword ? color : "#ffffff55"}`,
            transform: `scale(${active ? 1.05 : 1}) translateY(${active ? -8 : 0}px)`,
            opacity: t >= w.start - 0.02 ? 1 : 0.45,
          }}>{txt}</span>
        );
      })}
    </div>
  );
};

const CameraMove: React.FC<{ children: React.ReactNode; i: number; dur: number }> = ({ children, i, dur }) => {
  const f = useCurrentFrame();
  const p = f / Math.max(1, dur);
  const dir = i % 2 ? 1 : -1;
  const enter = interpolate(f, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ transform: `scale(${1 + p * 0.06}) rotate(${dir * p * 1.2}deg) translateY(${(1 - enter) * 60}px)`, opacity: enter }}>
      {children}
    </AbsoluteFill>
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
            <CameraMove i={i} dur={dur}><b.C /></CameraMove>
            {b.sfx && <Audio src={staticFile(`${b.sfx}.wav`)} volume={b.sfx === "whoosh" ? 0.55 : 0.6} />}
          </Sequence>
        );
      })}
      <Header />
      <Captions />
      <Audio src={staticFile("voiceover.mp3")} />
      <Audio src={staticFile("music.wav")} />
    </AbsoluteFill>
  );
};

export const DURATION = Math.ceil(TOTAL_SEC * FPS);
