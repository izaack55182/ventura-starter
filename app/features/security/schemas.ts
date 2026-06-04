import { z } from 'zod'

const email = z
	.string({ required_error: 'El email es obligatorio' })
	// trim + lowercase ANTES de validar: los transforms nativos de zod se aplican
	// en orden, así que un email con espacios o mayúsculas pasa la validación.
	.trim()
	.toLowerCase()
	.email('Introduce un email válido')
	.max(254, 'El email es demasiado largo')

const password = z
	.string({ required_error: 'La contraseña es obligatoria' })
	.min(8, 'Mínimo 8 caracteres')
	.max(100, 'La contraseña es demasiado larga')

export const LoginSchema = z.object({
	email,
	// En login no exigimos longitud mínima: solo que no esté vacío.
	password: z
		.string({ required_error: 'La contraseña es obligatoria' })
		.min(1, 'Introduce tu contraseña'),
	remember: z.boolean().optional(),
})

export const SignupSchema = z
	.object({
		email,
		password,
		confirmPassword: z.string({ required_error: 'Confirma la contraseña' }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Las contraseñas no coinciden',
		path: ['confirmPassword'],
	})

export type LoginInput = z.infer<typeof LoginSchema>
export type SignupInput = z.infer<typeof SignupSchema>
