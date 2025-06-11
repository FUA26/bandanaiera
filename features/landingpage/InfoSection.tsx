import {Zap, Cpu, Sparkles, Lock} from "lucide-react";
import Image from "next/image";

export function InfoSection() {
  return (
    <section className="bg-background py-16 duration-700 animate-in fade-in md:py-32" id="tentang">
      <div className="mx-auto max-w-5xl space-y-12 px-6 md:space-y-20 lg:px-0">
        <h2 className="text-balance text-4xl font-bold leading-tight text-primary lg:text-5xl">
          Satu Login, Satu Akun untuk Semua
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:gap-20">
          <div className="relative w-full overflow-hidden">
            <Image
              fill
              priority
              alt="Ilustrasi Satu Login"
              className="object-contain" // atau "object-cover" jika kamu tetap ingin menutupi kontainer
              src="/images/about.png"
            />
          </div>

          <div className="space-y-5 leading-relaxed text-muted-foreground">
            <p>
              Mengelola banyak akun untuk berbagai layanan pemerintahan dapat menjadi tantangan.
              <span className="font-semibold text-foreground"> Satu Login </span>
              hadir sebagai solusi autentikasi tunggal
              <span className="font-semibold italic text-foreground"> (Single Sign-On / SSO) </span>
              yang memungkinkan akses mudah, cepat, dan aman ke seluruh layanan digital pemerintah
              dengan satu akun terpusat.
            </p>
            <p>
              Dikembangkan dengan standar keamanan tinggi, Satu Login memastikan data pengguna
              terlindungi dan memberikan pengalaman efisien dalam mengakses layanan publik.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {[
            {
              icon: <Zap className="size-5 text-primary" />,
              title: "Akses Terintegrasi",
              desc: "Satu akun untuk mengakses berbagai aplikasi.",
            },
            {
              icon: <Cpu className="size-5 text-primary" />,
              title: "Manajemen Terpusat",
              desc: "Pengaturan akun dan hak akses dilakukan dari satu titik.",
            },
            {
              icon: <Lock className="size-5 text-primary" />,
              title: "Perlindungan Data Terintegrasi",
              desc: "Standar keamanan terkini menjaga kerahasiaan data.",
            },
            {
              icon: <Sparkles className="size-5 text-primary" />,
              title: "Kemudahan Penggunaan",
              desc: "Antarmuka intuitif yang menyederhanakan proses login.",
            },
          ].map((item, idx) => (
            <div key={idx} className="space-y-2 rounded-lg p-4 transition-all hover:bg-muted">
              <div className="flex items-center gap-2">
                {item.icon}
                <h3 className="text-sm font-semibold">{item.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
