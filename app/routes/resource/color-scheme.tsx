// CORE

import { parseWithZod } from '@conform-to/zod'
import { data, href, useFetchers } from 'react-router'
import { z } from 'zod'
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
