"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Eyebrow, Reveal } from "./Reveal";

export function CompareSlider({ before, after }: { before: string; after: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(38);
  const [dragging, setDragging] = useState(false);
  const reduce = useReducedMotion();

  const move = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <section className="mx-auto max-w-[1320px] px-4 py-28 sm:px-8 sm:py-40" aria-label="Before and after">
      <Reveal>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Same street, one more screen</Eyebrow>
            <h2 className="max-w-[16ch] text-[40px] font-medium leading-[1.05] tracking-[-0.04em] sm:text-[56px]">
              Your ad, in the lane ahead.
            </h2>
          </div>
          <p className="max-w-[36ch] text-[16px] leading-relaxed text-mute">Drag across the Fifth Ring Road. Nobody looks at a pole on the shoulder — everybody looks at the truck in front.</p>
        </div>
      </Reveal>

      <motion.div
        ref={box}
        initial={reduce ? false : { clipPath: "inset(12% 12% 12% 12%)" }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-[16/9] cursor-ew-resize select-none overflow-hidden bg-ink touch-none"
        onPointerDown={(e) => {
          setDragging(true);
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          move(e.clientX);
        }}
        onPointerMove={(e) => dragging && move(e.clientX)}
        onPointerUp={() => setDragging(false)}
      >
        <Image src={after} alt="Fifth Ring Road at night with a side street screen truck ahead" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={before} alt="Fifth Ring Road at night without a screen truck" fill sizes="100vw" className="object-cover" />
        </div>
        <span className="absolute left-4 top-4 bg-ink/70 px-3 py-1.5 text-[13px] text-paper backdrop-blur-sm">Without</span>
        <span className="absolute right-4 top-4 bg-paper px-3 py-1.5 text-[13px] text-ink">With side street</span>
        <div className="absolute inset-y-0 w-px bg-paper" style={{ left: `${pos}%` }} aria-hidden="true">
          <span
            className="frame absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-paper text-ink"
            style={{ "--frame-size": "10px", "--frame-weight": "2px" } as React.CSSProperties}
          >
            <svg width="22" height="12" viewBox="0 0 22 12" aria-hidden="true">
              <path d="M6 1 1 6l5 5M16 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(pos)}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Compare the street without and with a side street screen"
          className="absolute inset-x-0 bottom-0 h-10 w-full cursor-ew-resize opacity-0"
        />
      </motion.div>
    </section>
  );
}
