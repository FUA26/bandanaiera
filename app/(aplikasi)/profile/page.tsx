"use client";

import {useEffect, useTransition, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import useSWR from "swr";
import * as z from "zod";

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Label} from "@/components/ui/label";
import {Skeleton} from "@/components/ui/skeleton";

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
});

type ProfileForm = z.infer<typeof schema>;

const fetcher = (url: string) => fetch(url, {credentials: "include"}).then((res) => res.json());

export default function ProfilePage() {
  const {data, isLoading, mutate} = useSWR("/api/me", fetcher);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    },
  });

  useEffect(() => {
    if (data?.user) {
      reset({
        name: data.user.name ?? "",
        email: data.user.email ?? "",
      });
    }
  }, [data?.user, reset]);

  async function onSubmit(values: ProfileForm) {
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

        if (!res.ok) {
          const err = await res.json();

          throw new Error(err.error || "Gagal memperbarui profil");
        }

        mutate(
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
      } catch (err: any) {
        console.error(err);
        setErrorMessage(err.message || "Terjadi kesalahan saat menyimpan.");
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
