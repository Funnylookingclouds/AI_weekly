/** Presenter format: a rotating AI Bounce character presents paper boards. */
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { FONT } from "../theme";
import { WORDS, FPS, TOTAL_SEC } from "../timing";
import { CHARACTERS, type Character, type Mood } from "./characters";
import { P, HAND, onTwos, clamp } from "./kit";
import { Bouncy, mouthOpen, type BouncyMood } from "./Bouncy";
import { Toon, CAST, type CastId } from "../cast/cast";
import { ComedyClub, Marquee, MicStand, Audience } from "../club/Club";
import { Studio, Ensemble, type Member } from "../cast/stage";
import { Room, RoomLights, Foreground, LedSign, SpeedLines, Vignette } from "../cast/room";
import type { Expr } from "../cast/rig";

export type PlateMood = Mood | "group";
export type Plate = { t: number; C: React.FC; mood: PlateMood; from?: "left" | "right" | "top"; who?: Character; bouncy?: BouncyMood; toon?: { id: CastId; expr: Expr }; cast?: Member[]; tint?: string; chip?: string; /** audience laughs from plate start (true) or from this time in seconds */ laugh?: boolean | number };
export type Show = { presenter: Character; plates: Plate[]; stage?: boolean; scene?: "club"; /** Studio v3: angled 2.5D room, live camera, wall monitor, lower-third captions */ room?: boolean; /** start straight in the scene (no separate intro; brand as watermark) */ coldOpen?: boolean; /** intro poster: title + kicker */ poster?: { title: string; kicker: string } };

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
/** Start time of the nth word in a segment that matches exactly (punctuation ignored). */
export const word = (segment: string, w: string, nth = 0): number => {
  const hits = WORDS.filter((x) => x.segment === segment && norm(x.word) === norm(w));
  if (!hits[nth]) throw new Error(`show: no word "${w}" #${nth} in ${segment}`);
  return hits[nth].start;
};
export const seg = (segment: string) => WORDS.find((w) => w.segment === segment)!.start;

/** 0..1 pulse right after word onsets (all words or keywords only). */
const pulseAt = (t: number, onlyKeywords: boolean, len: number) => {
  const d = WORDS.filter((w) => (!onlyKeywords || w.keyword)).map((w) => t - w.start).filter((x) => x >= 0 && x < len);
  return d.length ? Math.sin((Math.min(...d) / len) * Math.PI) : 0;
};

// ---------------------------------------------------------------------------
/** All four presenters hop in one after another. */
const Group: React.FC<{ t: number }> = ({ t }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tq = onTwos(Math.round(t * FPS)) / FPS;
  const talk = pulseAt(tq, false, 0.18);
  const ids = ["rune", "saga", "ture", "cara"] as const;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1180, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 0 }}>
      {ids.map((id, k) => {
        const s = spring({ frame: f - k * 6, fps, config: { damping: 8, stiffness: 170 } });
        const hop = Math.abs(Math.sin((onTwos(f) + k * 15) / 12)) * 22 + talk * 10;
        return (
          <div key={id} style={{ transform: `translateY(${(1 - s) * 600 - hop}px) rotate(${Math.sin((onTwos(f) + k * 20) / 14) * 3}deg)`, marginLeft: k ? -40 : 0, transformOrigin: "50% 100%" }}>
            <Img src={staticFile(CHARACTERS[id].art.body)} style={{ height: 760, filter: "drop-shadow(0 16px 20px #0008)" }} />
          </div>
        );
      })}
    </div>
  );
};

