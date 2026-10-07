import { isbot } from 'isbot'
import { renderToReadableStream } from 'react-dom/server'
import type { EntryContext } from 'react-router'
import { ServerRouter } from 'react-router'
import { generateNonce, getContentSecurityPolicy } from '@/utils/csp.server'
import { NonceProvider } from '@/utils/nonce-provider'

const MODE = process.env.NODE_ENV ?? 'development'

export default async function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	routerContext: EntryContext
) {
	const userAgent = request.headers.get('user-agent')
	const isBot = isbot(userAgent || '')

	const nonce = generateNonce()
	responseHeaders.set(
		'Content-Security-Policy',
		getContentSecurityPolicy(nonce, MODE !== 'production')
	)

	if (MODE === 'production') {
		responseHeaders.append('Document-Policy', 'js-profiling')
	}

	let didError = false

	const stream = await renderToReadableStream(
		<NonceProvider value={nonce}>
			<ServerRouter context={routerContext} url={request.url} nonce={nonce} />
		</NonceProvider>,
		{
			nonce,
			signal: request.signal,
			onError(_error: unknown) {
				didError = true
			},
		}
	)

	if (isBot) {
		await stream.allReady
	} else {
		responseHeaders.set('Transfer-Encoding', 'chunked')
	}

	responseHeaders.set('Content-Type', 'text/html; charset=utf-8')

	return new Response(stream, {
		headers: responseHeaders,
		status: didError ? 500 : responseStatusCode,
	})
}
