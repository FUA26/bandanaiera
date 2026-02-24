import { BenefitsSection } from "@/components/landing/benefits-section";
import { CTASection } from "@/components/landing/cta-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { SocialProofSection } from "@/components/landing/social-proof-section";
import { TechSection } from "@/components/landing/tech-section";
import { Separator } from "@/components/ui/separator";

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <Separator />
      <SocialProofSection />
      <Separator />
      <FeaturesSection />
      <Separator />
      <TechSection />
      <Separator />
      <BenefitsSection />
      <Separator />
      <PricingSection />
      <Separator />
      <CTASection />
    </main>
  );
}
