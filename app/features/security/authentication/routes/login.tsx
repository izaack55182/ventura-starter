import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { startAuthentication } from '@simplewebauthn/browser'
import { useOptimistic, useState, useTransition } from 'react'
import { data, Form, Link, useNavigate, useSearchParams } from 'react-router'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { z } from 'zod'
import { GeneralErrorBoundary } from '@/components/error-boundary'
import { CheckboxField, ErrorList, Field } from '@/components/forms.tsx'
import { Icon } from '@/components/ui/icon'
import { StatusButton } from '@/components/ui/status-button'
import { handleNewSession } from '@/features/security/authentication/server/login.server.ts'
import { PasswordSchema, UserNameSchema } from '@/features/user/schemas'
import type { Route } from '@/rr/features/security/authentication/routes/+types/login.ts'
import { checkHoneypot } from '@/utils/honeypot.server.ts'
import { getErrorMessage, useIsPending } from '@/utils/misc'
import { login, requireAnonymous } from '../server/auth.server.ts'
import { ProviderConnectionForm, providerNames } from '../utils/connections.tsx'

const LoginFormSchema = z.object({
	username: UserNameSchema,
	password: PasswordSchema,
	redirectTo: z.string().optional(),
})

export async function loader({ request }: Route.LoaderArgs) {
	await requireAnonymous(request)
	return {}
}

export async function action({ request }: Route.ActionArgs) {
	await requireAnonymous(request)
	const formData = await request.formData()
	await checkHoneypot(formData)
	const submission = await parseWithZod(formData, {
		schema: (intent) =>
			LoginFormSchema.transform(async (data, ctx) => {
				if (intent !== null) return { ...data, session: null }

				const session = await login(data)
				if (!session) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Credenciales Invalidas',
					})
					return z.NEVER
				}

				return { ...data, session }
			}),
		async: true,
	})

	if (submission.status !== 'success' || !submission.value.session) {
		return data(
			{ result: submission.reply({ hideFields: ['password'] }) },
			{ status: submission.status === 'error' ? 400 : 200 }
		)
	}

	const { session, redirectTo } = submission.value

	return handleNewSession({
		request,
		session,
		redirectTo,
	})
}
const AuthenticationOptionsSchema = z.object({
	options: z.object({ challenge: z.string() }),
}) satisfies z.ZodType<{ options: PublicKeyCredentialRequestOptionsJSON }>

