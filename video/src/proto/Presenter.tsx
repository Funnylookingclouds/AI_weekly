/**
 * PROTOTYPE – character-presenter format in the paper-cutout style of the owner's
 * other channel. Rune Jr. presents the week's AI news on hand-drawn paper plates.
 */
import React from "react";
import "@fontsource/caveat/700.css";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { FONT } from "../theme";
import { IntroWarp, OutroLoading, INTRO_SEG, SEG } from "../brand/Brand";
import words from "../../public/proto/words.json";

type W = { word: string; display: string; start: number; end: number; segment: string; keyword: boolean };
const WORDS = words as W[];
const FPS = 60;
const P = { ink: "#2b2622", teal: "#1d6b73", mustard: "#c98a1c", red: "#b4483b", paper: "#f3ead6", paper2: "#fbf6ea", muted: "#7a6f62" };
const HAND = "Caveat, cursive";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
const at = (word: string, nth = 0) => WORDS.filter((w) => norm(w.word) === norm(word))[nth].start;
/** Stop-motion time: hold every frame for 5 frames (12 fps feel). */
const onTwos = (f: number) => Math.floor(f / 5) * 5;

// ---------------------------------------------------------------------------
// Torn paper card
// ---------------------------------------------------------------------------
const tornPath = (w: number, h: number, seed: string, step = 16, amp = 7) => {
  const pts: [number, number][] = [];
  const j = (k: string) => random(`${seed}${k}`) * amp;
  for (let x = 0; x <= w; x += step) pts.push([x, j(`t${x}`)]);
  for (let y = 0; y <= h; y += step) pts.push([w - j(`r${y}`), y]);
  for (let x = w; x >= 0; x -= step) pts.push([x, h - j(`b${x}`)]);
  for (let y = h; y >= 0; y -= step) pts.push([j(`l${y}`), y]);
  return "M" + pts.map((p) => p.join(" ")).join(" L") + " Z";
};
const PaperCard: React.FC<{ w: number; h: number; seed: string; children: React.ReactNode; rot?: number }> = ({ w, h, seed, children, rot = 0 }) => (
  <div style={{ position: "relative", width: w, height: h, transform: `rotate(${rot}deg)`, filter: "drop-shadow(0 18px 28px #0007)" }}>
    <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <filter id={`grain${seed}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={7} /><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.28  0 0 0 0.10 0" /><feComposite in2="SourceGraphic" operator="in" /></filter>
      </defs>
      <path d={tornPath(w, h, seed + "o", 18, 9)} fill={P.paper2} />
      <path d={tornPath(w - 24, h - 24, seed + "i", 16, 6)} transform="translate(12 12)" fill={P.paper} />
      <path d={tornPath(w - 24, h - 24, seed + "i", 16, 6)} transform="translate(12 12)" fill="#fff" filter={`url(#grain${seed})`} />
    </svg>
    <div style={{ position: "absolute", inset: 34, fontFamily: FONT, color: P.ink }}>{children}</div>
  </div>
);

/** Card entrance: slapped onto the table – stepped, with a little overshoot. */
const Slap: React.FC<{ children: React.ReactNode; from?: "left" | "right" | "top" }> = ({ children, from = "right" }) => {
  const f = onTwos(useCurrentFrame());
  const p = interpolate(f, [0, 15], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const dx = from === "left" ? -1200 : from === "right" ? 1200 : 0;
  const dy = from === "top" ? -1400 : 0;
  return <div style={{ transform: `translate(${dx * (1 - p)}px, ${dy * (1 - p)}px) rotate(${(1 - p) * (from === "left" ? -14 : 12)}deg)` }}>{children}</div>;
};

const Source: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 6, right: 6, bottom: 0, fontSize: 21, color: P.muted }}>Source: {children}</div>
);
const Tag: React.FC = () => (
  <div style={{ position: "absolute", right: 10, top: -58, padding: "4px 12px", background: P.red, color: "#fff", fontSize: 20, fontWeight: 900, letterSpacing: 2 }}>AI BOUNCE · WK 46</div>
);

