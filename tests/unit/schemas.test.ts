import { describe, expect, it } from 'vitest'
import { LoginSchema, SignupSchema } from '@/features/security/schemas'

describe('LoginSchema', () => {
	it('acepta credenciales válidas y normaliza el email', () => {
		const result = LoginSchema.safeParse({ email: '  USER@Example.com ', password: 'secret' })
		expect(result.success).toBe(true)
		if (result.success) expect(result.data.email).toBe('user@example.com')
	})

	it('rechaza email inválido', () => {
		const result = LoginSchema.safeParse({ email: 'not-an-email', password: 'x' })
		expect(result.success).toBe(false)
	})

	it('rechaza contraseña vacía', () => {
		const result = LoginSchema.safeParse({ email: 'user@example.com', password: '' })
		expect(result.success).toBe(false)
	})
})

describe('SignupSchema', () => {
	it('exige contraseñas coincidentes', () => {
		const result = SignupSchema.safeParse({
			email: 'user@example.com',
			password: 'password123',
			confirmPassword: 'different',
		})
		expect(result.success).toBe(false)
	})

	it('exige longitud mínima de 8 en la contraseña', () => {
		const result = SignupSchema.safeParse({
			email: 'user@example.com',
			password: 'short',
			confirmPassword: 'short',
		})
		expect(result.success).toBe(false)
	})

	it('acepta un registro válido', () => {
		const result = SignupSchema.safeParse({
			email: 'user@example.com',
			password: 'password123',
			confirmPassword: 'password123',
		})
		expect(result.success).toBe(true)
	})
})
