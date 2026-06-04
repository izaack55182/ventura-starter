import { createRequestHandler } from 'react-router'
import { initEnv } from '@/utils/env.server'
import { getLoadContext } from '../server/context'
import { getLoggedUrl, logEnd, logStart } from './logger'

/**
 * Worker entry nativo (Cloudflare Workers + Static Assets).
 *
 * Reemplaza al despliegue original en Pages. Los assets los sirve la plataforma
 * ANTES que este Worker; aquí solo llegan las rutas/SSR de React Router. Todo el
 * middleware (logger, trailing-slash, rate-limit, secure-headers, noindex) vive
 * en el `fetch()` — es cómputo puro, dentro del free tier.
 */
const requestHandler = createRequestHandler(
	() => import('virtual:react-router/server-build'),
	import.meta.env.MODE
)

// Rutas sensibles → rate limit estricto en mutaciones (y en /verify por el token en query)
const STRICT_PATHS = ['/login', '/signup', '/verify', '/onboarding', '/reset-password']

function applySecurityHeaders(headers: Headers) {
	headers.set('X-Frame-Options', 'DENY')
	headers.set('X-Content-Type-Options', 'nosniff')
	headers.set('X-XSS-Protection', '1; mode=block')
	headers.set('Referrer-Policy', 'same-origin')
	headers.set('X-Powered-By', 'VENTURA')
}

export default {
	async fetch(request, env, _ctx) {
		// 1. Valida el env del runtime (lo consume getServerEnv() durante el SSR)
		const serverEnv = initEnv(env as unknown as Record<string, unknown>)

		const url = new URL(request.url)
		const { pathname, search } = url
		const method = request.method
		const loggedUrl = getLoggedUrl(url)
		const start = Date.now()

		logStart(method, loggedUrl)
		// Cierra el log con el status/duración finales sea cual sea la respuesta.
		const finish = (res: Response) => {
			logEnd(
				method,
				loggedUrl,
				res.status,
				Date.now() - start,
				res.headers.get('Content-Type') || 'unknown'
			)
			return res
		}

		// 2. Trailing slash → redirect 302
		if (pathname.length > 1 && pathname.endsWith('/')) {
			const safePath = pathname.slice(0, -1).replace(/\/+/g, '/')
			return finish(Response.redirect(`${url.origin}${safePath}${search}`, 302))
		}

		// 3. Rate limiting (binding nativo: sin almacenamiento, sin cuota que se agote)
		const ip =
			request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for') ?? 'unknown'
		const isStrict =
			(method !== 'GET' && method !== 'HEAD' && STRICT_PATHS.some((p) => pathname.includes(p))) ||
			pathname.includes('/verify')
		const limiter = isStrict ? env.STRICT_RATE_LIMITER : env.GENERAL_RATE_LIMITER
		if (limiter) {
			const { success } = await limiter.limit({ key: ip })
			if (!success) {
				return finish(new Response('Too Many Requests', { status: 429 }))
			}
		}

		// 4. SSR de React Router
		const response = await requestHandler(request, getLoadContext(env))

		// 5. Headers post-respuesta (solo para HTML)
		if (response.headers.get('Content-Type')?.includes('text/html')) {
			applySecurityHeaders(response.headers)
			if (serverEnv.ALLOW_INDEXING === 'false') {
				response.headers.set('X-Robots-Tag', 'noindex, nofollow')
			}
		}

		return finish(response)
	},
} satisfies ExportedHandler<Env>
