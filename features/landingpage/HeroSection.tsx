import React from "react";

// import {HeroYoutubeModal} from "../modals/HeroYoutubeModal";

import HeroHeaderSection from "./HeroHeaderSection";
import {HeroYoutubeModal} from "./HeroYoutubeModal";

import {cn} from "@/lib/utils";
import {gilroyBold} from "@/lib/utils";

function HeroSection() {
  return (
    <section id="beranda">
      <div className="my-40 flex flex-col justify-center">
        <HeroHeaderSection />
        <div
          className={cn(
            gilroyBold.className,
            "my-8 text-center text-4xl text-primary md:text-[55px] md:leading-[4rem]",
          )}
        >
          Satu <span className="text-brand">Identitas</span>,<br /> Semua Aplikasi dan Layanan
        </div>

        <p className="mb-8 text-center text-[22px] text-[#31373D]">
          Kelola semua akun Anda dalam satu platform,
          <br /> memberikan Anda kemudahan untuk akses Aplikasi dan Layanan Kabupaten Malang.
        </p>
      </div>

      <div className="flex w-full justify-center">
        <HeroYoutubeModal />
      </div>
    </section>
  );
}

export default HeroSection;
