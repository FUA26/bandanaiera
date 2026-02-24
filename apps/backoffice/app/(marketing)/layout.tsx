import { Footer } from "@/components/landing/footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import type { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingHeader />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
