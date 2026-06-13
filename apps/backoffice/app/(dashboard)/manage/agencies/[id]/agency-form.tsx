"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { agencySchema } from '@/lib/validations/agency';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { z } from 'zod';

interface Agency {
  id: string;
  slug: string;
  name: string;
  nickname: string;
  description: string;
  category: string;
  status: string;
  showInMenu: boolean;
  order: number;
  logo: { id: string; cdnUrl: string } | null;
}

interface AgencyFormProps {
  agencyId: string;
}

export function AgencyForm({ agencyId }: AgencyFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [logoId, setLogoId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof agencySchema>>({
    resolver: zodResolver(agencySchema),
    mode: 'onBlur',
    defaultValues: {
      slug: '',
      name: '',
      nickname: '',
      description: '',
      category: 'DINAS',
      status: 'ACTIVE',
      showInMenu: true,
      order: 0,
      logoId: '',
    } as z.infer<typeof agencySchema>,
  });

  const { errors } = form.formState;

  useEffect(() => {
    const fetchAgency = async () => {
      try {
        const response = await fetch(`/api/agencies/${agencyId}`);
        if (!response.ok) throw new Error('Failed to fetch agency');

        const agency: Agency = await response.json();
        setLogoId(agency.logo?.id || null);

        form.reset({
          slug: agency.slug,
          name: agency.name,
          nickname: agency.nickname,
          description: agency.description,
          category: agency.category as any,
          status: agency.status as any,
          showInMenu: agency.showInMenu,
          order: agency.order,
        });
      } catch (error) {
        console.error('Error fetching agency:', error);
        toast.error('Failed to load agency data');
        router.push('/manage/agencies');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgency();
  }, [agencyId, form, router]);

  const handleSubmit = async (data: z.infer<typeof agencySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/agencies/${agencyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, logoId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal mengupdate Perangkat Daerah');
      }

      toast.success('Perangkat Daerah berhasil diupdate');
      router.push('/manage/agencies');
    } catch (error) {
      console.error('Error updating agency:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal mengupdate Perangkat Daerah');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" {...form.register('name')} className={cn(errors.name && 'border-destructive')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nickname">Nickname *</Label>
                <Input id="nickname" {...form.register('nickname')} className={cn(errors.nickname && 'border-destructive')} />
                {errors.nickname && <p className="text-sm text-destructive">{errors.nickname.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input id="slug" {...form.register('slug')} className={cn(errors.slug && 'border-destructive')} />
                {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" {...form.register('description')} rows={4} className={cn(errors.description && 'border-destructive resize-none')} />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value) => form.setValue('category', value as any)} value={form.watch('category')}>
                <SelectTrigger className={cn(errors.category && 'border-destructive')}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BADAN">Badan</SelectItem>
                  <SelectItem value="DINAS">Dinas</SelectItem>
                  <SelectItem value="KECAMATAN">Kecamatan</SelectItem>
                  <SelectItem value="DESA">Desa</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select onValueChange={(value) => form.setValue('status', value as any)} value={form.watch('status')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Aktif</SelectItem>
                  <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input id="order" type="number" {...form.register('order', { valueAsNumber: true })} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : <><Save className="mr-2 h-4 w-4" />Update Perangkat Daerah</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
