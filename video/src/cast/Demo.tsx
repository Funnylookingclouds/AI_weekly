/** Demo: meet the new cast (lip-synced, expressions, 3D sway) + the "Joke Machine" punchline gag. */
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import "@fontsource/caveat/700.css";
import { CAST, Toon, type CastId } from "./cast";
import type { Expr } from "./rig";
import { P, HAND, PaperCard, Hand, Stamp, clamp, onTwos } from "../presenter/kit";
import { ComicBurst } from "../presenter/banana";
import { Confetti, mouthOpen } from "../presenter/Bouncy";
import { FONT } from "../theme";
import words from "../../public/cast/words.json";

type W = { word: string; display: string; start: number; end: number; segment: string; keyword: boolean };
const WORDS = words as W[];
const FPS = 60;
const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
const seg = (s: string) => WORDS.find((w) => w.segment === s)!.start;
const segEnd = (s: string) => [...WORDS].reverse().find((w) => w.segment === s)!.end;
const wd = (s: string, w: string, n = 0) => WORDS.filter((x) => x.segment === s && norm(x.word).startsWith(norm(w)))[n].start;
const TAIL = 3.2;
export const CAST_DEMO_LEN = Math.ceil((WORDS[WORDS.length - 1].end + TAIL) * FPS);

const segWords = (s: string) => WORDS.filter((w) => w.segment === s);
const exprAt = (t: number, list: [number, Expr][]) => { let e = list[0][1]; for (const [at, x] of list) if (t >= at) e = x; return e; };

// expression timelines (seconds)
const TL: Record<CastId, [number, Expr][]> = {
  pixel: [[0, "happy"], [wd("pixel", "sixty"), "surprised"], [wd("pixel", "emotionally"), "laugh"]],
  lumi: [[0, "smug"], [wd("lumi", "idea"), "surprised"], [wd("lumi", "light"), "happy"]],
  chip: [[0, "scared"], [wd("chip", "sorry"), "sad"], [wd("chip", "ninety"), "confused"], [wd("chip", "silicon"), "happy"]],
  cloudy: [[0, "happy"], [wd("cloudy", "photos"), "smug"], [wd("cloudy", "feelings"), "sad"]],
  wattson: [[0, "neutral"], [wd("wattson", "fully"), "smug"], [wd("wattson", "not"), "angry"]],
};
const BG: Record<CastId, string> = { pixel: "bg_rune", lumi: "bg_saga", chip: "bg_ture", cloudy: "bg_cara", wattson: "bg_bouncy" };

const Caption: React.FC<{ t: number }> = ({ t }) => {
  const chunks: W[][] = []; let cur: W[] = [];
  WORDS.forEach((w, i) => { cur.push(w); if (/[.?!,:–…]$/.test(w.word) || cur.length >= 7 || WORDS[i + 1]?.segment !== w.segment) { chunks.push(cur); cur = []; } });
  const c = chunks.find((x, i) => t >= x[0].start - 0.1 && t < (chunks[i + 1]?.[0].start ?? 999) - 0.1);
  if (!c || t > c[c.length - 1].end + 0.7) return null;
  const who = c[0].segment === "setup" ? "lumi" : c[0].segment === "punch" ? "pixel" : c[0].segment;
  const accent = CAST.find((x) => x.id === who)?.accent ?? P.teal;
  return (
    <div style={{ position: "absolute", left: 60, right: 170, top: 760, background: "#fffdf7", borderLeft: `12px solid ${accent}`, borderRadius: 8, padding: "20px 26px", boxShadow: "0 10px 30px #0006", fontFamily: FONT, fontSize: 44, fontWeight: 800, color: P.ink, lineHeight: 1.25 }}>
      {c.map((w, i) => { const on = t >= w.start, act = on && t < w.end + 0.05; return <span key={i} style={{ opacity: on ? 1 : 0.35, color: w.keyword && on ? P.mustard : P.ink, borderBottom: act ? `5px solid ${P.mustard}` : "5px solid transparent" }}>{w.display} </span>; })}
    </div>
  );
};

