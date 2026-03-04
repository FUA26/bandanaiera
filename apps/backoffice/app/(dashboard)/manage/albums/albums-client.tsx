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
import { Plus, MoreHorizontal, Pencil, Trash2, FolderOpen } from 'lucide-react';
import { AlbumDialog } from '@/components/admin/album-dialog';
import { toast } from 'sonner';
import Image from 'next/image';
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

interface AlbumsClientProps {
  initialAlbums: any[];
}

export function AlbumsClient({ initialAlbums }: AlbumsClientProps) {
  const [albums, setAlbums] = useState(initialAlbums);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState<any>(null);

  const filteredAlbums = albums.filter((album) =>
    album.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const refreshAlbums = async () => {
    try {
      const response = await fetch('/api/albums');
      if (response.ok) {
        const data = await response.json();
        setAlbums(data.items);
      }
    } catch (error) {
      console.error('Failed to refresh albums:', error);
    }
  };

  const handleAdd = () => {
    setEditingAlbum(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (album: any) => {
    setEditingAlbum(album);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!albumToDelete) return;
    try {
      const response = await fetch(`/api/albums/${albumToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete album');
      }

      toast.success('Album deleted');
      refreshAlbums();
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Album Foto</h1>
          <p className="text-muted-foreground">
            Kelola kategori/album untuk mengelompokkan foto.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Album
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Cari album..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cover</TableHead>
              <TableHead>Nama Album</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Jumlah Foto</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAlbums.map((album) => (
              <TableRow key={album.id}>
                <TableCell>
                  {album.coverImage ? (
                    <div className="relative h-10 w-10 rounded overflow-hidden border">
                      <Image
                        src={album.coverImage.cdnUrl}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center border">
                      <FolderOpen className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{album.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{album.slug}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {album._count?.photos || 0} Foto
                  </Badge>
                </TableCell>
                <TableCell>{album.order}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(album)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setAlbumToDelete(album);
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
            {filteredAlbums.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Belum ada album.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlbumDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        album={editingAlbum}
        onSuccess={refreshAlbums}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Album</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus album &quot;{albumToDelete?.name}&quot;? 
              Album hanya bisa dihapus jika sudah tidak memiliki foto di dalamnya.
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
