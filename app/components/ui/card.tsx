// CORE

// UTILS
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'
import { cn } from '@/utils/misc'

const cardVariants = cva(
	'flex flex-col rounded-2xl border text-card-foreground transition-all duration-300',
	{
		variants: {
			variant: {
				default: 'border-border bg-card shadow-xl',
				button:
					'border-border bg-card hover:bg-primary/5 hover:border-primary/30 cursor-pointer shadow-md',
				settings: 'w-full border-border bg-card',
			},
			align: {
				default: '',
				left: '*:items-start',
				center: '*:items-center',
				right: '*:items-end',
				full: 'w-full',
			},
		},
		defaultVariants: {
			variant: 'default',
			align: 'default',
		},
	}
)

export interface CardProps extends React.ComponentProps<'div'>, VariantProps<typeof cardVariants> {}

function Card({ className, variant, align, ...props }: CardProps) {
	return (
		<div
			data-slot="card"
			className={cn(
				cardVariants({ variant, align }),
				'rounded-2xl', // CUSTOM STYLES OVERRIDE
				className
			)}
			{...props}
		/>
	)
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-header"
			className={cn(
				'@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
				// CUSTOM STYLES OVERRIDE
				'w-full p-card',
				className
			)}
			{...props}
		/>
	)
}

const CardTitle = ({ className, ...props }: React.ComponentProps<'div'>) => (
	<div
		data-slot="card-title"
		className={cn(
			'leading-none font-semibold',
			'', // CUSTOM STYLES OVERRIDE
			className
		)}
		{...props}
	/>
)

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-description"
			className={cn('text-sm text-muted-foreground', className)}
			{...props}
		/>
	)
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-action"
			className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
			{...props}
		/>
	)
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
	return <div data-slot="card-content" className={cn('p-6 pt-0', className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-footer"
			className={cn('flex items-center p-6 border-t border-border/10', className)}
			{...props}
		/>
	)
}

export {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	cardVariants,
}
