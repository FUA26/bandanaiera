export function IntegrationSection() {
  return (
    <>
      <section className="bg-slate-100 py-12 dark:bg-slate-900/50 md:py-20">
        <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
          <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
            <h2 className="text-4xl font-medium lg:text-5xl">Aplikasi Terintegrasi</h2>
            <p>
              Satu Login memungkinkan Anda terhubung ke beragam aplikasi pemerintahan dengan satu
              langkah. Nikmati kemudahan akses dan efisiensi dalam setiap layanan digital.
            </p>
          </div>

          <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-3">
            <div className="flex items-center gap-4 space-y-3">
              <img alt="E-Pkk Logo" className="size-16" src="/images/logo/epkk.png" />
              <div className="flex flex-col">
                <h3 className="text-2xl font-medium">E-Pkk</h3>
                <a
                  className="text-sm text-muted-foreground underline underline-offset-4"
                  href="https://e-pkk.malangkab.go.id/"
                >
                  Kunjungi Website
                </a>
                {/* <p className="text-sm text-muted-foreground">Kunjungi Website</p> */}
              </div>
            </div>
            <div className="flex items-center gap-4 space-y-3">
              <img alt="E-Pkk Logo" className="size-16" src="/images/logo/masdeka.png" />
              <div className="flex flex-col">
                <h3 className="text-2xl font-medium">Masdeka</h3>
                <a
                  className="text-sm text-muted-foreground underline underline-offset-4"
                  href="https://masdeka.malangkab.go.id/"
                >
                  Kunjungi Website
                </a>
                {/* <p className="text-sm text-muted-foreground">Kunjungi Website</p> */}
              </div>
            </div>
            <div className="flex items-center gap-4 space-y-3">
              {/* <Sparkles className="size-16" /> */}

              <img alt="E-Pkk Logo" className="size-16" src="/images/logo/comming-soon.png" />
              <div className="flex flex-col">
                <h3 className="text-2xl font-medium">Segera Hadir</h3>

                {/* <p className="text-sm text-muted-foreground">Kunjungi Website</p> */}
              </div>
            </div>

            {/* <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4" />

                <h3 className="text-sm font-medium">Kemudahan Penggunaan</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Antarmuka intuitif yang menyederhanakan proses login.
              </p>
            </div> */}
          </div>
        </div>
      </section>
    </>
  );
}
