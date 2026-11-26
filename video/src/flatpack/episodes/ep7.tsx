/** SOME ASSEMBLY RAGE – Ep. 7 "The Wardrobe of Doom, part 3: The Rescue" (FLÄRPA) – Lotta punchline + leftover DOOR. */
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import type { Expr } from "../../cast/rig";
import { C } from "../furni";
import type { FurniId } from "../furni";
import {
  type Bub, type BurstT, type CamKey, type Cue, type MoodKey, type MoveKey, type Voice, type Who,
  EpisodeAudio, FPS, HEAD, INK, LogoStamp, Overlays, Piece, Scoreboard, Stage,
  clamp, dustNode, ease, fitBubbles, flashAt, furniNode, leftyNode, lerp, makeCam, makeSpeaking, moodAt, posAt,
} from "../kit";
import { DoorFrame, FrontDoor, GiantBox, WARD, wardrobePieces } from "../wardrobe";
import { Junior } from "../junior";
import { Outro, OUTRO_LEN } from "../Outro";
import VOICE_RAW from "../ep7.voice.json";

const VOICE = VOICE_RAW as Voice[];
const STORY = 27.0;
export const EP7_LEN = Math.round((STORY + OUTRO_LEN) * FPS);
const OUT = 17.6, PUSH = 15.8, DROP = 22.9;

const MOOD: Record<FurniId, MoodKey[]> = {
  pia: [[0, "surprised", "shock"], [0.6, "scared", "sweat"], [3.3, "angry", "storm"], [6.0, "confused", "confused"], [7.0, "scared", "sweat"], [8.6, "neutral", "none"], [9.8, "surprised", "shock"], [10.0, "angry", "grawlix"], [11.4, "angry", "storm"], [14.4, "confused", "confused"], [PUSH, "surprised", "shock"], [16.4, "angry", "none"], [OUT, "surprised", "shock"], [18.3, "happy", "none"], [20.7, "confused", "confused"], [DROP, "surprised", "shock"], [25.2, "angry", "grawlix"]],
  gus: [[0, "scared", "sweat"], [5.6, "happy", "joy"], [7.0, "happy", "music"], [7.4, "scared", "sweat"], [8.6, "happy", "none"], [10.0, "scared", "sweat"], [11.4, "angry", "rage"], [14.4, "surprised", "shock"], [16.2, "love", "love"], [OUT, "laugh", "music"], [DROP, "surprised", "shock"], [25.2, "angry", "storm"]],
  lotta: [[0, "neutral", "zzz"], [14.2, "neutral", "none"], [15.4, "smug", "sparkle"], [OUT, "smug", "none"], [25.2, "smug", "sparkle"]],
  duke: [[0, "neutral", "none"], [OUT, "surprised", "shock"], [18.3, "happy", "joy"], [20.7, "confused", "confused"], [DROP, "surprised", "shock"], [25.2, "angry", "storm"]],
};
const MOVE: Record<FurniId, MoveKey[]> = {
  pia: [[0, -440, 170, 0]],
  gus: [[0, -600, 60, 0], [5.6, -190, 200, 0.6], [11.0, -560, 120, 0.6]],
  lotta: [[0, 660, -10, 0], [14.4, 330, 40, 1.0]],
  duke: [[0, 60, 60, 0], [OUT, -120, 170, 0.6]],
};
const YAW: Record<FurniId, number> = { duke: 0.3, gus: 0.4, pia: 0.45, lotta: -0.4 };
const JMOVE: MoveKey[] = [[0, -240, 105, 0], [8.3, 230, 235, 0.5], [10.6, -240, 105, 0.6]];

