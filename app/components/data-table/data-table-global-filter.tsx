import type { Table } from '@tanstack/react-table'
import { useNavigate, useNavigation } from 'react-router'
import { Icon } from '@/components/ui/icon'
// COMPONENTS
import { InputWithAddons } from '@/components/ui/input-with-addons'
import { Label } from '@/components/ui/label'
// UTILS
import useUpdateSearchParams from '@/utils/hooks/use-update-search-params'
import { useDebounce } from '@/utils/misc'
import { LoadingSpinner } from '../loading-spinner'

// TYPES & SCHEMAS
import type { DataTableInputFilterField } from './types'

type DataTableGlobalFilterProps<TData> = Omit<
	DataTableInputFilterField<TData>,
	'value' | 'type'
> & {
	table: Table<TData>
	value: string
}

export function DataTableGlobalFilter<TData>({
	table,
	value: _value,
}: DataTableGlobalFilterProps<TData>) {
	const value = _value as string
	const navigate = useNavigate()
	const navigation = useNavigation()
	const { updateSearchParams } = useUpdateSearchParams()

	const filterValue = table.getState().globalFilter
	const filters = typeof filterValue === 'string' ? filterValue : ''

	// El spinner solo aparece si la navegación actual fue disparada por una búsqueda
	const isSearching =
		navigation.state === 'loading' && new URLSearchParams(navigation.location.search).has('search')

	const debouncedNavigate = useDebounce((val: string | null) => {
		navigate(
			{
				search: updateSearchParams({ search: val }),
			},
			{ replace: true, preventScrollReset: true }
		)
	}, 400)

	return (
		<div className="grid w-full">
			<Label htmlFor={value} className="sr-only">
				Búsqueda global
			</Label>
			<InputWithAddons
				placeholder="Buscar"
				leading={<Icon name="search" className="size-4 opacity-50" />}
				trailing={isSearching ? <LoadingSpinner className="size-4" /> : null}
				containerClassName="h-9 rounded-lg"
				name={value}
				id={value}
				value={filters}
				onChange={(e) => {
					const val = e.target.value
					const newValue = val.trim() === '' ? null : val

					table.setGlobalFilter(newValue)
					debouncedNavigate(newValue)
				}}
			/>
		</div>
	)
}
