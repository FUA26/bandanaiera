"use client";

import {useTransition, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Eye, EyeOff} from "lucide-react"; // ⬅️ Tambahkan icon

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Label} from "@/components/ui/label";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
    newPassword: z.string().min(8, "Password baru minimal 8 karakter"),
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

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

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
        const res = await fetch("/api/me/password", {
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
        {/* Current Password */}
        <div className="grid gap-2">
          <Label htmlFor="currentPassword">Password Saat Ini</Label>
          <div className="relative">
            <Input
              id="currentPassword"
              type={showPassword.current ? "text" : "password"}
              {...register("currentPassword")}
            />
            <button
              className="absolute right-2 top-2.5 text-muted-foreground"
              type="button"
              onClick={() => setShowPassword((prev) => ({...prev, current: !prev.current}))}
            >
              {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div className="grid gap-2">
          <Label htmlFor="newPassword">Password Baru</Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showPassword.new ? "text" : "password"}
              {...register("newPassword")}
            />
            <button
              className="absolute right-2 top-2.5 text-muted-foreground"
              type="button"
              onClick={() => setShowPassword((prev) => ({...prev, new: !prev.new}))}
            >
              {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-sm text-red-500">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showPassword.confirm ? "text" : "password"}
              {...register("confirmPassword")}
            />
            <button
              className="absolute right-2 top-2.5 text-muted-foreground"
              type="button"
              onClick={() => setShowPassword((prev) => ({...prev, confirm: !prev.confirm}))}
            >
              {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Messages */}
        {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

        <Button disabled={isPending} type="submit">
          {isPending ? "Menyimpan..." : "Simpan Password Baru"}
        </Button>
      </form>
    </div>
  );
}