const Presenter: React.FC<{ ch: Character; mood: PlateMood; i: number; t: number }> = ({ ch, mood, i, t }) => {
  if (mood === "group") return <Group t={t} />;
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = onTwos(f);
  const tq = onTwos(Math.round(t * FPS)) / FPS; // stepped global time
  const talk = pulseAt(tq, false, 0.18);
  const key = pulseAt(tq, true, 0.42);
  const flip = interpolate(g, [0, 10], [90, 0], clamp);
  const hop = spring({ frame: f, fps, config: { damping: 7, stiffness: 180 } });
  const bob = Math.sin(g / 9) * 6 - talk * 8 - key * 26 - (1 - hop) * 60;
  let rot = Math.sin(g / 13) * 1.4 + key * 3;
  let scale = 1;
  if (mood === "happy") rot += Math.sin(g / 2) * 1.6 * Math.max(0, 1 - f / 70);
  if (mood === "serious") scale = 1 + Math.min(f / 600, 0.06);
  if (mood === "curious") rot += 4;
  const squash = `scale(${(1 - talk * 0.02) * scale}, ${(1 + talk * 0.035) * scale})`;
  if (mood === "body") {
    const mirror = i % 2 ? -1 : 1;
    return (
      <div style={{ position: "absolute", left: 40, top: 1150 + bob, transform: `perspective(1200px) rotateY(${flip}deg) rotate(${rot}deg) ${squash} scaleX(${mirror})`, transformOrigin: "50% 100%" }}>
        <Img src={staticFile(ch.art.body)} style={{ height: 1400, filter: "drop-shadow(0 20px 26px #0008)" }} />
      </div>
    );
  }
  return (
    <div style={{ position: "absolute", left: 24, top: 1175 + bob, transform: `perspective(1200px) rotateY(${flip}deg) rotate(${rot - 3}deg) ${squash}`, transformOrigin: "30% 100%" }}>
      <Img src={staticFile(ch.art[mood])} style={{ width: 560, filter: "drop-shadow(0 20px 26px #0008)" }} />
    </div>
  );
};

/** Ink doodles that pop next to the presenter on keywords (! and motion lines). */
const Doodles: React.FC<{ t: number }> = ({ t }) => {
  const tq = onTwos(Math.round(t * FPS)) / FPS;
  const k = WORDS.filter((w) => w.keyword && tq - w.start >= 0 && tq - w.start < 0.5)[0];
  if (!k) return null;
  const p = (tq - k.start) / 0.5;
  const s = p < 0.3 ? p / 0.3 : 1;
  const o = p > 0.7 ? (1 - p) / 0.3 : 1;
  const seed = Math.round(k.start * 10) % 3;
  return (
    <div style={{ position: "absolute", left: 540, top: 1200, opacity: o, transform: `scale(${s}) rotate(${(seed - 1) * 10}deg)` }}>
      <svg width={220} height={200}>
        {[0, 1, 2].map((j) => <path key={j} d={`M${20 + j * 30} ${150 - j * 40} q 30 -30 70 -10`} stroke={P.paper2} strokeWidth={7} fill="none" strokeLinecap="round" />)}
        <text x={150} y={110} fontFamily={HAND} fontSize={120} fontWeight={700} fill={P.mustard} stroke={P.ink} strokeWidth={2}>{seed === 2 ? "?!" : "!"}</text>
      </svg>
    </div>
  );
};

const CaptionStrip: React.FC<{ ch: Character; t: number; group?: boolean }> = ({ ch, t, group }) => {
  const chunks: (typeof WORDS)[] = [];
  let cur: typeof WORDS = [];
  WORDS.forEach((w, i) => {
    const prev = cur[cur.length - 1];
    if (prev && /^%/.test(w.display)) { cur[cur.length - 1] = { ...prev, display: prev.display + w.display, end: w.end }; }
    else cur.push(w);
    const nextSeg = WORDS[i + 1]?.segment;
    if (/[.?!,:–]$/.test(w.word) || cur.length >= 7 || i === WORDS.length - 1 || nextSeg !== w.segment) { chunks.push(cur); cur = []; }
  });
  const c = chunks.find((x, i) => t >= x[0].start - 0.1 && t < (chunks[i + 1]?.[0].start ?? 999) - 0.1);
  if (!c || t > c[c.length - 1].end + 0.8) return null;
  return (
    <div style={{ position: "absolute", left: 60, right: 170, top: 1010, background: "#fffdf7", borderLeft: `12px solid ${ch.accent}`, borderRadius: 8, padding: "22px 28px", boxShadow: "0 10px 30px #0006", fontFamily: FONT, fontSize: 44, fontWeight: 800, color: P.ink, lineHeight: 1.25 }}>
      {/* speaker names intentionally not shown (owner preference); accent bar still marks who speaks */}
      {c.map((w, i) => {
        const on = t >= w.start, active = on && t < w.end + 0.05;
        if (!w.display) return null;
        return <span key={i} style={{ opacity: on ? 1 : 0.35, color: w.keyword && on ? P.mustard : P.ink, borderBottom: active ? `5px solid ${P.mustard}` : "5px solid transparent" }}>{w.display} </span>;
      })}
    </div>
  );
};

