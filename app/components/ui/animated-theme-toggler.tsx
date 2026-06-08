import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/utils/misc'

interface AnimatedThemeSwitcherProps {
	colorScheme: 'light' | 'dark' | 'system'
	resolvedTheme: 'light' | 'dark'
	onChange: (newScheme: 'light' | 'dark' | 'system') => void
	className?: string
}

const ThemeToggleButton = ({
	colorScheme,
	resolvedTheme,
	onChange,
	className,
}: AnimatedThemeSwitcherProps) => {
	const isDark = resolvedTheme === 'dark'

	return (
		<Button
			variant={colorScheme !== 'system' ? 'secondary' : 'ghost'}
			size="icon"
			className={cn('rounded-full relative size-10', className)}
			onClick={() => onChange(isDark ? 'light' : 'dark')}
		>
			<Icon
				name="sun"
				className={cn(
					'h-5 w-5',
					isDark ? 'rotate-180 scale-0 opacity-0 absolute' : 'rotate-0 scale-100 opacity-100'
				)}
			/>
			<Icon
				name="moon"
				className={cn(
					'h-5 w-5',
					isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-180 scale-0 opacity-0 absolute'
				)}
			/>
			<span className="sr-only">Toggle theme</span>
		</Button>
	)
}

const ThemeSystemButton = ({
	colorScheme,
	resolvedTheme,
	onChange,
	className,
}: AnimatedThemeSwitcherProps) => {
	return (
		<Button
			variant={colorScheme === 'system' ? 'secondary' : 'ghost'}
			size="icon"
			className={cn('rounded-full size-10', className)}
			onClick={() => onChange('system')}
		>
			<Icon name="laptop" className="h-5 w-5" />
			<span className="sr-only">System theme</span>
		</Button>
	)
}

// Switcher completo (toggle claro/oscuro + botón "system"). Único export del módulo.
export const AnimatedThemeSwitcher = ({
	colorScheme,
	resolvedTheme,
	onChange,
	className,
}: AnimatedThemeSwitcherProps) => {
	return (
		<div className={cn('flex items-center gap-1', className)}>
			<ThemeToggleButton
				colorScheme={colorScheme}
				resolvedTheme={resolvedTheme}
				onChange={onChange}
			/>
			<ThemeSystemButton
				colorScheme={colorScheme}
				resolvedTheme={resolvedTheme}
				onChange={onChange}
			/>
		</div>
	)
}
