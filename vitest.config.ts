import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

/**
 * Config de Vitest independiente de `vite.config.ts`: NO carga el plugin de
 * Cloudflare (workerd) ni el de React Router, para que los tests unitarios y de
 * componente corran rápido en jsdom sin levantar el runtime de Workers.
 *
 * Los e2e con navegador real viven aparte, en Playwright (tests/e2e).
 */
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
