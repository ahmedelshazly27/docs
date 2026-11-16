import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { AREAS, DAYPARTS, DAYS, ROUTES } from "@/lib/data";
import { estimate, type Campaign } from "@/lib/campaign";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const clampInt = (v: unknown, max: number) => Math.max(0, Math.min(max, Math.floor(Number(v) || 0)));

export async function POST(req: Request) {
  let b: Partial<Campaign>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = str(b.name, 120);
  const email = str(b.contactEmail, 200).toLowerCase();
  const vehicles = { truck: clampInt(b.vehicles?.truck, 50), bike: clampInt(b.vehicles?.bike, 500), car: clampInt(b.vehicles?.car, 200) };
  const areaIds = new Set(AREAS.map((a) => a.id));
  const routeIds = new Set(ROUTES.map((r) => r.id));
  const dayparts = new Set(DAYPARTS.map((d) => d.id));
  const areas = (b.areas ?? []).filter((a) => areaIds.has(a));
  const routes = (b.routes ?? []).filter((r) => routeIds.has(r));
  const schedule = Object.fromEntries(
    DAYS.map((d) => [d, (b.schedule?.[d] ?? []).filter((p) => dayparts.has(p))]),
  ) as Campaign["schedule"];
  const startDate = str(b.startDate, 10);
  const endDate = str(b.endDate, 10);

  if (!name) return NextResponse.json({ error: "Give the campaign a name." }, { status: 400 });
  if (!EMAIL.test(email)) return NextResponse.json({ error: "Add a valid contact email." }, { status: 400 });
  if (vehicles.truck + vehicles.bike + vehicles.car === 0) return NextResponse.json({ error: "Pick at least one screen." }, { status: 400 });
  if (areas.length + routes.length === 0) return NextResponse.json({ error: "Pick at least one area or route." }, { status: 400 });
  if (!DATE.test(startDate) || !DATE.test(endDate) || endDate < startDate) return NextResponse.json({ error: "Check the campaign dates." }, { status: 400 });

  const est = estimate({ vehicles, startDate, endDate, schedule });
  if (est.slots === 0) return NextResponse.json({ error: "Pick at least one day and time." }, { status: 400 });

  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Saved on this device. Sending opens at launch." }, { status: 503 });

  const { data, error } = await db
    .from("campaigns")
    .insert({
      contact_email: email,
      name,
      objective: str(b.objective, 60) || null,
      vehicles,
      areas,
      routes,
      start_date: startDate,
      end_date: endDate,
      schedule,
      static_only: b.staticOnly !== false,
      creative_name: str(b.creativeName, 200) || null,
      estimate_kwd: est.total,
      notes: str(b.notes, 2000) || null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[campaigns] insert failed", error);
    return NextResponse.json({ error: "Could not send the campaign. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id: data.id });
}
