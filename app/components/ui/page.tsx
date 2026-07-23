// CORE

// UTILS
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/utils/misc'

const pageVariants = cva('w-full mx-auto animate-in fade-in duration-500', {
	variants: {
		variant: {
			default: 'max-w-7xl',
			settings: 'max-w-4xl py-10',
			auth: 'max-w-md',
		},
		align: {
			left: '',
			center: 'flex flex-col items-center justify-center',
			right: '',
		},
	},
	defaultVariants: {
		align: 'left',
		variant: 'default',
	},
})

export interface PageProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof pageVariants> {}

const Page = React.forwardRef<HTMLDivElement, PageProps>(
	({ className, align, variant, ...props }, ref) => {
		return <div ref={ref} className={cn(pageVariants({ align, className, variant }))} {...props} />
	}
)
Page.displayName = 'Page'

const PageHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn('flex flex-col gap-2 p-6 md:px-8 pt-8 pb-4', className)}
			{...props}
		/>
	)
)
PageHeader.displayName = 'PageHeader'

const PageTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn('text-3xl font-bold tracking-tight text-foreground', className)}
			{...props}
		/>
	)
)
PageTitle.displayName = 'PageTitle'

const PageDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn('text-base text-muted-foreground', className)} {...props} />
	)
)
PageDescription.displayName = 'PageDescription'

const PageContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn('p-6 md:px-8 pt-0 flex-1', className)} {...props} />
	)
)
PageContent.displayName = 'PageContent'

const PageFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn('flex items-center p-6 md:px-8 pt-0 mt-auto', className)}
			{...props}
		/>
	)
)
PageFooter.displayName = 'PageFooter'

export { Page, PageContent, PageDescription, PageFooter, PageHeader, PageTitle, pageVariants }
