"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { opdSchema } from '@/lib/validations/opd';
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
import { ArrowLeft, Save, Loader2, Building2 } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { LogoUpload } from '@/components/logo-upload';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Opd {
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
  logoId?: string | null;
}

export function OpdForm() {
  const router = useRouter();
  const pathname = usePathname();
  const opdId = pathname.split('/').pop() || '';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [logoId, setLogoId] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [opdName, setOpdName] = useState<string>('');
  const [opdNickname, setOpdNickname] = useState<string>('');

  const form = useForm<z.infer<typeof opdSchema>>({
    resolver: zodResolver(opdSchema),
    mode: 'onBlur',
    defaultValues: {
      slug: '',
      name: '',
      nickname: '',
      description: '',
      category: 'DINAS',
      status: 'AKTIF',
      showInMenu: true,
      order: 0,
      logoId: '',
    } as z.infer<typeof opdSchema>,
  });

  const { errors } = form.formState;

  useEffect(() => {
    if (!opdId) return;

    const fetchOpd = async () => {
      try {
        const response = await fetch(`/api/opd/${opdId}`);
        if (!response.ok) throw new Error('Failed to fetch OPD');

        const opd: Opd = await response.json();
        setLogoId(opd.logo?.id || null);
        setLogoUrl(opd.logo?.cdnUrl || `/api/public/files/${opd.logo?.id}/serve` || null);
        setOpdName(opd.name);
        setOpdNickname(opd.nickname);

        form.reset({
          slug: opd.slug,
          name: opd.name,
          nickname: opd.nickname,
          description: opd.description,
          category: opd.category as any,
          status: opd.status as any,
          showInMenu: opd.showInMenu,
          order: opd.order,
          logoId: opd.logo?.id || '',
        });
      } catch (error) {
        console.error('Error fetching OPD:', error);
        toast.error('Failed to load OPD data');
        router.push('/manage/opd');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpd();
  }, [opdId, form, router]);

  // Update preview when name changes
  useEffect(() => {
    const name = form.watch('name');
    if (name) {
      setOpdName(name);
    }
  }, [form.watch('name')]);

  // Update preview when nickname changes
  useEffect(() => {
    const nickname = form.watch('nickname');
    if (nickname) {
      setOpdNickname(nickname);
    }
  }, [form.watch('nickname')]);

  const handleSubmit = async (data: z.infer<typeof opdSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/opd/${opdId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, logoId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal mengupdate OPD');
      }

      toast.success('OPD berhasil diupdate');
      router.push('/manage/opd');
    } catch (error) {
      console.error('Error updating OPD:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal mengupdate OPD');
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
                  <SelectItem value="DINAS">Dinas</SelectItem>
                  <SelectItem value="BADAN">Badan</SelectItem>
                  <SelectItem value="KECAMATAN">Kecamatan</SelectItem>
                  <SelectItem value="KELURAHAN">Kelurahan</SelectItem>
                  <SelectItem value="DESA">Desa</SelectItem>
                  <SelectItem value="BAGIAN">Bagian</SelectItem>
                  <SelectItem value="ORGANISASI_LAINNYA">Organisasi Lainnya</SelectItem>
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
                  <SelectItem value="AKTIF">Aktif</SelectItem>
                  <SelectItem value="NONAKTIF">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input id="order" type="number" {...form.register('order', { valueAsNumber: true })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logo OPD</CardTitle>
          </CardHeader>
          <CardContent>
            <LogoUpload
              value={logoId || ''}
              logoUrl={logoUrl}
              onChange={(value) => {
                setLogoId(value || null);
                setLogoUrl(value ? `/api/public/files/${value}/serve` : null);
                // Update form value
                form.setValue('logoId', value || '', { shouldDirty: true });
              }}
              disabled={isSubmitting}
            />
          </CardContent>
        </Card>

        {/* Preview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Preview OPD</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
              <Avatar className="h-20 w-20">
                <AvatarImage src={logoUrl || undefined} alt={opdName || opdNickname} />
                <AvatarFallback>
                  <Building2 className="h-10 w-10 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{opdName || 'Nama OPD'}</h3>
                <p className="text-sm text-muted-foreground">{opdNickname || 'Nickname'}</p>
                {logoUrl && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Logo aktif
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : <><Save className="mr-2 h-4 w-4" />Update OPD</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
