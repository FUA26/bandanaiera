"use client";

import useSWR from "swr";

import {Skeleton} from "@/components/ui/skeleton";
import {DataTable} from "@/features/log/data-table";
import {columns} from "@/features/log/columns";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Separator} from "@/components/ui/separator";

const fetcher = (url: string) => fetch(url, {credentials: "include"}).then((res) => res.json());

export default function AuditLogPage() {
  const {data, isLoading} = useSWR("/api/audit-log", fetcher);

  if (isLoading || !data?.events) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Log Aktivitas</h3>
            <p className="text-sm text-muted-foreground">
              Riwayat login, logout, dan perubahan profil akun Anda.
            </p>
          </div>
        </div>
        <Separator />
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Client</TableHead>
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
      <div>
        <h3 className="text-lg font-medium">Log Aktivitas</h3>
        <p className="text-sm text-muted-foreground">
          Riwayat login, logout, dan perubahan profil akun Anda.
        </p>
      </div>

      <Separator />
      <DataTable columns={columns} data={data.events} />
    </div>
  );
}
