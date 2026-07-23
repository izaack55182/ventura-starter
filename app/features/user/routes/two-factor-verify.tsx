// CORE

// UTILS
import { getFormProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { invariant } from '@epic-web/invariant'
import { createId as cuid } from '@paralleldrive/cuid2'
import { and, eq } from 'drizzle-orm'
import * as QRCode from 'qrcode'
import { data, Form, redirect, useActionData, useNavigation } from 'react-router'
import { z } from 'zod'
import { DialogDrawerWrapper } from '@/components/dialog-drawer-wrapper'
import { OTPField } from '@/components/form-field/otp'
import { Button } from '@/components/ui/button'
// COMPONENTS
import { FormErrors } from '@/components/ui/form'
import { StatusButton } from '@/components/ui/status-button'
import * as schema from '@/drizzle/schema.server'
import { requireUserId } from '@/features/security/authentication/server/auth.server'
import { isCodeValid } from '@/features/security/authentication/server/verify.server'
import type { Route } from '@/rr/features/user/routes/+types/two-factor-verify'
import { db } from '@/utils/db.server'
import { getDomainUrl, useIsPending } from '@/utils/misc'
import { redirectWithToast } from '@/utils/toast.server'
// QUERIES
import { generateTOTP, getTOTPAuthUri } from '@/utils/totp.server'

// CONSTANTS
// TYPES

import { Icon } from '@/components/ui/icon'
import { twoFAVerificationType } from '../types'

export const handle = {
	breadcrumb: <Icon name="shield-check">Verificar 2FA</Icon>,
}

const CancelSchema = z.object({ intent: z.literal('cancel') })
const VerifySchema = z.object({
	intent: z.literal('verify'),
	code: z.string().min(6).max(6),
})

const ActionSchema = z.discriminatedUnion('intent', [CancelSchema, VerifySchema])

export const twoFAVerifyVerificationType = '2fa-verify'

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	let verification = await db.query.verification.findFirst({
		where: and(
			eq(schema.verification.type, twoFAVerifyVerificationType),
			eq(schema.verification.target, String(userId))
		),
		columns: {
			id: true,
			algorithm: true,
			secret: true,
			period: true,
			digits: true,
		},
	})
	if (!verification) {
		const { otp: _otp, ...config } = await generateTOTP()
		const verificationData = {
			...config,
			type: twoFAVerifyVerificationType,
			target: String(userId),
		}
		const [newVerification] = await db
			.insert(schema.verification)
			.values({ ...verificationData, id: cuid() })
			.returning({
				id: schema.verification.id,
				algorithm: schema.verification.algorithm,
				secret: schema.verification.secret,
				period: schema.verification.period,
				digits: schema.verification.digits,
			})

		verification = newVerification
	}
	const user = await db.query.user.findFirst({
		where: eq(schema.user.id, userId),
		columns: { email: true },
	})
	invariant(user?.email, 'User email not found')
	invariant(verification?.algorithm, 'Algorithm not found')
	invariant(verification?.secret, 'Secret not found')
	invariant(verification?.period, 'Period not found')
	invariant(verification?.digits, 'Digits not found')

	const issuer = new URL(getDomainUrl(request)).host
	const otpUri = getTOTPAuthUri({
		period: verification.period,
		digits: verification.digits,
		algorithm: verification.algorithm,
		secret: verification.secret,
		accountName: user.email,
		issuer,
	})
	const qrCode = await QRCode.toDataURL(otpUri)
	return { otpUri, qrCode, secret: verification.secret }
}

