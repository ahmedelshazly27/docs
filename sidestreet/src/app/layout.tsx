import type { Metadata } from "next";
import { Geist, Geist_Mono, Almarai } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const almarai = Almarai({ variable: "--font-almarai", subsets: ["arabic"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "side street — moving screens across Kuwait",
  description:
    "LED trucks, delivery-bike screen boxes and car-top screens that take your brand into Kuwait's neighbourhoods. Join the waiting list.",
  openGraph: {
    title: "side street",
    description: "Not the highway. The street outside the café.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${almarai.variable} bg-paper text-ink`}>
        {children}
      </body>
    </html>
  );
}
