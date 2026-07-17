import Hero from "@/sections/Hero";
import AboutSection from "@/sections/AboutSection";
import Disciplines from "@/sections/Disciplines";
import PartnersSection from "@/sections/PartnersSection";
import NewsSection from "@/sections/NewsSection";
import SummitSection from "@/sections/SummitSection";
import Testimonials from "@/sections/Testimonials";
import CTASection from "@/sections/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <Disciplines />
      <PartnersSection />
      <NewsSection />
      <SummitSection />
      <Testimonials />
      <CTASection />
    </>
  );
}
