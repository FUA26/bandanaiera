import React from "react";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

type LoginFormProps = React.ComponentPropsWithoutRef<"div"> & {
  clientName?: string;
};

export function LoginForm({className, clientName = "aplikasi Anda", ...props}: LoginFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Masuk ke {clientName}</CardTitle>
          <CardDescription>Silakan login untuk melanjutkan akses</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    required
                    autoComplete="email"
                    id="email"
                    placeholder="nama@email.com"
                    type="email"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Kata Sandi</Label>
                    <a className="ml-auto text-sm underline-offset-4 hover:underline" href="/">
                      Lupa kata sandi?
                    </a>
                  </div>
                  <Input required autoComplete="current-password" id="password" type="password" />
                </div>
                <Button className="w-full" type="submit">
                  Masuk
                </Button>
              </div>

              <div className="text-center text-sm">
                Belum punya akun?{" "}
                <a className="underline underline-offset-4" href="/">
                  Daftar sekarang
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Dengan melanjutkan, Anda menyetujui <a href="/">Syarat & Ketentuan</a> serta{" "}
        <a href="/">Kebijakan Privasi</a> yang berlaku.
      </div>
    </div>
  );
}
