'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { tourismColumns, type Tourism } from '@/components/data-table/columns/tourism';

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
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null; title: string }>({
    open: false,
    id: null,
    title: '',
  });

  useEffect(() => {
    let filtered = tourism;
    setFilteredTourism(filtered);
  }, [tourism]);

  // Handle events from DataTable
  useEffect(() => {
    const handleView = (e: CustomEvent<Tourism>) => router.push(`/manage/tourism/${e.detail.id}`);
    const handleEdit = (e: CustomEvent<Tourism>) => router.push(`/manage/tourism/${e.detail.id}`);
    const handleDelete = (e: CustomEvent<Tourism>) => {
      setDeleteDialog({
        open: true,
        id: e.detail.id,
        title: e.detail.name,
      });
    };

    window.addEventListener('view-tourism', handleView as EventListener);
    window.addEventListener('edit-tourism', handleEdit as EventListener);
    window.addEventListener('delete-tourism', handleDelete as EventListener);

    return () => {
      window.removeEventListener('view-tourism', handleView as EventListener);
      window.removeEventListener('edit-tourism', handleEdit as EventListener);
      window.removeEventListener('delete-tourism', handleDelete as EventListener);
    };
  }, [router]);

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    try {
      const response = await fetch(`/api/tourism/${deleteDialog.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Gagal menghapus');
      toast.success('Destinasi dihapus');
      setDeleteDialog({ open: false, id: null, title: '' });
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus destinasi');
    }
  };

  const facetedFilters = [
    {
      columnId: 'status',
      title: 'Status',
      options: [
        { label: 'Published', value: 'PUBLISHED' },
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Archived', value: 'ARCHIVED' },
      ],
    },
  ];

  return (
    <>
      {header && (
        <div className="flex items-center justify-between mb-4">
          {header}
          <Button asChild>
            <Link href="/manage/tourism/create">
              <Plus className="mr-2 h-4 w-4" />
              Destinasi Baru
            </Link>
          </Button>
        </div>
      )}

      <DataTable
        columns={tourismColumns}
        data={filteredTourism}
        filterKey="name"
        toolbarPlaceholder="Cari destinasi..."
        facetedFilters={facetedFilters}
      />

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Destinasi</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Apakah Anda yakin ingin menghapus &quot;{deleteDialog.title}&quot;? Tindakan ini tidak dapat dibatalkan.
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
