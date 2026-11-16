import { DAYS, DAYPARTS, RATE_PER_DAYPART, type VehicleId } from "./data";

export type Day = (typeof DAYS)[number];

export type Campaign = {
  id: string;
  createdAt: string;
  status: "draft" | "submitted" | "in_review" | "approved" | "live" | "completed";
  synced: boolean; // true once the server has stored it
  name: string;
  objective: string;
  contactEmail: string;
  vehicles: Record<VehicleId, number>;
  areas: string[];
  routes: string[];
  startDate: string; // yyyy-mm-dd
  endDate: string;
  schedule: Record<Day, string[]>; // day -> daypart ids
  staticOnly: boolean;
  creativeName: string | null;
  notes: string;
};

export const emptySchedule = (): Record<Day, string[]> =>
  Object.fromEntries(DAYS.map((d) => [d, [] as string[]])) as unknown as Record<Day, string[]>;

export function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

/** Number of booked dayparts across the date range, honouring the weekly schedule. */
export function countDayparts(c: Pick<Campaign, "startDate" | "endDate" | "schedule">) {
  if (!c.startDate || !c.endDate) return 0;
  const start = new Date(c.startDate + "T00:00:00Z");
  const end = new Date(c.endDate + "T00:00:00Z");
  if (end < start) return 0;
  let total = 0;
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    total += c.schedule[DAYS[d.getUTCDay()]]?.length ?? 0;
  }
  return total;
}

export function daysInRange(c: Pick<Campaign, "startDate" | "endDate">) {
  if (!c.startDate || !c.endDate) return 0;
  const ms = new Date(c.endDate).getTime() - new Date(c.startDate).getTime();
  return ms < 0 ? 0 : Math.round(ms / 86_400_000) + 1;
}

export function estimate(c: Pick<Campaign, "vehicles" | "startDate" | "endDate" | "schedule">) {
  const slots = countDayparts(c);
  const lines = (Object.keys(c.vehicles) as VehicleId[])
    .filter((v) => c.vehicles[v] > 0)
    .map((v) => ({ vehicle: v, qty: c.vehicles[v], slots, rate: RATE_PER_DAYPART[v], total: c.vehicles[v] * slots * RATE_PER_DAYPART[v] }));
  return { slots, lines, total: lines.reduce((s, l) => s + l.total, 0) };
}

export const kwd = (n: number) =>
  `KD ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 3 })}`;

export const daypartLabel = (id: string) => DAYPARTS.find((d) => d.id === id)?.label ?? id;

// ---- local persistence (per browser) ----
const KEY = "sidestreet.campaigns.v1";

export function loadCampaigns(): Campaign[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Campaign[]) : [];
  } catch {
    return [];
  }
}

export function saveCampaign(c: Campaign) {
  try {
    const all = loadCampaigns().filter((x) => x.id !== c.id);
    localStorage.setItem(KEY, JSON.stringify([c, ...all]));
  } catch {
    /* storage unavailable */
  }
}

export function deleteCampaign(id: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify(loadCampaigns().filter((x) => x.id !== id)));
  } catch {
    /* storage unavailable */
  }
}
