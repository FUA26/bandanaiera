"use client";

/**
 * Categories Content Component
 *
 * Client component with interactive UI for categories page
 */

import { useEffect, useState } from "react";
import { Can } from "@/components/rbac/Can";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CategoriesTable } from "./categories-table-client";
import { Loader2 } from "lucide-react";

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

export function CategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldOpenCreate, setShouldOpenCreate] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const refreshCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Error refreshing categories:", error);
    }
  };

  useEffect(() => {
    if (shouldOpenCreate) {
      window.dispatchEvent(new CustomEvent('open-category-create', { detail: { refreshCategories } }));
      setShouldOpenCreate(false);
    }
  }, [shouldOpenCreate]);

  // Listen for refresh event
  useEffect(() => {
    const handleRefresh = () => refreshCategories();
    window.addEventListener('refresh-categories', handleRefresh);
    return () => window.removeEventListener('refresh-categories', handleRefresh);
  }, [refreshCategories]);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Service Categories</h1>
          <p className="text-muted-foreground text-sm">
            Manage service categories for organizing public services
          </p>
        </div>
        <Can permissions={["CONTENT_CREATE"]}>
          <Button onClick={() => setShouldOpenCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Category
          </Button>
        </Can>
      </div>

      {/* Stats Overview */}
      {!isLoading && categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400">📁</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Visible in Menu</p>
                <p className="text-2xl font-bold">
                  {categories.filter((c) => c.showInMenu).length}
                </p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400">✓</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Services</p>
                <p className="text-2xl font-bold">
                  {categories.reduce((sum, c) => sum + (c._count?.services || 0), 0)}
                </p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400">📋</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hidden</p>
                <p className="text-2xl font-bold">
                  {categories.filter((c) => !c.showInMenu).length}
                </p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-900/20 flex items-center justify-center">
                <span className="text-gray-600 dark:text-gray-400">👁️</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading categories...</p>
        </div>
      ) : (
        <CategoriesTable categories={categories} onRefresh={refreshCategories} />
      )}
    </div>
  );
}
