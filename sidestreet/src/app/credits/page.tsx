import type { Metadata } from "next";
import Link from "next/link";
import { PHOTO_CREDITS } from "@/lib/credits";

export const metadata: Metadata = { title: "Photo credits — side street" };

export default function Credits() {
  return (
    <main className="mx-auto max-w-[900px] px-4 py-20 sm:px-8">
      <Link href="/" className="text-[14px] text-mute hover:text-ink">← side street</Link>
      <h1 className="mt-6 text-[40px] font-medium tracking-[-0.04em]">Photo credits</h1>
      <p className="mt-4 max-w-[60ch] text-[16px] leading-relaxed text-mute">
        Our street images start from real photographs of Kuwait shared under Creative Commons licences. We add a side street vehicle and a demo ad to each. Marfa Bank and Qamra Coffee are fictional brands made for these demos. Images based on CC BY-SA photos are shared under the same licence.
      </p>
      <ul className="mt-10 divide-y divide-line border-y border-line">
        {PHOTO_CREDITS.map((c) => (
          <li key={c.file} className="grid gap-1 py-5 sm:grid-cols-[1.2fr_1fr_auto] sm:items-baseline sm:gap-6">
            <span className="text-[16px] font-medium">{c.place}</span>
            <span className="text-[15px] text-mute">
              “{c.title}” by {c.author}
            </span>
            <span className="text-[14px]">
              <a href={c.licenseUrl} className="underline underline-offset-4" rel="license noopener" target="_blank">
                {c.license}
              </a>
              {" · "}
              <a href={c.source} className="underline underline-offset-4" rel="noopener" target="_blank">
                source
              </a>
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
