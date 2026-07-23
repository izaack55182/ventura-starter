// CORE

import { type InferSelectModel, relations } from 'drizzle-orm'
import { pgTable, unique } from 'drizzle-orm/pg-core'
import { rolePermission } from './role-permission'
import { userRole } from './user-role'

export const role = pgTable(
	'roles',
	(t) => ({
		id: t.serial('id').primaryKey(),
		name: t.varchar({ length: 255 }).notNull(),
		description: t.varchar({ length: 191 }),
		createdAt: t.timestamp({ mode: 'string' }),
		updatedAt: t.timestamp({ mode: 'string' }),
		displayName: t.varchar({ length: 255 }),
	}),
	(table) => [unique('roles_name_unique').on(table.name)]
)

export const roleRelations = relations(role, ({ many }) => ({
	users: many(userRole),
	permissions: many(rolePermission),
}))

// TYPES
export type Role = InferSelectModel<typeof role>
