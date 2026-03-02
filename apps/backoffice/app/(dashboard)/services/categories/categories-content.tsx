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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Service Categories</h1>
          <p className="text-muted-foreground">Manage service categories for organizing public services</p>
        </div>
        <Can permissions={["CONTENT_CREATE"]}>
          <Button onClick={() => setShouldOpenCreate(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Button>
        </Can>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <CategoriesTable categories={categories} onRefresh={refreshCategories} />
      )}
    </div>
  );
}
