import { getClientEnv, getServerEnv, initEnv, type ServerEnv } from '@/utils/env.server'

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
