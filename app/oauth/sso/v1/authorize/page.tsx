// app/oauth/sso/authorize/page.tsx
"use client";

import {useSearchParams} from "next/navigation";
import Image from "next/image";

import {LoginForm} from "@/features/oauth/sso/autorize/form";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const clientName = searchParams.get("client_id") || "Your App";

  // console.log(searchParams);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-blue-100/20 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a className="flex items-center gap-2 self-center font-medium" href="/">
          <Image alt="logo" className="h-10" height={40} src="/images/full-login.png" width={160} />
        </a>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Masuk ke {clientName}</CardTitle>
              <CardDescription>Silakan login untuk melanjutkan akses</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>

          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            Dengan melanjutkan, Anda menyetujui <a href="/">Syarat & Ketentuan</a> serta{" "}
            <a href="/">Kebijakan Privasi</a> yang berlaku.
          </div>
        </div>
      </div>
    </div>
  );
}
