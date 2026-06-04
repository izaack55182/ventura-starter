import { z } from 'zod'

const envSchema = z.object({
	NODE_ENV: z
		.enum(['production', 'development', 'preview', 'test'] as const)
		.default('development'),
	APP_ENV: z.enum(['development', 'staging', 'production', 'preview']).default('development'),

	COOKIE_SECRET: z.string().default('dev_secret_key_12345'),
	SESSION_SECRET: z.string().default('dev_session_secret_12345'),

	// SEO
	ALLOW_INDEXING: z.enum(['true', 'false']).optional(),

	// SECURITY - Required in production
	HONEYPOT_SECRET: z.string().min(1, 'HONEYPOT_SECRET es obligatorio'),
})

export type ServerEnv = z.infer<typeof envSchema>
let env: ServerEnv

/**
 * Initializes and parses given environment variables using zod
 */
export function initEnv(runtimeEnv?: unknown) {
	const source = {
		...(typeof process !== 'undefined' ? process.env : {}),
		...(runtimeEnv && typeof runtimeEnv === 'object' ? runtimeEnv : {}),
	} as any

	const parsed = envSchema.safeParse(source)

	if (parsed.success === false) {
		const fieldErrors = parsed.error.flatten().fieldErrors
		const isEmpty = Object.keys(source).length === 0
		const isProduction = source.NODE_ENV === 'production' || source.APP_ENV === 'production'

		if (!isEmpty || isProduction) {
			console.error('❌ Invalid environment variables:', JSON.stringify(fieldErrors))
			console.log('🔑 Keys found in source:', Object.keys(source || {}))
		}

		if (!isProduction) {
			if (!isEmpty) {
				console.warn(
					'⚠️ Advertencia: Algunas variables de entorno no son válidas, pero se permitirá el arranque en modo desarrollo.'
				)
			}
			env = {
				...source,
				NODE_ENV: source.NODE_ENV || 'development',
				APP_ENV: source.APP_ENV || 'development',
				COOKIE_SECRET: source.COOKIE_SECRET || 'dev-secret-only',
				SESSION_SECRET: source.SESSION_SECRET || 'dev-session-secret',
				HONEYPOT_SECRET: source.HONEYPOT_SECRET || 'dev-honeypot-secret-12345',
			} as ServerEnv
			return env
		}

		throw new Error('Configuración de entorno inválida en producción.')
	}

	env = parsed.data
	Object.freeze(env)
	return env
}

export function getServerEnv() {
	if (!env) {
		return initEnv()
	}
	return env
}

/**
 * Helper function which returns a subset of the environment vars which are safe expose to the client.
 */
export function getClientEnv() {
	const serverEnv = getServerEnv()
	return {
		MODE: serverEnv.NODE_ENV,
		ALLOW_INDEXING: serverEnv.ALLOW_INDEXING,
	}
}

export type ClientEnvVars = ReturnType<typeof getClientEnv>

declare global {
	var ENV: ClientEnvVars
	interface Window {
		ENV: ClientEnvVars
	}
}
