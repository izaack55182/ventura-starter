//CORE
import { useRouteLoaderData } from 'react-router'

//TYPES
import type { loader as rootLoader } from '@/root'

type RootUser = NonNullable<Awaited<ReturnType<typeof rootLoader>>['data']['user']>

function isUser(user: unknown): user is RootUser {
	return (
		user !== null &&
		typeof user === 'object' &&
		'id' in user &&
		(typeof user.id === 'string' || typeof user.id === 'number')
	)
}

export function useOptionalUser() {
	const data = useRouteLoaderData<typeof rootLoader>('root')
	if (!data || !isUser(data.user)) {
		return undefined
	}
	return data.user
}

export function useUser() {
	const maybeUser = useOptionalUser()
	if (!maybeUser) {
		throw new Error(
			'No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.'
		)
	}
	return maybeUser
}

type Action = 'create' | 'read' | 'update' | 'delete'
type Entity = 'user' | 'note'
type Access = 'own' | 'any' | 'own,any' | 'any,own'

export type PermissionString = `${Action}:${Entity}` | `${Action}:${Entity}:${Access}`

export function parsePermissionString(permissionString: PermissionString) {
	const [action, entity, access] = permissionString.split(':') as [Action, Entity, Access]
	return {
		action,
		entity,
		access: access ? (access.split(',') as Array<Access>) : undefined,
	}
}

export function userHasPermission(
	user: Pick<ReturnType<typeof useUser>, 'roles'> | null | undefined,
	permission: PermissionString
) {
	if (!user) return false
	const { action, entity, access } = parsePermissionString(permission)
	return user.roles.some((ur) =>
		ur.role.permissions.some(
			(rp) =>
				rp.permission.entity === entity &&
				rp.permission.action === action &&
				(!access || access.includes(rp.permission.access as Access))
		)
	)
}

export function userHasRole(user: Pick<ReturnType<typeof useUser>, 'roles'> | null, role: string) {
	if (!user) return false
	return user.roles.some((ur) => ur.role.name === role)
}
