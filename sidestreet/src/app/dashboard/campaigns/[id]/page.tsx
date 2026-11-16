"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { AREAS, DAYPARTS, DAYS, ROUTES, VEHICLES } from "@/lib/data";
import { daysInRange, deleteCampaign, estimate, kwd, loadCampaigns, type Campaign } from "@/lib/campaign";

const TIMELINE = ["Submitted", "Creative review", "Approved", "Live", "Play report"];

export default function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [c, setC] = useState<Campaign | null | undefined>(undefined);
  useEffect(() => setC(loadCampaigns().find((x) => x.id === id) ?? null), [id]);

  if (c === undefined) return null;
  if (c === null)
    return (
      <div className="mx-auto max-w-[900px]">
        <h1 className="text-[28px] font-medium">Campaign not found</h1>
        <p className="mt-2 text-mute">Campaigns are saved in this browser during early access.</p>
        <Link href="/dashboard" className="mt-6 inline-block underline underline-offset-4">Back to overview</Link>
      </div>
    );

  const est = estimate(c);
  const stage = c.synced ? 0 : -1;

  return (
    <div className="mx-auto max-w-[1000px]">
      <Link href="/dashboard" className="text-[14px] text-mute hover:text-ink">← All campaigns</Link>
      <header className="mt-4 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-[36px] font-medium tracking-[-0.04em]">{c.name}</h1>
          <p className="mt-1 text-mute">
            {c.objective} · {c.startDate} → {c.endDate} · {daysInRange(c)} days
          </p>
        </div>
        <div className="text-right">
          <div className="text-[13px] text-mute">Estimate</div>
          <div className="text-[28px] font-medium tracking-[-0.03em]">{kwd(est.total)}</div>
        </div>
      </header>

      {!c.synced && (
        <p className="mt-6 border-l-2 border-ink bg-paper px-5 py-4 text-[15px]">
          Saved on this device. Sending campaigns to our team opens at launch — you&apos;ll be able to send this one with a single click.
        </p>
      )}

      <ol className="mt-10 grid grid-cols-5 gap-1" aria-label="Status">
        {TIMELINE.map((t, i) => (
          <li key={t}>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`block h-[3px] origin-left ${i <= stage ? "bg-ink" : "bg-line"}`}
            />
            <span className={`mt-2 block text-[12px] sm:text-[13px] ${i === stage ? "font-medium" : "text-mute"}`}>{t}</span>
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <section className="bg-paper p-6" aria-label="Screens and places">
          <h2 className="text-[17px] font-medium">Screens</h2>
          <ul className="mt-3 grid gap-1 text-[15px]">
            {VEHICLES.filter((v) => c.vehicles[v.id] > 0).map((v) => (
              <li key={v.id}>
                {c.vehicles[v.id]} × {v.name}
              </li>
            ))}
          </ul>
          <h2 className="mt-6 text-[17px] font-medium">Where</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {c.areas.map((id) => (
              <span key={id} className="border border-line px-3 py-1.5 text-[14px]">
                {AREAS.find((a) => a.id === id)?.en}
              </span>
            ))}
            {c.routes.map((id) => (
              <span key={id} className="border border-ink px-3 py-1.5 text-[14px]">
                {ROUTES.find((r) => r.id === id)?.name}
              </span>
            ))}
          </div>
        </section>

        <section className="bg-paper p-6" aria-label="Schedule">
          <h2 className="text-[17px] font-medium">Weekly schedule</h2>
          <div className="mt-4 grid grid-cols-[40px_repeat(5,1fr)] gap-1 text-[12px]">
            <span />
            {DAYPARTS.map((p) => (
              <span key={p.id} className="truncate text-mute">
                {p.label}
              </span>
            ))}
            {DAYS.map((d) => (
              <div key={d} className="contents">
                <span className="font-medium">{d}</span>
                {DAYPARTS.map((p) => (
                  <span key={p.id} className={`h-6 ${c.schedule[d].includes(p.id) ? "bg-ink" : "bg-soft"}`} />
                ))}
              </div>
            ))}
          </div>
          <p className="mt-4 text-[13px] text-mute">{est.slots} dayparts · {c.staticOnly ? "still images while moving" : "video allowed when approved"}</p>
        </section>
      </div>

      <section className="frame mt-4 bg-paper p-6" style={{ "--frame-size": "18px", "--frame-weight": "3px" } as React.CSSProperties} aria-label="Play report">
        <h2 className="text-[17px] font-medium">Play report</h2>
        <p className="mt-2 max-w-[60ch] text-[15px] text-mute">Once your campaign is live, every play appears here with time, street and vehicle — and a map of where your brand went.</p>
      </section>

      <button
        type="button"
        onClick={() => {
          deleteCampaign(c.id);
          router.push("/dashboard");
        }}
        className="mt-8 min-h-[44px] text-[14px] text-mute underline underline-offset-4 hover:text-ink"
      >
        Delete this campaign
      </button>
    </div>
  );
}
