import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./tests/setup-test-env.ts'],
		include: ['app/**/*.{test,spec}.{ts,tsx}', 'tests/unit/**/*.{test,spec}.{ts,tsx}'],
		exclude: ['tests/e2e/**', 'node_modules/**', '.wrangler/**'],
		css: false,
	},
})
