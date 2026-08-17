import type { Table } from '@tanstack/react-table'
import { useNavigate } from 'react-router'
import { DataTableSlider } from '@/components/ui/data-table-slider'
// COMPONENTS
import { InputWithAddons } from '@/components/ui/input-with-addons'
import { Label } from '@/components/ui/label'
// UTILS
import useUpdateSearchParams from '@/utils/hooks/use-update-search-params'
import { useDebounce } from '@/utils/misc'
// TYPES & SCHEMAS
import { SLIDER_DELIMITER } from './schemas'
import type { DataTableSliderFilterField } from './types'
import { isArrayOfNumbers } from './utils'

type DataTableFilterSliderProps<TData> = DataTableSliderFilterField<TData> & {
	table: Table<TData>
}

export function DataTableFilterSlider<TData>({
	table,
	value: _value,
	min,
	max,
}: DataTableFilterSliderProps<TData>) {
	const value = _value as string
	const { updateSearchParams } = useUpdateSearchParams()
	const navigate = useNavigate()

	const column = table.getColumn(value)
	const filterValue = column?.getFilterValue()

	const filters = (() => {
		if (typeof filterValue === 'number') return [filterValue, filterValue] as [number, number]
		if (Array.isArray(filterValue) && isArrayOfNumbers(filterValue)) {
			const first = filterValue[0] ?? min
			const second = filterValue[1] ?? max
			return [first, second] as [number, number]
		}
		return undefined
	})()

	const debouncedNavigate = useDebounce((newValue: number[]) => {
		navigate(
			{
				search: updateSearchParams({
					[value]: newValue.join(SLIDER_DELIMITER),
				}),
			},
			{ replace: true, preventScrollReset: true }
		)
	}, 600)

	const minVal = filters?.[0] ?? min
	const maxVal = filters?.[1] ?? max

	return (
		<div className="grid gap-4">
			<div className="flex items-center gap-4">
				<div className="grid w-full gap-1.5">
					<Label htmlFor={`min-${value}`} className="px-2 text-muted-foreground">
						Mín.
					</Label>
					<InputWithAddons
						placeholder="desde"
						trailing="$"
						containerClassName="h-9 rounded-lg"
						type="number"
						name={`min-${value}`}
						id={`min-${value}`}
						value={Number.isNaN(minVal) ? '' : minVal}
						min={min}
						max={max}
						onChange={(e) => {
							const val = e.target.value === '' ? min : Number.parseInt(e.target.value, 10)
							const newValue =
								Array.isArray(filters) && val < filters[1] ? [val, filters[1]] : [val, max]

							column?.setFilterValue(newValue)
							debouncedNavigate(newValue)
						}}
					/>
				</div>
				<div className="grid w-full gap-1.5">
					<Label htmlFor={`max-${value}`} className="px-2 text-muted-foreground">
						Máx.
					</Label>
					<InputWithAddons
						placeholder="hasta"
						trailing="$"
						containerClassName="h-9 rounded-lg"
						type="number"
						name={`max-${value}`}
						id={`max-${value}`}
						value={Number.isNaN(maxVal) ? '' : maxVal}
						min={min}
						max={max}
						onChange={(e) => {
							const val = e.target.value === '' ? max : Number.parseInt(e.target.value, 10)
							const newValue =
								Array.isArray(filters) && val > filters[0] ? [filters[0], val] : [min, val]

							column?.setFilterValue(newValue)
							debouncedNavigate(newValue)
						}}
					/>
				</div>
			</div>
			<div className="px-1">
				<DataTableSlider
					min={min}
					max={max}
					value={filters || [min, max]}
					onValueChange={(values) => {
						column?.setFilterValue(values)
						debouncedNavigate(values)
					}}
				/>
			</div>
		</div>
	)
}
