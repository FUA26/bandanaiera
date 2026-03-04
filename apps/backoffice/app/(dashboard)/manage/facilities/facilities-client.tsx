'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal, Pencil, Trash2, Utensils } from 'lucide-react';
import { FacilityDialog } from '@/components/admin/facility-dialog';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface FacilitiesClientProps {
  initialFacilities: any[];
  categories: any[];
}

export function FacilitiesClient({ initialFacilities, categories }: FacilitiesClientProps) {
  const [facilities, setFacilities] = useState(initialFacilities);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState<any>(null);

  const filteredFacilities = facilities.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const refreshFacilities = async () => {
    try {
      const response = await fetch('/api/facilities');
      if (response.ok) {
        const data = await response.json();
        setFacilities(data);
      }
    } catch (error) {
      console.error('Failed to refresh facilities:', error);
    }
  };

  const handleAdd = () => {
    setEditingFacility(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (facility: any) => {
    setEditingFacility(facility);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!facilityToDelete) return;
    try {
      const response = await fetch(`/api/facilities/${facilityToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete facility');
      }

      toast.success('Facility deleted');
      refreshFacilities();
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fasilitas Destinasi</h1>
          <p className="text-muted-foreground">
            Kelola daftar fasilitas yang dapat ditambahkan ke destinasi wisata.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Fasilitas
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Cari fasilitas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Nama Fasilitas</TableHead>
              <TableHead>Kategori Terkait</TableHead>
              <TableHead>Digunakan di</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFacilities.map((f) => (
              <TableRow key={f.id}>
                <TableCell>
                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center border">
                    <Utensils className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{f.name}</TableCell>
                <TableCell>
                  {f.category ? (
                    <Badge variant="outline">{f.category.name}</Badge>
                  ) : (
                    <span className="text-muted-foreground text-xs italic">Semua</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {f._count?.destinations || 0} Destinasi
                  </Badge>
                </TableCell>
                <TableCell>{f.order}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(f)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setFacilityToDelete(f);
                          setDeleteDialogOpen(true);
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredFacilities.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Belum ada fasilitas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <FacilityDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        facility={editingFacility}
        categories={categories}
        onSuccess={refreshFacilities}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Fasilitas</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus fasilitas &quot;{facilityToDelete?.name}&quot;? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
