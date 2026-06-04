import { generateSitemap } from '@forge42/seo-tools/sitemap'
import { SITE_PAGES } from '@/config/site'
import type { Route } from '@/rr/features/marketing/seo/routes/+types/sitemap-pages'
import { createDomain } from '@/utils/misc'

/**
 * ─────────────────────────────────────────────────────────────
 *  SITEMAP XML — Indexación de páginas públicas
 *
 *  Genera un sitemap XML con todas las páginas del sitio.
 *  Las páginas se definen en app/config/site.ts → SITE_PAGES
 *
 *  Ruta: /sitemap/es.xml
 *  Tipo: application/xml
 *  Caché: 1 hora
 * ─────────────────────────────────────────────────────────────
 */
export const loader = async ({ request }: Route.LoaderArgs) => {
	const domain = createDomain(request)

	const sitemap = await generateSitemap({
		domain,
		routes: SITE_PAGES.map((page) => ({
			url: page.path,
			lastmod: page.lastmod,
			changefreq: page.changefreq,
			priority: page.priority as 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1,
		})),
	})

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600', // 1 hora de caché
		},
	})
}
