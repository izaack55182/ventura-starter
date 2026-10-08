import { generateSitemap } from '@forge42/seo-tools/sitemap'
import { SITE_PAGES } from '@/config/site'
import type { Route } from '@/rr/features/marketing/seo/routes/+types/sitemap-pages'
import { getDomainUrl } from '@/utils/misc'

export const loader = async ({ request }: Route.LoaderArgs) => {
	const domain = getDomainUrl(request)

	const sitemap = await generateSitemap({
		domain,
		routes: SITE_PAGES.map((page) => ({
			url: page.path,
			...(page.lastmod ? { lastmod: page.lastmod } : {}),
			changefreq: page.changefreq,
			priority: page.priority as 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1,
		})),
	})

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
		},
	})
}
