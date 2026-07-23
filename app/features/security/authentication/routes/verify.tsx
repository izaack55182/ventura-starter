// CORE

import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Form, href, Link, useActionData, useSearchParams } from 'react-router'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
// UTILS
import { z } from 'zod'
import { GeneralErrorBoundary } from '@/components/error-boundary'
import { OTPField } from '@/components/form-field/otp'
import { buttonVariants } from '@/components/ui/button'
// COMPONENTS
import { FormContent, FormErrors, FormFooter, FormRow } from '@/components/ui/form'
import { Icon } from '@/components/ui/icon'
import { StatusButton } from '@/components/ui/status-button'
import type { Route } from '@/rr/features/security/authentication/routes/+types/verify'
import { checkHoneypot } from '@/utils/honeypot.server'
import { useIsPending } from '@/utils/misc'
// QUERIES
import { validateRequest } from '../server/verify.server'
export const codeQueryParam = 'code'
export const targetQueryParam = 'target'
export const typeQueryParam = 'type'
export const redirectToQueryParam = 'redirectTo'
const types = ['onboarding', 'reset-password', 'change-email', '2fa'] as const
const VerificationTypeSchema = z.enum(types)
export type VerificationTypes = z.infer<typeof VerificationTypeSchema>

export const VerifySchema = z.object({
	[codeQueryParam]: z.string().min(6).max(6),
	[typeQueryParam]: VerificationTypeSchema,
	[targetQueryParam]: z.string(),
	[redirectToQueryParam]: z.string().optional(),
})

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData()
	await checkHoneypot(formData)
	return validateRequest(request, formData)
}

export default function VerifyRoute() {
	const actionData = useActionData<typeof action>()
	const [searchParams] = useSearchParams()
	const isPending = useIsPending()
	const parseWithZodType = VerificationTypeSchema.safeParse(searchParams.get(typeQueryParam))
	const type = parseWithZodType.success ? parseWithZodType.data : null

	const checkEmail = (
		<div className="text-center">
			<h1 className="text-2xl font-semibold tracking-tight">{'Check your email'}</h1>
			<p className="text-sm text-muted-foreground mt-2">
				{'We have sent you a code to verify your email address.'}
			</p>
		</div>
	)

	const checkPhone = (
		<div className="text-center">
			<h1 className="text-2xl font-semibold tracking-tight">{'Check your phone'}</h1>
			<p className="text-sm text-muted-foreground mt-2">
				{'We have sent you a code to verify your phone number.'}
			</p>
		</div>
	)

	const headings: Record<VerificationTypes, React.ReactNode> = {
		onboarding: checkPhone,
		'reset-password': checkEmail,
		'change-email': checkEmail,
		'2fa': (
			<div className="text-center">
				<h1 className="text-2xl font-semibold tracking-tight">{'Check your 2FA app'}</h1>
				<p className="text-sm text-muted-foreground mt-2">
					{'Please enter your 2FA code to verify your identity.'}
				</p>
			</div>
		),
	}

	const [form, fields] = useForm({
		id: 'verify-form',
		constraint: getZodConstraint(VerifySchema),
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: VerifySchema })
		},
		lastResult: actionData?.result,
		defaultValue: {
			code: searchParams.get(codeQueryParam),
			type: type,
			target: searchParams.get(targetQueryParam),
			redirectTo: searchParams.get(redirectToQueryParam),
		},
	})

	return (
		<div className="flex flex-col justify-center">
			{type ? (
				headings[type]
			) : (
				<div className="text-center">
					<h1 className="text-2xl font-semibold tracking-tight">{'Invalid Verification Type'}</h1>
				</div>
			)}
			<div className="mx-auto mt-6 w-full max-w-sm">
				<Form method="POST" {...getFormProps(form)}>
					<FormContent>
						<FormRow>
							<OTPField
								meta={fields[codeQueryParam]}
								labelProps={{
									children: 'Code',
								}}
								inputProps={{
									...getInputProps(fields[codeQueryParam], { type: 'text' }),
									autoComplete: 'one-time-code',
									autoFocus: true,
								}}
								className="items-center"
							/>
						</FormRow>
					</FormContent>
					<FormErrors errors={form.allErrors} />
					<div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
						<HoneypotInputs />
						<input {...getInputProps(fields[typeQueryParam], { type: 'hidden' })} />
						<input
							{...getInputProps(fields[targetQueryParam], {
								type: 'hidden',
							})}
						/>
						<input
							{...getInputProps(fields[redirectToQueryParam], {
								type: 'hidden',
							})}
						/>
						<Link
							to={{
								pathname: href('/signup'),
								search: searchParams.toString(),
							}}
							className={buttonVariants({ variant: 'ghost' })}
						>
							<Icon name="arrow-left" className="mr-2" />
							{'Request new code'}
						</Link>
						<StatusButton
							className="w-full sm:w-auto min-w-[120px]"
							status={isPending ? 'pending' : (form.status ?? 'idle')}
							type="submit"
							disabled={isPending}
						>
							<Icon name="shield-check" className="mr-2" />
							{'Verify'}
						</StatusButton>
					</div>
				</Form>
			</div>
		</div>
	)
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
