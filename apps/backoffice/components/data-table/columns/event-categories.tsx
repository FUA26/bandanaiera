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
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'

export interface EventCategory {
  id: string
  name: string
  slug: string
  color: string
  showInMenu: boolean
  order: number
  _count?: {
    events: number
  }
}

export const eventCategoriesColumns: ColumnDef<EventCategory>[] = [
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
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('name')}</div>
    ),
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => (
      <code className="text-xs bg-muted px-2 py-1 rounded">
        {row.getValue('slug')}
      </code>
    ),
  },
  {
    accessorKey: 'color',
    header: 'Color',
    cell: ({ row }) => {
      const color = row.getValue('color') as string
      return (
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center justify-center w-4 h-4 rounded-full bg-${color}`}
          />
          <span className="capitalize">{color}</span>
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
    accessorKey: 'events',
    header: 'Events',
    cell: ({ row }) => {
      const count = row.original._count?.events || 0
      return <div>{count}</div>
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const category = row.original

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
                // This will be handled by parent component
                window.dispatchEvent(
                  new CustomEvent('edit-category', { detail: category })
                )
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                // This will be handled by parent component
                window.dispatchEvent(
                  new CustomEvent('delete-category', { detail: category })
                )
              }}
              className="text-destructive"
              disabled={(category._count?.events || 0) > 0}
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
