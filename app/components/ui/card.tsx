import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/utils/misc'

const cardVariants = cva(
	'text-card-foreground flex flex-col rounded-xl border shadow-sm transition-[ring,box-shadow] duration-300',
	{
		variants: {
			variant: {
				default: 'bg-card gap-6 py-6 border-border',
				premium:
					'bg-card border-border relative overflow-hidden shadow-xl shadow-foreground/5 dark:shadow-none',
				interactive: 'bg-card-interactive overflow-hidden relative flex flex-col',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
)

interface CardProps extends React.ComponentProps<'div'>, VariantProps<typeof cardVariants> {}

function Card({ className, variant, ...props }: CardProps) {
	return <div data-slot="card" className={cn(cardVariants({ variant }), className)} {...props} />
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-header"
			className={cn('flex flex-col gap-1.5 px-6', className)}
			{...props}
		/>
	)
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-title"
			className={cn('leading-none font-semibold', className)}
			{...props}
		/>
	)
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-description"
			className={cn('text-muted-foreground text-sm', className)}
			{...props}
		/>
	)
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
	return <div data-slot="card-content" className={cn('px-6', className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div data-slot="card-footer" className={cn('flex items-center px-6', className)} {...props} />
	)
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
