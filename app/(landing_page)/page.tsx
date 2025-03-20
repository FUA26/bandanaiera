import NavBar from "@/components/layout/NavBar";
import AlertSection from "@/features/landingpage/AlertSection";
import HeroSection from "@/features/landingpage/HeroSection";

export default function Home() {
  return (
    <main>
      <div className="flex flex-col-reverse md:flex-col">
        <AlertSection />
        <NavBar />
      </div>
      <div className="mt-8 flex flex-col gap-12 px-4 md:mt-[81px] md:gap-[150px] md:px-[100px]">
        <HeroSection />
      </div>
    </main>
  );
}
