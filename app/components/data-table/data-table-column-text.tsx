// UTILS
import { cn } from '@/utils/misc'

function DataTableColumnText({ value, className }: { value: string; className?: string }) {
	return (
		<div title={value} className={cn('max-w-[300px] truncate', className)}>
			{value}
		</div>
	)
}

export { DataTableColumnText }
