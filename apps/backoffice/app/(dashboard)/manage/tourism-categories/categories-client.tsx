'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2 } from 'lucide-react';
import { tourismCategorySchema } from '@/lib/validations/tourism';
import type { z } from 'zod';
import { DataTable } from '@/components/data-table';
import { tourismCategoriesColumns, type TourismCategory } from '@/components/data-table/columns/tourism-categories';

type CategoryFormValues = z.infer<typeof tourismCategorySchema>;

interface Category {
    id: string;
    name: string;
    slug: string;
    color: string;
    showInMenu: boolean;
    order: number;
    _count: {
        destinations: number;
    };
}

export function CategoriesClient({ categoriesPromise }: { categoriesPromise: Promise<Category[]> }) {
    const router = useRouter();
    const [categories, setCategories] = useState<TourismCategory[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<TourismCategory | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null; name: string }>({
        open: false,
        id: null,
        name: '',
    });

    useEffect(() => {
        categoriesPromise.then(data => {
            // Transform Category to TourismCategory format
            const transformed = data.map(cat => ({
                ...cat,
                _count: {
                    tourism: cat._count.destinations
                }
            }));
            setCategories(transformed);
        });
    }, [categoriesPromise]);

    // Handle edit event from DataTable
    useEffect(() => {
        const handleEdit = (e: CustomEvent<TourismCategory>) => {
            const category = e.detail;
            setEditingCategory(category);
            form.reset({
                name: category.name,
                slug: category.slug,
                color: category.color,
                showInMenu: category.showInMenu,
                order: category.order,
            });
            setIsDialogOpen(true);
        };

        const handleDelete = (e: CustomEvent<TourismCategory>) => {
            setDeleteDialog({
                open: true,
                id: e.detail.id,
                name: e.detail.name,
            });
        };

        window.addEventListener('edit-tourism-category', handleEdit as EventListener);
        window.addEventListener('delete-tourism-category', handleDelete as EventListener);

        return () => {
            window.removeEventListener('edit-tourism-category', handleEdit as EventListener);
            window.removeEventListener('delete-tourism-category', handleDelete as EventListener);
        };
    }, []);

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(tourismCategorySchema),
        defaultValues: {
            name: '',
            slug: '',
            color: 'primary',
            showInMenu: true,
            order: 0,
        },
    });

    const onSubmit = async (data: CategoryFormValues) => {
        setIsSubmitting(true);
        try {
            const url = editingCategory ? `/api/tourism-categories/${editingCategory.id}` : '/api/tourism-categories';
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

            toast.success(editingCategory ? 'Kategori diperbarui' : 'Kategori ditambahkan');
            setIsDialogOpen(false);
            router.refresh();

            const updatedCategories = await categoriesPromise;
            const transformed = updatedCategories.map(cat => ({
                ...cat,
                _count: {
                    tourism: cat._count.destinations
                }
            }));
            setCategories(transformed);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal menyimpan kategori');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteDialog.id) return;

        try {
            const response = await fetch(`/api/tourism-categories/${deleteDialog.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete category');
            }

            toast.success('Kategori dihapus');
            setDeleteDialog({ open: false, id: null, name: '' });
            router.refresh();

            const updatedCategories = await categoriesPromise;
            const transformed = updatedCategories.map(cat => ({
                ...cat,
                _count: {
                    tourism: cat._count.destinations
                }
            }));
            setCategories(transformed);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal menghapus kategori');
        }
    };

    return (
        <>
            <div className="flex justify-end mb-4">
                <Dialog
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) {
                            setEditingCategory(null);
                            form.reset({
                                name: '',
                                slug: '',
                                color: 'primary',
                                showInMenu: true,
                                order: 0,
                            });
                        }
                    }}
                >
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Kategori
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Kategori</Label>
                                <Input
                                    id="name"
                                    {...form.register('name')}
                                    onChange={(e) => {
                                        form.register('name').onChange(e);
                                        if (!editingCategory) {
                                            form.setValue('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                                        }
                                    }}
                                />
                                {form.formState.errors.name && (
                                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug URL</Label>
                                <Input id="slug" {...form.register('slug')} />
                                {form.formState.errors.slug && (
                                    <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="color">Warna (opsional)</Label>
                                    <Input id="color" {...form.register('color')} placeholder="primary, secondary, dll" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="order">Urutan (Order)</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        {...form.register('order', { valueAsNumber: true })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label>Tampil di Menu</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Tampilkan kategori ini di navigasi menu publik.
                                    </p>
                                </div>
                                <Switch
                                    checked={form.watch('showInMenu')}
                                    onCheckedChange={(checked) => form.setValue('showInMenu', checked)}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {editingCategory ? 'Update' : 'Simpan'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <DataTable
                columns={tourismCategoriesColumns}
                data={categories}
                filterKey="name"
                toolbarPlaceholder="Cari kategori..."
            />

            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Kategori</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Apakah Anda yakin ingin menghapus kategori "{deleteDialog.name}"?
                        Kategori yang memiliki destinasi tidak dapat dihapus.
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
