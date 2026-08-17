import { SITE_CONFIG } from '@/config/site'

/**
 * Generate standardized SEO meta tags for any route.
 *
 * Defaults are read from SITE_CONFIG — change the config file
 * when reusing this stack for a new project.
 *
 * Pass `matches` so the function can auto-read the origin from the
 * root loader data — sub-routes don't need their own loader for SEO.
 */
export function getMeta({
	title,
	description,
	origin,
	path = '',
	image,
	type = 'website',
	noIndex = false,
	matches,
	pathname,
}: {
	title?: string
	description?: string
	/** The request origin (protocol + host). Used to build absolute URLs. */
	origin?: string
	/** Current page path (e.g. "/docs"). Used for og:url and canonical. */
	path?: string
	/** Custom OG image path. Defaults to SITE_CONFIG.ogImage. */
	image?: string
	/** Open Graph type. Defaults to "website". Use "article" for blog posts. */
	type?: 'website' | 'article'
	noIndex?: boolean
	/** Route matches — used to auto-extract origin from root loader data. */
	matches?: Array<{ id: string; data: Record<string, unknown> | unknown }>
	/** Current pathname (e.g. location.pathname). Used for canonical URL. */
	pathname?: string
}) {
	const {
		name: siteName,
		twitterHandle,
		description: defaultDescription,
		ogImage,
		locale,
		url: siteUrl,
	} = SITE_CONFIG

	const rootData = matches?.find((m) => m.id === 'root')?.data as
		| Record<string, unknown>
		| undefined
	const effectiveOrigin =
		origin ?? (rootData && typeof rootData === 'object' ? (rootData.origin as string) : '') ?? ''
	const baseUrl = effectiveOrigin || siteUrl

	const resolvedImage = image ?? ogImage
	const fullTitle = title && title !== siteName ? `${title} — ${siteName}` : siteName
	const fullDescription = description ?? defaultDescription
	const imageUrl = resolvedImage.startsWith('http') ? resolvedImage : `${baseUrl}${resolvedImage}`

	const resolvedPath = pathname ?? path
	const pageUrl = resolvedPath ? `${baseUrl}${resolvedPath}` : baseUrl

	const meta: Array<Record<string, string>> = [
		{ title: fullTitle },
		{ name: 'description', content: fullDescription },

		{ property: 'og:site_name', content: siteName },
		{ property: 'og:title', content: fullTitle },
		{ property: 'og:description', content: fullDescription },
		{ property: 'og:image', content: imageUrl },
		{ property: 'og:image:width', content: '1200' },
		{ property: 'og:image:height', content: '630' },
		{ property: 'og:url', content: pageUrl },
		{ property: 'og:type', content: type },
		{ property: 'og:locale', content: locale },

		{ name: 'twitter:card', content: 'summary_large_image' },
		{ name: 'twitter:site', content: twitterHandle },
		{ name: 'twitter:creator', content: twitterHandle },
		{ name: 'twitter:title', content: fullTitle },
		{ name: 'twitter:description', content: fullDescription },
		{ name: 'twitter:image', content: imageUrl },
	]

	if (effectiveOrigin) {
		meta.push({ tagName: 'link', rel: 'canonical', href: pageUrl })
	}

	if (noIndex) {
		meta.push({ name: 'robots', content: 'noindex, nofollow' })
	}

	return meta
}
