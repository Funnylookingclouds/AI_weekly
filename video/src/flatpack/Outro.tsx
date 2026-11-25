/** SOME ASSEMBLY RAGE – 3.5 s branded outro: logo assembles, "RAGE!" slams in and falls apart, Lefty asks you to follow. */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, Furni, LUCKY, Lefty } from "./furni";

export const OUTRO_LEN = 3.5;
const INK = C.ink;
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const back = (p: number) => { const c1 = 2.2, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };

const Plank: React.FC<{ text: string; t: number; t0: number; from: number; rot: number }> = ({ text, t, t0, from, rot }) => {
  const p = back(clamp((t - t0) / 0.3));
  return (
    <div style={{ transform: `translateX(${(1 - p) * from}px) rotate(${rot}deg)`, display: "inline-block", position: "relative", background: C.wood, border: `7px solid ${INK}`, borderRadius: 14, padding: "6px 34px 0", boxShadow: `0 12px 0 ${C.woodD}, 0 12px 0 7px ${INK}`, fontFamily: LUCKY, fontSize: 118, color: INK, letterSpacing: 4 }}>
      {text}
      {[[14, 14], [14, 106]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 18, height: 18, borderRadius: 9, background: "#cbd5e1", border: `4px solid ${INK}` }} />)}
      {[[14, 14], [14, 106]].map(([x, y], i) => <div key={`r${i}`} style={{ position: "absolute", right: x, top: y, width: 18, height: 18, borderRadius: 9, background: "#cbd5e1", border: `4px solid ${INK}` }} />)}
    </div>
  );
};

export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 60;
  const slam = clamp((t - 0.6) / 0.14);
  const rageS = t < 0.6 ? 0 : 3 - 2 * slam + (slam >= 1 ? Math.max(0, 0.15 - (t - 0.74) * 0.6) * Math.sin((t - 0.74) * 40) : 0);
  const shake = t > 0.74 && t < 1.2 ? Math.sin(t * 90) * 14 * (1.2 - t) : 0;
  const btn = back(clamp((t - 1.2) / 0.3));
  const pulse = 1 + Math.max(0, Math.sin((t - 1.5) * 9)) * 0.06 * (t > 1.5 ? 1 : 0);
  const lefty = back(clamp((t - 0.95) / 0.3));
  return (
    <AbsoluteFill style={{ background: C.sun, overflow: "hidden", transform: `translate(${shake}px, ${shake * 0.6}px)` }}>
      {/* rotating sunburst */}
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <g transform={`translate(540 760) rotate(${t * 20})`}>
          {[...Array(18)].map((_, i) => <path key={i} d="M0 0 L-180 -1600 L180 -1600 Z" fill={i % 2 ? C.tomato : "#ffb020"} transform={`rotate(${i * 20})`} opacity={i % 2 ? 0.9 : 1} />)}
        </g>
        <circle cx={540} cy={760} r={330} fill={C.cream} stroke={INK} strokeWidth={10} />
      </svg>
      {/* logo */}
      <div style={{ position: "absolute", left: 0, width: 1080, top: 470, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <Plank text="SOME" t={t} t0={0.05} from={-1100} rot={-4} />
        <Plank text="ASSEMBLY" t={t} t0={0.25} from={1100} rot={3} />
        <div style={{ position: "relative", marginTop: 6, transform: `scale(${rageS}) rotate(-6deg)`, fontFamily: LUCKY, fontSize: 210, color: C.tomato, WebkitTextStroke: `9px ${INK}`, textShadow: `10px 12px 0 ${INK}`, letterSpacing: 6, lineHeight: 1 }}>
          R<span style={{ display: "inline-block", transform: `rotate(${10 + Math.sin(t * 6) * 4}deg) translateY(10px)` }}>A</span>
          <span style={{ display: "inline-block", transformOrigin: "50% 0%", transform: `rotate(${10 + Math.sin(t * 5) * 5}deg)` }}>G</span><span style={{ marginLeft: -22 }}>E!</span>
          {/* steam */}
          {t > 0.75 && [0, 1, 2, 3].map((k) => { const a = ((t * 1.4 + k * 0.25) % 1); return <div key={k} style={{ position: "absolute", left: 60 + k * 150, top: -60 - a * 160, width: 50 + a * 60, height: 50 + a * 60, borderRadius: "50%", background: "#fff", border: `4px solid ${INK}`, opacity: 1 - a }} />; })}
        </div>
      </div>
      {/* hex key stuck in the logo */}
      <svg width={260} height={260} style={{ position: "absolute", left: 790, top: 820, transform: `scale(${slam}) rotate(${-30 + Math.sin(t * 8) * 4}deg)` }} viewBox="-130 -130 260 260">
        <path d="M-14 -110 L14 -110 L14 10 L95 10 L95 38 L-14 38 Z" fill="#cbd5e1" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      </svg>
      {/* follow button */}
      <div style={{ position: "absolute", left: 140, width: 800, top: 1190, display: "flex", justifyContent: "center", transform: `scale(${btn * pulse})` }}>
        <div style={{ background: C.tomato, border: `8px solid ${INK}`, borderRadius: 60, padding: "22px 46px", boxShadow: `0 14px 0 ${INK}`, fontFamily: LUCKY, fontSize: 72, whiteSpace: "nowrap", color: "#fff", WebkitTextStroke: `3px ${INK}` }}>FOLLOW FOR MORE!</div>
      </div>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 1355, textAlign: "center", fontFamily: LUCKY, fontSize: 44, color: INK, opacity: clamp((t - 1.5) / 0.3) }}>New flat-pack disaster every week 🔩</div>
      {/* Lefty pops up + Duke & Pia peeking, still arguing */}
      <svg width={1080} height={500} style={{ position: "absolute", left: 0, top: 1420, overflow: "visible" }}>
        <g transform={`translate(540 ${330 - lefty * 170}) rotate(${Math.sin(t * 6) * 6})`}><Lefty f={f} size={1.5} talk={t > 1.1 && t < 2.35} /></g>
      </svg>
      <div style={{ position: "absolute", left: -120, top: 1360 + (1 - back(clamp((t - 0.4) / 0.3))) * 500, transform: "rotate(14deg)" }}><Furni id="duke" expr="angry" emote="rage" f={f} size={330} yaw={0.5} talk={t > 1.6} /></div>
      <div style={{ position: "absolute", left: 830, top: 1420 + (1 - back(clamp((t - 0.5) / 0.3))) * 500, transform: "rotate(-14deg)" }}><Furni id="pia" expr="angry" emote="storm" f={f} size={330} yaw={-0.5} talk={t > 1.8} /></div>
      <Sequence from={9} layout="none"><Audio src={staticFile("flatpack/sfx_chunk.wav")} volume={0.7} /></Sequence>
      <Sequence from={21} layout="none"><Audio src={staticFile("flatpack/sfx_chunk.wav")} volume={0.7} /></Sequence>
      <Sequence from={36} layout="none"><Audio src={staticFile("brand/impact.wav")} volume={0.9} /></Sequence>
      <Sequence from={66} layout="none"><Audio src={staticFile("flatpack/vo_outro_follow.wav")} volume={1} /></Sequence>
    </AbsoluteFill>
  );
};