const Backdrop: React.FC<{ ch: Character }> = ({ ch }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Img src={staticFile(`chars/bg_${ch.id}.jpg`)} style={{ width: 1080, height: 1920, objectFit: "cover", transform: `scale(${1.08 + f / 20000}) translateX(${Math.sin(f / 200) * 12}px)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 40%, #0009 100%)" }} />
    </AbsoluteFill>
  );
};

export const PresenterMain: React.FC<{ show: Show }> = ({ show }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const end = Math.ceil(TOTAL_SEC * FPS);
  const cur = [...show.plates].reverse().find((p) => p.t <= t + 1e-6) ?? show.plates[0];
  const speaker = cur.who ?? show.presenter;
  if (show.room || show.stage) return <RoomMain show={show} />;
  const club = useCamera(show, f, show.scene === "club");
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {show.stage && (() => {
        const ci = show.plates.indexOf(cur);
        const prev = ci > 0 ? show.plates[ci - 1].tint ?? "#7c3aed" : undefined;
        const tint = cur.tint ?? "#7c3aed";
        const k = Math.min(1, (t - cur.t) / 0.5);
        return (<>
          {prev && prev !== tint && k < 1 && <Studio tint={prev} />}
          <AbsoluteFill style={{ opacity: prev && prev !== tint ? k : 1 }}><Studio tint={tint} /></AbsoluteFill>
        </>);
      })()}
      <svg width={0} height={0} style={{ position: "absolute" }}><defs><filter id="clubwhip" x="-20%" y="0" width="140%" height="100%"><feGaussianBlur stdDeviation={`${(club.whip * 38).toFixed(1)} 0`} /></filter></defs></svg>
      <AbsoluteFill style={{ filter: club.on && club.whip * 38 > 0.6 ? "url(#clubwhip)" : undefined }}>
      {show.scene === "club" && <AbsoluteFill style={club.cam(0.5)}><ComedyClub tint={cur.tint ?? "#ec4899"} /></AbsoluteFill>}
      {show.scene === "club" && <AbsoluteFill style={club.cam(0.8)}><Marquee tint={cur.tint ?? "#ec4899"} /></AbsoluteFill>}
      <AbsoluteFill style={club.on ? club.cam(1) : show.stage || show.scene ? { transform: `scale(${1 + 0.03 * pulseAt(onTwos(f) / FPS, true, 0.35)})`, transformOrigin: "50% 45%" } : undefined}>
      {show.plates.map((p, i) => {
        const from = Math.round(p.t * FPS);
        const to = i + 1 < show.plates.length ? Math.round(show.plates[i + 1].t * FPS) : end;
        const ch = p.who ?? show.presenter;
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)} name={`plate${i}`}>
            {!show.stage && !show.scene && <Backdrop ch={ch} />}
            <PlateSlot p={p} stage={show.stage} club={show.scene === "club"} />
            {show.scene === "club" && !p.cast && !p.toon && <MicStand x={p.bouncy ? 860 : 900} />}
            {(show.stage || show.scene) && p.chip && <TopicChip label={p.chip} tint={p.tint ?? "#7c3aed"} />}
            {p.cast ? <Ensemble members={p.cast} t={t} open={mouthOpen(WORDS, t)} tint={p.tint ?? "#7c3aed"} i={i} /> : p.toon ? <ToonHost id={p.toon.id} expr={p.toon.expr} t={t} i={i} /> : p.bouncy ? <div style={{ position: "absolute", left: club.on ? 340 : 300, top: club.on ? 1040 : 1190 }}><Bouncy size={club.on ? 400 : 480} mood={typeof p.laugh === "number" && t >= p.laugh ? "laugh" : p.bouncy} open={p.bouncy === "laugh" || (typeof p.laugh === "number" && t >= p.laugh) ? 0 : mouthOpen(WORDS, t)} /></div> : club.on ? <AbsoluteFill style={{ transform: "translate(40px, -200px) scale(0.85)", transformOrigin: "0 100%" }}><Presenter ch={ch} mood={p.mood} i={i} t={t} /></AbsoluteFill> : <Presenter ch={ch} mood={p.mood} i={i} t={t} />}
            <Audio src={staticFile(i === 0 ? "whoosh.wav" : i % 3 === 0 ? "pop.wav" : "whoosh.wav")} volume={0.4} />
          </Sequence>
        );
      })}
      </AbsoluteFill>
      {show.scene === "club" && (() => { const ls = typeof cur.laugh === "number" ? cur.laugh : cur.t; return <AbsoluteFill style={club.cam(1.3)}><Audience laughing={!!cur.laugh && t >= ls} lf={f - Math.round(ls * FPS)} /></AbsoluteFill>; })()}
      </AbsoluteFill>
      {club.on && <SpeedLines k={club.whip} dir={club.dir} />}
      {club.on ? <LowerCaptions t={t} accent={cur.tint ?? "#ec4899"} /> : <><Doodles t={t} />
      <CaptionStrip ch={(() => { const sp = cur.cast?.find((m) => m.talk); const acc = sp ? CAST.find((c) => c.id === sp.id)?.accent : undefined; return acc ? { ...speaker, accent: acc } : speaker; })()} t={t} group={cur.mood === "group"} /></>}
      <Audio src={staticFile("voiceover.mp3")} />
    </AbsoluteFill>
  );
};

/** New-cast character as presenter: lip-synced, 3D sway, drops in on each plate. */
const ToonHost: React.FC<{ id: CastId; expr: Expr; t: number; i: number }> = ({ id, expr, t, i }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: f, fps, config: { damping: 9, stiffness: 170 } });
  const yaw = Math.sin((t * FPS) / 45 + i) * 0.4 + (i % 2 ? 0.15 : -0.15);
  return (
    <div style={{ position: "absolute", left: 540 - 270, top: 1120, transform: `translateY(${(1 - enter) * 120}px) scale(${0.85 + 0.15 * enter})`, transformOrigin: "50% 100%" }}>
      <Toon id={id} expr={expr} f={Math.round(t * FPS)} size={540} yaw={yaw} open={mouthOpen(WORDS, t)} look={{ x: Math.sin(t / 2) * 0.4, y: -0.3 }} />
    </div>
  );
};

const PlateSlot: React.FC<{ p: Plate; stage?: boolean; club?: boolean }> = ({ p, stage, club }) => {
  const f = onTwos(useCurrentFrame());
  const raw = useCurrentFrame();
  if (club) {
    // cue-card flip inside the marquee: swings in on its vertical axis, overshoots, then idles
    const k = spring({ frame: raw, fps: FPS, config: { damping: 11, stiffness: 140 } });
    const ry = (1 - k) * (p.from === "left" ? -95 : 95);
    const bob = Math.sin(f / 30) * 4;
    return (
      <AbsoluteFill style={{ top: 200, alignItems: "center", perspective: 1800 }}>
        <div style={{ transform: `translateY(${bob}px) rotateY(${ry}deg) scale(${0.92 + 0.08 * k})`, filter: "drop-shadow(0 18px 24px #000a)" }}><p.C /></div>
      </AbsoluteFill>
    );
  }
  if (stage) {
    // hanging paper board: drops in on two strings, bounces, swings gently in 3D, casts a shadow
    const drop = interpolate(raw, [0, 22], [0, 1], { ...clamp, easing: Easing.out(Easing.bounce) });
    const sw = Math.sin(f / 28) * 1.6 * (1 - 0.3 * drop) + (1 - drop) * 6;
    const ry = Math.sin(f / 40) * 6;
    const rx = Math.cos(f / 50) * 3;
    const tint = p.tint ?? "#7c3aed";
    return (
      <AbsoluteFill style={{ top: 200, alignItems: "center", perspective: 1600 }}>
        <svg width={1080} height={260} style={{ position: "absolute", top: -260, left: 0, overflow: "visible", transform: `translateY(${(1 - drop) * -900}px)` }}>
          {[160, 920].map((x, k) => <line key={k} x1={x + (k ? -40 : 40)} y1={-40} x2={540 + (x - 540) * 0.82 + sw * 4} y2={262} stroke="#f3ead6" strokeWidth={4} opacity={0.75} strokeDasharray="14 5" />)}
        </svg>
        <div style={{ transformOrigin: "50% -200px", transform: `translateY(${(1 - drop) * -1100}px) rotate(${sw}deg) rotateY(${ry}deg) rotateX(${rx}deg)`, filter: `drop-shadow(0 0 26px ${tint}66) drop-shadow(30px 40px 30px #0007)` }}>
          <p.C />
        </div>
      </AbsoluteFill>
    );
  }
  const p01 = interpolate(f, [0, 15], [0, 1], clamp);
  const dx = p.from === "left" ? -1200 : p.from === "top" ? 0 : 1200;
  const dy = p.from === "top" ? -1400 : 0;
  const e = 1 - Math.pow(1 - p01, 3) + Math.sin(p01 * Math.PI) * 0.06;
  return (
    <AbsoluteFill style={{ top: 200, alignItems: "center" }}>
      <div style={{ transform: `translate(${dx * (1 - e)}px, ${dy * (1 - e)}px) rotate(${(1 - e) * (p.from === "left" ? -14 : 12)}deg)` }}><p.C /></div>
    </AbsoluteFill>
  );
};

/** Paper tab top-left: STORY n/3 · TOPIC */
const TopicChip: React.FC<{ label: string; tint: string }> = ({ label, tint }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f, fps: 60, config: { damping: 12 } });
  return (
    <div style={{ position: "absolute", left: 50, top: 92, padding: "8px 18px", background: "#fbf6ea", border: "4px solid #2b2622", borderLeft: `14px solid ${tint}`, borderRadius: 10, fontFamily: FONT, fontWeight: 900, fontSize: 28, letterSpacing: 2, color: "#2b2622", transform: `translateX(${(1 - s) * -400}px) rotate(-2deg)`, boxShadow: "4px 6px 0 #0003" }}>{label}</div>
  );
};

