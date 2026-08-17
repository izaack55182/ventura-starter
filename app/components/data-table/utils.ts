import type { Table } from '@tanstack/react-table'
import { z } from 'zod'

export function deserialize<T extends z.AnyZodObject>(schema: T) {
	const castToSchema = z.preprocess((val) => {
		if (typeof val !== 'string') return val

		return val
			.trim()
			.split(' ')
			.reduce(
				(prev, curr) => {
					const [name, ...rest] = curr.split(':')
					const value = rest.join(':')

					if (name && value) {
						prev[name] = value
					}
					return prev
				},
				{} as Record<string, unknown>
			)
	}, schema)

	return (value: string) => castToSchema.safeParse(value)
}

export function isArrayOfNumbers(arr: unknown[]): arr is number[] {
	return arr.every((item) => typeof item === 'number')
}

export function isArrayOfDates(arr: unknown[]): arr is Date[] {
	return arr.every((item) => item instanceof Date)
}

export function getColumnFooterTotal<TData>(table: Table<TData>, accessorKey: string) {
	const rows = table.getFilteredRowModel().rows

	return rows.reduce((acc, row) => {
		const val = Number.parseFloat(String(row.getValue(accessorKey)))
		return acc + (Number.isNaN(val) ? 0 : val)
	}, 0)
}