const BUBBLES: Bub[] = [
  { who: "duke", t0: 0.2, t1: 3.2, text: "It's DARK in here! And there's a SOCK!", kind: "shout" },
  { who: "pia", t0: 3.3, t1: 5.9, text: "To open: step one… disassemble everything." },
  { who: "gus", t0: 6.0, t1: 6.9, text: "Or I knock!" },
  { who: "duke", t0: 7.3, t1: 8.3, text: "Ow! OW!", kind: "shout" },
  { who: "junior", t0: 8.7, t1: 9.7, text: "Hnnngh!", kind: "shout" },
  { who: "pia", t0: 10.0, t1: 11.3, text: "#@%&!", kind: "grawlix" },
  { who: "lotta", t0: 16.2, t1: 17.5, text: "It says… push." },
  { who: "duke", t0: 18.3, t1: 20.6, text: "Freedom! …Did we finish it?", kind: "shout" },
  { who: "pia", t0: 20.7, t1: 21.6, text: "…Yes?" },
  { who: "lefty", t0: 23.5, t1: 25.1, text: "Uh… where do WE go?" },
  { who: "all", t0: 25.3, t1: 26.7, text: "#@%&!!", kind: "grawlix" },
];
fitBubbles(BUBBLES, VOICE);
const speaking = makeSpeaking(BUBBLES, VOICE);

const CAM: CamKey[] = [
  [0, 60, -420, 1.25, 0], [3.3, -440, -190, 1.5, 0], [6.0, -190, -160, 1.45, 0], [7.0, -60, -300, 1.0, 0.2], [8.6, 230, -100, 1.45, 0.3],
  [10.0, -440, -190, 1.55, 0], [11.4, 0, -260, 0.95, 0], [14.2, 560, -250, 1.3, 0.4], [15.0, 200, -280, 1.0, 0.6], [16.2, 330, -210, 1.6, 0],
  [OUT, 0, -250, 0.95, 0], [18.3, -120, -190, 1.5, 0.3], [20.7, -440, -190, 1.55, 0], [21.8, 300, 60, 1.2, 0.6], [22.8, 260, 40, 1.35, 0.4], [25.2, 0, -260, 0.95, 0.2],
];
const cam = makeCam(CAM, [[0.2, 8], [1.6, 8], [7.0, 12], [7.4, 12], [7.8, 16], [9.8, 10], [10.0, 14], [11.4, 12], [OUT, 12], [DROP + 0.4, 30], [25.3, 14]]);
const FLASHES = [10.0, 25.3];
const BURSTS: BurstT[] = [
  [7.0, 40, -420, "BONK!", C.gum, -8], [7.4, 140, -300, "BONK!", C.gum, 8], [7.8, -20, -500, "BONK!", C.tomato, -4],
  [9.8, 250, -330, "POP!", C.sky, 6], [DROP + 0.4, 560, -200, "WHUMP!", C.sun, -6],
];
const SFX: Cue[] = [
  [0.1, "sfx_thunk", 0.4], [1.5, "sfx_thunk", 0.4], [3.4, "sfx_pop", 0.3], [7.0, "sfx_bonk", 0.9], [7.4, "sfx_bonk", 0.9], [7.8, "sfx_bonk", 1],
  [8.6, "sfx_ratchet", 0.4], [9.8, "sfx_pop", 0.9], [11.4, "sfx_thunder", 0.6], [14.2, "brand/ding.wav", 0.3], [15.4, "sfx_shimmer", 0.8], [PUSH, "sfx_whoosh", 0.5],
  [OUT, "sfx_roll", 0.6], [OUT + 0.1, "brand/boing.wav", 0.5], [21.8, "sfx_roll", 0.8], [DROP, "sfx_whoosh", 0.7], [DROP + 0.4, "sfx_crash", 0.8],
];
const EV: Record<string, [number, string][]> = {};
const doorOpen = (t: number) => clamp((t - PUSH) / 0.3);

