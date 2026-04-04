"use client";

/**
 * Categories Table Component
 *
 * Table component for displaying and managing service categories
 */

import { CategoryDialog } from "@/components/admin/category-dialog";
import { useCan } from "@/lib/rbac-client/hooks";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ServiceCategoryInput } from "@/lib/services/validations";
import { DataTable } from "@/components/data-table";
import { serviceCategoryColumns, type ServiceCategory } from "@/components/data-table/columns/service-categories";
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

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  bgColor: string;
  showInMenu: boolean;
  order: number;
  _count: {
    services: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface CategoriesTableProps {
  categories: Category[];
  onRefresh?: () => void;
}

export function CategoriesTable({ categories: initialCategories, onRefresh }: CategoriesTableProps) {
  const [categories, setCategories] = useState<ServiceCategory[]>(
    initialCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      color: cat.color,
      bgColor: cat.bgColor,
      showInMenu: cat.showInMenu,
      order: cat.order,
      _count: cat._count,
    }))
  );
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState<{ open: boolean; categoryId: string; category: Category }>({
    open: false,
    categoryId: "",
    category: null as any,
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; categoryId: string; categoryName: string; serviceCount: number }>({
    open: false,
    categoryId: "",
    categoryName: "",
    serviceCount: 0,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const canUpdateAny = useCan(["CONTENT_UPDATE_ANY"]);
  const canDeleteAny = useCan(["CONTENT_DELETE_ANY"]);
  const canCreate = useCan(["CONTENT_CREATE"]);

  // Listen for create event from button
  useEffect(() => {
    const handleOpenCreate = () => setCreateDialog(true);
    window.addEventListener('open-category-create', handleOpenCreate);
    return () => window.removeEventListener('open-category-create', handleOpenCreate);
  }, []);

  // Handle events from DataTable
  useEffect(() => {
    const handleEdit = (e: CustomEvent<ServiceCategory>) => {
      const category = categories.find((c) => c.id === e.detail.id);
      if (category) {
        setEditDialog({
          open: true,
          categoryId: category.id,
          category: {
            ...category,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
    };

    const handleDelete = (e: CustomEvent<ServiceCategory>) => {
      setDeleteDialog({
        open: true,
        categoryId: e.detail.id,
        categoryName: e.detail.name,
        serviceCount: e.detail._count.services,
      });
    };

    window.addEventListener('edit-service-category', handleEdit as EventListener);
    window.addEventListener('delete-service-category', handleDelete as EventListener);

    return () => {
      window.removeEventListener('edit-service-category', handleEdit as EventListener);
      window.removeEventListener('delete-service-category', handleDelete as EventListener);
    };
  }, [categories]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/categories/${deleteDialog.categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete category");
      }

      toast.success("Category deleted successfully");
      setDeleteDialog({ open: false, categoryId: "", categoryName: "", serviceCount: 0 });

      // Refresh categories
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  const refreshCategories = async () => {
    const res = await fetch("/api/categories");
    if (res.ok) {
      const data = await res.json();
      setCategories(data.categories);
    }
    // Call parent refresh
    onRefresh?.();
  };

  return (
    <>
      <DataTable
        columns={serviceCategoryColumns}
        data={categories}
        filterKey="name"
        toolbarPlaceholder="Search categories..."
      />

      {/* Create Category Dialog */}
      <CategoryDialog
        open={createDialog}
        onOpenChange={setCreateDialog}
        mode="create"
        onSuccess={refreshCategories}
      />

      {/* Edit Category Dialog */}
      {editDialog.category && (
        <CategoryDialog
          open={editDialog.open}
          onOpenChange={(open) => setEditDialog({ ...editDialog, open })}
          mode="edit"
          categoryId={editDialog.categoryId}
          initialData={{
            name: editDialog.category.name,
            slug: editDialog.category.slug,
            icon: editDialog.category.icon,
            color: editDialog.category.color,
            bgColor: editDialog.category.bgColor,
            showInMenu: editDialog.category.showInMenu,
            order: editDialog.category.order,
          }}
          onSuccess={refreshCategories}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open, categoryId: "", categoryName: "", serviceCount: 0 })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialog.serviceCount > 0 ? (
                <>
                  Cannot delete "{deleteDialog.categoryName}" because it has {deleteDialog.serviceCount} service(s).
                  Please reassign or delete the services first.
                </>
              ) : (
                <>
                  Are you sure you want to delete "{deleteDialog.categoryName}"? This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {deleteDialog.serviceCount === 0 && (
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground"
              >
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Skeleton component (exported separately)
export function CategoriesTableSkeleton() {
  return (
    <div className="rounded-md border p-8">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-4 w-8 animate-pulse rounded bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-6 w-24 animate-pulse rounded bg-muted" />
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            <div className="flex items-center gap-2">
              <div className="h-4 w-8 animate-pulse rounded bg-muted" />
              <div className="h-5 w-16 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
