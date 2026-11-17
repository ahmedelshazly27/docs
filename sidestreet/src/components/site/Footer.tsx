import Link from "next/link";
import { StackedIcon } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="bg-ink text-paper" aria-label="Footer">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-12 px-4 py-16 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-5">
          <StackedIcon size={72} />
          <div>
            <p className="text-[18px] font-medium tracking-[-0.02em]">Moving screens across Kuwait</p>
            <p lang="ar" dir="rtl" className="mt-1 text-paper/60">
              شاشات متنقّلة في أنحاء الكويت
            </p>
          </div>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3 text-[15px] text-paper/70">
          <Link href="#formats" className="hover:text-paper">Formats</Link>
          <Link href="#how" className="hover:text-paper">How it works</Link>
          <Link href="/dashboard" className="hover:text-paper">Campaign builder</Link>
          <Link href="#waitlist" className="hover:text-paper">Waiting list</Link>
        </nav>
      </div>
      <div className="mx-auto max-w-[1320px] border-t border-paper/15 px-4 py-6 text-[13px] text-paper/50 sm:px-8">
        © {new Date().getFullYear()} side street · Kuwait · Brands shown on screens are demo creatives
      </div>
    </footer>
  );
}
