'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { format } from 'date-fns';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Pencil, Trash2, Plus, CalendarIcon } from 'lucide-react';
import { EventStatus, EventType } from '@prisma/client';

interface Event {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  categoryId: string;
  category: { id: string; name: string; slug: string };
  date: Date;
  time: string | null;
  location: string | null;
  locationUrl: string | null;
  type: EventType;
  imageId: string | null;
  image: { id: string; cdnUrl: string } | null;
  organizer: string;
  organizerContact: string | null;
  registrationRequired: boolean;
  registrationUrl: string | null;
  maxAttendees: number | null;
  featured: boolean;
  showInMenu: boolean;
  order: number;
  status: EventStatus;
}

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
    Promise.all([eventsPromise, categoriesPromise]).then(([eventsData, categoriesData]) => {
      setEvents(eventsData);
      setCategories(categoriesData);
    });
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

  const handleDelete = async () => {
    if (!deleteDialog.id) return;

    try {
      const response = await fetch(`/api/events/${deleteDialog.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete');
      }

      toast.success('Event deleted');
      setDeleteDialog({ open: false, id: null, title: '' });
      router.refresh();

      const updated = await eventsPromise;
      setEvents(updated);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete');
    }
  };

  const handleStatusUpdate = async (id: string, status: EventStatus) => {
    try {
      const response = await fetch(`/api/events/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update status');
      }

      toast.success(`Event ${status.toLowerCase()}`);
      router.refresh();

      const updated = await eventsPromise;
      setEvents(updated);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    }
  };

  return (
    <>
      {header && (
        <div className="flex items-center justify-between mb-4">
          {header}
          <Button asChild>
            <Link href="/manage/events/create">
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Link>
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="ONLINE">Online</SelectItem>
            <SelectItem value="OFFLINE">Offline</SelectItem>
            <SelectItem value="HYBRID">Hybrid</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  {event.image ? (
                    <div className="relative h-12 w-12 rounded overflow-hidden bg-muted">
                      <Image src={event.image.cdnUrl} alt="" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      No img
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="max-w-[300px]">
                    <div className="font-medium truncate">{event.title}</div>
                    {event.featured && <Badge variant="secondary" className="mt-1">Featured</Badge>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    {format(new Date(event.date), 'MMM d, yyyy')}
                    {event.time && <span className="text-muted-foreground text-sm">({event.time})</span>}
                  </div>
                </TableCell>
                <TableCell>{event.category.name}</TableCell>
                <TableCell>{TYPE_LABELS[event.type]}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_COLORS[event.status] as any}>
                    {event.status}
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
                        <Link href={`/manage/events/${event.id}`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      {event.status === 'DRAFT' && (
                        <DropdownMenuItem onClick={() => handleStatusUpdate(event.id, 'PUBLISHED')}>
                          Publish
                        </DropdownMenuItem>
                      )}
                      {event.status === 'PUBLISHED' && (
                        <>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(event.id, 'CANCELLED')}>
                            Cancel
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(event.id, 'COMPLETED')}>
                            Mark Complete
                          </DropdownMenuItem>
                        </>
                      )}
                      {event.status === 'CANCELLED' && (
                        <DropdownMenuItem onClick={() => handleStatusUpdate(event.id, 'PUBLISHED')}>
                          Republish
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() =>
                          setDeleteDialog({
                            open: true,
                            id: event.id,
                            title: event.title,
                          })
                        }
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
            {filteredEvents.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No events found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
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