export async function action({ request }: Route.ActionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()

	const submission = await parseWithZod(formData, {
		schema: () =>
			ActionSchema.superRefine(async (data, ctx) => {
				if (data.intent === 'cancel') return null
				const codeIsValid = await isCodeValid({
					code: data.code,
					type: twoFAVerifyVerificationType,
					target: String(userId),
				})
				if (!codeIsValid) {
					ctx.addIssue({
						path: ['code'],
						code: z.ZodIssueCode.custom,
						message: 'Invalid code',
					})
					return z.NEVER
				}
			}),
		async: true,
	})

	if (submission.status !== 'success') {
		return data(
			{ result: submission.reply() },
			{
				status: submission.status === 'error' ? 400 : 200,
			}
		)
	}

	switch (submission.value.intent) {
		case 'cancel': {
			await db
				.delete(schema.verification)
				.where(
					and(
						eq(schema.verification.type, twoFAVerifyVerificationType),
						eq(schema.verification.target, String(userId))
					)
				)
			return redirect('/profile')
		}
		case 'verify': {
			await db
				.update(schema.verification)
				.set({
					type: twoFAVerificationType,
				})
				.where(
					and(
						eq(schema.verification.type, twoFAVerifyVerificationType),
						eq(schema.verification.target, String(userId))
					)
				)
			return redirectWithToast('/profile', {
				type: 'success',
				title: 'Habilitado',
				description: 'Autenticación de dos factores activada.',
			})
		}
	}
}

export default function TwoFactorVerifyRoute({ loaderData }: Route.ComponentProps) {
	const data = loaderData
	const actionData = useActionData<typeof action>()
	const navigation = useNavigation()

	const isPending = useIsPending()
	const pendingIntent = isPending ? navigation.formData?.get('intent') : null

	const [form, fields] = useForm({
		id: 'verify-form',
		constraint: getZodConstraint(ActionSchema),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: ActionSchema })
		},
	})
	const lastSubmissionIntent = fields.intent.value

	return (
		<DialogDrawerWrapper
			title="Configurar Aplicación de Autenticación"
			description="Escanea el código QR con tu aplicación de autenticación. Ingresa el código de 6 dígitos para finalizar, o copia la clave si no puedes escanearlo."
			redirectTo="/profile"
			noPadding
		>
			<div className="flex flex-col items-center gap-6 p-6">
				{/* QR Code and Secret Card */}
				<div className="flex flex-col items-center gap-4 w-full max-w-sm">
					<div className="flex items-center justify-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-border/50 font-mono text-sm break-all text-center w-full">
						<span className="tracking-widest font-semibold">{data.secret}</span>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => navigator.clipboard.writeText(data.secret)}
							type="button"
						>
							<Icon name="copy" className="h-4 w-4" />
						</Button>
					</div>

					<div className="bg-white p-3 rounded-xl border border-border/50 flex items-center justify-center shadow-xs">
						<img alt="qr code" src={data.qrCode} className="h-44 w-44" />
					</div>
				</div>

				{/* OTP Input Form */}
				<Form method="POST" {...getFormProps(form)} className="flex flex-col gap-6 w-full">
					<button type="submit" name="intent" value="verify" className="sr-only" tabIndex={-1}>
						Verificar
					</button>

					<div className="flex flex-col items-center justify-center w-full">
						<OTPField
							meta={fields.code}
							labelProps={{
								children: 'Código',
								className: 'sr-only',
							}}
							inputProps={{
								autoFocus: true,
								autoComplete: 'one-time-code',
							}}
							className="items-center w-fit mx-auto"
						/>
					</div>

					<div className="min-h-[24px] text-center -my-2">
						<FormErrors errors={form.allErrors} />
					</div>

					{/* Buttons */}
					<div className="flex items-center gap-3 w-full mt-2">
						<StatusButton
							variant="outline"
							status={
								pendingIntent === 'cancel'
									? 'pending'
									: lastSubmissionIntent === 'cancel'
										? (form.status ?? 'idle')
										: 'idle'
							}
							type="submit"
							name="intent"
							value="cancel"
							disabled={isPending}
							className="flex-1 w-full"
						>
							Cancelar
						</StatusButton>

						<StatusButton
							status={
								pendingIntent === 'verify'
									? 'pending'
									: lastSubmissionIntent === 'verify'
										? (form.status ?? 'idle')
										: 'idle'
							}
							type="submit"
							name="intent"
							value="verify"
							disabled={isPending}
							className="flex-1 w-full"
						>
							Configurar Autenticador
						</StatusButton>
					</div>
				</Form>
			</div>
		</DialogDrawerWrapper>
	)
}
