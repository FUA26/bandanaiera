'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { format } from 'date-fns';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MoreHorizontal, Pencil, Trash2, Plus, CalendarIcon } from 'lucide-react';
import { EventStatus, EventType } from '@prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '@/lib/utils';

const eventSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  categoryId: z.string().min(1),
  date: z.date(),
  time: z.string().optional(),
  location: z.string().optional(),
  locationUrl: z.string().url().optional().or(z.literal('')),
  type: z.enum(['ONLINE', 'OFFLINE', 'HYBRID']),
  imageId: z.string().optional(),
  organizer: z.string().min(1).max(100),
  organizerContact: z.string().optional(),
  registrationRequired: z.boolean().default(false),
  registrationUrl: z.string().url().optional().or(z.literal('')),
  maxAttendees: z.number().int().min(1).optional(),
  featured: z.boolean().default(false),
  showInMenu: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']),
});

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null; title: string }>({
    open: false,
    id: null,
    title: '',
  });
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      categoryId: '',
      date: new Date(),
      time: '',
      location: '',
      locationUrl: '',
      type: 'OFFLINE' as const,
      imageId: '',
      organizer: '',
      organizerContact: '',
      registrationRequired: false,
      registrationUrl: '',
      maxAttendees: undefined,
      featured: false,
      showInMenu: true,
      order: 0,
      status: 'DRAFT' as const,
    },
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

  const openCreateDialog = () => {
    setEditingEvent(null);
    form.reset();
    setDialogOpen(true);
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    form.reset({
      ...event,
      date: new Date(event.date),
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: any) => {
    try {
      const url = editingEvent
        ? `/api/events/${editingEvent.id}`
        : '/api/events';
      const method = editingEvent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          date: data.date.toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save event');
      }

      toast.success(editingEvent ? 'Event updated' : 'Event created');
      setDialogOpen(false);
      router.refresh();

      // Refresh events
      const updated = await eventsPromise;
      setEvents(updated);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save');
    }
  };

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
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            New Event
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
                <TableCell className="font-medium">{event.title}</TableCell>
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
                  <Badge variant={STATUS_COLORS[event.status]}>
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
                      <DropdownMenuItem onClick={() => openEditDialog(event)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
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
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No events found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto]">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Edit Event' : 'New Event'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...form.register('title')} placeholder="Event title" />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" {...form.register('slug')} placeholder="event-slug" />
                {form.formState.errors.slug && (
                  <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <Select
                  value={form.watch('categoryId')}
                  onValueChange={(value) => form.setValue('categoryId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={form.watch('type')}
                  onValueChange={(value) => form.setValue('type', value as EventType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OFFLINE">Offline</SelectItem>
                    <SelectItem value="ONLINE">Online</SelectItem>
                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !form.watch('date') && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch('date') ? format(form.watch('date'), 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.watch('date')}
                      onSelect={(date) => date && form.setValue('date', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" {...form.register('time')} placeholder="09:00 - 17:00" />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...form.register('location')} placeholder="Event location" />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="locationUrl">Location URL</Label>
                <Input id="locationUrl" {...form.register('locationUrl')} placeholder="https://maps.google.com/..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizer">Organizer</Label>
                <Input id="organizer" {...form.register('organizer')} placeholder="Organization name" />
                {form.formState.errors.organizer && (
                  <p className="text-sm text-destructive">{form.formState.errors.organizer.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizerContact">Contact</Label>
                <Input id="organizerContact" {...form.register('organizerContact')} placeholder="Email or phone" />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...form.register('description')} placeholder="Event description" rows={3} />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4 col-span-2">
                <div className="space-y-0.5">
                  <Label>Registration Required</Label>
                  <p className="text-xs text-muted-foreground">Require registration for this event</p>
                </div>
                <Switch
                  checked={form.watch('registrationRequired')}
                  onCheckedChange={(checked) => form.setValue('registrationRequired', checked)}
                />
              </div>

              {form.watch('registrationRequired') && (
                <>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="registrationUrl">Registration URL</Label>
                    <Input id="registrationUrl" {...form.register('registrationUrl')} placeholder="https://wa.me/..." />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxAttendees">Max Attendees</Label>
                    <Input
                      id="maxAttendees"
                      type="number"
                      {...form.register('maxAttendees', { valueAsNumber: true })}
                      placeholder="100"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Featured</Label>
                  <p className="text-xs text-muted-foreground">Show as featured event</p>
                </div>
                <Switch
                  checked={form.watch('featured')}
                  onCheckedChange={(checked) => form.setValue('featured', checked)}
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

              <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  {...form.register('order', { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={form.watch('status')}
                  onValueChange={(value) => form.setValue('status', value as EventStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingEvent ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
