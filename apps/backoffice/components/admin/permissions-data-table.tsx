"use client";

/**
 * Permissions Data Table Component
 *
 * Enhanced table with sorting, filtering, pagination, and category filters
 * Using the new shared-data-table components
 */

import {
  DataTable,
  DataTableColumnHeader,
  DataTableFacetedFilter,
  DataTableViewOptions,
  type FacetedFilterOption,
} from "@/components/admin/data-table";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Add01Icon, Delete01Icon, Edit01Icon, MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";
import { PermissionDialog } from "./permission-dialog";

interface PermissionRecord {
  id: string;
  name: string;
  category: string;
  description: string | null;
  _count?: {
    rolePermissions: number;
  };
}

interface PermissionsDataTableProps {
  data: PermissionRecord[];
  onRefresh: () => void;
}

export function PermissionsDataTable({ data, onRefresh }: PermissionsDataTableProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<PermissionRecord | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState<PermissionRecord | null>(null);

  // Category filter options based on seed-permissions.ts
  const categoryOptions: FacetedFilterOption[] = [
    { label: "Pengguna", value: "USER" },
    { label: "Berkas", value: "FILE" },
    { label: "Admin", value: "ADMIN" },
    { label: "Peran", value: "ROLE" },
    { label: "Izin", value: "PERMISSION" },
  ];

  // Column definitions
  const columns: ColumnDef<PermissionRecord>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
          className="translate-y-[2px]"
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(!!e.target.checked)}
          className="translate-y-[2px]"
          aria-label={`Select ${row.original.name}`}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nama" />,
      cell: ({ row }) => (
        <code className="text-sm bg-muted px-2 py-1 rounded font-mono">{row.getValue("name")}</code>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kategori" />,
      cell: ({ row }) => <Badge variant="outline">{row.getValue("category")}</Badge>,
    },
    {
      accessorKey: "description",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Deskripsi" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.getValue("description") || "-"}</span>
      ),
    },
    {
      accessorKey: "usage",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Penggunaan" />,
      cell: ({ row }) => {
        const usageCount = row.original._count?.rolePermissions || 0;
        return (
          <div className="text-center">
            <Badge variant={usageCount > 0 ? "default" : "secondary"} className="font-mono">
              {usageCount}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const permission = row.original;
        const usageCount = permission._count?.rolePermissions || 0;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Aksi">
                <HugeiconsIcon icon={MoreVerticalIcon} className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setEditingPermission(permission);
                  setDialogOpen(true);
                }}
              >
                <HugeiconsIcon icon={Edit01Icon} className="mr-2 h-4 w-4" />
                Ubah
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setPermissionToDelete(permission);
                  setDeleteDialogOpen(true);
                }}
                className="text-destructive"
                disabled={usageCount > 0}
              >
                <HugeiconsIcon icon={Delete01Icon} className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
    },
  ];

  // Handle save
  const handleSave = async (data: { name: string; category: string; description?: string }) => {
    try {
      const url = editingPermission
        ? `/api/permissions/${editingPermission.id}`
        : "/api/permissions";
      const method = editingPermission ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Gagal menyimpan izin");
      }

      toast.success(
        editingPermission ? "Izin berhasil diupdate" : "Izin berhasil dibuat"
      );
      setDialogOpen(false);
      setEditingPermission(null);
      onRefresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal menyimpan izin";
      toast.error(message);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!permissionToDelete) return;

    try {
      const response = await fetch(`/api/permissions/${permissionToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Gagal menghapus izin");
      }

      toast.success("Izin berhasil dihapus");
      setDeleteDialogOpen(false);
      setPermissionToDelete(null);
      onRefresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal menghapus izin";
      toast.error(message);
    }
  };

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        toolbar={(table) => (
          <div className="flex items-center justify-between gap-4 flex-1">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Cari izin..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                className="max-w-sm"
              />
              <DataTableFacetedFilter
                title="Kategori"
                options={categoryOptions}
                column={table.getColumn("category")}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setCreateDialogOpen(true)}>
                <HugeiconsIcon icon={Add01Icon} className="mr-2 h-4 w-4" />
                Tambah Izin
              </Button>
              <DataTableViewOptions table={table} />
            </div>
          </div>
        )}
      />

      {/* Create/Edit Dialog */}
      <PermissionDialog
        open={createDialogOpen || dialogOpen}
        onOpenChange={(open) => {
          setCreateDialogOpen(open);
          setDialogOpen(open);
          if (!open) setEditingPermission(null);
        }}
        permission={editingPermission}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Izin</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus izin{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded">{permissionToDelete?.name}</code>?
              Tindakan ini tidak dapat dibatalkan.
              {permissionToDelete && (permissionToDelete._count?.rolePermissions || 0) > 0 && (
                <span className="block mt-2 text-destructive">
                  Izin ini ditugaskan ke {permissionToDelete._count?.rolePermissions}{" "}
                  peran dan tidak dapat dihapus. Hapus dari peran terlebih dahulu.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={
                permissionToDelete ? (permissionToDelete._count?.rolePermissions || 0) > 0 : false
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
