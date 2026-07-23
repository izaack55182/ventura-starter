import { generateAuthenticationOptions, verifyAuthenticationResponse } from '@simplewebauthn/server'
import { eq } from 'drizzle-orm'
import * as schema from '@/drizzle/schema.server.ts'
import { getSessionExpirationDate } from '@/features/security/authentication/server/auth.server.ts'
import { handleNewSession } from '@/features/security/authentication/server/login.server.ts'
import type { Route } from '@/rr/features/security/authentication/web-auth/+types/authentication.ts'
import { db } from '@/utils/db.server.ts'
import { getWebAuthnConfig, PasskeyLoginBodySchema, passkeyCookie } from './utils.server.ts'

export async function loader({ request }: Route.LoaderArgs) {
	const config = getWebAuthnConfig(request)
	const options = await generateAuthenticationOptions({
		rpID: config.rpID,
		userVerification: 'preferred',
	})

	const cookieHeader = await passkeyCookie.serialize({
		challenge: options.challenge,
	})

	return Response.json({ options }, { headers: { 'Set-Cookie': cookieHeader } })
}

export async function action({ request }: Route.ActionArgs) {
	const cookieHeader = request.headers.get('Cookie')
	const cookie = await passkeyCookie.parse(cookieHeader)
	const deletePasskeyCookie = await passkeyCookie.serialize('', { maxAge: 0 })
	try {
		if (!cookie?.challenge) {
			throw new Error('Authentication challenge not found')
		}

		const body = await request.json()
		const result = PasskeyLoginBodySchema.safeParse(body)
		if (!result.success) {
			throw new Error('Invalid authentication response')
		}
		const { authResponse, redirectTo } = result.data

		const passkey = await db.query.passkey.findFirst({
			where: eq(schema.passkey.id, authResponse.id),
			with: { user: true },
		})
		if (!passkey) {
			throw new Error('Passkey not found')
		}

		const config = getWebAuthnConfig(request)

		const verification = await verifyAuthenticationResponse({
			response: authResponse,
			expectedChallenge: cookie.challenge,
			expectedOrigin: config.origin,
			expectedRPID: config.rpID,
			credential: {
				id: authResponse.id,
				publicKey: new Uint8Array(passkey.publicKey),
				counter: Number(passkey.counter),
			},
		})

		if (!verification.verified) {
			throw new Error('Authentication verification failed')
		}

		// Update the authenticator's counter in the DB to the newest count
		await db
			.update(schema.passkey)
			.set({ counter: verification.authenticationInfo.newCounter })
			.where(eq(schema.passkey.id, passkey.id))

		const [session] = await db
			.insert(schema.session)
			.values({
				expirationDate: getSessionExpirationDate(),
				userId: passkey.userId,
			})
			.returning({
				id: schema.session.id,
				expirationDate: schema.session.expirationDate,
				userId: schema.session.userId,
			})

		if (!session) {
			throw new Error('Failed to create session')
		}

		const response = await handleNewSession(
			{
				request,
				session,
				redirectTo: redirectTo ?? undefined,
			},
			{ headers: { 'Set-Cookie': deletePasskeyCookie } }
		)

		return Response.json(
			{
				status: 'success',
				location: response.headers.get('Location'),
			},
			{ headers: response.headers }
		)
	} catch (error) {
		if (error instanceof Response) throw error

		return Response.json(
			{
				status: 'error',
				error: error instanceof Error ? error.message : 'Verification failed',
			} as const,
			{ status: 400, headers: { 'Set-Cookie': deletePasskeyCookie } }
		)
	}
}
