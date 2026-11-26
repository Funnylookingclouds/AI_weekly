/** SOME ASSEMBLY RAGE – Ep. 4 "The Bunk Bed Race" (ÖVERMOD bunk bed). */
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Alvin, C, LUCKY } from "../furni";
import type { FurniId } from "../furni";
import {
  type Bub, type BurstT, type Cam, type CamKey, type Cue, type MoodKey, type MoveKey, type PieceDef, type Voice, type Who,
  EpisodeAudio, FPS, HEAD, INK, LogoStamp, Overlays, Piece, Scoreboard, Stage, Versus,
  clamp, dustNode, ease, fitBubbles, flashAt, furniNode, leftyNode, lerp, makeCam, makeSpeaking, moodAt, posAt,
} from "../kit";
import { Outro, OUTRO_LEN } from "../Outro";
import VOICE_RAW from "../ep4.voice.json";

const VOICE = VOICE_RAW as Voice[];
const STORY = 30.0;
export const EP4_LEN = Math.round((STORY + OUTRO_LEN) * FPS);
const SPLIT: [number, number] = [6.1, 13.0];
const SLIDE = 13.0, KLONK = 14.6, FLOP = 22.3, CRASH = 22.9;

const MOOD: Record<FurniId, MoodKey[]> = {
  duke: [[0, "smug", "sparkle"], [2.2, "angry", "none"], [3.6, "angry", "rage"], [4.5, "neutral", "none"], [6.1, "happy", "music"], [7.4, "laugh", "joy"], [9.4, "smug", "sparkle"], [11.6, "angry", "none"], [13.0, "smug", "none"], [KLONK, "surprised", "shock"], [16.5, "confused", "confused"], [18.2, "angry", "rage"], [19.5, "angry", "grawlix"], [21.0, "neutral", "none"], [CRASH, "surprised", "shock"], [23.6, "scared", "sweat"], [26.2, "confused", "confused"], [27.9, "angry", "storm"]],
  pia: [[0, "angry", "none"], [2.2, "smug", "sparkle"], [3.6, "angry", "storm"], [4.5, "neutral", "none"], [6.1, "neutral", "none"], [9.4, "angry", "storm"], [11.6, "smug", "sparkle"], [13.0, "smug", "none"], [KLONK, "surprised", "shock"], [14.8, "angry", "grawlix"], [16.5, "angry", "storm"], [18.2, "angry", "rage"], [19.5, "angry", "grawlix"], [21.0, "neutral", "none"], [CRASH, "surprised", "shock"], [23.6, "scared", "sweat"], [26.2, "confused", "confused"], [27.9, "angry", "grawlix"]],
  gus: [[0, "happy", "none"], [4.5, "happy", "joy"], [6.1, "happy", "music"], [13.0, "happy", "none"], [KLONK, "surprised", "shock"], [16.5, "confused", "confused"], [18.2, "scared", "sweat"], [21.0, "happy", "joy"], [FLOP, "laugh", "music"], [CRASH, "surprised", "shock"], [23.6, "sad", "sad"]],
  lotta: [[0, "neutral", "zzz"], [CRASH, "surprised", "shock"], [24.0, "neutral", "zzz"]],
};
const MOVE: Record<FurniId, MoveKey[]> = {
  duke: [[0, -120, 150, 0], [5.9, -470, 160, 0.5], [SLIDE, -320, 170, 1.4]],
  pia: [[0, 230, 150, 0], [5.9, 520, 160, 0.5], [SLIDE, 330, 170, 1.4]],
  gus: [[0, 40, -10, 0], [SLIDE, 20, 250, 0.8], [FLOP, 10, 60, 0.6]],
  lotta: [[0, 650, -10, 0]],
};
const YAW: Record<FurniId, number> = { duke: 0.4, gus: 0.2, pia: -0.4, lotta: -0.4 };

