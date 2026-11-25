/** Character sheets: 5 characters × 10 expressions, and 3D turnarounds. */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import "@fontsource/caveat/700.css";
import { CAST, Toon } from "./cast";
import { EXPRS } from "./rig";

const BG = "#efe6d2";
export const CastSheet: React.FC = () => {
  const f = 37;
  return (
    <AbsoluteFill style={{ background: BG, fontFamily: "Inter, sans-serif", padding: 40 }}>
      <div style={{ fontSize: 64, fontWeight: 900, color: "#2b2622" }}>AI Bounce – new cast <span style={{ fontFamily: "Caveat, cursive", color: "#c98a1c" }}>expression sheet</span></div>
      <div style={{ display: "grid", gridTemplateColumns: `300px repeat(${EXPRS.length}, 220px)`, alignItems: "center", marginTop: 10 }}>
        <div />
        {EXPRS.map((e) => <div key={e} style={{ textAlign: "center", fontSize: 30, fontWeight: 800, color: "#7a6f62", textTransform: "uppercase" }}>{e}</div>)}
        {CAST.map((c) => (
          <React.Fragment key={c.id}>
            <div style={{ paddingRight: 16 }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: c.accent }}>{c.name}</div>
              <div style={{ fontFamily: "Caveat, cursive", fontSize: 34, color: "#2b2622" }}>{c.tag}</div>
              {c.traits.map((t) => <div key={t} style={{ fontSize: 18, color: "#7a6f62" }}>• {t}</div>)}
            </div>
            {EXPRS.map((e, i) => <div key={e} style={{ display: "flex", justifyContent: "center" }}><Toon id={c.id} expr={e} f={f + i * 7} size={190} yaw={(i % 3 - 1) * 0.18} still /></div>)}
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const YAWS = [-0.95, -0.5, 0, 0.5, 0.95];
export const CastTurn: React.FC = () => (
  <AbsoluteFill style={{ background: BG, fontFamily: "Inter, sans-serif", padding: 40 }}>
    <div style={{ fontSize: 56, fontWeight: 900, color: "#2b2622" }}>3D turnaround <span style={{ fontFamily: "Caveat, cursive", color: "#c98a1c" }}>faces wrap around real shapes</span></div>
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${CAST.length}, 1fr)`, gap: 10, marginTop: 20 }}>
      {CAST.map((c) => (
        <div key={c.id} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, fontWeight: 900, color: c.accent }}>{c.name}</div>
          {YAWS.map((y) => <div key={y} style={{ height: 250 }}><Toon id={c.id} expr="happy" f={20} size={190} yaw={y} still /></div>)}
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

/** Quick animated loop of all ten expressions per character (for review). */
export const CastLoop: React.FC = () => {
  const f = useCurrentFrame();
  const e = EXPRS[Math.floor(f / 45) % EXPRS.length];
  return (
    <AbsoluteFill style={{ background: BG, alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
      <div style={{ fontSize: 70, fontWeight: 900, textTransform: "uppercase" }}>{e}</div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", width: 1000 }}>
        {CAST.map((c, i) => <Toon key={c.id} id={c.id} expr={e} f={f + i * 11} size={300} yaw={Math.sin(f / 40 + i) * 0.5} open={Math.abs(Math.sin(f / 3)) * 0.4} />)}
      </div>
    </AbsoluteFill>
  );
};
