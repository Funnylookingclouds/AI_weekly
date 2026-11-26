/** Sven – the snooty SNYGGO sofa (guest rival, Ep. 8). Monocle, moustache, unfolds into a sofa bed (`bed` 0..1, `lump` = someone inside). */
import React from "react";
import { Arms, Face, StickerFilter, boxGeo, shade, type Expr } from "../cast/rig";
import { C } from "./furni";
import { INK } from "./kit";

const NAVY = "#2b4a9b", MUST = "#E8B13A";
const poly = (pts: { x: number; y: number }[]) => pts.map((p) => `${p.x},${p.y}`).join(" ");

export const Sven: React.FC<{ f: number; expr: Expr; talk: boolean; awake?: boolean; yaw?: number; bed?: number; lump?: boolean; size?: number; hop?: number }> = ({ f, expr, talk, awake = true, yaw = 0, bed = 0, lump = false, size = 460, hop = 0 }) => {
  const id = React.useId().replace(/:/g, "");
  const open = talk ? Math.abs(Math.sin(f / 3.2)) : 0;
  const back = boxGeo(440, 230, 60, yaw, 0.22, NAVY);
  const seat = boxGeo(440, 70, 180, yaw, 0.22, MUST);
  const arm = boxGeo(60, 130, 210, yaw, 0.22, shade(NAVY, 1.0).startsWith("rgb") ? NAVY : NAVY);
  const at = (x: number, y: number, z: number) => back.at([x, y, z]);
  const Box = ({ g, x, y, z }: { g: ReturnType<typeof boxGeo>; x: number; y: number; z: number }) => { const p = at(x, y, z); return <g transform={`translate(${p.x} ${p.y})`}>{g.faces.map((fc) => <polygon key={fc.id} points={poly(fc.pts)} fill={fc.fill} stroke={INK} strokeWidth={6} strokeLinejoin="round" />)}</g>; };
  const wig = lump ? Math.sin(f / 2.5) * 8 : 0;
  return (
    <svg width={size} height={size * 1.6} viewBox="-300 -560 600 960" style={{ overflow: "visible" }}>
      <defs><StickerFilter id={`sv${id}`} r={8} /></defs>
      <ellipse cx={0} cy={232} rx={260} ry={26} fill="#0003" />
      <g filter={`url(#sv${id})`} transform={`translate(0 ${76 - hop})`}>
        {[-170, 170].map((x) => <g key={x}><rect x={x - 10} y={110} width={20} height={34} rx={4} fill={C.woodD} stroke={INK} strokeWidth={4} /><ellipse cx={x} cy={146} rx={16} ry={8} fill="#1f2937" stroke={INK} strokeWidth={3} /></g>)}
        <Box g={arm} x={-245} y={-60} z={60} />
        <g>{back.faces.map((fc) => <polygon key={fc.id} points={poly(fc.pts)} fill={fc.fill} stroke={INK} strokeWidth={6} strokeLinejoin="round" />)}</g>
        {back.faces.some((x) => x.id === "front") && (
          <g transform={back.m}>
            {[-170, 170].map((x) => <circle key={x} cx={x} cy={-62} r={6} fill={shade(NAVY, 0.7)} stroke={INK} strokeWidth={2.5} />)}
            <rect x={-130} y={-96} width={260} height={150} rx={50} fill="#5b7fd6" stroke={INK} strokeWidth={4} />
            <g transform="translate(0 -22)">
              <Face th={{ mode: "flat", R: 86, E: 26, lid: "#5b7fd6", iris: "#b45309" }} expr={awake ? expr : "neutral"} yaw={yaw} open={open} blink={!awake} f={f} />
              {/* monocle + moustache */}
              <circle cx={30} cy={-9} r={34} fill="#ffffff22" stroke={C.sun} strokeWidth={5} />
              <path d="M64 -9 q 18 40 -6 80" stroke={C.sun} strokeWidth={3} fill="none" />
              <path d={`M-60 ${30 - open * 4} q 30 -24 60 -6 q 30 -18 60 6 q -26 18 -60 6 q -30 12 -60 -6 Z`} fill="#3f2a14" stroke={INK} strokeWidth={3} />
            </g>
          </g>
        )}
        <Box g={seat} x={0} y={-130} z={80} />
        {/* sofa bed: mattress flips out over whoever sits on it */}
        {bed > 0.01 && (() => {
          const p = at(0, -100, 120);
          const fl = Math.cos(Math.min(1, bed) * Math.PI);
          return (
            <g transform={`translate(${p.x} ${p.y})`}>
              <g transform={`scale(1 ${fl})`}><rect x={-210} y={-20} width={420} height={40} rx={14} fill="#f8fafc" stroke={INK} strokeWidth={5} /></g>
              {bed > 0.5 && (
                <g>
                  <path d={`M-210 0 Q -120 ${-70 - wig} 0 ${-90 + wig} Q 120 ${-70 - wig} 210 0 L 210 40 L -210 40 Z`} fill={C.sky} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
                  {[-150, -50, 50, 150].map((x) => <circle key={x} cx={x} cy={8} r={8} fill="#fff" opacity={0.7} />)}
                  {lump && <g transform={`translate(${-20 + wig} ${-92})`}>{[["#FFC93C", 70], ["#4CC9F0", 60], ["#3DDC97", 66]].map(([c, w], i) => <rect key={i} x={-Number(w) / 2 + i * 6} y={-16 - i * 15} width={Number(w)} height={15} rx={3} fill={String(c)} stroke={INK} strokeWidth={3.5} transform={`rotate(${i * 7 - 6})`} />)}</g>}
                </g>
              )}
            </g>
          );
        })()}
        <Box g={arm} x={245} y={-60} z={60} />
        <Arms sh={[at(-270, -40, 80), at(270, -40, 80)] as [{ x: number; y: number }, { x: number; y: number }]} expr={awake ? expr : "neutral"} f={f} color={shade(NAVY, 1.3)} scale={1.1} />
      </g>
    </svg>
  );
};
