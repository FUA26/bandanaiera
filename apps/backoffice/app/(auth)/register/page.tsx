/**
 * Registration Page
 *
 * Public page for user registration
 */

import { RegisterForm } from "@/components/auth/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a new account to get started",
};

export default function RegisterPage() {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-10">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground font-bold text-lg leading-none">
          N
        </div>
        <div>
          <h2 className="text-base font-bold leading-tight">Super App Naiera</h2>
          <p className="text-xs text-muted-foreground leading-tight">Kabupaten Naiera</p>
        </div>
      </div>
      <div className="space-y-2 mb-8">
        <h1 className="text-[28px] font-bold tracking-tight text-foreground">Daftar Akun Baru</h1>
        <p className="text-sm text-muted-foreground">Lengkapi data di bawah untuk membuat akun Anda</p>
      </div>
      <RegisterForm />
    </div>
  );
}
