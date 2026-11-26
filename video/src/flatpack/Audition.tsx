/** SOME ASSEMBLY RAGE – voice audition reel: each character performs its line with 3 candidate voices (A/B/C). */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import type { Expr } from "../cast/rig";
import { Alvin, C, Furni, LUCKY, type Emote, type FurniId } from "./furni";
import CLIPS from "./audition.json";

const FPS = 60, TITLE = 1.3, GAP = 0.7;
type Clip = { who: string; i: number; name: string; dur: number; line: string };
const NAMES: Record<string, [string, string, string]> = {
  duke: ["DUKE", "the bookcase", C.tomato], pia: ["PIA", "the chest of drawers", C.teal], gus: ["GUS", "the armchair", C.grape],
  lotta: ["LOTTA", "the floor lamp", C.gum], alvin: ["ALVIN", "the hex key", "#94a3b8"],
};
const MOODS: Record<string, [Expr, Emote][]> = {
  duke: [["smug", "sparkle"], ["happy", "joy"], ["angry", "rage"]],
  pia: [["angry", "storm"], ["angry", "grawlix"], ["surprised", "shock"]],
  gus: [["love", "love"], ["happy", "music"], ["confused", "confused"]],
  lotta: [["smug", "sparkle"], ["neutral", "zzz"], ["smug", "sparkle"]],
  alvin: [["sad", "sad"], ["scared", "sweat"], ["angry", "rage"]],
};

type Seg = { kind: "title"; who: string; t0: number; t1: number } | { kind: "clip"; c: Clip; t0: number; t1: number };
const SEGS: Seg[] = [];
let tt = 0.3;
for (const who of Object.keys(NAMES)) {
  SEGS.push({ kind: "title", who, t0: tt, t1: tt + TITLE }); tt += TITLE;
  for (const c of (CLIPS as Clip[]).filter((x) => x.who === who)) { SEGS.push({ kind: "clip", c, t0: tt, t1: tt + c.dur + GAP }); tt += c.dur + GAP; }
}
export const AUDITION_LEN = Math.round((tt + 1.5) * FPS);

export const FlatpackAudition: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const seg = SEGS.find((s) => t >= s.t0 && t < s.t1) ?? SEGS[SEGS.length - 1];
  const who = seg.kind === "title" ? seg.who : seg.c.who;
  const [name, tag, col] = NAMES[who];
  const idx = seg.kind === "clip" ? seg.c.i : 0;
  const [expr, emote] = MOODS[who][idx];
  const age = t - seg.t0;
  const talk = seg.kind === "clip" && age < seg.c.dur;
  const pop = Math.min(1, age / 0.18);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${C.cream}, ${col})`, fontFamily: LUCKY, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 120, width: 1080, textAlign: "center", fontSize: 64, color: C.ink }}>VOICE AUDITION</div>
      <div style={{ position: "absolute", top: 200, width: 1080, textAlign: "center", fontSize: 130, color: col, WebkitTextStroke: `6px ${C.ink}` }}>{name}</div>
      <div style={{ position: "absolute", top: 345, width: 1080, textAlign: "center", fontSize: 46, color: C.ink }}>{tag}</div>
      <div style={{ position: "absolute", left: 540 - 350, top: 420 }}>
        {who === "alvin" ? (
          <svg width={520} height={700} viewBox="-260 -380 520 700" style={{ overflow: "visible" }}><g transform={`translate(0 ${Math.sin(f / 10) * 10 - (talk ? Math.abs(Math.sin(f / 4)) * 10 : 0)})`}><Alvin f={f} size={3} spin={Math.sin(f / 30) * 6} /></g></svg>
        ) : (
          <Furni id={who as FurniId} expr={talk || seg.kind === "clip" ? expr : "neutral"} emote={seg.kind === "clip" ? emote : "none"} emoteAge={age * FPS} f={f} size={700} yaw={Math.sin(f / 70) * 0.35} talk={talk} glow={who === "lotta" && seg.kind === "clip" ? 0.8 : 0} hop={age < 0.3 ? Math.sin((age / 0.3) * Math.PI) * 60 : 0} />
        )}
      </div>
      {seg.kind === "clip" && (
        <>
          <div style={{ position: "absolute", top: 1420, width: 1080, display: "flex", justifyContent: "center", transform: `scale(${pop})` }}>
            <div style={{ background: "#fff", border: `7px solid ${C.ink}`, borderRadius: 30, padding: "12px 34px", boxShadow: `8px 8px 0 ${C.ink}`, fontSize: 62, color: C.ink }}>
              <span style={{ color: col, WebkitTextStroke: `2px ${C.ink}` }}>{"ABC"[seg.c.i]}</span> · {seg.c.name}
            </div>
          </div>
          <div style={{ position: "absolute", top: 1580, left: 70, width: 800, fontFamily: "Inter", fontWeight: 800, fontSize: 40, color: C.ink, lineHeight: 1.25 }}>"{seg.c.line}"</div>
        </>
      )}
      {SEGS.map((s, k) => s.kind === "clip" && <Sequence key={k} from={Math.round(s.t0 * FPS)} durationInFrames={Math.round((s.c.dur + 0.3) * FPS)}><Audio src={staticFile(`flatpack/audition/${s.c.who}_${s.c.i}.wav`)} /></Sequence>)}
      {SEGS.map((s, k) => s.kind === "title" && <Sequence key={`t${k}`} from={Math.round(s.t0 * FPS)} durationInFrames={40}><Audio src={staticFile("flatpack/sfx_pop.wav")} volume={0.6} /></Sequence>)}
    </AbsoluteFill>
  );
};
