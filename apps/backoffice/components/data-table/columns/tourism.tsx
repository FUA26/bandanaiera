'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'

export interface Tourism {
  id: string
  slug: string
  name: string
  description: string | null
  categoryId: string
  category: {
    id: string
    name: string
    slug: string
  }
  imageId: string | null
  image: {
    id: string
    cdnUrl: string
  } | null
  location: string | null
  featured: boolean
  showInMenu: boolean
  order: number
  status: 'DRAFT' | 'PUBLISHED'
}

export const tourismColumns: ColumnDef<Tourism>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const name = row.getValue('name') as string
      const featured = row.original.featured
      return (
        <div className="flex items-center gap-3">
          {row.original.image ? (
            <div className="relative h-10 w-10 rounded overflow-hidden bg-muted flex-shrink-0">
              <Image src={row.original.image.cdnUrl} alt="" fill className="object-cover" />
            </div>
          ) : (
            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground flex-shrink-0">
              No img
            </div>
          )}
          <div className="max-w-[300px]">
            <div className="font-medium truncate">{name}</div>
            {featured && <Badge variant="secondary" className="mt-1">Featured</Badge>}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.original.category
      return <div>{category?.name || '-'}</div>
    },
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => {
      const location = row.getValue('location') as string | null
      return <div className="max-w-[200px] truncate">{location || '-'}</div>
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        PUBLISHED: 'default',
        DRAFT: 'secondary',
      }
      return (
        <Badge variant={variantMap[status] || 'secondary'}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'showInMenu',
    header: 'Visible',
    cell: ({ row }) => {
      const showInMenu = row.getValue('showInMenu') as boolean
      return (
        <Badge variant={showInMenu ? 'default' : 'secondary'}>
          {showInMenu ? 'Yes' : 'No'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'order',
    header: 'Order',
    cell: ({ row }) => <div>{row.getValue('order')}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const tourism = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('view-tourism', { detail: tourism })
                )
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('edit-tourism', { detail: tourism })
                )
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('delete-tourism', { detail: tourism })
                )
              }}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
