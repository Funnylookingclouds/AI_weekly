/** SOME ASSEMBLY RAGE – Ep. 10 "Junior's First Bed" (GLÖMSK). */
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import type { Expr } from "../../cast/rig";
import { C, LUCKY } from "../furni";
import type { FurniId } from "../furni";
import {
  type Bub, type BurstT, type CamKey, type Cue, type MoodKey, type MoveKey, type PieceDef, type Voice, type Who,
  EpisodeAudio, FPS, HEAD, INK, LogoStamp, Manual, Overlays, Piece, Stage,
  back, clamp, fitBubbles, flashAt, furniNode, leftyNode, lerp, makeCam, makeSpeaking, moodAt, posAt,
} from "../kit";
import { Junior } from "../junior";
import { Outro, OUTRO_LEN } from "../Outro";
import VOICE_RAW from "../ep10.voice.json";

const VOICE = VOICE_RAW as Voice[];
const STORY = 26.5;
export const EP10_LEN = Math.round((STORY + OUTRO_LEN) * FPS);
const BED = { x: 110, y: 40 };
const GROW = 15.2, LAP = 18.6;

const MOOD: Record<FurniId, MoodKey[]> = {
  gus: [[0, "love", "love"], [1.6, "happy", "none"], [4.9, "angry", "storm"], [6.2, "angry", "rage"], [8.6, "happy", "none"], [8.8, "happy", "music"], [GROW, "surprised", "shock"], [16.0, "scared", "sweat"], [17.4, "neutral", "none"], [LAP, "love", "love"], [20.5, "smug", "none"]],
  pia: [[0, "happy", "none"], [1.6, "confused", "confused"], [2.4, "smug", "sparkle"], [4.1, "confused", "confused"], [4.9, "angry", "storm"], [6.2, "angry", "grawlix"], [7.4, "angry", "storm"], [8.6, "neutral", "none"], [11.0, "smug", "none"], [GROW, "surprised", "shock"], [15.9, "angry", "grawlix"], [17.4, "angry", "none"], [LAP, "love", "love"], [20.5, "angry", "none"], [22.5, "smug", "none"]],
  duke: [[0, "happy", "none"], [8.8, "smug", "sparkle"], [12.0, "happy", "music"], [GROW, "surprised", "shock"], [16.0, "laugh", "music"], [17.4, "neutral", "none"], [LAP, "happy", "none"], [21.4, "angry", "none"], [22.5, "smug", "none"]],
  lotta: [[0, "neutral", "zzz"], [GROW, "surprised", "shock"], [16.0, "neutral", "zzz"]],
};
const MOVE: Record<FurniId, MoveKey[]> = {
  gus: [[0, -360, 150, 0], [4.9, -170, 175, 0.5], [8.6, -400, 150, 0.5]],
  pia: [[0, 330, 150, 0], [4.9, 170, 170, 0.5], [8.6, 360, 150, 0.5]],
  duke: [[0, -760, 120, 0], [8.4, -140, 190, 0.6], [17.2, 60, 230, 0.5]],
  lotta: [[0, 650, -10, 0]],
};
const YAW: Record<FurniId, number> = { duke: 0.4, gus: 0.4, pia: -0.4, lotta: -0.4 };
const JMOVE: MoveKey[] = [[0, -60, 240, 0], [17.4, -300, 200, 1.1], [LAP - 0.1, -400, 152, 0.3]];

const BUBBLES: Bub[] = [
  { who: "gus", t0: 0.2, t1: 1.5, text: "Your very own bed, Junior!" },
  { who: "junior", t0: 1.6, t1: 2.3, text: "Why?" },
  { who: "pia", t0: 2.4, t1: 4.0, text: "Because big kids sleep in beds." },
  { who: "junior", t0: 4.1, t1: 4.8, text: "Why?" },
  { who: "junior", t0: 6.2, t1: 7.4, text: "Why? Why? Why?" },
  { who: "duke", t0: 8.8, t1: 14.0, text: "And then… the little dowel… went into hole B." },
  { who: "junior", t0: 14.1, t1: 14.9, text: "AGAIN!", kind: "shout" },
  { who: "pia", t0: 15.9, t1: 17.2, text: "#@%&!", kind: "grawlix" },
  { who: "gus", t0: 19.0, t1: 20.3, text: "…He picked me.", kind: "whisper" },
  { who: "pia", t0: 20.5, t1: 21.3, text: "Your fault.", kind: "whisper" },
  { who: "duke", t0: 21.4, t1: 22.5, text: "YOUR fault.", kind: "whisper" },
  { who: "lefty", t0: 24.0, t1: 25.6, text: "Uh… goodnight?", kind: "whisper" },
];
fitBubbles(BUBBLES, VOICE);
const speaking = makeSpeaking(BUBBLES, VOICE);

