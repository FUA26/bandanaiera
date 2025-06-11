"use client";

import {useState} from "react";
import Image from "next/image";

import {Button} from "@/components/ui/button";

const links = [
  {href: "/#beranda", name: "Beranda", badgeCount: 0},
  {href: "/#tentang", name: "Tentang SSO", badgeCount: 0},
  {href: "/#aplikasi", name: "Aplikasi", badgeCount: 4},
  {href: "/#kontak", name: "Hubungi Kami", badgeCount: 0},
];

export default function NavBar() {
  const [menu, setMenu] = useState(false);
  const toggleMenu = () => setMenu(!menu);

  return (
    <div className="z-20 mt-20 scroll-smooth md:sticky md:top-0 md:mt-0 md:shadow-none">
      {/* DESKTOP */}
      <div className="hidden bg-white p-4 transition-all duration-300 ease-in-out animate-in fade-in zoom-in lg:block">
        <div className="mx-4 flex items-center justify-between">
          <a href="#beranda">
            <Image
              alt="logo"
              className="h-10"
              height={40}
              src="/images/full-login.png"
              width={160}
            />
          </a>
          <div className="flex select-none items-center gap-8 text-[16px] xl:gap-12">
            {links.map((item, index) => (
              <a
                key={index}
                className="group flex items-center gap-2 font-medium text-gray-700 transition-colors hover:text-primary"
                href={item.href}
              >
                <span className="relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 group-hover:after:w-full">
                  {item.name}
                </span>
                {item.badgeCount > 0 && (
                  <div className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                    {item.badgeCount}
                  </div>
                )}
              </a>
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
        className={`fixed top-0 z-[999] w-full bg-white py-4 shadow-sm transition-all duration-300 ease-in-out animate-in fade-in zoom-in lg:hidden ${menu ? "bg-primary py-2" : ""}`}
      >
        <div className="mx-4 flex items-center justify-between">
          <a href="#beranda">
            <Image
              alt="logo"
              className="h-10"
              height={40}
              src="/images/full-login.png"
              width={160}
            />
          </a>
          <button onClick={toggleMenu}>
            <Image
              alt="menu"
              className="cursor-pointer"
              height={24}
              src={menu ? "/images/close.svg" : "/images/menu.svg"}
              width={24}
            />
          </button>
        </div>

        {menu && (
          <div className="my-6 animate-in slide-in-from-right">
            <div className="mx-4 mt-6 flex flex-col gap-6">
              {links.map((item, index) => (
                <a
                  key={index}
                  className="group flex items-center gap-2 font-medium text-white transition-colors hover:underline"
                  href={item.href}
                  onClick={() => setMenu(false)}
                >
                  <span>{item.name}</span>
                  {item.badgeCount > 0 && (
                    <div className="flex size-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-primary">
                      {item.badgeCount}
                    </div>
                  )}
                </a>
              ))}

              <div className="mt-6 flex flex-col gap-4">
                <a href="/auth/register">
                  <Button
                    className="w-full border-white text-white hover:bg-white hover:text-primary"
                    variant="outline"
                  >
                    Daftar
                  </Button>
                </a>
                <a href="/auth/login">
                  <Button className="w-full bg-white text-primary hover:bg-slate-100">Masuk</Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
