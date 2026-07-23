// CORE

import { invariant } from '@epic-web/invariant'

// UTILS
import { eq } from 'drizzle-orm'
import { data, redirect } from 'react-router'
import * as schema from '@/drizzle/schema.server'
import { resetPasswordUsernameSessionKey } from '../routes/reset-password.tsx'
// QUERIES
import { requireAnonymous } from './auth.server'
import { verifySessionStorage } from './verification.server'
import type { VerifyFunctionArgs } from './verify.server'

export async function handleVerification(db: any, { submission }: VerifyFunctionArgs) {
	invariant(submission.status === 'success', 'Submission status must be success')
	const target = submission.value.target
	const user = await db.query.user.findFirst({
		where: (users: any, { eq, or }: any) => or(eq(users.email, target), eq(users.username, target)),
		columns: { email: true, username: true },
	})

	if (!user) {
		return data(
			{
				result: submission.reply({ fieldErrors: { code: ['Invalid Code'] } }),
			},
			{
				status: 400,
			}
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
