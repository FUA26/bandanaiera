"use client";

/**
 * Services Data Table Component
 *
 * Enhanced table with sorting, filtering, pagination, and bulk actions
 * Using the shared-data-table components
 */

import {
  DataTable,
  DataTableActionBar,
  DataTableColumnHeader,
  DataTableFacetedFilter,
  DataTableViewOptions,
  type FacetedFilterOption,
} from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SyncButton } from "@/components/admin/sync-button";
import { useCan } from "@/lib/rbac-client/hooks";
import { Delete01Icon, Edit01Icon, MoreVerticalIcon, EyeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SERVICE_STATUS_LABELS, ServiceStatus } from "@/lib/services/types";
import { ServiceDialog } from "@/components/admin/service-dialog";
import type { ServiceInput } from "@/lib/services/validations";
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

interface Service {
  id: string;
  slug: string;
  icon: string;
  name: string;
  description: string;
  categoryId: string;
  badge?: string | null;
  stats?: string | null;
  showInMenu: boolean;
  order: number;
  isIntegrated: boolean;
  status: ServiceStatus;
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    color: string;
    bgColor: string;
  };
  createdBy: {
    id: string;
    name: string | null;
    email: string;
  };
  updatedBy?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ServicesDataTableProps {
  services: Service[];
  categories: Array<{ id: string; name: string; slug: string }>;
  onRefresh?: () => void;
}

