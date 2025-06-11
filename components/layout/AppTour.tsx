"use client";

import {useState, useEffect} from "react";
import Joyride, {STATUS, CallBackProps, Step} from "react-joyride";

import useMounted from "@/hooks/use-mouted";

const steps: Step[] = [
  {
    target: ".sidebar-menu",
    content: "Ini adalah menu utama aplikasi.",
  },
  {
    target: ".user-avatar",
    content: "Klik di sini untuk mengakses profil dan pengaturan akun.",
  },
];

export default function AppTour() {
  const mounted = useMounted(); // ⬅️ gunakan di sini
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (!mounted) return;

    const seen = localStorage.getItem("hasSeenTour");

    if (!seen) setRun(true);
  }, [mounted]);
  const handleCallback = (data: CallBackProps) => {
    if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
      localStorage.setItem("hasSeenTour", "true");
      setRun(false);
    }
  };

  if (!mounted) return null; // ⬅️ hindari render sebelum client siap

  return (
    <Joyride
      continuous
      scrollToFirstStep
      showProgress
      showSkipButton
      callback={handleCallback}
      run={run}
      steps={steps}
      styles={{
        options: {
          primaryColor: "#388e3c",
          zIndex: 9999,
        },
      }}
    />
  );
}
