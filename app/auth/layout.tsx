import React from "react";

export default function OauthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full lg:grid lg:grid-cols-2">
      <div className="mx-auto flex min-h-screen w-[350px] flex-col justify-center gap-y-6 py-12">
        {children}
      </div>
      <div className="hidden flex-col justify-center bg-muted bg-gradient-to-r from-blue-400 to-blue-800 px-12 lg:flex">
        <h1 className="text-right text-3xl text-white">
          Satu <strong>Login</strong> untuk <br />
          Semua Aplikasi dan Layanan <br />
          Pemerintah Kabupaten Malang
        </h1>
      </div>
    </div>
  );
}
