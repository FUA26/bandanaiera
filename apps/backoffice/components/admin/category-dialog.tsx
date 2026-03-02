"use client";

/**
 * Category Dialog Component
 *
 * Dialog for creating and editing service categories
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { ServiceCategoryInput, serviceCategorySchema } from "@/lib/services/validations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  categoryId?: string;
  initialData?: Partial<ServiceCategoryInput>;
  onSuccess?: () => void;
}

export function CategoryDialog({
  open,
  onOpenChange,
  mode,
  categoryId,
  initialData,
  onSuccess,
}: CategoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(serviceCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      icon: "",
      color: "#000000",
      bgColor: "#f1f5f9",
      showInMenu: true,
      order: 0,
    },
  });

  // Load category data for edit mode
  useEffect(() => {
    if (mode === "edit" && categoryId && open) {
      const loadCategory = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/categories/${categoryId}`);
          if (response.ok) {
            const data = await response.json();
            const category = data.category;
            form.reset({
              name: category.name,
              slug: category.slug,
              icon: category.icon,
              color: category.color,
              bgColor: category.bgColor,
              showInMenu: category.showInMenu,
              order: category.order,
            });
          }
        } catch (error) {
          console.error("Error loading category:", error);
          toast.error("Failed to load category");
        } finally {
          setIsLoading(false);
        }
      };
      loadCategory();
    } else if (mode === "create" && initialData && open) {
      form.reset(initialData);
    } else if (mode === "create" && open) {
      form.reset();
    }
  }, [mode, categoryId, open, initialData, form]);

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    form.setValue("name", value);
    // Only auto-generate slug if it's empty or matches the previous name pattern
    const currentSlug = form.watch("slug");
    if (!currentSlug || currentSlug === "") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      form.setValue("slug", slug);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const url = mode === "edit" && categoryId
        ? `/api/categories/${categoryId}`
        : "/api/categories";

      const response = await fetch(url, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save category");
      }

      toast.success(mode === "edit" ? "Category updated successfully" : "Category created successfully");
      onOpenChange(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Category" : "New Category"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the category details below."
              : "Create a new service category."}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Name */}
              <div className="col-span-2">
                <Field>
                  <FieldLabel htmlFor="name">Name *</FieldLabel>
                  <FieldContent>
                    <Input
                      id="name"
                      {...form.register("name")}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g. Population Services"
                    />
                  </FieldContent>
                  <FieldError errors={form.formState.errors.name ? [form.formState.errors.name] : undefined} />
                </Field>
              </div>

              {/* Slug */}
              <div className="col-span-2">
                <Field>
                  <FieldLabel htmlFor="slug">Slug *</FieldLabel>
                  <FieldContent>
                    <Input
                      id="slug"
                      {...form.register("slug")}
                      placeholder="e.g. population-services"
                    />
                  </FieldContent>
                  <FieldError errors={form.formState.errors.slug ? [form.formState.errors.slug] : undefined} />
                </Field>
              </div>

              {/* Icon */}
              <div>
                <Field>
                  <FieldLabel htmlFor="icon">Icon *</FieldLabel>
                  <FieldContent>
                    <Input
                      id="icon"
                      {...form.register("icon")}
                      placeholder="e.g. Users"
                    />
                  </FieldContent>
                  <FieldError errors={form.formState.errors.icon ? [form.formState.errors.icon] : undefined} />
                </Field>
              </div>

              {/* Order */}
              <div>
                <Field>
                  <FieldLabel htmlFor="order">Order *</FieldLabel>
                  <FieldContent>
                    <Input
                      id="order"
                      type="number"
                      {...form.register("order", { valueAsNumber: true })}
                      min="0"
                    />
                  </FieldContent>
                  <FieldError errors={form.formState.errors.order ? [form.formState.errors.order] : undefined} />
                </Field>
              </div>

              {/* Color */}
              <div>
                <Field>
                  <FieldLabel htmlFor="color">Text Color *</FieldLabel>
                  <FieldContent>
                    <div className="flex gap-2">
                      <Input
                        id="color"
                        {...form.register("color")}
                        placeholder="#000000"
                        className="flex-1"
                      />
                      <input
                        type="color"
                        value={form.watch("color")}
                        onChange={(e) => form.setValue("color", e.target.value)}
                        className="h-9 w-9 rounded cursor-pointer"
                      />
                    </div>
                  </FieldContent>
                  <FieldError errors={form.formState.errors.color ? [form.formState.errors.color] : undefined} />
                </Field>
              </div>

              {/* Background Color */}
              <div>
                <Field>
                  <FieldLabel htmlFor="bgColor">Background Color *</FieldLabel>
                  <FieldContent>
                    <div className="flex gap-2">
                      <Input
                        id="bgColor"
                        {...form.register("bgColor")}
                        placeholder="#f1f5f9"
                        className="flex-1"
                      />
                      <input
                        type="color"
                        value={form.watch("bgColor")}
                        onChange={(e) => form.setValue("bgColor", e.target.value)}
                        className="h-9 w-9 rounded cursor-pointer"
                      />
                    </div>
                  </FieldContent>
                  <FieldError errors={form.formState.errors.bgColor ? [form.formState.errors.bgColor] : undefined} />
                </Field>
              </div>

              {/* Show in Menu */}
              <div className="col-span-2">
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="showInMenu">Show in Menu</Label>
                    <p className="text-xs text-muted-foreground">
                      Display this category in the public menu
                    </p>
                  </div>
                  <Controller
                    name="showInMenu"
                    control={form.control}
                    render={({ field }) => (
                      <div className="flex items-center">
                        <Checkbox
                          id="showInMenu"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="h-5 w-5"
                        />
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-md border p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Preview</p>
              <div
                className="inline-flex rounded-md px-3 py-1 text-sm font-medium"
                style={{
                  backgroundColor: form.watch("bgColor"),
                  color: form.watch("color"),
                }}
              >
                {form.watch("icon") && <span className="mr-2">{form.watch("icon").charAt(0)}</span>}
                {form.watch("name") || "Category Name"}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "edit" ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
