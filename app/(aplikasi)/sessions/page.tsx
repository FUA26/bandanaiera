"use client";

import useSWR from "swr";
import {useSession} from "next-auth/react";
import {toast} from "sonner";
import React from "react";

import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Skeleton} from "@/components/ui/skeleton";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

const fetcher = (url: string) => fetch(url, {credentials: "include"}).then((res) => res.json());

export default function ActiveSessionsPage() {
  const {data: session} = useSession();
  const {data, mutate, isLoading} = useSWR("/api/sessions", fetcher);

  async function handleLogoutSession(sessionId: string) {
    const res = await fetch(`/api/sessions?id=${sessionId}`, {method: "DELETE"});

    if (res.ok) {
      toast.success("Sesi berhasil dikeluarkan.");
      mutate();
    } else {
      toast.error("Gagal mengeluarkan sesi.");
    }
  }

  async function handleLogoutAll() {
    const res = await fetch("/api/sessions", {method: "POST"});

    if (res.ok) {
      toast.success("Semua sesi berhasil di-logout.");
      mutate();
    } else {
      toast.error("Gagal logout semua sesi.");
    }
  }

  const currentSessionId = session?.user.id ?? "";

  const columns = [
    {title: "Waktu Login", className: "whitespace-nowrap min-w-[160px]"},
    {title: "IP Address", className: "whitespace-nowrap min-w-[120px]"},
    {title: "Aplikasi Client", className: "min-w-[180px]"},
    {title: "Aksi", className: "text-center min-w-[80px]"},
  ];

  if (isLoading || !data?.sessions) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Sesi Aktif</h3>
            <p className="text-sm text-muted-foreground">Daftar sesi login aktif dari akun Anda.</p>
          </div>
          <Skeleton className="h-8 w-32 rounded-md" />
        </div>
        <Separator />
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col, i) => (
                  <TableHead key={i} className={col.className}>
                    {col.title}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-20 rounded" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-medium">Sesi Aktif</h3>
          <p className="text-sm text-muted-foreground">Daftar sesi login aktif dari akun Anda.</p>
        </div>
        <Button size="sm" variant="destructive" onClick={handleLogoutAll}>
          Logout Semua
        </Button>
      </div>
      <Separator />

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, i) => (
                <TableHead key={i} className={col.className}>
                  {col.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.sessions.length === 0 ? (
              <TableRow>
                <TableCell className="text-center text-muted-foreground" colSpan={4}>
                  Tidak ada sesi aktif.
                </TableCell>
              </TableRow>
            ) : (
              data.sessions.map((session: any) => {
                const isCurrent = session.id === currentSessionId;

                return (
                  <TableRow
                    key={session.id}
                    className={isCurrent ? "bg-green-50 hover:bg-green-100" : ""}
                  >
                    <TableCell>{new Date(session.start).toLocaleString()}</TableCell>
                    <TableCell>{session.ipAddress}</TableCell>
                    <TableCell className="flex flex-wrap gap-1 py-2">
                      {session.clients && typeof session.clients === "object" ? (
                        Object.entries(session.clients).map(([id, name]) => (
                          <span
                            key={id}
                            className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                          >
                            {name as React.ReactNode}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {isCurrent ? (
                        <span className="text-xs font-semibold text-green-600">Sesi ini</span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLogoutSession(session.id)}
                        >
                          Logout
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
