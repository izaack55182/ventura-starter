// UTILS

// COMPONENTS
import { TableCell, TableFooter, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/utils/format-number'
import { cn } from '@/utils/misc'

interface DataTableFooterProps {
	dueAmount: number
	totalOrder: number
	footerSpan: number
	className?: string
}

export function DataTableFooter({
	totalOrder,
	dueAmount,
	footerSpan,
	className,
}: DataTableFooterProps) {
	return (
		<TableFooter className={cn('bg-muted/50 font-medium', className)}>
			<TableRow className="hover:bg-transparent">
				<TableCell
					colSpan={footerSpan}
					className="text-right text-muted-foreground uppercase tracking-wider text-[10px] font-bold"
				>
					Resumen de Totales
				</TableCell>
				<TableCell className="p-0">
					<div className="flex flex-col items-end px-4 py-2 border-l border-border/50">
						<span className="text-[10px] uppercase text-muted-foreground font-bold">
							Total Orden
						</span>
						<span className="text-sm font-semibold">{formatCurrency(totalOrder)}</span>
					</div>
				</TableCell>
				<TableCell className="p-0">
					<div className="flex flex-col items-start px-4 py-2 border-l border-border/50">
						<span className="text-[10px] uppercase text-muted-foreground font-bold">Por Pagar</span>
						<span
							className={cn(
								'text-sm font-bold',
								dueAmount > 0 ? 'text-destructive' : 'text-green-600'
							)}
						>
							{formatCurrency(dueAmount)}
						</span>
					</div>
				</TableCell>
			</TableRow>
		</TableFooter>
	)
}
