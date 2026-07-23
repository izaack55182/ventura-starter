import { invariant } from '@epic-web/invariant'
import type { Params } from 'react-router'
import { redirect } from 'react-router'
import { z } from 'zod'
import { ProviderNameSchema, providerNames } from '../utils/connections'
import { requireAnonymous } from './auth.server'
import { verifySessionStorage } from './verification.server'
import type { VerifyFunctionArgs } from './verify.server'

export const onboardingEmailSessionKey = 'onboardingEmail'
export const onboardingPhoneSessionKey = 'onboardingPhone'
export const providerIdKey = 'providerId'
export const prefilledProfileKey = 'prefilledProfile'

export async function requireOnboardingEmail({
	request,
	params,
}: {
	request: Request
	params: Params
}) {
	await requireAnonymous(request)
	const verifySession = await verifySessionStorage.getSession(request.headers.get('cookie'))
	const email = verifySession.get(onboardingEmailSessionKey)
	const providerId = verifySession.get(providerIdKey)
	const result = z
		.object({
			email: z.string(),
			providerName: ProviderNameSchema,
			providerId: z.string(),
		})
		.safeParse({ email, providerName: params.provider, providerId })

	if (result.success) {
		return result.data
	}
	throw redirect('/sign-up')
}

export async function handleOnboardingVerification({ submission }: VerifyFunctionArgs) {
	invariant(submission.status === 'success', 'Submission status must be success')
	const verifySession = await verifySessionStorage.getSession()
	verifySession.set(onboardingPhoneSessionKey, submission.value.target)
	return redirect('/onboarding', {
		headers: {
			'set-cookie': await verifySessionStorage.commitSession(verifySession),
		},
	})
}
