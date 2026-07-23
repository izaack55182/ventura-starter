//CORE

import crypto from 'node:crypto'
import { invariant } from '@epic-web/invariant'
import bcrypt from 'bcryptjs'
import { and, eq, gt } from 'drizzle-orm'
import { redirect } from 'react-router'
import { safeRedirect } from 'remix-utils/safe-redirect'
import type { User } from '@/drizzle/schema/user'
import * as schema from '@/drizzle/schema.server'
import { db } from '@/utils/db.server'
import { combineHeaders } from '@/utils/misc'
import { authSessionStorage } from './session.server'

export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30
export const getSessionExpirationDate = () => new Date(Date.now() + SESSION_EXPIRATION_TIME)

export const sessionKey = 'sessionId'

export async function getUserId(request: Request) {
	const authSession = await authSessionStorage.getSession(request.headers.get('cookie'))
	const sessionId = authSession.get(sessionKey)
	if (!sessionId) return null
	const session = await db.query.session.findFirst({
		columns: { userId: true },
		where: and(eq(schema.session.id, sessionId), gt(schema.session.expirationDate, new Date())),
	})

	if (!session?.userId) {
		throw redirect('/', {
			headers: {
				'set-cookie': await authSessionStorage.destroySession(authSession),
			},
		})
	}
	return session.userId
}

export async function requireAdminUserId(request: Request) {
	const userId = await requireUserId(request)

	const user = await db.query.user.findFirst({
		where: eq(schema.user.id, userId),
		with: {
			roles: {
				columns: {
					roleId: true,
				},
			},
		},
	})
}

export async function requireUserId(
	request: Request,
	{ redirectTo }: { redirectTo?: string | null } = {}
) {
	const userId = await getUserId(request)
	if (!userId) {
		const requestUrl = new URL(request.url)
		redirectTo =
			redirectTo === null ? null : (redirectTo ?? `${requestUrl.pathname}${requestUrl.search}`)
		const loginParams = redirectTo ? new URLSearchParams({ redirectTo }) : null
		const loginRedirect = ['/login', loginParams?.toString()].filter(Boolean).join('?')
		throw redirect(loginRedirect)
	}
	return userId
}

export function getPasswordHashParts(password: string) {
	const hash = crypto.createHash('sha1').update(password, 'utf8').digest('hex').toUpperCase()
	return [hash.slice(0, 5), hash.slice(5)] as const
}
export async function isUserEmailUnique(email: string) {
	return await db.query.user.findFirst({
		where: eq(schema.user.email, email),
		columns: { id: true, email: true },
	})
}

export async function isUserNameUserUnique(username: string) {
	return await db.query.user.findFirst({
		where: eq(schema.user.name, username),
		columns: { id: true, username: true },
	})
}
export async function requireAnonymous(request: Request) {
	const userId = await getUserId(request)
	if (userId) {
		throw redirect('/')
	}
}

export async function resetUserPassword({
	username,
	password,
}: {
	username: User['username']
	password: string
}) {
	const hashedPassword = await getPasswordHash(password)
	return db
		.update(schema.user)
		.set({ password: hashedPassword })
		.where(eq(schema.user.username, username))
}

export async function login({
	username,
	password,
}: {
	username: User['username']
	password: string
}) {
	const user = await verifyUserPasswordByUsername(username, password)
	if (!user) return null
	const [session] = await db
		.insert(schema.session)
		.values({
			expirationDate: getSessionExpirationDate(),
			userId: user.id,
		})
		.returning({
			id: schema.session.id,
			expirationDate: schema.session.expirationDate,
			userId: schema.session.userId,
		})
	return session
}

