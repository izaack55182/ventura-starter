import { describe, expect, it, vi } from 'vitest'

/**
 * Tests para los schema builders de JSON-LD.
 *
 * Importamos las funciones puras (sin JSX) para validar que generan
 * la estructura correcta que Google espera.
 */

// Mock de SITE_CONFIG antes de importar los builders
vi.mock('@/config/site', () => ({
	SITE_CONFIG: {
		name: 'Test Site',
		url: 'https://test.example.com',
		lang: 'es',
		description: 'A test site description',
		logo: '/images/logo/test.svg',
		sameAs: ['https://github.com/test', 'https://twitter.com/test'],
		twitterHandle: '@test',
		ogImage: '/og.png',
		locale: 'es_MX',
		themeColor: '#000000',
	},
}))

// Import AFTER mock
const { buildOrganizationSchema, buildWebSiteSchema, buildFAQSchema, buildBreadcrumbSchema } =
	await import('@/utils/seo/json-ld')

const ORIGIN = 'https://test.example.com'

describe('buildOrganizationSchema', () => {
	it('genera un schema Organization válido', () => {
		const schema = buildOrganizationSchema(ORIGIN)

		expect(schema['@context']).toBe('https://schema.org')
		expect(schema['@type']).toBe('Organization')
		expect(schema.name).toBe('Test Site')
		expect(schema.url).toBe(ORIGIN)
		expect(schema.logo).toBe(`${ORIGIN}/images/logo/test.svg`)
		expect(schema.sameAs).toEqual(['https://github.com/test', 'https://twitter.com/test'])
	})

	it('usa SITE_CONFIG.url como fallback si origin está vacío', () => {
		const schema = buildOrganizationSchema('')
		expect(schema.url).toBe('https://test.example.com')
	})
})

describe('buildWebSiteSchema', () => {
	it('genera un schema WebSite válido', () => {
		const schema = buildWebSiteSchema(ORIGIN)

		expect(schema['@context']).toBe('https://schema.org')
		expect(schema['@type']).toBe('WebSite')
		expect(schema.name).toBe('Test Site')
		expect(schema.url).toBe(ORIGIN)
		expect(schema.inLanguage).toBe('es')
	})
})

describe('buildFAQSchema', () => {
	it('genera un schema FAQPage con las preguntas correctas', () => {
		const items = [
			{ question: '¿Pregunta 1?', answer: 'Respuesta 1' },
			{ question: '¿Pregunta 2?', answer: 'Respuesta 2' },
		]
		const schema = buildFAQSchema(items)

		expect(schema['@context']).toBe('https://schema.org')
		expect(schema['@type']).toBe('FAQPage')
		expect(schema.mainEntity).toHaveLength(2)

		expect(schema.mainEntity![0]!['@type']).toBe('Question')
		expect(schema.mainEntity![0]!.name).toBe('¿Pregunta 1?')
		expect(schema.mainEntity![0]!.acceptedAnswer['@type']).toBe('Answer')
		expect(schema.mainEntity![0]!.acceptedAnswer.text).toBe('Respuesta 1')
	})

	it('genera un array vacío si no hay items', () => {
		const schema = buildFAQSchema([])
		expect(schema.mainEntity).toHaveLength(0)
	})
})

describe('buildBreadcrumbSchema', () => {
	it('genera un schema BreadcrumbList con posiciones correctas', () => {
		const items = [
			{ name: 'Inicio', path: '/' },
			{ name: 'Blog', path: '/blog' },
			{ name: 'Artículo', path: '/blog/articulo' },
		]
		const schema = buildBreadcrumbSchema(ORIGIN, items)

		expect(schema['@context']).toBe('https://schema.org')
		expect(schema['@type']).toBe('BreadcrumbList')
		expect(schema.itemListElement).toHaveLength(3)

		expect(schema.itemListElement![0]!.position).toBe(1)
		expect(schema.itemListElement![0]!.name).toBe('Inicio')
		expect(schema.itemListElement![0]!.item).toBe(`${ORIGIN}/`)

		expect(schema.itemListElement![2]!.position).toBe(3)
		expect(schema.itemListElement![2]!.item).toBe(`${ORIGIN}/blog/articulo`)
	})
})
