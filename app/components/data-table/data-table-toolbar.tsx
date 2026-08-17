import type { Table } from '@tanstack/react-table'
import { Link, useNavigate, useSearchParams } from 'react-router'
// COMPONENTS
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icon } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
// UTILS
import useUpdateSearchParams from '@/utils/hooks/use-update-search-params'
import { useDebounce } from '@/utils/misc'
import { DataTableViewOptions } from './data-table-view-options'

interface DataTableToolbarProps<TData> {
	table: Table<TData>
	exportPath?: string
	renderToolbarFilters?: (table: Table<TData>) => React.ReactNode
	actions?: React.ReactNode
}

export function DataTableToolbar<TData>({
	table,
	exportPath,
	renderToolbarFilters,
	actions,
}: DataTableToolbarProps<TData>) {
	const filters = table.getState().columnFilters
	const [searchParams] = useSearchParams()

	const navigate = useNavigate()
	const { updateSearchParams } = useUpdateSearchParams()

	const debouncedNavigate = useDebounce((val: string | null) => {
		navigate(
			{ search: updateSearchParams({ search: val }) },
			{ replace: true, preventScrollReset: true }
		)
	}, 400)

	const hasActiveFilters = filters.length > 0 || searchParams.size > 0

	return (
		<div className="flex flex-wrap items-center justify-between gap-4">
			<div className="flex flex-1 items-center gap-2">
				<div className="relative w-full">
					<Icon
						name="search"
						className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
					/>
					<Input
						placeholder="Buscar..."
						value={(table.getState().globalFilter as string) ?? ''}
						onChange={(event) => {
							const val = event.target.value
							table.setGlobalFilter(val)
							debouncedNavigate(val.trim() === '' ? null : val)
						}}
						className="pl-9 bg-transparent border-input h-9 focus-visible:ring-1 focus-visible:ring-ring focus-visible:bg-background transition-all"
					/>
				</div>
				{renderToolbarFilters?.(table)}
			</div>

			<div className="flex items-center gap-2">
				{exportPath && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="gap-2">
								<Icon name="arrow-down-to-line" />
								Exportar
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Opciones de Exportación</DropdownMenuLabel>
							<DropdownMenuSeparator />

							{hasActiveFilters && (
								<DropdownMenuItem asChild>
									<Link to={exportPath || ''} reloadDocument>
										<Icon name="arrow-down-to-line" />
										<span>Resultados Filtrados</span>
									</Link>
								</DropdownMenuItem>
							)}

							<DropdownMenuItem asChild>
								<Link to={exportPath?.split('?')[0] || ''} reloadDocument>
									<Icon name="arrow-down-to-line" />
									<span>Todos los Datos</span>
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}

				<DataTableViewOptions table={table} />
				{actions && <div className="flex items-center gap-2">{actions}</div>}
			</div>
		</div>
	)
}
