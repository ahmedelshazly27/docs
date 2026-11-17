"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { VehicleIcon } from "@/components/led/Vehicles";
import { AREAS, DAYPARTS, DAYS, ROUTES, VEHICLES, type VehicleId } from "@/lib/data";
import { daysInRange, emptySchedule, estimate, isoDate, kwd, saveCampaign, type Campaign, type Day } from "@/lib/campaign";

const STEPS = ["Basics", "Screens", "Where", "When", "Creative", "Review"] as const;
const OBJECTIVES = ["Brand awareness", "Product launch", "Drive footfall", "Event or opening"];
const MAX: Record<VehicleId, number> = { truck: 20, bike: 300, car: 100 };
const STEP_SIZE: Record<VehicleId, number> = { truck: 1, bike: 10, car: 5 };

const PRESETS: { label: string; apply: () => Record<Day, string[]> }[] = [
  {
    label: "Weekend nights",
    apply: () => ({ ...emptySchedule(), Thu: ["evening", "late"], Fri: ["afternoon", "evening", "late"], Sat: ["evening"] }),
  },
  {
    label: "Weekday commute",
    apply: () => {
      const s = emptySchedule();
      (["Sun", "Mon", "Tue", "Wed", "Thu"] as Day[]).forEach((d) => (s[d] = ["morning", "afternoon"]));
      return s;
    },
  },
  {
    label: "Every evening",
    apply: () => {
      const s = emptySchedule();
      DAYS.forEach((d) => (s[d] = ["evening"]));
      return s;
    },
  },
];

function newDraft(): Campaign {
  const start = new Date();
  start.setDate(start.getDate() + 14);
  const end = new Date(start);
  end.setDate(end.getDate() + 13);
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "draft",
    synced: false,
    name: "",
    objective: OBJECTIVES[0],
    contactEmail: "",
    vehicles: { truck: 0, bike: 0, car: 0 },
    areas: [],
    routes: [],
    startDate: isoDate(start),
    endDate: isoDate(end),
    schedule: PRESETS[0].apply(),
    staticOnly: true,
    creativeName: null,
    notes: "",
  };
}

