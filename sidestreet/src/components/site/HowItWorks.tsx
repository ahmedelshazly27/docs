import { Eyebrow, Reveal } from "./Reveal";

const STEPS = [
  { n: "01", title: "Pick your screens", body: "Trucks for impact, bike boxes for neighbourhood reach, car tops for frequency — or a mix." },
  { n: "02", title: "Pick the streets and hours", body: "Areas, ring roads or mall circuits, on the days and dayparts your customers are out." },
  { n: "03", title: "Upload your creative", body: "We check it against Kuwait's ad rules and the screen specs before anything goes live." },
  { n: "04", title: "Get the play report", body: "Every play logged with time and street." },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-[1320px] px-4 py-28 sm:px-8 sm:py-36" aria-label="How it works">
      <Reveal>
        <Eyebrow>How it works</Eyebrow>
        <h2 className="max-w-[16ch] text-[40px] font-medium leading-[1.05] tracking-[-0.04em] sm:text-[56px]">Book a street the way you&apos;d plan a drive.</h2>
      </Reveal>
      <ol className="mt-16 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.06} className="bg-paper">
            <li className="h-full p-6 sm:p-8">
              <span className="font-mono text-[14px] text-mute">{s.n}</span>
              <h3 className="mt-6 text-[22px] font-medium tracking-[-0.02em]">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-mute">{s.body}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
