import { invariant } from '@epic-web/invariant'
import { redirect } from 'react-router'
import { onboardingEmailSessionKey } from '@/features/security/authentication/routes/onboarding.tsx'
import { verifySessionStorage } from './verification.server.ts'
import type { VerifyFunctionArgs } from './verify.server.ts'

export async function handleVerification({ submission }: VerifyFunctionArgs) {
	invariant(submission.status === 'success', 'Submission should be successful by now')
	const verifySession = await verifySessionStorage.getSession()
	verifySession.set(onboardingEmailSessionKey, submission.value.target)
	return redirect('/onboarding', {
		headers: {
			'set-cookie': await verifySessionStorage.commitSession(verifySession),
		},
	})
}
