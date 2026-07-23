// CORE

import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
// UTILS
import { cn } from '@/utils/misc'

// COMPONENTS
import { Button } from './button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible'
import { Icon } from './icon'

const formContentVariants = cva('flex flex-col w-full gap-4 pt-6', {
	variants: {
		align: {
			default: '',
			center: 'items-center',
		},
	},
	defaultVariants: {
		align: 'default',
	},
})

export interface FormContentProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof formContentVariants> {}

export const FormContent = forwardRef<HTMLDivElement, FormContentProps>(
	({ children, className, align, ...props }, ref) => {
		return (
			<div ref={ref} className={cn(formContentVariants({ align }), className)} {...props}>
				{children}
			</div>
		)
	}
)

export const FormRow = ({ children, className }: { children: ReactNode; className?: string }) => {
	return (
		<div className={cn('flex w-full flex-col gap-4 md:flex-row items-end', className)}>
			{children}
		</div>
	)
}

export const FormCollapsible = ({ label, children }: { label?: string; children: ReactNode }) => {
	return (
		<Collapsible className="w-full flex flex-col justify-center">
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t border-border" />
				</div>
				<div className="relative flex justify-center">
					<CollapsibleTrigger asChild>
						<Button className="group bg-card" variant="link">
							{label ?? 'See more'}
							<Icon
								name="chevron-down"
								className={'group-data-[state=open]:rotate-180 transform duration-300 ease-in-out'}
							/>
						</Button>
					</CollapsibleTrigger>
				</div>
			</div>
			<CollapsibleContent>{children}</CollapsibleContent>
		</Collapsible>
	)
}

export const FormFooter = ({ children }: { children: ReactNode }) => {
	return <div className="flex w-full gap-4 justify-end pt-6">{children}</div>
}

export const FormErrors = ({ errors }: { errors: Record<string, string[]> }) => {
	const errorsToRender: string[] = []

	for (const errorList of Object.values(errors)) {
		errorsToRender.push(...errorList)
	}

	if (!errorsToRender.length) return null

	return (
		<ul className="flex flex-col gap-2">
			{errorsToRender.map((error, index) => (
				<li key={index} className="flex items-start gap-2 text-sm text-destructive">
					<Icon name="circle-alert" className="mt-0.5 shrink-0 size-4" />
					<span>{error}</span>
				</li>
			))}
		</ul>
	)
}

const sectionVariants = cva('flex flex-col gap-3', {
	variants: {
		variant: {
			default: '',
			settings: '',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
})

export interface SectionProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof sectionVariants> {
	title?: string
	description?: string
	icon?: string
	iconClassName?: string
}

export const Section = forwardRef<HTMLDivElement, SectionProps>(
	({ title, description, icon, iconClassName, children, className, variant, ...props }, ref) => {
		const isSettings = variant === 'settings'
		return (
			<div ref={ref} className={cn(sectionVariants({ variant }), className)} {...props}>
				{(title || description || icon) && (
					<div
						className={cn(
							'flex items-center gap-3',
							!isSettings && 'mb-2',
							className?.includes('text-center') && 'justify-center'
						)}
					>
						{icon && (
							<div className="flex size-9 items-center justify-center rounded-lg bg-muted border border-border shrink-0">
								<Icon
									name={icon as any}
									className={cn('size-5 text-muted-foreground', iconClassName)}
								/>
							</div>
						)}
						<div className="flex flex-col gap-0.5">
							{title && (
								<h3
									className={cn(
										isSettings
											? 'text-sm font-semibold text-foreground'
											: 'text-xl font-bold text-foreground leading-none'
									)}
								>
									{title}
								</h3>
							)}
							{description && (
								<p
									className={cn(
										isSettings
											? 'text-sm text-muted-foreground/70'
											: 'text-sm text-muted-foreground/80 font-medium mt-2'
									)}
								>
									{description}
								</p>
							)}
						</div>
					</div>
				)}
				<div className={cn(isSettings ? 'flex flex-col' : 'flex flex-col gap-4')}>{children}</div>
			</div>
		)
	}
)
