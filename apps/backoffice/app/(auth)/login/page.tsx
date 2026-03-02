import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
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
        <h1 className="text-[28px] font-bold tracking-tight text-foreground">Selamat Datang Kembali</h1>
        <p className="text-sm text-muted-foreground">Masuk untuk mengakses layanan digital Kabupaten Naiera</p>
      </div>
      <LoginForm />
    </div>
  );
}
