"use client";

import * as z from "zod";
import {useSearchParams, useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState, useTransition} from "react";

import {loginUserSchema} from "./schema/login-schema";

import {
  Form,
  FormControl,
  FormError,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSuccess,
} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const client_id = searchParams.get("client_id") ?? "";
  const redirect_uri = searchParams.get("redirect_uri") ?? "/";
  const scope = searchParams.get("scope") ?? "openid";
  const state = searchParams.get("state") ?? "";

  const form = useForm<z.infer<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginUserSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const res = await fetch("/api/oauth/sso/v1/authorize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: values.email,
            password: values.password,
            clientId: client_id,
            redirectUri: redirect_uri,
            scope,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Login gagal.");

          return;
        }

        setSuccess("Login berhasil. Anda akan diarahkan...");

        // // Redirect ke aplikasi client dengan token
        const redirectUrl = new URL(redirect_uri);

        redirectUrl.searchParams.set("access_token", data.access_token);
        // redirectUrl.searchParams.set("token_type", data.token_type);
        // redirectUrl.searchParams.set("expires_in", data.expires_in.toString());
        // if (state) redirectUrl.searchParams.set("state", state);

        router.push(redirectUrl.toString());
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan saat login.");
      }
    });
  };

  return (
    <Form {...form}>
      <form className="grid gap-2" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-1">
          <FormField
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="selamet@mail.com"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-1">
          <FormField
            control={form.control}
            name="password"
            render={({field}) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder="******" type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormError message={error} />
        <FormSuccess message={success} />

        <Button className="w-full" disabled={isPending} type="submit">
          {isPending ? "Memproses..." : "Login"}
        </Button>
      </form>
    </Form>
  );
};
