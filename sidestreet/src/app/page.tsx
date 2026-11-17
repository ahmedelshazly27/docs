import { SmoothScroll } from "@/components/site/SmoothScroll";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Formats } from "@/components/site/Formats";
import { Neighbourhoods } from "@/components/site/Neighbourhoods";
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
        <Formats />
        <Neighbourhoods />
        <HowItWorks />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
