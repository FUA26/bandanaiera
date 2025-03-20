// import Image from "next/image";
"use client";
import Link from "next/link";
import {useSearchParams} from "next/navigation";

// import {AuthorizeForm} from "@/components/forms/authorize-form";
import Image from "@/components/ui/image";
import {LoginForm} from "@/features/auth/login/component/login-form";

export default function Login() {
  const searchParams = useSearchParams();

  const name = searchParams.get("name");
  // const url = searchParams.get("redirect_uri");

  return (
    <>
      <div className="grid gap-2 text-center">
        <div className="relative m-auto mb-4 aspect-[4/1] w-3/4">
          <Image
            fill
            alt="Profile Image"
            className="rounded-2xl"
            enableLoading={false}
            enableTransition={false}
            priority={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src="/images/full-login.png"
          />
        </div>
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-muted-foreground">
          Anda harus login terlebih dahulu untuk mengakses halaman{" "}
          <span className="font-bold text-primary">{name}</span>.
        </p>
      </div>
      <div className="grid gap-4">
        <LoginForm />
      </div>
      <div className="mt-4 text-center text-sm">
        Belum punya akun ?{" "}
        <Link className="underline" href="register">
          Daftar
        </Link>
      </div>
    </>
  );
}
