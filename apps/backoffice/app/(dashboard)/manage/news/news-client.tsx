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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { NewsStatus } from '@prisma/client';
import { DataTable } from '@/components/data-table';
import { newsColumns, type News } from '@/components/data-table/columns/news';

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  order: number;
}

interface NewsClientProps {
  newsPromise: Promise<any[]>;
  categoriesPromise: Promise<Category[]>;
  header?: React.ReactNode;
}

export function NewsClient({ newsPromise, categoriesPromise, header }: NewsClientProps) {
  const router = useRouter();
  const [news, setNews] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null; title: string }>({
    open: false,
    id: null,
    title: '',
  });

  useEffect(() => {
    Promise.all([newsPromise, categoriesPromise]).then(([newsData]) => {
      // Transform to match News interface
      const transformed = newsData.map((item: any) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt || null,
        categoryId: item.categoryId,
        category: item.category,
        publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
        featured: item.featured,
        showInMenu: item.showInMenu,
        order: item.order,
        status: item.status,
      }));
      setNews(transformed);
      setFilteredNews(transformed);
    });
  }, [newsPromise, categoriesPromise]);

  useEffect(() => {
    let filtered = news;
    if (statusFilter !== 'all') {
      filtered = filtered.filter((n) => n.status === statusFilter);
    }
    setFilteredNews(filtered);
  }, [news, statusFilter]);

  // Handle events from DataTable
  useEffect(() => {
    const handleView = (e: CustomEvent<News>) => router.push(`/manage/news/${e.detail.id}`);
    const handleEdit = (e: CustomEvent<News>) => router.push(`/manage/news/${e.detail.id}`);
    const handleDelete = (e: CustomEvent<News>) => {
      setDeleteDialog({
        open: true,
        id: e.detail.id,
        title: e.detail.title,
      });
    };

    window.addEventListener('view-news', handleView as EventListener);
    window.addEventListener('edit-news', handleEdit as EventListener);
    window.addEventListener('delete-news', handleDelete as EventListener);

    return () => {
      window.removeEventListener('view-news', handleView as EventListener);
      window.removeEventListener('edit-news', handleEdit as EventListener);
      window.removeEventListener('delete-news', handleDelete as EventListener);
    };
  }, [router]);

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    try {
      const response = await fetch(`/api/news/${deleteDialog.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('News deleted');
      setDeleteDialog({ open: false, id: null, title: '' });
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete news');
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
            <Link href="/manage/news/create">
              <Plus className="mr-2 h-4 w-4" />
              New News
            </Link>
          </Button>
        </div>
      )}

      <DataTable
        columns={newsColumns}
        data={filteredNews}
        filterKey="title"
        toolbarPlaceholder="Search news..."
        facetedFilters={facetedFilters}
      />

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete News</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete &quot;{deleteDialog.title}&quot;? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, id: null, title: '' })}>
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
