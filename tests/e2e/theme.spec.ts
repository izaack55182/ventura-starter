import { expect, test } from '@playwright/test'

test.describe('Theme Switcher', () => {
	test('permite al usuario cambiar el tema visual de la aplicación', async ({ page }) => {
		await page.goto('/')

		// La aplicación guarda el tema en la etiqueta HTML principal
		const html = page.locator('html')

		// Guardamos el tema inicial (puede ser 'light', 'dark' o vacío dependiendo del sistema)
		const initialTheme = await html.getAttribute('class')

		// Buscamos el formulario del botón de cambio de tema.
		// Usamos .first() porque puede estar renderizado tanto en el header como en el menú móvil
		const themeSwitcherForm = page.locator('form[action="/r/color-scheme"]').first()
		const themeButton = themeSwitcherForm.locator('button[type="submit"]')

		// Asegurarnos de que el botón esté visible
		await expect(themeButton).toBeVisible()

		// Hacemos clic para alternar el tema
		await themeButton.click()

		// Esperamos a que la clase del HTML cambie (esto significa que la aplicación reaccionó)
		// Utilizamos una aserción con un timeout automático proporcionado por Playwright
		await expect(html).not.toHaveClass(initialTheme || '')

		// Opcional: Hacer un segundo clic para probar el ciclo completo (system -> light -> dark)
		const secondTheme = await html.getAttribute('class')
		await themeButton.click()
		await expect(html).not.toHaveClass(secondTheme || '')
	})
})
