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
import { X, ImageIcon, Loader2 } from 'lucide-react';
import { albumSchema } from '@/lib/validations/gallery';
import { FileUpload } from '@/components/file-upload/file-upload';
import Image from 'next/image';

interface AlbumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  album?: any;
  onSuccess: () => void;
}

export function AlbumDialog({
  open,
  onOpenChange,
  album,
  onSuccess,
}: AlbumDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(albumSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      coverImageId: '',
      order: 0,
    },
  });

  useEffect(() => {
    if (album) {
      form.reset({
        name: album.name || '',
        slug: album.slug || '',
        description: album.description || '',
        coverImageId: album.coverImageId || '',
        order: album.order || 0,
      });
      setPreviewUrl(album.coverImage?.cdnUrl || null);
    } else {
      form.reset({
        name: '',
        slug: '',
        description: '',
        coverImageId: '',
        order: 0,
      });
      setPreviewUrl(null);
    }
  }, [album, form, open]);

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      const url = album ? `/api/albums/${album.id}` : '/api/albums';
      const method = album ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save album');
      }

      toast.success(album ? 'Album updated' : 'Album created');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadComplete = (fileId: string, url: string) => {
    form.setValue('coverImageId', fileId);
    setPreviewUrl(url);
    toast.success('Cover image uploaded');
  };

  const generateSlug = () => {
    const name = form.getValues('name');
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      form.setValue('slug', slug);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{album ? 'Edit Album' : 'Create New Album'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Album Name</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="e.g. Wisata Alam" {...field} />
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
                    <Input placeholder="album-slug" {...field} />
                  </FormControl>
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
                      placeholder="Short description of the album"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Cover Image</FormLabel>
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
                          form.setValue('coverImageId', '');
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/50 text-muted-foreground">
                      <ImageIcon className="h-10 w-10 mb-2 opacity-20" />
                      <p className="text-sm">No cover image</p>
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
                name="coverImageId"
                render={({ field }) => (
                  <FormMessage />
                )}
              />
            </FormItem>

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
                {album ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
