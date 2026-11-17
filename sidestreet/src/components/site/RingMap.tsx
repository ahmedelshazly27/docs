"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "./Reveal";

// Schematic (not to scale) of Kuwait's ring roads arcing around the city from the coast.
const RINGS = [1, 2, 3, 4, 5, 6, 7];
const CX = 600;
const CY = 40;
const R = (n: number) => 70 + n * 62;
const arc = (r: number) => `M ${CX - r} ${CY} A ${r} ${r} 0 0 0 ${CX + r} ${CY}`;

const ZONES = [
  { id: "sharq", label: "Sharq", ar: "شرق", x: 600, y: 120 },
  { id: "hawalli", label: "Hawalli", ar: "حولي", x: 760, y: 230 },
  { id: "salmiya", label: "Salmiya", ar: "السالمية", x: 930, y: 170 },
  { id: "jabriya", label: "Jabriya", ar: "الجابرية", x: 820, y: 330 },
  { id: "shuwaikh", label: "Shuwaikh", ar: "الشويخ", x: 420, y: 160 },
  { id: "farwaniya", label: "Farwaniya", ar: "الفروانية", x: 430, y: 390 },
  { id: "jahra", label: "Jahra", ar: "الجهراء", x: 140, y: 230 },
];

const VEHICLES = [
  { ring: 1, dur: 16, delay: 0, kind: "car" },
  { ring: 3, dur: 22, delay: 3, kind: "truck" },
  { ring: 4, dur: 26, delay: 8, kind: "bike" },
  { ring: 5, dur: 30, delay: 1, kind: "truck" },
  { ring: 6, dur: 34, delay: 12, kind: "car" },
];

export function RingMap() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(1);
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setActive((i) => (i + 1) % ZONES.length), 2600);
    return () => clearInterval(t);
  }, [reduce]);
  const z = ZONES[active];

  return (
    <section className="bg-ink py-28 text-paper sm:py-40" aria-label="Network map">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <Reveal>
          <p className="mb-5 text-[13px] font-medium uppercase tracking-[0.14em] text-paper/60">The network</p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="max-w-[16ch] text-[40px] font-medium leading-[1.05] tracking-[-0.04em] sm:text-[56px]">From the First Ring to the side street.</h2>
            <div className="flex gap-5 text-[13px] text-paper/70">
              <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 bg-paper" /> Truck</span>
              <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-paper" /> Car top</span>
              <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rotate-45 border border-paper" /> Bike box</span>
            </div>
          </div>
        </Reveal>

        <div className="relative mt-14">
          <svg viewBox="0 0 1200 520" className="w-full" role="img" aria-label="Schematic map of Kuwait's ring roads with side street vehicles moving along them">
            <line x1="0" y1={CY} x2="1200" y2={CY} stroke="rgba(255,255,255,.25)" strokeDasharray="2 6" />
            <text x="1190" y={CY - 12} textAnchor="end" fill="rgba(255,255,255,.4)" fontSize="13">Arabian Gulf</text>
            {RINGS.map((n) => (
              <g key={n}>
                <path id={`ring-${n}`} d={arc(R(n))} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="1.5" />
                <text x={CX - R(n) + 6} y={CY + 18} fill="rgba(255,255,255,.35)" fontSize="11">{n}</text>
              </g>
            ))}
            {ZONES.map((zz, i) => (
              <g key={zz.id} opacity={i === active ? 1 : 0.45} style={{ transition: "opacity .6s" }}>
                <circle cx={zz.x} cy={zz.y} r="3" fill="#fff" />
                <text x={zz.x + 10} y={zz.y + 4} fill="#fff" fontSize="14">{zz.label}</text>
              </g>
            ))}
            {!reduce &&
              VEHICLES.map((v, i) => (
                <g key={i}>
                  {v.kind === "truck" && <rect x="-5" y="-5" width="10" height="10" fill="#fff" />}
                  {v.kind === "car" && <circle r="5" fill="#fff" />}
                  {v.kind === "bike" && <rect x="-4" y="-4" width="8" height="8" fill="none" stroke="#fff" strokeWidth="1.5" transform="rotate(45)" />}
                  <animateMotion dur={`${v.dur}s`} begin={`${v.delay}s`} repeatCount="indefinite" rotate="0" keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="linear">
                    <mpath href={`#ring-${v.ring}`} />
                  </animateMotion>
                </g>
              ))}
          </svg>

          <motion.div
            key={z.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="frame pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${(z.x / 1200) * 100}%`, top: `${(z.y / 520) * 100}%`, width: 120, height: 64, "--frame-size": "14px", "--frame-weight": "2px" } as React.CSSProperties}
            aria-hidden="true"
          />
          <div className="mt-6 flex items-baseline gap-3 text-[15px]" aria-live="polite">
            <span className="text-paper/60">On air now</span>
            <span className="font-medium">{z.label}</span>
            <span lang="ar" className="text-paper/70">{z.ar}</span>
          </div>
          <p className="mt-2 text-[12px] text-paper/40">Schematic, not to scale.</p>
        </div>
      </div>
    </section>
  );
}
