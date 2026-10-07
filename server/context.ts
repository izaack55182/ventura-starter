import { createContext, RouterContextProvider } from 'react-router'
import { getClientEnv, getServerEnv, initEnv, type ServerEnv } from '@/utils/env.server'

export type AppLoadContext = {
	isProductionDeployment: boolean
	env: ServerEnv
	clientEnv: ReturnType<typeof getClientEnv>
	cloudflare: {
		env: Env
	}
}

export const appLoadContext = createContext<AppLoadContext>()

export function getLoadContext(cloudflareEnv: Env) {
	const rawEnv = (cloudflareEnv ?? {}) as unknown as Record<string, unknown>
	const env = Object.keys(rawEnv).length > 0 ? initEnv(rawEnv) : getServerEnv()

	const context = new RouterContextProvider()
	context.set(appLoadContext, {
		isProductionDeployment: env.APP_ENV === 'production',
		env,
		clientEnv: getClientEnv(),
		cloudflare: {
			env: cloudflareEnv,
		},
	})

	return context
}