// ---------------------------------------------------------------------------
const Intro: React.FC<{ id: CastId; start: number }> = ({ id, start }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = start + f / FPS;
  const c = CAST.find((x) => x.id === id)!;
  const enter = spring({ frame: f, fps, config: { damping: 9, stiffness: 140 } });
  const expr = exprAt(t, TL[id]);
  const open = mouthOpen(segWords(id), t);
  const yaw = Math.sin(f / 35) * 0.45;
  return (
    <AbsoluteFill>
      <Img src={staticFile(`chars/${BG[id]}.jpg`)} style={{ width: 1080, height: 1920, objectFit: "cover", transform: `scale(${1.1 + f / 9000})` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, transparent 35%, #000a 100%)" }} />
      <AbsoluteFill style={{ top: 150, alignItems: "center" }}>
        <div style={{ transform: `translateY(${(1 - enter) * -700}px) rotate(${(1 - enter) * -8}deg)` }}>
          <PaperCard w={960} h={560} seed={`int${id}`} rot={-1} tag="AI BOUNCE · NEW CAST">
            <div style={{ fontSize: 46, fontWeight: 800, color: P.muted }}>Meet</div>
            <div style={{ fontSize: 120, fontWeight: 900, lineHeight: 1, color: c.accent }}>{c.name}</div>
            <div style={{ fontFamily: HAND, fontSize: 52, color: P.ink }}>{c.tag}</div>
            <div style={{ marginTop: 18 }}>{c.traits.map((tr, i) => <div key={tr} style={{ fontSize: 34, fontWeight: 700, opacity: f > 20 + i * 12 ? 1 : 0 }}>✦ {tr}</div>)}</div>
          </PaperCard>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - 310, top: 880, transform: `translateY(${(1 - enter) * 900}px)` }}>
        <Toon id={id} expr={expr} f={f} size={620} yaw={yaw} open={open} look={{ x: Math.sin(f / 50) * 0.6, y: 0.1 }} />
      </div>
      <Audio src={staticFile("whoosh.wav")} volume={0.5} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Joke Machine
// ---------------------------------------------------------------------------
const SETUP = seg("setup"), MSTART = segEnd("setup") + 0.05, PUNCH = seg("punch"), PEND = segEnd("punch");
const D = PUNCH - MSTART;
type K = [number, number, number];
const KEYS: K[] = [[0, 95, 175], [0.12, 112, 288], [0.4, 588, 382], [0.5, 708, 452], [0.76, 200, 560], [0.83, 172, 698], [0.89, 282, 698]];
const ballAt = (u: number) => {
  if (u <= 0) return { x: KEYS[0][1], y: KEYS[0][2], d: 0 };
  for (let i = 1; i < KEYS.length; i++) {
    const [t0, x0, y0] = KEYS[i - 1], [t1, x1, y1] = KEYS[i];
    if (u <= t1) {
      const k = (u - t0) / (t1 - t0);
      const fall = i === 1 || i === 3 || i === 5;
      const e = fall ? k * k : i === 2 || i === 4 ? k * k * 0.5 + k * 0.5 : k;
      return { x: x0 + (x1 - x0) * (fall ? k : e), y: y0 + (y1 - y0) * e, d: 0 };
    }
  }
  const l = KEYS[KEYS.length - 1];
  return { x: l[1], y: l[2], d: 0 };
};
const DOM = [300, 370, 440];
const domT = [0.89, 0.925, 0.955];

const Machine: React.FC = () => {
  const f = useCurrentFrame();
  const t = SETUP + f / FPS;
  const u = (t - MSTART) / D;
  const b = ballAt(u);
  const rotB = (b.x + b.y) * 2;
  const popT = t - PUNCH;
  const pop = interpolate(popT, [0, 0.35], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.7)) });
  const glove = interpolate(u, [0.97, 1.0], [0, 1], clamp) * (popT < 0.5 ? 1 : interpolate(popT, [0.5, 0.9], [1, 0], clamp));
  const lever = interpolate(u, [0.955, 0.975], [0, -35], clamp);
  const bellShake = u > 1 && u < 1.25 ? Math.sin(f * 2) * 12 : 0;
  const meter = interpolate(t, [PEND, PEND + 0.8], [-70, 70], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const nChars = Math.floor(interpolate(t, [SETUP, segEnd("setup")], [0, 52], clamp));
  const setupText = "Why did the neural network go to therapy?";
  return (
    <div style={{ position: "absolute", left: 40, top: 120, width: 1000, height: 600 }}>
      <svg width={1000} height={600} viewBox="0 150 1000 600" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {/* laugh meter */}
        <g transform="translate(860 250)">
          <path d="M-90 0 A 90 90 0 0 1 90 0" fill={P.paper2} stroke={P.ink} strokeWidth={6} />
          <path d="M-90 0 A 90 90 0 0 1 -30 -85" fill="none" stroke="#94a3b8" strokeWidth={14} />
          <path d="M30 -85 A 90 90 0 0 1 90 0" fill="none" stroke="#22c55e" strokeWidth={14} />
          <line x1={0} y1={0} x2={Math.sin((meter * Math.PI) / 180) * 75} y2={-Math.cos((meter * Math.PI) / 180) * 75} stroke={P.ink} strokeWidth={8} strokeLinecap="round" />
          <circle r={10} fill={P.ink} />
          <text x={-88} y={28} fontFamily={HAND} fontSize={28} fill={P.muted}>meh</text>
          <text x={52} y={28} fontFamily={HAND} fontSize={28} fill="#16a34a">LOL</text>
          <text x={-62} y={-100} fontFamily={FONT} fontWeight={900} fontSize={22} fill={P.ink}>LAUGH-O-METER</text>
        </g>
        {/* chute + ramps + floor */}
        <rect x={62} y={150} width={66} height={80} rx={10} fill={`${P.teal}55`} stroke={P.ink} strokeWidth={5} />
        <line x1={80} y1={312} x2={610} y2={406} stroke="#a16207" strokeWidth={16} strokeLinecap="round" />
        <line x1={80} y1={312} x2={610} y2={406} stroke={P.ink} strokeWidth={3} />
        <line x1={730} y1={476} x2={170} y2={586} stroke="#a16207" strokeWidth={16} strokeLinecap="round" />
        <line x1={730} y1={476} x2={170} y2={586} stroke={P.ink} strokeWidth={3} />
        {[[100, 316, 40], [590, 404, 60], [710, 480, 60], [190, 584, 40]].map(([x, y, h], i) => <line key={i} x1={x} y1={y + 8} x2={x} y2={y + h} stroke={P.ink} strokeWidth={6} />)}
        <line x1={60} y1={722} x2={950} y2={722} stroke={P.ink} strokeWidth={8} strokeLinecap="round" />
        {/* dominoes */}
        {DOM.map((x, i) => { const a = interpolate(u, [domT[i], domT[i] + 0.04], [0, 72], clamp); return <rect key={x} x={x - 9} y={630} width={18} height={92} rx={3} fill={P.paper2} stroke={P.ink} strokeWidth={4} transform={`rotate(${a} ${x + 9} 722)`} />; })}
        {/* lever */}
        <g transform={`rotate(${lever} 520 714)`}><rect x={480} y={706} width={80} height={14} rx={6} fill={P.red} stroke={P.ink} strokeWidth={4} /></g>
        <polygon points="520,722 508,700 532,700" fill={P.ink} />
        {/* glove box + spring */}
        <rect x={560} y={640} width={80} height={80} rx={8} fill={P.mustard} stroke={P.ink} strokeWidth={5} />
        <text x={575} y={690} fontFamily={FONT} fontWeight={900} fontSize={22} fill={P.ink}>ACME</text>
        {glove > 0 && <path d={`M640 680 ${[...Array(8)].map((_, i) => `L${640 + (i + 0.5) * (glove * 110) / 8} ${680 + (i % 2 ? -14 : 14)}`).join(" ")} L${640 + glove * 110} 680`} stroke={P.ink} strokeWidth={5} fill="none" />}
        <g transform={`translate(${650 + glove * 110} 680)`}><circle r={30} fill="#dc2626" stroke={P.ink} strokeWidth={5} /><ellipse cx={-6} cy={-26} rx={14} ry={10} fill="#dc2626" stroke={P.ink} strokeWidth={4} /></g>
        {/* bell */}
        <g transform={`rotate(${bellShake} 850 640)`}><path d="M815 700 Q815 640 850 640 Q885 640 885 700 Z" fill="#facc15" stroke={P.ink} strokeWidth={5} /><circle cx={850} cy={706} r={9} fill={P.ink} /><rect x={846} y={628} width={8} height={14} fill={P.ink} /></g>
        {/* ball */}
        {u > -0.05 && u < 1.2 && (
          <g transform={`translate(${b.x} ${b.y})`}>
            <circle r={24} fill="url(#ballG)" stroke={P.ink} strokeWidth={4} transform={`rotate(${rotB})`} />
            <circle cx={-7} cy={-8} r={5} fill="#fff" /><circle cx={7} cy={-8} r={5} fill="#fff" /><circle cx={-6} cy={-7} r={2.5} fill={P.ink} /><circle cx={8} cy={-7} r={2.5} fill={P.ink} />
            <ellipse cx={0} cy={6} rx={6} ry={7} fill="#7f1d1d" />
          </g>
        )}
        <defs><radialGradient id="ballG" cx={0.35} cy={0.3} r={0.8}><stop offset="0%" stopColor="#fff" /><stop offset="30%" stopColor="#22D3EE" /><stop offset="100%" stopColor="#7c3aed" /></radialGradient></defs>
      </svg>
      {/* setup note */}
      <div style={{ position: "absolute", left: 160, top: 0, width: 520, padding: "18px 22px", background: "#fffdf4", border: `4px solid ${P.ink}`, boxShadow: "6px 8px 0 #0002", transform: "rotate(-2deg)", fontFamily: FONT, fontSize: 36, fontWeight: 900, lineHeight: 1.15, minHeight: 90 }}>
        {setupText.slice(0, nChars)}<span style={{ opacity: nChars < setupText.length && f % 20 < 10 ? 1 : 0 }}>▌</span>
      </div>
      {/* pop-up punchline card */}
      {popT > 0 && (
        <div style={{ position: "absolute", left: 80, top: 100, width: 840, height: 400, perspective: 1300 }}>
          <div style={{ width: "100%", height: "100%", transformOrigin: "50% 100%", transform: `rotateX(${(1 - pop) * 88}deg)`, background: P.paper, border: `6px solid ${P.ink}`, borderRadius: 18, boxShadow: "0 30px 40px #0006", display: "flex", alignItems: "center", gap: 30, padding: 30, boxSizing: "border-box", fontFamily: FONT, color: P.ink }}>
            <svg width={300} height={300} viewBox="0 0 300 300">
              {[[40, 3], [110, 6], [150, 7], [190, 6], [260, 2]].map(([x, n], ci) => [...Array(n)].map((_, k) => { const y = 150 + (k - (n - 1) / 2) * 38; return <circle key={`${ci}${k}`} cx={x} cy={y} r={14} fill={ci === 0 || ci === 4 ? P.teal : P.mustard} stroke={P.ink} strokeWidth={3} />; }))}
              {[...Array(8)].map((_, i) => <line key={i} x1={40} y1={112 + (i % 3) * 38} x2={110} y2={55 + i * 25} stroke={P.ink} strokeWidth={1.5} opacity={0.5} />)}
              <text x={150} y={290} textAnchor="middle" fontFamily={HAND} fontSize={30} fill={P.red}>hidden layers</text>
            </svg>
            <div>
              <div style={{ fontSize: 44, fontWeight: 800, color: P.muted }}>Too many…</div>
              <div style={{ fontSize: 86, fontWeight: 900, lineHeight: 1, color: P.red }}>HIDDEN<br />LAYERS!</div>
            </div>
          </div>
        </div>
      )}
      <ComicBurst text="DING!" at={Math.round((PUNCH - SETUP) * FPS)} x={880} y={420} color={P.mustard} size={0.55} dur={40} />
      <ComicBurst text="BA-DUM-TSS!" at={Math.round((PEND + 0.1 - SETUP) * FPS)} x={760} y={140} color={P.red} size={0.7} dur={110} rot={8} />
      {/* SFX */}
      {[0.12, 0.5, 0.83].map((k) => <Sequence key={k} from={Math.round((MSTART + k * D - SETUP) * FPS)} durationInFrames={40}><Audio src={staticFile("brand/boing.wav")} volume={0.35} playbackRate={1.4} /></Sequence>)}
      {domT.map((k) => <Sequence key={k} from={Math.round((MSTART + k * D - SETUP) * FPS)} durationInFrames={20}><Audio src={staticFile("pop.wav")} volume={0.5} /></Sequence>)}
      <Sequence from={Math.round((PUNCH - SETUP) * FPS)}><Audio src={staticFile("brand/ding.wav")} volume={0.6} /></Sequence>
      <Sequence from={Math.round((PEND + 0.1 - SETUP) * FPS)}><Audio src={staticFile("brand/rimshot.wav")} volume={0.8} /></Sequence>
    </div>
  );
};

