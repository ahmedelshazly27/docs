"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { VEHICLES } from "@/lib/data";
import { Eyebrow, Reveal } from "./Reveal";
import { LedScreen } from "@/components/led/LedScreen";

type Role = "advertiser" | "partner";

export function Waitlist() {
  const [role, setRole] = useState<Role>("advertiser");
  const [interests, setInterests] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [brand, setBrand] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          name: form.get("name"),
          company: form.get("company"),
          email: form.get("email"),
          phone: form.get("phone"),
          interests,
          message: form.get("message"),
          website: form.get("website"), // honeypot
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const toggle = (id: string) => setInterests((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id]));

  return (
    <section id="waitlist" className="bg-soft py-28 sm:py-40" aria-label="Join the waiting list">
      <div className="mx-auto grid max-w-[1320px] gap-16 px-4 sm:px-8 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <Eyebrow>Early access</Eyebrow>
          <h2 className="max-w-[13ch] text-[40px] font-medium leading-[1.05] tracking-[-0.04em] sm:text-[56px]">
            Get on the street first.
          </h2>
          <p className="mt-6 max-w-[44ch] text-[18px] leading-relaxed text-mute">
            We&apos;re launching in Kuwait with a limited fleet. Brands on the waiting list get first pick of areas and launch pricing. Own a fleet, a delivery company or a shopfront? Join as a screen partner.
          </p>
          <p lang="ar" dir="rtl" className="mt-6 max-w-[44ch] text-[18px] leading-relaxed text-mute">
            سجّل الحين وكن أول من يظهر في شوارع الكويت.
          </p>
          {role === "advertiser" && (
            <div className="mt-12 max-w-[440px]">
              <p className="mb-3 text-[13px] uppercase tracking-[0.14em] text-mute">Your brand, on the street</p>
              <div className="frame bg-ink p-3" style={{ "--frame-size": "16px", "--frame-weight": "2px" } as React.CSSProperties}>
                <div className="aspect-[16/5]">
                  <LedScreen messages={[brand.trim() || "Your brand here"]} rows={18} hold={60} ariaLabel={`Preview: ${brand.trim() || "Your brand here"}`} />
                </div>
              </div>
            </div>
          )}
        </Reveal>

        <Reveal delay={0.1}>
          <div className="frame bg-paper p-6 sm:p-10" style={{ "--frame-size": "24px", "--frame-weight": "3px" } as React.CSSProperties}>
            <AnimatePresence mode="wait">
              {status === "done" ? (
                <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="py-10" role="status">
                  <h3 className="text-[32px] font-medium tracking-[-0.03em]">You&apos;re on the list.</h3>
                  <p className="mt-3 text-[17px] text-mute">We&apos;ll be in touch before launch with available areas and dates.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={onSubmit} className="grid gap-5" exit={{ opacity: 0 }}>
                  <fieldset>
                    <legend className="mb-3 text-[14px] text-mute">I want to…</legend>
                    <div className="grid grid-cols-2 gap-2" role="radiogroup">
                      {(
                        [
                          ["advertiser", "Advertise my brand"],
                          ["partner", "Host screens (fleet / shop)"],
                        ] as const
                      ).map(([id, label]) => (
                        <button
                          key={id}
                          type="button"
                          role="radio"
                          aria-checked={role === id}
                          onClick={() => setRole(id)}
                          className={`min-h-[48px] border px-4 text-left text-[15px] font-medium transition-colors ${
                            role === id ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Your name" name="name" required autoComplete="name" />
                    <Field label={role === "advertiser" ? "Brand / company" : "Company or shop"} name="company" required autoComplete="organization" maxLength={40} onChange={(e) => setBrand(e.target.value)} />
                    <Field label="Work email" name="email" type="email" required autoComplete="email" />
                    <Field label="Phone (optional)" name="phone" type="tel" autoComplete="tel" />
                  </div>

                  <fieldset>
                    <legend className="mb-3 text-[14px] text-mute">{role === "advertiser" ? "Interested in" : "I can host on"}</legend>
                    <div className="flex flex-wrap gap-2">
                      {VEHICLES.map((v) => {
                        const on = interests.includes(v.id);
                        return (
                          <button
                            key={v.id}
                            type="button"
                            aria-pressed={on}
                            onClick={() => toggle(v.id)}
                            className={`min-h-[44px] border px-4 text-[15px] transition-colors ${on ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`}
                          >
                            {v.name}
                          </button>
                        );
                      })}
                      {role === "partner" && (
                        <button
                          type="button"
                          aria-pressed={interests.includes("shop")}
                          onClick={() => toggle("shop")}
                          className={`min-h-[44px] border px-4 text-[15px] transition-colors ${interests.includes("shop") ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`}
                        >
                          Shop window
                        </button>
                      )}
                    </div>
                  </fieldset>

                  <label className="grid gap-2 text-[14px] text-mute">
                    Anything we should know? (optional)
                    <textarea name="message" rows={3} className="resize-none border border-line bg-paper px-4 py-3 text-[16px] text-ink outline-none focus:border-ink" />
                  </label>

                  <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                  {status === "error" && (
                    <p className="text-[15px] text-[#b42318]" role="alert">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="mt-2 min-h-[56px] bg-ink px-6 text-[16px] font-medium text-paper transition-opacity disabled:opacity-60"
                  >
                    {status === "sending" ? "Joining…" : "Join the waiting list"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-2 text-[14px] text-mute">
      {label}
      <input {...props} className="min-h-[48px] border border-line bg-paper px-4 text-[16px] text-ink outline-none focus:border-ink" />
    </label>
  );
}
