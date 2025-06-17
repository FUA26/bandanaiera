import {Metadata} from "next";

import NavBar from "@/components/layout/NavBar";
import FooterSection from "@/features/landingpage/FooterSection";
import TermsAndConditions from "@/features/landingpage/TermsAndConditions";

export const metadata: Metadata = {
  title: "Kebijakan Privasi –  Kabupaten Malang",
  description: "Halaman resmi kebijakan privasi untuk layanan  Kabupaten Malang.",
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
