import { generateSitemapIndex } from '@forge42/seo-tools/sitemap'
import { SITE_CONFIG } from '@/config/site'
import type { Route } from '@/rr/features/marketing/seo/routes/+types/sitemap'
import { createDomain } from '@/utils/misc'

export const loader = async ({ request }: Route.LoaderArgs) => {
	const domain = createDomain(request)
	const sitemaps = generateSitemapIndex([
		{
			url: `${domain}/sitemap/es.xml`,
			lastmod: new Date().toISOString().split('T')[0] || '',
		},
	])

	return new Response(sitemaps, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=86400', // 24h cache
		},
	})
}
