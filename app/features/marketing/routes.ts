import { index, layout, prefix, route } from '@react-router/dev/routes'

export const marketingRoutes = [
	// HOME ROUTES
	layout('routes/layout/layout-public.tsx', [index('features/marketing/home/routes/home.tsx')]),

	// SEO
	route('robots.txt', 'features/marketing/seo/routes/robots.ts'),
	route('sitemap-index.xml', 'features/marketing/seo/routes/sitemap.ts'),
	route('sitemap/es.xml', 'features/marketing/seo/routes/sitemap-pages.ts'),
]
