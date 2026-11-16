"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { MEDIA } from "@/lib/media";
import { Eyebrow, Reveal } from "./Reveal";

const STEPS = [
  { n: "01", title: "Pick your screens", body: "Trucks for impact, bike boxes for neighbourhood reach, car tops for frequency — or a mix." },
  { n: "02", title: "Pick the streets and hours", body: "Choose areas, ring roads or mall circuits, then the days and dayparts your customers are out." },
  { n: "03", title: "Upload your creative", body: "We check it against Kuwait's ad rules and the screen specs before anything goes live." },
  { n: "04", title: "Get the play report", body: "Every play logged with time and street. You see where your brand actually went." },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-12%", "12%"]);

  return (
    <section id="how" className="mx-auto max-w-[1320px] px-4 py-28 sm:px-8 sm:py-40" aria-label="How it works">
      <div className="grid items-start gap-16 lg:grid-cols-2">
        <div>
          <Reveal>
            <Eyebrow>How it works</Eyebrow>
            <h2 className="max-w-[16ch] text-[40px] font-medium leading-[1.05] tracking-[-0.04em] sm:text-[56px]">
              Book a street the way you&apos;d plan a drive.
            </h2>
          </Reveal>
          <ol className="mt-14 divide-y divide-line border-y border-line">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.06}>
                <li className="grid grid-cols-[56px_1fr] gap-4 py-7">
                  <span className="font-mono text-[14px] text-mute">{s.n}</span>
                  <div>
                    <h3 className="text-[22px] font-medium tracking-[-0.02em]">{s.title}</h3>
                    <p className="mt-2 max-w-[48ch] text-[16px] leading-relaxed text-mute">{s.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        <div ref={ref} className="relative aspect-[4/5] overflow-hidden lg:sticky lg:top-24">
          <motion.div style={{ y }} className="absolute -inset-y-[12%] inset-x-0">
            <Image src={MEDIA.bikes} alt="Delivery riders with lit screen boxes waiting at a red light in Hawalli" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </motion.div>
          <div className="absolute bottom-6 left-6 right-6 bg-paper/95 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[13px] text-mute">
              <span>Play report · sample</span>
              <span className="font-mono">Thu · 19:00–23:00</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-4">
              {[
                ["Hawalli", "Area"],
                ["[ plays ]", "Logged plays"],
                ["[ km ]", "Distance on air"],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="text-[20px] font-medium tracking-[-0.02em]">{v}</div>
                  <div className="text-[12px] text-mute">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
