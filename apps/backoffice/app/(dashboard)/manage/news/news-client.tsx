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
import { NewsStatus } from '@prisma/client';

interface News {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string | null;
  categoryId: string;
  category: { id: string; name: string; slug: string };
  featuredImageId: string | null;
  featuredImage: { id: string; cdnUrl: string } | null;
  featured: boolean;
  showInMenu: boolean;
  order: number;
  author: string | null;
  readTime: string | null;
  tags: unknown;
  status: NewsStatus;
  publishedAt: Date | null;
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

interface NewsClientProps {
  newsPromise: Promise<News[]>;
  categoriesPromise: Promise<Category[]>;
  header?: React.ReactNode;
}

export function NewsClient({ newsPromise, categoriesPromise, header }: NewsClientProps) {
  const router = useRouter();
  const [news, setNews] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null; title: string }>({
    open: false,
    id: null,
    title: '',
  });

  useEffect(() => {
    Promise.all([newsPromise, categoriesPromise]).then(([newsData]) => {
      setNews(newsData);
    });
  }, [newsPromise, categoriesPromise]);

  useEffect(() => {
    let filtered = news;

    if (searchQuery) {
      filtered = filtered.filter((n) =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((n) => n.status === statusFilter);
    }

    setFilteredNews(filtered);
  }, [news, searchQuery, statusFilter]);

  const handlePublish = async (id: string, currentStatus: NewsStatus) => {
    const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const response = await fetch(`/api/news/${id}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      toast.success(`News ${newStatus.toLowerCase()}`);
      router.refresh();

      const updated = await newsPromise;
      setNews(updated);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;

    try {
      const response = await fetch(`/api/news/${deleteDialog.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      toast.success('News deleted');
      setDeleteDialog({ open: false, id: null, title: '' });
      router.refresh();

      const updated = await newsPromise;
      setNews(updated);
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
            <Link href="/manage/news/create">
              <Plus className="mr-2 h-4 w-4" />
              New News
            </Link>
          </Button>
        </div>
      )}

      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-width-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
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
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNews.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.featuredImage ? (
                    <div className="relative h-12 w-12 rounded overflow-hidden bg-muted">
                      <Image src={item.featuredImage.cdnUrl} alt="" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      No img
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="max-w-[300px]">
                    <div className="font-medium truncate">{item.title}</div>
                    {item.featured && <Badge variant="secondary" className="mt-1">Featured</Badge>}
                  </div>
                </TableCell>
                <TableCell>{item.category.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.status === 'PUBLISHED' ? 'default' : item.status === 'DRAFT' ? 'secondary' : 'outline'
                    }
                  >
                    {item.status.toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : '-'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/manage/news/${item.id}`}>
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
                        onClick={() => setDeleteDialog({ open: true, id: item.id, title: item.title })}
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
            {filteredNews.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No news found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
