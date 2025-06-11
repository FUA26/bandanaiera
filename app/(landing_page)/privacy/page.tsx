import {Metadata} from "next";

import NavBar from "@/components/layout/NavBar";
import FooterSection from "@/features/landingpage/FooterSection";
import PrivacyPolicyPage from "@/features/landingpage/Kebijakan";

export const metadata: Metadata = {
  title: "Kebijakan Privasi – SSO Aple Ijo",
  description: "Halaman resmi kebijakan privasi untuk layanan SSO Aple Ijo.",
};
export default function Home() {
  return (
    <main>
      <NavBar />
      <PrivacyPolicyPage />
      <footer>
        <FooterSection />
      </footer>
    </main>
  );
}
