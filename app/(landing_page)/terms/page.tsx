import {Metadata} from "next";

import NavBar from "@/components/layout/NavBar";
import FooterSection from "@/features/landingpage/FooterSection";
import TermsAndConditions from "@/features/landingpage/TermsAndConditions";

export const metadata: Metadata = {
  title: "Kebijakan Privasi – SSO Aple Ijo",
  description: "Halaman resmi kebijakan privasi untuk layanan SSO Aple Ijo.",
};
export default function TermsAndConditionsPage() {
  return (
    <main>
      <NavBar />
      <TermsAndConditions />
      <footer>
        <FooterSection />
      </footer>
    </main>
  );
}
