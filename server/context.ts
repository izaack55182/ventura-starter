import { getClientEnv, getServerEnv, initEnv, type ServerEnv } from '@/utils/env.server'

/**
 * Construye el AppLoadContext que React Router pasa a loaders y actions.
 *
 * En el enfoque nativo de Workers los bindings llegan directos en `env`
 * (bindings llegan directos en `env`). Aquí validamos el env con Zod y exponemos
 * tanto el env tipado como los bindings crudos de Cloudflare.
 */
export function getLoadContext(cloudflareEnv: Env) {
	const rawEnv = (cloudflareEnv ?? {}) as unknown as Record<string, unknown>
	const env = Object.keys(rawEnv).length > 0 ? initEnv(rawEnv) : getServerEnv()

	return {
		isProductionDeployment: env.APP_ENV === 'production',
		env,
		clientEnv: getClientEnv(),
		cloudflare: {
			env: cloudflareEnv,
		},
	}
}

/**
 * Tipos del contexto en loaders/actions.
 *
 * Uso:
 *   export const loader = async ({ context }: Route.LoaderArgs) => {
 *     const db = context.cloudflare.env.DB        // cuando actives D1
 *     const r2 = context.cloudflare.env.R2_BUCKET // cuando actives R2
 *   }
 */
declare module 'react-router' {
	interface AppLoadContext {
		isProductionDeployment: boolean
		env: ServerEnv
		clientEnv: ReturnType<typeof getClientEnv>
		cloudflare: {
			env: Env
		}
	}
}
