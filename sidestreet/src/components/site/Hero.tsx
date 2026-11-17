"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { MEDIA } from "@/lib/media";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // As you scroll, the full-bleed scene tilts back in 3D and shrinks into a framed screen.
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.72]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 14]);
  const radius = useTransform(scrollYProgress, [0, 1], [0, 18]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-40%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative h-[180vh] bg-ink" aria-label="Introduction">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden [perspective:1400px]">
        <motion.div
          style={{ scale, rotateX, borderRadius: radius }}
          className="absolute inset-0 origin-center overflow-hidden will-change-transform"
        >
          {MEDIA.heroVideo ? (
            <video
              className="h-full w-full object-cover"
              src={MEDIA.heroVideo}
              poster={MEDIA.heroPoster}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <Image src={MEDIA.heroPoster} alt="A side street LED truck ahead on the Fifth Ring Road at night" fill priority sizes="100vw" className="object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/10 to-ink/70" />
        </motion.div>

        <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-10 mx-auto w-full max-w-[1320px] px-4 text-paper sm:px-8">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
            className="mb-6 text-sm uppercase tracking-[0.14em] text-paper/80"
          >
            Moving screens across Kuwait · <span lang="ar">شاشات متنقّلة في الكويت</span>
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease }}
            className="frame w-fit max-w-[15ch] px-5 py-4 text-[44px] font-medium leading-[1.02] tracking-[-0.045em] sm:px-8 sm:py-6 sm:text-[72px] lg:text-[96px]"
            style={{ "--frame-size": "28px", "--frame-weight": "4px" } as React.CSSProperties}
          >
            Not the highway. The street outside the café.
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link href="#waitlist" className="bg-paper px-6 py-4 text-[16px] font-medium text-ink transition-transform hover:-translate-y-0.5">
              Join the waiting list
            </Link>
            <Link href="/dashboard" className="frame frame-grow px-6 py-4 text-[16px] font-medium" style={{ "--frame-size": "12px", "--frame-weight": "2px" } as React.CSSProperties}>
              Preview the campaign builder
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