const BUBBLES: Bub[] = [
  { who: "duke", t0: 0.2, t1: 2.1, text: "I'll build my half faster than you." },
  { who: "pia", t0: 2.2, t1: 3.6, text: "With the manual? Easily." },
  { who: "gus", t0: 4.5, t1: 6.1, text: "Ready… set… BUILD!", kind: "shout" },
  { who: "alvin", t0: 7.4, t1: 9.1, text: "I'm a hex key, not a DRILL!", kind: "shout" },
  { who: "duke", t0: 9.4, t1: 11.2, text: "Done! New record!", kind: "shout" },
  { who: "pia", t0: 11.6, t1: 12.8, text: "Done. Correctly." },
  { who: "pia", t0: 15.1, t1: 16.45, text: "Your ladder goes to the CEILING!", kind: "shout" },
  { who: "duke", t0: 16.5, t1: 18.1, text: "…For tall people?" },
  { who: "duke+pia", t0: 18.2, t1: 19.5, text: "YOUR half is wrong!", kind: "shout" },
  { who: "gus", t0: 21.0, t1: 22.2, text: "Can I test it?" },
  { who: "gus", t0: 23.6, t1: 24.7, text: "…I liked it.", kind: "whisper" },
  { who: "lefty", t0: 26.2, t1: 27.8, text: "Uh… where do I go?" },
  { who: "duke", t0: 27.9, t1: 28.9, text: "HER half!", kind: "shout" },
  { who: "pia", t0: 28.0, t1: 29.0, text: "HIS half!", kind: "shout" },
];
fitBubbles(BUBBLES, VOICE);
const speaking = makeSpeaking(BUBBLES, VOICE);

const CAM: CamKey[] = [
  [0, -120, -200, 1.45, 0], [2.2, 230, -200, 1.45, 0], [4.5, 40, -250, 1.4, 0], [SLIDE, 0, -260, 0.95, 0], [KLONK, 0, -330, 0.9, 0.2],
  [15.1, 330, -190, 1.5, 0], [16.5, -150, -420, 1.0, 0.4], [18.2, 0, -260, 0.95, 0.2], [21.0, 20, 0, 1.5, 0], [FLOP, 0, -230, 0.95, 0.3],
  [23.6, 10, -60, 1.55, 0.3], [25.0, 300, 60, 1.2, 0.6], [26.0, 140, 120, 1.85, 0.4], [27.9, 0, -240, 0.95, 0.2],
];
const cam = makeCam(CAM, [[3.6, 18], [6.0, 8], [KLONK, 24], [18.3, 14], [19.8, 10], [CRASH, 34], [28.0, 12]]);
const camTop = (t: number): Cam => ({ x: 330, y: -230, z: 0.95, sx: 0, sy: -480 + Math.sin(t * 40) * (t > 11.3 && t < 11.6 ? 4 : 0) });
const camBot = (t: number): Cam => ({ x: -300, y: -230, z: 0.95, sx: Math.sin(t * 50) * (t > 6.4 && t < 9.3 ? 3 : 0), sy: 480 });
const FLASHES = [18.3, 19.9];
const BURSTS: BurstT[] = [
  [6.0, 40, -420, "TWEEET!", C.sun, -6], [KLONK, 60, -500, "KLONK.", "#cbd5e1", 4], [CRASH, 0, -260, "CRASH!", C.tomato, -6],
];
const SFX: Cue[] = [
  [3.6, "sfx_thunk", 0.8], [6.0, "sfx_whistle", 0.8], [6.4, "sfx_ratchet", 0.7], [6.8, "sfx_chunk", 0.5], [7.2, "sfx_ratchet", 0.7], [7.6, "sfx_chunk", 0.5],
  [8.0, "sfx_ratchet", 0.7], [8.4, "sfx_chunk", 0.5], [8.8, "sfx_chunk", 0.7], [9.3, "brand/ding.wav", 0.6], [6.6, "sfx_chunk", 0.4], [7.8, "sfx_chunk", 0.4],
  [9.0, "sfx_chunk", 0.4], [10.2, "sfx_chunk", 0.4], [11.4, "sfx_chunk", 0.5], [11.5, "brand/ding.wav", 0.4], [SLIDE, "sfx_roll", 0.6], [KLONK, "sfx_chunk", 1],
  [14.65, "sfx_scratch", 0.7], [18.3, "sfx_thunder", 0.9], [19.9, "sfx_thunder", 0.7], [FLOP, "sfx_whoosh", 0.7], [FLOP + 0.1, "brand/boing.wav", 0.5],
  [CRASH, "sfx_crash", 1], [25.0, "sfx_roll", 0.8], [28.0, "sfx_thunk", 0.5],
];

