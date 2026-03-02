"use client";

/**
 * Categories Table Component
 *
 * Table component for displaying and managing service categories
 */

import { CategoryDialog } from "@/components/admin/category-dialog";
import { useCan } from "@/lib/rbac-client/hooks";
import { Plus, Trash2, Edit, MoreVertical, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ServiceCategoryInput } from "@/lib/services/validations";

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
  const [categories, setCategories] = useState<Category[]>(initialCategories);
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

  const handleToggleMenu = async (categoryId: string, newValue: boolean) => {
    try {
      // Optimistic update
      setCategories((prev) =>
        prev.map((c) => (c.id === categoryId ? { ...c, showInMenu: newValue } : c))
      );

      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showInMenu: newValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      toast.success("Category menu status updated");
    } catch (error) {
      // Revert on error
      toast.error("Failed to update status");
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
      }
    }
  };

  // Listen for create event from button
  useEffect(() => {
    const handleOpenCreate = () => setCreateDialog(true);
    window.addEventListener('open-category-create', handleOpenCreate);
    return () => window.removeEventListener('open-category-create', handleOpenCreate);
  }, []);

  const handleEdit = async (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      setEditDialog({ open: true, categoryId, category });
    }
  };

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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Show in Menu</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <p>No categories found</p>
                    {canCreate && (
                      <Button
                        variant="link"
                        onClick={() => setCreateDialog(true)}
                        className="mt-2"
                      >
                        Create your first category
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="w-16">{category.order}</TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                  <TableCell>
                    <Badge
                      style={{
                        backgroundColor: category.bgColor,
                        color: category.color,
                      }}
                    >
                      {category.icon.charAt(0)} {category.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={category._count.services > 0 ? "font-medium" : "text-muted-foreground"}>
                      {category._count.services} service{category._count.services !== 1 ? "s" : ""}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={category.showInMenu}
                        onCheckedChange={(checked: boolean) => handleToggleMenu(category.id, checked)}
                        disabled={!canUpdateAny}
                        className={cn(
                          "data-[state=checked]:bg-emerald-600"
                        )}
                      />
                      <Badge
                        variant={category.showInMenu ? "default" : "outline"}
                        className={cn(
                          "text-xs font-medium whitespace-nowrap",
                          category.showInMenu
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
                            : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/30 dark:text-gray-400 dark:border-gray-700"
                        )}
                      >
                        {category.showInMenu ? (
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            Visible
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <EyeOff className="h-3 w-3" />
                            Hidden
                          </span>
                        )}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Actions">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {canUpdateAny && (
                          <DropdownMenuItem onClick={() => handleEdit(category.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {canDeleteAny && (
                          <DropdownMenuItem
                            onClick={() =>
                              setDeleteDialog({
                                open: true,
                                categoryId: category.id,
                                categoryName: category.name,
                                serviceCount: category._count.services,
                              })
                            }
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Preview</TableHead>
            <TableHead>Services</TableHead>
            <TableHead>Show in Menu</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><div className="h-4 w-8 animate-pulse rounded bg-muted" /></TableCell>
              <TableCell><div className="h-4 w-32 animate-pulse rounded bg-muted" /></TableCell>
              <TableCell><div className="h-4 w-24 animate-pulse rounded bg-muted" /></TableCell>
              <TableCell><div className="h-6 w-24 animate-pulse rounded bg-muted" /></TableCell>
              <TableCell><div className="h-4 w-16 animate-pulse rounded bg-muted" /></TableCell>
              <TableCell><div className="flex items-center gap-2"><div className="h-4 w-8 animate-pulse rounded bg-muted" /><div className="h-5 w-16 animate-pulse rounded bg-muted" /></div></TableCell>
              <TableCell className="text-right"><div className="ml-auto h-8 w-8 animate-pulse rounded bg-muted" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

