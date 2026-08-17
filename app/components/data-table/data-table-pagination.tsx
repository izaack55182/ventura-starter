import type { Table } from '@tanstack/react-table'
import { Link, useNavigate } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'

// COMPONENTS
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
// UTILS
import useUpdateSearchParams from '@/utils/hooks/use-update-search-params'
import { cn } from '@/utils/misc'

interface DataTablePaginationProps<TData> {
	table: Table<TData>
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
	const navigate = useNavigate()
	const { updateSearchParams } = useUpdateSearchParams()

	const offset = table.getState().pagination.pageIndex * table.getState().pagination.pageSize
	const limit = table.getState().pagination.pageSize
	const pageCount = table.getPageCount()
	const currentPage = table.getState().pagination.pageIndex + 1

	return (
		<div className="flex items-center justify-between px-2 py-4 border-t border-border/40">
			<div className="flex-1 text-body-2xs text-muted-foreground font-medium">
				{table.getFilteredSelectedRowModel().rows.length} de{' '}
				{table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
			</div>

			<div className="flex items-center space-x-6 lg:space-x-12">
				<div className="flex items-center space-x-2">
					<p className="text-body-2xs font-medium text-muted-foreground/60">Filas por página</p>
					<Select
						value={String(limit)}
						onValueChange={(value) => {
							table.setPageSize(Number(value))
							navigate(
								{
									search: updateSearchParams({
										limit: value,
									}),
								},
								{ replace: true, preventScrollReset: true }
							)
						}}
					>
						<SelectTrigger className="h-8 w-[70px] bg-background border-border text-body-2xs font-bold rounded-lg focus:ring-0 focus:ring-offset-0">
							<SelectValue placeholder={limit} />
						</SelectTrigger>
						<SelectContent side="top" className="bg-popover border-border">
							{[10, 20, 50, 100].map((pageSize) => (
								<SelectItem
									key={pageSize}
									value={String(pageSize)}
									className="text-body-2xs font-medium"
								>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center gap-4">
					<div className="flex items-center justify-center text-body-2xs font-bold text-muted-foreground min-w-[80px]">
						Página {currentPage} de {pageCount || 1}
					</div>

					<div className="flex items-center space-x-1">
						<Link
							to={{ search: updateSearchParams({ offset: 0 }) }}
							preventScrollReset
							prefetch="intent"
							className={cn(
								buttonVariants({ variant: 'outline', size: 'icon' }),
								'h-8 w-8',
								!table.getCanPreviousPage() && 'pointer-events-none opacity-30'
							)}
						>
							<Icon name="chevrons-left" className="size-4" />
						</Link>

						<Link
							to={{ search: updateSearchParams({ offset: Math.max(offset - limit, 0) }) }}
							preventScrollReset
							prefetch="intent"
							className={cn(
								buttonVariants({ variant: 'outline', size: 'icon' }),
								'h-8 w-8',
								!table.getCanPreviousPage() && 'pointer-events-none opacity-30'
							)}
						>
							<Icon name="chevron-left" className="size-4" />
						</Link>

						<Link
							to={{ search: updateSearchParams({ offset: offset + limit }) }}
							preventScrollReset
							prefetch="intent"
							className={cn(
								buttonVariants({ variant: 'outline', size: 'icon' }),
								'h-8 w-8',
								!table.getCanNextPage() && 'pointer-events-none opacity-30'
							)}
						>
							<Icon name="chevron-right" className="size-4" />
						</Link>

						<Link
							to={{ search: updateSearchParams({ offset: (table.getPageCount() - 1) * limit }) }}
							preventScrollReset
							prefetch="intent"
							className={cn(
								buttonVariants({ variant: 'outline', size: 'icon' }),
								'h-8 w-8',
								!table.getCanNextPage() && 'pointer-events-none opacity-30'
							)}
						>
							<Icon name="chevrons-right" className="size-4" />
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
