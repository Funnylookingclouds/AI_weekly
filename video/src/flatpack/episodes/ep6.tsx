/** SOME ASSEMBLY RAGE – Ep. 6 "The Wardrobe of Doom, part 2: Page 96" (FLÄRPA). */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import type { Expr } from "../../cast/rig";
import { C, LUCKY } from "../furni";
import type { FurniId } from "../furni";
import {
  type Bub, type BurstT, type CamKey, type Cue, type MoodKey, type MoveKey, type Voice, type Who,
  EpisodeAudio, FPS, HEAD, INK, LogoStamp, Overlays, Piece, Stage, StepCounter,
  clamp, fitBubbles, flashAt, furniNode, leftyNode, makeCam, makeSpeaking, moodAt, posAt,
} from "../kit";
import { DoorFrame, EndCard, FrontDoor, GiantBox, WARD, wardrobePieces } from "../wardrobe";
import { Junior } from "../junior";
import { Outro, OUTRO_LEN } from "../Outro";
import VOICE_RAW from "../ep6.voice.json";

const VOICE = VOICE_RAW as Voice[];
const STORY = 22.2;
export const EP6_LEN = Math.round((STORY + OUTRO_LEN) * FPS);
const STORED = 13.3;

const MOOD: Record<FurniId, MoodKey[]> = {
  pia: [[0, "surprised", "shock"], [2.0, "angry", "none"], [3.3, "angry", "rage"], [4.6, "neutral", "none"], [6.4, "happy", "none"], [9.0, "surprised", "shock"], [9.6, "angry", "storm"], [11.2, "angry", "rage"], [12.4, "confused", "confused"], [STORED, "surprised", "shock"], [14.7, "scared", "sweat"], [16.2, "confused", "confused"], [19.0, "scared", "sweat"]],
  duke: [[0, "surprised", "shock"], [2.0, "smug", "sparkle"], [3.3, "angry", "none"], [4.6, "happy", "music"], [9.0, "smug", "none"], [9.6, "surprised", "shock"], [11.2, "smug", "sparkle"], [12.4, "happy", "none"]],
  gus: [[0, "happy", "none"], [0.4, "surprised", "shock"], [2.0, "happy", "none"], [6.4, "love", "love"], [9.6, "confused", "confused"], [STORED, "surprised", "shock"], [14.7, "scared", "sweat"], [16.2, "confused", "confused"]],
  lotta: [[0, "neutral", "zzz"]],
};
const MOVE: Record<FurniId, MoveKey[]> = {
  pia: [[0, -440, 170, 0]],
  duke: [[0, -240, 140, 0], [12.4, 40, 110, 0.6]],
  gus: [[0, -600, 60, 0]],
  lotta: [[0, 660, -10, 0]],
};
const YAW: Record<FurniId, number> = { duke: 0.4, gus: 0.4, pia: 0.45, lotta: -0.4 };
const JMOVE: MoveKey[] = [[0, -1000, 245, 0], [6.0, -320, 250, 0.6]];

const BUBBLES: Bub[] = [
  { who: "pia", t0: 0.4, t1: 1.9, text: "It's NINETY-SIX pages.", kind: "shout" },
  { who: "duke", t0: 2.0, t1: 3.2, text: "I'll build it from memory." },
  { who: "pia", t0: 3.3, t1: 4.5, text: "You've never SEEN it!", kind: "shout" },
  { who: "junior", t0: 6.4, t1: 7.8, text: "I can help, Dad!" },
  { who: "gus", t0: 7.9, t1: 8.6, text: "Aww." },
  { who: "pia", t0: 9.6, t1: 11.1, text: "The hinges are on the OUTSIDE!", kind: "shout" },
  { who: "duke", t0: 11.2, t1: 12.4, text: "Easier to reach!" },
  { who: "duke", t0: 13.6, t1: 14.6, text: "…Guys?", kind: "whisper" },
  { who: "pia", t0: 15.2, t1: 16.1, text: "Duke? DUKE?!", kind: "shout" },
  { who: "gus", t0: 16.2, t1: 17.5, text: "Is he… stored?" },
  { who: "lefty", t0: 19.0, t1: 20.7, text: "Uh… where does HE go?" },
];
fitBubbles(BUBBLES, VOICE);
const speaking = makeSpeaking(BUBBLES, VOICE);

