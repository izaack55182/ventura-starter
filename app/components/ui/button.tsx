// CORE

// UTILS
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'
import { cn } from '@/utils/misc'

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',

				// CUSTOM VARIANTS
				input:
					'bg-background text-foreground hover:bg-accent hover:text-accent-foreground border border-input justify-start text-left overflow-auto',
				dashed:
					'border-2 border-dashed bg-transparent border-input hover:bg-accent hover:text-accent-foreground',
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 px-3',
				lg: 'h-12 px-8',
				icon: 'h-10 w-10',

				// CUSTOM SIZES
				wide: 'px-24 py-5',
				pill: 'px-12 py-3 leading-3',
				xs: 'h-8 px-2 text-xs',
				input: 'h-10 px-3',
				full: 'w-full h-full px-4 py-2',
				dropdown: 'h-12 px-8 justify-start w-full',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
)

export type ButtonVariant = VariantProps<typeof buttonVariants>

const Button = ({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<'button'> &
	ButtonVariant & {
		asChild?: boolean
	}) => {
	const Comp = asChild ? Slot : 'button'
	return (
		<Comp
			data-slot="button"
			className={cn(
				buttonVariants({ variant, size }),
				'[&_svg]:size-5', // CUSTOM STYLES OVERRIDE
				className
			)}
			{...props}
		/>
	)
}

export { Button, buttonVariants }
