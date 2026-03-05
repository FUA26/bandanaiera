'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff, Plus } from 'lucide-react';
import { TourismStatus } from '@prisma/client';

interface Tourism {
    id: string;
    slug: string;
    name: string;
    description: string;
    content: string | null;
    categoryId: string;
    category: { id: string; name: string; slug: string };
    imageId: string | null;
    image: { id: string; cdnUrl: string | null } | null;
    featured: boolean;
    showInMenu: boolean;
    order: number;
    location: string | null;
    price: string | null;
    status: TourismStatus;
    createdAt: Date;
    updatedAt: Date;
}

interface Category {
    id: string;
    name: string;
    slug: string;
    color: string;
    order: number;
}

interface TourismClientProps {
    initialTourism: Tourism[];
    initialCategories: Category[];
    header?: React.ReactNode;
}

export function TourismClient({ initialTourism, initialCategories, header }: TourismClientProps) {
    const router = useRouter();
    const [tourism, setTourism] = useState<Tourism[]>(initialTourism);
    const [filteredTourism, setFilteredTourism] = useState<Tourism[]>(initialTourism);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null; title: string }>({
        open: false,
        id: null,
        title: '',
    });

    useEffect(() => {
        let filtered = tourism;

        if (searchQuery) {
            filtered = filtered.filter((t) =>
                t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter((t) => t.status === statusFilter);
        }

        setFilteredTourism(filtered);
    }, [tourism, searchQuery, statusFilter]);

    const handlePublish = async (id: string, currentStatus: TourismStatus) => {
        const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
        try {
            const response = await fetch(`/api/tourism/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update status');

            toast.success(`Destinasi ${newStatus.toLowerCase()}`);
            // Update local state optimistically
            setTourism(prev => prev.map(t => t.id === id ? { ...t, status: newStatus as TourismStatus } : t));
            router.refresh();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async () => {
        if (!deleteDialog.id) return;

        try {
            const response = await fetch(`/api/tourism/${deleteDialog.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete');

            toast.success('Destinasi dihapus');
            setDeleteDialog({ open: false, id: null, title: '' });
            // Remove from local state optimistically
            setTourism(prev => prev.filter(t => t.id !== deleteDialog.id));
            router.refresh();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    return (
        <>
            {header && (
                <div className="flex items-center justify-between mb-4">
                    {header}
                    <Button asChild>
                        <Link href="/manage/tourism/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Destinasi
                        </Link>
                    </Button>
                </div>
            )}

            <div className="flex gap-4 mb-4">
                <Input
                    placeholder="Cari destinasi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Gambar</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Lokasi</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTourism.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    {item.image && item.image.cdnUrl ? (
                                        <div className="relative h-12 w-12 rounded overflow-hidden bg-muted">
                                            <Image src={item.image.cdnUrl} alt="" fill className="object-cover" />
                                        </div>
                                    ) : (
                                        <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                            No img
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="max-w-[300px]">
                                        <div className="font-medium truncate">{item.name}</div>
                                        {item.featured && <Badge variant="secondary" className="mt-1">Featured</Badge>}
                                    </div>
                                </TableCell>
                                <TableCell>{item.category?.name}</TableCell>
                                <TableCell>
                                    <div className="max-w-[200px] truncate">{item.location || '-'}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            item.status === 'PUBLISHED' ? 'default' : item.status === 'DRAFT' ? 'secondary' : 'outline'
                                        }
                                    >
                                        {item.status.toLowerCase()}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/manage/tourism/${item.id}`}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handlePublish(item.id, item.status)}>
                                                {item.status === 'PUBLISHED' ? (
                                                    <>
                                                        <EyeOff className="mr-2 h-4 w-4" />
                                                        Unpublish
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Publish
                                                    </>
                                                )}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => setDeleteDialog({ open: true, id: item.id, title: item.name })}
                                                className="text-destructive"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredTourism.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    Tidak ada destinasi ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Destinasi</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Apakah Anda yakin ingin menghapus "{deleteDialog.title}"? Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog({ open: false, id: null, title: '' })}>
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
