// Shared reference data for the website and the campaign builder.

export type VehicleId = "truck" | "bike" | "car";

export const VEHICLES: {
  id: VehicleId;
  name: string;
  short: string;
  screen: string;
  bestFor: string;
  image: string;
}[] = [
  {
    id: "truck",
    name: "LED trucks",
    short: "Truck",
    screen: "Full-side LED, both sides",
    bestFor: "Launches, events, high-impact loops",
    image: "/media/truck.jpg",
  },
  {
    id: "bike",
    name: "Delivery-bike boxes",
    short: "Bike box",
    screen: "Rear-facing screen on the delivery box",
    bestFor: "Neighbourhood reach, food & retail",
    image: "/media/bike.jpg",
  },
  {
    id: "car",
    name: "Car & taxi tops",
    short: "Car top",
    screen: "Double-sided roof screen",
    bestFor: "Malls, car parks, city-wide frequency",
    image: "/media/car.jpg",
  },
];

export const AREAS: { id: string; en: string; ar: string; governorate: string }[] = [
  { id: "salmiya", en: "Salmiya", ar: "السالمية", governorate: "Hawalli" },
  { id: "hawalli", en: "Hawalli", ar: "حولي", governorate: "Hawalli" },
  { id: "jabriya", en: "Jabriya", ar: "الجابرية", governorate: "Hawalli" },
  { id: "mishref", en: "Mishref", ar: "مشرف", governorate: "Hawalli" },
  { id: "sharq", en: "Sharq", ar: "شرق", governorate: "Capital" },
  { id: "kuwait-city", en: "Kuwait City", ar: "مدينة الكويت", governorate: "Capital" },
  { id: "shuwaikh", en: "Shuwaikh", ar: "الشويخ", governorate: "Capital" },
  { id: "kaifan", en: "Kaifan", ar: "كيفان", governorate: "Capital" },
  { id: "farwaniya", en: "Farwaniya", ar: "الفروانية", governorate: "Farwaniya" },
  { id: "khaitan", en: "Khaitan", ar: "خيطان", governorate: "Farwaniya" },
  { id: "fintas", en: "Fintas", ar: "الفنطاس", governorate: "Ahmadi" },
  { id: "mangaf", en: "Mangaf", ar: "المنقف", governorate: "Ahmadi" },
  { id: "jahra", en: "Jahra", ar: "الجهراء", governorate: "Jahra" },
  { id: "mubarak-al-kabeer", en: "Mubarak Al-Kabeer", ar: "مبارك الكبير", governorate: "Mubarak Al-Kabeer" },
];

export const ROUTES: { id: string; name: string; note: string }[] = [
  { id: "gulf-road", name: "Gulf Road", note: "Sharq → Salmiya, the evening loop" },
  { id: "ring-1-2", name: "1st & 2nd Ring", note: "Inner city, offices and ministries" },
  { id: "ring-4", name: "4th Ring", note: "Commuter corridor" },
  { id: "ring-5-6", name: "5th & 6th Ring", note: "Malls and residential belts" },
  { id: "malls", name: "Mall circuits", note: "The Avenues, 360, Assima car parks" },
  { id: "coops", name: "Co-op car parks", note: "Neighbourhood co-operative societies" },
];

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export const DAYPARTS: { id: string; label: string; hours: string }[] = [
  { id: "morning", label: "Morning", hours: "7–11" },
  { id: "midday", label: "Midday", hours: "11–15" },
  { id: "afternoon", label: "Afternoon", hours: "15–19" },
  { id: "evening", label: "Evening", hours: "19–23" },
  { id: "late", label: "Late", hours: "23–2" },
];

// Placeholder rate card (KWD per vehicle per daypart). Replace with real pricing before launch.
export const RATE_PER_DAYPART: Record<VehicleId, number> = {
  truck: 18,
  bike: 1.5,
  car: 3,
};
