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
// UTILS
import { ClientHintCheck, getHints } from '@/utils/client-hints'
import { getColorScheme } from '@/utils/color-scheme.server'
import { combineHeaders, createDomain, getMeta } from '@/utils/misc'
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
import { useOptionalTheme } from './routes/resource/color-scheme'
import fontStyleSheetUrl from './styles/font.css?url'
import tailwindStyleSheetUrl from './styles/tailwind.css?url'

export const meta: MetaFunction<typeof loader> = ({ data, matches }) => {
	return getMeta({
		title: data?.meta?.title ?? data?.meta?.error,
		description: data?.meta?.description,
		origin: data?.origin,
		matches: matches as any,
	})
}

export const links: Route.LinksFunction = () => {
	return [
		{ rel: 'preload', href: iconsHref, as: 'image' },
		{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
		{ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' as const },
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

	const hints = getHints(request)
	const colorScheme = await getColorScheme(request)
	const origin = createDomain(request)

	const title = SITE_CONFIG.name
	const description = SITE_CONFIG.description
	const error = `Error | ${SITE_CONFIG.name}`

	// Resuelve 'system' → tema real usando el hint del OS
	const theme = colorScheme === 'system' ? hints.theme : colorScheme

	// Props del honeypot (campos trampa + timestamp cifrado) para los formularios.
	const honeyProps = await getHoneypot().getInputProps()
	const { toast, headers: toastHeaders } = await getToast(request)

	return data(
		{
			meta: { title, description, error },
			requestInfo: {
				hints,
				userPrefs: { colorScheme },
			},
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
	// Opcional: si el loader raíz falló no hay preferencia; el script de abajo
	// resuelve el tema desde el SO para que la página de error no salga en blanco.
	colorScheme?: string
	env?: Record<string, string | undefined>
	allowIndexing?: boolean
	/** Request origin (protocol + host) for structured data URLs */
	origin?: string
}) {
	// Nonce CSP de esta petición (vacío en cliente; el navegador lo elimina del DOM).
	const nonce = useNonce()
	return (
		<html lang={SITE_CONFIG.lang} className={colorScheme} suppressHydrationWarning={true}>
			<head>
				{/* Fallback de tema: si <html> no trae clase light/dark (caso de
				    ErrorBoundary con loader raíz caído), restaura la preferencia desde
				    localStorage —escrito por App— y, solo si no existe, cae al SO. Así
				    respeta la elección explícita del usuario. En el camino normal no
				    hace nada porque la clase ya viene del SSR. */}
				<script
					nonce={nonce}
					// biome-ignore lint/security/noDangerouslySetInnerHtml: script anti-FOUC inline
					dangerouslySetInnerHTML={{
						__html: `(function(){try{var e=document.documentElement;if(e.classList.contains('dark')||e.classList.contains('light'))return;var v=localStorage.getItem('theme');if(v!=='light'&&v!=='dark'){v=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}e.classList.add(v)}catch(_){}})()`,
					}}
				/>
				<ClientHintCheck nonce={nonce} />
				<Meta />
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				{allowIndexing ? null : <meta name="robots" content="noindex, nofollow" />}

				{/* ── SEO: theme-color (PWA + browser chrome) ── */}
				<meta
					name="theme-color"
					content={SITE_CONFIG.themeColor}
					media="(prefers-color-scheme: dark)"
				/>
				<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />

				{/* ── SEO: hreflang (señal de idioma para Google) ── */}
				{origin && (
					<>
						<link rel="alternate" hrefLang={SITE_CONFIG.lang} href={origin} />
						<link rel="alternate" hrefLang="x-default" href={origin} />
					</>
				)}

				{/* ── SEO: JSON-LD Structured Data (Organization + WebSite) ── */}
				{origin && (
					<>
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

/**
 * `Layout` envuelve TANTO al componente normal (`App`) COMO al `ErrorBoundary`.
 * Por eso el shell del documento (html/head/Links/Scripts) vive aquí: garantiza
 * que la página de error también se renderice con CSS y JS, no como un div pelado.
 *
 * Usa hooks "opcionales" porque, dentro del ErrorBoundary, el loader raíz puede
 * no tener datos (data?.ENV → undefined; useOptionalTheme → fallback 'light').
 */
export function Layout({ children }: { children: React.ReactNode }) {
	const data = useRouteLoaderData<typeof loader>('root')
	const theme = useOptionalTheme()
	const allowIndexing = data?.ENV?.ALLOW_INDEXING !== 'false'

	// Si el loader raíz falló (data === undefined) no conocemos la preferencia, así
	// que NO forzamos una clase: dejamos que el script inline la resuelva desde el SO.
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

	// Espejo del tema resuelto en localStorage. Es la fuente que lee el script
	// inline del <head> para restaurar la preferencia cuando el loader raíz cae
	// (su cookie es httpOnly y el cliente no puede leerla directamente).
	useEffect(() => {
		try {
			localStorage.setItem('theme', theme)
		} catch {}
	}, [theme])

	// HoneypotProvider expone los honeyProps a cualquier <HoneypotInputs /> que
	// rendericen los formularios de la app (debajo de <Outlet />).
	return (
		<HoneypotProvider {...honeyProps}>
			<Outlet />
			<EpicToaster toast={loaderData.toast} />
			<EpicProgress />
		</HoneypotProvider>
	)
}

/**
 * Boundary raíz. Reutiliza las páginas pulidas 404/500 según el tipo de error.
 * El shell HTML lo aporta `Layout`, así que aquí solo devolvemos el contenido.
 */
export function ErrorBoundary() {
	const error = useRouteError()

	if (isRouteErrorResponse(error) && error.status === 404) {
		return <NotFound />
	}

	return <ServerError />
}
