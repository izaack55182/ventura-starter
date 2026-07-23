import { startRegistration } from '@simplewebauthn/browser'
import { formatDistanceToNow } from 'date-fns'
import { and, desc, eq } from 'drizzle-orm'
import { useState } from 'react'
import { Form, useRevalidator } from 'react-router'
import { z } from 'zod'
import { DialogDrawerWrapper } from '@/components/dialog-drawer-wrapper'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import * as schema from '@/drizzle/schema.server.ts'
import { requireUserId } from '@/features/security/authentication/server/auth.server.ts'
import type { Route } from '@/rr/features/user/routes/+types/passkeys.ts'
import { db } from '@/utils/db.server.ts'

export const handle = {
	breadcrumb: <Icon name="passkey">Passkeys</Icon>,
}

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	const passkeys = await db.query.passkey.findMany({
		where: eq(schema.passkey.userId, userId),
		orderBy: [desc(schema.passkey.createdAt)],
		columns: {
			id: true,
			deviceType: true,
			createdAt: true,
		},
	})
	return { passkeys }
}

export async function action({ request }: Route.ActionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const intent = formData.get('intent')

	if (intent === 'delete') {
		const passkeyId = formData.get('passkeyId')
		if (typeof passkeyId !== 'string') {
			return Response.json({ status: 'error', error: 'Invalid passkey ID' }, { status: 400 })
		}

		await db
			.delete(schema.passkey)
			.where(and(eq(schema.passkey.id, passkeyId), eq(schema.passkey.userId, userId)))
		return Response.json({ status: 'success' })
	}

	return Response.json({ status: 'error', error: 'Invalid intent' }, { status: 400 })
}

const RegistrationOptionsSchema = z.object({
	options: z.object({
		rp: z.object({
			id: z.string(),
			name: z.string(),
		}),
		user: z.object({
			id: z.string(),
			name: z.string(),
			displayName: z.string(),
		}),
		challenge: z.string(),
		pubKeyCredParams: z.array(
			z.object({
				type: z.literal('public-key'),
				alg: z.number(),
			})
		),
		authenticatorSelection: z
			.object({
				authenticatorAttachment: z.enum(['platform', 'cross-platform']).optional(),
				residentKey: z.enum(['required', 'preferred', 'discouraged']).optional(),
				userVerification: z.enum(['required', 'preferred', 'discouraged']).optional(),
				requireResidentKey: z.boolean().optional(),
			})
			.optional(),
	}),
}) satisfies z.ZodType<{ options: PublicKeyCredentialCreationOptionsJSON }>

export default function Passkeys({ loaderData }: Route.ComponentProps) {
	const revalidator = useRevalidator()
	const [error, setError] = useState<string | null>(null)

	async function handlePasskeyRegistration() {
		try {
			setError(null)
			const resp = await fetch('/webauthn/registration')
			const jsonResult = await resp.json()
			const parsedResult = RegistrationOptionsSchema.parse(jsonResult)

			const regResult = await startRegistration({
				optionsJSON: parsedResult.options,
			})

			const verificationResp = await fetch('/webauthn/registration', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(regResult),
			})

			if (!verificationResp.ok) {
				throw new Error('Failed to verify registration')
			}

			void revalidator.revalidate()
		} catch (err) {
			console.error('Failed to create passkey:', err)
			setError('Failed to create passkey. Please try again.')
		}
	}

	return (
		<DialogDrawerWrapper
			title="Administrar Passkeys"
			description="Inicia sesión de forma segura sin contraseña usando tu huella, rostro o dispositivo."
			redirectTo="/profile"
		>
			<div className="flex flex-col gap-6">
				<div className="flex justify-end">
					<form action={handlePasskeyRegistration}>
						<Button type="submit" variant="secondary" size="sm" className="flex items-center gap-2">
							Agregar
						</Button>
					</form>
				</div>

				{error ? (
					<div className="bg-destructive/15 text-destructive rounded-lg p-4 text-sm">{error}</div>
				) : null}

				{loaderData.passkeys.length ? (
					<ul className="flex flex-col gap-3" title="passkeys">
						{loaderData.passkeys.map((passkey) => (
							<li
								key={passkey.id}
								className="border-border flex items-center justify-between gap-4 rounded-xl border p-4 bg-card/50"
							>
								<div className="flex flex-col gap-1">
									<div className="flex items-center gap-2">
										<Icon name="lock" className="text-primary size-4 shrink-0" />
										<span className="font-semibold text-sm">
											{passkey.deviceType === 'platform'
												? 'Dispositivo Principal'
												: 'Llave de Seguridad'}
										</span>
									</div>
									<div className="text-muted-foreground text-xs">
										Registrado hace {formatDistanceToNow(new Date(passkey.createdAt))}
									</div>
								</div>
								<Form method="POST" className="shrink-0">
									<input type="hidden" name="passkeyId" value={passkey.id} />
									<Button type="submit" name="intent" value="delete" variant="ghost" size="icon">
										<Icon name="circle-minus" className="size-4" />
										<span className="sr-only">Eliminar</span>
									</Button>
								</Form>
							</li>
						))}
					</ul>
				) : (
					<div className="text-muted-foreground text-center py-8 text-sm">
						Aún no tienes passkeys registradas.
					</div>
				)}
			</div>
		</DialogDrawerWrapper>
	)
}
