// UTILS
import { type ClassValue, clsx } from 'clsx'
import { useState } from 'react'
import { useFormAction, useNavigation } from 'react-router'
import { extendTailwindMerge } from 'tailwind-merge'
import { SITE_CONFIG } from '@/config/site'

// Register the project's custom font-size tokens (see app/styles/tailwind.css)
// so tailwind-merge treats them as part of the `font-size` group and correctly
// dedupes them against Tailwind's built-in sizes (e.g. text-body-2xs vs text-xl).
const twMerge = extendTailwindMerge({
	extend: {
		classGroups: {
			'font-size': [
				{
					text: [
						'mega',
						'h1',
						'h2',
						'h3',
						'h4',
						'h5',
						'h6',
						'body-2xl',
						'body-xl',
						'body-lg',
						'body-md',
						'body-base',
						'body-sm',
						'body-xs',
						'body-2xs',
						'caption',
					],
				},
			],
		},
	},
})
export function getUserImgSrc(objectKey?: string | null) {
	return objectKey
		? `/resources/images?objectKey=${encodeURIComponent(objectKey)}`
		: '/images/avatar/default_avatar.svg'
}

export function getErrorMessage(error: unknown) {
	if (typeof error === 'string') return error
	if (
		error &&
		typeof error === 'object' &&
		'message' in error &&
		typeof error.message === 'string'
	) {
		return error.message
	}
	// biome-ignore lint/suspicious/noConsole: Log errors to console for debugging
	console.error('Unable to get error message for error', error)
	return 'Unknown Error'
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

/**
 * Helper utility used to extract the domain from the request even if it's
 * behind a proxy. This is useful for sitemaps and other things.
 * @param request Request object
 * @returns Current domain
 */
export const createDomain = (request: Request) => {
	const headers = request.headers
	const maybeProto = headers.get('x-forwarded-proto')
	const maybeHost = headers.get('host')
	const url = new URL(request.url)
	// If the request is behind a proxy, we need to use the x-forwarded-proto and host headers
	// to get the correct domain
	if (maybeProto) {
		return `${maybeProto}://${maybeHost ?? url.host}`
	}
	// If we are in local development, return the localhost
	if (url.hostname === 'localhost') {
		return `http://${url.host}`
	}
	// If we are in production, return the production domain
	return `https://${url.host}`
}

export function getDomainUrl(request: Request) {
	const host =
		request.headers.get('X-Forwarded-Host') ??
		request.headers.get('host') ??
		new URL(request.url).host
	const protocol = request.headers.get('X-Forwarded-Proto') ?? 'http'
	return `${protocol}://${host}`
}

/**
 * Combine multiple header objects into one (uses append so headers are not overridden)
 */
export function combineHeaders(...headers: Array<ResponseInit['headers'] | null | undefined>) {
	const combined = new Headers()
	for (const header of headers) {
		if (!header) continue
		for (const [key, value] of new Headers(header).entries()) {
			combined.append(key, value)
		}
	}
	return combined
}
/**
 * Helper utility to generate standardized SEO meta tags.
 *
 * Generates:
 * - `<title>` and `<meta name="description">`
 * - Open Graph: title, description, image, url, type, site_name, locale
 * - Twitter Card: card, title, description, image, site
 * - Canonical link tag (only when origin is available)
 * - Optional `robots: noindex` for private/auth pages
 *
 * All defaults are read from SITE_CONFIG — change the config file
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
	/** Custom OG image path. Defaults to SITE_CONFIG.ogImage */
	image?: string
	/** Open Graph type. Defaults to "website". Use "article" for blog posts. */
	type?: 'website' | 'article'
	noIndex?: boolean
	/** Route matches — used to auto-extract origin from root loader data. */
	matches?: Array<{ id: string; data: any }>
	/** Current pathname (e.g. location.pathname). Used for canonical URL. */
	pathname?: string
}) {
	// ── Read all defaults from the central site config ─────────
	const {
		name: siteName,
		twitterHandle,
		description: defaultDescription,
		ogImage,
		locale,
		url: siteUrl,
	} = SITE_CONFIG

	// Auto-extract origin from root route data if not provided directly
	const rootData = matches?.find((m) => m.id === 'root')?.data
	const effectiveOrigin = origin ?? rootData?.origin ?? ''
	const baseUrl = effectiveOrigin || siteUrl

	const resolvedImage = image ?? ogImage
	const fullTitle = title && title !== siteName ? `${title} — ${siteName}` : siteName
	const fullDescription = description ?? defaultDescription
	const imageUrl = resolvedImage.startsWith('http') ? resolvedImage : `${baseUrl}${resolvedImage}`

	// Resolve page URL: prefer explicit pathname, then path, then base
	const resolvedPath = pathname ?? path
	const pageUrl = resolvedPath ? `${baseUrl}${resolvedPath}` : baseUrl

	const meta: Array<Record<string, string>> = [
		// ── Primary ──────────────────────────────────────────────
		{ title: fullTitle },
		{ name: 'description', content: fullDescription },

		// ── Open Graph ───────────────────────────────────────────
		{ property: 'og:site_name', content: siteName },
		{ property: 'og:title', content: fullTitle },
		{ property: 'og:description', content: fullDescription },
		{ property: 'og:image', content: imageUrl },
		{ property: 'og:image:width', content: '1200' },
		{ property: 'og:image:height', content: '630' },
		{ property: 'og:url', content: pageUrl },
		{ property: 'og:type', content: type },
		{ property: 'og:locale', content: locale },

		// ── Twitter / X ──────────────────────────────────────────
		{ name: 'twitter:card', content: 'summary_large_image' },
		{ name: 'twitter:site', content: twitterHandle },
		{ name: 'twitter:creator', content: twitterHandle },
		{ name: 'twitter:title', content: fullTitle },
		{ name: 'twitter:description', content: fullDescription },
		{ name: 'twitter:image', content: imageUrl },
	]

	// Canonical — only when we have a real origin to build an absolute URL
	if (effectiveOrigin) {
		meta.push({ tagName: 'link', rel: 'canonical', href: pageUrl })
	}

	if (noIndex) {
		meta.push({ name: 'robots', content: 'noindex, nofollow' })
	}

	return meta
}
export function combineResponseInits(...responseInits: Array<ResponseInit | null | undefined>) {
	let combined: ResponseInit = {}
	for (const responseInit of responseInits) {
		combined = {
			...responseInit,
			headers: combineHeaders(combined.headers, responseInit?.headers),
		}
	}
	return combined
}