// ---------------------------------------------------------------------------
// Ink icons
// ---------------------------------------------------------------------------
const InkDoctor: React.FC<{ s?: number; fade?: number }> = ({ s = 90, fade = 0 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" style={{ opacity: 1 - fade * 0.6 }}>
    <circle cx={12} cy={7} r={4} fill="none" stroke={P.ink} strokeWidth={1.4} />
    <path d="M4 22 C4 15.5 8 13.2 12 13.2 C16 13.2 20 15.5 20 22" fill="none" stroke={P.ink} strokeWidth={1.4} />
    <path d="M9 14.2 V18 A2 2 0 0 0 13 18" stroke={P.teal} strokeWidth={1.3} fill="none" /><circle cx={13} cy={18.2} r={0.9} fill={P.teal} />
  </svg>
);
const InkChip: React.FC<{ s?: number }> = ({ s = 170 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24">
    {[6, 10, 14, 18].map((p) => (
      <g key={p} stroke={P.teal} strokeWidth={1.1} strokeLinecap="round">
        <line x1={p} y1={2} x2={p} y2={4.6} /><line x1={p} y1={19.4} x2={p} y2={22} /><line x1={2} y1={p} x2={4.6} y2={p} /><line x1={19.4} y1={p} x2={22} y2={p} />
      </g>
    ))}
    <rect x={4.6} y={4.6} width={14.8} height={14.8} rx={2.5} fill={`${P.teal}22`} stroke={P.teal} strokeWidth={1.3} />
    <text x={12} y={14.4} textAnchor="middle" fontSize={6.5} fontWeight={900} fill={P.teal} fontFamily={FONT}>AI</text>
  </svg>
);

// ---------------------------------------------------------------------------
// Plates
// ---------------------------------------------------------------------------
const PlateVersus: React.FC = () => {
  const f = useCurrentFrame();
  const g = onTwos(f);
  return (
    <PaperCard w={960} h={760} seed="vs" rot={-1.2}>
      <Tag />
      <div style={{ fontSize: 52, fontWeight: 900 }}>AI vs. 8 brain tumor experts</div>
      <div style={{ fontFamily: HAND, fontSize: 40, color: P.mustard, marginTop: 4 }}>who diagnoses better?</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 40 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 100px)", gap: 8 }}>
          {[...Array(8)].map((_, i) => <div key={i} style={{ opacity: g > i * 3 ? 1 : 0 }}><InkDoctor fade={interpolate(f, [150, 180], [0, 1], clamp)} /></div>)}
        </div>
        <div style={{ fontFamily: HAND, fontSize: 90, color: P.red, transform: `rotate(-8deg) scale(${g > 30 ? 1 : 0})` }}>vs</div>
        <div style={{ transform: `scale(${g > 40 ? 1 : 0}) rotate(${g > 40 ? 0 : 20}deg)` }}><InkChip /></div>
      </div>
      <svg width={880} height={60} style={{ marginTop: 26 }}>
        <path d="M10 30 Q220 5 440 30 T870 30" stroke={P.mustard} strokeWidth={5} fill="none" strokeDasharray={900} strokeDashoffset={interpolate(g, [50, 90], [900, 0], clamp)} />
      </svg>
      <Source>Inside Precision Medicine · AMP 2026 (Mayo Clinic)</Source>
    </PaperCard>
  );
};

const PlateCases: React.FC = () => {
  const g = onTwos(useCurrentFrame());
  const n = Math.floor(interpolate(g, [10, 100], [0, 100], clamp));
  return (
    <PaperCard w={960} h={760} seed="cases" rot={1}>
      <Tag />
      <div style={{ fontSize: 50, fontWeight: 900 }}>Mayo Clinic test</div>
      <div style={{ display: "flex", gap: 40, marginTop: 30, alignItems: "flex-start" }}>
        {/* microscope slide */}
        <div style={{ width: 330 }}>
          <div style={{ width: 320, height: 130, border: `3px solid ${P.ink}`, borderRadius: 10, background: "#ffffffaa", position: "relative", overflow: "hidden" }}>
            {[...Array(26)].map((_, i) => <div key={i} style={{ position: "absolute", left: 110 + random(`sx${i}`) * 140, top: 20 + random(`sy${i}`) * 90, width: 10 + random(`sr${i}`) * 18, height: 10 + random(`sr${i}`) * 18, borderRadius: "50%", background: random(`sc${i}`) > 0.5 ? "#9b5fc0aa" : "#d0679aaa" }} />)}
          </div>
          <div style={{ fontFamily: HAND, fontSize: 36, color: P.mustard, marginTop: 8 }}>tissue images</div>
          <div style={{ fontSize: 26, color: P.muted, marginTop: 14, lineHeight: 1.3 }}>AI picks from<br /><b style={{ color: P.ink }}>52 tumor types</b></div>
        </div>
        {/* 100 cases tally */}
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 40px)", gap: 6 }}>
            {[...Array(100)].map((_, i) => <div key={i} style={{ width: 40, height: 40, border: `2px solid ${P.ink}`, borderRadius: 6, background: i < n ? `${P.teal}cc` : "transparent" }} />)}
          </div>
          <div style={{ fontSize: 60, fontWeight: 900, marginTop: 10 }}>{n} <span style={{ fontFamily: HAND, fontSize: 44, color: P.mustard }}>real cases</span></div>
        </div>
      </div>
      <Source>Inside Precision Medicine · AMP 2026 · small conference test</Source>
    </PaperCard>
  );
};

