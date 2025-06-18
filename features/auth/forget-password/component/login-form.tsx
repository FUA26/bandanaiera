"use client";

import * as z from "zod";
import {useSearchParams, useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import {useEffect, useState, useTransition} from "react";
import Link from "next/link";

import {forgotPasswordSchema} from "../schema/forgot-password-schema";

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

export const ForgotForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {data: session, status} = useSession();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"; // Default redirect jika tidak ada callbackUrl

  // Jika user sudah login, redirect ke callbackUrl
  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const res = await fetch("/api/auth/forget-password", {
        method: "POST",
        body: JSON.stringify({email: values.email}),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // console.log(res);
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Terjadi kesalahan.");
      } else {
        setSuccess("Tautan reset password telah dikirim jika email terdaftar.");
        form.reset();
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
                    placeholder="Masukkan Email"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-1" />
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button className="w-full" disabled={isPending} type="submit">
          Kirim
        </Button>
        <div className="text-center">
          <Link className="text-sm text-blue-600 underline hover:text-blue-800" href="/auth/login">
            Kembali ke halaman login
          </Link>
        </div>
      </form>
    </Form>
  );
};
