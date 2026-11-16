"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Wordmark } from "@/components/Logo";

const LINKS = [
  { href: "#neighbourhoods", label: "Neighbourhoods" },
  { href: "#formats", label: "Formats" },
  { href: "#how", label: "How it works" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 40));

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid ? "bg-paper/85 text-ink backdrop-blur-md border-b border-line" : "text-paper"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-4 sm:px-8" aria-label="Main">
        <Wordmark className="text-[22px]" />
        <ul className="hidden items-center gap-8 text-[15px] md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="opacity-80 transition-opacity hover:opacity-100">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <Link
            href="#waitlist"
            className={`frame frame-grow hidden px-4 py-2.5 text-[15px] font-medium sm:inline-block`}
            style={{ "--frame-size": "10px", "--frame-weight": "2px" } as React.CSSProperties}
          >
            Join the waiting list
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
              <path d={open ? "M4 4L18 18M18 4L4 18" : "M3 7H19M3 15H19"} stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </nav>
      {open && (
        <ul className="border-t border-line bg-paper px-4 pb-6 pt-2 text-ink md:hidden">
          {[...LINKS, { href: "#waitlist", label: "Join the waiting list" }].map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)} className="block py-3 text-lg">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </motion.header>
  );
}
