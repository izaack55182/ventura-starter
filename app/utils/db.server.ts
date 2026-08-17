import { remember } from '@epic-web/remember'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@/drizzle/schema.server'
import { getServerEnv } from './env.server'

const env = getServerEnv()

// Detect if running inside Cloudflare Workers (workerd)
const isCloudflareWorker =
	(typeof globalThis !== 'undefined' && 'WebSocketPair' in globalThis) ||
	(typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers')

function getPostgresConfig() {
	return {
		prepare: false,
		max: isCloudflareWorker ? 1 : env.NODE_ENV === 'production' ? 10 : 5,
		idle_timeout: isCloudflareWorker ? 1 : undefined,
	}
}

let dbInstance: ReturnType<typeof drizzle<typeof schema>>

if (isCloudflareWorker) {
	// Recreate connection per operation to prevent socket sharing errors in Workers
	dbInstance = new Proxy({} as typeof dbInstance, {
		get(_target, prop, _receiver) {
			const client = postgres(env.DATABASE_URL, getPostgresConfig())
			const instance = drizzle(client, { schema, casing: 'snake_case' })
			const value = Reflect.get(instance, prop)
			return typeof value === 'function' ? value.bind(instance) : value
		},
	})
} else {
	// Use standard global connection pool persistence for Node.js/Bun servers
	dbInstance = remember('db', () => {
		const client = postgres(env.DATABASE_URL, getPostgresConfig())
		return drizzle(client, { schema, casing: 'snake_case' })
	})
}

export const db = dbInstance
