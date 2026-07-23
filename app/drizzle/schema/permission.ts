// CORE

import { type InferSelectModel, relations } from 'drizzle-orm'
import { pgTable, serial, timestamp, unique, varchar } from 'drizzle-orm/pg-core'
import { rolePermission } from './role-permission'

export const permission = pgTable(
	'permissions',
	(t) => ({
		id: t.serial('id').primaryKey(),
		action: t.varchar('action', { length: 255 }).notNull(),
		entity: t.varchar('entity', { length: 255 }).notNull(),
		access: t.varchar('access', { length: 255 }).notNull(),
		description: t.varchar('description', { length: 1024 }).default(''),
		createdAt: t.timestamp('created_at', { mode: 'string' }).defaultNow(),
		updatedAt: t.timestamp('updated_at', { mode: 'string' }).defaultNow(),
	}),
	(table) => [
		unique('permissions_action_entity_access_unique').on(table.action, table.entity, table.access),
	]
)

export const permissionRelations = relations(permission, ({ many }) => ({
	roles: many(rolePermission),
}))

// TYPES
export type Permission = InferSelectModel<typeof permission>
