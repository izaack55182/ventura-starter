import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'
import { cn } from '@/utils/misc'

const textareaVariants = cva(
	'flex field-sizing-content w-full rounded-lg border border-input bg-transparent transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
	{
		variants: {
			size: {
				default: 'min-h-16 px-2.5 py-2 text-sm',
				lg: 'min-h-24 px-4 py-3 text-base',
			},
		},
		defaultVariants: {
			size: 'default',
		},
	}
)

function Textarea({
	className,
	size,
	...props
}: React.ComponentProps<'textarea'> & VariantProps<typeof textareaVariants>) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(textareaVariants({ size }), className)}
			{...props}
		/>
	)
}

export { Textarea, textareaVariants }
