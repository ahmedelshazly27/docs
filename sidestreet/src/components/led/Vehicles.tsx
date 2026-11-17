"use client";

import { motion, type MotionValue } from "motion/react";
import { LedScreen } from "./LedScreen";

type Kind = "truck" | "bike" | "car";

// viewBox sizes and where the screen sits inside each drawing (in %).
const SPEC: Record<Kind, { vb: [number, number]; screen: { l: number; t: number; w: number; h: number }; rows: number }> = {
  truck: { vb: [600, 260], screen: { l: 4, t: 13.1, w: 62, h: 62.3 }, rows: 24 },
  bike: { vb: [320, 240], screen: { l: 6.9, t: 19.2, w: 34.4, h: 36.7 }, rows: 16 },
  car: { vb: [440, 220], screen: { l: 34.1, t: 6.4, w: 36.4, h: 20 }, rows: 11 },
};

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, vectorEffect: "non-scaling-stroke" as const, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

function Paths({ kind, draw }: { kind: Kind; draw?: MotionValue<number> }) {
  const P = (d: string, key: string | number) =>
    draw ? <motion.path key={key} d={d} {...S} style={{ pathLength: draw }} /> : <path key={key} d={d} {...S} />;
  const C = (cx: number, cy: number, r: number, key: string) =>
    draw ? <motion.circle key={key} cx={cx} cy={cy} r={r} {...S} style={{ pathLength: draw }} /> : <circle key={key} cx={cx} cy={cy} r={r} {...S} />;

  if (kind === "truck")
    return (
      <>
        {P("M10 20 H410 V210 H10 Z", "box")}
        {P("M410 80 H520 Q532 80 540 90 L586 150 V210 H410", "cab")}
        {P("M426 94 H512 L556 150 H426 Z", "win")}
        {P("M10 210 H586", "chassis")}
        {P("M470 170 H492", "handle")}
        {C(92, 222, 26, "w1")}
        {C(310, 222, 26, "w2")}
        {C(520, 222, 26, "w3")}
        {C(92, 222, 9, "h1")}
        {C(310, 222, 9, "h2")}
        {C(520, 222, 9, "h3")}
      </>
    );
  if (kind === "bike")
    return (
      <>
        {P("M12 36 H142 V146 H12 Z", "box")}
        {P("M30 146 V158 H124 V146", "rack")}
        {C(74, 196, 36, "w1")}
        {C(252, 196, 36, "w2")}
        {P("M74 196 L132 154 H208 L252 196", "frame")}
        {P("M208 154 L232 108 H262", "fork")}
        {P("M128 146 H184", "seat")}
        {C(74, 196, 8, "h1")}
        {C(252, 196, 8, "h2")}
      </>
    );
  return (
    <>
      {P("M150 14 H310 V58 H150 Z", "screen")}
      {P("M200 58 V72 M260 58 V72", "mount")}
      {P("M20 160 Q20 124 54 118 L118 112 L160 72 H300 L352 112 L408 120 Q424 124 424 160 V172 H20 Z", "body")}
      {P("M170 82 H294 L336 112 H134 Z", "win")}
      {P("M228 82 V112", "pillar")}
      {C(104, 176, 26, "w1")}
      {C(344, 176, 26, "w2")}
      {C(104, 176, 9, "h1")}
      {C(344, 176, 9, "h2")}
    </>
  );
}

export function Vehicle({
  kind,
  messages,
  draw,
  className = "",
  marquee = false,
  label,
  lineOpacity,
}: {
  kind: Kind;
  messages: string[];
  draw?: MotionValue<number>;
  lineOpacity?: MotionValue<number>;
  className?: string;
  marquee?: boolean;
  label?: string;
}) {
  const s = SPEC[kind];
  return (
    <div className={`relative text-paper ${className}`} style={{ aspectRatio: `${s.vb[0]} / ${s.vb[1]}` }}>
      <motion.svg viewBox={`0 0 ${s.vb[0]} ${s.vb[1]}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true" style={lineOpacity ? { opacity: lineOpacity } : undefined}>
        <Paths kind={kind} draw={draw} />
      </motion.svg>
      <div
        className="absolute overflow-hidden rounded-[2px]"
        style={{ left: `${s.screen.l}%`, top: `${s.screen.t}%`, width: `${s.screen.w}%`, height: `${s.screen.h}%` }}
      >
        <LedScreen messages={messages} rows={s.rows} marquee={marquee} ariaLabel={label ?? `${kind} screen showing: ${messages.join(", ")}`} />
      </div>
    </div>
  );
}

export function VehicleIcon({ kind, className = "" }: { kind: Kind; className?: string }) {
  const s = SPEC[kind];
  return (
    <svg viewBox={`0 0 ${s.vb[0]} ${s.vb[1]}`} className={`overflow-visible ${className}`} aria-hidden="true">
      <Paths kind={kind} />
    </svg>
  );
}
