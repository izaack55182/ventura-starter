import { type Config, defineConfig } from 'drizzle-kit'
import { getServerEnv } from '@/utils/env.server'

const env = getServerEnv()

export default defineConfig({
	schema: 'app/drizzle/schema/*',
	dialect: 'postgresql',
	casing: 'snake_case',
	out: 'app/drizzle/migrations',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
	verbose: true,
	strict: true,
}) satisfies Config