export function ServicesDataTable({ services, categories, onRefresh }: ServicesDataTableProps) {
  const router = useRouter();
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState<{ open: boolean; serviceId: string; service: Service }>({
    open: false,
    serviceId: "",
    service: null as any,
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; serviceId: string; serviceName: string }>({
    open: false,
    serviceId: "",
    serviceName: "",
  });
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  const canUpdateAny = useCan(["CONTENT_UPDATE_ANY"]);
  const canDeleteAny = useCan(["CONTENT_DELETE_ANY"]);
  const canPublish = useCan(["CONTENT_PUBLISH"]);

  // Status filter options
  const statusOptions: FacetedFilterOption[] = [
    { label: "Draft", value: "DRAFT" },
    { label: "Published", value: "PUBLISHED" },
    { label: "Archived", value: "ARCHIVED" },
  ];

  // Category filter options
  const categoryOptions: FacetedFilterOption[] = categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  // Status badge color
  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Column definitions
  const columns: ColumnDef<Service>[] = [
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
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        const service = row.original;
        return (
          <div className="flex items-center gap-3">
            {service.icon && (
              <span className="flex h-8 w-8 items-center justify-center rounded bg-muted text-sm">
                {service.icon.charAt(0)}
              </span>
            )}
            <div>
              <div className="font-medium">{service.name}</div>
              <div className="text-xs text-muted-foreground">{service.slug}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      cell: ({ row }) => {
        const category = row.original.category;
        return (
          <Badge variant="outline" style={{ backgroundColor: category.bgColor, color: category.color }}>
            {category.name}
          </Badge>
        );
      },
      filterFn: (row, columnId, filterValue: string[]) => {
        const categoryId = row.original.categoryId;
        return filterValue.includes(categoryId);
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge className={getStatusColor(status)}>
            {SERVICE_STATUS_LABELS[status]}
          </Badge>
        );
      },
      filterFn: (row, columnId, filterValue: string[]) => {
        const status = row.original.status;
        return filterValue.includes(status);
      },
    },
    {
      accessorKey: "showInMenu",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Show in Menu" />,
      cell: ({ row }) => (
        <span className={row.original.showInMenu ? "text-green-600" : "text-gray-400"}>
          {row.original.showInMenu ? "Yes" : "No"}
        </span>
      ),
    },
    {
      accessorKey: "order",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Order" />,
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.order}</span>,
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Updated" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue("updatedAt"));
        return <span className="text-sm text-muted-foreground">{date.toLocaleDateString()}</span>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const service = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Actions">
                <HugeiconsIcon icon={MoreVerticalIcon} className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.open(`/layanan/${service.slug}`, '_blank')}>
                <HugeiconsIcon icon={EyeIcon} className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              {canUpdateAny && (
                <DropdownMenuItem onClick={() => setEditDialog({ open: true, serviceId: service.id, service })}>
                  <HugeiconsIcon icon={Edit01Icon} className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {canPublish && service.status !== "PUBLISHED" && (
                <DropdownMenuItem onClick={() => handlePublish(service.id)}>
                  Publish
                </DropdownMenuItem>
              )}
              {canPublish && service.status === "PUBLISHED" && (
                <DropdownMenuItem onClick={() => handleUnpublish(service.id)}>
                  Unpublish
                </DropdownMenuItem>
              )}
              {canDeleteAny && (
                <DropdownMenuItem
                  onClick={() => setDeleteDialog({ open: true, serviceId: service.id, serviceName: service.name })}
                  className="text-destructive focus:text-destructive"
                >
                  <HugeiconsIcon icon={Delete01Icon} className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
    },
  ];

  const handlePublish = async (serviceId: string) => {
    try {
      const response = await fetch(`/api/services/${serviceId}/publish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        onRefresh?.();
      }
    } catch (error) {
      console.error("Error publishing service:", error);
    }
  };

  const handleUnpublish = async (serviceId: string) => {
    try {
      const response = await fetch(`/api/services/${serviceId}/publish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DRAFT" }),
      });
      if (response.ok) {
        onRefresh?.();
      }
    } catch (error) {
      console.error("Error unpublishing service:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/services/${deleteDialog.serviceId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setDeleteDialog({ open: false, serviceId: "", serviceName: "" });
        onRefresh?.();
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  return (
    <>
      <DataTable
        data={services}
        columns={columns}
        toolbar={(table) => (
          <div className="flex items-center justify-between gap-4 flex-1">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Filter services..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                className="max-w-sm"
              />
              <DataTableFacetedFilter
                title="Status"
                options={statusOptions}
                column={table.getColumn("status")}
              />
              <DataTableFacetedFilter
                title="Category"
                options={categoryOptions}
                column={table.getColumn("category")}
              />
            </div>
            <div className="flex items-center gap-2">
              {canUpdateAny && (
                <Button onClick={() => setCreateDialog(true)} size="sm">
                  <HugeiconsIcon icon={Add01Icon} className="h-4 w-4 mr-2" />
                  New Service
                </Button>
              )}
              {canUpdateAny && <SyncButton onSyncComplete={onRefresh} />}
              <DataTableViewOptions table={table} />
            </div>
          </div>
        )}
        actionBar={(table) => (
          <DataTableActionBar table={table}>
            {() => (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const selectedIds = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.original.id);
                    setSelectedServiceIds(selectedIds);
                    // Handle bulk actions
                  }}
                >
                  Bulk Actions
                </Button>
              </div>
            )}
          </DataTableActionBar>
        )}
      />

      {/* Create Service Dialog */}
      <ServiceDialog
        open={createDialog}
        onOpenChange={setCreateDialog}
        mode="create"
        categories={categories}
        onSuccess={() => {
          setCreateDialog(false);
          onRefresh?.();
        }}
      />

      {/* Edit Service Dialog */}
      {editDialog.service && (
        <ServiceDialog
          open={editDialog.open}
          onOpenChange={(open) => setEditDialog({ ...editDialog, open })}
          mode="edit"
          serviceId={editDialog.serviceId}
          initialData={{
            name: editDialog.service.name,
            slug: editDialog.service.slug,
            icon: editDialog.service.icon,
            description: editDialog.service.description,
            categoryId: editDialog.service.categoryId,
            badge: editDialog.service.badge ?? undefined,
            stats: editDialog.service.stats ?? undefined,
            showInMenu: editDialog.service.showInMenu,
            order: editDialog.service.order,
            isIntegrated: editDialog.service.isIntegrated,
            status: editDialog.service.status,
            detailedDescription: (editDialog.service as any).detailedDescription ?? undefined,
            requirements: (editDialog.service as any).requirements ?? undefined,
            process: (editDialog.service as any).process ?? undefined,
            duration: (editDialog.service as any).duration ?? undefined,
            cost: (editDialog.service as any).cost ?? undefined,
            contactInfo: (editDialog.service as any).contactInfo ?? undefined,
            faqs: (editDialog.service as any).faqs ?? undefined,
            downloadForms: (editDialog.service as any).downloadForms ?? undefined,
            relatedServices: (editDialog.service as any).relatedServices ?? undefined,
          }}
          categories={categories}
          onSuccess={() => {
            setEditDialog({ open: false, serviceId: "", service: null as any });
            onRefresh?.();
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, serviceId: "", serviceName: "" })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog.serviceName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
