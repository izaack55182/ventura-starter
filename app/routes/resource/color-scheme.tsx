// CORE

import { parseWithZod } from '@conform-to/zod'
import { data, href, useFetcher, useFetchers } from 'react-router'
import { z } from 'zod'
import { Icon } from '@/components/ui/icon'
import type { Route } from '@/rr/routes/resource/+types/color-scheme'
import { useHints, useOptionalHints } from '@/utils/client-hints'
// UTILS
import { setColorScheme } from '@/utils/color-scheme.server'
import { useOptionalRequestInfo, useRequestInfo } from '@/utils/request-info'
export const ColorSchemeSchema = z
	.enum(['dark', 'light', 'system']) // Possible color schemes
	.default('light') // If there's no cookie, default to "system"
	.catch('light') // In case of an error, default to "system"

export type ColorScheme = z.infer<typeof ColorSchemeSchema>

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData()
	const submission = parseWithZod(formData, {
		schema: z.object({
			colorScheme: ColorSchemeSchema,
		}),
	})

	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply() },
			{
				status: submission.status === 'error' ? 400 : 200,
			}
		)
	}

	const { colorScheme } = submission.value

	return data(
		// { result: submission.reply() },
		null,
		{ headers: { 'set-cookie': await setColorScheme(colorScheme) } }
	)
}

/**
 * @returns the user's theme preference, or the client hint theme if the user
 * has not set a preference.
 */
export function useColorScheme() {
	const requestInfo = useRequestInfo()
	const optimisticMode = useOptimisticColorScheme()

	if (optimisticMode) {
		return optimisticMode
	}

	return requestInfo.userPrefs.colorScheme ?? 'light'
}

/**
 * @returns the actual resolved theme to be used for styling (light or dark)
 */
export function useTheme() {
	const hints = useHints()
	const requestInfo = useRequestInfo()
	const optimisticMode = useOptimisticColorScheme()

	const preference = optimisticMode ?? requestInfo.userPrefs.colorScheme ?? 'light'

	if (preference === 'system') {
		return hints.theme
	}

	return preference
}

/**
 * Igual que `useTheme`, pero NO lanza error si el loader raíz no tiene datos
 * (p. ej. dentro del ErrorBoundary, cuando el loader falló). Devuelve 'light'
 * como fallback seguro. Pensada para usarse en el `Layout` de root.
 */
export function useOptionalTheme() {
	const hints = useOptionalHints()
	const requestInfo = useOptionalRequestInfo()
	const optimisticMode = useOptimisticColorScheme()

	const preference = optimisticMode ?? requestInfo?.userPrefs.colorScheme ?? 'light'

	if (preference === 'system') {
		return hints?.theme ?? 'light'
	}

	return preference
}

/**
 * If the user's changing their color scheme mode preference, this will return the
 * value it's being changed to.
 */
export function useOptimisticColorScheme() {
	const fetchers = useFetchers()
	const themeFetcher = fetchers.find((f) => f.formAction === href('/r/color-scheme'))

	if (themeFetcher?.formData) {
		const submission = parseWithZod(themeFetcher.formData, {
			schema: z.object({
				colorScheme: ColorSchemeSchema,
			}),
		})

		if (submission.status === 'success') {
			return submission.value.colorScheme
		}
	}
}

export function ColorSchemeSwitch() {
	const fetcher = useFetcher()
	const mode = useColorScheme()

	const nextMode = mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system'

	const modeLabel = {
		light: (
			<Icon name="sun">
				<span className="sr-only">Light</span>
			</Icon>
		),
		dark: (
			<Icon name="moon">
				<span className="sr-only">Dark</span>
			</Icon>
		),
		system: (
			<Icon name="laptop">
				<span className="sr-only">System</span>
			</Icon>
		),
	}

	return (
		<fetcher.Form method="POST" action={href('/r/color-scheme')}>
			<input type="hidden" name="colorScheme" value={nextMode} />
			<div className="flex gap-2">
				<button
					type="submit"
					className="flex size-8 cursor-pointer items-center justify-center rounded-full hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					{modeLabel[mode]}
				</button>
			</div>
		</fetcher.Form>
	)
}
