/** SOME ASSEMBLY RAGE – Ep. 2 "Bag C Is Empty" (SKRAMMEL chest of drawers). */
import React from "react";
import { AbsoluteFill, Sequence, random, useCurrentFrame } from "remotion";
import { Alvin, C, LUCKY } from "../furni";
import type { FurniId } from "../furni";
import {
  type Bub, type BurstT, type CamKey, type Cue, type MoodKey, type MoveKey, type PieceDef, type Voice, type Who,
  EpisodeAudio, FPS, HEAD, INK, LogoStamp, Manual, Overlays, PalletBox, Piece, Scoreboard, Stage, StepCounter, Versus,
  back, clamp, ease, fitBubbles, flashAt, furniNode, leftyNode, lerp, makeCam, makeSpeaking, moodAt, posAt,
} from "../kit";
import { Outro, OUTRO_LEN } from "../Outro";
import VOICE_RAW from "../ep2.voice.json";

const VOICE = VOICE_RAW as Voice[];
const STORY = 36.0;
export const EP2_LEN = Math.round((STORY + OUTRO_LEN) * FPS);

const MOOD: Record<FurniId, MoodKey[]> = {
  pia: [[0, "happy", "sparkle"], [3.6, "surprised", "shock"], [4.9, "angry", "storm"], [6.9, "angry", "none"], [8.3, "angry", "storm"], [9.9, "angry", "rage"], [12.7, "angry", "grawlix"], [14.1, "angry", "storm"], [15.7, "confused", "confused"], [19.5, "surprised", "shock"], [20.8, "scared", "sweat"], [22.6, "angry", "grawlix"], [24.1, "surprised", "shock"], [27.0, "confused", "confused"], [30.8, "confused", "confused"], [33.4, "smug", "none"]],
  duke: [[0, "neutral", "none"], [3.6, "surprised", "shock"], [5.0, "smug", "sparkle"], [8.3, "surprised", "none"], [9.9, "angry", "rage"], [11.7, "angry", "storm"], [14.1, "angry", "rage"], [15.7, "confused", "confused"], [19.5, "surprised", "shock"], [21.0, "confused", "confused"], [24.1, "surprised", "shock"], [24.8, "laugh", "music"], [29.8, "happy", "none"], [30.8, "confused", "confused"], [33.4, "laugh", "music"]],
  gus: [[0, "love", "love"], [3.6, "happy", "music"], [9.9, "love", "love"], [19.5, "surprised", "shock"], [20.3, "happy", "joy"], [22.6, "scared", "sweat"], [24.1, "happy", "joy"], [27.0, "smug", "sparkle"], [30.8, "neutral", "none"], [32.6, "love", "love"], [34.4, "sad", "sad"]],
  lotta: [[0, "neutral", "zzz"], [34.6, "neutral", "none"]],
};
const MOVE: Record<FurniId, MoveKey[]> = {
  pia: [[0, 230, 170, 0]],
  duke: [[0, -170, 120, 0], [13.8, -250, 70, 0.4], [15.2, -150, 120, 0.4]],
  gus: [[0, -470, 20, 0]],
  lotta: [[0, 570, 0, 0]],
};
const YAW: Record<FurniId, number> = { duke: 0.32, gus: 0.35, pia: -0.3, lotta: -0.4 };

const BUBBLES: Bub[] = [
  { who: "pia", t0: 0.2, t1: 3.5, text: "Bag A: 24. Bag B: 16. Bag C…" },
  { who: "pia", t0: 3.6, t1: 4.9, text: "…Bag C is EMPTY.", kind: "shout" },
  { who: "duke", t0: 5.0, t1: 6.9, text: "Relax. Who needs bag C?" },
  { who: "pia", t0: 8.3, t1: 9.8, text: "EVERY step needs bag C!", kind: "shout" },
  { who: "duke", t0: 10.6, t1: 11.6, text: "YOU lost it!", kind: "shout" },
  { who: "pia", t0: 12.7, t1: 14.1, text: "I LABEL things, Duke!", kind: "shout" },
  { who: "alvin", t0: 15.7, t1: 17.8, text: "Has anyone checked… the big guy?" },
  { who: "gus", t0: 18.3, t1: 19.4, text: "Mmm. Crunchy." },
  { who: "gus", t0: 21.0, t1: 22.5, text: "Oh! Was that bag C?" },
  { who: "pia", t0: 22.6, t1: 24.0, text: "#@%&!", kind: "grawlix" },
  { who: "duke", t0: 27.0, t1: 29.7, text: "Best. Tool. Ever." },
  { who: "lefty", t0: 31.0, t1: 32.5, text: "Uh… where do I go?" },
  { who: "lefty", t0: 33.4, t1: 34.3, text: "…Nope.", kind: "whisper" },
];
fitBubbles(BUBBLES, VOICE);
const speaking = makeSpeaking(BUBBLES, VOICE);

