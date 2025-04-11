// app/oauth/sso/authorize/page.tsx
"use client";

import {useSearchParams} from "next/navigation";
import Image from "next/image";

import {LoginForm} from "@/features/oauth/sso/autorize/form";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const clientName = searchParams.get("client") || "Your App";

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-blue-100/20 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a className="flex items-center gap-2 self-center font-medium" href="/">
          <Image alt="logo" className="h-10" height={40} src="/images/full-login.png" width={160} />
        </a>
        <LoginForm clientName={clientName} />
      </div>
    </div>
  );
}