// ===========================================================================
// Studio v3 – room show
// ===========================================================================
/** live camera for club shows: whip-pan into each plate, slow push-in, keyword punch */
const useCamera = (show: Show, f: number, on: boolean) => {
  const t = f / FPS;
  const ci = Math.max(0, show.plates.findIndex((p, i) => p.t <= t + 1e-6 && (show.plates[i + 1]?.t ?? 1e9) > t + 1e-6));
  const from = Math.round(show.plates[ci].t * FPS);
  const to = ci + 1 < show.plates.length ? Math.round(show.plates[ci + 1].t * FPS) : Math.ceil(TOTAL_SEC * FPS);
  const lf = f - from;
  const whip = on ? Math.pow(1 - Math.min(1, lf / 11), 3) : 0;
  const dir = ci % 2 ? 1 : -1;
  const push = (1 + 0.045 * Math.min(1, lf / Math.max(1, to - from))) * (1 + 0.035 * pulseAt(onTwos(f) / FPS, true, 0.35));
  const cam = (d: number): React.CSSProperties => (on ? { transform: `translateX(${-dir * whip * 520 * d}px) scale(${1 + (push - 1) * d})`, transformOrigin: "50% 52%" } : {});
  return { on, whip, dir, cam };
};

const ANGLES = [0, -0.85, 0.75, -0.4, 0.9, -0.7, 0.35];
const angleOf = (i: number) => ANGLES[i % ANGLES.length];