// --------------------------------------------------------------- ÖVERMOD halves
const ladder = () => (
  <g>
    {[-26, 26].map((x) => <rect key={x} x={x - 8} y={-160} width={16} height={320} rx={5} fill={C.tomato} stroke={INK} strokeWidth={4} />)}
    {[-120, -60, 0, 60, 120].map((y) => <rect key={y} x={-26} y={y - 6} width={52} height={12} rx={4} fill={C.sun} stroke={INK} strokeWidth={3} />)}
  </g>
);
type Spec = [string, number, number, number, number, string, number, Partial<PieceDef>?];
const half = (side: "pia" | "duke", specs: Spec[]): PieceDef[] => specs.map(([id, w, h, bx, by, color, snap, extra], i) => ({
  id: `${side}-${id}`, w, h, built: { x: bx, y: by, r: 0 }, pile: { x: -110 + i * 40, y: 70 + (i % 2) * 14, r: (i % 2 ? 1 : -1) * (w < 40 ? 86 : 3) },
  fall: { x: (i - 2) * 70 + (side === "duke" ? -40 : 40), y: 60 + (i % 3) * 18, r: (i % 2 ? 1 : -1) * (w < 70 ? 92 : 8) }, color,
  ev: [[0, "pile"], [snap, "built"], [CRASH, "fall"]], ...(extra ?? {}),
}));
const PIA_HALF = half("pia", [
  ["pl", 22, 420, -100, -210, C.sky, 6.6], ["pr", 22, 420, 100, -210, C.sky, 7.8], ["low", 220, 30, 0, -80, C.sun, 9.0], ["top", 220, 30, 0, -320, C.sun, 10.2], ["rail", 200, 16, 0, -385, C.tomato, 11.4],
]);
const DUKE_HALF = half("duke", [
  ["pl", 22, 420, -100, -210, C.sky, 6.4], ["pr", 22, 420, 100, -210, C.sky, 6.8], ["low", 220, 30, 0, -150, C.sun, 7.2], ["top", 220, 30, 0, -262, C.sun, 7.6],
  ["rail", 200, 16, 0, -40, C.tomato, 8.0], ["mat", 200, 40, 0, -300, "#f8fafc", 8.4], ["lad", 60, 320, 40, -540, C.tomato, 8.8, { draw: () => ladder() }],
]);
const halfX = (side: "pia" | "duke", t: number) => {
  const a = ease(clamp((t - SLIDE) / 1.4));
  return side === "pia" ? lerp(330, 112, a) : lerp(-300, -112, a);
};
const wob = (t: number) => (t > CRASH - 0.3 && t < CRASH ? Math.sin(t * 60) * 4 : 0);

