import { z } from 'zod'

import {
	EmailSchema,
	FirstNameSchema,
	LastNameSchema,
	PasswordSchema,
} from '@/features/user/schemas'

const email = z
	.string({ required_error: 'El email es obligatorio' })
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
	password: z
		.string({ required_error: 'La contraseña es obligatoria' })
		.min(1, 'Introduce tu contraseña'),
	remember: z.boolean().optional(),
})

export const PasswordAndConfirmPasswordSchema = z
	.object({ password: PasswordSchema, confirmPassword: PasswordSchema })
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				path: ['confirmPassword'],
				code: 'custom',
				message: 'The passwords must match',
			})
		}
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
