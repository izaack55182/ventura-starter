// CORE

import { invariant } from '@epic-web/invariant'
import bcrypt from 'bcryptjs'
import { and, eq } from 'drizzle-orm'
import { redirect } from 'react-router'
// CONSTANTS
//import { PERMISSIONS } from '@/features/security/access/permission/constants'
import type { User, UserInsert } from '@/drizzle/schema/user'
import * as schema from '@/drizzle/schema.server'
// UTILS
import { db } from '@/utils/db.server'
//import type { Team } from '@/drizzle/schema/team'

export async function getRootUser(userId: User['id']) {
	return db.query.user.findFirst({
		where: eq(schema.user.id, userId),
		columns: {
			id: true,
			firstName: true,
			lastName: true,
			email: true,
			username: true,
		},
		with: {
			roles: {
				with: {
					role: {
						columns: {
							name: true,
						},
						with: {
							permissions: {
								with: {
									permission: {
										columns: { action: true, entity: true, access: true },
									},
								},
							},
						},
					},
				},
			},
			image: {
				columns: {
					objectKey: true,
				},
			},
		},
	})
}

// export async function getUserIdentify(id: User['id']) {
//     return db.query.user.findFirst({
//         where: eq(schema.user.id, id),
//         with: {
//             permissions: {
//                 columns: {
//                     permissionId: true,
//                 },
//                 with: {
//                     permission: true,
//                 },
//             },
//             roles: {
//                 columns: {
//                     id: true,
//                     teamId: true,
//                 },
//                 with: {
//                     role: true,
//                     team: {
//                         with: {
//                             company: {
//                                 with: {
//                                     subscription: {
//                                         with: {
//                                             subscriptionPlan: true,
//                                         },
//                                     },
//                                 },
//                             },
//                         },
//                     },
//                 },
//             },
//         },
//     })
// }

export async function getUserById(id: User['id']) {
	return db.query.user.findFirst({ where: eq(schema.user.id, id) })
}

// export async function getRoleUserByUserId(userId: User['id'], teamId: Team['id']) {
//     const userRole = await db.query.userRole.findFirst({
//         where: and(eq(schema.userRole.userId, userId), eq(schema.userRole.teamId, teamId)),
//         with: {
//             role: {
//                 columns: {
//                     id: true,
//                     name: true,
//                 },
//             },
//         },
//     })
//     return userRole
// }

// export async function getUserPermissionsByUserId(userId: User['id']) {
//     const permissions = await db.query.userPermission.findMany({
//         where: eq(schema.userPermission.userId, userId),
//         with: {
//             permission: {
//                 columns: {
//                     name: true,
//                 },
//             },
//         },
//     })
//
//     const formattedValues = permissions.map((permission) => {
//         const field = PERMISSIONS.find((perm) => perm.id === permission.permissionId)
//         return {
//             name: field?.name,
//             fieldId: permission.id,
//             permission: permission.permission.name,
//             permissionId: permission.permissionId,
//             userId: permission.userId,
//             value: '1',
//             category: field?.categoryId,
//         }
//     })
//
//     const conformValues = formattedValues.reduce(
//         (acc, item) => {
//             acc[item.permission] = 1
//             return acc
//         },
//         {} as { [key: string]: string | null }
//     )
//
//     const userPermission = {
//         formattedValues,
//         conformValues,
//     }
//
//     return userPermission
// }

export async function createUser({ firstName, lastName, email, username, password }: UserInsert) {
	invariant(password, 'Password is required')
	const hashedPassword = await bcrypt.hash(password, 10)

	return db.insert(schema.user).values({
		firstName,
		lastName,
		email,
		username,
		password: hashedPassword,
	})
}

export async function verifyLoginEmail(email: User['email'], password: User['password']) {
	if (email === null) {
		throw new Error('Email cannot be null')
	}
	const userWithPassword = await db.query.user.findFirst({
		where: eq(schema.user.email, email),
	})

	if (!userWithPassword || !userWithPassword.password) {
		return null
	}
	if (password === null) {
		throw new Error('Email cannot be null')
	}

	const isValid = await bcrypt.compare(password, userWithPassword.password)

	if (!isValid) {
		return null
	}

	const { password: _password, ...userWithoutPassword } = userWithPassword

	return userWithoutPassword
}

// export async function verifyLoginPhone(
//     phoneNumber: User['phoneNumber'],
//     password: User['password'],
//     phonePrefix: User['phonePrefix']
// ) {
//     if (phoneNumber === null) {
//         throw new Error('Phone number cannot be null')
//     }
//     if (phonePrefix === null) {
//         throw new Error('Phone prefix cannot be null')
//     }
//     const userWithPassword = await db.query.user.findFirst({
//         where: and(eq(schema.user.phoneNumber, phoneNumber), eq(schema.user.phonePrefix, phonePrefix)),
//     })

//     if (!userWithPassword || !userWithPassword.password) {
//         return null
//     }
//     if (password === null) {
//         throw new Error('Phone cannot be null')
//     }

//     const isValid = await bcrypt.compare(password, userWithPassword.password)

//     if (!isValid) {
//         return null
//     }

//     const { password: _password, ...userWithoutPassword } = userWithPassword

//     return userWithoutPassword
// }

export async function requireNoPassword(userId: number) {
	const password = await db.query.user.findFirst({
		where: eq(schema.user.id, userId),
		columns: { id: true },
	})
	if (password) {
		throw redirect('/settings/profile/password')
	}
}

// export async function userCanDeleteConnections(userId: number) {
//     const user = await db.query.user.findFirst({
//         where: eq(schema.user.id, userId),
//         columns: {
//             password: true,
//         },
//         with: {
//             connections: {
//                 columns: { id: true },
//             },
//         },
//     })
//     // user can delete their connections if they have a password
//     if (user?.password) return true
//     // users have to have more than one remaining connection to delete one
//     return Boolean(user?.connections && user?.connections.length > 1)
// }

export async function requirePassword(userId: number) {
	const password = await db.query.user.findFirst({
		where: eq(schema.user.id, userId),
		columns: { password: true },
	})
	if (!password) {
		throw redirect('create')
	}
}