export async function signup({
	email,
	username,
	password,
	name,
}: {
	email: User['email']
	username: User['username']
	name: User['name']
	password: string
}) {
	const hashedPassword = await getPasswordHash(password)

	const [newUser] = await db
		.insert(schema.user)
		.values({
			email: email.toLowerCase(),
			username: username.toLowerCase(),
			firstName: name,
			password: hashedPassword,
		})
		.returning({ id: schema.user.id })

	if (!newUser) throw new Error('Failed to create user')

	const userRoleRecord = await db.query.role.findFirst({
		where: eq(schema.role.name, 'user'),
		columns: { id: true },
	})

	if (userRoleRecord) {
		await db.insert(schema.userRole).values({
			userId: newUser.id,
			roleId: userRoleRecord.id,
			userType: 'user',
		})
	}

	const [session] = await db
		.insert(schema.session)
		.values({
			userId: newUser.id,
			expirationDate: getSessionExpirationDate(),
		})
		.returning({ id: schema.session.id, expirationDate: schema.session.expirationDate })

	if (!session) throw new Error('Failed to create session')

	return session
}

export async function logout(
	{
		request,
		redirectTo = '/',
	}: {
		request: Request
		redirectTo?: string
	},
	responseInit?: ResponseInit
) {
	const authSession = await authSessionStorage.getSession(request.headers.get('cookie'))
	const sessionId = authSession.get(sessionKey)

	if (sessionId) {
		void db
			.delete(schema.session)
			.where(eq(schema.session.id, sessionId))
			.catch(() => {})
	}

	throw redirect(safeRedirect(redirectTo), {
		...responseInit,
		headers: combineHeaders(
			{ 'set-cookie': await authSessionStorage.destroySession(authSession) },
			responseInit?.headers
		),
	})
}

export async function getPasswordHash(password: string) {
	const hash = await bcrypt.hash(password, 10)
	return hash
}

export async function verifyUserPasswordByEmail(email: string, password: User['password']) {
	const userWithPassword = await db.query.user.findFirst({
		where: eq(schema.user.email, email),
		columns: { id: true, password: true, statusAccount: true },
	})
	if (!userWithPassword || !userWithPassword.password) {
		return null
	}

	invariant(password, 'Password es requerida')
	const isValid = await bcrypt.compare(password, userWithPassword.password)

	if (!isValid) {
		return null
	}
	return { id: userWithPassword.id, statusAccount: userWithPassword.statusAccount }
}

export async function verifyUserPasswordByUsername(username: string, password: User['password']) {
	const userWithPassword = await db.query.user.findFirst({
		where: eq(schema.user.username, username),
		columns: { id: true, password: true, statusAccount: true },
	})
	if (!userWithPassword || !userWithPassword.password) {
		return null
	}

	invariant(password, 'Password es requerida')
	const isValid = await bcrypt.compare(password, userWithPassword.password)

	if (!isValid) {
		return null
	}
	return { id: userWithPassword.id, statusAccount: userWithPassword.statusAccount }
}

export async function verifyUserPasswordById(id: User['id'], password: User['password']) {
	const userWithPassword = await db.query.user.findFirst({
		where: eq(schema.user.id, id),
		columns: { id: true, password: true },
	})
	if (!userWithPassword || !userWithPassword.password) {
		return null
	}

	invariant(password, 'Password es requerida')
	const isValid = await bcrypt.compare(password, userWithPassword.password)

	if (!isValid) {
		return null
	}
	return { id: userWithPassword.id }
}
export async function checkIsCommonPassword(password: string) {
	const [prefix, suffix] = getPasswordHashParts(password)

	try {
		const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
			signal: AbortSignal.timeout(1000),
		})

		if (!response.ok) return false

		const data = await response.text()
		return data.split(/\r?\n/).some((line) => {
			const [hashSuffix, ignoredPrevalenceCount] = line.split(':')
			return hashSuffix === suffix
		})
	} catch (error) {
		if (error instanceof DOMException && error.name === 'TimeoutError') {
			console.warn('Password check timed out')
			return false
		}

		console.warn('Unknown error during password check', error)
		return false
	}
}
