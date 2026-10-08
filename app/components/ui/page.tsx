import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/utils/misc'

const pageVariants = cva('flex flex-col w-full', {
	variants: {
		variant: {
			default: '',
			order: 'md:mt-20',
			settings: 'max-w-2xl mx-auto pb-2 border-b-0',
			full: 'max-w-4xl mx-auto pt-4 sm:pt-10 pb-2 border-b-0',
			auth: 'max-w-md mx-auto',
		},
		align: {
			left: 'items-start text-left',
			center: 'items-center text-center',
			right: 'items-end text-right',
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

const pageHeaderVariants = cva(
	'flex flex-col sm:flex-row px-4 sm:px-6 py-4 sm:py-6 justify-between gap-4 w-full border-b border-border/40',
	{
		variants: {
			variant: {
				default: 'w-full',
				centered: 'max-w-6xl mx-auto',
				narrow: 'max-w-4xl mx-auto pt-4 sm:pt-14 pb-4',
				bordered: 'w-full border-b border-border/40 pb-6 mb-6',
				narrowBordered: 'max-w-4xl mx-auto pb-6 mb-3',
				center:
					'flex-col items-center justify-center text-center max-w-full mx-auto border-b border-border/60 pb-4',
				settings: 'max-w-2xl mx-auto pt-4 sm:pt-10 pb-2 border-b-0',
				document: 'w-full max-w-3xl mx-auto border-none mb-6 px-2 py-0',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
)

export interface PageHeaderProps
	extends React.HTMLAttributes<HTMLElement>,
		VariantProps<typeof pageHeaderVariants> {
	actions?: React.ReactNode
	breadcrumbActions?: React.ReactNode
}

const PageHeader = React.forwardRef<HTMLElement, PageHeaderProps>(
	({ className, variant, children, actions, breadcrumbActions, ...props }, ref) => {
		if (variant === 'document') {
			return (
				<header ref={ref} className={cn(pageHeaderVariants({ variant, className }))} {...props}>
					<div className="flex items-start justify-between gap-4 w-full">
						{children}
						{actions && <div className="flex items-center gap-2 pt-1">{actions}</div>}
					</div>
				</header>
			)
		}

		return (
			<header ref={ref} className={cn(pageHeaderVariants({ variant, className }))} {...props}>
				<div className="flex items-start justify-between gap-4 w-full">
					<div className="flex flex-col gap-1.5 flex-1 min-w-0">{children}</div>
					{actions && <div className="flex items-center gap-2 pt-1">{actions}</div>}
				</div>
			</header>
		)
	}
)
PageHeader.displayName = 'PageHeader'

const pageTitleVariants = cva('leading-none tracking-tight transition-colors', {
	variants: {
		variant: {
			default: 'text-h5 font-semibold text-foreground',
			center: 'text-h6 font-semibold text-foreground text-center w-full',
			regular:
				'text-h5 md:text-h4 lg:text-h2 font-medium text-foreground mb-6 leading-tight tracking-tight',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
})

export interface PageTitleProps
	extends React.HTMLAttributes<HTMLHeadingElement>,
		VariantProps<typeof pageTitleVariants> {}

const PageTitle = React.forwardRef<HTMLHeadingElement, PageTitleProps>(
	({ className, variant, children, ...props }, ref) => (
		<div className="flex items-center gap-2 mt-1">
			<h1 ref={ref} className={cn(pageTitleVariants({ variant, className }))} {...props}>
				{children}
			</h1>
		</div>
	)
)
PageTitle.displayName = 'PageTitle'

const PageDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<p ref={ref} className={cn('text-body-xs text-content-secondary', className)} {...props} />
))
PageDescription.displayName = 'PageDescription'

const pageContentVariants = cva('flex-1 w-full', {
	variants: {
		variant: {
			default: 'px-4 sm:px-6 pb-6 pt-2 w-full',
			centered: 'px-4 sm:px-6 pb-6 pt-2 max-w-6xl mx-auto',
			narrow: 'px-4 sm:px-6 pb-6 pt-2 max-w-4xl mx-auto',
			quote: 'px-4 sm:px-6 pb-6 pt-2 max-w-7xl mx-auto mt-6',
			settings: 'px-4 sm:px-6 pb-6 pt-2 max-w-2xl mx-auto',
			document: 'px-4 sm:px-6 pb-6 pt-2 w-full max-w-3xl mx-auto',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
})

export interface PageContentProps
	extends React.HTMLAttributes<HTMLElement>,
		VariantProps<typeof pageContentVariants> {}

const PageContent = React.forwardRef<HTMLElement, PageContentProps>(
	({ className, variant, ...props }, ref) => (
		<main ref={ref} className={cn(pageContentVariants({ variant, className }))} {...props} />
	)
)
PageContent.displayName = 'PageContent'

const PageFooter = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
	({ className, ...props }, ref) => (
		<footer ref={ref} className={cn('flex items-center p-6 pt-0 w-full', className)} {...props} />
	)
)
PageFooter.displayName = 'PageFooter'

const PageActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn('flex items-center gap-2', className)} {...props} />
	)
)
PageActions.displayName = 'PageActions'

export {
	Page,
	PageActions,
	PageContent,
	PageDescription,
	PageFooter,
	PageHeader,
	PageTitle,
	pageVariants,
}
