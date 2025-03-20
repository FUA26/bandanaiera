"use client";

import * as z from "zod";
import {useSearchParams, useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {signIn, useSession} from "next-auth/react";
import {useEffect, useState, useTransition} from "react";

import {loginUserSchema} from "../schema/login-schema";

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

  const form = useForm<z.infer<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginUserSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false, // Prevent redirect to handle success/error manually
      });

      if (result?.error) {
        setError(result.error || "Login gagal. Periksa kembali email dan password Anda.");
      } else {
        setSuccess("Login berhasil. Anda akan diarahkan...");
        router.push(callbackUrl);
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
          Login
        </Button>
      </form>
    </Form>
  );
};
