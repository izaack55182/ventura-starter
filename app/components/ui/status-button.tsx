import * as React from 'react'
import { useSpinDelay } from 'spin-delay'
import { cn } from '@/utils/misc'

// COMPONENTS
import { Button } from './button'
import { Icon } from './icon'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

export interface StatusButtonProps extends React.ComponentProps<typeof Button> {
	status: 'pending' | 'success' | 'error' | 'idle'
	message?: string | null
	isIconOnly?: boolean
	spinDelay?: Parameters<typeof useSpinDelay>[1]
}

export const StatusButton = React.forwardRef<HTMLButtonElement, StatusButtonProps>(
	({ message, status, className, children, spinDelay, isIconOnly, disabled, ...props }, ref) => {
		const delayedPending = useSpinDelay(status === 'pending', {
			delay: 200,
			minDuration: 500,
			...spinDelay,
		})

		const companion = {
			pending: delayedPending ? (
				<div role="status" className="animate-in fade-in zoom-in-50 duration-200">
					<Icon name="loader" className="size-4 animate-spin" />
				</div>
			) : null,
			success: null,
			error: null,
			idle: null,
		}[status]

		const stateIndicator = message ? (
			<Tooltip>
				<TooltipTrigger asChild>
					<span className="flex items-center justify-center cursor-help">{companion}</span>
				</TooltipTrigger>
				<TooltipContent>{message}</TooltipContent>
			</Tooltip>
		) : (
			companion
		)

		return (
			<Button
				ref={ref}
				variant="ghost"
				disabled={disabled || status === 'pending'}
				className={cn(
					'relative rounded-full text-sm font-semibold text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground',
					className
				)}
				size={props.size ?? 'lg'}
				{...props}
			>
				<span
					className={cn(
						'flex items-center justify-center gap-2 transition-opacity duration-200',
						isIconOnly && status !== 'idle' ? 'opacity-0' : 'opacity-100'
					)}
				>
					{children}
				</span>

				{status !== 'idle' && companion && (
					<span
						className={cn(
							'flex items-center justify-center pointer-events-none',
							isIconOnly ? 'absolute inset-0' : 'ml-2 pl-2 border-l border-zinc-200'
						)}
					>
						{stateIndicator}
					</span>
				)}
			</Button>
		)
	}
)

StatusButton.displayName = 'StatusButton'
