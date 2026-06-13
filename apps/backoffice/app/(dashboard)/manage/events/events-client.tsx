'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, CalendarIcon } from 'lucide-react';
import { EventStatus, EventType } from '@prisma/client';
import { DataTable } from '@/components/data-table';
import { eventsColumns, type Event } from '@/components/data-table/columns/events';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface EventsClientProps {
  eventsPromise: Promise<Event[]>;
  categoriesPromise: Promise<Category[]>;
  header?: React.ReactNode;
}

const STATUS_COLORS: Record<EventStatus, string> = {
  DRAFT: 'secondary',
  PUBLISHED: 'default',
  CANCELLED: 'destructive',
  COMPLETED: 'outline',
};

const TYPE_LABELS: Record<EventType, string> = {
  ONLINE: 'Online',
  OFFLINE: 'Offline',
  HYBRID: 'Hybrid',
};

export function EventsClient({ eventsPromise, categoriesPromise, header }: EventsClientProps) {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null; title: string }>({
    open: false,
    id: null,
    title: '',
  });

  useEffect(() => {
    eventsPromise.then(setEvents);
    categoriesPromise.then(setCategories);
  }, [eventsPromise, categoriesPromise]);

  useEffect(() => {
    let filtered = events;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((e) => e.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((e) => e.type === typeFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((e) => e.categoryId === categoryFilter);
    }

    setFilteredEvents(filtered);
  }, [events, statusFilter, typeFilter, categoryFilter]);

  // Handle events from DataTable
  useEffect(() => {
    const handleView = (e: CustomEvent<Event>) => {
      // Navigate to event detail
      router.push(`/manage/events/${e.detail.id}`);
    };

    const handleEdit = (e: CustomEvent<Event>) => {
      // Navigate to edit page
      router.push(`/manage/events/${e.detail.id}`);
    };

    const handleDelete = (e: CustomEvent<Event>) => {
      setDeleteDialog({
        open: true,
        id: e.detail.id,
        title: e.detail.title,
      });
    };

    window.addEventListener('view-event', handleView as EventListener);
    window.addEventListener('edit-event', handleEdit as EventListener);
    window.addEventListener('delete-event', handleDelete as EventListener);

    return () => {
      window.removeEventListener('view-event', handleView as EventListener);
      window.removeEventListener('edit-event', handleEdit as EventListener);
      window.removeEventListener('delete-event', handleDelete as EventListener);
    };
  }, [router]);

  const handleDelete = async () => {
    if (!deleteDialog.id) return;

    try {
      const response = await fetch(`/api/events/${deleteDialog.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal menghapus acara');
      }

      toast.success('Acara dihapus');
      setDeleteDialog({ open: false, id: null, title: '' });
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus acara');
    }
  };

  // Prepare faceted filters
  const facetedFilters = [
    {
      columnId: 'status',
      title: 'Status',
      options: [
        { label: 'Published', value: 'PUBLISHED' },
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Cancelled', value: 'CANCELLED' },
        { label: 'Completed', value: 'COMPLETED' },
      ],
    },
    {
      columnId: 'type',
      title: 'Type',
      options: [
        { label: 'Online', value: 'ONLINE' },
        { label: 'Offline', value: 'OFFLINE' },
        { label: 'Hybrid', value: 'HYBRID' },
      ],
    },
  ];

  return (
    <>
      {header && (
        <div className="flex items-center justify-between mb-4">
          {header}
          <Button asChild>
            <Link href="/manage/events/create">
              <Plus className="mr-2 h-4 w-4" />
              Acara Baru
            </Link>
          </Button>
        </div>
      )}

      <DataTable
        columns={eventsColumns}
        data={filteredEvents}
        filterKey="title"
        toolbarPlaceholder="Cari acara..."
        facetedFilters={facetedFilters}
      />

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Acara</DialogTitle>
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
