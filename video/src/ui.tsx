import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "./theme";

// ---------- helpers ----------
export const useSpring = (delay = 0, damping = 12, stiffness = 120) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping, stiffness } });
};
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Visual stage: content area above subtitles (y 260–1120). */
export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ top: 250, height: 880, alignItems: "center", justifyContent: "center", fontFamily: FONT, color: C.text }}>
    {children}
  </AbsoluteFill>
);

export const Glow: React.FC<{ color: string; children: React.ReactNode; size?: number }> = ({ color, children, size = 40 }) => (
  <span style={{ textShadow: `0 0 ${size}px ${color}, 0 0 ${size / 3}px ${color}` }}>{children}</span>
);

export const Chip: React.FC<{ color: string; children: React.ReactNode; delay?: number }> = ({ color, children, delay = 0 }) => {
  const s = useSpring(delay);
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 14, padding: "14px 30px", borderRadius: 999,
      border: `3px solid ${color}`, background: `${color}22`, color, fontSize: 40, fontWeight: 800,
      letterSpacing: 2, transform: `scale(${s})`, opacity: s,
    }}>{children}</div>
  );
};