const CAM: CamKey[] = [
  [0, -200, -170, 1.3, 0], [1.6, -60, 40, 1.7, 0.3], [2.4, 330, -190, 1.5, 0], [4.1, -60, 40, 1.7, 0], [4.9, 0, -260, 1.0, 0.3],
  [6.2, -60, 40, 1.7, 0], [7.4, 0, -260, 1.0, 0], [8.8, -110, -80, 1.45, 0.4], [14.1, -60, 40, 1.7, 0], [GROW, 110, -420, 0.8, 0.4],
  [15.9, 360, -190, 1.5, 0], [17.4, -220, -150, 1.2, 0.6], [19.0, -400, -100, 1.6, 0.4], [20.5, 360, -190, 1.5, 0], [21.4, 60, -170, 1.5, 0],
  [22.8, 250, 60, 1.2, 0.6], [23.8, 160, 120, 1.8, 0.4],
];
const cam = makeCam(CAM, [[GROW + 0.4, 26], [15.9, 14]]);
const FLASHES = [15.9];
const BURSTS: BurstT[] = [[GROW, 110, -300, "KA-CHUNK!", C.sky, -5], [GROW + 0.45, 110, -900, "BOOOING!", C.sun, 6], [22.6, 100, -260, "SHHH!", "#cbd5e1", -4]];
const SFX: Cue[] = [
  [1.6, "sfx_pop", 0.4], [4.1, "sfx_pop", 0.4], [4.9, "sfx_whoosh", 0.4], [5.4, "sfx_chunk", 0.5], [6.4, "sfx_chunk", 0.5], [7.5, "sfx_chunk", 0.5],
  [10.0, "sfx_chunk", 0.4], [11.6, "sfx_chunk", 0.4], [13.0, "sfx_chunk", 0.4], [GROW, "sfx_chunk", 1], [GROW + 0.2, "brand/boing.wav", 0.8], [GROW + 0.45, "sfx_thunk", 0.8],
  [15.9, "sfx_thunder", 0.6], [17.4, "sfx_roll", 0.3], [LAP, "sfx_shimmer", 0.4], [22.8, "sfx_roll", 0.4],
];
const P = (id: string, w: number, h: number, x: number, y: number, color: string, i: number, snap: number): PieceDef => ({
  id, w, h, built: { x, y, r: 0 }, pile: { x: -120 + i * 50, y: 120 + (i % 2) * 14, r: i % 2 ? 4 : -4 }, fall: { x: 0, y: 0, r: 0 }, color, ev: [[0, "pile"], [snap, "built"]],
});
const PIECES: PieceDef[] = [
  P("head", 190, 170, -110, -110, C.sky, 0, 5.4), P("foot", 190, 100, 110, -75, C.sky, 1, 6.4), P("rail", 240, 26, 0, -40, C.sun, 2, 7.5),
  P("mat", 230, 40, 0, -72, "#f8fafc", 3, 10.0), P("pillow", 74, 34, -80, -104, "#fde68a", 4, 11.6), P("blanket", 150, 36, 40, -96, C.gum, 5, 13.0),
];

const WhyCounter: React.FC<{ t: number }> = ({ t }) => {
  if (t < 1.6 || t > 9.0) return null;
  const n = t < 4.1 ? 1 : t < 4.9 ? 2 : t < 6.2 ? 2 + Math.floor((t - 4.9) * 5) : Math.min(23, 8 + Math.floor((t - 6.2) * 8));
  return (
    <div style={{ position: "absolute", left: 40, top: 200, padding: "12px 26px", background: C.sun, border: `6px solid ${INK}`, borderRadius: 20, fontFamily: LUCKY, fontSize: 56, color: INK, boxShadow: `8px 8px 0 ${INK}`, transform: `rotate(-4deg) scale(${1 + (t % 0.5 < 0.08 ? 0.06 : 0)})` }}>
      WHY? <span style={{ color: C.tomato }}>× {n}</span>
    </div>
  );
};

