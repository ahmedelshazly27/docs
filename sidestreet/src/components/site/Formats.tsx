import { Vehicle } from "@/components/led/Vehicles";
import { Reveal } from "./Reveal";

const FORMATS = [
  { kind: "truck" as const, name: "LED trucks", note: "Full-side screens for launches and events.", ads: ["Marfa Bank", "سافر أبعد"] },
  { kind: "bike" as const, name: "Delivery-bike boxes", note: "Neighbourhood reach, order by order.", ads: ["Qamra", "صيف قمرة"] },
  { kind: "car" as const, name: "Car & taxi tops", note: "Frequency across malls and car parks.", ads: ["Fanar Chalets · Khairan · book tonight"] },
];

export function Formats() {
  return (
    <section id="formats" className="bg-ink py-28 text-paper sm:py-36" aria-label="Formats">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <Reveal>
          <p className="mb-5 text-[13px] font-medium uppercase tracking-[0.14em] text-paper/60">Formats</p>
          <h2 className="max-w-[18ch] text-[40px] font-medium leading-[1.05] tracking-[-0.04em] sm:text-[56px]">Three screens. One street-level network.</h2>
        </Reveal>
        <div className="mt-20 grid items-end gap-x-10 gap-y-16 md:grid-cols-3">
          {FORMATS.map((f, i) => (
            <Reveal key={f.kind} delay={i * 0.08}>
              <div className="flex h-[220px] items-end">
                <Vehicle kind={f.kind} messages={f.ads} marquee={f.kind === "car"} className={f.kind === "bike" ? "w-[62%]" : "w-full"} />
              </div>
              <div className="mt-8 border-t border-paper/15 pt-5">
                <h3 className="text-[22px] font-medium tracking-[-0.02em]">{f.name}</h3>
                <p className="mt-1 text-[15px] text-paper/60">{f.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-12 text-[12px] text-paper/40">Brands shown are demo creatives.</p>
      </div>
    </section>
  );
}
