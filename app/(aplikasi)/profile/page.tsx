"use client";

import {useEffect, useTransition, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import useSWR from "swr";

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Label} from "@/components/ui/label";
import {Skeleton} from "@/components/ui/skeleton";

const formSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
});

const fetcher = async (url: string) => {
  const res = await fetch(url, {credentials: "include"});

  console.log("🔎 Fetched:", res.status);

  return res.json();
};

export default function SettingsLayout() {
  const {data, mutate, isLoading} = useSWR("/api/me", fetcher);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  console.log("SWR", data);

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (data?.user) {
      reset({
        name: data.user.name,
        email: data.user.email,
      });
    }
  }, [data?.user, reset]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/me", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!res.ok) throw new Error("Gagal memperbarui profil");

        mutate(
          "/api/me",
          {
            ...data,
            user: {
              ...data?.user,
              ...values,
            },
          },
          false,
        );

        setSuccessMessage("Profil berhasil diperbarui!");
      } catch (err) {
        console.error(err);
        setErrorMessage("Terjadi kesalahan saat menyimpan.");
      }
    });
  }

  if (isLoading) {
    return <Skeleton className="h-48 w-full rounded-xl" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profil</h3>
        <p className="text-sm text-muted-foreground">
          Ini adalah informasi profil yang akan dilihat pengguna lain.
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
          <Input id="email" {...register("email")} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

        <Button disabled={isPending} type="submit">
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </form>
    </div>
  );
}
