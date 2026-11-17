"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { MEDIA } from "@/lib/media";

export function CityBand() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.2, 1]);
  const inset = useTransform(scrollYProgress, [0, 0.5], reduce ? ["0%", "0%"] : ["8%", "0%"]);

  return (
    <section ref={ref} className="relative h-[110vh] overflow-hidden bg-ink" aria-label="Kuwait roads">
      <motion.div style={{ left: inset, right: inset }} className="absolute inset-y-0">
        <motion.div style={{ scale }} className="absolute inset-0">
          <Image src={MEDIA.gulf} alt="A side street screen truck on Arabian Gulf Road at dusk" fill sizes="100vw" className="object-cover" />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
      <div className="relative z-10 mx-auto flex h-full max-w-[1320px] items-end px-4 pb-24 text-paper sm:px-8">
        <div
          className="frame px-6 py-5 text-[36px] font-medium leading-[1.05] tracking-[-0.04em] sm:text-[64px]"
          style={{ "--frame-size": "24px", "--frame-weight": "4px" } as React.CSSProperties}
        >
          From the First Ring
          <br />
          to the side street.
        </div>
      </div>
    </section>
  );
}
