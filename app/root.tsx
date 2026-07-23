import { useEffect } from 'react'
import {
	data,
	isRouteErrorResponse,
	Links,
	Meta,
	type MetaFunction,
	Outlet,
	Scripts,
	ScrollRestoration,
	useRouteError,
	useRouteLoaderData,
} from 'react-router'
import { HoneypotProvider } from 'remix-utils/honeypot/react'
import { SITE_CONFIG } from '@/config/site'
import { getUserId, logout } from '@/features/security/authentication/server/auth.server'
import { getRootUser } from '@/features/user/server/queries'
// UTILS
import { ClientHintCheck, getHints } from '@/utils/client-hints'
import { getColorScheme } from '@/utils/color-scheme.server'
import { combineHeaders, createDomain, getDomainUrl, getMeta } from '@/utils/misc'
import { useNonce } from '@/utils/nonce-provider'
import { buildOrganizationSchema, buildWebSiteSchema, JsonLd } from '@/utils/seo/json-ld'
// COMPONENTS
import { EpicProgress } from './components/epic-progress'
import { EpicToaster } from './components/epic-toaster'
import { getHoneypot } from './utils/honeypot.server.ts'
import { getServerTimeHeader, makeTimings } from './utils/timing.server'
import { getToast } from './utils/toast.server'

const iconsHref = '/icons/sprite.svg'

import appleTouchIconAssetUrl from '/favicons/apple-touch-icon.png'
import faviconAssetUrl from '/favicons/favicon.png'
// CORE
import type { Route } from './+types/root'
import NotFound from './routes/404'
import ServerError from './routes/500'
// ROUTES
import { useOptionalTheme } from './routes/resource/color-scheme.tsx'
import fontStyleSheetUrl from './styles/font.css?url'
import tailwindStyleSheetUrl from './styles/tailwind.css?url'

export const meta: Route.MetaFunction = ({ data }) => {
	return [
		{ title: data ? 'Ventura Notes' : 'Error | Ventura Notes' },
		{ name: 'description', content: `Your own captain's log` },
	]
}

export const links: Route.LinksFunction = () => {
	return [
		{ rel: 'preload', href: iconsHref, as: 'image' },
		{ rel: 'icon', href: '/favicons/favicon.ico', sizes: '48x48' },
		{ rel: 'apple-touch-icon', href: appleTouchIconAssetUrl },
		{ rel: 'manifest', href: '/site.webmanifest', crossOrigin: 'use-credentials' } as const,
		{ rel: 'icon', type: 'image/svg+xml', href: faviconAssetUrl },
		{ rel: 'stylesheet', href: tailwindStyleSheetUrl },
		{ rel: 'stylesheet', href: fontStyleSheetUrl },
	].filter(Boolean)
}

export async function loader({ request }: Route.LoaderArgs) {
	const timing = makeTimings('root loader')

	const userId = await getUserId(request)
	const user = userId ? await getRootUser(userId) : null

	const hints = getHints(request)
	const colorScheme = await getColorScheme(request)
	const origin = createDomain(request)

	const title = SITE_CONFIG.name
	const description = SITE_CONFIG.description
	const error = `Error | ${SITE_CONFIG.name}`

	const theme = colorScheme === 'system' ? hints.theme : colorScheme

	if (userId && !user) {
		console.info('something weird happened')
		// something weird happened... The user is authenticated but we can't find
		// them in the database. Maybe they were deleted? Let's log them out.
		await logout({ request, redirectTo: '/' })
	}
	const honeyProps = await getHoneypot().getInputProps()
	const { toast, headers: toastHeaders } = await getToast(request)

	return data(
		{
			user,
			requestInfo: {
				hints,
				origin: getDomainUrl(request),
				userPrefs: { colorScheme },
			},
			meta: { title, description, error },

			theme,
			toast,
			origin,
			honeyProps,
			ENV: {
				ALLOW_INDEXING:
					(typeof process !== 'undefined' ? process.env.ALLOW_INDEXING : undefined) || 'true',
			},
		},
		{
			headers: combineHeaders(toastHeaders, { 'Server-Timing': getServerTimeHeader(timing) }),
		}
	)
}

/**
 * Wrapper for the entire HTML document.
 */
function Document({
	children,
	colorScheme,
	env = {},
	allowIndexing = true,
	origin = '',
}: {
	children: React.ReactNode
	colorScheme?: string
	env?: Record<string, string | undefined>
	allowIndexing?: boolean
	origin?: string
}) {
	const nonce = useNonce()
	return (
		<html
			lang={SITE_CONFIG.lang}
			className={`${colorScheme} h-full overflow-x-hidden`}
			suppressHydrationWarning={true}
		>
			<head>
				<ClientHintCheck nonce={nonce} />
				<Meta />
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				{allowIndexing ? null : <meta name="robots" content="noindex, nofollow" />}

				<meta
					name="theme-color"
					content={SITE_CONFIG.themeColor}
					media="(prefers-color-scheme: dark)"
				/>
				<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
				{origin && (
					<>
						<link rel="alternate" hrefLang={SITE_CONFIG.lang} href={origin} />
						<link rel="alternate" hrefLang="x-default" href={origin} />
						<JsonLd data={buildOrganizationSchema(origin)} />
						<JsonLd data={buildWebSiteSchema(origin)} />
					</>
				)}

				<Links />
			</head>
			<body className="bg-background text-foreground">
				{children}
				<script
					nonce={nonce}
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(env)}`,
					}}
				/>
				<ScrollRestoration nonce={nonce} />
				<Scripts nonce={nonce} />
			</body>
		</html>
	)
}

export function Layout({ children }: { children: React.ReactNode }) {
	const data = useRouteLoaderData<typeof loader>('root')
	const theme = useOptionalTheme()
	const allowIndexing = data?.ENV?.ALLOW_INDEXING !== 'false'
	const colorScheme = data ? theme : undefined

	return (
		<Document
			env={data?.ENV}
			colorScheme={colorScheme}
			allowIndexing={allowIndexing}
			origin={data?.origin}
		>
			{children}
		</Document>
	)
}

export default function App({ loaderData }: Route.ComponentProps) {
	const theme = useOptionalTheme()
	const { honeyProps } = loaderData

	useEffect(() => {
		try {
			localStorage.setItem('theme', theme)
		} catch {}
	}, [theme])

	return (
		<HoneypotProvider {...honeyProps}>
			<Outlet />
			<EpicToaster toast={loaderData.toast} />
			<EpicProgress />
		</HoneypotProvider>
	)
}

export function ErrorBoundary() {
	const error = useRouteError()

	if (isRouteErrorResponse(error) && error.status === 404) {
		return <NotFound />
	}

	return <ServerError />
}
