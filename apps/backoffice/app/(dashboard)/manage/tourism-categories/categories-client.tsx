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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { tourismCategorySchema } from '@/lib/validations/tourism';
import type { z } from 'zod';

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
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null; name: string }>({
        open: false,
        id: null,
        name: '',
    });

    useEffect(() => {
        categoriesPromise.then(setCategories);
    }, [categoriesPromise]);

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
            setCategories(updatedCategories);
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
            setCategories(updatedCategories);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal menghapus kategori');
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="flex gap-4">
                <Input
                    placeholder="Cari kategori..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />
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

            <div className="rounded-md border mt-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Destinasi</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Urutan</TableHead>
                            <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCategories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell className="font-medium">{category.name}</TableCell>
                                <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">
                                        {category._count.destinations} item
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {category.showInMenu ? (
                                        <Badge variant="default">Tampil</Badge>
                                    ) : (
                                        <Badge variant="outline">Sembunyi</Badge>
                                    )}
                                </TableCell>
                                <TableCell>{category.order}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setEditingCategory(category);
                                                    form.reset({
                                                        name: category.name,
                                                        slug: category.slug,
                                                        color: category.color,
                                                        showInMenu: category.showInMenu,
                                                        order: category.order,
                                                    });
                                                    setIsDialogOpen(true);
                                                }}
                                            >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => setDeleteDialog({ open: true, id: category.id, name: category.name })}
                                                className="text-destructive"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Hapus
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredCategories.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    Tidak ada kategori ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

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
