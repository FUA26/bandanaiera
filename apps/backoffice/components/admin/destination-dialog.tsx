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
import { X, ImageIcon, Loader2 } from 'lucide-react';
import { destinationSchema } from '@/lib/validations/destination';
import { FileUpload } from '@/components/file-upload/file-upload';
import Image from 'next/image';

interface DestinationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destination?: any;
  categories: any[];
  facilities: any[];
  onSuccess: () => void;
}

export function DestinationDialog({
  open,
  onOpenChange,
  destination,
  categories,
  facilities: allFacilities,
  onSuccess,
}: DestinationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(destinationSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      categoryId: '',
      locationAddress: '',
      locationLat: undefined,
      locationLng: undefined,
      priceInfo: '',
      openHours: '',
      rating: undefined,
      isFeatured: false,
      showInMenu: true,
      order: 0,
      coverImageId: '',
      status: 'DRAFT',
      facilities: [],
    },
  });

  useEffect(() => {
    if (destination) {
      form.reset({
        name: destination.name || '',
        slug: destination.slug || '',
        description: destination.description || '',
        categoryId: destination.categoryId || '',
        locationAddress: destination.locationAddress || '',
        locationLat: destination.locationLat ? parseFloat(destination.locationLat.toString()) : undefined,
        locationLng: destination.locationLng ? parseFloat(destination.locationLng.toString()) : undefined,
        priceInfo: destination.priceInfo || '',
        openHours: destination.openHours || '',
        rating: destination.rating ? parseFloat(destination.rating.toString()) : undefined,
        isFeatured: destination.isFeatured || false,
        showInMenu: destination.showInMenu || true,
        order: destination.order || 0,
        coverImageId: destination.coverImageId || '',
        status: destination.status || 'DRAFT',
      });
      setSelectedFacilities(destination.facilities?.map((f: any) => f.facilityId) || []);
      setPreviewUrl(destination.coverImage?.cdnUrl || null);
    } else {
      form.reset({
        name: '',
        slug: '',
        description: '',
        categoryId: '',
        locationAddress: '',
        locationLat: undefined,
        locationLng: undefined,
        priceInfo: '',
        openHours: '',
        rating: undefined,
        isFeatured: false,
        showInMenu: true,
        order: 0,
        coverImageId: '',
        status: 'DRAFT',
        facilities: [],
      });
      setSelectedFacilities([]);
      setPreviewUrl(null);
    }
  }, [destination, form, open]);

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      const url = destination ? `/api/destinations/${destination.id}` : '/api/destinations';
      const method = destination ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          facilities: selectedFacilities,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save destination');
      }

      toast.success(destination ? 'Destination updated' : 'Destination created');
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

  const toggleFacility = (facilityId: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facilityId)
        ? prev.filter((id) => id !== facilityId)
        : [...prev, facilityId]
    );
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{destination ? 'Edit Destination' : 'Add New Destination'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="Destination name" {...field} />
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
                        <Input placeholder="destination-slug" {...field} />
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
                          placeholder="Detailed description"
                          className="h-32 resize-none"
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
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
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

                <FormField
                  control={form.control}
                  name="locationAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Full address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="locationLat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input type="number" step="any" placeholder="-4.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="locationLng"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input type="number" step="any" placeholder="129.9" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-6">
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

                <div className="space-y-4">
                  <FormLabel>Facilities</FormLabel>
                  <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto p-2 border rounded-md">
                    {allFacilities.map((facility) => (
                      <Badge
                        key={facility.id}
                        variant={selectedFacilities.includes(facility.id) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleFacility(facility.id)}
                      >
                        {facility.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="priceInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price Info</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Rp 50.000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="openHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Open Hours</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 08:00 - 17:00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Rating (0-5)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" min="0" max="5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                {destination ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
