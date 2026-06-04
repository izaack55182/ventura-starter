import { describe, expect, it } from 'vitest'
import { generateNonce, getContentSecurityPolicy } from '@/utils/csp.server'

describe('generateNonce', () => {
	it('genera un nonce hex de 32 caracteres (16 bytes)', () => {
		const nonce = generateNonce()
		expect(nonce).toMatch(/^[0-9a-f]{32}$/)
	})

	it('genera un valor distinto en cada llamada', () => {
		expect(generateNonce()).not.toBe(generateNonce())
	})
})

describe('getContentSecurityPolicy', () => {
	it('incluye el nonce en script-src con strict-dynamic', () => {
		const csp = getContentSecurityPolicy('abc123', false)
		expect(csp).toContain("script-src 'self' 'nonce-abc123' 'strict-dynamic'")
	})

	it('bloquea framing con frame-ancestors none', () => {
		const csp = getContentSecurityPolicy('abc123', false)
		expect(csp).toContain("frame-ancestors 'none'")
		expect(csp).toContain("object-src 'none'")
	})

	it('permite websockets de HMR solo en desarrollo', () => {
		expect(getContentSecurityPolicy('x', true)).toContain("connect-src 'self' ws: wss:")
		expect(getContentSecurityPolicy('x', false)).toContain("connect-src 'self'")
		expect(getContentSecurityPolicy('x', false)).not.toContain('ws:')
	})
})
