// CORE

import { type InferSelectModel, relations } from 'drizzle-orm'
import { index, integer, pgTable } from 'drizzle-orm/pg-core'
import { permission } from './permission'
import { role } from './role'

export const rolePermission = pgTable(
	'role_permissions',
	(t) => ({
		roleId: t
			.integer('role_id')
			.notNull()
			.references(() => role.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		permissionId: t
			.integer('permission_id')
			.notNull()
			.references(() => permission.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	}),
	(table) => [
		index('role_permission_role_id_index').on(table.roleId),
		index('role_permission_permission_id_index').on(table.permissionId),
	]
)

export const rolePermissionRelations = relations(rolePermission, ({ one }) => ({
	role: one(role, {
		fields: [rolePermission.roleId],
		references: [role.id],
	}),
	permission: one(permission, {
		fields: [rolePermission.permissionId],
		references: [permission.id],
	}),
}))

export type RolePermission = InferSelectModel<typeof rolePermission>
