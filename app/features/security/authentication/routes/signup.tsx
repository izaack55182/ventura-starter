import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import type { SEOHandle } from '@nasa-gcn/remix-seo'
import * as E from '@react-email/components'
import { data, Form, redirect, useSearchParams } from 'react-router'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { z } from 'zod'
import { GeneralErrorBoundary } from '@/components/error-boundary'
import { ErrorList, Field } from '@/components/forms'
import { StatusButton } from '@/components/ui/status-button'
import { sendEmail } from '@/features/communication/server/email'
import { requireAnonymous } from '@/features/security/authentication/server/auth.server'
import { prepareVerification } from '@/features/security/authentication/server/verify.server'
import {
	ProviderConnectionForm,
	providerNames,
} from '@/features/security/authentication/utils/connections'
import { EmailSchema } from '@/features/user/schemas'
import type { Route } from '@/rr/features/security/authentication/routes/+types/signup'
import { db } from '@/utils/db.server'
import { checkHoneypot } from '@/utils/honeypot.server'
import { useIsPending } from '@/utils/misc'

export const handle: SEOHandle = {
	getSitemapEntries: () => null,
}

const SignupSchema = z.object({
	email: EmailSchema,
})

export async function loader({ request }: Route.LoaderArgs) {
	await requireAnonymous(request)
	return null
}

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData()

	await checkHoneypot(formData)

	const submission = await parseWithZod(formData, {
		schema: SignupSchema.superRefine(async (data, ctx) => {
			const existingUser = await db.query.user.findFirst({
				where: (user, { eq }) => eq(user.email, data.email),
				columns: { id: true },
			})
			if (existingUser) {
				ctx.addIssue({
					path: ['email'],
					code: z.ZodIssueCode.custom,
					message: 'A user already exists with this email',
				})
				return
			}
		}),
		async: true,
	})
	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 }
		)
	}
	const { email } = submission.value
	const { verifyUrl, redirectTo, otp } = await prepareVerification({
		period: 10 * 60,
		request,
		type: 'onboarding',
		target: email,
	})

	const response = await sendEmail({
		to: email,
		subject: `Welcome to Epic Notes!`,
		react: <SignupEmail onboardingUrl={verifyUrl.toString()} otp={otp} />,
	})

	if (response.status === 'success') {
		return redirect(redirectTo.toString())
	} else {
		return data(
			{
				result: submission.reply({ formErrors: [response.error.message] }),
			},
			{
				status: 500,
			}
		)
	}
}

export function SignupEmail({ onboardingUrl, otp }: { onboardingUrl: string; otp: string }) {
	return (
		<E.Html lang="en" dir="ltr">
			<E.Container>
				<h1>
					<E.Text>Welcome to Epic Notes!</E.Text>
				</h1>
				<p>
					<E.Text>
						Here's your verification code: <strong>{otp}</strong>
					</E.Text>
				</p>
				<p>
					<E.Text>Or click the link to get started:</E.Text>
				</p>
				<E.Link href={onboardingUrl}>{onboardingUrl}</E.Link>
			</E.Container>
		</E.Html>
	)
}

export const meta: Route.MetaFunction = () => {
	return [{ title: 'Sign Up | Epic Notes' }]
}

export default function SignupRoute({ actionData }: Route.ComponentProps) {
	const isPending = useIsPending()
	const [searchParams] = useSearchParams()
	const redirectTo = searchParams.get('redirectTo')

	const [form, fields] = useForm({
		id: 'signup-form',
		constraint: getZodConstraint(SignupSchema),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			const result = parseWithZod(formData, { schema: SignupSchema })
			return result
		},
		shouldRevalidate: 'onBlur',
	})

	return (
		<div className="flex flex-col justify-center">
			<div className="text-center">
				<h1 className="text-2xl font-semibold tracking-tight">Let's start your journey!</h1>
				<p className="text-sm text-muted-foreground mt-2">Please enter your email.</p>
			</div>
			<div className="mx-auto mt-6 w-full max-w-sm">
				<Form method="POST" {...getFormProps(form)}>
					<HoneypotInputs />
					<Field
						labelProps={{
							htmlFor: fields.email.id,
							children: 'Email',
						}}
						inputProps={{
							...getInputProps(fields.email, { type: 'email' }),
							autoFocus: true,
							autoComplete: 'email',
						}}
						errors={fields.email.errors}
					/>
					<ErrorList errors={form.errors} id={form.errorId} />
					<StatusButton
						className="w-full"
						status={isPending ? 'pending' : (form.status ?? 'idle')}
						type="submit"
						disabled={isPending}
					>
						Submit
					</StatusButton>
				</Form>
				<ul className="flex flex-col gap-4 py-4">
					{providerNames.map((providerName) => (
						<div key={providerName} className="flex flex-col gap-4">
							<hr />
							<li>
								<ProviderConnectionForm
									type="Signup"
									providerName={providerName}
									redirectTo={redirectTo}
								/>
							</li>
						</div>
					))}
				</ul>
			</div>
		</div>
	)
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
