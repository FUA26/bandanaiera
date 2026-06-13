'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2, ArrowLeft, CalendarIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { EnhancedImageUploader } from '@/components/ui/image-upload/enhanced-image-uploader';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { EventStatus, EventType } from '@prisma/client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';

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

type EventFormValues = z.infer<typeof eventSchema>;

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface EventFormProps {
    initialData?: any;
    categories: Category[];
}

export function EventForm({ initialData, categories }: EventFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: initialData?.title || '',
            slug: initialData?.slug || '',
            description: initialData?.description || '',
            categoryId: initialData?.categoryId || '',
            date: initialData?.date ? new Date(initialData.date) : new Date(),
            time: initialData?.time || '',
            location: initialData?.location || '',
            locationUrl: initialData?.locationUrl || '',
            type: initialData?.type || 'OFFLINE',
            imageId: initialData?.imageId || '',
            organizer: initialData?.organizer || '',
            organizerContact: initialData?.organizerContact || '',
            registrationRequired: initialData?.registrationRequired || false,
            registrationUrl: initialData?.registrationUrl || '',
            maxAttendees: initialData?.maxAttendees || undefined,
            featured: initialData?.featured || false,
            showInMenu: initialData?.showInMenu ?? true,
            order: initialData?.order || 0,
            status: initialData?.status || 'DRAFT',
        },
    });

    const onSubmit = async (data: EventFormValues) => {
        setIsSubmitting(true);
        try {
            const url = initialData ? `/api/events/${initialData.id}` : '/api/events';
            const method = initialData ? 'PUT' : 'POST';

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
                throw new Error(error.error || 'Gagal menyimpan acara');
            }

            toast.success(initialData ? 'Acara berhasil diupdate' : 'Acara berhasil dibuat');
            router.push('/manage/events');
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal menyimpan');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl pb-20">
            <div className="flex items-center justify-between">
                <Link href="/manage/events" className="flex items-center text-sm text-muted-foreground hover:text-primary">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke daftar acara
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? 'Update Acara' : 'Buat Acara'}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Judul</Label>
                        <Input id="title" {...form.register('title')} placeholder="Masukkan judul acara" />
                        {form.formState.errors.title && (
                            <p className="text-sm text-destructive">{form.formState.errors.title.message as string}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" {...form.register('slug')} placeholder="url-acara" />
                        {form.formState.errors.slug && (
                            <p className="text-sm text-destructive">{form.formState.errors.slug.message as string}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="categoryId">Kategori</Label>
                        <Select
                            value={form.watch('categoryId')}
                            onValueChange={(value) => form.setValue('categoryId', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.formState.errors.categoryId && (
                            <p className="text-sm text-destructive">{form.formState.errors.categoryId.message as string}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Tanggal</Label>
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
                                        {form.watch('date') ? format(form.watch('date'), 'PPP') : 'Pilih tanggal'}
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
                            <Label htmlFor="time">Waktu</Label>
                            <Input id="time" {...form.register('time')} placeholder="09:00 - 17:00" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Tipe</Label>
                        <Select
                            value={form.watch('type') as string}
                            onValueChange={(value) => form.setValue('type', value as EventType)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih tipe" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="OFFLINE">Offline</SelectItem>
                                <SelectItem value="ONLINE">Online</SelectItem>
                                <SelectItem value="HYBRID">Hybrid</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Lokasi</Label>
                        <Input id="location" {...form.register('location')} placeholder="Lokasi acara" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="locationUrl">URL Lokasi</Label>
                        <Input id="locationUrl" {...form.register('locationUrl')} placeholder="https://maps.google.com/..." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="organizer">Penyelenggara</Label>
                            <Input id="organizer" {...form.register('organizer')} placeholder="Nama organisasi" />
                            {form.formState.errors.organizer && (
                                <p className="text-sm text-destructive">{form.formState.errors.organizer.message as string}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="organizerContact">Kontak</Label>
                            <Input id="organizerContact" {...form.register('organizerContact')} placeholder="Email atau telepon" />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <FormField
                        control={form.control}
                        name="imageId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gambar Sampul Acara</FormLabel>
                                <FormControl>
                                    <EnhancedImageUploader
                                        value={field.value ? [field.value] : []}
                                        onChange={(ids) => field.onChange(ids[0] || null)}
                                        multiple={false}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={form.watch('status') as string}
                                onValueChange={(value) => form.setValue('status', value as EventStatus)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DRAFT">DRAFT</SelectItem>
                                    <SelectItem value="PUBLISHED">DITERBITKAN</SelectItem>
                                    <SelectItem value="CANCELLED">DIBATALKAN</SelectItem>
                                    <SelectItem value="COMPLETED">SELESAI</SelectItem>
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
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label>Perlu Registrasi</Label>
                            <p className="text-xs text-muted-foreground">Mewajibkan registrasi untuk acara ini</p>
                        </div>
                        <Switch
                            checked={form.watch('registrationRequired')}
                            onCheckedChange={(checked) => form.setValue('registrationRequired', checked)}
                        />
                    </div>

                    {form.watch('registrationRequired') && (
                        <div className="grid grid-cols-1 gap-4 border p-4 rounded-lg bg-muted/50">
                            <div className="space-y-2">
                                <Label htmlFor="registrationUrl">URL Registrasi</Label>
                                <Input id="registrationUrl" {...form.register('registrationUrl')} placeholder="https://..." />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maxAttendees">Maksimal Peserta</Label>
                                <Input
                                    id="maxAttendees"
                                    type="number"
                                    {...form.register('maxAttendees', { valueAsNumber: true })}
                                    placeholder="100"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <div className="flex-1 flex items-center justify-between rounded-lg border p-4">
                            <Label>Unggulan</Label>
                            <Switch
                                checked={form.watch('featured')}
                                onCheckedChange={(checked) => form.setValue('featured', checked)}
                            />
                        </div>
                        <div className="flex-1 flex items-center justify-between rounded-lg border p-4">
                            <Label>Tampil</Label>
                            <Switch
                                checked={form.watch('showInMenu')}
                                onCheckedChange={(checked) => form.setValue('showInMenu', checked)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Acara</Label>
                <RichTextEditor
                    value={form.watch('description') || ''}
                    onChange={(val: string) => form.setValue('description', val)}
                    placeholder="Deskripsi lengkap acara..."
                />
            </div>
        </form>
        </Form>
    );
}
