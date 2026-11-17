import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success.
  if (str(body.website)) return NextResponse.json({ ok: true });

  const role = body.role === "partner" ? "partner" : "advertiser";
  const name = str(body.name, 120);
  const company = str(body.company, 160);
  const email = str(body.email, 200).toLowerCase();
  const phone = str(body.phone, 40) || null;
  const message = str(body.message, 2000) || null;
  const interests = Array.isArray(body.interests)
    ? body.interests.filter((x): x is string => typeof x === "string" && ["truck", "bike", "car", "shop"].includes(x))
    : [];

  if (!name || !company) return NextResponse.json({ error: "Please add your name and company." }, { status: 400 });
  if (!EMAIL.test(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });

  const db = supabaseServer();
  if (!db) {
    console.warn("[waitlist] Supabase is not configured; signup not stored", { role, company });
    return NextResponse.json({ error: "Sign-ups open soon. Please try again shortly." }, { status: 503 });
  }

  const { error } = await db.from("waitlist").insert({
    role,
    name,
    company,
    email,
    phone,
    interests,
    message,
    user_agent: str(req.headers.get("user-agent"), 300) || null,
  });

  // Unique violation = already signed up; treat as success.
  if (error && error.code !== "23505") {
    console.error("[waitlist] insert failed", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
