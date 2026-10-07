import { generateRobotsTxt } from '@forge42/seo-tools/robots'
import type { Route } from '@/rr/features/marketing/seo/routes/+types/robots'
import { getDomainUrl } from '@/utils/misc'

const PRIVATE_PATHS = [
	'/c',
	'/c/',
	'/login',
	'/logout',
	'/signup',
	'/verify',
	'/forgot-password',
	'/reset-password',
	'/onboarding',
	'/webauthn/',
	'/r/',
	'/404',
	'/500',
]

export async function loader({ request }: Route.LoaderArgs) {
	const domain = getDomainUrl(request)
	const robotsTxt = generateRobotsTxt([
		{
			userAgent: '*',
			allow: ['/'],
			disallow: PRIVATE_PATHS,
			sitemap: [`${domain}/sitemap-index.xml`],
		},
	])
	return new Response(robotsTxt, {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'public, max-age=86400',
		},
	})
}
