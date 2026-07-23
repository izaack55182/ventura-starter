import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server'
import { eq } from 'drizzle-orm'
import * as schema from '@/drizzle/schema.server.ts'
import { requireUserId } from '@/features/security/authentication/server/auth.server.ts'
import type { Route } from '@/rr/features/security/authentication/web-auth/+types/registration.ts'
import { db } from '@/utils/db.server.ts'
import { getDomainUrl, getErrorMessage } from '@/utils/misc.tsx'
import {
	getWebAuthnConfig,
	PasskeyCookieSchema,
	passkeyCookie,
	RegistrationResponseSchema,
} from './utils.server.ts'

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request)
	const passkeys = await db.query.passkey.findMany({
		where: eq(schema.passkey.userId, userId),
		columns: { id: true },
	})
	const user = await db.query.user.findFirst({
		where: eq(schema.user.id, userId),
		columns: { email: true, name: true, username: true },
	})
	if (!user) {
		throw new Error('User not found')
	}

	const config = getWebAuthnConfig(request)
	const options = await generateRegistrationOptions({
		rpName: config.rpName,
		rpID: config.rpID,
		userName: user.username,
		userID: new TextEncoder().encode(userId.toString()),
		userDisplayName: user.name ?? user.username,
		attestationType: 'none',
		excludeCredentials: passkeys,
		authenticatorSelection: {
			residentKey: 'preferred',
			userVerification: 'preferred',
		},
	})

	return Response.json(
		{ options },
		{
			headers: {
				'Set-Cookie': await passkeyCookie.serialize(
					PasskeyCookieSchema.parse({
						challenge: options.challenge,
						userId: options.user.id,
					})
				),
			},
		}
	)
}

export async function action({ request }: Route.ActionArgs) {
	try {
		const userId = await requireUserId(request)

		const body = await request.json()
		const result = RegistrationResponseSchema.safeParse(body)
		if (!result.success) {
			throw new Error('Invalid registration response')
		}

		const data = result.data

		// Get challenge from cookie
		const passkeyCookieData = await passkeyCookie.parse(request.headers.get('Cookie'))
		const parsedPasskeyCookieData = PasskeyCookieSchema.safeParse(passkeyCookieData)
		if (!parsedPasskeyCookieData.success) {
			throw new Error('No challenge found')
		}
		const { challenge, userId: webauthnUserId } = parsedPasskeyCookieData.data

		const domain = new URL(getDomainUrl(request)).hostname
		const rpID = domain
		const origin = getDomainUrl(request)

		const verification = await verifyRegistrationResponse({
			response: data,
			expectedChallenge: challenge,
			expectedOrigin: origin,
			expectedRPID: rpID,
			requireUserVerification: true,
		})

		const { verified, registrationInfo } = verification
		if (!verified || !registrationInfo) {
			throw new Error('Registration verification failed')
		}
		const { credential, credentialDeviceType, credentialBackedUp, aaguid } = registrationInfo

		const existingPasskey = await db.query.passkey.findFirst({
			where: eq(schema.passkey.id, credential.id),
			columns: { id: true },
		})

		if (existingPasskey) {
			throw new Error('This passkey has already been registered')
		}

		// Create new passkey in database
		await db.insert(schema.passkey).values({
			id: credential.id,
			aaguid,
			publicKey: Buffer.from(credential.publicKey),
			userId,
			webauthnUserId,
			counter: credential.counter,
			deviceType: credentialDeviceType,
			backedUp: credentialBackedUp,
			transports: credential.transports?.join(',') ?? null,
		})

		return Response.json({ status: 'success' } as const, {
			headers: {
				'Set-Cookie': await passkeyCookie.serialize('', { maxAge: 0 }),
			},
		})
	} catch (error) {
		if (error instanceof Response) throw error

		return Response.json({ status: 'error', error: getErrorMessage(error) } as const, {
			status: 400,
		})
	}
}
