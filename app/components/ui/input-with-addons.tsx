import * as React from 'react'
import { cn } from '@/utils/misc'

export interface InputWithAddonsProps extends React.InputHTMLAttributes<HTMLInputElement> {
	leading?: React.ReactNode
	trailing?: React.ReactNode
	containerClassName?: string
}

const InputWithAddons = React.forwardRef<HTMLInputElement, InputWithAddonsProps>(
	({ leading, trailing, containerClassName, className, ...props }, ref) => {
		return (
			<div
				className={cn(
					'group flex h-10 w-full items-stretch overflow-hidden rounded-md border border-input bg-background text-sm ring-offset-background focus-within:outline-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50',
					containerClassName
				)}
			>
				{leading ? (
					<div className="flex items-center justify-center border-r border-input bg-muted px-3">
						{leading}
					</div>
				) : null}

				<input
					className={cn(
						'flex-1 w-full bg-transparent px-3 py-2 placeholder:text-muted-foreground focus:outline-hidden disabled:cursor-not-allowed',
						className
					)}
					ref={ref}
					{...props}
				/>

				{trailing ? (
					<div className="flex items-center justify-center border-l border-input bg-muted px-3">
						{trailing}
					</div>
				) : null}
			</div>
		)
	}
)
InputWithAddons.displayName = 'InputWithAddons'

export { InputWithAddons }
