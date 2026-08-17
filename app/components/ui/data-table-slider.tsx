// COMPONENTS
import * as SliderPrimitive from '@radix-ui/react-slider'
import * as React from 'react'
// UTILS
import { cn } from '@/utils/misc'

const DataTableSlider = React.forwardRef<
	React.ElementRef<typeof SliderPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, value, defaultValue, min = 0, max = 100, ...props }, ref) => {
	const thumbs = Array.isArray(value)
		? value
		: Array.isArray(defaultValue)
			? defaultValue
			: [min, max]

	return (
		<SliderPrimitive.Root
			ref={ref}
			value={value}
			defaultValue={defaultValue}
			min={min}
			max={max}
			className={cn('relative flex w-full touch-none select-none items-center', className)}
			{...props}
		>
			<SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
				<SliderPrimitive.Range className="absolute h-full bg-primary" />
			</SliderPrimitive.Track>

			{thumbs.map((_, index) => (
				<SliderPrimitive.Thumb
					key={index}
					className="block h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
				/>
			))}
		</SliderPrimitive.Root>
	)
})
DataTableSlider.displayName = SliderPrimitive.Root.displayName

export { DataTableSlider }