const RoomMain: React.FC<{ show: Show }> = ({ show }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const end = Math.ceil(TOTAL_SEC * FPS);
  const ci = Math.max(0, show.plates.findIndex((p, i) => p.t <= t + 1e-6 && (show.plates[i + 1]?.t ?? 1e9) > t + 1e-6));
  const cur = show.plates[ci];
  const from = Math.round(cur.t * FPS);
  const to = ci + 1 < show.plates.length ? Math.round(show.plates[ci + 1].t * FPS) : end;
  const lf = f - from;
  // whip-pan: fast camera swing into each plate, with motion blur
  const WHIP = 11;
  const wp = Math.min(1, lf / WHIP);
  const whipK = 1 - (1 - Math.pow(1 - wp, 3));
  const dir = ci % 2 ? 1 : -1;
  const camX = dir * whipK * 560;
  const blur = whipK * 38;
  const angle = angleOf(ci) + (ci > 0 ? (angleOf(ci - 1) - angleOf(ci)) * whipK : 0);
  // slow continuous push-in (4.5 %) + punch on keywords
  const push = (1 + 0.045 * Math.min(1, lf / Math.max(1, to - from))) * (1 + 0.035 * pulseAt(onTwos(f) / FPS, true, 0.35));
  const cam = (depth: number): React.CSSProperties => ({ transform: `translateX(${-camX * depth}px) scale(${1 + (push - 1) * depth})`, transformOrigin: "50% 52%" });
  const tint = cur.tint ?? "#7c3aed";
  const prevTint = ci > 0 ? show.plates[ci - 1].tint ?? "#7c3aed" : tint;
  const k = Math.min(1, lf / 30);
  const sp = cur.cast?.find((m) => m.talk);
  const accent = (sp && CAST.find((c) => c.id === sp.id)?.accent) ?? show.presenter.accent;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}><defs><filter id="whipblur" x="-20%" y="0" width="140%" height="100%"><feGaussianBlur stdDeviation={`${blur.toFixed(1)} 0`} /></filter></defs></svg>
      <AbsoluteFill style={{ filter: blur > 0.6 ? "url(#whipblur)" : undefined }}>
        <AbsoluteFill style={cam(0.55)}>
          {prevTint !== tint && k < 1 && <Room tint={prevTint} angle={angle} />}
          <AbsoluteFill style={{ opacity: prevTint !== tint ? k : 1 }}><Room tint={tint} angle={angle} /></AbsoluteFill>
        </AbsoluteFill>
        <AbsoluteFill style={cam(0.65)}><RoomLights tint={tint} /></AbsoluteFill>
        {show.plates.map((p, i) => {
          const pf = Math.round(p.t * FPS);
          const pt = i + 1 < show.plates.length ? Math.round(show.plates[i + 1].t * FPS) : end;
          return (
            <Sequence key={i} from={pf} durationInFrames={Math.max(1, pt - pf)} name={`plate${i}`}>
              <AbsoluteFill style={cam(0.75)}><MonitorSlot p={p} angle={angleOf(i)} /></AbsoluteFill>
              <AbsoluteFill style={cam(1)}>
                {p.cast ? <Ensemble members={p.cast} t={t} open={mouthOpen(WORDS, t)} tint={p.tint ?? "#7c3aed"} i={i} room /> : p.toon ? <ToonHost id={p.toon.id} expr={p.toon.expr} t={t} i={i} /> : <Presenter ch={p.who ?? show.presenter} mood={p.mood} i={i} t={t} />}
              </AbsoluteFill>
              <Audio src={staticFile(i % 3 === 2 ? "pop.wav" : "whoosh.wav")} volume={0.45} />
            </Sequence>
          );
        })}
        <AbsoluteFill style={cam(1.6)}><Foreground tint={tint} /></AbsoluteFill>
        <Vignette tint={tint} />
      </AbsoluteFill>
      <SpeedLines k={whipK} dir={dir} />
      {cur.chip && <LedSign label={cur.chip} tint={tint} lf={lf} />}
      <LowerCaptions t={t} accent={accent} />
      <Audio src={staticFile("voiceover.mp3")} />
    </AbsoluteFill>
  );
};

