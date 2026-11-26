/** SOME ASSEMBLY RAGE – Ep. 8 "The New Sofa" (SNYGGO) – introduces Sven, Gus's rival. */
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import type { Expr } from "../../cast/rig";
import { C } from "../furni";
import type { FurniId } from "../furni";
import {
  type Bub, type BurstT, type CamKey, type Cue, type MoodKey, type MoveKey, type PieceDef, type Voice, type Who,
  EpisodeAudio, FPS, HEAD, INK, LogoStamp, Overlays, PalletBox, Piece, S, SCALE, GROUND, Scoreboard, Stage, Versus,
  clamp, dustNode, fitBubbles, flashAt, furniNode, leftyNode, lerp, makeCam, makeSpeaking, moodAt, posAt,
} from "../kit";
import { Sven } from "../sven";
import { Outro, OUTRO_LEN } from "../Outro";
import VOICE_RAW from "../ep8.voice.json";

const VOICE = VOICE_RAW as Voice[];
const STORY = 25.0;
export const EP8_LEN = Math.round((STORY + OUTRO_LEN) * FPS);
const SOFA = { x: 60, y: 60 };
const BORN = 8.8, FOLD = 14.9, YANK = 17.4;

const MOOD: Record<FurniId, MoodKey[]> = {
  gus: [[0, "happy", "none"], [0.6, "surprised", "shock"], [1.2, "sad", "sad"], [5.0, "smug", "sweat"], [6.4, "smug", "sparkle"], [7.2, "sad", "sad"], [BORN, "surprised", "shock"], [10.9, "angry", "storm"], [13.0, "angry", "rage"], [FOLD, "surprised", "shock"], [16.8, "angry", "rage"], [YANK, "happy", "sparkle"], [18.0, "smug", "joy"], [21.8, "happy", "none"]],
  duke: [[0, "happy", "none"], [1.8, "smug", "none"], [3.1, "angry", "rage"], [5.0, "angry", "storm"], [BORN, "surprised", "shock"], [9.3, "happy", "love"], [13.0, "happy", "joy"], [YANK, "scared", "sweat"], [18.4, "happy", "none"], [21.8, "laugh", "music"]],
  pia: [[0, "happy", "none"], [1.8, "smug", "sparkle"], [3.1, "angry", "storm"], [5.0, "angry", "grawlix"], [BORN, "surprised", "shock"], [10.9, "angry", "none"], [13.0, "smug", "none"], [FOLD, "surprised", "shock"], [15.6, "laugh", "music"], [YANK, "surprised", "shock"], [18.0, "smug", "sparkle"], [21.8, "laugh", "music"]],
  lotta: [[0, "neutral", "zzz"]],
};
const MOVE: Record<FurniId, MoveKey[]> = {
  gus: [[0, -460, 90, 0], [5.0, -80, 210, 0.5], [7.2, -460, 90, 0.5], [16.8, -140, 200, 0.5], [YANK + 0.4, -430, 110, 0.6]],
  duke: [[0, -190, 160, 0], [8.4, -300, 165, 0.4], [13.1, 60, 140, 0.6], [YANK, -300, 180, 0.5]],
  pia: [[0, 320, 150, 0], [8.4, 420, 160, 0.4]],
  lotta: [[0, 660, -10, 0]],
};
const YAW: Record<FurniId, number> = { duke: 0.35, gus: 0.45, pia: -0.4, lotta: -0.4 };

const BUBBLES: Bub[] = [
  { who: "gus", t0: 0.6, t1: 1.7, text: "…A SOFA?" },
  { who: "pia", t0: 1.8, t1: 3.0, text: "It goes by the window." },
  { who: "duke", t0: 3.1, t1: 3.9, text: "By the TV!", kind: "shout" },
  { who: "gus", t0: 6.4, t1: 7.1, text: "Oops.", kind: "whisper" },
  { who: "sven", t0: 9.3, t1: 10.8, text: "Finally. A REAL seat." },
  { who: "gus", t0: 10.9, t1: 11.9, text: "I'M the seat here!", kind: "shout" },
  { who: "duke", t0: 13.8, t1: 14.8, text: "Ooh, it reclines—" },
  { who: "duke", t0: 15.3, t1: 16.6, text: "NOT AGAIN!", kind: "shout" },
  { who: "sven", t0: 18.0, t1: 20.3, text: "…Fine. YOU can be the comfy one." },
  { who: "lefty", t0: 21.8, t1: 23.3, text: "Uh… where do I go?" },
  { who: "sven", t0: 23.4, t1: 24.4, text: "Not in me." },
];
fitBubbles(BUBBLES, VOICE);
const speaking = makeSpeaking(BUBBLES, VOICE);

