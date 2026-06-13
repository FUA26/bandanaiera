"use client";

/**
 * OPD Data Table Component
 *
 * Enhanced table with sorting, filtering, pagination
 * Using the shared-data-table components
 */

import {
  DataTable,
  DataTableColumnHeader,
  DataTableFacetedFilter,
  type FacetedFilterOption,
} from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCan } from "@/lib/rbac-client/hooks";
import { Edit01Icon, Delete01Icon, MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Opd {
  id: string;
  name: string;
  nickname: string;
  category: string;
  status: string;
  logo: { cdnUrl: string } | null;
  _count: { servicesAsOwner: number };
}

interface OpdDataTableProps {
  opds: Opd[];
  onRefresh?: () => void;
}

export function OpdDataTable({ opds, onRefresh }: OpdDataTableProps) {
  const router = useRouter();
  const canUpdate = useCan(["OPD_EDIT"]);
  const canDelete = useCan(["OPD_DELETE"]);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; opd: Opd | null }>({
    open: false,
    opd: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Category filter options
  const categoryOptions: FacetedFilterOption[] = [
    { label: "Dinas", value: "DINAS" },
    { label: "Badan", value: "BADAN" },
    { label: "Kecamatan", value: "KECAMATAN" },
    { label: "Kelurahan", value: "KELURAHAN" },
    { label: "Desa", value: "DESA" },
    { label: "Bagian", value: "BAGIAN" },
    { label: "Organisasi Lainnya", value: "ORGANISASI_LAINNYA" },
  ];

  // Status filter options
  const statusOptions: FacetedFilterOption[] = [
    { label: "Aktif", value: "AKTIF" },
    { label: "Tidak Aktif", value: "NONAKTIF" },
  ];

  const handleDelete = async () => {
    if (!deleteDialog.opd) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/opd/${deleteDialog.opd.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal menghapus OPD');
      }

      toast.success('OPD berhasil dihapus');
      setDeleteDialog({ open: false, opd: null });
      onRefresh?.();
      router.refresh();
    } catch (error: any) {
      console.error('Error deleting OPD:', error);
      toast.error(error.message || 'Gagal menghapus OPD');
    } finally {
      setIsDeleting(false);
    }
  };

  // Column definitions
  const columns: ColumnDef<Opd>[] = [
    {
      accessorKey: "logo",
      header: "Logo",
      cell: ({ row }) => {
        const opd = row.original;
        return (
          <Avatar className="h-10 w-10">
            <AvatarImage src={opd.logo?.cdnUrl || undefined} />
            <AvatarFallback>{opd.nickname.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nama" />,
      cell: ({ row }) => {
        const opd = row.original;
        return (
          <div>
            <div className="font-medium">{opd.name}</div>
            <div className="text-sm text-muted-foreground">{opd.nickname}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kategori" />,
      cell: ({ row }) => {
        const category = row.getValue("category") as string;
        return <Badge variant="outline">{category.replace("_", " ")}</Badge>;
      },
      filterFn: (row, columnId, filterValue: string[]) => {
        const category = row.getValue(columnId) as string;
        return filterValue.includes(category);
      },
    },
    {
      accessorKey: "_count.servicesAsOwner",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Layanan" />,
      cell: ({ row }) => {
        const count = row.original._count.servicesAsOwner;
        return <span className="text-sm">{count}</span>;
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "AKTIF" ? "default" : "secondary"}>
            {status === "AKTIF" ? "Aktif" : "Tidak Aktif"}
          </Badge>
        );
      },
      filterFn: (row, columnId, filterValue: string[]) => {
        const status = row.getValue(columnId) as string;
        return filterValue.includes(status);
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const opd = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Actions"
                onClick={(e) => e.stopPropagation()}
              >
                <HugeiconsIcon icon={MoreVerticalIcon} className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canUpdate && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/manage/opd/${opd.id}`);
                  }}
                >
                  <HugeiconsIcon icon={Edit01Icon} className="mr-2 h-4 w-4" />
                  Ubah
                </DropdownMenuItem>
              )}
              {canDelete && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteDialog({ open: true, opd });
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <HugeiconsIcon icon={Delete01Icon} className="mr-2 h-4 w-4" />
                  Hapus
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={opds}
        filterableColumns={[
          {
            id: "category",
            title: "Kategori",
            options: categoryOptions,
          },
          {
            id: "status",
            title: "Status",
            options: statusOptions,
          },
        ]}
        searchableColumns={["name", "nickname"]}
        onRowClick={(row) => router.push(`/manage/opd/${row.original.id}`)}
      />

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, opd: deleteDialog.opd })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus OPD</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus OPD <strong>{deleteDialog.opd?.name}</strong>?
              {deleteDialog.opd?._count.servicesAsOwner > 0 && (
                <span className="block mt-2 text-destructive">
                  ⚠️ OPD ini memiliki {deleteDialog.opd._count.servicesAsOwner} layanan terkait.
                  Layanan tersebut tidak akan dihapus.
                </span>
              )}
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