/** the board lives on a hanging studio monitor; it powers on like a CRT at each plate */
const MonitorSlot: React.FC<{ p: Plate; angle: number }> = ({ p, angle }) => {
  const lf = useCurrentFrame();
  const g = onTwos(lf);
  const on = interpolate(lf, [2, 9], [0.02, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const flash = interpolate(lf, [2, 6, 12], [0, 0.9, 0], clamp);
  const tint = p.tint ?? "#7c3aed";
  const S = 0.84, W = 960 * S, H = 760 * S, PAD = 18;
  const sw = Math.sin(g / 34) * 0.8;
  return (
    <div style={{ position: "absolute", left: 540 - W / 2 - PAD, top: 150, perspective: 1800 }}>
      {/* ceiling cables */}
      <svg width={W + PAD * 2} height={200} style={{ position: "absolute", top: -200, left: 0, overflow: "visible" }}>
        {[0.18, 0.82].map((x, k) => <line key={k} x1={(W + PAD * 2) * x} y1={-60} x2={(W + PAD * 2) * x} y2={200} stroke="#14110f" strokeWidth={8} />)}
      </svg>
      <div style={{ transform: `rotateY(${-angle * 9}deg) rotate(${sw}deg)`, transformOrigin: "50% 0", padding: PAD, background: "linear-gradient(160deg, #3a3633, #15120f)", borderRadius: 22, border: "4px solid #0b0a09", boxShadow: `0 0 70px ${tint}77, 0 0 0 3px #ffffff18 inset, 26px 40px 40px #000a` }}>
        <div style={{ width: W, height: H, overflow: "hidden", borderRadius: 8, background: mixHex(tint), position: "relative" }}>
          <div style={{ width: 960, height: 760, transform: `scale(${S}, ${S * on})`, transformOrigin: "0 50%", marginTop: (H - 760 * S) / 2 }}>
            <div style={{ transform: "translate(0, 0)" }}><p.C /></div>
          </div>
          {/* glass glare + scanlines + power-on flash */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, #ffffff26 0%, #ffffff00 30%, #ffffff00 70%, #ffffff12 100%)" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, #0000000d 0 2px, transparent 2px 5px)" }} />
          <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash }} />
        </div>
        <div style={{ position: "absolute", right: 34, bottom: 6, width: 10, height: 10, borderRadius: 5, background: "#ff4d4d", boxShadow: "0 0 10px #ff4d4d" }} />
      </div>
    </div>
  );
};
const mixHex = (tint: string) => `radial-gradient(circle, ${tint}55, #0b0d14)`;

/** big lower-third captions: 2–3 words, white with black outline, keywords in teal */
type Chunk = { words: typeof WORDS; start: number; end: number };
const LOWER: Chunk[] = (() => {
  const out: Chunk[] = [];
  let cur: typeof WORDS = [];
  const ws: typeof WORDS = [];
  WORDS.forEach((w) => {
    const prev = ws[ws.length - 1];
    if (prev && /^%/.test(w.display)) ws[ws.length - 1] = { ...prev, display: prev.display + w.display, end: w.end, keyword: prev.keyword || w.keyword };
    else ws.push(w);
  });
  ws.forEach((w, i) => {
    if (w.display) cur.push(w);
    const len = cur.map((x) => x.display).join(" ").length;
    const brk = /[.,:;!?]$/.test(w.word) || cur.length >= 3 || len > 16 || i === ws.length - 1 || ws[i + 1]?.segment !== w.segment;
    if (brk && cur.length) { out.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end }); cur = []; }
  });
  return out;
})();