const CAM: CamKey[] = [
  [0, 260, -130, 1.55, 0], [3.6, 230, -150, 1.75, 0.3], [5.0, -170, -200, 1.5, 0], [6.9, 230, -150, 1.3, 0], [8.3, 230, -170, 1.6, 0],
  [9.9, 0, -240, 0.95, 0], [12.7, 230, -150, 1.4, 0], [14.1, -150, -200, 1.1, 0.3], [15.7, -40, 150, 1.9, 0], [17.9, -470, -170, 1.6, 0.3],
  [19.5, 0, -240, 0.95, 0], [20.3, -280, -200, 1.15, 0.2], [21.0, -470, -170, 1.6, 0], [22.6, 230, -150, 1.6, 0], [24.1, -170, -240, 1.0, 0.4],
  [27.0, -170, -200, 1.45, 0], [29.8, 320, 60, 1.2, 0.6], [30.8, 170, 120, 1.9, 0.4], [32.6, -470, -170, 1.6, 0], [33.4, 170, 120, 1.9, 0], [34.3, 0, -240, 0.95, 0.3],
];
const cam = makeCam(CAM, [[3.6, 10], [8.4, 12], [11.7, 18], [14.3, 24], [19.5, 8], [20.3, 16], [22.6, 14], [24.2, 8], [24.9, 8], [25.6, 8], [26.3, 10]]);
const FLASHES = [8.4, 22.6];
const BURSTS: BurstT[] = [
  [14.3, -300, -260, "FWOOMP!", C.sun, -6], [20.3, -470, -340, "BURP!", C.mint, -8], [20.8, 40, -320, "KA-CHUNK!", C.sky, 6],
  [24.2, -470, -340, "BURP!", C.mint, 6], [24.9, -470, -340, "BURRP!", C.gum, -6], [25.6, -470, -340, "BUURRP!", C.sun, 8], [26.3, -470, -340, "BURP!", C.mint, -4],
  [32.7, -470, -300, "SLURP!", C.gum, 5],
];
const SFX: Cue[] = [
  [0.45, "sfx_pop", 0.6], [1.45, "sfx_pop", 0.6], [2.6, "sfx_roll", 0.6], [3.25, "sfx_roll", 0.5], [6.9, "sfx_whoosh", 0.6], [7.15, "sfx_pop", 0.4], [7.45, "sfx_pop", 0.4],
  [7.75, "sfx_pop", 0.4], [8.05, "sfx_pop", 0.4], [8.4, "sfx_thunder", 0.9], [9.9, "sfx_whoosh", 0.7], [10.3, "sfx_bonk", 0.4], [11.7, "sfx_thunk", 0.8],
  [12.2, "sfx_bonk", 0.4], [14.3, "sfx_rip", 0.8], [14.3, "sfx_whoosh", 0.8], [17.9, "sfx_whoosh", 0.7], [19.5, "sfx_scratch", 0.8], [20.3, "sfx_burp", 1],
  [20.8, "sfx_chunk", 0.8], [22.6, "sfx_thunder", 0.8], [24.2, "sfx_burp", 0.9], [24.6, "sfx_chunk", 0.7], [24.9, "sfx_burp", 0.9], [25.3, "sfx_chunk", 0.7],
  [25.6, "sfx_burp", 0.9], [26.0, "sfx_chunk", 0.7], [26.3, "sfx_burp", 1], [26.7, "sfx_chunk", 0.8], [26.9, "brand/ding.wav", 0.6], [29.8, "sfx_roll", 0.8],
  [30.8, "sfx_scratch", 0.5], [32.7, "brand/boing.wav", 0.5], [34.3, "sfx_whoosh", 0.7], [34.3, "sfx_roll", 0.8],
];

