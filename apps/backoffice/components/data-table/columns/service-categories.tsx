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
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'

export interface ServiceCategory {
  id: string
  name: string
  slug: string
  icon: string
  color: string
  bgColor: string
  showInMenu: boolean
  order: number
  _count: {
    services: number
  }
}

export const serviceCategoryColumns: ColumnDef<ServiceCategory>[] = [
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
    accessorKey: 'order',
    header: 'Order',
    cell: ({ row }) => <div>{row.getValue('order')}</div>,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const name = row.getValue('name') as string
      return <div className="font-medium">{name}</div>
    },
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => {
      const slug = row.getValue('slug') as string
      return <div className="text-muted-foreground">{slug}</div>
    },
  },
  {
    accessorKey: 'preview',
    header: 'Preview',
    cell: ({ row }) => {
      const category = row.original
      return (
        <Badge
          style={{
            backgroundColor: category.bgColor,
            color: category.color,
          }}
        >
          {category.icon.charAt(0)} {category.name}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'services',
    header: 'Services',
    cell: ({ row }) => {
      const count = row.original._count.services
      return (
        <span className={count > 0 ? 'font-medium' : 'text-muted-foreground'}>
          {count} service{count !== 1 ? 's' : ''}
        </span>
      )
    },
  },
  {
    accessorKey: 'showInMenu',
    header: 'Visible',
    cell: ({ row }) => {
      const showInMenu = row.getValue('showInMenu') as boolean
      return (
        <Badge variant={showInMenu ? 'default' : 'outline'}>
          {showInMenu ? (
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              Visible
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <EyeOff className="h-3 w-3" />
              Hidden
            </span>
          )}
        </Badge>
      )
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
                window.dispatchEvent(
                  new CustomEvent('edit-service-category', { detail: category })
                )
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('delete-service-category', { detail: category })
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
