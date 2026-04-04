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
import { format } from 'date-fns'

export interface News {
  id: string
  slug: string
  title: string
  excerpt: string | null
  categoryId: string
  category: {
    id: string
    name: string
    slug: string
  }
  publishedAt: Date | null
  featured: boolean
  showInMenu: boolean
  order: number
  status: 'DRAFT' | 'PUBLISHED'
}

export const newsColumns: ColumnDef<News>[] = [
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
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const title = row.getValue('title') as string
      const featured = row.original.featured
      return (
        <div className="max-w-[300px]">
          <div className="font-medium truncate">{title}</div>
          {featured && <Badge variant="secondary" className="mt-1">Featured</Badge>}
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
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const publishedAt = row.original.publishedAt
      const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        PUBLISHED: 'default',
        DRAFT: 'secondary',
      }
      return (
        <div className="flex flex-col gap-1">
          <Badge variant={variantMap[status] || 'secondary'}>
            {status}
          </Badge>
          {publishedAt && (
            <span className="text-xs text-muted-foreground">
              {format(new Date(publishedAt), 'MMM d, yyyy')}
            </span>
          )}
        </div>
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
      const news = row.original

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
                  new CustomEvent('view-news', { detail: news })
                )
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('edit-news', { detail: news })
                )
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('delete-news', { detail: news })
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
