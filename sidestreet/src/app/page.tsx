import { SmoothScroll } from "@/components/site/SmoothScroll";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Neighbourhoods } from "@/components/site/Neighbourhoods";
import { Formats } from "@/components/site/Formats";
import { CityBand } from "@/components/site/CityBand";
import { Seen } from "@/components/site/Seen";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Waitlist } from "@/components/site/Waitlist";
import { Footer } from "@/components/site/Footer";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <main>
        <Hero />
        <Neighbourhoods />
        <Formats />
        <HowItWorks />
        <Seen />
        <CityBand />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
