"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Vehicle } from "@/components/led/Vehicles";

const LINES = ["Not the highway.", "The street outside the café.", "مو بس على الطريق السريع", "side street"];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // On a phone the truck is narrow, so a big zoom pushes the screen off the edges. Zoom less.
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const on = () => setPhone(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // The screen starts filling the view, then pulls back as the truck draws itself around it.
  const scale = useTransform(scrollYProgress, [0, 0.55], reduce ? [1, 1] : phone ? [1.3, 1] : [1.7, 1]);
  // Slide the screen to the centre while zoomed, back into place as the truck appears.
  const x = useTransform(scrollYProgress, [0, 0.55], reduce ? ["0%", "0%"] : phone ? ["15%", "0%"] : ["13%", "0%"]);
  const draw = useTransform(scrollYProgress, [0.2, 0.7], reduce ? [1, 1] : [0, 1]);
  const lineOpacity = useTransform(scrollYProgress, [0.2, 0.24], reduce ? [1, 1] : [0, 1]);
  const captionOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const introOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section ref={ref} className="relative h-[260vh] bg-ink" aria-label="Introduction">
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden px-3 sm:px-4">
        <motion.p style={{ opacity: introOpacity }} className="absolute top-24 flex flex-col items-center gap-1 px-6 text-center text-[12px] uppercase tracking-[0.14em] text-paper/60 sm:flex-row sm:gap-2 sm:text-[13px]">
          <span>Moving screens across Kuwait</span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <span lang="ar" className="normal-case tracking-normal">شاشات متنقّلة في الكويت</span>
        </motion.p>

        <motion.div style={{ scale, x }} className="w-full max-w-[880px] origin-[37%_44%] will-change-transform">
          <Vehicle kind="truck" messages={LINES} draw={draw} lineOpacity={lineOpacity} label="A side street truck screen: Not the highway. The street outside the café." />
        </motion.div>

        <motion.div style={{ opacity: captionOpacity }} className="absolute bottom-10 flex flex-col items-center justify-center gap-4 px-6 text-center text-paper sm:bottom-14 sm:flex-row sm:flex-wrap sm:px-4">
          <p className="max-w-[30ch] text-[16px] leading-snug text-paper/70 sm:max-w-none sm:text-[18px]">LED trucks, delivery-bike boxes and car tops, booked by area and hour.</p>
          <Link href="#waitlist" className="flex min-h-[48px] w-full max-w-[320px] items-center justify-center bg-paper px-5 text-[15px] font-medium text-ink sm:w-auto">
            Join the waiting list
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
