import { createId as cuid } from '@paralleldrive/cuid2'
import { createCookieSessionStorage, data, redirect } from 'react-router'
import { z } from 'zod'
import { getServerEnv } from './env.server'
import { combineHeaders } from './misc'

export const toastKey = 'kb_flash_toast'

// 1. Tipos de Toast ampliados
const ToastTypeSchema = z.enum(['message', 'success', 'error', 'warning', 'info'])

// 2. Esquema más potente
const ToastSchema = z.object({
	id: z.string().default(() => cuid()),
	type: ToastTypeSchema.default('message'),
	title: z.string().optional(),
	description: z.string(),
	action: z
		.object({
			label: z.string(),
			url: z.string(), // Útil para links rápidos en el toast
		})
		.optional(),
})

export type Toast = z.infer<typeof ToastSchema>

// Omitimos 'id' para que el desarrollador no tenga que pasarlo manualmente
export type ToastInput = Omit<Toast, 'id'> & { id?: string }

// [FIX TYPESCRIPT] Definimos exactamente qué datos temporales (flash) vamos a guardar
export type ToastFlashData = {
	kb_flash_toast: Toast
}

// 3. Storage optimizado con auto-limpieza (maxAge) y Lazy Loading
let _toastSessionStorage:
	| ReturnType<typeof createCookieSessionStorage<unknown, ToastFlashData>>
	| undefined

function getToastSessionStorage() {
	if (!_toastSessionStorage) {
		const env = getServerEnv()
		const secrets = env.SESSION_SECRET ? env.SESSION_SECRET.split(',') : ['default_secret']

		_toastSessionStorage = createCookieSessionStorage<unknown, ToastFlashData>({
			cookie: {
				name: toastKey,
				sameSite: 'lax',
				path: '/',
				httpOnly: true,
				secrets: secrets,
				secure: env.NODE_ENV === 'production',
				maxAge: 60, // Expira en 60s si no es consumido
			},
		})
	}
	return _toastSessionStorage
}

// Exportamos el storage manteniendo los tipos originales de Remix/React Router
export const toastSessionStorage: ReturnType<
	typeof createCookieSessionStorage<unknown, ToastFlashData>
> = {
	getSession: (cookieHeader?: string | null) => getToastSessionStorage().getSession(cookieHeader),
	commitSession: (session, options) => getToastSessionStorage().commitSession(session, options),
	destroySession: (session, options) => getToastSessionStorage().destroySession(session, options),
}

/**
 * Función base para crear los headers del Toast
 */
export async function createToastHeaders(toastInput: ToastInput) {
	const session = await toastSessionStorage.getSession()
	const toast = ToastSchema.parse(toastInput)

	// Aquí el error 'never' ya no ocurrirá gracias a ToastFlashData
	session.flash(toastKey, toast)

	const cookie = await toastSessionStorage.commitSession(session)
	return new Headers({ 'set-cookie': cookie })
}

/**
 * Función base para redirección con Toast
 */
export async function redirectWithToast(url: string, toast: ToastInput, init?: ResponseInit) {
	return redirect(url, {
		...init,
		headers: combineHeaders(init?.headers, await createToastHeaders(toast)),
	})
}

export async function redirectWithSuccess(url: string, description: string, title?: string) {
	return redirectWithToast(url, { type: 'success', description, title })
}

export async function redirectWithError(url: string, description: string, title?: string) {
	return redirectWithToast(url, { type: 'error', description, title })
}

export async function redirectWithWarning(url: string, description: string, title?: string) {
	return redirectWithToast(url, { type: 'warning', description, title })
}
export async function redirectWithInfo(url: string, description: string, title?: string) {
	return redirectWithToast(url, { type: 'info', description, title })
}

/**
 * Recupera el Toast y destruye la sesión (Consumo en loaders)
 */
export async function getToast(request: Request) {
	const session = await toastSessionStorage.getSession(request.headers.get('cookie'))
	const result = ToastSchema.safeParse(session.get(toastKey))

	const toast = result.success ? result.data : null

	return {
		toast,
		headers: toast
			? new Headers({
					'set-cookie': await toastSessionStorage.destroySession(session),
				})
			: null,
	}
}

// =====================================================================
// 5. RESPUESTAS CON DATA (Para fetchers o respuestas que no redireccionan)
// =====================================================================

export async function dataWithToast<T>(responseData: T, toast: ToastInput, init?: ResponseInit) {
	return data(responseData, {
		...init,
		headers: combineHeaders(init?.headers, await createToastHeaders(toast)),
	})
}

export async function dataWithSuccess<T>(responseData: T, description: string, title?: string) {
	return dataWithToast(responseData, { type: 'success', description, title })
}

export async function dataWithError<T>(responseData: T, description: string, title?: string) {
	return dataWithToast(responseData, { type: 'error', description, title })
}

export async function dataWithWarning<T>(responseData: T, description: string, title?: string) {
	return dataWithToast(responseData, { type: 'warning', description, title })
}
