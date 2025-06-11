"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  return (
    <section className="scroll-py-16 bg-muted/50 py-16 md:scroll-py-32 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-y-12 px-2 lg:grid-cols-2 lg:gap-x-12">
          <div className="text-center lg:text-left">
            <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
              Punya
              <br className="hidden lg:block" />
              Pertanyaan?
            </h2>
            <p className="max-w-md text-muted-foreground">
              Lihat pertanyaan yang sering diajukan untuk memahami cara kerja Satu Login dengan
              lebih mudah.
            </p>
          </div>

          <div className="w-full sm:mx-auto sm:max-w-lg lg:mx-0">
            <Accordion collapsible className="w-full space-y-2" type="single">
              <AccordionItem value="item-1">
                <AccordionTrigger>Apa itu Satu Login?</AccordionTrigger>
                <AccordionContent>
                  Satu Login adalah sistem autentikasi tunggal (SSO) yang memungkinkan pengguna
                  mengakses berbagai layanan digital pemerintah dengan satu akun.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Apakah Satu Login aman digunakan?</AccordionTrigger>
                <AccordionContent>
                  Ya, Satu Login menggunakan standar keamanan melindungi data pengguna, termasuk:
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>Enkripsi data untuk memastikan informasi tetap aman.</li>
                    <li>Pemantauan aktivitas akun untuk mendeteksi akses mencurigakan.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Mengapa saya harus menggunakan Satu Login?</AccordionTrigger>
                <AccordionContent>
                  Menggunakan Satu Login memberikan berbagai manfaat, seperti:
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>Akses lebih mudah tanpa perlu login berulang kali ke layanan berbeda.</li>
                    <li>Keamanan lebih baik dengan perlindungan data yang terpusat.</li>
                    <li>Pengelolaan akun lebih praktis tanpa harus mengingat banyak kata sandi.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Siapa yang bisa menggunakan Satu Login?</AccordionTrigger>
                <AccordionContent>
                  Satu Login dapat digunakan oleh:
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                    <li>
                      Masyarakat umum yang ingin mengakses layanan pemerintahan secara praktis.
                    </li>
                    <li>
                      Pegawai pemerintah untuk mengakses sistem internal yang memerlukan autentikasi
                      aman.
                    </li>
                    <li>
                      Pengembang layanan yang ingin mengintegrasikan SSO ke dalam aplikasi mereka.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
