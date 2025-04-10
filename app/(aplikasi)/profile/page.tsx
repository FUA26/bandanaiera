// ✅ app/(aplikasi)/profile/page.tsx dengan toast Sonner

"use client";

import {useEffect, useTransition} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import useSWR from "swr";
import * as z from "zod";
import {getSession} from "next-auth/react";
import {toast} from "sonner";

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Label} from "@/components/ui/label";
import {Skeleton} from "@/components/ui/skeleton";

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email(),
  phone: z
    .string()
    .regex(/^0\d{10,12}$/, "Nomor harus 11-13 digit dan diawali 0")
    .optional()
    .or(z.literal("")),
  address: z.string().max(50, "Maksimal 50 karakter").optional().or(z.literal("")),
});

type ProfileForm = z.infer<typeof schema>;

const fetcher = (url: string) => fetch(url, {credentials: "include"}).then((res) => res.json());

export default function ProfilePage() {
  const {data, isLoading, mutate} = useSWR("/api/me", fetcher);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (data?.user) {
      reset({
        name: data.user.name ?? "",
        email: data.user.email ?? "",
        phone: data.user.phone ?? "",
        address: data.user.address ?? "",
      });
    }
  }, [data?.user, reset]);

  async function refreshSession() {
    await getSession();
  }

  async function onSubmit(values: ProfileForm) {
    startTransition(async () => {
      try {
        const res = await fetch("/api/me", {
          method: "PATCH",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          const err = await res.json();

          throw new Error(err.error || "Gagal memperbarui profil");
        }

        await refreshSession();
        mutate();

        toast.success("Profil berhasil diperbarui!");
      } catch (err: any) {
        toast.error(err.message || "Terjadi kesalahan saat menyimpan.");
      }
    });
  }

  if (isLoading || !data?.user) {
    return <Skeleton className="h-48 w-full rounded-xl" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profil</h3>
        <p className="text-sm text-muted-foreground">
          Informasi ini ditampilkan ke pengguna lain dan dapat diedit.
        </p>
      </div>
      <Separator />

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <Label htmlFor="name">Nama</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input readOnly id="email" {...register("email")} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Nomer Telepon</Label>
          <Input id="phone" type="tel" {...register("phone")} />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="address">Alamat</Label>
          <Input id="address" {...register("address")} />
          {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
        </div>

        <Button disabled={isPending} type="submit">
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </form>
    </div>
  );
}
