import { expect, test } from '@playwright/test'

test.describe('Pruebas de Seguridad - Honeypot', () => {
	test('rechaza el registro si un bot llena el campo honeypot', async ({ page }) => {
		// 1. Vamos a la página de registro
		await page.goto('/signup')

		// 2. Llenamos el correo de forma normal
		await page.getByLabel('Email').fill('bot-malicioso@example.com')

		// 3. Simulamos ser un bot: buscamos el campo oculto "Honeypot" que los humanos no ven
		// La librería siempre envuelve este campo en una clase especial __honeypot_inputs
		// Esto es infalible sin importar si el nombre del input está cifrado o no.
		const honeypotInput = page.locator('.__honeypot_inputs input').first()

		// Inyectamos el valor directamente usando JavaScript (evaluate).
		// No usamos .fill() porque el campo tiene display:none y los navegadores redirigen
		// las pulsaciones de teclado al último campo enfocado (el email).
		await honeypotInput.evaluate((el: HTMLInputElement) => {
			el.value = 'soy un bot maldito'
		})

		// 4. Intentamos enviar el formulario
		await page.getByRole('button', { name: /submit/i }).click()

		// 5. Verificamos que el sistema detectó la trampa y arrojó el error 400 configurado
		// En utils/honeypot.server.ts está configurado para arrojar "Form not submitted properly"
		await expect(page.getByText(/Form not submitted properly/i)).toBeVisible()
	})
})
