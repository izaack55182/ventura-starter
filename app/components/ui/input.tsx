import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/utils/misc'

const inputVariants = cva(
	'flex w-full rounded-[var(--radius)] border border-input bg-transparent px-3 py-1 text-sm shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'border-input focus:border-primary/50',
				settings: 'h-11 border-border focus:border-primary bg-transparent',
				ghost: 'bg-transparent border-none p-0 shadow-none focus-visible:ring-0',
				title:
					'bg-transparent border-none p-0 shadow-none focus-visible:ring-0 text-3xl font-bold tracking-tight h-auto placeholder:text-muted-foreground/50',
			},
			size: {
				default: 'h-11',
				lg: 'h-11',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
)

export interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
		VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, variant, size, type, ...props }, ref) => {
		return (
			<input
				type={type}
				ref={ref}
				data-slot="input"
				className={cn(inputVariants({ variant, size, className }))}
				{...props}
			/>
		)
	}
)
Input.displayName = 'Input'

export { Input, inputVariants }
