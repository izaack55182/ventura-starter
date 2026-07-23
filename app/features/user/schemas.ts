import { z } from 'zod'
import { UserInsertSchema } from '@/drizzle/schema/user'
import { IMG_MAX_SIZE } from '@/utils/misc'
import { INTENT } from './constants'

export const UserNameSchema = z
	.string({ required_error: 'El username es obligatorio' })
	.min(3, { message: 'Username es demasiado corto' })
	.max(20, { message: 'Username es demasiado largo' })
	.regex(/^[a-zA-Z0-9_]+$/, {
		message: 'Username solo puede contener letras, numeros y guiones bajos',
	})
	.transform((value) => value.toLowerCase())

export const NameSchema = z
	.string({ required_error: 'El nombre es obligatorio' })
	.min(1, { message: 'El nombre es demasiado corto' })
	.max(40, { message: 'El nombre es demasiado largo' })

export const FirstNameSchema = z
	.string({ required_error: 'El nombre es obligatorio' })
	.min(1, { message: 'El nombre es demasiado corto' })
	.max(40, { message: 'El nombre es demasiado largo' })

export const LastNameSchema = z
	.string({ required_error: 'El apellido es obligatorio' })
	.min(1, { message: 'El apellido es demasiado corto' })
	.max(40, { message: 'El apellido es demasiado largo' })

export const EmailSchema = z
	.string({ required_error: 'El email es obligatorio' })
	.email({ message: 'El email es invalido' })
	.min(3, { message: 'El email es demasiado corto' })
	.max(100, { message: 'El email es demasiado largo' })
	// users can type the email in any case, but we store it in lowercase
	.transform((value) => value.toLowerCase())

export const PasswordSchema = z
	.string({ required_error: 'La contraseña es obligatoria' })
	.min(6, { message: 'La contraseña es demasiado corta' })
	// NOTE: bcrypt has a limit of 72 bytes (which should be plenty long)
	// https://github.com/epicweb-dev/epic-stack/issues/918
	.max(72, { message: 'La contraseña es demasiado larga' })

export const UserSchema = z.object({
	firstName: FirstNameSchema,
	lastName: LastNameSchema,
	email: EmailSchema,
	imageFile: z
		.instanceof(File)
		.refine((file) => file.size <= IMG_MAX_SIZE, 'El archivo es demasiado grande')
		.optional(),
})

export const AddUserSchema = UserInsertSchema.extend({
	intent: z.literal(INTENT.ADD_USER),

	firstName: z.string(),
	lastName: z.string(),
	email: z.string().email(),
	roleId: z.number().optional(),
})

export const EditUserSchema = UserInsertSchema.pick({
	firstName: true,
	lastName: true,
	username: true,
}).extend({
	intent: z.literal(INTENT.EDIT_USER),
	id: z.number(),
	imageFile: z
		.instanceof(File)
		.refine((file) => file.size <= IMG_MAX_SIZE, 'El archivo es demasiado grande')
		.optional(),
	roleId: z.number().optional(),
})

export const DeleteUserSchema = z.object({
	intent: z.literal(INTENT.DELETE_USER),
	id: z.number(),
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
