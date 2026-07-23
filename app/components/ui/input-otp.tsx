// CORE

// COMPONENTS
import { OTPInput, OTPInputContext } from 'input-otp'
import * as React from 'react'
// UTILS
import { cn } from '@/utils/misc'

const InputOTP = ({
	className,
	containerClassName,
	...props
}: React.ComponentProps<typeof OTPInput>) => (
	<OTPInput
		data-slot="input-otp"
		containerClassName={cn(
			'flex items-center justify-center gap-2 has-disabled:opacity-50',
			containerClassName
		)}
		className={cn('disabled:cursor-not-allowed', className)}
		{...props}
	/>
)

const InputOTPGroup = ({ className, ...props }: React.ComponentProps<'div'>) => (
	<div data-slot="input-otp-group" className={cn('flex items-center', className)} {...props} />
)

const InputOTPSlot = ({
	index,
	className,
	...props
}: React.ComponentProps<'div'> & { index: number }) => {
	const inputOTPContext = React.useContext(OTPInputContext)
	const slot = inputOTPContext.slots[index]
	if (!slot) throw new Error('Invalid slot index')
	const { char, hasFakeCaret, isActive } = slot

	return (
		<div
			data-slot="input-otp-slot"
			className={cn(
				'relative flex size-12 items-center justify-center border-y border-r border-border text-md transition-all first:rounded-l-md first:border-l last:rounded-r-md',
				isActive && 'z-10 ring-2 ring-ring ring-offset-background',
				className
			)}
			{...props}
		>
			{char}
			{hasFakeCaret && (
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
					<div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
				</div>
			)}
		</div>
	)
}

const InputOTPSeparator = ({ className, ...props }: React.ComponentProps<'div'>) => (
	// biome-ignore lint/a11y/useSemanticElements: <explanation>
	// biome-ignore lint/a11y/useFocusableInteractive: <explanation>
	<div
		data-slot="input-otp-separator"
		className={cn('flex items-center justify-center px-2 text-muted-foreground', className)}
		aria-hidden="true"
		{...props}
	>
		-
	</div>
)

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot }
