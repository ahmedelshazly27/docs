"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Vehicle } from "@/components/led/Vehicles";

const LINES = ["Not the highway.", "The street outside the café.", "مو بس على الطريق السريع", "side street"];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // The screen starts filling the view, then pulls back as the truck draws itself around it.
  const scale = useTransform(scrollYProgress, [0, 0.55], reduce ? [1, 1] : [1.7, 1]);
  const draw = useTransform(scrollYProgress, [0.2, 0.7], reduce ? [1, 1] : [0, 1]);
  const lineOpacity = useTransform(scrollYProgress, [0.2, 0.24], reduce ? [1, 1] : [0, 1]);
  const captionOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const introOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section ref={ref} className="relative h-[260vh] bg-ink" aria-label="Introduction">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-4">
        <motion.p style={{ opacity: introOpacity }} className="absolute top-24 text-center text-[13px] uppercase tracking-[0.14em] text-paper/60">
          Moving screens across Kuwait · <span lang="ar">شاشات متنقّلة في الكويت</span>
        </motion.p>

        <motion.div style={{ scale }} className="w-full max-w-[880px] origin-[37%_44%] will-change-transform">
          <Vehicle kind="truck" messages={LINES} draw={draw} lineOpacity={lineOpacity} label="A side street truck screen: Not the highway. The street outside the café." />
        </motion.div>

        <motion.div style={{ opacity: captionOpacity }} className="absolute bottom-14 flex flex-wrap items-center justify-center gap-4 px-4 text-paper">
          <p className="text-[18px] text-paper/70">LED trucks, delivery-bike boxes and car tops, booked by area and hour.</p>
          <Link href="#waitlist" className="bg-paper px-5 py-3 text-[15px] font-medium text-ink">
            Join the waiting list
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
