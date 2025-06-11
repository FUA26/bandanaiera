"use client";

import {useState} from "react";
import {Menu, X} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {Button} from "@/components/ui/button";

function NavBar() {
  const links = [
    {href: "#beranda", name: "Beranda", badgeCount: 0},
    {href: "#tentang", name: "Tentang SSO", badgeCount: 0},
    {href: "#aplikasi", name: "Aplikasi", badgeCount: 4},
    {href: "#kontak", name: "Hubungi Kami", badgeCount: 0},
  ];
  const [menu, setMenu] = useState(false);
  const toggleMenu = () => setMenu(!menu);

  return (
    <div className="z-20 mt-20 md:sticky md:top-0 md:mt-0 md:shadow-none">
      {/* DESKTOP */}
      <div className="hidden bg-white p-4 animate-in fade-in zoom-in lg:block">
        <div className="mx-4 flex items-center justify-between">
          <Link href="/">
            <Image
              alt="logo1"
              className="h-10"
              height={40}
              src="/images/full-login.png"
              width={160}
            />
          </Link>

          <div className="flex items-center gap-[20px] text-[16px] xl:gap-[50px]">
            {links.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <p className="cursor-pointer font-medium hover:text-primary">{item.name}</p>
                {item.badgeCount > 0 && (
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary font-semibold text-white">
                    {item.badgeCount}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a href="/auth/register">
              <Button className="border-[#EDEEF0] text-[#31373D] hover:bg-white" variant="outline">
                Daftar
              </Button>
            </a>
            <a href="/auth/login">
              <Button className="bg-brand text-white hover:bg-brand">Masuk</Button>
            </a>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div
        className={`fixed top-0 z-[999] block w-full bg-white py-4 shadow-sm animate-in fade-in zoom-in lg:hidden ${
          menu ? "bg-primary py-2" : ""
        }`}
      >
        <div className="mx-[10px] flex justify-between">
          <Link href="/">
            <Image
              alt="logo2"
              className="h-10"
              height={40}
              src="/images/full-login.png"
              width={160}
            />
          </Link>

          <div className="flex items-center gap-[40px]">
            {menu ? (
              <X
                className="cursor-pointer text-black animate-in fade-in zoom-in"
                onClick={toggleMenu}
              />
            ) : (
              <Menu
                className="cursor-pointer text-black animate-in fade-in zoom-in"
                onClick={toggleMenu}
              />
            )}
          </div>
        </div>

        {menu && (
          <div className="mx-4 my-8 flex flex-col gap-8 animate-in slide-in-from-right">
            {links.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <p className="cursor-pointer font-medium hover:text-primary">{item.name}</p>
                {item.badgeCount > 0 && (
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary font-semibold text-white">
                    {item.badgeCount}
                  </div>
                )}
              </div>
            ))}

            <div className="flex flex-col gap-4">
              <a href="/auth/register">
                <Button className="w-full" variant="outline">
                  Daftar
                </Button>
              </a>
              <a href="/auth/login">
                <Button className="w-full bg-brand text-white hover:bg-brand">Masuk</Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