export const FlatpackEp10: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cm = cam(t);
  const items: { y: number; node: React.ReactNode }[] = [];
  const grow = t < GROW ? 1 : 1 + 1.6 * back(clamp((t - GROW) / 0.5));
  items.push({ y: BED.y, node: <g key="bed" transform={`translate(${BED.x} ${BED.y}) scale(${grow})`}>{PIECES.map((p) => <Piece key={p.id} def={p} t={t} />)}
    {t > 5.4 && <g transform="translate(-110 -130)">{[[-50, -20], [30, -40], [50, 10], [-20, 30]].map(([x, y], i) => <path key={i} d="M0 -12 L3 -4 L12 -4 L5 2 L8 11 L0 6 L-8 11 L-5 2 L-12 -4 L-3 -4 Z" transform={`translate(${x} ${y})`} fill={C.sun} stroke={INK} strokeWidth={2} />)}</g>}
  </g> });

  const pos = { gus: posAt(MOVE.gus, t), pia: posAt(MOVE.pia, t), duke: posAt(MOVE.duke, t), lotta: posAt(MOVE.lotta, t) };
  (Object.keys(MOOD) as FurniId[]).forEach((id) => {
    const m = moodAt(MOOD[id], t), p = pos[id];
    let hop = p.walk + (m.since < 0.35 ? Math.sin((m.since / 0.35) * Math.PI) * (t > LAP ? 0 : 55) : 0);
    if ((id === "gus" || id === "pia") && t > 4.9 && t < 8.6) hop += Math.abs(Math.sin(t * 6 + (id === "pia" ? 1.5 : 0))) * 24;
    const glow = id === "lotta" ? clamp((t - 16.5) / 1.5) * 0.7 : 0;
    items.push({ y: p.y, node: furniNode(id, p, { ...m, frame, yaw: YAW[id], talk: speaking(id, t), hop, glow }) });
  });
  // tug-of-war over the manual, then Duke's bedtime story
  if (t > 4.9 && t < 8.6) {
    const x = lerp(-170, 170, 0.5 + Math.sin((t - 4.9) * 4) * 0.35);
    items.push({ y: 176, node: <g key="man" transform={`translate(${x} -40) rotate(${Math.sin(t * 9) * 10})`}><Manual f={frame} name="GLÖMSK" /></g> });
  }
  if (t > 8.6 && t < 15.2) items.push({ y: pos.duke.y + 2, node: <g key="man2" transform={`translate(${pos.duke.x + 130} ${pos.duke.y - 210}) rotate(-8) scale(1.1)`}><Manual f={frame} name="GLÖMSK" /></g> });
  // Junior
  {
    const jp = posAt(JMOVE, t);
    const asleep = t > LAP;
    const jexpr: Expr = t < 4.9 ? "confused" : t < 8.8 ? "confused" : t < GROW ? "happy" : t < 17.4 ? "surprised" : "neutral";
    let hop = t > 9.5 && t < 15 ? Math.abs(Math.sin(t * 5)) * 30 : 0;
    if (t > 14.1 && t < 14.9) hop += Math.abs(Math.sin(t * 12)) * 50;
    const sc = asleep ? 0.95 : 1.2;
    items.push({ y: asleep ? pos.gus.y + 1 : jp.y, node: <g key="junior" transform={`translate(${jp.x} ${jp.y - hop - (asleep ? 40 : 0)}) scale(${sc}) translate(-150 -392)`}><Junior f={frame} expr={jexpr} talk={speaking("junior", t)} awake={!asleep} walk={jp.walk > 0 ? t : 0} yaw={0.2} /></g> });
    if (t > 17.2) items.push({ y: 600, node: <g key="zzz">{[0, 1, 2].map((k) => { const a = ((t * 0.6 + k / 3) % 1); return <text key={k} x={jp.x + 60 + a * 90} y={jp.y - 330 - a * 220} fontFamily={LUCKY} fontSize={50 + a * 40} fill={C.sky} stroke={INK} strokeWidth={3} paintOrder="stroke" opacity={1 - a}>Z</text>; })}</g> });
  }
  const lefty = leftyNode(t, frame, 22.8, 160, 262, speaking("lefty", t));
  if (lefty) items.push({ y: 262, node: lefty });

  const jp = posAt(JMOVE, t);
  const heads = (w: Who) => {
    if (w === "junior") return { x: jp.x, y: jp.y - 290 };
    if (w === "lefty") return { x: 160, y: 262 - HEAD.lefty };
    return { x: pos[w as FurniId].x, y: pos[w as FurniId].y - HEAD[w] };
  };
  const night = clamp((t - 8.8) / 6) * 0.3 + clamp((t - 17.4) / 1.5) * 0.12;
  return (
    <Stage t={t} cam={cm} items={items} wall={["#dff3ff", "#cbeaff"]} angry={t > 4.9 && t < 8.6} storm={0} night={night}>
      <Overlays t={t} cam={cm} bubbles={BUBBLES} voice={VOICE} heads={heads} bursts={BURSTS} />
      <WhyCounter t={t} />
      <LogoStamp t={t} t0={0.0} sub="EP. 10 · JUNIOR'S FIRST BED" />
      <AbsoluteFill style={{ background: "#fff", opacity: flashAt(t, FLASHES) }} />
      {t > STORY - 0.01 && <AbsoluteFill style={{ opacity: clamp((t - STORY) / 0.2) }}><Sequence from={Math.round(STORY * FPS)} layout="none"><Outro /></Sequence></AbsoluteFill>}
      <EpisodeAudio music="flatpack/music_ep10.wav" sfx={SFX} bubbles={BUBBLES} voice={VOICE} grawlix={[{ t: 15.9, whos: ["pia"] }]} />
    </Stage>
  );
};
