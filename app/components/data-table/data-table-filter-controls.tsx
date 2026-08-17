import type { Table } from '@tanstack/react-table'

// COMPONENTS
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { DataTableFilterCheckbox } from './data-table-filter-checkbox'
import { DataTableFilterInput } from './data-table-filter-input'
import { DataTableFilterResetButton } from './data-table-filter-reset-button'
import { DataTableFilterSelect } from './data-table-filter-select'
import { DataTableFilterSlider } from './data-table-filter-slider'
import { DataTableFilterTimeRange } from './data-table-filter-time-range'
import { DataTableGlobalFilter } from './data-table-global-filter'

// TYPES
import type { DataTableFilterField } from './types'

interface DataTableFilterControlsProps<TData> {
	table: Table<TData>
	filterFields?: DataTableFilterField<TData>[]
}

function RenderFilterField<TData>({
	field,
	table,
}: {
	field: DataTableFilterField<TData>
	table: Table<TData>
}) {
	switch (field.type) {
		case 'checkbox':
			return <DataTableFilterCheckbox table={table} {...field} />
		case 'slider':
			return <DataTableFilterSlider table={table} {...field} />
		case 'input':
			return <DataTableFilterInput table={table} {...field} />
		case 'timeRange':
			return <DataTableFilterTimeRange table={table} {...field} />
		case 'select':
			return <DataTableFilterSelect table={table} {...field} />
		default:
			return null
	}
}

export function DataTableFilterControls<TData>({
	table,
	filterFields = [],
}: DataTableFilterControlsProps<TData>) {
	// Extraemos los valores por defecto asegurando que sean un array válido
	const defaultOpenFilters = filterFields
		.filter((field) => field.defaultOpen)
		.map((field) => field.value as string)

	return (
		<div className="flex flex-col gap-2">
			<div className="h-[46px] flex items-center">
				<h6 className="text-h6 font-semibold">Filtros</h6>
			</div>

			<div className="mb-4">
				<DataTableGlobalFilter table={table} value="search" label="Buscar" />
			</div>

			{filterFields.length > 0 && (
				<Accordion type="multiple" defaultValue={defaultOpenFilters}>
					{filterFields.map((field) => (
						<AccordionItem
							key={field.value as string}
							value={field.value as string}
							className="border-none mb-4"
						>
							<AccordionTrigger className="p-2 hover:no-underline gap-2">
								<div className="flex w-full items-center gap-2 justify-between">
									<p className="text-sm">{field.label}</p>
									<DataTableFilterResetButton table={table} {...field} />
								</div>
							</AccordionTrigger>
							<AccordionContent className="-m-4 p-4 mb-1">
								<RenderFilterField field={field} table={table} />
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			)}
		</div>
	)
}
