import { invariant } from '@epic-web/invariant'
import { and, eq } from 'drizzle-orm'
import { redirect } from 'react-router'
import { safeRedirect } from 'remix-utils/safe-redirect'
import * as schema from '@/drizzle/schema.server'
import { USER_ROLE } from '@/features/security/access/role/constants'
import { twoFAVerificationType } from '@/features/user/types'
import { db } from '@/utils/db.server'
import { combineHeaders, combineResponseInits } from '@/utils/misc'
import { redirectWithToast } from '@/utils/toast.server'
import { getUserId, sessionKey } from './auth.server'
import { authSessionStorage } from './session.server'
import { verifySessionStorage } from './verification.server'
import { getRedirectToUrl, type VerifyFunctionArgs } from './verify.server.ts'

const verifiedTimeKey = 'verified-time'
const unverifiedSessionIdKey = 'unverified-session-id'

export async function handleNewSession(
	{
		request,
		session,
		redirectTo,
	}: {
		request: Request
		session: { userId: number; id: string; expirationDate: Date }
		redirectTo?: string
	},
	responseInit?: ResponseInit
) {
	const verification = await db.query.verification.findFirst({
		columns: { id: true },
		where: and(
			eq(schema.verification.target, String(session.userId)),
			eq(schema.verification.type, twoFAVerificationType)
		),
	})

	const user = await db.query.user.findFirst({
		where: eq(schema.user.id, session.userId),
		with: {
			roles: {
				columns: {
					roleId: true,
				},
			},
		},
	})

	const isAdmin = user?.roles.some((role: any) => role.roleId === USER_ROLE.ADMIN)
	if (isAdmin) {
		redirectTo = '/a/organizations'
	}
	const userHasTwoFactor = Boolean(verification)

	if (userHasTwoFactor) {
		const verifySession = await verifySessionStorage.getSession()
		verifySession.set(unverifiedSessionIdKey, session.id)
		const redirectUrl = getRedirectToUrl({
			request,
			type: twoFAVerificationType,
			target: String(session.userId),
			redirectTo,
		})
		return redirect(
			`${redirectUrl.pathname}?${redirectUrl.searchParams}`,
			combineResponseInits(
				{
					headers: {
						'set-cookie': await verifySessionStorage.commitSession(verifySession),
					},
				},
				responseInit
			)
		)
	} else {
		const authSession = await authSessionStorage.getSession(request.headers.get('cookie'))
		authSession.set(sessionKey, session.id)
		return redirect(
			safeRedirect(redirectTo),
			combineResponseInits(
				{
					headers: {
						'set-cookie': await authSessionStorage.commitSession(authSession, {
							expires: session.expirationDate,
						}),
					},
				},
				responseInit
			)
		)
	}
	// const organizationId = await getOrganizationId(session.userId)
	// 	const organization = await db.query.company.findFirst({
	// 		where: eq(schema.company.id, organizationId),
	// 		with: {
	// 			subscription: {
	// 				columns: {
	// 					expiresAt: true,
	// 				},
	// 			},
	// 		},
	// 	})
}
export async function handleVerification({ request, submission }: VerifyFunctionArgs) {
	invariant(submission.status === 'success', 'Submission should be successful by now')
	const authSession = await authSessionStorage.getSession(request.headers.get('cookie'))
	const verifySession = await verifySessionStorage.getSession(request.headers.get('cookie'))

	const { redirectTo } = submission.value
	const headers = new Headers()
	authSession.set(verifiedTimeKey, Date.now())

	const unverifiedSessionId = verifySession.get(unverifiedSessionIdKey)
	if (unverifiedSessionId) {
		const session = await db.query.session.findFirst({
			where: eq(schema.session.id, unverifiedSessionId),
		})
		if (!session) {
			throw await redirectWithToast('/login', {
				type: 'error',
				title: 'Invalid session',
				description: 'Could not find session to verify. Please try again.',
			})
		}
		authSession.set(sessionKey, unverifiedSessionId)

		headers.append(
			'set-cookie',
			await authSessionStorage.commitSession(authSession, {
				expires: session.expirationDate,
			})
		)
	} else {
		headers.append('set-cookie', await authSessionStorage.commitSession(authSession))
	}

	headers.append('set-cookie', await verifySessionStorage.destroySession(verifySession))

	return redirect(safeRedirect(redirectTo), { headers })
}

export async function shouldRequestTwoFA(request: Request) {
	const authSession = await authSessionStorage.getSession(request.headers.get('cookie'))
	const verifySession = await verifySessionStorage.getSession(request.headers.get('cookie'))

	if (verifySession.has(unverifiedSessionIdKey)) return true
	const userId = await getUserId(request)
	if (!userId) return false

	const userHasTwoFA = await db.query.verification.findFirst({
		where: and(
			eq(schema.verification.target, String(userId)),
			eq(schema.verification.type, twoFAVerificationType)
		),
	})

	if (!userHasTwoFA) return false
	const verifiedTime = authSession.get(verifiedTimeKey) ?? new Date(0)
	const twoHours = 1000 * 60 * 2
	return Date.now() - verifiedTime > twoHours
}
