"use client";

import {ColumnDef} from "@tanstack/react-table";

export type AuditLog = {
  id: string;
  time: string;
  type: string;
  ipAddress: string;
  clientId: string;
};

export const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "time",
    header: "Waktu",
    cell: ({row}) => {
      const date = new Date(row.getValue("time"));

      return date.toLocaleString();
    },
  },
  {
    accessorKey: "type",
    header: "Tipe",
  },
  {
    accessorKey: "ipAddress",
    header: "IP Address",
  },
  {
    accessorKey: "clientId",
    header: "Client",
  },
];
