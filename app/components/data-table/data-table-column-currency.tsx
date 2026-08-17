// UTILS
import { cn } from '@/utils/misc'

const currencyFormatter = new Intl.NumberFormat('es-MX', {
	style: 'currency',
	currency: 'USD',
})

interface DataTableColumnCurrencyProps {
	amount: number
	isDue?: boolean
	isNegative?: boolean
	className?: string
}

export function DataTableColumnCurrency({
	amount,
	isDue = false,
	isNegative = false,
	className,
}: DataTableColumnCurrencyProps) {
	let colorClass = ''
	if (isDue) {
		colorClass = amount > 0 ? 'text-destructive font-medium' : 'text-success font-medium'
	} else if (isNegative) {
		colorClass = amount > 0 ? 'text-success font-medium' : 'text-destructive font-medium'
	}

	return (
		<span className={cn('whitespace-nowrap tabular-nums tracking-tight', colorClass, className)}>
			{currencyFormatter.format(amount)}
		</span>
	)
}
