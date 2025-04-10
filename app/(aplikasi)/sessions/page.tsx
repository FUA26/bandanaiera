"use client";

import useSWR from "swr";
import {useSession} from "next-auth/react";
import {toast} from "sonner";

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

  if (isLoading || !data?.sessions) {
    return <Skeleton className="h-48 w-full rounded-xl" />;
  }

  const currentSessionId = session?.user.id ?? "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
              <TableHead className="w-40">Login</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="w-24">Aksi</TableHead>
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
                    <TableCell>{session.clientId}</TableCell>
                    <TableCell>
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
