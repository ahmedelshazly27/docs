"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { VEHICLES } from "@/lib/data";
import { countDayparts, estimate, kwd, loadCampaigns, type Campaign } from "@/lib/campaign";

const STATUS: Record<Campaign["status"], string> = {
  draft: "Draft",
  submitted: "Submitted",
  in_review: "In review",
  approved: "Approved",
  live: "Live",
  completed: "Completed",
};

export default function Overview() {
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
  useEffect(() => setCampaigns(loadCampaigns()), []);

  const screens = (campaigns ?? []).reduce((s, c) => s + c.vehicles.truck + c.vehicles.bike + c.vehicles.car, 0);
  const slots = (campaigns ?? []).reduce((s, c) => s + countDayparts(c), 0);

  return (
    <div className="mx-auto max-w-[1100px]">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[13px] uppercase tracking-[0.14em] text-mute">Overview</p>
          <h1 className="mt-2 text-[36px] font-medium tracking-[-0.04em]">Your campaigns</h1>
        </div>
        <Link href="/dashboard/new" className="frame frame-grow bg-ink px-5 py-3.5 text-[15px] font-medium text-paper" style={{ "--frame-size": "10px", "--frame-weight": "2px", "--frame-color": "#111" } as React.CSSProperties}>
          Plan a campaign
        </Link>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          ["Campaigns", String(campaigns?.length ?? 0)],
          ["Screens requested", String(screens)],
          ["Dayparts booked", String(slots)],
        ].map(([label, value]) => (
          <div key={label} className="bg-paper p-6">
            <div className="text-[14px] text-mute">{label}</div>
            <div className="mt-2 text-[32px] font-medium tracking-[-0.03em]">{value}</div>
          </div>
        ))}
      </div>

      {campaigns && campaigns.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="frame mt-10 bg-paper p-10 text-center" style={{ "--frame-size": "22px", "--frame-weight": "3px" } as React.CSSProperties}>
          <h2 className="text-[24px] font-medium tracking-[-0.03em]">No campaigns yet</h2>
          <p className="mx-auto mt-2 max-w-[44ch] text-mute">Pick your screens, the streets and the hours. You&apos;ll see an estimate before you send anything.</p>
          <Link href="/dashboard/new" className="mt-6 inline-block bg-ink px-5 py-3.5 text-[15px] font-medium text-paper">
            Plan your first campaign
          </Link>
        </motion.div>
      )}

      {campaigns && campaigns.length > 0 && (
        <ul className="mt-10 grid gap-3">
          {campaigns.map((c, i) => (
            <motion.li key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Link href={`/dashboard/campaigns/${c.id}`} className="frame frame-grow grid gap-4 bg-paper p-6 sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:items-center" style={{ "--frame-size": "0px", "--frame-weight": "2px" } as React.CSSProperties}>
                <div>
                  <div className="text-[18px] font-medium tracking-[-0.02em]">{c.name}</div>
                  <div className="mt-1 text-[14px] text-mute">
                    {c.startDate} → {c.endDate}
                  </div>
                </div>
                <div className="text-[14px] text-mute">
                  {VEHICLES.filter((v) => c.vehicles[v.id] > 0)
                    .map((v) => `${c.vehicles[v.id]} × ${v.short}`)
                    .join(" · ")}
                </div>
                <div className="text-[15px] font-medium">{kwd(estimate(c).total)}</div>
                <span className="justify-self-start border border-ink px-2.5 py-1 text-[13px] sm:justify-self-end">
                  {c.synced ? STATUS[c.status] : "Saved on this device"}
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
