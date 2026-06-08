import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Form, Link, type MetaFunction, redirect, useActionData, useNavigation } from 'react-router'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { Button } from '@/components/ui/button'
import { checkHoneypot } from '@/utils/honeypot.server'
import { getMeta } from '@/utils/misc'
import { LoginSchema } from '../schemas'

export const meta: MetaFunction = ({ matches, location }: any) => {
	return getMeta({
		title: 'Acceso',
		description: 'Ingresa a tu cuenta de Ventura Stack.',
		matches,
		pathname: location.pathname,
		noIndex: true,
	})
}

// The 'action' function is automatically picked up by the file-system router
export async function action({ request }: { request: Request }) {
	const formData = await request.formData()
	await checkHoneypot(formData) // lanza 400 si es spam

	const submission = parseWithZod(formData, { schema: LoginSchema })
	if (submission.status !== 'success') {
		// Devuelve los errores (y los valores) al cliente para que Conform los pinte.
		return submission.reply()
	}

	// TODO: validar credenciales reales aquí antes de redirigir
	return redirect('/c/dashboard')
}

export default function Login() {
	const lastResult = useActionData<typeof action>()
	const navigation = useNavigation()
	const isSubmitting = navigation.state !== 'idle'

	const [form, fields] = useForm({
		id: 'login-form',
		constraint: getZodConstraint(LoginSchema),
		lastResult,
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: LoginSchema })
		},
	})

	return (
		<div className="space-y-6">
			<div className="space-y-2 text-center">
				<h1 className="text-3xl font-extrabold tracking-tight text-foreground">Bienvenido</h1>
				<p className="text-sm text-muted-foreground/80">
					Ingresa tus credenciales para acceder al stack
				</p>
			</div>

			<Form method="post" {...getFormProps(form)} className="space-y-4">
				<HoneypotInputs />

				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium leading-none">Password</span>
						<Link
							to="/forgot-password"
							className="text-sm font-medium text-primary hover:underline"
						>
							Forgot password?
						</Link>
					</div>
				</div>

				<ErrorBanner errors={form.errors} />

				<Button type="submit" variant="default" size="lg" disabled={isSubmitting}>
					{isSubmitting ? 'Ingresando…' : 'Sign In'}
				</Button>
			</Form>

			<div className="text-center text-sm text-muted-foreground">
				Don&apos;t have an account?{' '}
				<Link to="/register" className="underline underline-offset-4 hover:text-primary">
					Sign up
				</Link>
			</div>
		</div>
	)
}

function ErrorBanner({ errors }: { errors?: string[] }) {
	if (!errors?.length) return null
	return (
		<p className="text-sm font-medium text-destructive" role="alert">
			{errors.join(', ')}
		</p>
	)
}
