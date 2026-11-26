/** Junior – the tiny KNÄCK chair that came alive in Ep. 3 (built backwards: two legs point up). */
import React from "react";
import { Arms, Face, StickerFilter, boxGeo, shade, type Expr } from "../cast/rig";
import { C } from "./furni";
import { INK } from "./kit";

// --------------------------------------------------------------- Junior (the tiny chair, built backwards)
export const Junior: React.FC<{ f: number; expr: Expr; talk: boolean; awake: boolean; walk: number; yaw?: number }> = ({ f, expr, talk, awake, walk, yaw = 0 }) => {
  const id = React.useId().replace(/:/g, "");
  const open = talk ? Math.abs(Math.sin(f / 3)) : 0;
  const bk = boxGeo(150, 130, 26, yaw, 0.2, C.mint);
  const st = boxGeo(170, 26, 120, yaw, 0.2, C.woodD);
  const step = Math.sin(walk * 14) * 14;
  return (
    <svg width={300} height={400} viewBox="-150 -300 300 400" style={{ overflow: "visible" }}>
      <defs><StickerFilter id={`j${id}`} r={6} /></defs>
      <ellipse cx={0} cy={92} rx={90} ry={14} fill="#0003" />
      <g filter={`url(#j${id})`} transform={`translate(0 ${-Math.abs(step) * 0.6})`}>
        {/* legs on the floor (two) + two legs pointing UP (built upside down) */}
        {[-55, 55].map((x, i) => <rect key={x} x={x - 8} y={-10} width={16} height={100 + (i ? step : -step) * 0.3} rx={5} fill={C.wood} stroke={INK} strokeWidth={4} />)}
        {[-80, 80].map((x, i) => <rect key={`u${x}`} x={x - 8} y={-130 + (i ? 1 : -1) * Math.sin(f / 6) * 3} width={16} height={110} rx={5} fill={C.wood} stroke={INK} strokeWidth={4} transform={`rotate(${(i ? 28 : -28)} ${x} -24)`} />)}
        <g transform="translate(0 -14)">{st.faces.map((fc) => <polygon key={fc.id} points={fc.pts.map((p) => `${p.x},${p.y}`).join(" ")} fill={fc.fill} stroke={INK} strokeWidth={5} strokeLinejoin="round" />)}</g>
        <rect x={-78} y={4} width={156} height={18} rx={9} fill={C.sun} stroke={INK} strokeWidth={4} />
        <g transform="translate(0 -96)">
          {bk.faces.map((fc) => <polygon key={fc.id} points={fc.pts.map((p) => `${p.x},${p.y}`).join(" ")} fill={fc.fill} stroke={INK} strokeWidth={5} strokeLinejoin="round" />)}
          <g transform={bk.m}><Face th={{ mode: "flat", R: 50, E: 17, lid: shade(C.mint, 1.0), iris: "#f97316" }} expr={awake ? expr : "neutral"} yaw={yaw} open={open} blink={!awake} f={f} /></g>
        </g>
        <Arms sh={[{ x: -75, y: -90 }, { x: 75, y: -90 }]} expr={awake ? expr : "neutral"} f={f} color={shade(C.mint, 1.1)} scale={0.7} />
      </g>
    </svg>
  );
};