const Sock: React.FC = () => (
  <g transform="rotate(-18)"><path d="M-30 -60 h50 v60 q 0 30 30 34 q 26 4 22 34 h-60 q -42 0 -42 -40 Z" fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <rect x={-30} y={-60} width={50} height={16} fill={C.tomato} stroke={INK} strokeWidth={4} /><circle cx={30} cy={40} r={6} fill={C.sky} /></g>
);
const ExtraDoor: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={-90} y={-520} width={180} height={520} rx={6} fill={C.grape} stroke={INK} strokeWidth={6} />
    <rect x={56} y={-320} width={16} height={120} rx={8} fill={C.sun} stroke={INK} strokeWidth={4} />
    {[-1, 1].map((s) => <g key={s} transform={`translate(${s * 34} -360)`}><ellipse rx={26} ry={30} fill="#fff" stroke={INK} strokeWidth={5} /><circle cx={Math.sin(f / 7) * 8} cy={6} r={11} fill={INK} /></g>)}
  </g>
);

export const FlatpackEp7: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cm = cam(t);
  const items: { y: number; node: React.ReactNode }[] = [];
  items.push({ y: -100, node: <FrontDoor key="door" open={1} /> });
  items.push({ y: -55, node: <DoorFrame key="frame" /> });
  items.push({ y: -60, node: <GiantBox key="box" t={t} tIn={-10} push={0} tilt={0} tWedge={-1} tRip={-1} /> });
  const inside = t < OUT;
  const rattle = (inside && speaking("duke", t)) ? Math.sin(t * 40) * 2 : [7.0, 7.4, 7.8].some((b) => t > b && t < b + 0.35) ? Math.sin(t * 60) * 3 : 0;
  items.push({ y: 45, node: <g key="ward" transform={`translate(${WARD.x} ${WARD.y}) rotate(${rattle})`}>{wardrobePieces(EV, doorOpen, t, { handleOff: t > 9.8, push: true }).map((p) => <Piece key={p.id} def={p} t={t} />)}</g> });

  const pos = { pia: posAt(MOVE.pia, t), gus: posAt(MOVE.gus, t), lotta: posAt(MOVE.lotta, t), duke: posAt(MOVE.duke, t) };
  (Object.keys(MOOD) as FurniId[]).forEach((id) => {
    if (id === "duke" && inside) return;
    const m = moodAt(MOOD[id], t), p = pos[id];
    let hop = p.walk + (m.since < 0.35 ? Math.sin((m.since / 0.35) * Math.PI) * 55 : 0);
    if (t > 11.4 && t < 14.2 && id !== "lotta") hop += Math.abs(Math.sin(t * 10 + id.length)) * 30;
    if (t > 25.2 && id !== "lotta") hop += Math.abs(Math.sin(t * 12 + id.length)) * 34;
    if (id === "duke" && t < OUT + 0.6) hop += Math.sin(clamp((t - OUT) / 0.6) * Math.PI) * 90;
    const glow = id === "lotta" ? (t > 15.2 && t < 17.6 ? clamp((t - 15.2) / 0.3) : 0) : 0;
    const talk = speaking(id, t) || (id === "lotta" && t > 16.2 && t < 17.4 && speaking("lotta", t));
    items.push({ y: id === "duke" ? Math.max(p.y, 60) + 20 : p.y, node: furniNode(id, p, { ...m, frame, yaw: YAW[id], talk, hop, glow }) });
  });
  // Duke's sock hat
  if (!inside) {
    const p = pos.duke;
    const hop = t < OUT + 0.6 ? Math.sin(clamp((t - OUT) / 0.6) * Math.PI) * 90 : 0;
    const ds = 1 + (p.y - 100) * 0.0011;
    items.push({ y: p.y + 21, node: <g key="sock" transform={`translate(${p.x - 10} ${p.y - 395 * ds - hop})`}><Sock /></g> });
  }
  // handle flies off
  if (t > 9.8 && t < 10.6) {
    const a = (t - 9.8) / 0.8;
    items.push({ y: 400, node: <g key="handle" transform={`translate(${lerp(250, 520, a)} ${lerp(-260, 220, a) - Math.sin(a * Math.PI) * 300}) rotate(${a * 900})`}><rect x={-8} y={-60} width={16} height={120} rx={8} fill={C.sun} stroke={INK} strokeWidth={4} /></g> });
  } else if (t >= 10.6) items.push({ y: 222, node: <g key="handle2" transform="translate(520 220) rotate(80)"><rect x={-8} y={-60} width={16} height={120} rx={8} fill={C.sun} stroke={INK} strokeWidth={4} /></g> });
  // Junior
  {
    const jp = posAt(JMOVE, t);
    const jexpr: Expr = t < 8.6 ? "happy" : t < 9.8 ? "angry" : t < 11.4 ? "surprised" : t < OUT ? "sad" : t < DROP ? "happy" : t < 25.2 ? "surprised" : "angry";
    const strain = t > 8.6 && t < 9.8 ? Math.sin(t * 50) * 6 : 0;
    const fly = t > 9.8 && t < 10.3 ? Math.sin(((t - 9.8) / 0.5) * Math.PI) * 60 : 0;
    items.push({ y: jp.y, node: <g key="junior" transform={`translate(${jp.x + strain - fly} ${jp.y - fly * 0.5}) scale(1.3) translate(-150 -392)`}><Junior f={frame} expr={jexpr} talk={speaking("junior", t)} awake walk={jp.walk > 0 ? t : 0} yaw={-0.3} /></g> });
  }
  // the leftover DOOR
  if (t > DROP) {
    const a = clamp((t - DROP) / 0.4);
    const y = lerp(-1600, 240, a * a);
    const rot = a < 1 ? 0 : -lerp(0, 88, ease(clamp((t - DROP - 0.4) / 0.25)));
    items.push({ y: 240, node: <g key="xdoor" transform={`translate(300 ${y}) rotate(${-rot})`}><ExtraDoor f={frame} /></g> });
    const d = dustNode(t, DROP + 0.55, 560, 250, "whump"); if (d) items.push({ y: 260, node: d });
  }
  const lefty = leftyNode(t, frame, 21.8, 170, 262, speaking("lefty", t));
  if (lefty) items.push({ y: 263, node: lefty });

  const jp = posAt(JMOVE, t);
  const heads = (w: Who) => {
    if (w === "duke" && inside) return { x: WARD.x, y: WARD.y - 650 };
    if (w === "junior") return { x: jp.x, y: jp.y - 300 };
    if (w === "lefty") return { x: 170, y: 262 - HEAD.lefty };
    return { x: pos[w as FurniId].x, y: pos[w as FurniId].y - HEAD[w] };
  };
  const angry = (t > 10.0 && t < 14.2) || t > 25.2;
  return (
    <Stage t={t} cam={cm} items={items} wall={["#d7f5e3", "#c2eed4"]} angry={angry} storm={angry ? 0.12 : 0}>
      <Overlays t={t} cam={cm} bubbles={BUBBLES} voice={VOICE} heads={heads} bursts={BURSTS} />
      <Scoreboard t={t} t0={11.5} t1={14.2} cells={[["DUKE", "TRAPPED", C.tomato], ["MINUTES", 47, C.teal]]} />
      <LogoStamp t={t} t0={3.4} sub="THE WARDROBE OF DOOM · PART 3" />
      <AbsoluteFill style={{ background: "#fff", opacity: flashAt(t, FLASHES) }} />
      {t > STORY - 0.01 && <AbsoluteFill style={{ opacity: clamp((t - STORY) / 0.2) }}><Sequence from={Math.round(STORY * FPS)} layout="none"><Outro /></Sequence></AbsoluteFill>}
      <EpisodeAudio music="flatpack/music_ep7.wav" sfx={SFX} bubbles={BUBBLES} voice={VOICE} grawlix={[{ t: 10.0, whos: ["pia"] }, { t: 25.3, whos: ["duke", "pia", "gus"] }]} />
    </Stage>
  );
};
