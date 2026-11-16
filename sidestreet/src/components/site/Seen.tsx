"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { MEDIA } from "@/lib/media";
import { Eyebrow, Reveal } from "./Reveal";

export function Seen() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-4, 3]);
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["10%", "-10%"]);

  return (
    <section ref={ref} className="mx-auto max-w-[1320px] px-4 py-28 sm:px-8 sm:py-40" aria-label="Seen and shared">
      <div className="grid items-center gap-16 lg:grid-cols-[1fr_1fr]">
        <div className="[perspective:1200px]">
          <motion.div style={{ rotateY: rotate, y }} className="frame relative aspect-[4/5] will-change-transform" >
            <div className="absolute inset-[10px] overflow-hidden">
              <Image src={MEDIA.seen} alt="Two women on a Kuwait pavement filming a passing screen truck on a phone" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
          </motion.div>
        </div>
        <Reveal>
          <Eyebrow>Seen, then shared</Eyebrow>
          <h2 className="max-w-[14ch] text-[40px] font-medium leading-[1.05] tracking-[-0.04em] sm:text-[56px]">
            People film it. Your ad travels twice.
          </h2>
          <p className="mt-6 max-w-[46ch] text-[18px] leading-relaxed text-mute">
            A screen moving through a neighbourhood gets noticed — and filmed. Every campaign gets the street, then the stories people post about it.
          </p>
          <div className="mt-10 grid max-w-[460px] grid-cols-2 gap-6 border-t border-line pt-6">
            <div>
              <div className="text-[28px] font-medium tracking-[-0.03em]">Every play</div>
              <div className="mt-1 text-[14px] text-mute">logged with time and street</div>
            </div>
            <div>
              <div className="text-[28px] font-medium tracking-[-0.03em]" lang="ar">شافوك</div>
              <div className="mt-1 text-[14px] text-mute">and they told their friends</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