const LowerCaptions: React.FC<{ t: number; accent: string }> = ({ t, accent }) => {
  const idx = LOWER.findIndex((c, i) => t >= c.start - 0.05 && t < (LOWER[i + 1]?.start ?? Infinity) - 0.05);
  const ch = LOWER[idx];
  if (!ch || t > ch.end + 0.5) return null;
  const pop = interpolate(t - ch.start, [-0.05, 0.1], [0.82, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 1490, left: 50, right: 170, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0 26px", fontFamily: FONT, transform: `scale(${pop})` }}>
      {ch.words.map((w, i) => {
        const on = t >= w.start - 0.02, active = on && t < w.end + 0.06;
        const color = w.keyword ? "#3fe0d0" : "#ffffff";
        const txt = w.display.replace(/[,:;–]+$/, "");
        const kp = w.keyword ? interpolate(t - w.start, [0, 0.08, 0.2], [0.7, 1.15, 1], clamp) : 1;
        return (
          <span key={i} style={{ position: "relative", display: "inline-block", fontSize: 84, fontWeight: 900, lineHeight: 1.12, letterSpacing: -1, color, WebkitTextStroke: "14px #0a0a0a", paintOrder: "stroke fill", textShadow: "0 8px 0 #000, 0 12px 24px #000a", opacity: on ? 1 : 0.55, transform: `scale(${(active ? 1.06 : 1) * (on ? kp : 1)}) translateY(${active ? -6 : 0}px)` }}>
            {txt}
            {active && <span style={{ position: "absolute", left: 4, right: 4, bottom: -4, height: 9, borderRadius: 5, background: accent, boxShadow: `0 0 14px ${accent}` }} />}
          </span>
        );
      })}
    </div>
  );
};
