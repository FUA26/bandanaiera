'use client';

import { useState } from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PhotoTableActions } from './photos-table-actions';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PhotosDataTableProps {
  data: any[];
  albums: any[];
  onRefresh: () => void;
  onEdit: (photo: any) => void;
  onViewLogs: (photo: any) => void;
}

export function PhotosDataTable({
  data,
  albums,
  onRefresh,
  onEdit,
  onViewLogs,
}: PhotosDataTableProps) {
  const [globalFilter, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [albumFilter, setAlbumFilter] = useState<string>('all');

  const filteredData = data.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(globalFilter.toLowerCase()) ||
      (item.description?.toLowerCase() || '').includes(globalFilter.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesAlbum = albumFilter === 'all' || item.albumId === albumFilter;

    return matchesSearch && matchesStatus && matchesAlbum;
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'image',
      header: 'Image',
      cell: ({ row }) => {
        const image = row.original.image;
        return image ? (
          <div className="relative h-12 w-12 rounded overflow-hidden bg-muted border">
            <Image
              src={image.cdnUrl}
              alt=""
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground border">
            No image
          </div>
        );
      },
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="max-w-[300px]">
          <div className="font-medium truncate">{row.original.title}</div>
          <div className="text-xs text-muted-foreground truncate">{row.original.slug}</div>
          {row.original.isFeatured && (
            <Badge variant="secondary" className="mt-1 text-[10px] h-4">Featured</Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'album',
      header: 'Album',
      cell: ({ row }) => row.original.album?.name || <span className="text-muted-foreground italic text-xs">No Album</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={
              status === 'PUBLISHED' ? 'default' : status === 'DRAFT' ? 'secondary' : 'outline'
            }
          >
            {status.toLowerCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'views',
      header: 'Stats',
      cell: ({ row }) => (
        <div className="text-xs space-y-1">
          <div>Views: {row.original.views}</div>
          <div>Likes: {row.original.likes}</div>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => (
        <div className="text-xs text-muted-foreground">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <PhotoTableActions
          photo={row.original}
          onRefresh={onRefresh}
          onEdit={onEdit}
          onViewLogs={onViewLogs}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search photos..."
          value={globalFilter}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={albumFilter} onValueChange={setAlbumFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Album" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Albums</SelectItem>
              {albums.map((album) => (
                <SelectItem key={album.id} value={album.id}>
                  {album.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : typeof header.column.columnDef.header === 'function'
                      ? header.column.columnDef.header(header.getContext())
                      : header.column.columnDef.header}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {typeof cell.column.columnDef.cell === 'function'
                        ? cell.column.columnDef.cell(cell.getContext())
                        : cell.getValue() as any}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No photos found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
