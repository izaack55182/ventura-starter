// CORE

import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Form, useActionData, useSearchParams } from 'react-router'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
// UTILS
import { z } from 'zod'
// COMPONENTS
import { DialogDrawerWrapper } from '@/components/dialog-drawer-wrapper'
import { OTPField } from '@/components/form-field/otp'
import { FormContent, FormErrors, FormRow } from '@/components/ui/form'
import { Icon } from '@/components/ui/icon'
import { StatusButton } from '@/components/ui/status-button'
import {
	codeQueryParam,
	redirectToQueryParam,
	targetQueryParam,
	typeQueryParam,
	type VerificationTypes,
	VerifySchema,
} from '@/features/security/authentication/routes/verify'
// QUERIES
import { validateRequest } from '@/features/security/authentication/server/verify.server'
import { checkHoneypot } from '@/utils/honeypot.server'
import { useIsPending } from '@/utils/misc'
import type { Route } from './+types/profile-verify'

const VerificationTypeSchema = z.enum(['onboarding', 'reset-password', 'change-email', '2fa'])

export const handle = {
	breadcrumb: <Icon name="shield-check">Verificación</Icon>,
}

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData()
	await checkHoneypot(formData)
	return validateRequest(request, formData)
}

export default function ProfileVerifyRoute() {
	const actionData = useActionData<typeof action>()
	const [searchParams] = useSearchParams()
	const isPending = useIsPending()
	const parseWithZodType = VerificationTypeSchema.safeParse(searchParams.get(typeQueryParam))
	const type = parseWithZodType.success ? parseWithZodType.data : null

	const redirectTo = searchParams.get(redirectToQueryParam) || '/profile'

	const [form, fields] = useForm({
		id: 'profile-verify-form',
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

	const headings: Record<VerificationTypes, { title: string; description: string }> = {
		onboarding: {
			title: 'Verifica tu cuenta',
			description: 'Ingresa el código que recibiste para verificar tu cuenta.',
		},
		'reset-password': {
			title: 'Verifica tu email',
			description: 'Ingresa el código que recibiste en tu correo electrónico.',
		},
		'change-email': {
			title: 'Verifica tu email',
			description: 'Ingresa el código que recibiste en tu correo electrónico.',
		},
		'2fa': {
			title: 'Verificación 2FA',
			description: 'Ingresa el código de tu aplicación de autenticación para continuar.',
		},
	}

	const heading = type
		? headings[type]
		: { title: 'Verificación', description: 'Ingresa tu código de verificación.' }

	return (
		<DialogDrawerWrapper
			title={heading.title}
			description={heading.description}
			redirectTo="/profile"
		>
			<Form method="POST" {...getFormProps(form)} className="flex flex-col items-center gap-6">
				<div className="flex items-center gap-3 w-full p-3 bg-muted/50 rounded-lg border border-border/50">
					<Icon name="shield-check" className="size-5 text-primary flex-shrink-0" />
					<p className="text-sm text-muted-foreground leading-relaxed">
						Ingresa el código de 6 dígitos de tu aplicación de autenticación.
					</p>
				</div>

				<OTPField
					meta={fields[codeQueryParam]}
					labelProps={{
						children: 'Código',
					}}
					inputProps={{
						...getInputProps(fields[codeQueryParam], { type: 'text' }),
						autoComplete: 'one-time-code',
						autoFocus: true,
					}}
					className="items-center w-fit mx-auto"
				/>

				<FormErrors errors={form.allErrors} />

				<div className="w-full">
					<HoneypotInputs />
					<input {...getInputProps(fields[typeQueryParam], { type: 'hidden' })} />
					<input {...getInputProps(fields[targetQueryParam], { type: 'hidden' })} />
					<input {...getInputProps(fields[redirectToQueryParam], { type: 'hidden' })} />
					<StatusButton
						className="w-full"
						status={isPending ? 'pending' : (form.status ?? 'idle')}
						type="submit"
						disabled={isPending}
					>
						<Icon name="shield-check" className="mr-2" />
						Verificar
					</StatusButton>
				</div>
			</Form>
		</DialogDrawerWrapper>
	)
}
