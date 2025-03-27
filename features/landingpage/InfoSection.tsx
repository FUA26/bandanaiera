import {Zap, Cpu, Sparkles, Lock} from "lucide-react";
import Image from "next/image";

export function InfoSection() {
  return (
    <>
      <section className="py-16 md:py-32">
        <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16 lg:px-0">
          <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
            Satu Login, Satu Akun untuk Semua
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
            <div className="relative mb-6 sm:mb-0">
              <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
                <Image
                  alt="payments illustration dark"
                  className="hidden rounded-[15px] dark:block"
                  height={829}
                  src="/payments.png"
                  width={1207}
                />
                <Image
                  alt="payments illustration light"
                  className="rounded-[15px] shadow dark:hidden"
                  height={829}
                  src="/payments-light.png"
                  width={1207}
                />
              </div>
            </div>

            <div className="relative space-y-4">
              <p className="text-muted-foreground">
                Mengelola banyak akun untuk berbagai layanan pemerintahan dapat menjadi tantangan.
                <span className="font-bold text-accent-foreground"> Satu Login </span>
                hadir sebagai solusi autentikasi tunggal
                <span className="font-bold italic text-accent-foreground">
                  {" "}
                  (Single Sign-On / SSO)
                </span>{" "}
                yang memungkinkan akses mudah, cepat, dan aman ke seluruh layanan digital pemerintah
                dengan satu akun terpusat.
              </p>
              <p className="text-muted-foreground">
                Dikembangkan dengan standar keamanan tinggi, Satu Login memastikan data pengguna
                terlindungi dan memberikan pengalaman efisien dalam mengakses layanan publik. Sistem
                ini memungkinkan masyarakat dan instansi pemerintah untuk terhubung ke berbagai
                aplikasi tanpa harus login berulang kali.
              </p>
            </div>
          </div>
          <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="size-4" />
                <h3 className="text-sm font-medium">Akses Terintegrasi</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Satu akun untuk mengakses berbagai aplikasi.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Cpu className="size-4" />
                <h3 className="text-sm font-medium">Manajemen Terpusat</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Pengaturan akun dan hak akses dilakukan dari satu titik.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="size-4" />
                <h3 className="text-sm font-medium">Perlindungan Data Terintegrasi</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Standar keamanan terkini menjaga kerahasiaan data.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4" />

                <h3 className="text-sm font-medium">Kemudahan Penggunaan</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Antarmuka intuitif yang menyederhanakan proses login.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