const LINEUP: CastId[] = ["wattson", "chip", "lumi", "pixel", "cloudy"];
const JokeScene: React.FC = () => {
  const f = useCurrentFrame();
  const t = SETUP + f / FPS;
  const u = (t - MSTART) / D;
  const bx = 40 + ballAt(u).x;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#efe6d2,#e3d4b4)" }} />
      <div style={{ position: "absolute", left: 30, top: 60, fontFamily: FONT, fontSize: 46, fontWeight: 900, color: P.ink }}>THE JOKE MACHINE <span style={{ fontFamily: HAND, color: P.mustard }}>est. 2026</span></div>
      <Machine />
      {LINEUP.map((id, i) => {
        const cx = 120 + i * 210;
        let expr: Expr = "neutral";
        let open = 0;
        if (t < MSTART) { expr = id === "lumi" ? "smug" : id === "pixel" ? "confused" : "neutral"; if (id === "lumi") open = mouthOpen(segWords("setup"), t); }
        else if (t < PUNCH) expr = id === "wattson" ? "smug" : "surprised";
        else if (t < PEND + 0.1) { expr = id === "pixel" ? "happy" : "surprised"; if (id === "pixel") open = mouthOpen(segWords("punch"), t); }
        else expr = id === "wattson" && t < PEND + 1.2 ? "smug" : "laugh";
        const look = t >= MSTART && t < PUNCH + 0.3 ? { x: Math.max(-1, Math.min(1, (bx - cx) / 300)), y: -0.6 } : { x: 0, y: 0 };
        return <div key={id} style={{ position: "absolute", left: cx - 160, top: 1000 + (i % 2) * 60 }}><Toon id={id} expr={expr} f={f + i * 13} size={320} yaw={look.x * 0.35} open={open} look={look} /></div>;
      })}
      <Confetti at={Math.round((PEND + 0.1 - SETUP) * FPS)} n={80} />
    </AbsoluteFill>
  );
};

export const CastDemo: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const ids: CastId[] = ["pixel", "lumi", "chip", "cloudy", "wattson"];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {ids.map((id, i) => {
        const from = Math.round((i === 0 ? 0 : seg(id) - 0.2) * FPS);
        const to = Math.round(((ids[i + 1] ? seg(ids[i + 1]) : SETUP) - 0.2) * FPS);
        return <Sequence key={id} from={from} durationInFrames={to - from}><Intro id={id} start={from / FPS} /></Sequence>;
      })}
      <Sequence from={Math.round((SETUP - 0.2) * FPS)}><JokeScene /></Sequence>
      <Caption t={t} />
      <Audio src={staticFile("cast/voiceover.mp3")} />
      <Audio src={staticFile("music.wav")} volume={0.6} />
    </AbsoluteFill>
  );
};
