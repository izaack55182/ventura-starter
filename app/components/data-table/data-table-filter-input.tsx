import type { Table } from '@tanstack/react-table'
import { useNavigate } from 'react-router'
import { Icon } from '@/components/ui/icon'
// COMPONENTS
import { InputWithAddons } from '@/components/ui/input-with-addons'
import { Label } from '@/components/ui/label'
// UTILS
import useUpdateSearchParams from '@/utils/hooks/use-update-search-params'
import { useDebounce } from '@/utils/misc'

// TYPES
import type { DataTableInputFilterField } from './types'

type DataTableFilterInputProps<TData> = DataTableInputFilterField<TData> & {
	table: Table<TData>
}

export function DataTableFilterInput<TData>({
	table,
	value: _value,
}: DataTableFilterInputProps<TData>) {
	const value = _value as string
	const navigate = useNavigate()
	const { updateSearchParams } = useUpdateSearchParams()

	const column = table.getColumn(value)
	const filterValue = column?.getFilterValue()

	const filters = typeof filterValue === 'string' ? filterValue : ''

	const debouncedNavigate = useDebounce((newValue: string | null) => {
		navigate(
			{
				// Actualiza el parámetro específico de la columna en la URL
				search: updateSearchParams({ [value]: newValue }),
			},
			{ replace: true, preventScrollReset: true }
		)
	}, 400)

	return (
		<div className="grid w-full gap-1.5">
			<Label htmlFor={value} className="sr-only">
				{value}
			</Label>
			<InputWithAddons
				placeholder="Buscar"
				leading={<Icon name="search" className="size-4" />}
				containerClassName="h-9 rounded-lg"
				name={value}
				id={value}
				value={filters}
				onChange={(e) => {
					const val = e.target.value
					const newValue = val.trim() === '' ? null : val

					column?.setFilterValue(newValue)
					debouncedNavigate(newValue)
				}}
			/>
		</div>
	)
}
