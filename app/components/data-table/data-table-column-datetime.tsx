// UTILS

import { useOptionalHints } from '@/utils/client-hints'
// COMPONENTS
import { formatDate, formatTime } from '@/utils/format-date'
import { cn } from '@/utils/misc'

interface DataTableColumnDateTimeProps {
	date: Date | string | null
	className?: string
}

export function DataTableColumnDateTime({ date, className }: DataTableColumnDateTimeProps) {
	const hints = useOptionalHints()
	const tz = hints?.timeZone

	if (!date) {
		return <span className={cn('text-sm text-muted-foreground', className)}>N/A</span>
	}

	let localDate = new Date(date)
	if (tz) {
		try {
			localDate = new Date(localDate.toLocaleString('en-US', { timeZone: tz }))
		} catch (_e) {}
	}

	return (
		<div className={cn('flex flex-col whitespace-nowrap', className)}>
			<span className="text-sm font-medium leading-none">{formatDate(localDate)}</span>
			<span className="text-xs text-muted-foreground mt-1.5 tabular-nums tracking-tight">
				{formatTime(localDate)}
			</span>
		</div>
	)
}