export const FlatpackEp4: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const split = t >= SPLIT[0] && t < SPLIT[1];
  const cm = cam(t);
  const items: { y: number; node: React.ReactNode }[] = [];
  (["duke", "pia"] as const).forEach((side) => {
    const x = halfX(side, t);
    items.push({ y: 30, node: <g key={side} transform={`translate(${x} 30) rotate(${wob(t)})`}>{(side === "pia" ? PIA_HALF : DUKE_HALF).map((p) => <Piece key={p.id} def={p} t={t} />)}</g> });
  });
  const d = dustNode(t, CRASH, 0, 60, "crash"); if (d) items.push({ y: 300, node: d });

  const pos = { duke: posAt(MOVE.duke, t), pia: posAt(MOVE.pia, t), gus: posAt(MOVE.gus, t), lotta: posAt(MOVE.lotta, t) };
  (Object.keys(MOOD) as FurniId[]).forEach((id) => {
    const m = moodAt(MOOD[id], t), p = pos[id];
    let hop = p.walk + (m.since < 0.35 ? Math.sin((m.since / 0.35) * Math.PI) * 55 : 0);
    if (id === "duke" && t > 6.1 && t < 9.3) hop += Math.abs(Math.sin(t * 16)) * 26;
    if (id === "pia" && t > 6.1 && t < 11.4) hop += Math.abs(Math.sin(t * 5)) * 14;
    if ((id === "duke" || id === "pia") && t > 18.2 && t < 21) hop += Math.abs(Math.sin(t * 9 + (id === "pia" ? 1 : 0))) * 34;
    if (id === "gus" && t > FLOP && t < CRASH) hop += Math.sin(((t - FLOP) / (CRASH - FLOP)) * Math.PI) * 380;
    const squash = id === "gus" && t > CRASH && t < CRASH + 0.4 ? Math.sin(((t - CRASH) / 0.4) * Math.PI) * 0.25 : 0;
    items.push({ y: id === "gus" && t > FLOP ? 320 : p.y, node: furniNode(id, p, { ...m, frame, yaw: YAW[id], talk: speaking(id, t), hop, squash }) });
  });
  // Alvin: drill in Duke's hand during the race, else on the floor
  {
    const racing = t > 6.1 && t < 9.4;
    const ax = racing ? pos.duke.x + 175 : -160, ay = racing ? pos.duke.y - 150 : 250;
    const spin = racing ? (t * 2200) % 360 : 90;
    items.push({ y: racing ? pos.duke.y + 2 : 250, node: <g key="alvin" transform={`translate(${ax} ${ay})`}>
      <Alvin f={frame} spin={spin} size={0.8} />
      {racing && [...Array(6)].map((_, i) => { const a = ((t * 6 + i / 6) % 1); return <path key={i} d="M0 0 l 10 -24 l 6 14 l 10 -22" transform={`translate(${Math.cos(i) * 40 * (1 + a)} ${Math.sin(i * 2) * 40 * (1 + a)}) rotate(${i * 60})`} stroke={C.sun} strokeWidth={5} fill="none" opacity={1 - a} />; })}
    </g> });
  }
  const lefty = leftyNode(t, frame, 25.0, 140, 262, speaking("lefty", t));
  if (lefty) items.push({ y: 262, node: lefty });

  const heads = (w: Who) => w === "alvin" ? { x: pos.duke.x + 175, y: pos.duke.y - 260 } : w === "lefty" ? { x: 140, y: 262 - HEAD.lefty } : { x: pos[w as FurniId].x, y: pos[w as FurniId].y - HEAD[w] };
  const hide = (keep: (b: Bub) => boolean) => BUBBLES.map((b) => (keep(b) ? b : { ...b, t0: 999, t1: 999 }));
  const dukeScore = t >= 9.4 ? 1 : 0;
  const argN = Math.min(99, Math.max(1, Math.floor((t - 18.2) * 25)));
  return (
    <Stage t={t} cam={cm} items={items} wall={["#fff1c9", "#ffe7a6"]} angry={t > 14.6 && t < 21} storm={t > 18.2 && t < 21 ? 0.14 : 0} split={split ? [camTop(t), camBot(t)] : null}>
      {split ? (
        <>
          <Overlays t={t} cam={camTop(t)} bubbles={hide((b) => b.who === "pia")} voice={VOICE} heads={heads} bursts={[]} />
          <Overlays t={t} cam={camBot(t)} bubbles={hide((b) => b.who !== "pia")} voice={VOICE} heads={heads} bursts={[]} />
          {[["PIA", C.teal, 60], ["DUKE", C.tomato, 1060]].map(([n, c, y]) => <div key={String(n)} style={{ position: "absolute", left: 40, top: Number(y), padding: "6px 22px", background: String(c), border: `6px solid ${INK}`, borderRadius: 14, fontFamily: LUCKY, fontSize: 52, color: "#fff", WebkitTextStroke: `2px ${INK}`, transform: "rotate(-4deg)" }}>{n}</div>)}
        </>
      ) : <Overlays t={t} cam={cm} bubbles={BUBBLES} voice={VOICE} heads={heads} bursts={BURSTS} />}
      <Scoreboard t={t} t0={4.0} t1={13.0} top={split ? 175 : 330} cells={[["DUKE", dukeScore, C.tomato], ["PIA", 0, C.teal]]} />
      <Scoreboard t={t} t0={18.3} t1={21.0} cells={[["ARGUMENTS", argN, C.tomato], ["BED", "?", C.grape]]} />
      <Scoreboard t={t} t0={23.0} t1={29.6} cells={[["DUKE", 0, C.tomato], ["PIA", 0, C.teal], ["BED", -1, C.gum]]} />
      <Versus t={t} t0={3.6} left="DUKE" right="PIA" />
      <LogoStamp t={t} t0={2.3} sub="EP. 4 · THE BUNK BED RACE" />
      <AbsoluteFill style={{ background: "#fff", opacity: flashAt(t, FLASHES) }} />
      {t > STORY - 0.01 && <AbsoluteFill style={{ opacity: clamp((t - STORY) / 0.2) }}><Sequence from={Math.round(STORY * FPS)} layout="none"><Outro /></Sequence></AbsoluteFill>}
      <EpisodeAudio music="flatpack/music_ep4.wav" sfx={SFX} bubbles={BUBBLES} voice={VOICE} />
    </Stage>
  );
};
