const SPECS = [
  { name: "LED truck · side", size: "[width × height px — set from supplier]", formats: "JPG, PNG, MP4", note: "Both sides show the same creative." },
  { name: "Delivery-bike box · rear", size: "[width × height px — set from supplier]", formats: "JPG, PNG", note: "Small screen: one message, large type." },
  { name: "Car top · double-sided", size: "[width × height px — set from supplier]", formats: "JPG, PNG", note: "Very wide format; keep text short." },
];

const RULES = [
  "Arabic copy should be present and correct; English can sit alongside it.",
  "No alcohol, pork, gambling or content against public morals.",
  "Medical, pharmacy, cosmetics and supplement ads need Ministry of Health approval first.",
  "Promotions and real-estate ads need Ministry of Commerce approval numbers shown on the ad.",
  "Moving vehicles may be limited to still images — we confirm per format before going live.",
];

export default function Specs() {
  return (
    <div className="mx-auto max-w-[900px]">
      <p className="text-[13px] uppercase tracking-[0.14em] text-mute">Creative specs</p>
      <h1 className="mt-2 text-[36px] font-medium tracking-[-0.04em]">Make it read from the pavement</h1>
      <p className="mt-3 max-w-[60ch] text-mute">Screens are seen for a few seconds from a few metres away. One message, big type, high contrast.</p>

      <div className="mt-10 grid gap-3">
        {SPECS.map((s) => (
          <div key={s.name} className="grid gap-2 bg-paper p-6 sm:grid-cols-[1.2fr_1fr_0.8fr]">
            <div>
              <div className="text-[17px] font-medium">{s.name}</div>
              <div className="mt-1 text-[14px] text-mute">{s.note}</div>
            </div>
            <div className="text-[14px]">{s.size}</div>
            <div className="text-[14px] text-mute">{s.formats}</div>
          </div>
        ))}
      </div>

      <h2 className="mt-14 text-[22px] font-medium tracking-[-0.03em]">Content checks before going live</h2>
      <ul className="mt-4 grid gap-2">
        {RULES.map((r) => (
          <li key={r} className="border-l-2 border-ink bg-paper px-5 py-4 text-[15px]">
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}
