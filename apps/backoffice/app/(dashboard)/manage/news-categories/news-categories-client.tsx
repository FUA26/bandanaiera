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
        throw new Error(error.error || 'Gagal menyimpan kategori');
      }

      toast.success(editingCategory ? 'Kategori diperbarui' : 'Kategori dibuat');
      setDialogOpen(false);
      router.refresh();

      // Refresh categories
      const updated = await categoriesPromise;
      setCategories(updated);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan');
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
        throw new Error(error.error || 'Gagal menghapus');
      }

      toast.success('Kategori dihapus');
      setDeleteDialog({ open: false, id: null, name: '' });
      router.refresh();

      const updated = await categoriesPromise;
      setCategories(updated);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus');
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Kategori Baru
        </Button>
      </div>

      {/* Stats Overview */}
      {categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Kategori</p>
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
                <p className="text-sm text-muted-foreground">Total Berita</p>
                <p className="text-2xl font-bold">
                  {categories.reduce((sum, c) => sum + (c._count?.news || 0), 0)}
                </p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400">📰</span>
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

      <DataTable
        columns={newsCategoriesColumns}
        data={categories}
        filterKey="name"
        toolbarPlaceholder="Cari kategori..."
      />

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Ubah Kategori' : 'Kategori Baru'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" {...form.register('name')} placeholder="Teknologi" />
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
                  <SelectValue placeholder="Pilih warna" />
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
              <Label htmlFor="order">Urutan</Label>
              <Input
                id="order"
                type="number"
                {...form.register('order', { valueAsNumber: true })}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label>Tampilkan di Menu</Label>
              </div>
              <Switch
                checked={form.watch('showInMenu')}
                onCheckedChange={(checked) => form.setValue('showInMenu', checked)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit">
                {editingCategory ? 'Update' : 'Buat'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Kategori</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Apakah Anda yakin ingin menghapus &quot;{deleteDialog.name}&quot;? Tindakan ini tidak dapat dibatalkan.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, id: null, name: '' })}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
