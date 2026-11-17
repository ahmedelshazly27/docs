"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AREAS } from "@/lib/data";
import { Eyebrow, Reveal } from "./Reveal";

export function Neighbourhoods() {
  const [active, setActive] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((i) => (i + 1) % AREAS.length), 2200);
    return () => clearInterval(t);
  }, [paused]);

  const area = AREAS[active];

  return (
    <section id="neighbourhoods" className="mx-auto max-w-[1320px] px-4 py-28 sm:px-8 sm:py-40" aria-label="Neighbourhoods">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <Eyebrow>Neighbourhoods</Eyebrow>
          <h2 className="max-w-[14ch] text-[40px] font-medium leading-[1.05] tracking-[-0.04em] sm:text-[56px]">
            Billboards own the highway. We&apos;ll take the side streets.
          </h2>
          <p className="mt-6 max-w-[46ch] text-[18px] leading-relaxed text-mute">
            Our screens go where people park, eat and walk — the café rows, co-op car parks and the blocks behind the main road. Book a neighbourhood, not a pole.
          </p>
          <div className="mt-10 h-[104px] sm:h-[92px]" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="flex flex-wrap items-baseline gap-x-4 gap-y-1"
              >
                <span className="w-full text-[13px] uppercase tracking-[0.14em] text-mute sm:w-auto">Now showing</span>
                <span className="text-[28px] font-medium tracking-[-0.03em]">{area.en}</span>
                <span lang="ar" dir="rtl" className="text-[24px]">
                  {area.ar}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        <ul
          className="flex flex-wrap content-start gap-x-2 gap-y-1 sm:gap-x-6 sm:gap-y-3"
          onMouseLeave={() => setPaused(false)}
          aria-label="Areas we cover"
        >
          {AREAS.map((a, i) => {
            const on = i === active;
            return (
              <li key={a.id}>
                <button
                  type="button"
                  onMouseEnter={() => {
                    setPaused(true);
                    setActive(i);
                  }}
                  onClick={() => {
                    setPaused(true);
                    setActive(i);
                  }}
                  onFocus={() => {
                    setPaused(true);
                    setActive(i);
                  }}
                  aria-pressed={on}
                  className={`frame px-3 py-2 text-[28px] font-medium tracking-[-0.035em] transition-colors duration-500 sm:text-[44px] ${
                    on ? "text-ink" : "text-[#c4c4c4] hover:text-ink"
                  }`}
                  style={
                    {
                      "--frame-size": on ? "16px" : "0px",
                      "--frame-weight": on ? "3px" : "0px",
                    } as React.CSSProperties
                  }
                >
                  {a.en}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
