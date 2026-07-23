// CORE

// UTILS
import { and, eq } from 'drizzle-orm'
import { useFetcher } from 'react-router'
import { DialogDrawerWrapper } from '@/components/dialog-drawer-wrapper'
import { Icon } from '@/components/ui/icon'
// COMPONENTS
import { StatusButton } from '@/components/ui/status-button'
import * as schema from '@/drizzle/schema.server'
// QUERIES
import { requireUserId } from '@/features/security/authentication/server/auth.server'
import { requireRecentVerification } from '@/features/security/authentication/server/verify.server'
import type { Route } from '@/rr/features/user/routes/+types/two-factor-disable'
import { db } from '@/utils/db.server'
import { useDoubleCheck } from '@/utils/misc'
import { redirectWithToast } from '@/utils/toast.server'

// TYPES

import { twoFAVerificationType } from '../types'

export const handle = {
	breadcrumb: <Icon name="shield-off">Deshabilitar 2FA</Icon>,
}

export async function loader({ request }: Route.LoaderArgs) {
	await requireRecentVerification(request, '/profile/verify')
	const userId = await requireUserId(request)
	await db
		.delete(schema.verification)
		.where(
			and(
				eq(schema.verification.target, String(userId)),
				eq(schema.verification.type, twoFAVerificationType)
			)
		)
	return redirectWithToast('/profile', {
		title: 'Deshabilitado',
		description: 'La autenticación de dos factores ha sido desactivada.',
		type: 'success',
	})
}

export async function action({ request }: Route.ActionArgs) {
	return loader({ request } as any)
}

export default function TwoFactorDisableRoute() {
	const disable2FAFetcher = useFetcher<typeof action>()
	const dc = useDoubleCheck()

	return (
		<DialogDrawerWrapper
			title="Deshabilitar Autenticación de Dos Factores"
			description="Deshabilitar la autenticación de dos factores reducirá significativamente la seguridad de tu cuenta. Te recomendamos mantenerla activa para proteger tu información."
			redirectTo="/profile"
		>
			<div className="flex flex-col gap-6">
				<div className="flex items-center gap-4 my-2 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
					<Icon name="shield-off" className="w-6 h-6 flex-shrink-0" />
					<span className="text-sm font-medium leading-relaxed">
						Esta acción requiere confirmar tu intención para desactivar la seguridad de la cuenta.
					</span>
				</div>

				<disable2FAFetcher.Form method="POST" className="flex justify-end gap-4 mt-4">
					<StatusButton
						variant="destructive"
						status={disable2FAFetcher.state === 'loading' ? 'pending' : 'idle'}
						{...dc.getButtonProps({
							name: 'intent',
							value: 'disable',
							type: 'submit',
							className: 'w-full',
						})}
					>
						{dc.doubleCheck ? '¿Confirmar desactivación?' : 'Deshabilitar 2FA'}
					</StatusButton>
				</disable2FAFetcher.Form>
			</div>
		</DialogDrawerWrapper>
	)
}
