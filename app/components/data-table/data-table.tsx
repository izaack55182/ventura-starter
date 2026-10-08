import { type RankingInfo, rankItem } from '@tanstack/match-sorter-utils'
import type {
	ColumnDef,
	ColumnFiltersState,
	FilterFn,
	PaginationState,
	Row,
	RowData,
	RowSelectionState,
	SortingState,
	Table as TTable,
	VisibilityState,
} from '@tanstack/react-table'
import {
	flexRender,
	getCoreRowModel,
	getExpandedRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { Fragment, useState } from 'react'
import { useLocation, useNavigation, useSearchParams } from 'react-router'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { cn } from '@/utils/misc'
import { DataTableChart } from './data-table-chart'
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'
import { useLocalStorage } from './hooks/use-local-storage'

import type { DataTableFilterField } from './types'

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	rowCount: number
	defaultColumnFilters?: ColumnFiltersState
	filterFields?: DataTableFilterField<TData>[]
	exportPath?: string
	getRowCanExpand?: (row: Row<TData>) => boolean
	renderSubComponent?: (props: { row: Row<TData> }) => React.ReactElement
	renderToolbarFilters?: () => React.ReactNode
	renderChart?: (props: { table: TTable<TData> }) => React.ReactNode
	actions?: React.ReactNode
	manualPagination?: boolean
	manualSorting?: boolean
	manualFiltering?: boolean
	variant?: 'default' | 'borderless'
}

declare module '@tanstack/table-core' {
	interface FilterFns {
		fuzzy: FilterFn<unknown>
	}
	interface FilterMeta {
		itemRank: RankingInfo
	}
	interface ColumnMeta<TData extends RowData, TValue> {
		label?: string
		/** Hide this column below the sm breakpoint (640px) */
		hideOnMobile?: boolean
	}
}

// biome-ignore lint/suspicious/noExplicitAny: Standard match-sorter implementation
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
	const itemRank = rankItem(row.getValue(columnId), value)
	addMeta({ itemRank })
	return itemRank.passed
}

