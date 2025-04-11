// ✅ app/(aplikasi)/profile/change-password/page.tsx

"use client";

import {useTransition, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Label} from "@/components/ui/label";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
    newPassword: z.string().min(4, "Password baru minimal 4 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function ChangePasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormValues) {
    setSuccessMessage(null);
    setErrorMessage(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/password", {
          method: "PATCH",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          const data = await res.json();

          throw new Error(data.error || "Gagal mengganti password");
        }

        reset();
        setSuccessMessage("Password berhasil diperbarui!");
      } catch (err: any) {
        setErrorMessage(err.message || "Terjadi kesalahan internal");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Ganti Password</h3>
        <p className="text-sm text-muted-foreground">
          Silakan masukkan password lama dan password baru Anda.
        </p>
      </div>
      <Separator />

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <Label htmlFor="currentPassword">Password Saat Ini</Label>
          <Input id="currentPassword" type="password" {...register("currentPassword")} />
          {errors.currentPassword && (
            <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="newPassword">Password Baru</Label>
          <Input id="newPassword" type="password" {...register("newPassword")} />
          {errors.newPassword && (
            <p className="text-sm text-red-500">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
          <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

        <Button disabled={isPending} type="submit">
          {isPending ? "Menyimpan..." : "Simpan Password Baru"}
        </Button>
      </form>
    </div>
  );
}
