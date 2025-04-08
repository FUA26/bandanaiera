"use client";

import {useState} from "react";
import Link from "next/link";

import MainButton from "./MainButton";
// import { signIn, useSession, signOut } from "next-auth/react";

function NavBar() {
  const links = [
    {
      route: "/",
      name: "Beranda",
      badgeCount: 0,
    },
    {
      route: "/",
      name: "Tentang SSO",
      badgeCount: 0,
    },
    {
      route: "/",
      name: "Aplikasi",
      badgeCount: 4,
    },
    {
      route: "/",
      name: "Hubungi Kami",
      badgeCount: 0,
    },
  ];
  const [menu, setMenu] = useState(false);
  const toggleMenu = () => {
    setMenu(!menu);
  };
  // const {data: session} = useSession();

  return (
    <div className="z-20 mt-20 md:sticky md:top-0 md:mt-0 md:shadow-none">
      {/* DESKTOP */}
      <div className="hidden bg-white p-4 animate-in fade-in zoom-in lg:block">
        <div className="mx-4 flex items-center justify-between">
          <div>
            <img alt="logo" className="h-10" src="/images/full-login.png" />
          </div>
          <div className="flex select-none items-center gap-[20px] text-[16px] xl:gap-[50px]">
            {links.map((item, index) => (
              <div key={index} className="flex gap-2">
                <p
                  className={`text-gray flex cursor-pointer items-center gap-2 font-[500] hover:text-primary`}
                >
                  {item.name}
                </p>
                {item.badgeCount ? (
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary font-semibold text-white">
                    {item.badgeCount}
                  </div>
                ) : (
                  <div />
                )}
              </div>
            ))}
          </div>
          <div className="flex select-none items-center gap-[20px]">
            <Link href="/auth/register">
              <MainButton
                className="border border-[#EDEEF0] bg-white text-[#31373D] hover:bg-white"
                text="Daftar"
                width="contain"
              />
            </Link>

            {/* {session ? (
              <Button onClick={() => signOut()}>Keluar</Button>
            ) : (
              <Button onClick={() => signIn("keycloak")}>Masuk</Button>
            )} */}
            <Link href="/auth/login">
              <MainButton
                className="border-[#EDEEF0] bg-brand text-white hover:bg-brand"
                text="Masuk"
                width="contain"
              />
            </Link>
          </div>
        </div>
      </div>
      {/* MOBILE */}
      <div
        className={`fixed top-0 z-[999] block w-full bg-white py-4 shadow-sm animate-in fade-in zoom-in lg:hidden ${
          menu ? "bg-primary py-2" : ""
        } `}
      >
        <div className="mx-[10px] flex justify-between">
          <div className="flex select-none items-center gap-[50px] text-[16px]">
            <img alt="logo" className="h-10" src="/images/full-login.png" />
          </div>
          <div className="flex items-center gap-[40px]">
            {/* {menu ? (
              <X
                className="cursor-pointer text-black animate-in fade-in zoom-in"
                onClick={toggleMenu}
              />
            ) : (
              <img
                alt="logo"
                className="cursor-pointer animate-in fade-in zoom-in"
                src="/images/menu.svg"
                onClick={toggleMenu}
              />
            )} */}
          </div>
        </div>
        {menu ? (
          <div className="my-8 select-none animate-in slide-in-from-right">
            <div className="mx-4 mt-8 flex flex-col gap-8">
              {links.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <p
                    className={`text-gray flex cursor-pointer items-center gap-2 font-[500] hover:text-primary`}
                  >
                    {item.name}
                  </p>
                  {item.badgeCount ? (
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary font-semibold text-white">
                      {item.badgeCount}
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              ))}

              <div className="flex select-none flex-col gap-[20px]">
                <Link href="/auth/register">
                  <MainButton
                    className="border border-[#EDEEF0] bg-white text-[#31373D] hover:bg-white"
                    text="Daftar"
                    width="contain"
                  />
                </Link>

                <Link href="/auth/login">
                  <MainButton
                    className="border-[#EDEEF0] bg-accent text-white hover:bg-accent"
                    text="Masuk"
                    width="contain"
                  />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

export default NavBar;
