'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { DataTable } from '@/components/data-table';
import { newsCategoriesColumns, type NewsCategory } from '@/components/data-table/columns/news-categories';

const categorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  color: z.string().default('primary'),
  showInMenu: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

const COLORS = [
  { value: 'primary', label: 'Primary' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'rose', label: 'Rose' },
  { value: 'orange', label: 'Orange' },
  { value: 'purple', label: 'Purple' },
  { value: 'cyan', label: 'Cyan' },
];

interface NewsCategoriesClientProps {
  categoriesPromise: Promise<NewsCategory[]>;
}

export function NewsCategoriesClient({ categoriesPromise }: NewsCategoriesClientProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null; name: string }>({
    open: false,
    id: null,
    name: '',
  });
  const [editingCategory, setEditingCategory] = useState<NewsCategory | null>(null);

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      color: 'primary',
      showInMenu: true,
      order: 0,
    },
  });

  useEffect(() => {
    categoriesPromise.then(setCategories);
  }, [categoriesPromise]);

  // Handle edit event from DataTable
  useEffect(() => {
    const handleEdit = (e: CustomEvent<NewsCategory>) => {
      openEditDialog(e.detail);
    };

    const handleDelete = (e: CustomEvent<NewsCategory>) => {
      setDeleteDialog({
        open: true,
        id: e.detail.id,
        name: e.detail.name,
      });
    };

    window.addEventListener('edit-news-category', handleEdit as EventListener);
    window.addEventListener('delete-news-category', handleDelete as EventListener);

    return () => {
      window.removeEventListener('edit-news-category', handleEdit as EventListener);
      window.removeEventListener('delete-news-category', handleDelete as EventListener);
    };
  }, []);

  const openCreateDialog = () => {
    setEditingCategory(null);
    form.reset();
    setDialogOpen(true);
  };

  const openEditDialog = (category: NewsCategory) => {
    setEditingCategory(category);
    form.reset(category);
    setDialogOpen(true);
  };

  const onSubmit = async (data: any) => {
    try {
      const url = editingCategory
        ? `/api/news-categories/${editingCategory.id}`
        : '/api/news-categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save category');
      }

      toast.success(editingCategory ? 'Category updated' : 'Category created');
      setDialogOpen(false);
      router.refresh();

      // Refresh categories
      const updated = await categoriesPromise;
      setCategories(updated);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save');
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;

    try {
      const response = await fetch(`/api/news-categories/${deleteDialog.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete');
      }

      toast.success('Category deleted');
      setDeleteDialog({ open: false, id: null, name: '' });
      router.refresh();

      const updated = await categoriesPromise;
      setCategories(updated);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete');
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </div>

      <DataTable
        columns={newsCategoriesColumns}
        data={categories}
        filterKey="name"
        toolbarPlaceholder="Search categories..."
      />

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'New Category'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...form.register('name')} placeholder="Technology" />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...form.register('slug')} placeholder="technology" />
              {form.formState.errors.slug && (
                <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Select
                value={form.watch('color')}
                onValueChange={(value) => form.setValue('color', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      {color.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                {...form.register('order', { valueAsNumber: true })}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label>Show in Menu</Label>
              </div>
              <Switch
                checked={form.watch('showInMenu')}
                onCheckedChange={(checked) => form.setValue('showInMenu', checked)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingCategory ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete &quot;{deleteDialog.name}&quot;? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, id: null, name: '' })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