export function useIsPending({
	formAction,
	formMethod = 'POST',
	state = 'non-idle',
}: {
	formAction?: string
	formMethod?: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'
	state?: 'submitting' | 'loading' | 'non-idle'
} = {}) {
	const contextualFormAction = useFormAction()
	const navigation = useNavigation()
	const isPendingState =
		state === 'non-idle' ? navigation.state !== 'idle' : navigation.state === state
	return (
		isPendingState &&
		navigation.formAction === (formAction ?? contextualFormAction) &&
		navigation.formMethod === formMethod
	)
}
function callAll<Args extends Array<unknown>>(
	...fns: Array<((...args: Args) => unknown) | undefined>
) {
	return (...args: Args) => {
		for (const fn of fns) {
			fn?.(...args)
		}
	}
}

export function useDoubleCheck() {
	const [doubleCheck, setDoubleCheck] = useState(false)

	function getButtonProps(props?: React.ButtonHTMLAttributes<HTMLButtonElement>) {
		const onBlur: React.ButtonHTMLAttributes<HTMLButtonElement>['onBlur'] = () =>
			setDoubleCheck(false)

		const onClick: React.ButtonHTMLAttributes<HTMLButtonElement>['onClick'] = doubleCheck
			? undefined
			: (e) => {
					e.preventDefault()
					setDoubleCheck(true)
				}

		const onKeyUp: React.ButtonHTMLAttributes<HTMLButtonElement>['onKeyUp'] = (e) => {
			if (e.key === 'Escape') {
				setDoubleCheck(false)
			}
		}

		return {
			...props,
			onBlur: callAll(onBlur, props?.onBlur),
			onClick: callAll(onClick, props?.onClick),
			onKeyUp: callAll(onKeyUp, props?.onKeyUp),
		}
	}

	return { doubleCheck, getButtonProps }
}
export const IMG_MAX_SIZE = 1024 * 1024 * 3
