"use client";

import {PlusIcon} from "lucide-react";
import Link from "next/link";
import React, {useState} from "react";

import {cn} from "@/lib/utils";

function AlertSection() {
  const [showAlert, setShowAlert] = useState(true);

  return showAlert ? (
    <div
      className={cn(
        "mx-4 flex justify-between rounded-[12px] bg-primary p-[12px]",
        showAlert ? "mt-4" : "",
      )}
    >
      <div />
      <div className="inline-flex gap-3 text-[12px] font-semibold text-white md:text-[16px]">
        <div>
          We&apos;ve raised a $23.5m Series A led by Redpoint Ventures!{" "}
          <Link className="pl-3 underline underline-offset-4" href="/">
            Read more
          </Link>
        </div>
      </div>
      <div>
        <PlusIcon
          className="rotate-45 hover:cursor-pointer"
          color="#fff"
          onClick={() => setShowAlert(false)}
        />
      </div>
    </div>
  ) : (
    <div />
  );
}

export default AlertSection;
