import { encodeHexLowerCase } from '@oslojs/encoding'

export function generateNonce(): string {
	const bytes = new Uint8Array(16)
	crypto.getRandomValues(bytes)
	return encodeHexLowerCase(bytes)
}

export function getContentSecurityPolicy(nonce: string, isDev: boolean): string {
	const connectSrc = isDev ? "'self' ws: wss:" : "'self'"

	const directives: Record<string, string> = {
		'default-src': "'self'",
		'script-src': `'self' 'nonce-${nonce}' 'strict-dynamic'`,
		'style-src': "'self' 'unsafe-inline'",
		'img-src': "'self' data: blob:",
		'font-src': "'self'",
		'connect-src': connectSrc,
		'base-uri': "'self'",
		'form-action': "'self'",
		'frame-ancestors': "'none'",
		'object-src': "'none'",
		'upgrade-insecure-requests': '',
	}

	return Object.entries(directives)
		.map(([key, value]) => (value ? `${key} ${value}` : key))
		.join('; ')
}
