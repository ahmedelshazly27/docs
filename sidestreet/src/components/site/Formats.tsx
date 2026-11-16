"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { VEHICLES } from "@/lib/data";
import { MEDIA } from "@/lib/media";
import { Eyebrow, Reveal } from "./Reveal";

const IMAGES = { truck: MEDIA.truck, bike: MEDIA.bike, car: MEDIA.car } as const;

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rx = useSpring(useTransform(y, [0, 1], [7, -7]), { stiffness: 160, damping: 18 });
  const ry = useSpring(useTransform(x, [0, 1], [-9, 9]), { stiffness: 160, damping: 18 });

  return (
    <div className="[perspective:1100px]">
      <motion.div
        ref={ref}
        style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onPointerMove={(e) => {
          const r = ref.current?.getBoundingClientRect();
          if (!r) return;
          x.set((e.clientX - r.left) / r.width);
          y.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          x.set(0.5);
          y.set(0.5);
        }}
        className="group will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}

export function Formats() {
  return (
    <section id="formats" className="bg-ink py-28 text-paper sm:py-40" aria-label="Formats">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <Reveal>
          <p className="mb-5 text-[13px] font-medium uppercase tracking-[0.14em] text-paper/60">Formats</p>
          <h2 className="max-w-[18ch] text-[40px] font-medium leading-[1.05] tracking-[-0.04em] sm:text-[56px]">
            Three screens. One street-level network.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {VEHICLES.map((v, i) => (
            <Reveal key={v.id} delay={i * 0.1}>
              <TiltCard>
                <article className="frame frame-grow" style={{ "--frame-size": "20px", "--frame-weight": "3px" } as React.CSSProperties}>
                  <div className="relative aspect-[4/5] overflow-hidden" style={{ transform: "translateZ(30px)" }}>
                    <Image
                      src={IMAGES[v.id]}
                      alt={`${v.name}: ${v.screen}`}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
                    />
                  </div>
                  <div className="flex items-end justify-between gap-4 px-1 pb-2 pt-5" style={{ transform: "translateZ(50px)" }}>
                    <div>
                      <h3 className="text-[24px] font-medium tracking-[-0.03em]">{v.name}</h3>
                      <p className="mt-1 text-[15px] text-paper/60">{v.screen}</p>
                    </div>
                    <p className="max-w-[16ch] text-right text-[13px] leading-snug text-paper/60">{v.bestFor}</p>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export { Eyebrow };
