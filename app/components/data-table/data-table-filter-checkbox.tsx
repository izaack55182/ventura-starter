import type { Table } from '@tanstack/react-table'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Checkbox } from '@/components/ui/checkbox'
import { Icon } from '@/components/ui/icon'

// COMPONENTS
import { InputWithAddons } from '@/components/ui/input-with-addons'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
// UTILS
import useUpdateSearchParams from '@/utils/hooks/use-update-search-params'
import { cn } from '@/utils/misc'
import { ARRAY_DELIMITER } from './schemas'
// TYPES & SCHEMAS
import type { DataTableCheckboxFilterField } from './types'

type DataTableFilterCheckboxProps<TData> = DataTableCheckboxFilterField<TData> & {
	table: Table<TData>
}

export function DataTableFilterCheckbox<TData>({
	table,
	value: _value,
	options,
	component: Component,
}: DataTableFilterCheckboxProps<TData>) {
	const value = _value as string
	const [inputValue, setInputValue] = useState('')
	const { updateSearchParams } = useUpdateSearchParams()
	const navigate = useNavigate()

	const column = table.getColumn(value)
	const facetedValue = column?.getFacetedUniqueValues()
	const filterValue = column?.getFilterValue()

	if (!options?.length) return null

	const filterOptions = options.filter(
		(option) => inputValue === '' || option.label.toLowerCase().includes(inputValue.toLowerCase())
	)

	const filters = Array.isArray(filterValue)
		? filterValue
		: filterValue !== undefined && filterValue !== null
			? [filterValue]
			: []

	return (
		<div className="grid gap-2">
			{options.length > 10 && (
				<InputWithAddons
					placeholder="Buscar"
					leading={<Icon name="search" className="mt-0.5 h-4 w-4" />}
					containerClassName="h-9 rounded-lg"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
				/>
			)}
			<ScrollArea className="h-[300px]">
				<div className="rounded-lg border border-border empty:border-none">
					{filterOptions
						.sort((a, b) => {
							if (options.length > 10) {
								const aSelected = filters.includes(a.value)
								const bSelected = filters.includes(b.value)
								if (aSelected && !bSelected) return -1
								if (!aSelected && bSelected) return 1
							}
							return 0
						})
						.map((option, index) => {
							const checked = filters.includes(option.value)
							return (
								<div
									key={String(option.value)}
									className={cn(
										'group relative flex items-center space-x-2 px-2 py-2.5 hover:bg-accent',
										index !== filterOptions.length - 1 && 'border-b border-border'
									)}
								>
									<Checkbox
										id={`${value}-${option.value}`}
										checked={checked}
										onCheckedChange={(isChecked) => {
											const newValue = isChecked
												? [...filters, option.value]
												: filters.filter((v) => v !== option.value)

											column?.setFilterValue(newValue.length ? newValue : undefined)
											navigate(
												{
													search: updateSearchParams({
														[value]: newValue.length ? newValue.join(ARRAY_DELIMITER) : null,
													}),
												},
												{
													replace: true,
													preventScrollReset: true,
												}
											)
										}}
									/>
									<Label
										htmlFor={`${value}-${option.value}`}
										className="flex w-full items-center justify-center gap-1 truncate text-muted-foreground group-hover:text-accent-foreground cursor-pointer"
									>
										{Component ? (
											<Component {...option} />
										) : (
											<span className="truncate font-normal">{option.label}</span>
										)}
										<span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
											{facetedValue?.get(option.value) ?? 0}
										</span>
										<button
											type="button"
											onClick={(e) => {
												e.preventDefault() // Evita que se active el Checkbox del Label
												column?.setFilterValue([option.value])
												navigate(
													{
														search: updateSearchParams({
															[value]: String(option.value),
														}),
													},
													{ replace: true, preventScrollReset: true }
												)
											}}
											className="absolute inset-y-0 right-0 hidden font-normal text-muted-foreground backdrop-blur-xs hover:text-foreground group-hover:block"
										>
											<span className="px-2">solo</span>
										</button>
									</Label>
								</div>
							)
						})}
				</div>
			</ScrollArea>
		</div>
	)
}
