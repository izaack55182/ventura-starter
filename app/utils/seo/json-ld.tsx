import { SITE_CONFIG } from '@/config/site'
import { useNonce } from '@/utils/nonce-provider'

/**
 * Renders a `<script type="application/ld+json">` block in the HTML.
 * The CSP nonce is injected automatically from the NonceProvider.
 */
export function JsonLd<T extends Record<string, unknown>>({ data }: { data: T }) {
	const nonce = useNonce()
	return (
		<script
			nonce={nonce}
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	)
}

/**
 * Organization schema — identifies the entity behind the site.
 * @see https://schema.org/Organization
 */
export function buildOrganizationSchema(origin: string) {
	return {
		'@context': 'https://schema.org' as const,
		'@type': 'Organization' as const,
		name: SITE_CONFIG.name,
		url: origin || SITE_CONFIG.url,
		logo: `${origin || SITE_CONFIG.url}${SITE_CONFIG.logo}`,
		description: SITE_CONFIG.description,
		sameAs: SITE_CONFIG.sameAs,
	}
}

/**
 * WebSite schema — enables Sitelinks Search Box in Google.
 * @see https://schema.org/WebSite
 */
export function buildWebSiteSchema(origin: string) {
	const url = origin || SITE_CONFIG.url
	return {
		'@context': 'https://schema.org' as const,
		'@type': 'WebSite' as const,
		name: SITE_CONFIG.name,
		url,
		description: SITE_CONFIG.description,
		inLanguage: SITE_CONFIG.lang,
	}
}

/**
 * FAQPage schema — generates expandable Q&A rich results in Google.
 * @see https://schema.org/FAQPage
 */
export function buildFAQSchema(items: { question: string; answer: string }[]) {
	return {
		'@context': 'https://schema.org' as const,
		'@type': 'FAQPage' as const,
		mainEntity: items.map((item) => ({
			'@type': 'Question' as const,
			name: item.question,
			acceptedAnswer: {
				'@type': 'Answer' as const,
				text: item.answer,
			},
		})),
	}
}

/**
 * BreadcrumbList schema — helps Google understand site hierarchy.
 * @see https://schema.org/BreadcrumbList
 */
export function buildBreadcrumbSchema(origin: string, items: { name: string; path: string }[]) {
	const url = origin || SITE_CONFIG.url
	return {
		'@context': 'https://schema.org' as const,
		'@type': 'BreadcrumbList' as const,
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem' as const,
			position: index + 1,
			name: item.name,
			item: `${url}${item.path}`,
		})),
	}
}
