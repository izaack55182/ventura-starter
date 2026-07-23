// CORE

import type { Submission } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { createId as cuid } from '@paralleldrive/cuid2'
import { and, eq, gt, isNull, or } from 'drizzle-orm'
import { data, redirect } from 'react-router'
// UTILS
import { z } from 'zod'
import * as schema from '@/drizzle/schema.server'
import type { twoFAVerifyVerificationType } from '@/features/user/routes/two-factor-verify'
import { twoFAVerificationType } from '@/features/user/types'
import { db } from '@/utils/db.server'
import { getDomainUrl } from '@/utils/misc'
import { redirectWithToast } from '@/utils/toast.server'
import { generateTOTP, verifyTOTP } from '@/utils/totp.server'
// TYPES & SCHEMAS
import {
	codeQueryParam,
	redirectToQueryParam,
	targetQueryParam,
	typeQueryParam,
	type VerificationTypes,
	VerifySchema,
} from '../routes/verify'
// QUERIES
import { requireUserId } from './auth.server'
import {
	handleVerification as handleLoginTwoFactorVerification,
	shouldRequestTwoFA,
} from './login.server'
import { handleVerification as handleOnboardingVerification } from './onboarding.server'
import { handleVerification as handleResetPasswordVerification } from './reset-password'

export function getRedirectToUrl({
	request,
	type,
	target,
	redirectTo,
	verifyPath = '/verify',
}: {
	request: Request
	type: VerificationTypes
	target: string
	redirectTo?: string
	verifyPath?: string
}) {
	const redirectToUrl = new URL(`${getDomainUrl(request)}${verifyPath}`)
	redirectToUrl.searchParams.set(typeQueryParam, type)
	redirectToUrl.searchParams.set(targetQueryParam, target)
	if (redirectTo) {
		redirectToUrl.searchParams.set(redirectToQueryParam, redirectTo)
	}
	return redirectToUrl
}

export async function requireRecentVerification(request: Request, verifyPath: string = '/verify') {
	const userId = await requireUserId(request)
	const shouldReverify = await shouldRequestTwoFA(request)
	if (shouldReverify) {
		const reqUrl = new URL(request.url)
		const redirectUrl = getRedirectToUrl({
			request,
			target: String(userId),
			type: twoFAVerificationType,
			redirectTo: reqUrl.pathname + reqUrl.search,
			verifyPath,
		})
		throw redirect(redirectUrl.toString())
	}
}

export async function prepareVerification({
	period,
	request,
	type,
	target,
}: {
	period: number
	request: Request
	type: VerificationTypes
	target: string
}) {
	const verifyUrl = getRedirectToUrl({ request, type, target })
	const redirectTo = new URL(verifyUrl.toString())

	const { otp, ...verificationConfig } = await generateTOTP({
		algorithm: 'SHA-256',
		// Leaving off 0, O, and I on purpose to avoid confusing users.
		charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
		period,
	})
	const verificationData = {
		type,
		target,
		...verificationConfig,
		expiresAt: new Date(Date.now() + verificationConfig.period * 1000), // 10 minutes
	}
	await db
		.insert(schema.verification)
		.values({ ...verificationData, id: cuid() })
		.onConflictDoUpdate({
			target: [schema.verification.target, schema.verification.type],
			set: verificationData,
		})

	// add the otp to the url we'll email the user.
	verifyUrl.searchParams.set(codeQueryParam, otp)

	return { otp, redirectTo, verifyUrl }
}

export type VerifyFunctionArgs = {
	request: Request
	submission: Submission<z.input<typeof VerifySchema>, string[], z.output<typeof VerifySchema>>
	body: FormData | URLSearchParams
}

export async function isCodeValid({
	code,
	type,
	target,
}: {
	code: string
	type: VerificationTypes | typeof twoFAVerifyVerificationType
	target: string
}) {
	const verification = await db.query.verification.findFirst({
		where: and(
			eq(schema.verification.target, target),
			eq(schema.verification.type, type),
			or(gt(schema.verification.expiresAt, new Date()), isNull(schema.verification.expiresAt))
		),
		columns: { algorithm: true, secret: true, period: true, charSet: true },
	})
	if (!verification) return false
	const result = await verifyTOTP({
		otp: code,
		...verification,
	})
	if (!result) return false

	return true
}

export async function validateRequest(request: Request, body: URLSearchParams | FormData) {
	const submission = await parseWithZod(body, {
		schema: () =>
			VerifySchema.superRefine(async (data, ctx) => {
				const codeIsValid = await isCodeValid({
					code: data[codeQueryParam],
					type: data[typeQueryParam],
					target: data[targetQueryParam],
				})
				if (!codeIsValid) {
					ctx.addIssue({
						path: ['code'],
						code: z.ZodIssueCode.custom,
						message: 'Invalid code',
					})
					return
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

	const { value: submissionValue } = submission
	async function deleteVerification() {
		await db
			.delete(schema.verification)
			.where(
				and(
					eq(schema.verification.type, submissionValue[typeQueryParam]),
					eq(schema.verification.target, submissionValue[targetQueryParam])
				)
			)
	}

	switch (submissionValue[typeQueryParam]) {
		case 'reset-password': {
			await deleteVerification()
			return handleResetPasswordVerification(db, { request, body, submission })
		}
		case 'onboarding': {
			await deleteVerification()
			return handleOnboardingVerification({ request, body, submission })
		}
		// case 'change-email': {
		// 	await deleteVerification()
		// 	return handleChangeEmailVerification({ request, body, submission })
		// }
		case '2fa': {
			return handleLoginTwoFactorVerification({ request, body, submission })
		}
	}
}
