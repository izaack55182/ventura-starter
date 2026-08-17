import type { Table } from '@tanstack/react-table'
import { Link } from 'react-router'
// COMPONENTS
import { buttonVariants } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
// UTILS
import useUpdateSearchParams from '@/utils/hooks/use-update-search-params'
import { cn } from '@/utils/misc'

// TYPES
import type { DataTableFilterField } from './types'

type DataTableFilterResetButtonProps<TData> = DataTableFilterField<TData> & {
	table: Table<TData>
}

export function DataTableFilterResetButton<TData>({
	table,
	value: _value,
}: DataTableFilterResetButtonProps<TData>) {
	const value = _value as string
	const { updateSearchParams } = useUpdateSearchParams()
	const column = table.getColumn(value)
	const filterValue = column?.getFilterValue()

	const filters = Array.isArray(filterValue)
		? filterValue
		: filterValue !== undefined && filterValue !== null
			? [filterValue]
			: []

	if (filters.length === 0) return null

	return (
		<Link
			to={{
				search: updateSearchParams({
					[value]: null,
				}),
			}}
			preventScrollReset
			prefetch="intent"
			className={cn(
				buttonVariants({ variant: 'outline', size: 'sm' }),
				'h-6 px-1.5 gap-1 text-muted-foreground hover:text-foreground'
			)}
			onClick={(e) => {
				e.stopPropagation()
				column?.setFilterValue(undefined)
			}}
			title="Restablecer filtro"
			aria-label="Restablecer filtro"
		>
			<span className="text-xs font-medium">{filters.length}</span>
			<Icon name="x" className="size-3" />
		</Link>
	)
}
