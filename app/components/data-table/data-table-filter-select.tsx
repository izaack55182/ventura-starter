import type { Table } from '@tanstack/react-table'
import { useNavigate } from 'react-router'
import { Label } from '@/components/ui/label'

// COMPONENTS
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
// UTILS
import useUpdateSearchParams from '@/utils/hooks/use-update-search-params'

// TYPES
import type { DataTableSelectFilterField } from './types'

type DataTableFilterSelectProps<TData> = DataTableSelectFilterField<TData> & {
	table: Table<TData>
}

export function DataTableFilterSelect<TData>({
	table,
	value: _value,
	options,
	label,
}: DataTableFilterSelectProps<TData>) {
	const value = _value as string
	const navigate = useNavigate()
	const { updateSearchParams } = useUpdateSearchParams()

	const column = table.getColumn(value)
	const filterValue = column?.getFilterValue()

	if (!options?.length) return null

	const currentFilter = typeof filterValue === 'string' ? filterValue : ''

	return (
		<div className="grid w-full gap-1.5">
			<Label htmlFor={value} className="sr-only">
				Filtrar por {label || value}
			</Label>
			<Select
				name={value}
				value={currentFilter}
				onValueChange={(newValue) => {
					const val = newValue === 'all' ? undefined : newValue

					column?.setFilterValue(val)
					navigate(
						{
							search: updateSearchParams({ [value]: val ?? null }),
						},
						{ replace: true, preventScrollReset: true }
					)
				}}
			>
				<SelectTrigger className="h-9 rounded-lg">
					<SelectValue placeholder="Seleccionar..." />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all" className="text-muted-foreground italic">
						Todos
					</SelectItem>
					{options.map((option) => (
						<SelectItem key={String(option.value)} value={String(option.value)}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
