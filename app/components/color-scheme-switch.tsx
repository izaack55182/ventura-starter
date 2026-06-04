// CORE
import { href, useFetcher } from 'react-router'

// UTILS
import { useColorScheme, useTheme } from '@/routes/resource/color-scheme'

// COMPONENTS
import {
	AnimatedThemeSwitcher,
	ThemeSystemButton,
	ThemeToggleButton,
} from './ui/animated-theme-toggler'
export function ColorSchemeSwitchManual() {
	const fetcher = useFetcher()
	const colorScheme = useColorScheme()
	const theme = useTheme()

	const submitColorScheme = (value: 'light' | 'dark' | 'system') => {
		fetcher.submit({ colorScheme: value }, { action: href('/r/color-scheme'), method: 'POST' })
	}

	return (
		<ThemeToggleButton
			colorScheme={colorScheme}
			resolvedTheme={theme}
			onChange={submitColorScheme}
		/>
	)
}

export function ColorSchemeSwitchSystem() {
	const fetcher = useFetcher()
	const colorScheme = useColorScheme()
	const theme = useTheme()

	const submitColorScheme = (value: 'light' | 'dark' | 'system') => {
		fetcher.submit({ colorScheme: value }, { action: href('/r/color-scheme'), method: 'POST' })
	}

	return (
		<ThemeSystemButton
			colorScheme={colorScheme}
			resolvedTheme={theme}
			onChange={submitColorScheme}
		/>
	)
}
// Al final de color-scheme-switch.tsx, agrega:
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
