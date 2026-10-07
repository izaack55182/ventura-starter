import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/utils/misc'

const switchVariants = cva(
	'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
	{
		variants: {
			size: {
				sm: 'h-4 w-7',
				default: 'h-5 w-9',
				lg: 'h-6 w-11',
			},
		},
		defaultVariants: { size: 'default' },
	}
)

export type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> &
	VariantProps<typeof switchVariants>

export const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
	({ className, size, ...props }, ref) => (
		<SwitchPrimitive.Root ref={ref} className={cn(switchVariants({ size }), className)} {...props}>
			<SwitchPrimitive.Thumb
				className={cn(
					'pointer-events-none block rounded-full bg-background shadow-sm transition-transform',
					size === 'sm' && 'size-3 data-[state=checked]:translate-x-3',
					size === 'lg' && 'size-5 data-[state=checked]:translate-x-5',
					(!size || size === 'default') && 'size-4 data-[state=checked]:translate-x-4'
				)}
			/>
		</SwitchPrimitive.Root>
	)
)

Switch.displayName = SwitchPrimitive.Root.displayName
