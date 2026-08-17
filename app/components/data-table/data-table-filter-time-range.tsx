import type { Table } from '@tanstack/react-table'
import { useMemo } from 'react'
// TYPES & SCHEMAS
import type { DateRange } from 'react-day-picker'
import { useNavigate } from 'react-router'
// UTILS
import useUpdateSearchParams from '@/utils/hooks/use-update-search-params'

// COMPONENTS
import { DatePickerWithRange } from './date-picker-with-range'
import { ARRAY_DELIMITER } from './schemas'
import type { DataTableTimeRangeFilterField } from './types'
import { isArrayOfDates } from './utils'

type DataTableFilterTimeRangeProps<TData> = DataTableTimeRangeFilterField<TData> & {
	table: Table<TData>
}

export function DataTableFilterTimeRange<TData>({
	table,
	value: _value,
}: DataTableFilterTimeRangeProps<TData>) {
	const value = _value as string
	const { updateSearchParams } = useUpdateSearchParams()
	const navigate = useNavigate()
	const column = table.getColumn(value)
	const filterValue = column?.getFilterValue()

	const date: DateRange | undefined = useMemo(
		() =>
			filterValue instanceof Date
				? { from: filterValue, to: undefined }
				: Array.isArray(filterValue) && isArrayOfDates(filterValue)
					? { from: filterValue[0], to: filterValue[1] }
					: undefined,
		[filterValue]
	)

	const setDate = (newDate: DateRange | undefined) => {
		let urlValue: string | null = null
		let tableValue: Date | Date[] | undefined

		if (newDate?.from) {
			if (newDate.to) {
				// Rango completo
				urlValue = [newDate.from.toISOString(), newDate.to.toISOString()].join(ARRAY_DELIMITER)
				tableValue = [newDate.from, newDate.to]
			} else {
				// Solo fecha de inicio
				urlValue = newDate.from.toISOString()
				tableValue = newDate.from
			}
		}

		// Actualizamos la tabla
		column?.setFilterValue(tableValue)

		// Actualizamos la URL
		navigate(
			{
				search: updateSearchParams({
					[value]: urlValue,
				}),
			},
			{
				replace: true,
				preventScrollReset: true,
			}
		)
	}

	return <DatePickerWithRange date={date} setDate={setDate} />
}
