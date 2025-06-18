"use client";

import {useSearchParams, useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState, useTransition} from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormError,
  FormSuccess,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

const schema = z
  .object({
    newPassword: z.string().min(8, "Minimal 8 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak cocok",
  });

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");

  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setError("");
    setSuccess("");

    if (!code) {
      setError("Token tidak ditemukan.");

      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            code,
            newPassword: values.newPassword,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data?.message || "Terjadi kesalahan.");
        } else {
          setSuccess("Password berhasil diubah. Silakan login.");
          setTimeout(() => router.push("/auth/login"), 2000);
        }
      } catch (err) {
        setError("Gagal menghubungi server.");
      }
    });
  };

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-center text-2xl font-bold">Reset Kata Sandi</h1>
      <p className="text-center text-muted-foreground">Masukkan kata sandi baru Anda.</p>

      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="newPassword"
            render={({field}) => (
              <FormItem>
                <FormLabel>Password Baru</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="********" type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({field}) => (
              <FormItem>
                <FormLabel>Konfirmasi Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="********" type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button className="w-full" disabled={isPending} type="submit">
            Simpan Password
          </Button>
        </form>
      </Form>
    </div>
  );
}
