"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AREAS, RATE_PER_DAYPART, VEHICLES, type VehicleId } from "@/lib/data";
import { MEDIA } from "@/lib/media";
import { kwd } from "@/lib/campaign";
import { Eyebrow, Reveal } from "./Reveal";

const PHOTO: Record<VehicleId, string> = { truck: MEDIA.gulf, bike: MEDIA.bike, car: MEDIA.car };
const QTY: Record<VehicleId, number[]> = { truck: [1, 2, 4], bike: [10, 25, 50], car: [5, 10, 20] };
const PICKS = AREAS.slice(0, 8);

export function MiniPlanner() {
  const [vehicle, setVehicle] = useState<VehicleId>("truck");
  const [qtyIdx, setQtyIdx] = useState(1);
  const [areas, setAreas] = useState<string[]>(["salmiya", "hawalli"]);
  const [evenings, setEvenings] = useState(8); // evenings per month

  const qty = QTY[vehicle][qtyIdx];
  const total = useMemo(() => qty * evenings * RATE_PER_DAYPART[vehicle], [qty, evenings, vehicle]);
  const v = VEHICLES.find((x) => x.id === vehicle)!;

  return (
    <section className="mx-auto max-w-[1320px] px-4 py-28 sm:px-8 sm:py-40" aria-label="Plan a campaign">
      <Reveal>
        <Eyebrow>Try it</Eyebrow>
        <h2 className="max-w-[18ch] text-[40px] font-medium leading-[1.05] tracking-[-0.04em] sm:text-[56px]">Plan a month in thirty seconds.</h2>
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="grid content-start gap-8 bg-soft p-6 sm:p-8">
          <fieldset>
            <legend className="mb-3 text-[14px] text-mute">Screen</legend>
            <div className="relative grid grid-cols-3 bg-paper p-1" role="radiogroup">
              {VEHICLES.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  role="radio"
                  aria-checked={vehicle === x.id}
                  onClick={() => {
                    setVehicle(x.id);
                    setQtyIdx(1);
                  }}
                  className={`relative z-10 min-h-[44px] text-[15px] font-medium transition-colors ${vehicle === x.id ? "text-paper" : "text-ink"}`}
                >
                  {vehicle === x.id && (
                    <motion.span layoutId="seg" className="absolute inset-0 -z-10 bg-ink" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
                  )}
                  {x.short}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-[14px] text-mute">How many</legend>
            <div className="flex gap-2">
              {QTY[vehicle].map((q, i) => (
                <button
                  key={q}
                  type="button"
                  aria-pressed={qtyIdx === i}
                  onClick={() => setQtyIdx(i)}
                  className={`min-h-[44px] min-w-[64px] border px-4 text-[15px] transition-colors ${qtyIdx === i ? "border-ink bg-ink text-paper" : "border-line bg-paper hover:border-ink"}`}
                >
                  {q}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-[14px] text-mute">Where</legend>
            <div className="flex flex-wrap gap-2">
              {PICKS.map((a) => {
                const on = areas.includes(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setAreas((xs) => (on ? xs.filter((x) => x !== a.id) : [...xs, a.id]))}
                    className={`frame min-h-[40px] px-3 text-[14px] transition-colors ${on ? "bg-paper text-ink" : "text-mute hover:text-ink"}`}
                    style={{ "--frame-size": on ? "9px" : "0px", "--frame-weight": on ? "2px" : "0px" } as React.CSSProperties}
                  >
                    {a.en}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="grid gap-3">
            <span className="flex justify-between text-[14px] text-mute">
              <span>Evenings per month</span>
              <span className="font-medium text-ink">{evenings}</span>
            </span>
            <input type="range" min={2} max={30} value={evenings} onChange={(e) => setEvenings(Number(e.target.value))} className="w-full accent-[#111]" />
          </label>
        </div>

        <div className="relative overflow-hidden bg-ink text-paper">
          <div className="relative aspect-[16/10]">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={vehicle}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image src={PHOTO[vehicle]} alt={`${v.name} in Kuwait`} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="grid gap-5 p-6 sm:grid-cols-[1fr_auto] sm:items-end sm:p-8">
            <div>
              <p className="text-[13px] uppercase tracking-[0.14em] text-paper/60">Estimate · per month</p>
              <motion.p key={total} initial={{ y: 6, opacity: 0.5 }} animate={{ y: 0, opacity: 1 }} className="mt-2 text-[44px] font-medium tracking-[-0.04em]">
                {kwd(total)}
              </motion.p>
              <p className="mt-1 text-[14px] text-paper/60">
                {qty} × {v.name.toLowerCase()} · {areas.length || "no"} area{areas.length === 1 ? "" : "s"} · {evenings} evenings
              </p>
            </div>
            <Link href="/dashboard/new" className="bg-paper px-5 py-3.5 text-center text-[15px] font-medium text-ink transition-transform hover:-translate-y-0.5">
              Plan it properly →
            </Link>
          </div>
          <p className="px-6 pb-6 text-[12px] text-paper/40 sm:px-8">Indicative only, using placeholder rates.</p>
        </div>
      </div>
    </section>
  );
}
