import { expect, test } from '@playwright/test'

test.describe('Middleware & Security', () => {
	test('agrega cabeceras de seguridad en respuestas HTML', async ({ request }) => {
		const response = await request.get('/')

		expect(response.status()).toBe(200)

		// Verificamos que el middleware de app.ts haya inyectado los headers
		const headers = response.headers()
		expect(headers['x-frame-options']).toBe('DENY')
		expect(headers['x-content-type-options']).toBe('nosniff')
		expect(headers['x-xss-protection']).toBe('1; mode=block')
		expect(headers['x-powered-by']).toBe('VENTURA')
	})

	test('redirige las URLs con trailing slash', async ({ request }) => {
		// Petición a /login/ con slash final
		const response = await request.get('/login/', { maxRedirects: 0 })

		// Esperamos que app.ts intercepte y haga un redirect 302 a /login
		expect(response.status()).toBe(302)
		expect(response.headers()['location']).toBe('/login')
	})
})
