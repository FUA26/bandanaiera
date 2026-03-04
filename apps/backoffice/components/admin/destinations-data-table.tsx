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
import { DestinationTableActions } from './destination-table-actions';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, Star } from 'lucide-react';

interface DestinationsDataTableProps {
  data: any[];
  categories: any[];
  onRefresh: () => void;
  onEdit: (destination: any) => void;
  onViewLogs: (destination: any) => void;
}

export function DestinationsDataTable({
  data,
  categories,
  onRefresh,
  onEdit,
  onViewLogs,
}: DestinationsDataTableProps) {
  const [globalFilter, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredData = data.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
      (item.description?.toLowerCase() || '').includes(globalFilter.toLowerCase()) ||
      (item.locationAddress?.toLowerCase() || '').includes(globalFilter.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.categoryId === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'image',
      header: 'Cover',
      cell: ({ row }) => {
        const image = row.original.coverImage;
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
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="max-w-[250px]">
          <div className="font-medium truncate">{row.original.name}</div>
          <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {row.original.locationAddress || 'No address'}
          </div>
          {row.original.isFeatured && (
            <Badge variant="secondary" className="mt-1 text-[10px] h-4">Featured</Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.category?.name || 'Uncategorized'}
        </Badge>
      ),
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
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-sm">{row.original.rating?.toString() || '0'}</span>
          <span className="text-xs text-muted-foreground">({row.original.reviewsCount})</span>
        </div>
      ),
    },
    {
      accessorKey: 'order',
      header: 'Order',
      cell: ({ row }) => row.original.order,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DestinationTableActions
          destination={row.original}
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
          placeholder="Search destinations..."
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
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
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
                  No destinations found.
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
