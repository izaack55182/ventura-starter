import { encodeHexLowerCase } from '@oslojs/encoding'

/**
 * Genera un nonce criptográficamente seguro (16 bytes → hex) para la CSP.
 * Usa el `crypto` global del runtime (workerd / navegadores / Node 19+).
 */
export function generateNonce(): string {
	const bytes = new Uint8Array(16)
	crypto.getRandomValues(bytes)
	return encodeHexLowerCase(bytes)
}

/**
 * Construye la cabecera Content-Security-Policy con nonce.
 *
 * - `script-src`: solo 'self' + el nonce de esta petición. `strict-dynamic` permite
 *   que los scripts con nonce carguen a sus dependencias sin listar cada hash.
 * - `style-src`: incluye 'unsafe-inline' porque librerías de UI (motion, recharts,
 *   cobe…) inyectan estilos inline vía atributo `style`, que el nonce no cubre.
 * - `frame-ancestors 'none'`: equivale a X-Frame-Options DENY (anti-clickjacking).
 *
 * En desarrollo se relaja para permitir el WebSocket de HMR de Vite.
 */
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
