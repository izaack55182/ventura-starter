import { expect, test } from '@playwright/test'

test.describe('Passkeys', () => {
	test('la página de passkeys requiere autenticación y redirige al login', async ({ page }) => {
		// Intentamos entrar directamente a la ruta de administración de passkeys sin sesión
		await page.goto('/profile/passkeys')

		// El loader debe detectar que no hay sesión y redirigir al login
		await expect(page).toHaveURL(/.*\/login.*/)
	})
})
