/**
 * Central site configuration — single source of truth.
 *
 * When reusing this stack for a new project, change only this file
 * and everything (SEO, sitemap, robots, manifest) stays consistent.
 */
export const SITE_CONFIG = {
	/** Site name — used in <title>, OG, and manifest. */
	name: 'Ventura Stack',

	/** Production domain — fallback for canonical and OG URLs. */
	url: 'https://ventura-stack.claux.workers.dev',

	/** Primary language — used in <html lang=""> and sitemap hreflang. */
	lang: 'es',

	/** Twitter/X handle for twitter:site and twitter:creator. */
	twitterHandle: '@venturastack',

	/** Default site description. */
	description:
		'El stack open-source que combina React Router v7, Cloudflare Workers y Bun para llevar tu app al edge con 0ms de cold start.',

	/** Default OG image (relative path from /public). */
	ogImage: '/social-preview.avif',

	/** Open Graph locale. */
	locale: 'es_MX',

	/** Theme color for PWA manifest and browser theme-color. */
	themeColor: '#09090b',

	/** Site logo — used in Organization schema (JSON-LD). */
	logo: '/images/logo/ventura-light.svg',

	/** Social links — used in Organization schema. */
	sameAs: ['https://github.com/izaack55182/ventura-stack'],
} as const

/**
 * Public indexable routes for the sitemap.
 *
 * changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
 * priority: 0.0 – 1.0  (1.0 = most important)
 */
export const SITE_PAGES = [
	{
		path: '/',
		changefreq: 'weekly' as const,
		priority: 1,
		lastmod: undefined,
	},
] satisfies Array<{
	path: string
	changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
	priority: 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1
	lastmod?: string
}>
