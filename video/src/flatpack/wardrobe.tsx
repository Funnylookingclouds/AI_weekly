/** Shared props for the mini-arc "The Wardrobe of Doom": front door, the giant box, FLÄRPA wardrobe pieces. */
import React from "react";
import { C, LUCKY } from "./furni";
import { INK, clamp, type PieceDef } from "./kit";

export const DOOR_X = 430;
export const WARD = { x: 60, y: 40 };

/** front door in the right wall (world coords, bottom of doorway at y = -80) */
export const DoorFrame: React.FC = () => (
  <g transform={`translate(${DOOR_X} -80)`}>
    <path d="M-150 0 V-560 H150 V0 H124 V-534 H-124 V0 Z" fill="#fff" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
  </g>
);
export const FrontDoor: React.FC<{ open: number }> = ({ open }) => (
  <g transform={`translate(${DOOR_X} -80)`}>
    <rect x={-150} y={-560} width={300} height={560} rx={10} fill="#fff" stroke={INK} strokeWidth={8} />
    <rect x={-124} y={-534} width={248} height={534} fill="#3b2f4a" />
    <rect x={-124} y={-534} width={248} height={534} fill="url(#hall)" opacity={0.6} />
    <g transform={`translate(-124 0) scale(${1 - 0.88 * open} 1)`}>
      <rect x={0} y={-534} width={248} height={534} fill={C.tomato} stroke={INK} strokeWidth={6} />
      {[-470, -270].map((y) => <rect key={y} x={30} y={y} width={188} height={160} rx={10} fill="none" stroke={INK} strokeWidth={4} opacity={0.5} />)}
      <circle cx={214} cy={-260} r={13} fill={C.sun} stroke={INK} strokeWidth={4} />
    </g>
  </g>
);

/** the giant FLÄRPA box: slides in at tIn, gets pushed (wobble), wedged at tWedge, ripped open at tRip */
export const GiantBox: React.FC<{ t: number; tIn: number; push: number; tilt: number; tWedge: number; tRip: number }> = ({ t, tIn, push, tilt, tWedge, tRip }) => {
  const a = clamp((t - tIn) / 0.6);
  if (a <= 0) return null;
  const wedge = t > tWedge ? Math.min(1, (t - tWedge) / 0.15) : 0;
  const ripped = t > tRip;
  const sk = push * 8;
  return (
    <g transform={`translate(${DOOR_X - 40 * wedge} ${-70}) rotate(${tilt - 4 * wedge}) skewX(${sk}) scale(${0.55 + a * 0.45 + wedge * 0.05} ${0.55 + a * 0.45 - wedge * 0.04})`}>
      <path d="M-200 -720 l 40 -26 h 400 l -40 26 Z" fill="#c99556" stroke={INK} strokeWidth={6} />
      <rect x={-200} y={-720} width={400} height={720} fill="#d9a766" stroke={INK} strokeWidth={7} />
      <text x={0} y={-600} textAnchor="middle" fontFamily={LUCKY} fontSize={72} fill={INK}>FLÄRPA</text>
      <g transform="translate(0 -380)"><rect x={-70} y={-150} width={140} height={260} fill="none" stroke={INK} strokeWidth={8} /><line x1={0} y1={-150} x2={0} y2={110} stroke={INK} strokeWidth={6} /></g>
      <text x={0} y={-90} textAnchor="middle" fontFamily={LUCKY} fontSize={40} fill={C.tomato}>2 m ↕</text>
      {ripped && <path d="M-200 -300 L-150 -340 L-100 -290 L-40 -350 L20 -300 L80 -345 L140 -295 L200 -330 L200 -40 L-200 -40 Z" fill="#3b2f20" stroke={INK} strokeWidth={6} />}
    </g>
  );
};

/** FLÄRPA pieces in wardrobe-local coords (floor centre = 0,0). `ev` maps piece id → events. */
export const wardrobePieces = (ev: Record<string, [number, string][]>, doorOpen: (t: number) => number, t: number, opts: { handleOff?: boolean; push?: boolean } = {}): PieceDef[] => {
  const door = (side: -1 | 1) => (s: { flip: number }) => {
    const w = 180, h = 520, o = doorOpen(t);
    return (
      <g transform={`translate(${side * -w / 2} 0) scale(${1 - 0.86 * o} 1) translate(${side * w / 2} 0)`}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill={C.grape} stroke={INK} strokeWidth={6} />
        <rect x={-w / 2 + 20} y={-h / 2 + 24} width={w - 40} height={h - 48} rx={8} fill="none" stroke={INK} strokeWidth={3} opacity={0.4} />
        {/* hinges on the OUTSIDE */}
        {[-200, 0, 200].map((y) => <rect key={y} x={side * -w / 2 - 14} y={y - 18} width={28} height={36} rx={4} fill="#cbd5e1" stroke={INK} strokeWidth={4} />)}
        {!(side === 1 && opts.handleOff) && <rect x={side * (w / 2 - 34) - 8} y={-60} width={16} height={120} rx={8} fill={C.sun} stroke={INK} strokeWidth={4} />}
        {side === 1 && opts.push && <g transform="translate(10 60) rotate(-6)"><rect x={-40} y={-16} width={80} height={32} rx={4} fill="#fff" stroke={INK} strokeWidth={3} /><text x={0} y={8} textAnchor="middle" fontFamily={LUCKY} fontSize={20} fill={INK}>PUSH →</text></g>}
      </g>
    );
  };
  const P = (id: string, w: number, h: number, x: number, y: number, color: string, i: number, extra: Partial<PieceDef> = {}): PieceDef => ({
    id, w, h, built: { x, y, r: 0 }, box: { x: DOOR_X - WARD.x - 20, y: -280, r: 0 },
    pile: { x: -260 + ((i * 113) % 560), y: 70 + ((i * 37) % 90), r: [84, -86, 4, -5, 7, 88, -88, 3][i] }, fall: { x: 0, y: 60, r: 90 }, color,
    ev: ev[id] ?? [[0, "built"]], ...extra,
  });
  return [
    P("back", 360, 540, 0, -300, C.mint, 0),
    P("left", 26, 590, -192, -295, C.sky, 1),
    P("right", 26, 590, 192, -295, C.sky, 2),
    P("bot", 404, 30, 0, -15, C.sky, 3),
    P("top", 424, 34, 0, -604, C.tomato, 4),
    P("doorL", 180, 520, -92, -300, C.grape, 5, { draw: door(-1) }),
    P("doorR", 180, 520, 92, -300, C.grape, 6, { draw: door(1) }),
  ];
};

/** "PART 2 →" end card */
export const EndCard: React.FC<{ t: number; t0: number; text: string }> = ({ t, t0, text }) => {
  const a = t - t0;
  if (a < 0) return null;
  const s = a < 0.2 ? (a / 0.2) * 1.15 : a < 0.3 ? 1.15 - (a - 0.2) * 1.5 : 1;
  return (
    <div style={{ position: "absolute", left: 0, top: 820, width: 1080, display: "flex", justifyContent: "center", transform: `scale(${s}) rotate(-4deg)` }}>
      <div style={{ background: C.sun, border: `9px solid ${INK}`, borderRadius: 28, padding: "18px 50px", boxShadow: `12px 12px 0 ${INK}`, fontFamily: LUCKY, fontSize: 110, color: INK }}>{text}</div>
    </div>
  );
};
