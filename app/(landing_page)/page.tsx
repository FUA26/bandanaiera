import NavBar from "@/components/layout/NavBar";
import {FaqSection} from "@/features/landingpage/FaqSection";
import FooterSection from "@/features/landingpage/FooterSection";
import HeroSection from "@/features/landingpage/HeroSection";
import {InfoSection} from "@/features/landingpage/InfoSection";
import {IntegrationSection} from "@/features/landingpage/IntegrationSection";

export default function Home() {
  return (
    <main>
      <NavBar />
      <HeroSection />
      <InfoSection />
      <IntegrationSection />
      <FaqSection />
      <footer>
        <FooterSection />
      </footer>
    </main>
  );
}
