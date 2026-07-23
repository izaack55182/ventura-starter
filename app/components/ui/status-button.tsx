// CORE
import type * as React from 'react'

// UTILS
import { useSpinDelay } from 'spin-delay'
import { cn } from '@/utils/misc'

// COMPONENTS
import { Button, type ButtonVariant } from './button'
import { Icon } from './icon'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

export const StatusButton = ({
	message,
	status,
	className,
	children,
	spinDelay,
	icon,
	...props
}: React.ComponentProps<'button'> &
	ButtonVariant & {
		status: 'pending' | 'success' | 'error' | 'idle'
		message?: string | null
		icon?: boolean
		spinDelay?: Parameters<typeof useSpinDelay>[1]
	}) => {
	const delayedPending = useSpinDelay(status === 'pending', {
		delay: 400,
		minDuration: 300,
		...spinDelay,
	})
	const companion = {
		pending: delayedPending ? (
			<div
				role="status"
				className={
					icon
						? 'absolute z-50 flex size-6 items-center justify-center bg-background'
						: 'inline-flex size-6 items-center justify-center'
				}
			>
				<Icon name="upload" className="animate-spin" />
			</div>
		) : null,
		success: null,
		error: null,
		idle: null,
	}[status]

	return (
		<Button className={cn('flex justify-center gap-2', className)} {...props}>
			<div>{children}</div>
			{message ? (
				<Tooltip>
					<TooltipTrigger>{companion}</TooltipTrigger>
					<TooltipContent>{message}</TooltipContent>
				</Tooltip>
			) : (
				companion
			)}
		</Button>
	)
}
StatusButton.displayName = 'Button'
