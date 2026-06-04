import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Form, Link, type MetaFunction, redirect, useActionData, useNavigation } from 'react-router'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { Field } from '@/components/forms'
import { Button } from '@/components/ui/button'
import { checkHoneypot } from '@/utils/honeypot.server'
import { getMeta } from '@/utils/misc'
import { SignupSchema } from '../schemas'

export const meta: MetaFunction = ({ matches, location }: any) => {
	return getMeta({
		title: 'Registro',
		description: 'Crea tu cuenta en Ventura Stack.',
		matches,
		pathname: location.pathname,
		noIndex: true,
	})
}

export async function action({ request }: { request: Request }) {
	const formData = await request.formData()
	await checkHoneypot(formData) // lanza 400 si es spam

	const submission = parseWithZod(formData, { schema: SignupSchema })
	if (submission.status !== 'success') {
		return submission.reply()
	}

	// TODO: crear la cuenta real aquí antes de redirigir
	return redirect('/c/dashboard')
}

export default function Register() {
	const lastResult = useActionData<typeof action>()
	const navigation = useNavigation()
	const isSubmitting = navigation.state !== 'idle'

	const [form, fields] = useForm({
		id: 'signup-form',
		constraint: getZodConstraint(SignupSchema),
		lastResult,
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: SignupSchema })
		},
	})

	return (
		<div className="space-y-6">
			<div className="space-y-2 text-center">
				<h1 className="text-3xl font-extrabold tracking-tight text-foreground">Crear cuenta</h1>
				<p className="text-sm text-muted-foreground/80">Empieza a construir tu visión hoy mismo</p>
			</div>

			<Form method="post" {...getFormProps(form)} className="space-y-4">
				<HoneypotInputs />
				<Field
					labelProps={{ children: 'Email' }}
					inputProps={{
						...getInputProps(fields.email, { type: 'email' }),
						placeholder: 'm@example.com',
						autoComplete: 'email',
						autoFocus: true,
					}}
					errors={fields.email.errors}
				/>
				<Field
					labelProps={{ children: 'Password' }}
					inputProps={{
						...getInputProps(fields.password, { type: 'password' }),
						autoComplete: 'new-password',
					}}
					errors={fields.password.errors}
				/>
				<Field
					labelProps={{ children: 'Confirm password' }}
					inputProps={{
						...getInputProps(fields.confirmPassword, { type: 'password' }),
						autoComplete: 'new-password',
					}}
					errors={fields.confirmPassword.errors}
				/>

				<Button
					type="submit"
					variant="default"
					size="lg"
					disabled={isSubmitting}
					className="w-full"
				>
					{isSubmitting ? 'Creando cuenta…' : 'Create account'}
				</Button>
			</Form>

			<div className="text-center text-sm text-muted-foreground">
				Already have an account?{' '}
				<Link to="/login" className="underline underline-offset-4 hover:text-primary">
					Sign in
				</Link>
			</div>
		</div>
	)
}
