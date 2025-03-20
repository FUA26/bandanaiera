import React from "react";

// import {HeroYoutubeModal} from "../modals/HeroYoutubeModal";

import HeroHeaderSection from "./HeroHeaderSection";

import {cn} from "@/lib/utils";
import {gilroyBold} from "@/lib/utils";

function HeroSection() {
  return (
    <section>
      <HeroHeaderSection />
      <div>
        <div
          className={cn(
            gilroyBold.className,
            "my-8 text-center text-4xl text-primary md:text-[55px] md:leading-[4rem]",
          )}
        >
          Satu <span className="text-accent">Identitas</span>,<br /> Semua Aplikasi dan Layanan
        </div>

        <p className="mb-8 text-center text-[22px] text-[#31373D]">
          Kelola semua akun Anda dalam satu platform,
          <br /> memberikan Anda kemudahan untuk akses Aplikasi dan Layanan Kabupaten Malang.
        </p>

        <div className="flex w-full justify-center">{/* <HeroYoutubeModal /> */}</div>
      </div>
    </section>
  );
}

export default HeroSection;
