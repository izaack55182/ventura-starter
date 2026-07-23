// CORE

// UTILS
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import type * as React from 'react'
import { cn } from '@/utils/misc'

// COMPONENTS
import { Icon } from './icon'

export type CheckboxProps = Omit<
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
	'type'
> & {
	type?: string
}

const Checkbox = ({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) => (
	<CheckboxPrimitive.Root
		data-slot="checkbox"
		className={cn(
			'peer size-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
			// CUSTOMIZE
			'bg-input',
			className
		)}
		{...props}
	>
		<CheckboxPrimitive.Indicator
			data-slot="checkbox-indicator"
			className={cn('flex items-center justify-center text-current')}
		>
			<Icon name="check" className="size-4" />
		</CheckboxPrimitive.Indicator>
	</CheckboxPrimitive.Root>
)

export { Checkbox }