const CAM: CamKey[] = [
  [0, -150, -230, 0.95, 0], [2.0, -240, -210, 1.45, 0], [3.3, -440, -190, 1.45, 0], [4.6, -60, -280, 0.95, 0.3], [6.4, -320, 60, 1.5, 0.3],
  [7.9, -600, -160, 1.5, 0], [9.0, 60, -300, 1.0, 0], [9.6, -440, -190, 1.5, 0], [11.2, -240, -210, 1.5, 0], [12.4, 0, -300, 0.95, 0.3],
  [13.6, 60, -420, 1.25, 0.4], [15.2, -440, -190, 1.55, 0], [16.2, -600, -160, 1.55, 0], [17.8, 260, 60, 1.2, 0.6], [18.8, 170, 120, 1.85, 0.4], [20.8, 0, -280, 0.95, 0.3],
];
const cam = makeCam(CAM, [[0.3, 8], [3.4, 12], [9.0, 10], [9.3, 10], [STORED, 18], [15.2, 8]]);
const FLASHES = [3.4, 9.7];
const BURSTS: BurstT[] = [[9.0, -40, -420, "KLUNK!", "#cbd5e1", -6], [9.3, 170, -400, "KLUNK!", "#cbd5e1", 6], [STORED + 0.05, 60, -250, "CLICK.", "#fff", -4]];
const SFX: Cue[] = [
  [0.2, "sfx_whoosh", 0.6], [0.4, "sfx_pop", 0.3], [0.6, "sfx_pop", 0.3], [0.8, "sfx_pop", 0.3], [1.0, "sfx_pop", 0.3], [3.4, "sfx_thunder", 0.7],
  [4.9, "sfx_chunk", 0.6], [5.4, "sfx_chunk", 0.6], [5.9, "sfx_chunk", 0.6], [6.0, "sfx_roll", 0.4], [6.4, "sfx_chunk", 0.6], [6.9, "sfx_chunk", 0.6],
  [9.0, "sfx_chunk", 1], [9.3, "sfx_chunk", 1], [9.7, "sfx_thunder", 0.6], [12.5, "sfx_whoosh", 0.4], [13.0, "brand/boing.wav", 0.4], [STORED + 0.05, "sfx_thunk", 0.8],
  [14.7, "sfx_scratch", 0.4], [17.8, "sfx_roll", 0.8], [20.9, "sfx_pop", 0.8],
];
const doorOpen = (t: number) => (t < 12.5 ? 0 : t < STORED ? clamp((t - 12.5) / 0.3) : 1 - clamp((t - STORED) / 0.12));
const EV: Record<string, [number, string][]> = {
  back: [[0, "pile"], [4.9, "built"]], left: [[0, "pile"], [5.4, "built"]], right: [[0, "pile"], [5.9, "built"]], bot: [[0, "pile"], [6.4, "built"]],
  top: [[0, "pile"], [6.9, "built"]], doorL: [[0, "pile"], [9.0, "built"]], doorR: [[0, "pile"], [9.3, "built"]],
};

const Accordion: React.FC<{ t: number; x0: number; y0: number }> = ({ t, x0, y0 }) => {
  const open = t < 4.5 ? clamp((t - 0.2) / 1.0) : 1 - clamp((t - 4.5) / 0.4);
  const n = Math.round(24 * open);
  return (
    <g>
      {[...Array(n)].map((_, i) => {
        const x = x0 + i * 58, sk = i % 2 ? 1 : -1;
        return (
          <g key={i} transform={`translate(${x} ${y0 + Math.sin(i * 0.7 + t * 3) * 8})`}>
            <path d={`M0 ${sk * 8} L58 ${-sk * 8} L58 ${150 - sk * 8} L0 ${150 + sk * 8} Z`} fill={i % 2 ? "#fff" : "#f1f5f9"} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
            <text x={29} y={84} textAnchor="middle" fontFamily={LUCKY} fontSize={22} fill={INK}>{i === n - 1 && n === 24 ? 96 : i * 4 + 1}</text>
          </g>
        );
      })}
    </g>
  );
};

