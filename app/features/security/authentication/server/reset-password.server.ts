import { invariant } from '@epic-web/invariant'
import { data, redirect } from 'react-router'
import { resetPasswordUsernameSessionKey } from '@/features/security/authentication/routes/reset-password.tsx'
import { verifySessionStorage } from '@/features/security/authentication/server/verification.server'
import { db } from '@/utils/db.server.ts'
import type { VerifyFunctionArgs } from './verify.server.ts'

export async function handleVerification({ submission }: VerifyFunctionArgs) {
	invariant(submission.status === 'success', 'Submission should be successful by now')
	const target = submission.value.target
	const user = await db.query.user.findFirst({
		where: (user, { eq, or }) => or(eq(user.email, target), eq(user.username, target)),
		columns: { email: true, username: true },
	})
	// we don't want to say the user is not found if the email is not found
	// because that would allow an attacker to check if an email is registered
	if (!user) {
		return data(
			{ result: submission.reply({ fieldErrors: { code: ['Invalid code'] } }) },
			{ status: 400 }
		)
	}

	const verifySession = await verifySessionStorage.getSession()
	verifySession.set(resetPasswordUsernameSessionKey, user.username)
	return redirect('/reset-password', {
		headers: {
			'set-cookie': await verifySessionStorage.commitSession(verifySession),
		},
	})
}
