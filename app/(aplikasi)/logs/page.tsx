"use client";

import useSWR from "swr";

import {Skeleton} from "@/components/ui/skeleton";
import {DataTable} from "@/features/log/data-table";
import {columns} from "@/features/log/columns";

const fetcher = (url: string) => fetch(url, {credentials: "include"}).then((res) => res.json());

export default function AuditLogPage() {
  const {data, isLoading} = useSWR("/api/audit-log", fetcher);

  if (isLoading || !data?.events) {
    return <Skeleton className="h-48 w-full rounded-xl" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Log Aktivitas</h3>
        <p className="text-sm text-muted-foreground">
          Riwayat login, logout, dan perubahan profil akun Anda.
        </p>
      </div>
      <DataTable columns={columns} data={data.events} />
    </div>
  );
}
