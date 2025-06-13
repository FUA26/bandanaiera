"use client";

import React, {useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";

type LoginFormProps = React.ComponentPropsWithoutRef<"div"> & {
  clientName?: string;
};

export function LoginForm({className, clientName = "aplikasi Anda", ...props}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const client_id = searchParams.get("client_id") ?? "";
  const redirect_uri = searchParams.get("redirect_uri") ?? "";
  const scope = searchParams.get("scope") ?? "openid";
  const state = searchParams.get("state") ?? "";

  console.log("##############################");
  console.log(client_id);
  console.log(redirect_uri);
  console.log(scope);
  console.log(state);
  console.log("##############################");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/oauth/sso/authorize", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          username: email,
          password,
          clientId: client_id,
          redirectUri: redirect_uri,
          scope,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login gagal");

        return;
      }

      const targetUrl = new URL(redirect_uri);

      targetUrl.searchParams.set("access_token", data.access_token);
      targetUrl.searchParams.set("token_type", data.token_type);
      targetUrl.searchParams.set("expires_in", data.expires_in.toString());

      if (state) targetUrl.searchParams.set("state", state);

      router.push(targetUrl.toString());
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Masuk ke {clientName}</CardTitle>
          <CardDescription>Silakan login untuk melanjutkan akses</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  required
                  autoComplete="email"
                  id="email"
                  placeholder="nama@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Kata Sandi</Label>
                  <a className="ml-auto text-sm underline-offset-4 hover:underline" href="/">
                    Lupa kata sandi?
                  </a>
                </div>
                <Input
                  required
                  autoComplete="current-password"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button className="w-full" disabled={loading} type="submit">
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </div>

            <div className="text-center text-sm">
              Belum punya akun?{" "}
              <a className="underline underline-offset-4" href="/">
                Daftar sekarang
              </a>
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
