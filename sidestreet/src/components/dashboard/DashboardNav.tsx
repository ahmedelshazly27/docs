"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { StackedIcon } from "@/components/Logo";

const ITEMS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/new", label: "New campaign" },
  { href: "/dashboard/specs", label: "Creative specs" },
];

export function DashboardNav() {
  const path = usePathname();
  return (
    <aside className="border-b border-line bg-paper lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8 lg:flex-col lg:items-start lg:px-6 lg:py-8">
        <Link href="/" className="flex items-center gap-3" aria-label="side street home">
          <StackedIcon size={40} />
          <span className="text-[18px] font-medium tracking-[-0.04em]">side street</span>
        </Link>
        <span className="border border-line px-2 py-1 text-[12px] text-mute lg:mt-2">Early access</span>
      </div>
      <nav aria-label="Dashboard" className="overflow-x-auto px-2 pb-3 lg:px-3 lg:pb-0">
        <ul className="flex gap-1 lg:flex-col">
          {ITEMS.map((i) => {
            const on = i.href === "/dashboard" ? path === "/dashboard" : path.startsWith(i.href);
            return (
              <li key={i.href}>
                <Link
                  href={i.href}
                  aria-current={on ? "page" : undefined}
                  className={`flex min-h-[44px] items-center whitespace-nowrap px-3 text-[15px] transition-colors ${
                    on ? "bg-ink text-paper" : "text-ink/75 hover:bg-soft hover:text-ink"
                  }`}
                >
                  {i.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
