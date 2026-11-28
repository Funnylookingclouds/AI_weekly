/**
 * Poster intro (2.5 s) + poster outro (3 s) for studio/club shows: a torn paper poster slaps onto
 * the studio wall (or the club's brick wall) with the AI Bounce logo, the episode title and the
 * cast; camera whips in; music jingle (ElevenLabs Music, video/public/brand/jingle_*.wav).
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { FONT } from "../theme";
import { Wordmark, Ball } from "./Brand";
import { Room, RoomLights, Vignette, Foreground, SpeedLines, PaperBurst } from "../cast/room";
import { ComedyClub } from "../club/Club";
import { Toon, type CastId } from "../cast/cast";
import type { Expr } from "../cast/rig";
import { Bouncy } from "../presenter/Bouncy";
import { P, HAND, tornPath } from "../presenter/kit";

export const POSTER_IN = 150; // 2.5 s
export const POSTER_OUT = 180; // 3 s
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export type PosterInfo = { title: string; kicker: string };

const Scene: React.FC<{ club?: boolean; tint: string; f: number; children: React.ReactNode }> = ({ club, tint, f, children }) => {
  // camera: whip-in (motion blur) + slow push
  const wp = Math.min(1, f / 12);
  const whip = Math.pow(1 - wp, 3);
  const push = 1 + 0.05 * Math.min(1, f / 180);
  const cam = (d: number): React.CSSProperties => ({ transform: `translateX(${whip * 600 * d}px) scale(${1 + (push - 1) * d})`, transformOrigin: "50% 50%" });
  const blur = whip * 40;
  const id = `pw${club ? "c" : "r"}`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}><defs><filter id={id} x="-20%" y="0" width="140%" height="100%"><feGaussianBlur stdDeviation={`${blur.toFixed(1)} 0`} /></filter></defs></svg>
      <AbsoluteFill style={{ filter: blur > 0.6 ? `url(#${id})` : undefined }}>
        <AbsoluteFill style={cam(0.5)}>{club ? <ComedyClub tint={tint} /> : <><Room tint={tint} angle={-0.35} /><RoomLights tint={tint} /></>}</AbsoluteFill>
        <AbsoluteFill style={cam(1)}>{children}</AbsoluteFill>
        {!club && <AbsoluteFill style={cam(1.6)}><Foreground tint={tint} /></AbsoluteFill>}
        {!club && <Vignette tint={tint} />}
      </AbsoluteFill>
      <SpeedLines k={whip} dir={-1} />
    </AbsoluteFill>
  );
};

/** torn paper poster with tape, slapped onto the wall */
const PosterCard: React.FC<{ f: number; at: number; w: number; h: number; top: number; children: React.ReactNode }> = ({ f, at, w, h, top, children }) => {
  const s = spring({ frame: f - at, fps: 60, config: { damping: 9, stiffness: 160 } });
  const rot = -2 + (1 - s) * -14;
  return (
    <div style={{ position: "absolute", left: 540 - w / 2, top, width: w, height: h, transform: `translateY(${(1 - s) * -1300}px) rotate(${rot}deg) scale(${1 + (1 - s) * 0.2})`, filter: "drop-shadow(18px 30px 26px #000a)", opacity: f >= at ? 1 : 0 }}>
      <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
        <path d={tornPath(w, h, "poster-o", 18, 10)} fill={P.paper2} />
        <path d={tornPath(w - 26, h - 26, "poster-i", 16, 7)} transform="translate(13 13)" fill={P.paper} />
      </svg>
      {[[-30, -18, -28], [w - 120, -14, 24]].map(([x, y, r], k) => <div key={k} style={{ position: "absolute", left: x, top: y, width: 150, height: 46, background: "#e9dcb8cc", transform: `rotate(${r}deg)`, boxShadow: "0 2px 4px #0003" }} />)}
      <div style={{ position: "absolute", inset: 40, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: FONT, color: P.ink }}>{children}</div>
    </div>
  );
};

