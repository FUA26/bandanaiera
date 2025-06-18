// import Image from "next/image";
"use client";

// import {AuthorizeForm} from "@/components/forms/authorize-form";
import Image from "@/components/ui/image";
import {ForgotForm} from "@/features/auth/forget-password/component/login-form";

export default function ForgetPasswordPage() {
  // const searchParams = useSearchParams();

  // const name = searchParams.get("name");
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
        <h1 className="text-2xl font-bold">Atur Ulang Kata Sandi</h1>
        <p className="text-muted-foreground">
          Silakan masukkan alamat email atau nama pengguna Anda. Instruksi pengaturan ulang kata
          sandi akan dikirimkan melalui email.
        </p>
      </div>
      <div className="grid gap-4">
        <ForgotForm />
      </div>
    </>
  );
}
