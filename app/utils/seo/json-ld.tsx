import { SITE_CONFIG } from '@/config/site'
import { useNonce } from '@/utils/nonce-provider'

// ─── JSON-LD Component ───────────────────────────────────────────────────────

/**
 * Inyecta un bloque `<script type="application/ld+json">` en el HTML.
 *
 * Uso:
 * ```tsx
 * <JsonLd data={buildOrganizationSchema(origin)} />
 * ```
 *
 * El nonce CSP se inyecta automáticamente desde el NonceProvider.
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

// ─── Schema Builders ─────────────────────────────────────────────────────────

/**
 * Schema `Organization` — identifica la entidad detrás del sitio.
 *
 * Google lo usa para el Knowledge Panel y rich results.
 * Los datos se leen de `SITE_CONFIG`.
 *
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
 * Schema `WebSite` — identifica el sitio web y habilita el Sitelinks
 * Search Box en Google (si tienes search implementado).
 *
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
 * Schema `FAQPage` — genera rich results con preguntas/respuestas
 * expandibles directamente en Google.
 *
 * Se usa junto al componente `<FAQ />` que lo genera automáticamente.
 *
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
 * Schema `BreadcrumbList` — ayuda a Google a entender la jerarquía
 * del sitio y muestra breadcrumbs en los resultados de búsqueda.
 *
 * @see https://schema.org/BreadcrumbList
 *
 * Uso:
 * ```tsx
 * <JsonLd data={buildBreadcrumbSchema(origin, [
 *   { name: 'Inicio', path: '/' },
 *   { name: 'Blog', path: '/blog' },
 *   { name: 'Mi artículo', path: '/blog/mi-articulo' },
 * ])} />
 * ```
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