const LogoPanel: React.FC<{ f: number; at: number; scale?: number }> = ({ f, at, scale = 0.5 }) => {
  const s = spring({ frame: f - at, fps: 60, config: { damping: 10, stiffness: 200 } });
  return (
    <div style={{ width: "100%", height: 250, borderRadius: 18, background: "radial-gradient(ellipse at 50% 40%, #1e1b4b, #070815)", border: `5px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", transform: `scale(${0.6 + 0.4 * s})`, opacity: s }}>
      <div style={{ position: "absolute", left: 70, top: 46 }}><Ball size={56} /></div>
      <div style={{ transform: `scale(${scale})`, marginTop: 30 }}><Wordmark bounceIn /></div>
    </div>
  );
};

const CastRow: React.FC<{ f: number; at: number; exprs: Expr[]; wave?: boolean }> = ({ f, at, exprs, wave }) => {
  const ids: CastId[] = ["wattson", "chip", "lumi", "pixel", "cloudy"];
  return (
    <>
      {ids.map((id, k) => {
        const s = spring({ frame: f - at - k * 5, fps: 60, config: { damping: 8, stiffness: 190 } });
        const x = 150 + k * 195;
        const hop = wave ? Math.abs(Math.sin((f + k * 12) / 9)) * 26 : 0;
        return (
          <div key={id} style={{ position: "absolute", left: x - 115, top: 1250 + (1 - s) * 700 - hop, opacity: f >= at + k * 5 ? 1 : 0 }}>
            <div style={{ position: "absolute", left: 25, top: 275 + hop, width: 180, height: 34, borderRadius: "50%", background: "radial-gradient(ellipse, #000b, transparent 70%)" }} />
            <Toon id={id} expr={exprs[k % exprs.length]} f={f + k * 13} size={230} yaw={(k - 2) * -0.12} look={{ x: (2 - k) * 0.3, y: -0.2 }} />
          </div>
        );
      })}
    </>
  );
};

export const PosterIntro: React.FC<{ info: PosterInfo; tint: string; club?: boolean }> = ({ info, tint, club }) => {
  const f = useCurrentFrame();
  const tw = interpolate(f, [34, 60], [0, info.title.length], clamp);
  const stamp = spring({ frame: f - 96, fps: 60, config: { damping: 8, stiffness: 220 } });
  return (
    <Scene club={club} tint={tint} f={f}>
      <PosterCard f={f} at={4} w={900} h={960} top={170}>
        <div style={{ background: P.red, color: "#fff", fontWeight: 900, fontSize: 34, letterSpacing: 4, padding: "8px 22px", transform: "rotate(-1.5deg)", marginBottom: 26 }}>{info.kicker}</div>
        <LogoPanel f={f} at={14} />
        <div style={{ marginTop: 36, fontSize: info.title.length > 34 ? 80 : 96, fontWeight: 900, lineHeight: 1.05, textAlign: "center", textTransform: "uppercase", letterSpacing: -1 }}>
          {info.title.slice(0, Math.round(tw))}<span style={{ opacity: f % 20 < 10 && tw < info.title.length ? 1 : 0 }}>|</span>
        </div>
        <div style={{ position: "absolute", bottom: 20, fontFamily: HAND, fontSize: 56, fontWeight: 700, color: P.teal }}>keep up with AI</div>
      </PosterCard>
      {/* NEW! stamp */}
      <div style={{ position: "absolute", right: 80, top: 960, opacity: f >= 96 ? 1 : 0, transform: `rotate(14deg) scale(${2.2 - 1.2 * stamp})`, border: `8px solid ${P.red}`, borderRadius: 14, padding: "6px 22px", color: P.red, fontFamily: FONT, fontWeight: 900, fontSize: 64, letterSpacing: 4, background: "#fbf6eaee" }}>{club ? "LIVE!" : "NEW!"}</div>
      {club
        ? <div style={{ position: "absolute", left: 300, top: 1260 + (1 - spring({ frame: f - 40, fps: 60, config: { damping: 8 } })) * 700 }}><Bouncy size={480} mood="laugh" /></div>
        : <CastRow f={f} at={44} exprs={["smug", "surprised", "happy", "laugh", "happy"]} />}
      <PaperBurst x={540} y={700} age={(f - 96) / 60} seed="pi" />
      <Audio src={staticFile("brand/jingle_intro.wav")} volume={0.9} />
      <Audio src={staticFile("whoosh.wav")} volume={0.5} />
    </Scene>
  );
};

export const PosterOutro: React.FC<{ tint: string; club?: boolean }> = ({ tint, club }) => {
  const f = useCurrentFrame();
  const press = interpolate(f, [70, 76, 84], [0, 1, 0], clamp);
  const done = f >= 76;
  const load = interpolate(f, [20, 160], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <Scene club={club} tint={tint} f={f}>
      <PosterCard f={f} at={2} w={900} h={1000} top={150}>
        <LogoPanel f={f} at={8} />
        <div style={{ marginTop: 30, fontSize: 108, fontWeight: 900, lineHeight: 0.95, textAlign: "center", letterSpacing: -2 }}>FOLLOW<br /><span style={{ color: P.teal }}>FOR MORE</span></div>
        <div style={{ marginTop: 26, padding: "18px 44px", borderRadius: 999, background: done ? P.green : P.red, color: "#fff", fontWeight: 900, fontSize: 52, letterSpacing: 2, transform: `scale(${1 - press * 0.12})`, boxShadow: "0 8px 0 #0004", display: "flex", gap: 14, alignItems: "center" }}>
          {done ? "SUBSCRIBED ✓" : "▶ SUBSCRIBE"}
        </div>
        <div style={{ marginTop: 18, fontSize: 44, fontWeight: 900 }}>@AIBounce</div>
        <div style={{ marginTop: 10, fontFamily: HAND, fontSize: 52, fontWeight: 700, color: P.red }}>new AI news every week!</div>
        <div style={{ position: "absolute", bottom: 26, left: 30, right: 30 }}>
          <div style={{ fontFamily: HAND, fontSize: 44, fontWeight: 700, color: P.ink, marginBottom: 8 }}>next episode loading… {f > 165 ? "too fast!" : `${Math.round(load * 100)}%`}</div>
          <div style={{ height: 26, borderRadius: 13, border: `4px solid ${P.ink}`, overflow: "hidden" }}><div style={{ width: `${load * 100}%`, height: "100%", background: `repeating-linear-gradient(135deg, ${P.mustard} 0 18px, ${P.red} 18px 36px)` }} /></div>
        </div>
      </PosterCard>
      {club
        ? <div style={{ position: "absolute", left: 300, top: 1280 }}><Bouncy size={460} mood="wink" /></div>
        : <CastRow f={f} at={10} exprs={["happy", "laugh", "love", "happy", "laugh"]} wave />}
      <PaperBurst x={540} y={900} age={(f - 76) / 60} seed="po" />
      <Sequence from={10}><Audio src={staticFile("brand/outro_vo.mp3")} /></Sequence>
      <Audio src={staticFile("brand/jingle_outro.wav")} volume={0.75} />
      <Sequence from={76}><Audio src={staticFile("brand/ding.wav")} volume={0.45} /></Sequence>
    </Scene>
  );
};
