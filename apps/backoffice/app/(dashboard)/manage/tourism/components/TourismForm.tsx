'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
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
import { Badge } from '@/components/ui/badge';
import { X, Loader2, ArrowLeft } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ImageUploader } from '@/components/news';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import Link from 'next/link';
import { tourismSchema } from '@/lib/validations/tourism';

type TourismFormValues = z.infer<typeof tourismSchema>;

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface TourismFormProps {
    initialData?: any;
    categories: Category[];
}

export function TourismForm({ initialData, categories }: TourismFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Convert facilities string array from DB to state, ensuring it's an array
    const initialFacilities = initialData?.facilities && Array.isArray(initialData.facilities)
        ? initialData.facilities
        : [];

    const [facilities, setFacilities] = useState<string[]>(initialFacilities);
    const [facilityInput, setFacilityInput] = useState('');
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
        initialData?.image?.cdnUrl || null
    );

    const form = useForm({
        resolver: zodResolver(tourismSchema),
        defaultValues: {
            name: initialData?.name || '',
            slug: initialData?.slug || '',
            description: initialData?.description || '',
            content: initialData?.content || '',
            categoryId: initialData?.categoryId || '',
            location: initialData?.location || '',
            locationUrl: initialData?.locationUrl || '',
            price: initialData?.price || '',
            openHours: initialData?.openHours || '',
            imageId: initialData?.imageId || '',
            featured: initialData?.featured || false,
            showInMenu: initialData?.showInMenu ?? true,
            order: initialData?.order || 0,
            rating: initialData?.rating || 0.0,
            reviews: initialData?.reviews || 0,
            status: initialData?.status || 'DRAFT',
        },
    });

    const onSubmit = async (data: TourismFormValues) => {
        setIsSubmitting(true);
        try {
            const url = initialData ? `/api/tourism/${initialData.id}` : '/api/tourism';
            const method = initialData ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    facilities,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to save tourism destination');
            }

            toast.success(initialData ? 'Destinasi diperbarui' : 'Destinasi ditambahkan');
            router.push('/manage/tourism');
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal menyimpan');
        } finally {
            setIsSubmitting(false);
        }
    };

    const addFacility = () => {
        const facility = facilityInput.trim();
        if (facility && !facilities.includes(facility)) {
            setFacilities([...facilities, facility]);
            setFacilityInput('');
        }
    };

    const removeFacility = (facility: string) => {
        setFacilities(facilities.filter((f) => facility !== f));
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl pb-20">
            <div className="flex items-center justify-between">
                <Link href="/manage/tourism" className="flex items-center text-sm text-muted-foreground hover:text-primary">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke daftar
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? 'Update Destinasi' : 'Simpan Destinasi'}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Destinasi</Label>
                        <Input id="name" {...form.register('name')} placeholder="Contoh: Pantai Pasir Putih" />
                        {form.formState.errors.name && (
                            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input id="slug" {...form.register('slug')} placeholder="pantai-pasir-putih" />
                        {form.formState.errors.slug && (
                            <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi Singkat</Label>
                        <Textarea
                            id="description"
                            {...form.register('description')}
                            placeholder="Ringkasan singkat tentang destinasi..."
                            rows={3}
                        />
                        {form.formState.errors.description && (
                            <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
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
                            <p className="text-sm text-destructive">{form.formState.errors.categoryId.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Harga / Tiket</Label>
                            <Input id="price" {...form.register('price')} placeholder="Rp 15.000 / Gratis" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="openHours">Jam Operasional</Label>
                            <Input id="openHours" {...form.register('openHours')} placeholder="08:00 - 17:00 / 24 Jam" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Lokasi (Alamat)</Label>
                        <Input id="location" {...form.register('location')} placeholder="Kecamatan Pesisir" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="locationUrl">Link Map URL (Google Maps)</Label>
                        <Input id="locationUrl" {...form.register('locationUrl')} placeholder="https://maps.google.com/..." />
                        {form.formState.errors.locationUrl && (
                            <p className="text-sm text-destructive">{form.formState.errors.locationUrl.message}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Reusing News Image Uploader */}
                    <ImageUploader
                        value={(form.watch('imageId') as string | undefined) ?? null}
                        onChange={(id) => form.setValue('imageId', id ?? '')}
                        onError={(error) => toast.error(error)}
                        previewSrc={imagePreviewUrl}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={form.watch('status')}
                                onValueChange={(value) => form.setValue('status', value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED')}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                    <SelectItem value="PUBLISHED">Published</SelectItem>
                                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                                </SelectContent>
                            </Select>
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="rating">Rating (0-5)</Label>
                            <Input
                                id="rating"
                                type="number"
                                step="0.1"
                                {...form.register('rating', { valueAsNumber: true })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reviews">Jumlah Ulasan (Dummy)</Label>
                            <Input
                                id="reviews"
                                type="number"
                                {...form.register('reviews', { valueAsNumber: true })}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 flex items-center justify-between rounded-lg border p-4">
                            <Label>Pilihan Utama (Featured)</Label>
                            <Switch
                                checked={form.watch('featured')}
                                onCheckedChange={(checked) => form.setValue('featured', checked)}
                            />
                        </div>
                        <div className="flex-1 flex items-center justify-between rounded-lg border p-4">
                            <Label>Tampil di Menu</Label>
                            <Switch
                                checked={form.watch('showInMenu')}
                                onCheckedChange={(checked) => form.setValue('showInMenu', checked)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Fasilitas (Tekan Enter)</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Toilet, Parkir, Gazebo..."
                                value={facilityInput}
                                onChange={(e) => setFacilityInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addFacility();
                                    }
                                }}
                            />
                            <Button type="button" variant="outline" onClick={addFacility}>
                                Tambah
                            </Button>
                        </div>
                        {facilities.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {facilities.map((facility) => (
                                    <Badge key={facility} variant="secondary">
                                        {facility}
                                        <button
                                            type="button"
                                            onClick={() => removeFacility(facility)}
                                            className="ml-2 hover:text-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="content">Konten / Deskripsi Lengkap</Label>
                <RichTextEditor
                    value={form.watch('content') || ''}
                    onChange={(val: string) => form.setValue('content', val)}
                    placeholder="Tuliskan deskripsi lengkap tentang tempat wisata ini..."
                />
            </div>
        </form>
    );
}
