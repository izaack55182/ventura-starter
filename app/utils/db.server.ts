import { remember } from '@epic-web/remember'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@/drizzle/schema.server'
import { getServerEnv } from './env.server'

const env = getServerEnv()

// Use @epic-web/remember to persist connection across HMR reloading in development
export const db = remember('db', () => {
	// Enable postgres to work nicely in Cloudflare Workers / Serverless contexts
	// When using Supabase connection pooler, `prepare: false` is highly recommended.
	const client = postgres(env.DATABASE_URL, {
		prepare: false, // Required for Supabase pgbouncer / connection pooler
		max: env.NODE_ENV === 'production' ? 10 : 1, // Minimize connections in dev/serverless
	})

	return drizzle(client, { schema, casing: 'snake_case' })
})
