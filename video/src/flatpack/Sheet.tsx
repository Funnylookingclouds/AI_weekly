import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { Expr } from "../cast/rig";
import { C, FURNI, Furni, LUCKY, Alvin, Lefty, type Emote } from "./furni";

const COLS: { expr: Expr; emote: Emote; label: string }[] = [
  { expr: "happy", emote: "joy", label: "JOY" },
  { expr: "laugh", emote: "music", label: "LAUGH" },
  { expr: "love", emote: "love", label: "LOVE" },
  { expr: "angry", emote: "rage", label: "RAGE" },
  { expr: "angry", emote: "storm", label: "THUNDER" },
  { expr: "angry", emote: "grawlix", label: "#@%&!" },
  { expr: "confused", emote: "confused", label: "CONFUSED" },
  { expr: "surprised", emote: "shock", label: "SHOCK" },
  { expr: "sad", emote: "sad", label: "SAD" },
  { expr: "scared", emote: "sweat", label: "PANIC" },
  { expr: "smug", emote: "sparkle", label: "SMUG" },
];

/** Character sheet: 4 furniture characters × 11 emotions (expression + orbiting symbols). */
export const FlatpackSheet: React.FC<{ frame?: number }> = ({ frame }) => {
  const cur = useCurrentFrame();
  const f = frame ?? cur + 40;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 30%, ${C.cream}, #ffd9a8)`, fontFamily: LUCKY }}>
      <div style={{ position: "absolute", left: 60, top: 30, fontSize: 92, color: C.ink, letterSpacing: 2 }}>SOME ASSEMBLY <span style={{ color: C.tomato }}>RAGE!</span> <span style={{ fontSize: 46, color: "#7c6a58" }}>— cast & emotions</span></div>
      {COLS.map((c, j) => <div key={j} style={{ position: "absolute", left: 330 + j * 290, top: 150, width: 290, textAlign: "center", fontSize: 40, color: C.ink }}>{c.label}</div>)}
      {FURNI.map((ch, i) => (
        <React.Fragment key={ch.id}>
          <div style={{ position: "absolute", left: 40, top: 260 + i * 470, width: 270 }}>
            <div style={{ fontSize: 76, color: ch.color, WebkitTextStroke: `3px ${C.ink}` }}>{ch.name}</div>
            <div style={{ fontSize: 34, color: C.ink }}>{ch.tag}</div>
            {ch.traits.map((t) => <div key={t} style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 21, color: "#5b4a3a", marginTop: 6 }}>• {t}</div>)}
          </div>
          {COLS.map((c, j) => (
            <div key={j} style={{ position: "absolute", left: 330 + j * 290 + 145 - 130, top: 200 + i * 470 }}>
              <Furni id={ch.id} expr={c.expr} emote={c.emote} f={f + j * 7} size={260} yaw={(j % 3 - 1) * 0.28} glow={ch.id === "lotta" && (c.emote === "joy" || c.emote === "love") ? 1 : 0} still />
            </div>
          ))}
        </React.Fragment>
      ))}
      <svg width={600} height={300} style={{ position: "absolute", left: 2100, top: -40, overflow: "visible" }}>
        <g transform="translate(60 120)"><Alvin f={f} size={0.8} /></g>
        <g transform="translate(240 110)"><Lefty f={f} size={0.8} /></g>
        <text x={330} y={150} fontFamily={LUCKY} fontSize={28} fill={C.ink}>← ALVIN THE HEX KEY · LEFTY THE LEFTOVER SCREW</text>
      </svg>
    </AbsoluteFill>
  );
};
