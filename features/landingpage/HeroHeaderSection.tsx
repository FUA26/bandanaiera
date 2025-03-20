import {ChevronRight} from "lucide-react";
import React from "react";

function HeroHeaderSection() {
  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center gap-1 rounded-[100px] bg-[#F4F5F6] p-1 pr-[10px]">
        <div className="inline-block rounded-[100px] bg-primary p-2 text-[10px] font-semibold text-white">
          Baru
        </div>
        <p className="text-[#31373D]">E-PKK telah terintegrasi !</p>
        <div>
          <ChevronRight />
        </div>
      </div>
    </div>
  );
}

export default HeroHeaderSection;