const PlateGauge: React.FC = () => {
  const g = onTwos(useCurrentFrame());
  const v = interpolate(g, [8, 60], [0, 97], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ang = Math.PI * (1 - v / 100);
  const cx = 260, cy = 270, R = 200;
  return (
    <PaperCard w={960} h={760} seed="gauge" rot={-0.8}>
      <Tag />
      <div style={{ fontSize: 50, fontWeight: 900 }}>Diagnostic accuracy</div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 10 }}>
        <svg width={540} height={330} style={{ flexShrink: 0 }}>
          <path d={`M${cx - R} ${cy} A${R} ${R} 0 0 1 ${cx + R} ${cy}`} stroke={P.ink} strokeWidth={6} fill="none" />
          {[...Array(11)].map((_, i) => { const a = Math.PI * (1 - i / 10); return <line key={i} x1={cx + Math.cos(a) * (R - 6)} y1={cy - Math.sin(a) * (R - 6)} x2={cx + Math.cos(a) * (R - 32)} y2={cy - Math.sin(a) * (R - 32)} stroke={P.ink} strokeWidth={4} />; })}
          <text x={cx - R - 10} y={cy + 40} fontSize={28} fill={P.ink} fontFamily={FONT}>0</text>
          <text x={cx + R - 36} y={cy + 40} fontSize={28} fill={P.ink} fontFamily={FONT}>100</text>
          <line x1={cx} y1={cy} x2={cx + Math.cos(ang) * (R - 50)} y2={cy - Math.sin(ang) * (R - 50)} stroke={P.ink} strokeWidth={9} strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={16} fill={P.ink} />
        </svg>
        <div>
          <div style={{ fontSize: 130, fontWeight: 900, color: P.mustard, lineHeight: 1 }}>{Math.round(v)}%</div>
          <div style={{ fontFamily: HAND, fontSize: 42, color: P.teal, transform: `scale(${g > 60 ? 1 : 0})`, transformOrigin: "left" }}>beat all 8 specialists ✓</div>
        </div>
      </div>
      <Source>Inside Precision Medicine · AMP 2026 · not yet peer-reviewed</Source>
    </PaperCard>
  );
};

const PlateTeam: React.FC = () => {
  const g = onTwos(useCurrentFrame());
  const up = interpolate(g, [20, 50], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  return (
    <PaperCard w={960} h={760} seed="team" rot={1.3}>
      <Tag />
      <div style={{ fontSize: 50, fontWeight: 900 }}>The best part</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 30, marginTop: 50 }}>
        <div style={{ transform: `translateX(${g > 0 ? 0 : -200}px)` }}><InkDoctor s={200} /></div>
        <div style={{ fontFamily: HAND, fontSize: 120, color: P.red, opacity: g > 10 ? 1 : 0 }}>+</div>
        <div style={{ opacity: g > 15 ? 1 : 0 }}><InkChip s={190} /></div>
        <svg width={120} height={200} viewBox="0 0 24 40" style={{ transform: `translateY(${(1 - up) * 80}px)`, opacity: up }}>
          <path d="M12 2 L22 16 H15.5 V38 H8.5 V16 H2 Z" fill={P.teal} />
        </svg>
      </div>
      <div style={{ textAlign: "center", fontFamily: HAND, fontSize: 64, color: P.mustard, marginTop: 30, opacity: up }}>doctors got more accurate with AI help</div>
      <Source>Inside Precision Medicine · AMP 2026</Source>
    </PaperCard>
  );
};

// ---------------------------------------------------------------------------
// Presenter
// ---------------------------------------------------------------------------
type Pose = "body" | "think" | "watch" | "smile";
const POSE_SRC: Record<Pose, string> = {
  body: "chars/runejr_body.png", think: "chars/runejr_head_think.png", watch: "chars/runejr_head_watch.png", smile: "chars/runejr_head_smile.png",
};
const Presenter: React.FC<{ pose: Pose; talk: number }> = ({ pose, talk }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = onTwos(f);
  const enter = spring({ frame: f, fps, config: { damping: 9, stiffness: 160 } });
  const bob = Math.sin(g / 9) * 6 + talk * -10;
  const rot = Math.sin(g / 13) * 1.4 + talk * 1.2;
  if (pose === "body") {
    return (
      <div style={{ position: "absolute", left: 40, top: 1150 + (1 - enter) * 500 + bob, transform: `rotate(${rot}deg)`, transformOrigin: "50% 100%" }}>
        <Img src={staticFile(POSE_SRC.body)} style={{ height: 1400, filter: "drop-shadow(0 20px 26px #0008)" }} />
      </div>
    );
  }
  return (
    <div style={{ position: "absolute", left: 30, top: 1180 + bob, transform: `scale(${0.6 + 0.4 * enter}) rotate(${rot - 3 + (1 - enter) * -15}deg)`, transformOrigin: "30% 100%" }}>
      <Img src={staticFile(POSE_SRC[pose])} style={{ width: 560, filter: "drop-shadow(0 20px 26px #0008)" }} />
    </div>
  );
};