export const FlatpackEp6: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cm = cam(t);
  const items: { y: number; node: React.ReactNode }[] = [];
  items.push({ y: -100, node: <FrontDoor key="door" open={1} /> });
  items.push({ y: -55, node: <DoorFrame key="frame" /> });
  items.push({ y: -60, node: <GiantBox key="box" t={t} tIn={-10} push={0} tilt={0} tWedge={-1} tRip={-1} /> });
  const dukeSpeaks = speaking("duke", t) && t > STORED;
  const wob = dukeSpeaks ? Math.sin(t * 40) * 1.5 : t > STORED && t < STORED + 0.4 ? Math.sin(t * 50) * 3 : 0;
  items.push({ y: 45, node: <g key="ward" transform={`translate(${WARD.x} ${WARD.y}) rotate(${wob})`}>{wardrobePieces(EV, doorOpen, t).map((p) => <Piece key={p.id} def={p} t={t} />)}</g> });

  const pos = { pia: posAt(MOVE.pia, t), duke: posAt(MOVE.duke, t), gus: posAt(MOVE.gus, t), lotta: posAt(MOVE.lotta, t) };
  (Object.keys(MOOD) as FurniId[]).forEach((id) => {
    if (id === "duke" && t >= STORED) return; // he's inside the wardrobe now
    const m = moodAt(MOOD[id], t), p = pos[id];
    let hop = p.walk + (m.since < 0.35 ? Math.sin((m.since / 0.35) * Math.PI) * 55 : 0);
    if (id === "duke" && t > 4.6 && t < 9.0) hop += Math.abs(Math.sin(t * 9)) * 22;
    if (id === "duke" && t > 13.0) hop += Math.sin(((t - 13.0) / 0.3) * Math.PI) * 120;
    const talk = speaking(id, t) || (id === "pia" && t > 4.6 && t < 9.0 && Math.sin(t * 11) > 0);
    items.push({ y: id === "duke" && t > 12.9 ? 60 : p.y, node: furniNode(id, p, { ...m, frame, yaw: YAW[id], talk, hop }) });
  });
  if (t > 0.1 && t < 5.0) items.push({ y: pos.pia.y + 2, node: <Accordion key="acc" t={t} x0={pos.pia.x + 90} y0={pos.pia.y - 240} /> });
  if (t > 5.9) {
    const jp = posAt(JMOVE, t);
    const jexpr: Expr = t < STORED ? (t > 7.9 ? "love" : "happy") : "scared";
    const hop = t > 6.6 && t < 9 ? Math.abs(Math.sin(t * 8)) * 26 : 0;
    items.push({ y: jp.y, node: <g key="junior" transform={`translate(${jp.x} ${jp.y - hop}) scale(1.3) translate(-150 -392)`}><Junior f={frame} expr={jexpr} talk={speaking("junior", t)} awake walk={jp.walk > 0 ? t : 0} yaw={0.3} /></g> });
  }
  const lefty = leftyNode(t, frame, 17.8, 170, 262, speaking("lefty", t));
  if (lefty) items.push({ y: 262, node: lefty });

  const jp = posAt(JMOVE, t);
  const heads = (w: Who) => {
    if (w === "duke" && t > STORED) return { x: WARD.x, y: WARD.y - 650 };
    if (w === "junior") return { x: jp.x, y: jp.y - 300 };
    if (w === "lefty") return { x: 170, y: 262 - HEAD.lefty };
    return { x: pos[w as FurniId].x, y: pos[w as FurniId].y - HEAD[w] };
  };
  const n = t > 4.6 && t < 12.5 ? Math.min(30, 1 + Math.floor((t - 4.6) * 3.7)) : null;
  return (
    <Stage t={t} cam={cm} items={items} wall={["#d7f5e3", "#c2eed4"]} angry={t > 9.6 && t < 12.4} storm={t > STORED && t < 17.8 ? 0.1 : 0}>
      <Overlays t={t} cam={cm} bubbles={BUBBLES} voice={VOICE} heads={heads} bursts={BURSTS} />
      <StepCounter t={t} n={n} of={96} />
      <LogoStamp t={t} t0={2.1} sub="THE WARDROBE OF DOOM · PART 2" />
      <EndCard t={t} t0={20.9} text="PART 3 →" />
      <AbsoluteFill style={{ background: "#fff", opacity: flashAt(t, FLASHES) }} />
      {t > STORY - 0.01 && <AbsoluteFill style={{ opacity: clamp((t - STORY) / 0.2) }}><Sequence from={Math.round(STORY * FPS)} layout="none"><Outro /></Sequence></AbsoluteFill>}
      <EpisodeAudio music="flatpack/music_ep6.wav" sfx={SFX} bubbles={BUBBLES} voice={VOICE} />
      <Sequence from={Math.round(4.7 * FPS)} durationInFrames={Math.round(4.2 * FPS)}><Audio src={staticFile("flatpack/babble_pia.wav")} volume={0.3} playbackRate={1.45} loop /></Sequence>
    </Stage>
  );
};
