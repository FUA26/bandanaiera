'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Star, Archive, Check, Eye, Trash2 } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '../column-header'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

export interface Feedback {
  id: string
  projectId: string
  rating: number
  status: 'new' | 'read' | 'archived'
  answers: {
    tags?: string[]
    comment?: string
    email?: string
  }
  meta?: {
    url?: string
    browser?: string
    os?: string
  }
  createdAt: Date
  updatedAt: Date
}

interface GetFeedbacksColumnsParams {
  onView?: (feedback: Feedback) => void
  onDelete?: (feedback: Feedback) => void
  onStatusChange?: (feedback: Feedback, status: string) => void
}

export function getFeedbacksColumns({
  onView,
  onDelete,
  onStatusChange,
}: GetFeedbacksColumnsParams): ColumnDef<Feedback>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'rating',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rating" />
      ),
      cell: ({ row }) => {
        const rating = row.getValue('rating') as number
        return (
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg',
                rating >= 4 &&
                  'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
                rating <= 2 &&
                  'bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400',
                rating === 3 &&
                  'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
              )}
            >
              <Star className="h-4 w-4 fill-current" />
            </div>
            <span className="font-semibold">{rating}</span>
          </div>
        )
      },
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId) as number
        const filterArray = filterValue as string[]

        if (!filterArray || filterArray.length === 0) return true

        return filterArray.includes(value.toString())
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        return (
          <Badge
            variant={
              status === 'new'
                ? 'default'
                : status === 'read'
                  ? 'secondary'
                  : 'outline'
            }
            className="capitalize"
          >
            {status}
          </Badge>
        )
      },
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId) as string
        const filterArray = filterValue as string[]

        if (!filterArray || filterArray.length === 0) return true

        return filterArray.includes(value)
      },
    },
    {
      accessorKey: 'answers',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Comment" />
      ),
      cell: ({ row }) => {
        const answers = row.getValue('answers') as Feedback['answers']
        const comment = answers?.comment

        return (
          <div className="max-w-md">
            <p className="text-sm line-clamp-2">
              {comment || (
                <span className="text-muted-foreground italic">No comment</span>
              )}
            </p>
            {answers?.tags && answers.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {answers.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {answers.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{answers.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'meta',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Source" />
      ),
      cell: ({ row }) => {
        const meta = row.getValue('meta') as Feedback['meta'] | null
        const url = meta?.url

        if (!url) {
          return <span className="text-muted-foreground text-sm">-</span>
        }

        let hostname = 'Unknown'
        try {
          hostname = new URL(url).hostname
        } catch {
          hostname = url
        }

        return (
          <div className="text-sm">
            <span className="text-muted-foreground">{hostname}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'))
        return (
          <div className="text-sm text-muted-foreground">
            {formatDistanceToNow(date, { addSuffix: true })}
          </div>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const feedback = row.original
        const status = feedback.status

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              {status === 'new' ? (
                <DropdownMenuItem
                  onClick={() => onStatusChange?.(feedback, 'read')}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Mark as Read
                </DropdownMenuItem>
              ) : status === 'read' ? (
                <DropdownMenuItem
                  onClick={() => onStatusChange?.(feedback, 'new')}
                >
                  <Star className="mr-2 h-4 w-4" />
                  Mark as New
                </DropdownMenuItem>
              ) : null}

              <DropdownMenuItem
                onClick={() => onStatusChange?.(feedback, 'archived')}
              >
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onView?.(feedback)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete?.(feedback)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
  ]
}
