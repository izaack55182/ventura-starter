import { expect, test } from '@playwright/test'

test('la home carga correctamente', async ({ page }) => {
	const response = await page.goto('/')
	expect(response?.status()).toBeLessThan(400)
	await expect(page.locator('body')).toBeVisible()
})

test('responde con la cabecera Content-Security-Policy con nonce', async ({ page }) => {
	const response = await page.goto('/')
	const csp = response?.headers()['content-security-policy']
	expect(csp).toBeTruthy()
	expect(csp).toMatch(/script-src[^;]*'nonce-[0-9a-f]{32}'/)
})

test('la página de login renderiza el formulario', async ({ page }) => {
	await page.goto('/login')
	await expect(page.getByLabel('Username')).toBeVisible()
	await expect(page.getByLabel('Password')).toBeVisible()
	await expect(page.getByRole('button', { name: /iniciar sesi/i })).toBeVisible()
})

test('la página de registro renderiza el formulario', async ({ page }) => {
	await page.goto('/signup')
	await expect(page.getByRole('heading', { name: /let's start your journey/i })).toBeVisible()
	await expect(page.getByRole('button', { name: /submit/i })).toBeVisible()
})
