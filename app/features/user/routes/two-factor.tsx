// CORE

import { createId as cuid } from '@paralleldrive/cuid2'
// UTILS
import { and, eq } from 'drizzle-orm'
import { Link, redirect, useFetcher } from 'react-router'
// COMPONENTS
import { Icon } from '@/components/ui/icon'
import { StatusButton } from '@/components/ui/status-button'
import * as schema from '@/drizzle/schema.server'
// QUERIES
import { requireUserId } from '@/features/security/authentication/server/auth.server'
import type { Route } from '@/rr/features/user/routes/+types/two-factor'
import { db } from '@/utils/db.server'
import { generateTOTP } from '@/utils/totp.server'

// TYPES

import { twoFAVerificationType } from '../types'
import { twoFAVerifyVerificationType } from './two-factor-verify'

export const handle = {
	breadcrumb: <Icon name="lock">Dos Factores</Icon>,
}

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	const verification = await db.query.verification.findFirst({
		where: and(
			eq(schema.verification.type, twoFAVerificationType),
			eq(schema.verification.target, String(userId))
		),
		columns: { id: true },
	})
	return { is2FAEnabled: Boolean(verification) }
}

export async function action({ request }: Route.ActionArgs) {
	const userId = await requireUserId(request)
	const { otp: _otp, ...config } = await generateTOTP()
	const verificationData = {
		...config,
		type: twoFAVerifyVerificationType,
		target: String(userId),
	}
	await db
		.insert(schema.verification)
		.values({ ...verificationData, id: cuid() })
		.onConflictDoUpdate({
			target: [schema.verification.target, schema.verification.type],
			set: verificationData,
		})
	return redirect('/profile/two-factor/verify')
}

export default function TwoFactorRoute({ loaderData }: Route.ComponentProps) {
	const data = loaderData
	const enable2FAFetcher = useFetcher<typeof action>()

	return (
		<div className="flex flex-col gap-4">
			{data.is2FAEnabled ? (
				<>
					<p className="text-lg">
						<Icon name="check">You have enabled two-factor authentication.</Icon>
					</p>
					<Link to="disable">
						<Icon name="lock-open">Disable 2FA</Icon>
					</Link>
				</>
			) : (
				<>
					<p>
						<Icon name="lock-open">You have not enabled two-factor authentication yet.</Icon>
					</p>
					<p className="text-sm">
						Two factor authentication adds an extra layer of security to your account. You will need
						to enter a code from an authenticator app like{' '}
						<a className="underline" href="https://1password.com/">
							1Password
						</a>{' '}
						to log in.
					</p>
					<enable2FAFetcher.Form method="POST">
						<StatusButton
							type="submit"
							name="intent"
							value="enable"
							status={enable2FAFetcher.state === 'loading' ? 'pending' : 'idle'}
							className="mx-auto"
						>
							Enable 2FA
						</StatusButton>
					</enable2FAFetcher.Form>
				</>
			)}
		</div>
	)
}
