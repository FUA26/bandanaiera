'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Plus, ImageIcon, Loader2 } from 'lucide-react';
import { photoSchema } from '@/lib/validations/gallery';
import { FileUpload } from '@/components/file-upload/file-upload';
import Image from 'next/image';

interface PhotoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photo?: any;
  albums: any[];
  tags: any[];
  onSuccess: () => void;
}

export function PhotoDialog({
  open,
  onOpenChange,
  photo,
  albums,
  tags: allTags,
  onSuccess,
}: PhotoDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      albumId: '',
      imageId: '',
      location: '',
      photographer: '',
      isFeatured: false,
      showInMenu: true,
      order: 0,
      status: 'DRAFT',
      tags: [],
    },
  });

  useEffect(() => {
    if (photo) {
      form.reset({
        title: photo.title || '',
        slug: photo.slug || '',
        description: photo.description || '',
        albumId: photo.albumId || '',
        imageId: photo.imageId || '',
        location: photo.location || '',
        photographer: photo.photographer || '',
        isFeatured: photo.isFeatured || false,
        showInMenu: photo.showInMenu || true,
        order: photo.order || 0,
        status: photo.status || 'DRAFT',
      });
      setSelectedTags(photo.tags?.map((t: any) => t.tag.id) || []);
      setPreviewUrl(photo.image?.cdnUrl || null);
    } else {
      form.reset({
        title: '',
        slug: '',
        description: '',
        albumId: '',
        imageId: '',
        location: '',
        photographer: '',
        isFeatured: false,
        showInMenu: true,
        order: 0,
        status: 'DRAFT',
        tags: [],
      });
      setSelectedTags([]);
      setPreviewUrl(null);
    }
  }, [photo, form, open]);

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      const url = photo ? `/api/photos/${photo.id}` : '/api/photos';
      const method = photo ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          tags: selectedTags,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save photo');
      }

      toast.success(photo ? 'Photo updated' : 'Photo created');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadComplete = (fileId: string, url: string) => {
    form.setValue('imageId', fileId);
    setPreviewUrl(url);
    toast.success('Image uploaded');
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const generateSlug = () => {
    const title = form.getValues('title');
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      form.setValue('slug', slug);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{photo ? 'Edit Photo' : 'Add New Photo'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="Photo title" {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={generateSlug}
                        >
                          Slug
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="photo-slug" {...field} />
                      </FormControl>
                      <FormDescription>
                        Unique identifier for the photo URL
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Short description of the photo"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="albumId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Album</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select album" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">No Album</SelectItem>
                            {albums.map((album) => (
                              <SelectItem key={album.id} value={album.id}>
                                {album.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="DRAFT">Draft</SelectItem>
                            <SelectItem value="PUBLISHED">Published</SelectItem>
                            <SelectItem value="ARCHIVED">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Banda Neira" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="photographer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Photographer</FormLabel>
                        <FormControl>
                          <Input placeholder="Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <FormItem>
                  <FormLabel>Photo Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {previewUrl ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setPreviewUrl(null);
                              form.setValue('imageId', '');
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/50 text-muted-foreground">
                          <ImageIcon className="h-10 w-10 mb-2 opacity-20" />
                          <p className="text-sm">No image selected</p>
                        </div>
                      )}
                      <FileUpload
                        category="IMAGE"
                        accept={{ 'image/*': [] }}
                        onUploadComplete={handleUploadComplete}
                        className="w-full"
                      />
                    </div>
                  </FormControl>
                  <FormField
                    control={form.control}
                    name="imageId"
                    render={({ field }) => (
                      <FormMessage />
                    )}
                  />
                </FormItem>

                <div className="space-y-4">
                  <FormLabel>Tags</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleTag(tag.id)}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                    {allTags.length === 0 && (
                      <p className="text-sm text-muted-foreground italic">
                        No tags available.
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-y-0">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Featured</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="showInMenu"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-y-0">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Visible</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {photo ? 'Update Photo' : 'Save Photo'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