function DataTable<TData, TValue>({
	columns,
	data,
	rowCount,
	defaultColumnFilters = [],
	getRowCanExpand,
	exportPath,
	renderSubComponent,
	renderToolbarFilters = () => null,
	renderChart = () => null,
	actions,
	manualPagination = true,
	manualSorting = true,
	manualFiltering = true,
	variant = 'default',
}: DataTableProps<TData, TValue>) {
	const navigation = useNavigation()
	const location = useLocation()
	const [searchParams] = useSearchParams()

	const isLoading =
		navigation.state === 'loading' &&
		Array.from(searchParams.entries()).length > 0 &&
		navigation.location.pathname === location.pathname

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(defaultColumnFilters)
	const [sorting, setSorting] = useState<SortingState>(() => {
		const id = searchParams.get('sortColumn')
		const desc = searchParams.get('sortDirection') === 'desc'
		return id ? [{ id, desc }] : []
	})
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: Number(searchParams.get('offset')) || 0,
		pageSize: Number(searchParams.get('limit')) || 20,
	})

	const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>(
		'data-table-visibility',
		{}
	)
	const [globalFilter, setGlobalFilter] = useState(searchParams.get('search') ?? '')
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination,
		rowCount,
		autoResetPageIndex: false,
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		manualSorting,
		onColumnVisibilityChange: (updater) => {
			const newValue = typeof updater === 'function' ? updater(columnVisibility) : updater
			setColumnVisibility(newValue)
		},
		globalFilterFn: fuzzyFilter,
		onGlobalFilterChange: setGlobalFilter,
		getFilteredRowModel: getFilteredRowModel(),
		manualFiltering,
		onColumnFiltersChange: setColumnFilters,
		getFacetedRowModel: getFacetedRowModel(),
		onRowSelectionChange: setRowSelection,
		getRowCanExpand,
		getExpandedRowModel: getExpandedRowModel(),
		getFacetedUniqueValues: (table: TTable<TData>, columnId: string) => () => {
			const map = getFacetedUniqueValues<TData>()(table, columnId)()
			const firstRowValue = table.getGlobalFacetedRowModel().flatRows[0]?.getValue(columnId)
			if (Array.isArray(firstRowValue)) {
				const arrayMap = new Map<unknown, number>()
				const rowValues = table
					.getGlobalFacetedRowModel()
					.flatRows.map((row) => row.getValue(columnId) as unknown[])

				for (const values of rowValues) {
					if (!Array.isArray(values)) continue
					for (const value of values) {
						const prevValue = arrayMap.get(value) || 0
						arrayMap.set(value, prevValue + 1)
					}
				}
				return arrayMap
			}
			return map
		},
		state: {
			sorting,
			pagination,
			columnFilters,
			columnVisibility,
			globalFilter,
			rowSelection,
		},
		filterFns: {
			fuzzy: fuzzyFilter,
		},
	})

	const _columnSizes = table.getHeaderGroups()?.[0]?.headers.map((header) => header.getSize()) ?? []
	const hasRows = table.getRowModel().rows?.length > 0

	const isBorderless = variant === 'borderless'

	return (
		<div className="flex max-w-full flex-1 flex-col gap-4 overflow-hidden">
			<DataTableChart table={table}>{renderChart({ table })}</DataTableChart>

			<DataTableToolbar
				table={table}
				exportPath={exportPath}
				renderToolbarFilters={renderToolbarFilters}
				actions={actions}
			/>

			<div
				className={cn(
					'w-full flex-1 flex flex-col transition-opacity duration-200',
					!isBorderless && 'rounded-xl border border-border bg-card shadow-sm',
					isBorderless && 'border-t border-border/10',
					isLoading && 'opacity-60 pointer-events-none'
				)}
			>
				<Table
					wrapperClassName="overflow-auto w-full flex-1 max-h-[calc(100vh-20rem)] relative"
					className="w-full border-separate border-spacing-0"
				>
					<TableHeader className="bg-transparent">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className={cn(
									'border-none transition-none select-none',
									isBorderless
										? 'bg-muted/95 rounded-xl'
										: 'bg-muted/95 border-b border-border/50 backdrop-blur-sm'
								)}
							>
								{headerGroup.headers.map((header, index) => (
									<TableHead
										key={header.id}
										className={cn(
											'px-4 py-0 h-10 font-bold text-foreground sticky top-0 z-10',
											!isBorderless && 'bg-card',
											header.column.columnDef.meta?.hideOnMobile && 'hidden sm:table-cell',
											isBorderless && [
												'bg-muted/95 border-none',
												index === 0 && 'rounded-l-xl',
												index === headerGroup.headers.length - 1 && 'rounded-r-xl',
											]
										)}
									>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{hasRows ? (
							table.getRowModel().rows.map((row) => (
								<Fragment key={row.id}>
									<TableRow
										data-state={row.getIsSelected() && 'selected'}
										className={cn(
											'transition-all duration-200 border-none',
											isBorderless
												? 'hover:bg-muted/20'
												: 'hover:bg-muted/30 border-b border-border/15'
										)}
									>
										{row.getVisibleCells().map((cell, index) => (
											<TableCell
												key={cell.id}
												className={cn(
													'px-4 py-2.5 text-sm',
													cell.column.columnDef.meta?.hideOnMobile && 'hidden sm:table-cell',
													index === 0 && 'rounded-l-xl',
													index === row.getVisibleCells().length - 1 && 'rounded-r-xl'
												)}
											>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>
									{row.getIsExpanded() && renderSubComponent && (
										<TableRow className="bg-muted/5">
											<TableCell colSpan={row.getVisibleCells().length} className="p-0">
												{renderSubComponent({ row })}
											</TableCell>
										</TableRow>
									)}
								</Fragment>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-32 text-center text-sm text-muted-foreground"
								>
									No se encontraron resultados.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
				<DataTablePagination table={table} />
			</div>
		</div>
	)
}

export { DataTable }