export default function LoginPage({ actionData }: Route.ComponentProps) {
	const isPending = useIsPending()
	const [searchParams] = useSearchParams()
	const redirectTo = searchParams.get('redirectTo')

	const [form, fields] = useForm({
		id: 'login-form',
		constraint: getZodConstraint(LoginFormSchema),
		defaultValue: { redirectTo },
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: LoginFormSchema })
		},
		shouldRevalidate: 'onBlur',
	})

	return (
		<div className="flex flex-col justify-center">
			<div className="mx-auto w-full max-w-sm">
				<div>
					<div className="mx-auto w-full max-w-md px-8">
						<Form method="POST" {...getFormProps(form)}>
							<HoneypotInputs />
							<Field
								labelProps={{ children: 'Username', className: 'sr-only' }}
								inputProps={{
									...getInputProps(fields.username, { type: 'text' }),
									autoFocus: true,
									className: 'lowercase',
									autoComplete: 'Username',
									placeholder: 'Username',
								}}
								errors={fields.username.errors}
							/>

							<Field
								labelProps={{ children: 'Password', className: 'sr-only' }}
								inputProps={{
									...getInputProps(fields.password, {
										type: 'password',
									}),
									autoComplete: 'current-password',
									placeholder: 'Password',
								}}
								errors={fields.password.errors}
							/>

							<div className="flex justify-between">
								{/* <CheckboxField
                                        labelProps={{
                                            htmlFor: fields.remember.id,
                                            children: 'Remember me',
                                        }}
                                        buttonProps={getInputProps(fields.remember, {
                                            type: 'checkbox',
                                        })}
                                        errors={fields.remember.errors}
                                    /> */}
								<div>
									<Link to="/forgot-password" className="text-body-xs font-semibold">
										Forgot password?
									</Link>
								</div>
							</div>

							<input {...getInputProps(fields.redirectTo, { type: 'hidden' })} />
							<ErrorList errors={form.errors} id={form.errorId} />

							<div className="flex items-center justify-between gap-6 pt-3">
								<StatusButton
									className="w-full"
									status={isPending ? 'pending' : (form.status ?? 'idle')}
									type="submit"
									disabled={isPending}
								>
									Iniciar Sesión
								</StatusButton>
							</div>
						</Form>
						<hr className="my-4" />
						<div className="flex flex-col gap-5">
							<PasskeyLogin redirectTo={redirectTo} />
						</div>
						<hr className="my-4" />
						<ul className="flex flex-col gap-5">
							{providerNames.map((providerName) => (
								<li key={providerName}>
									<ProviderConnectionForm
										type="Login"
										providerName={providerName}
										redirectTo={redirectTo}
									/>
								</li>
							))}
						</ul>
						<div className="flex items-center justify-center gap-2 pt-6">
							<span className="text-muted-foreground">Don't have an account?</span>
							<Link
								to={redirectTo ? `/signup?redirectTo=${encodeURIComponent(redirectTo)}` : '/signup'}
							>
								Sign Up
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const VerificationResponseSchema = z.discriminatedUnion('status', [
	z.object({
		status: z.literal('success'),
		location: z.string(),
	}),
	z.object({
		status: z.literal('error'),
		error: z.string(),
	}),
])
function PasskeyLogin({ redirectTo }: { redirectTo: string | null }) {
	const [isPending] = useTransition()
	const [error, setError] = useState<string | null>(null)
	const [passkeyMessage, setPasskeyMessage] = useOptimistic<string | null>('Login with a passkey')
	const navigate = useNavigate()

	async function handlePasskeyLogin() {
		try {
			setPasskeyMessage('Generating Authentication Options')

			const optionsResponse = await fetch('/webauthn/authentication')
			const json = await optionsResponse.json()
			const { options } = AuthenticationOptionsSchema.parse(json)

			setPasskeyMessage('Requesting your authorization')
			const authResponse = await startAuthentication({ optionsJSON: options })
			setPasskeyMessage('Verifying your passkey')

			const verificationResponse = await fetch('/webauthn/authentication', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ authResponse, redirectTo }),
			})

			const verificationJson = await verificationResponse.json().catch(() => ({
				status: 'error',
				error: 'Unknown error',
			}))

			const parsedResult = VerificationResponseSchema.safeParse(verificationJson)
			if (!parsedResult.success) {
				throw new Error(parsedResult.error.message)
			} else if (parsedResult.data.status === 'error') {
				throw new Error(parsedResult.data.error)
			}
			const { location } = parsedResult.data
			setPasskeyMessage("You're logged in! Navigating...")
			await navigate(location ?? '/')
		} catch (e) {
			const errorMessage = getErrorMessage(e)
			setError(`Failed to authenticate with passkey: ${errorMessage}`)
		}
	}
	return (
		<form action={handlePasskeyLogin}>
			<StatusButton
				id="passkey-login-button"
				aria-describedby="passkey-login-button-error"
				className="w-full"
				variant="outline"
				status={isPending ? 'pending' : error ? 'error' : 'idle'}
				type="submit"
				disabled={isPending}
			>
				<span className="inline-flex items-center gap-1.5">
					<Icon name="passkey" />
					<span>{passkeyMessage}</span>
				</span>
			</StatusButton>
			<div className="mt-2">
				<ErrorList errors={[error]} id="passkey-login-button-error" />
			</div>
		</form>
	)
}

export const meta: Route.MetaFunction = () => {
	return [{ title: 'Login to Ventura' }]
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