/** Lower-third caption strip, like the owner's other channel. */
const CaptionStrip: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  // sentence-ish chunks of up to 7 words
  const chunks: W[][] = [];
  let cur: W[] = [];
  WORDS.forEach((w, i) => { cur.push(w); if (/[.?!,–]$/.test(w.word) || cur.length >= 7 || i === WORDS.length - 1) { chunks.push(cur); cur = []; } });
  const ch = chunks.find((c, i) => t >= c[0].start - 0.1 && t < (chunks[i + 1]?.[0].start ?? 99) - 0.1);
  if (!ch) return null;
  return (
    <div style={{ position: "absolute", left: 60, right: 170, top: 1010, background: "#fffdf7", borderLeft: `12px solid ${P.teal}`, borderRadius: 8, padding: "22px 28px", boxShadow: "0 10px 30px #0006", fontFamily: FONT, fontSize: 44, fontWeight: 800, color: P.ink, lineHeight: 1.25 }}>
      <span style={{ color: P.teal, fontWeight: 900 }}>RUNE JR.: </span>
      {ch.map((w, i) => {
        const on = t >= w.start;
        const active = t >= w.start && t < w.end + 0.05;
        const txt = w.display.replace(/^(\d+)$/, "$1");
        return <span key={i} style={{ opacity: on ? 1 : 0.35, color: w.keyword && on ? P.mustard : P.ink, borderBottom: active ? `5px solid ${P.mustard}` : "5px solid transparent" }}>{txt} </span>;
      })}
    </div>
  );
};

const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Img src={staticFile("proto/bg.jpg")} style={{ width: 1080, height: 1920, objectFit: "cover", transform: `scale(${1.08 + f / 20000}) translateX(${Math.sin(f / 200) * 12}px)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 40%, #0009 100%)" }} />
    </AbsoluteFill>
  );
};

const PresenterMain: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const plates: { t: number; C: React.FC; from: "left" | "right" | "top"; pose: Pose }[] = [
    { t: 0, C: PlateVersus, from: "top", pose: "body" },
    { t: at("mayo"), C: PlateCases, from: "right", pose: "think" },
    { t: at("and"), C: PlateGauge, from: "left", pose: "watch" },
    { t: at("the"), C: PlateTeam, from: "right", pose: "smile" },
  ];
  // "talk" pulse: small hop on keyword onsets
  const kw = WORDS.filter((w) => w.keyword).map((w) => t - w.start).filter((d) => d >= 0 && d < 0.25);
  const talk = kw.length ? Math.sin((kw[0] / 0.25) * Math.PI) : 0;
  return (
    <AbsoluteFill>
      <Backdrop />
      {plates.map((p, i) => {
        const from = Math.round(p.t * FPS);
        const to = i + 1 < plates.length ? Math.round(plates[i + 1].t * FPS) : Math.round((WORDS[WORDS.length - 1].end + 0.6) * FPS);
        return (
          <Sequence key={i} from={from} durationInFrames={to - from}>
            <AbsoluteFill style={{ top: 200, alignItems: "center" }}><Slap from={p.from}><p.C /></Slap></AbsoluteFill>
            <Presenter pose={p.pose} talk={talk} />
            <Audio src={staticFile(i === 0 ? "whoosh.wav" : "pop.wav")} volume={0.45} />
          </Sequence>
        );
      })}
      <CaptionStrip />
      <Audio src={staticFile("proto/voiceover.mp3")} />
    </AbsoluteFill>
  );
};

const MAIN = Math.ceil((WORDS[WORDS.length - 1].end + 0.6) * FPS);
export const PROTO_LEN = INTRO_SEG + MAIN - 12 + SEG;
export const PresenterProto: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence durationInFrames={INTRO_SEG}><IntroWarp /></Sequence>
      <Sequence from={INTRO_SEG} durationInFrames={MAIN}><PresenterMain /></Sequence>
      <Sequence from={INTRO_SEG + MAIN - 12} durationInFrames={SEG}>
        <AbsoluteFill style={{ opacity: interpolate(f - (INTRO_SEG + MAIN - 12), [0, 12], [0, 1], clamp) }}><OutroLoading /></AbsoluteFill>
      </Sequence>
      <Sequence from={INTRO_SEG - 12}><Audio src={staticFile("music.wav")} volume={0.7} /></Sequence>
    </AbsoluteFill>
  );
};