export default function NewCampaign() {
  const router = useRouter();
  const [c, setC] = useState<Campaign | null>(null);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [preview, setPreview] = useState<{ url: string; type: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setC(newDraft()), []);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview.url); }, [preview]);

  const est = useMemo(() => (c ? estimate(c) : null), [c]);
  if (!c || !est) return null;

  const set = <K extends keyof Campaign>(k: K, v: Campaign[K]) => setC({ ...c, [k]: v });
  const toggle = (k: "areas" | "routes", id: string) =>
    set(k, c[k].includes(id) ? c[k].filter((x) => x !== id) : [...c[k], id]);
  const toggleSlot = (d: Day, p: string) =>
    set("schedule", { ...c.schedule, [d]: c.schedule[d].includes(p) ? c.schedule[d].filter((x) => x !== p) : [...c.schedule[d], p] });

  const screens = c.vehicles.truck + c.vehicles.bike + c.vehicles.car;
  const problems: Record<number, string | null> = {
    0: !c.name.trim() ? "Give the campaign a name." : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.contactEmail) ? "Add a valid contact email." : null,
    1: screens === 0 ? "Pick at least one screen." : null,
    2: c.areas.length + c.routes.length === 0 ? "Pick at least one area or route." : null,
    3: c.endDate < c.startDate ? "End date is before start date." : est.slots === 0 ? "Pick at least one day and time." : null,
    4: null,
    5: null,
  };

  const go = (to: number) => {
    if (to > step && problems[step]) {
      setError(problems[step]!);
      return;
    }
    setError("");
    setDir(to > step ? 1 : -1);
    setStep(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  async function submit() {
    if (!c) return;
    const firstProblem = Object.entries(problems).find(([, p]) => p);
    if (firstProblem) {
      setError(firstProblem[1]!);
      setStep(Number(firstProblem[0]));
      return;
    }
    setSending(true);
    setError("");
    let synced = false;
    try {
      const res = await fetch("/api/campaigns", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c) });
      synced = res.ok;
      if (!res.ok && res.status !== 503) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not send the campaign.");
      }
    } catch (e) {
      setSending(false);
      setError(e instanceof Error ? e.message : "Could not send the campaign.");
      return;
    }
    saveCampaign({ ...c, status: synced ? "submitted" : "draft", synced });
    router.push(`/dashboard/campaigns/${c.id}`);
  }

  return (
    <div className="mx-auto grid max-w-[1180px] gap-8 xl:grid-cols-[1fr_340px]">
      <div className="min-w-0">
        <p className="text-[13px] uppercase tracking-[0.14em] text-mute">New campaign</p>
        <h1 className="mt-2 text-[36px] font-medium tracking-[-0.04em]">{c.name || "Untitled campaign"}</h1>

        <ol className="mt-8 flex gap-1 overflow-x-auto" aria-label="Steps">
          {STEPS.map((s, i) => (
            <li key={s} className="flex-1">
              <button
                type="button"
                onClick={() => (i < step ? go(i) : i === step + 1 ? go(i) : undefined)}
                aria-current={i === step ? "step" : undefined}
                className="w-full min-w-[84px] text-left"
              >
                <span className={`block h-[3px] transition-colors duration-500 ${i <= step ? "bg-ink" : "bg-line"}`} />
                <span className={`mt-2 block text-[13px] ${i === step ? "font-medium text-ink" : "text-mute"}`}>
                  {String(i + 1).padStart(2, "0")} {s}
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div className="relative mt-8 [perspective:1200px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.section
              key={step}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40, rotateY: dir * -6 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: dir * -40, rotateY: dir * 6 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="bg-paper p-6 sm:p-8"
              aria-label={STEPS[step]}
            >
              {step === 0 && (
                <div className="grid gap-6">
                  <Label text="Campaign name">
                    <input value={c.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Summer menu launch" className="input" />
                  </Label>
                  <Label text="Contact email">
                    <input type="email" value={c.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} placeholder="you@brand.com" className="input" autoComplete="email" />
                  </Label>
                  <fieldset>
                    <legend className="mb-3 text-[14px] text-mute">Objective</legend>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {OBJECTIVES.map((o) => (
                        <Chip key={o} on={c.objective === o} onClick={() => set("objective", o)} role="radio">
                          {o}
                        </Chip>
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-4">
                  {VEHICLES.map((v) => {
                    const n = c.vehicles[v.id];
                    const change = (d: number) => set("vehicles", { ...c.vehicles, [v.id]: Math.max(0, Math.min(MAX[v.id], n + d)) });
                    return (
                      <div key={v.id} className={`frame grid grid-cols-[96px_1fr] gap-5 border p-4 transition-colors sm:grid-cols-[120px_1fr_auto] sm:items-center ${n > 0 ? "border-ink" : "border-line"}`} style={{ "--frame-size": n > 0 ? "14px" : "0px", "--frame-weight": "3px" } as React.CSSProperties}>
                        <div className="flex aspect-square items-center justify-center bg-ink p-3 text-paper">
                          <VehicleIcon kind={v.id} className="w-full" />
                        </div>
                        <div>
                          <div className="text-[18px] font-medium tracking-[-0.02em]">{v.name}</div>
                          <div className="mt-1 text-[14px] text-mute">{v.screen}</div>
                          <div className="mt-1 text-[13px] text-mute">Best for: {v.bestFor}</div>
                        </div>
                        <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
                          <button type="button" onClick={() => change(-STEP_SIZE[v.id])} className="h-11 w-11 border border-line text-[20px] hover:border-ink" aria-label={`Fewer ${v.name}`}>
                            −
                          </button>
                          <input
                            type="number"
                            min={0}
                            max={MAX[v.id]}
                            value={n}
                            onChange={(e) => set("vehicles", { ...c.vehicles, [v.id]: Math.max(0, Math.min(MAX[v.id], Number(e.target.value) || 0)) })}
                            className="h-11 w-20 border border-line text-center text-[16px] outline-none focus:border-ink"
                            aria-label={`Number of ${v.name}`}
                          />
                          <button type="button" onClick={() => change(STEP_SIZE[v.id])} className="h-11 w-11 border border-line text-[20px] hover:border-ink" aria-label={`More ${v.name}`}>
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-8">
                  <fieldset>
                    <legend className="mb-3 text-[14px] text-mute">Neighbourhoods</legend>
                    <div className="flex flex-wrap gap-2">
                      {AREAS.map((a) => (
                        <Chip key={a.id} on={c.areas.includes(a.id)} onClick={() => toggle("areas", a.id)}>
                          {a.en} <span lang="ar" className="ml-1 opacity-60">{a.ar}</span>
                        </Chip>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend className="mb-3 text-[14px] text-mute">Roads and circuits</legend>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {ROUTES.map((r) => (
                        <Chip key={r.id} on={c.routes.includes(r.id)} onClick={() => toggle("routes", r.id)}>
                          <span className="block font-medium">{r.name}</span>
                          <span className="block text-[13px] opacity-70">{r.note}</span>
                        </Chip>
                      ))}
                    </div>
                  </fieldset>
                  {c.vehicles.bike > 0 && (
                    <p className="border-l-2 border-ink bg-soft px-4 py-3 text-[14px]">Delivery bikes go where orders go — we steer bike screens toward your areas but can&apos;t fix their exact route. Motorbikes don&apos;t use ring roads.</p>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-8">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Label text="Start date">
                      <input type="date" value={c.startDate} min={isoDate(new Date())} onChange={(e) => set("startDate", e.target.value)} className="input" />
                    </Label>
                    <Label text="End date">
                      <input type="date" value={c.endDate} min={c.startDate} onChange={(e) => set("endDate", e.target.value)} className="input" />
                    </Label>
                  </div>
                  <div>
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-[14px] text-mute">Weekly schedule · tap to book a daypart</span>
                      <div className="flex flex-wrap gap-2">
                        {PRESETS.map((p) => (
                          <button key={p.label} type="button" onClick={() => set("schedule", p.apply())} className="min-h-[36px] border border-line px-3 text-[13px] hover:border-ink">
                            {p.label}
                          </button>
                        ))}
                        <button type="button" onClick={() => set("schedule", emptySchedule())} className="min-h-[36px] px-3 text-[13px] text-mute underline underline-offset-4">
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[560px] border-separate border-spacing-1 text-[13px]">
                        <thead>
                          <tr>
                            <th className="w-16" />
                            {DAYPARTS.map((p) => (
                              <th key={p.id} className="pb-1 text-left font-normal text-mute">
                                <span className="block text-ink">{p.label}</span>
                                {p.hours}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {DAYS.map((d) => (
                            <tr key={d}>
                              <th className="text-left font-medium">{d}</th>
                              {DAYPARTS.map((p) => {
                                const on = c.schedule[d].includes(p.id);
                                return (
                                  <td key={p.id}>
                                    <button
                                      type="button"
                                      onClick={() => toggleSlot(d, p.id)}
                                      aria-pressed={on}
                                      aria-label={`${d} ${p.label}`}
                                      className={`h-11 w-full transition-colors duration-200 ${on ? "bg-ink" : "bg-soft hover:bg-line"}`}
                                    />
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-3 text-[13px] text-mute">
                      {daysInRange(c)} days · {est.slots} dayparts booked across the run
                    </p>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="grid gap-6">
                  <label className="frame flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-line p-6 text-center hover:border-ink" style={{ "--frame-size": "18px", "--frame-weight": "3px" } as React.CSSProperties}>
                    {preview ? (
                      preview.type.startsWith("video") ? (
                        <video src={preview.url} className="max-h-[260px]" muted autoPlay loop playsInline />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={preview.url} alt="Your creative preview" className="max-h-[260px] object-contain" />
                      )
                    ) : (
                      <>
                        <span className="text-[17px] font-medium">Upload your creative</span>
                        <span className="text-[14px] text-mute">JPG, PNG or MP4. You can also send it later.</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,video/mp4"
                      className="sr-only"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        setPreview({ url: URL.createObjectURL(f), type: f.type });
                        set("creativeName", f.name);
                      }}
                    />
                  </label>
                  {c.creativeName && <p className="text-[14px] text-mute">Selected: {c.creativeName} · the file stays on your device until our team requests it.</p>}

                  {preview && (
                    <div>
                      <p className="mb-3 text-[14px] text-mute">How it sits on your screens</p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {VEHICLES.filter((v) => c.vehicles[v.id] > 0).map((v) => (
                          <div key={v.id} className="bg-ink p-3">
                            <div className={`relative overflow-hidden bg-[#2b2b2b] ${v.id === "truck" ? "aspect-[2/1]" : v.id === "bike" ? "aspect-[5/4]" : "aspect-[4/1]"}`}>
                              {preview.type.startsWith("video") ? (
                                <video src={preview.url} className="h-full w-full object-cover" muted autoPlay loop playsInline />
                              ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={preview.url} alt="" className="h-full w-full object-cover" />
                              )}
                            </div>
                            <div className="mt-2 text-[12px] text-paper/70">{v.short}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <label className="flex items-start gap-3 text-[15px]">
                    <input type="checkbox" checked={c.staticOnly} onChange={(e) => set("staticOnly", e.target.checked)} className="mt-1 h-5 w-5 accent-[#111]" />
                    <span>
                      Show still images while vehicles are moving
                      <span className="block text-[13px] text-mute">Recommended. Kuwait&apos;s rules may limit moving content on vehicles; video plays only when parked.</span>
                    </span>
                  </label>
                  <Label text="Notes for our team (optional)">
                    <textarea rows={3} value={c.notes} onChange={(e) => set("notes", e.target.value)} className="input resize-none py-3" />
                  </Label>
                </div>
              )}

              {step === 5 && (
                <dl className="grid gap-0 divide-y divide-line text-[15px]">
                  {[
                    ["Campaign", `${c.name} · ${c.objective}`],
                    ["Contact", c.contactEmail],
                    ["Screens", VEHICLES.filter((v) => c.vehicles[v.id] > 0).map((v) => `${c.vehicles[v.id]} × ${v.name}`).join(", ")],
                    ["Areas", c.areas.map((id) => AREAS.find((a) => a.id === id)?.en).join(", ") || "—"],
                    ["Roads", c.routes.map((id) => ROUTES.find((r) => r.id === id)?.name).join(", ") || "—"],
                    ["Dates", `${c.startDate} → ${c.endDate} (${daysInRange(c)} days)`],
                    ["Schedule", DAYS.filter((d) => c.schedule[d].length).map((d) => `${d}: ${c.schedule[d].length}`).join(" · ")],
                    ["Creative", c.creativeName ?? "Send later"],
                    ["Moving content", c.staticOnly ? "Still images while moving" : "Video allowed (subject to approval)"],
                  ].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[120px_1fr] gap-4 py-3">
                      <dt className="text-mute">{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </motion.section>
          </AnimatePresence>
        </div>

        {error && (
          <p className="mt-4 text-[15px] text-[#b42318]" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between gap-4">
          <button type="button" onClick={() => go(step - 1)} disabled={step === 0} className="min-h-[48px] px-4 text-[15px] text-mute disabled:opacity-0">
            ← Back
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={() => go(step + 1)} className="min-h-[52px] bg-ink px-6 text-[15px] font-medium text-paper">
              Continue: {STEPS[step + 1]}
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={sending} className="min-h-[52px] bg-ink px-6 text-[15px] font-medium text-paper disabled:opacity-60">
              {sending ? "Sending…" : "Send for review"}
            </button>
          )}
        </div>
      </div>

      <aside className="xl:sticky xl:top-8 xl:self-start" aria-label="Estimate">
        <div className="frame bg-ink p-6 text-paper" style={{ "--frame-size": "18px", "--frame-weight": "3px" } as React.CSSProperties}>
          <p className="text-[13px] uppercase tracking-[0.14em] text-paper/60">Estimate</p>
          <motion.p key={est.total} initial={{ opacity: 0.4, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-[40px] font-medium tracking-[-0.04em]">
            {kwd(est.total)}
          </motion.p>
          <ul className="mt-4 grid gap-2 text-[14px] text-paper/80">
            {est.lines.length === 0 && <li>Add screens to see a price.</li>}
            {est.lines.map((l) => (
              <li key={l.vehicle} className="flex justify-between gap-4">
                <span>
                  {l.qty} × {VEHICLES.find((v) => v.id === l.vehicle)?.short} · {l.slots} dayparts
                </span>
                <span>{kwd(l.total)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-paper/15 pt-4 text-[13px] text-paper/70">
            <div>
              <div className="text-[20px] font-medium text-paper">{screens}</div>
              screens
            </div>
            <div>
              <div className="text-[20px] font-medium text-paper">{c.areas.length + c.routes.length}</div>
              areas &amp; roads
            </div>
          </div>
          <p className="mt-5 text-[12px] leading-relaxed text-paper/50">Indicative only, using placeholder rates. Final pricing is confirmed by our team after review.</p>
        </div>
      </aside>
    </div>
  );
}

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-[14px] text-mute">
      {text}
      {children}
    </label>
  );
}

function Chip({ on, onClick, children, role }: { on: boolean; onClick: () => void; children: React.ReactNode; role?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      role={role}
      aria-pressed={role ? undefined : on}
      aria-checked={role ? on : undefined}
      className={`min-h-[44px] border px-4 py-2 text-left text-[15px] transition-colors ${on ? "border-ink bg-ink text-paper" : "border-line bg-paper hover:border-ink"}`}
    >
      {children}
    </button>
  );
}
