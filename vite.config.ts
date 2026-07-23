import { cloudflare } from '@cloudflare/vite-plugin'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { defineConfig } from 'vite'
import { iconsSpritesheet } from 'vite-plugin-icons-spritesheet'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	ssr: {
		noExternal: ['react-tweet'],
	},
	optimizeDeps: {
		exclude: ['drizzle-orm', 'drizzle-zod'],
	},
	server: {
		hmr: {
			overlay: false,
		},
		watch: {
			ignored: ['**/node_modules/**', '**/.wrangler/**', '**/*.db*'],
		},
		fs: {
			allow: ['..'],
		},
	},
	build: {
		assetsDir: 'assets',
	},
	plugins: [
		cloudflare({ viteEnvironment: { name: 'ssr' } }),
		reactRouter(),
		{
			name: 'css-hmr-fix',
			handleHotUpdate({ file, server }) {
				if (file.endsWith('.css')) {
					server.ws.send({
						type: 'custom',
						event: 'css-update',
						data: { file },
					})
					return []
				}
			},
		},
		tailwindcss(),
		tsconfigPaths(),
		iconsSpritesheet({
			inputDir: './other/icons',
			outputDir: './public/icons',
			fileName: 'sprite.svg',
			withTypes: true,
			typesOutputFile: './app/components/ui/icons/types.ts',
			formatter: 'biome',
			iconNameTransformer: (name) => name,
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './app'),
		},
	},
})