// SKRAMMEL pieces (dresser at world 40,40)
const scatter = (i: number, k: number) => ({ x: -260 + ((i * 137 + k * 71) % 520), y: 70 + ((i * 53 + k * 29) % 70), r: ((i * 97 + k * 41) % 180) - 90 });
const P = (id: string, w: number, h: number, bx: number, by: number, color: string, i: number, snap: number, extra: Partial<PieceDef> = {}): PieceDef => ({
  id, w, h, built: { x: bx, y: by, r: 0 }, pile: { x: -330 + i * 14, y: -60 - h / 2 + 8 + i * 3, r: -6 + i * 1.5 }, fall: scatter(i, 2), off: scatter(i, 1), color,
  ev: [[0, "pile"], [14.3, "off"], [snap, "built"]], ...extra,
});
const PIECES: PieceDef[] = [
  P("back", 276, 290, 0, -152, C.mint, 4, 20.8),
  P("left", 24, 300, -150, -150, C.sun, 0, 24.4),
  P("right", 24, 300, 150, -150, C.sun, 1, 24.5),
  P("bot", 300, 22, 0, -11, C.sun, 2, 25.1),
  P("top", 330, 26, 0, -313, C.tomato, 3, 25.2),
  P("d1", 270, 82, 0, -255, C.sky, 5, 25.8, { knob: true, label: "SOCKS" }),
  P("d2", 270, 82, 0, -165, C.sky, 6, 25.9, { knob: true, label: "MORE SOCKS" }),
  P("d3", 270, 82, 0, -75, C.sky, 7, 26.5, { knob: true, label: "SNACKS" }),
];
const BURPS = [20.3, 24.2, 24.9, 25.6, 26.3];

const Cup: React.FC<{ label: string; n: number; f: number }> = ({ label, n, f }) => (
  <g>
    {[...Array(n)].map((_, i) => <path key={i} d="M-3 0 v-26 M-7 -26 h14" stroke="#64748b" strokeWidth={4} transform={`translate(${-22 + (i % 6) * 9} ${-48 + Math.floor(i / 6) * 5}) rotate(${(i * 37) % 30 - 15})`} />)}
    <path d="M-36 -50 L36 -50 L28 0 L-28 0 Z" fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <rect x={-20} y={-38} width={40} height={24} rx={4} fill={label === "C" ? C.tomato : C.sun} stroke={INK} strokeWidth={3} />
    <text x={0} y={-19} textAnchor="middle" fontFamily={LUCKY} fontSize={20} fill={INK}>{label}</text>
  </g>
);
const Bag: React.FC = () => (
  <g><path d="M-40 -60 L40 -60 L44 40 L-44 40 Z" fill="#e0f2fe" stroke={INK} strokeWidth={5} strokeLinejoin="round" opacity={0.95} />
    <rect x={-40} y={-60} width={80} height={14} fill={C.tomato} stroke={INK} strokeWidth={4} />
    <text x={0} y={14} textAnchor="middle" fontFamily={LUCKY} fontSize={46} fill={INK}>C</text></g>
);
const Moth: React.FC<{ f: number }> = ({ f }) => (
  <g><ellipse rx={8} ry={14} fill="#a8a29e" stroke={INK} strokeWidth={3} />
    {[-1, 1].map((s) => <ellipse key={s} cx={s * 18} cy={-4} rx={18} ry={11 * Math.abs(Math.sin(f / 2))} fill="#d6d3d1" stroke={INK} strokeWidth={3} />)}
    <circle cx={-3} cy={-8} r={2} fill={INK} /><circle cx={3} cy={-8} r={2} fill={INK} /></g>
);
const ScrewFly: React.FC = () => (
  <g><path d="M-6 0 L-6 34 L0 44 L6 34 L6 0 Z" fill="#cbd5e1" stroke={INK} strokeWidth={4} /><ellipse cx={0} cy={0} rx={18} ry={8} fill="#e2e8f0" stroke={INK} strokeWidth={4} /></g>
);

