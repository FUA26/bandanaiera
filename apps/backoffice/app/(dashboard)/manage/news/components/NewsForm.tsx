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
import { EnhancedImageUploader } from '@/components/ui/image-upload/enhanced-image-uploader';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import Link from 'next/link';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';

const newsSchema = z.object({
    title: z.string().min(1).max(200),
    slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
    excerpt: z.string().min(1).max(500),
    content: z.string().optional(),
    categoryId: z.string().min(1),
    featuredImageId: z.string().optional(),
    featured: z.boolean().default(false),
    showInMenu: z.boolean().default(true),
    order: z.number().int().min(0).default(0),
    author: z.string().max(100).optional(),
    readTime: z.string().max(50).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
});

type NewsFormValues = z.infer<typeof newsSchema>;

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface NewsFormProps {
    initialData?: any;
    categories: Category[];
}

export function NewsForm({ initialData, categories }: NewsFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tags, setTags] = useState<string[]>(initialData?.tags || []);
    const [tagInput, setTagInput] = useState('');

    const form = useForm({
        resolver: zodResolver(newsSchema),
        defaultValues: {
            title: initialData?.title || '',
            slug: initialData?.slug || '',
            excerpt: initialData?.excerpt || '',
            content: initialData?.content || '',
            categoryId: initialData?.categoryId || '',
            featuredImageId: initialData?.featuredImageId || '',
            featured: initialData?.featured || false,
            showInMenu: initialData?.showInMenu ?? true,
            order: initialData?.order || 0,
            author: initialData?.author || '',
            readTime: initialData?.readTime || '',
            status: initialData?.status || 'DRAFT',
        },
    });

    const onSubmit = async (data: NewsFormValues) => {
        setIsSubmitting(true);
        try {
            const url = initialData ? `/api/news/${initialData.id}` : '/api/news';
            const method = initialData ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    tags,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Gagal menyimpan berita');
            }

            toast.success(initialData ? 'Berita berhasil diupdate' : 'Berita berhasil dibuat');
            router.push('/manage/news');
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal menyimpan');
        } finally {
            setIsSubmitting(false);
        }
    };

    const addTag = () => {
        const tag = tagInput.trim();
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter((t) => tag !== t));
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl pb-20">
            <div className="flex items-center justify-between">
                <Link href="/manage/news" className="flex items-center text-sm text-muted-foreground hover:text-primary">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke daftar berita
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? 'Update Berita' : 'Buat Berita'}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Judul</Label>
                        <Input id="title" {...form.register('title')} placeholder="Masukkan judul berita" />
                        {form.formState.errors.title && (
                            <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" {...form.register('slug')} placeholder="url-berita" />
                        {form.formState.errors.slug && (
                            <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="excerpt">Ringkasan</Label>
                        <Textarea
                            id="excerpt"
                            {...form.register('excerpt')}
                            placeholder="Ringkasan singkat untuk kartu berita"
                            rows={3}
                        />
                        {form.formState.errors.excerpt && (
                            <p className="text-sm text-destructive">{form.formState.errors.excerpt.message}</p>
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
                            <Label htmlFor="author">Penulis</Label>
                            <Input id="author" {...form.register('author')} placeholder="Nama penulis" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="readTime">Waktu Baca</Label>
                            <Input id="readTime" {...form.register('readTime')} placeholder="5 menit baca" />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <FormField
                        control={form.control}
                        name="featuredImageId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gambar Unggulan</FormLabel>
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
                                value={form.watch('status')}
                                onValueChange={(value) => form.setValue('status', value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED')}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DRAFT">DRAFT</SelectItem>
                                    <SelectItem value="PUBLISHED">DITERBITKAN</SelectItem>
                                    <SelectItem value="ARCHIVED">DIARSIPKAN</SelectItem>
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

                    <div className="flex gap-4">
                        <div className="flex-1 flex items-center justify-between rounded-lg border p-4">
                            <Label>Unggulan</Label>
                            <Switch
                                checked={form.watch('featured')}
                                onCheckedChange={(checked) => form.setValue('featured', checked)}
                            />
                        </div>
                        <div className="flex-1 flex items-center justify-between rounded-lg border p-4">
                            <Label>Terlihat</Label>
                            <Switch
                                checked={form.watch('showInMenu')}
                                onCheckedChange={(checked) => form.setValue('showInMenu', checked)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Tag</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Tambahkan tag"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addTag();
                                    }
                                }}
                            />
                            <Button type="button" variant="outline" onClick={addTag}>
                                Tambah
                            </Button>
                        </div>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Badge key={tag} variant="secondary">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
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
                <Label htmlFor="content">Konten</Label>
                <RichTextEditor
                    value={form.watch('content') || ''}
                    onChange={(val: string) => form.setValue('content', val)}
                    placeholder="Konten artikel lengkap..."
                />
            </div>
        </form>
        </Form>
    );
}
