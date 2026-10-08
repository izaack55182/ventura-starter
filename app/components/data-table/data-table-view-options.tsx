// CORE

import type { Table } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
// COMPONENTS
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command'
import { Icon } from '@/components/ui/icon'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Sortable, SortableDragHandle, SortableItem } from '@/components/ui/sortable'

interface DataTableViewOptionsProps<TData> {
	table: Table<TData>
}

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
	const enableColumnOrdering = true

	const [open, setOpen] = useState(false)
	const [drag, setDrag] = useState(false)
	const [search] = useState('')

	const columnOrder = table.getState().columnOrder

	const sortedColumns = useMemo(
		() =>
			table.getAllColumns().sort((a, b) => {
				return columnOrder.indexOf(a.id) - columnOrder.indexOf(b.id)
			}),
		[columnOrder, table.getAllColumns]
	)

	const totalColumns = table
		.getAllColumns()
		.filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide()).length

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					role="combobox"
					aria-expanded={open}
					className="gap-2 rounded-full text-muted-foreground hover:bg-muted/50 hover:text-foreground"
				>
					<span>Columnas ({totalColumns})</span>
					<Icon name="chevron-down" className="h-3.5 w-3.5 text-primary" />
				</Button>
			</PopoverTrigger>
			<PopoverContent side="bottom" align="end" className="w-[200px] p-0">
				<Command>
					<CommandList>
						<CommandEmpty>No option found.</CommandEmpty>
						<CommandGroup heading="Columnas visibles">
							<CommandSeparator className="mb-2" />
							<Sortable
								value={sortedColumns.map((c) => ({ id: c.id }))}
								onValueChange={(items) => table.setColumnOrder(items.map((c) => c.id))}
								overlay={<div className="h-8 w-full rounded-md bg-muted/60" />}
								onDragStart={() => setDrag(true)}
								onDragEnd={() => setDrag(false)}
								onDragCancel={() => setDrag(false)}
							>
								{sortedColumns
									.filter(
										(column) => typeof column.accessorFn !== 'undefined' && column.getCanHide()
									)
									.map((column) => (
										<SortableItem key={column.id} value={column.id} asChild>
											<CommandItem
												value={column.id}
												onSelect={() => column.toggleVisibility(!column.getIsVisible())}
												className={'capitalize'}
												disabled={drag}
											>
												<Checkbox
													checked={column.getIsVisible()}
													className="mr-2 pointer-events-none"
													aria-hidden="true"
												/>
												<span className="flex-1 text-sm">
													{column.columnDef.meta?.label || column.id}
												</span>
												{enableColumnOrdering && !search ? (
													<SortableDragHandle
														variant="ghost"
														size="icon"
														className="ml-auto size-6"
													>
														<Icon
															name="ellipsis"
															className="size-4 text-zinc-400"
															aria-hidden="true"
														/>
													</SortableDragHandle>
												) : null}
											</CommandItem>
										</SortableItem>
									))}
							</Sortable>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