const ManualInsert: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const a = t - 6.9;
  if (a < 0 || a > 1.4) return null;
  const inP = back(clamp(a / 0.2)), out = clamp((a - 1.2) / 0.2);
  const flip = Math.abs(Math.cos(((a % 0.3) / 0.3) * Math.PI));
  return (
    <AbsoluteFill style={{ background: `rgba(30,27,75,${0.45 * (1 - out)})` }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <g transform={`translate(540 900) scale(${4.2 * inP * (1 - out)}) rotate(-4)`}><g transform={`scale(${0.25 + flip * 0.75} 1)`}><Manual f={f} name="SKRAMMEL" page="C" /></g></g>
      </svg>
      <div style={{ position: "absolute", top: 1400, width: 1080, textAlign: "center", fontFamily: LUCKY, fontSize: 64, color: "#fff", WebkitTextStroke: `4px ${INK}`, opacity: 1 - out }}>PAGE {1 + Math.floor(a / 0.3)} · BAG C</div>
    </AbsoluteFill>
  );
};

export const FlatpackEp2: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cm = cam(t);
  const items: { y: number; node: React.ReactNode }[] = [];
  items.push({ y: -40, node: <PalletBox key="box" t={t} name="SKRAMMEL" flat={t > 14.25 && t < 14.6 ? 99 : -1} x={-300} /> });
  items.push({ y: 40, node: <g key="dresser" transform="translate(40 40)">{PIECES.map((p) => <Piece key={p.id} def={p} t={t} />)}</g> });

  const pos = { pia: posAt(MOVE.pia, t), duke: posAt(MOVE.duke, t), gus: posAt(MOVE.gus, t), lotta: posAt(MOVE.lotta, t) };
  (Object.keys(MOOD) as FurniId[]).forEach((id) => {
    const m = moodAt(MOOD[id], t), p = pos[id];
    let hop = p.walk + (m.since < 0.35 ? Math.sin((m.since / 0.35) * Math.PI) * 55 : 0);
    let squash = 0;
    let talk = speaking(id, t);
    if (id === "gus") {
      if ((t > 0 && t < 3.6) || (t > 9.9 && t < 19.5)) talk = talk || Math.sin(t * 9) > 0.2; // munching
      for (const b of BURPS) if (t > b - 0.15 && t < b + 0.35) { squash += Math.sin(((t - b + 0.15) / 0.5) * Math.PI) * 0.18; }
    }
    if (id === "duke" && t > 24.8 && t < 29.7) hop += Math.abs(Math.sin(t * 7)) * 30;
    if (id === "pia" && t > 9.9 && t < 15.5) hop += Math.abs(Math.sin(t * 9)) * 22;
    let yaw = YAW[id];
    if (id === "gus" && t > 32.6) yaw = -0.5;
    items.push({ y: p.y, node: furniNode(id, p, { ...m, frame, yaw, talk, hop, squash }) });
  });

  // cups + bag C + moth
  const cups: [string, number][] = [["A", 24], ["B", 16], ["C", 0]];
  cups.forEach(([l, n], i) => {
    const pop = clamp((t - (0.3 + i * 1.0)) / 0.2);
    const knocked = t > 10.4 && t < 15.6 && i === 0;
    items.push({ y: 232 + i, node: <g key={`cup${l}`} transform={`translate(${110 + i * 95} 236) scale(${0.6 + pop * 0.4}) rotate(${knocked ? 80 : 0})`}><Cup label={l} n={knocked ? 4 : n} f={frame} /></g> });
  });
  if (t < 5.0) {
    const shake = t > 3.0 && t < 4.9 ? Math.sin(t * 50) * 18 : 0;
    items.push({ y: pos.pia.y + 2, node: <g key="bag" transform={`translate(${pos.pia.x - 140 + shake} ${pos.pia.y - 190}) rotate(${shake * 0.5}) scale(${clamp((t - 2.4) / 0.2)})`}><Bag /></g> });
    if (t > 3.2) { const a = (t - 3.2) / 1.8; items.push({ y: 500, node: <g key="moth" transform={`translate(${pos.pia.x - 140 + a * 260 + Math.sin(a * 20) * 30} ${pos.pia.y - 260 - a * 420})`}><Moth f={frame} /></g> }); }
  }
  // Alvin on the floor
  items.push({ y: 250, node: <g key="alvin" transform={`translate(-40 ${250 + (t > 15.7 && t < 17.8 ? -Math.abs(Math.sin(t * 8)) * 10 : 0)})`}><Alvin f={frame} spin={90} size={0.8} look={t > 17 ? -1 : 0} /></g> });
  // packing-peanut storm
  if (t > 9.9 && t < 17.0) {
    const burst = t > 14.3 ? 1 : 0.35;
    items.push({ y: 400, node: <g key="peanuts">{[...Array(Math.round(50 * burst))].map((_, i) => {
      const life = 1.6, ph = ((t - 9.9) * 1.2 + random(`ph${i}`) * life) % life;
      const x0 = -300, y0 = -200, vx = (random(`vx${i}`) - 0.5) * 1400, vy = -600 - random(`vy${i}`) * 700;
      return <path key={i} d="M-12 -4 Q-14 -14 0 -10 Q14 -6 12 4 Q14 14 0 10 Q-14 6 -12 -4 Z" transform={`translate(${x0 + vx * ph} ${y0 + vy * ph + 700 * ph * ph}) rotate(${ph * 700 + i * 30})`} fill="#fff" stroke={INK} strokeWidth={3} />;
    })}</g> });
  }
  // screws burped from Gus to the dresser
  BURPS.forEach((b, k) => {
    const a = (t - b) / 0.5;
    if (a < 0 || a > 1) return;
    const gx = pos.gus.x + 40, gy = pos.gus.y - 230, tx = 40 + [0, -150, 0, 0, 0][k], ty = 40 - [152, 150, 11, 165, 75][k];
    items.push({ y: 600, node: <g key={`sc${k}`} transform={`translate(${lerp(gx, tx, ease(a))} ${lerp(gy, ty, ease(a)) - Math.sin(a * Math.PI) * 260}) rotate(${a * 900})`}><ScrewFly /></g> });
  });
  const lefty = leftyNode(t, frame, 29.8, 170, 262, speaking("lefty", t), 34.3);
  if (lefty) items.push({ y: 262, node: lefty });

  const heads = (w: Who) => w === "alvin" ? { x: -40, y: 250 - HEAD.alvin - 40 } : w === "lefty" ? { x: 170, y: 262 - HEAD.lefty } : { x: pos[w as FurniId].x, y: pos[w as FurniId].y - HEAD[w] };
  const n = t < 6.9 ? null : t < 20.8 ? 1 : t < 24.4 ? 2 : t < 26.8 ? Math.min(11, 2 + Math.floor((t - 24.4) * 4)) : t < 29.8 ? 12 : null;
  const angry = (t > 8.3 && t < 19.5) || (t > 22.6 && t < 24.1);
  return (
    <Stage t={t} cam={cm} items={items} wall={["#cfe6ff", "#b9dbff"]} angry={angry} storm={angry ? 0.12 : 0}>
      <Overlays t={t} cam={cm} bubbles={BUBBLES} voice={VOICE} heads={heads} bursts={BURSTS} />
      <StepCounter t={t} n={n} of={12} />
      <Scoreboard t={t} t0={10.1} t1={17.2} cells={[["SCREWS FOUND", 0, C.tomato], ["PANIC", `${Math.min(99, Math.floor((t - 10.1) * 14))}%`, C.teal]]} />
      <ManualInsert t={t} f={frame} />
      <Versus t={t} t0={11.7} left="DUKE" right="PIA" />
      <LogoStamp t={t} t0={1.0} sub="EP. 2 · BAG C IS EMPTY" />
      <AbsoluteFill style={{ background: "#fff", opacity: flashAt(t, FLASHES) }} />
      {t > STORY - 0.01 && <AbsoluteFill style={{ opacity: clamp((t - STORY) / 0.2) }}><Sequence from={Math.round(STORY * FPS)} layout="none"><Outro /></Sequence></AbsoluteFill>}
      <EpisodeAudio music="flatpack/music_ep2.wav" sfx={SFX} bubbles={BUBBLES} voice={VOICE} grawlix={[{ t: 22.6, whos: ["pia"] }]} />
    </Stage>
  );
};
