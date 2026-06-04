/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIG — Punto único de configuración del proyecto
 *
 *  Al reutilizar este stack para un proyecto nuevo, solo cambia
 *  este archivo y todo (SEO, sitemap, robots, manifest) quedará
 *  consistente automáticamente.
 * ─────────────────────────────────────────────────────────────
 */
export const SITE_CONFIG = {
	/** Nombre del sitio — aparece en <title>, OG y manifest */
	name: 'Ventura Stack',

	/** Dominio de producción — usado como fallback en canonical y OG */
	url: 'https://ventura-stack.claux.workers.dev',

	/** Idioma principal — usado en <html lang=""> y sitemap hreflang */
	lang: 'es',

	/** Handle de Twitter/X para twitter:site y twitter:creator */
	twitterHandle: '@venturastack',

	/** Descripción por defecto del sitio */
	description:
		'El stack open-source que combina React Router v7, Cloudflare Workers y Bun para llevar tu app al edge con 0ms de cold start.',

	/** Imagen OG por defecto (ruta relativa a /public) */
	ogImage: '/social-preview.png',

	/** Locale para Open Graph */
	locale: 'es_MX',

	/** Color del tema para PWA manifest y browser theme-color */
	themeColor: '#09090b',

	/** Logo del sitio — usado en Organization schema (JSON-LD) */
	logo: '/images/logo/ventura-light.svg',

	/** Links de redes sociales — usado en Organization schema */
	sameAs: [
		'https://github.com/izaack55182/ventura-stack',
		// Agrega aquí tus redes sociales:
		// 'https://twitter.com/tu-handle',
		// 'https://linkedin.com/company/tu-empresa',
	],
} as const

/**
 * Rutas públicas indexables por Google.
 * Úsalas en el sitemap y para validar qué está expuesto.
 *
 * changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
 * priority: 0.0 – 1.0  (1.0 = más importante)
 */
export const SITE_PAGES = [
	{
		path: '/',
		changefreq: 'weekly' as const,
		priority: 1,
		lastmod: '2025-05-01',
	},
] satisfies Array<{
	path: string
	changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
	priority: 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1
	lastmod: string
}>
