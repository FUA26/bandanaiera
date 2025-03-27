import NavBar from "@/components/layout/NavBar";
import {FaqSection} from "@/features/landingpage/FaqSection";
import FooterSection from "@/features/landingpage/FooterSection";
import HeroSection from "@/features/landingpage/HeroSection";
import {InfoSection} from "@/features/landingpage/InfoSection";
import {IntegrationSection} from "@/features/landingpage/IntegrationSection";

export default function Home() {
  return (
    <main>
      <div className="flex flex-col-reverse md:flex-col">
        {/* <AlertSection /> */}
        <NavBar />
      </div>
      <HeroSection />
      {/* <div className="mt-8 flex flex-col gap-12 bg-red-500 px-4 md:mt-[81px] md:gap-[150px] md:px-[100px]">
      </div> */}
      <InfoSection />
      <IntegrationSection />
      <FaqSection />
      <FooterSection />
    </main>
  );
}
