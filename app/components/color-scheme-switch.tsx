// CORE
import { href, useFetcher } from 'react-router'

// UTILS
import { useColorScheme, useTheme } from '@/routes/resource/color-scheme'

// COMPONENTS
import { AnimatedThemeSwitcher } from './ui/animated-theme-toggler'

/**
 * Conecta los botones de tema (presentación) con el motor del Epic Stack:
 * lee la preferencia/tema resuelto vía hooks y persiste el cambio enviando
 * un POST optimista a la resource route `/r/color-scheme`.
 */
export function ColorSchemeSwitch() {
	const fetcher = useFetcher()
	const colorScheme = useColorScheme()
	const theme = useTheme()

	const submitColorScheme = (value: 'light' | 'dark' | 'system') => {
		fetcher.submit({ colorScheme: value }, { action: href('/r/color-scheme'), method: 'POST' })
	}

	return (
		<AnimatedThemeSwitcher
			colorScheme={colorScheme}
			resolvedTheme={theme}
			onChange={submitColorScheme}
		/>
	)
}