const CAM: CamKey[] = [
  [0, -200, -250, 1.0, 0], [0.6, -460, -160, 1.5, 0.3], [1.8, 320, -190, 1.5, 0], [3.1, -190, -200, 1.5, 0], [5.0, -80, -260, 1.0, 0.3],
  [6.4, -100, -100, 1.5, 0.3], [BORN - 0.2, 60, -200, 1.1, 0], [9.3, 60, -150, 1.45, 0.3], [10.9, -460, -160, 1.5, 0], [13.0, 0, -250, 0.95, 0],
  [13.8, 60, -150, 1.4, 0.3], [FOLD, 60, -180, 1.15, 0.1], [16.8, -60, -250, 1.0, 0.3], [18.0, 60, -150, 1.45, 0.3], [20.6, 330, 60, 1.2, 0.6],
  [21.6, 260, 60, 1.6, 0.4], [23.4, 120, -100, 1.3, 0.3],
];
const cam = makeCam(CAM, [[0.6, 8], [4.0, 18], [BORN, 10], [12.0, 18], [FOLD, 24], [YANK, 18]]);
const FLASHES = [3.2, 11.0];
const BURSTS: BurstT[] = [[BORN, 60, -360, "KA-CHUNK!", C.sky, -5], [FOLD, 60, -330, "FWUMP!", C.sun, 6], [YANK, -60, -330, "YANK!", C.grape, -6]];
const SFX: Cue[] = [
  [0.3, "sfx_rip", 0.8], [0.55, "sfx_pop", 0.5], [0.75, "sfx_pop", 0.5], [3.2, "sfx_thunder", 0.7], [4.0, "sfx_thunk", 0.8], [5.2, "sfx_ratchet", 0.5],
  [5.9, "sfx_pop", 0.5], [6.2, "sfx_roll", 0.4], [6.8, "sfx_chunk", 0.5], [7.6, "sfx_chunk", 0.5], [8.2, "sfx_chunk", 0.5], [BORN, "sfx_chunk", 1],
  [BORN + 0.2, "sfx_shimmer", 0.6], [11.0, "sfx_thunder", 0.7], [12.0, "sfx_thunk", 0.8], [FOLD, "sfx_whoosh", 0.7], [FOLD + 0.2, "sfx_thunk", 0.8],
  [YANK, "sfx_scratch", 0.5], [YANK + 0.1, "brand/boing.wav", 0.5], [20.6, "sfx_roll", 0.8], [23.6, "sfx_pop", 0.5],
];
const P = (id: string, w: number, h: number, x: number, y: number, color: string, i: number, snap: number): PieceDef => ({
  id, w, h, built: { x, y, r: 0 }, box: { x: 0, y: -150, r: 0 }, pile: { x: -230 + i * 80, y: 80 + (i % 2) * 20, r: (i % 2 ? 4 : -4) }, fall: { x: 0, y: 60, r: 90 }, color,
  ev: [[0, "box"], [0.45 + i * 0.07, "pile"], [snap, "built"]],
});
const PIECES: PieceDef[] = [
  P("back", 420, 170, 0, -220, "#2b4a9b", 0, 5.4), P("seat", 420, 60, 0, -110, "#E8B13A", 1, 6.8), P("armL", 60, 130, -240, -100, "#2b4a9b", 2, 7.6),
  P("armR", 60, 130, 240, -100, "#2b4a9b", 3, 8.2), P("cush1", 190, 40, -100, -160, "#f5c85a", 4, 8.5), P("cush2", 190, 40, 100, -160, "#f5c85a", 5, 8.6),
];

