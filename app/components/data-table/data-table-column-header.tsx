// CORE

import type { Column } from '@tanstack/react-table'
import { Link } from 'react-router'
// COMPONENTS
import { Icon } from '@/components/ui/icon'
import useUpdateSearchParams from '@/utils/hooks/use-update-search-params'
// UTILS
import { cn } from '@/utils/misc'

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>
	title?: string
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) {
	const { updateSearchParams } = useUpdateSearchParams()

	const columnTitle = title || (column.columnDef.meta as { label?: string })?.label || column.id

	if (!column.getCanSort()) {
		return <div className={cn('text-xs font-bold text-zinc-500', className)}>{columnTitle}</div>
	}

	const currentSort = column.getIsSorted()
	const sortDirection = currentSort === 'desc' ? 'asc' : currentSort === 'asc' ? false : 'desc'

	return (
		<div className={cn('flex items-center space-x-2', className)}>
			<Link
				to={{
					search: updateSearchParams({
						sortDirection: sortDirection || null,
						sortColumn: sortDirection ? column.id : null,
					}),
				}}
				preventScrollReset
				prefetch="intent"
				onClick={() => {
					if (currentSort === 'desc') {
						column.toggleSorting(false)
					} else if (currentSort === 'asc') {
						column.clearSorting()
					} else {
						column.toggleSorting(true)
					}
				}}
				className={cn(
					'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
					'h-8 px-3 -ml-3 group',
					currentSort
						? 'bg-primary/10 text-primary'
						: 'bg-transparent text-muted-foreground hover:bg-primary/10 hover:text-primary'
				)}
			>
				<span className="text-xs font-bold">{columnTitle}</span>

				<div
					className={cn(
						'flex items-center justify-center transition-all duration-300 ease-out overflow-hidden',
						currentSort
							? 'ml-2 w-5 scale-100 opacity-100'
							: 'w-0 opacity-0 scale-50 group-hover:ml-2 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100'
					)}
				>
					{currentSort === 'desc' ? (
						<Icon name="chevron-down" className="size-3.5" />
					) : currentSort === 'asc' ? (
						<Icon name="chevron-up" className="size-3.5" />
					) : (
						<Icon name="chevrons-up-down" className="size-3.5 opacity-50" />
					)}
				</div>
			</Link>
		</div>
	)
}
