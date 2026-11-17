import { SmoothScroll } from "@/components/site/SmoothScroll";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { CompareSlider } from "@/components/site/CompareSlider";
import { Neighbourhoods } from "@/components/site/Neighbourhoods";
import { Formats } from "@/components/site/Formats";
import { MiniPlanner } from "@/components/site/MiniPlanner";
import { HowItWorks } from "@/components/site/HowItWorks";
import { RingMap } from "@/components/site/RingMap";
import { Waitlist } from "@/components/site/Waitlist";
import { Footer } from "@/components/site/Footer";
import { MEDIA } from "@/lib/media";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <main>
        <Hero />
        <CompareSlider before="/media/hero-before.jpg" after={MEDIA.heroPoster} />
        <Neighbourhoods />
        <Formats />
        <MiniPlanner />
        <HowItWorks />
        <RingMap />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