export const FlatpackEp8: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cm = cam(t);
  const items: { y: number; node: React.ReactNode }[] = [];
  items.push({ y: -40, node: <PalletBox key="box" t={t} name="SNYGGO" flap={0.25} flat={3.0} x={-560} /> });
  const born = t >= BORN;
  if (!born) items.push({ y: SOFA.y, node: <g key="sofa" transform={`translate(${SOFA.x} ${SOFA.y})`}>{PIECES.map((p) => <Piece key={p.id} def={p} t={t} />)}</g> });
  else {
    const bed = t < FOLD ? 0 : t < YANK ? clamp((t - FOLD) / 0.3) : 1 - clamp((t - YANK) / 0.3);
    const sexpr: Expr = t < 9.2 ? "neutral" : t < 12 ? "smug" : t < FOLD ? "smug" : t < YANK ? "laugh" : t < 19.2 ? "sad" : "smug";
    const hop = t < BORN + 0.4 ? Math.sin(((t - BORN) / 0.4) * Math.PI) * 60 : 0;
    items.push({ y: SOFA.y, node: <g key="sven" transform={`translate(${SOFA.x} ${SOFA.y}) scale(1.2) translate(${-S / 2} ${-GROUND})`}><Sven f={frame} expr={sexpr} talk={speaking("sven", t)} awake={t > 9.0} yaw={-0.1} bed={bed} lump={t > FOLD + 0.2 && t < YANK} hop={hop / SCALE} /></g> });
    const d = dustNode(t, BORN, SOFA.x, SOFA.y, "poof"); if (d) items.push({ y: SOFA.y + 5, node: d });
  }
  const pos = { gus: posAt(MOVE.gus, t), duke: posAt(MOVE.duke, t), pia: posAt(MOVE.pia, t), lotta: posAt(MOVE.lotta, t) };
  (Object.keys(MOOD) as FurniId[]).forEach((id) => {
    if (id === "duke" && t > FOLD + 0.15 && t < YANK) return; // folded inside Sven
    const m = moodAt(MOOD[id], t), p = pos[id];
    let hop = p.walk + (m.since < 0.35 ? Math.sin((m.since / 0.35) * Math.PI) * 55 : 0);
    if ((id === "duke" || id === "pia") && t > 4.9 && t < 8.6) hop += Math.abs(Math.sin(t * 8 + (id === "pia" ? 1 : 0))) * 20;
    if (id === "gus" && t > 5.5 && t < 6.3) hop += Math.abs(Math.sin(t * 14)) * 20;
    if (id === "duke" && t > YANK && t < YANK + 0.5) hop += Math.sin(((t - YANK) / 0.5) * Math.PI) * 160;
    items.push({ y: id === "duke" && t > 13.1 && t < YANK + 0.3 ? SOFA.y + 10 : p.y, node: furniNode(id, p, { ...m, frame, yaw: YAW[id], talk: speaking(id, t) && !(id === "duke" && t > FOLD), hop }) });
  });
  // screws vanishing under Gus
  if (t > 5.4 && t < 6.2) [0, 1, 2].forEach((k) => { const a = clamp((t - 5.4 - k * 0.15) / 0.4); if (a <= 0 || a >= 1) return; items.push({ y: 400, node: <g key={`sc${k}`} transform={`translate(${lerp(40 + k * 40, pos.gus.x, a)} ${lerp(120, pos.gus.y - 60, a) - Math.sin(a * Math.PI) * 120}) rotate(${a * 700})`}><path d="M-5 0 L-5 28 L0 36 L5 28 L5 0 Z" fill="#cbd5e1" stroke={INK} strokeWidth={3} /><ellipse rx={14} ry={6} fill="#e2e8f0" stroke={INK} strokeWidth={3} /></g> }); });
  const lefty = leftyNode(t, frame, 20.6, 340, 262, speaking("lefty", t));
  if (lefty) items.push({ y: 262, node: lefty });

  const heads = (w: Who) => {
    if (w === "sven" || (w === "duke" && t > FOLD)) return { x: SOFA.x, y: SOFA.y - 340 };
    if (w === "lefty") return { x: 340, y: 262 - HEAD.lefty };
    return { x: pos[w as FurniId].x, y: pos[w as FurniId].y - HEAD[w] };
  };
  return (
    <Stage t={t} cam={cm} items={items} wall={["#e6dcff", "#d8cbff"]} angry={(t > 3.1 && t < 8.6) || (t > 10.9 && t < 13)} storm={t > 10.9 && t < 13 ? 0.1 : 0}>
      <Overlays t={t} cam={cm} bubbles={BUBBLES} voice={VOICE} heads={heads} bursts={BURSTS} />
      <Scoreboard t={t} t0={13.0} t1={17.2} cells={[["COMFY: GUS", 0, C.grape], ["SVEN", 1, "#2b4a9b"]]} />
      <Scoreboard t={t} t0={18.2} t1={21.5} cells={[["COMFY: GUS", 1, C.grape], ["SVEN", 1, "#2b4a9b"]]} />
      <Versus t={t} t0={4.0} left="DUKE" right="PIA" />
      <Versus t={t} t0={12.0} left="GUS" right="SVEN" lc={C.grape} rc="#2b4a9b" />
      <LogoStamp t={t} t0={1.9} sub="EP. 8 · THE NEW SOFA" />
      <AbsoluteFill style={{ background: "#fff", opacity: flashAt(t, FLASHES) }} />
      {t > STORY - 0.01 && <AbsoluteFill style={{ opacity: clamp((t - STORY) / 0.2) }}><Sequence from={Math.round(STORY * FPS)} layout="none"><Outro /></Sequence></AbsoluteFill>}
      <EpisodeAudio music="flatpack/music_ep8.wav" sfx={SFX} bubbles={BUBBLES} voice={VOICE} />
    </Stage>
  );
};
