import Link from "next/link";

const links = [
  {
    group: "Menu",
    items: [
      {
        title: "Beranda",
        href: "#",
      },
      {
        title: "Tentang SSO",
        href: "#",
      },
      {
        title: "Aplikasi",
        href: "#",
      },
      {
        title: "Hubungi Kami",
        href: "#",
      },
    ],
  },
  {
    group: "Aplikasi",
    items: [
      {
        title: "EPKK",
        href: "#",
      },
      {
        title: "Masdeka",
        href: "#",
      },
      {
        title: "Dasting",
        href: "#",
      },
    ],
  },
  {
    group: "Tautan",
    items: [
      {
        title: "Kabupaten Malang",
        href: "https://malangkab.go.id",
      },
      {
        title: "Diskominfo Malang Kab",
        href: "https://kominfo.malangkab.go.id/",
      },
    ],
  },
  {
    group: "Legal",
    items: [
      {
        title: "Kebijakan Privasi",
        href: "/privacy",
      },
      {
        title: "Syarat & Ketentuan",
        href: "/terms",
      },
    ],
  },
];

export default function FooterSection() {
  return (
    <footer className="border-b bg-slate-200 pt-20 dark:bg-transparent" id="kontak">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link aria-label="Go home" className="block size-fit" href="/">
              <img alt="logo" className="h-10" src="/images/full-login.png" />
            </Link>
            <div className="mt-4 text-muted-foreground">
              <p className="my-2 text-sm font-medium">Jl. K.H. Agus Salim No. 7 Malang 65119</p>
              <p className="my-2 text-sm">
                ✉️{" "}
                <Link className="hover:text-primary" href="mailto:kominfo@malangkab.go.id">
                  kominfo@malangkab.go.id
                </Link>
              </p>
              <p className="my-2 text-sm">
                📞{" "}
                <Link className="hover:text-primary" href="tel:+62341364776">
                  (0341) 364776
                </Link>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 md:col-span-3">
            {links.map((link, index) => (
              <div key={index} className="space-y-4 text-sm">
                <span className="block font-medium">{link.group}</span>
                {link.items.map((item, index) => (
                  <Link
                    key={index}
                    className="block text-muted-foreground duration-150 hover:text-primary"
                    href={item.href}
                  >
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t py-6">
          <span className="order-last block text-center text-sm text-muted-foreground md:order-first">
            © {new Date().getFullYear()} Dinas Komunikasi dan Informatika, All rights reserved
          </span>
          <div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last">
            <Link
              aria-label="X/Twitter"
              className="block text-muted-foreground hover:text-primary"
              href="https://twitter.com/pemkab_malang"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                className="size-6"
                height="1em"
                viewBox="0 0 24 24"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"
                  fill="currentColor"
                />
              </svg>
            </Link>

            <Link
              aria-label="Facebook"
              className="block text-muted-foreground hover:text-primary"
              href="https://www.facebook.com/malangkab/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                className="size-6"
                height="1em"
                viewBox="0 0 24 24"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"
                  fill="currentColor"
                />
              </svg>
            </Link>
            <Link
              aria-label="YouTube"
              className="block text-muted-foreground hover:text-primary"
              href="https://www.youtube.com/user/HumasKabMalang"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                className="size-6"
                height="1em"
                viewBox="0 0 24 24"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.6 3.2H4.4A3.4 3.4 0 0 0 1 6.6v10.8a3.4 3.4 0 0 0 3.4 3.4h15.2a3.4 3.4 0 0 0 3.4-3.4V6.6a3.4 3.4 0 0 0-3.4-3.4M10 15.5V8.5l6 3.5z"
                  fill="currentColor"
                />
              </svg>
            </Link>
            <Link
              aria-label="Instagram"
              className="block text-muted-foreground hover:text-primary"
              href="https://www.instagram.com/malangkab/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                className="size-6"
                height="1em"
                viewBox="0 0 24 24"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
                  fill="currentColor"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
