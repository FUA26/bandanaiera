export function FaqSection() {
  return (
    <>
      <section className="scroll-py-16 py-16 md:scroll-py-32 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-y-12 px-2 lg:[grid-template-columns:1fr_auto]">
            <div className="text-center lg:text-left">
              <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
                Punya
                <br className="hidden lg:block" />
                Pertanyaan?
              </h2>
              <p>
                Lihat pertanyaan yang sering diajukan untuk memahami cara kerja Satu Login dengan
                lebih mudah.
              </p>
            </div>

            <div className="divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0">
              <div className="pb-6">
                <h3 className="font-medium">Apa itu Satu Login?</h3>
                <p className="mt-4 text-muted-foreground">
                  Satu Login adalah sistem autentikasi tunggal (SSO) yang memungkinkan pengguna
                  mengakses berbagai layanan digital pemerintah dengan satu akun.
                </p>
              </div>
              <div className="py-6">
                <h3 className="font-medium">Apakah Satu Login aman digunakan?</h3>
                <p className="my-4 text-muted-foreground">
                  Ya, Satu Login menggunakan standar keamanan melindungi data pengguna, termasuk:
                </p>
                <ul className="list-outside list-disc space-y-2 pl-4">
                  <li className="text-muted-foreground">
                    Enkripsi data untuk memastikan informasi tetap aman.
                  </li>
                  <li className="text-muted-foreground">
                    Pemantauan aktivitas akun untuk mendeteksi akses mencurigakan
                  </li>
                </ul>
              </div>
              <div className="py-6">
                <h3 className="font-medium">Mengapa saya harus menggunakan Satu Login?</h3>
                <p className="my-4 text-muted-foreground">
                  Menggunakan Satu Login memberikan berbagai manfaat, seperti:
                </p>
                <ul className="list-outside list-disc space-y-2 pl-4">
                  <li className="text-muted-foreground">
                    Akses lebih mudah tanpa perlu login berulang kali ke layanan berbeda.
                  </li>
                  <li className="text-muted-foreground">
                    Keamanan lebih baik dengan perlindungan data yang terpusat.
                  </li>
                  <li className="text-muted-foreground">
                    Pengelolaan akun lebih praktis tanpa harus mengingat banyak kata sandi.
                  </li>
                </ul>
              </div>
              <div className="py-6">
                <h3 className="font-medium">Siapa yang bisa menggunakan Satu Login?</h3>
                <p className="my-4 text-muted-foreground">Satu Login dapat digunakan oleh:</p>
                <ul className="list-outside list-disc space-y-2 pl-4">
                  <li className="text-muted-foreground">
                    Masyarakat umum yang ingin mengakses layanan pemerintahan secara praktis.
                  </li>
                  <li className="text-muted-foreground">
                    Pegawai pemerintah untuk mengakses sistem internal yang memerlukan autentikasi
                    aman.
                  </li>
                  <li className="text-muted-foreground">
                    Pengembang layanan yang ingin mengintegrasikan SSO ke dalam aplikasi mereka.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
