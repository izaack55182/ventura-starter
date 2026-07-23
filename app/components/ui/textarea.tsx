// CORE
import type * as React from 'react'

// UTILS
import { cn } from '@/utils/misc'

const Textarea = ({
	className,
	error,
	...props
}: React.ComponentProps<'textarea'> & { error?: boolean }) => {
	return (
		<textarea
			className={cn(
				'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
				'min-h-input border-input-border bg-input hover:bg-input-hover', // CUSTOM STYLES OVERRIDE
				error &&
					'border-input-invalid placeholder:text-input-invalid focus-visible:border-input-invalid focus-visible:ring-input-invalid',
				className
			)}
			{...props}
		/>
	)
}

export { Textarea }
