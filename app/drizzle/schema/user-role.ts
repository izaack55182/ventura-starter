//CORE

import { type InferSelectModel, relations } from 'drizzle-orm'
import { index, pgTable } from 'drizzle-orm/pg-core'
import { role } from './role'
//TYPES & SCHEMAS
import { user } from './user'
// import { branch } from './branch'

export const userRole = pgTable(
	'role-user',
	(t) => ({
		id: t.serial('id').primaryKey(),
		userId: t
			.integer('user_id')
			.notNull()
			.references(() => user.id),
		roleId: t.integer('role_id').notNull(),
		createdAt: t.timestamp(),
		updatedAt: t.timestamp(),
		userType: t.varchar({ length: 255 }).notNull(),
		branchId: t.integer(),
		note: t.text(),
	}),

	(table) => [
		index('role_user_role_id_foreign').on(table.roleId),
		index('role_user_branch_id_foreign').on(table.branchId),
		index('role_user_user_id_foreign').on(table.userId),
		// index('idx_role_user_user_type_branch_id').on(table.userType, table.branchId),
	]
)

export const userRoleRelations = relations(userRole, ({ one }) => ({
	user: one(user, {
		fields: [userRole.userId],
		references: [user.id],
	}),
	role: one(role, {
		fields: [userRole.roleId],
		references: [role.id],
	}),
	// branch: one(branch,{
	//     fields:[userRole.branchId],
	//     references:[branch.id],
	// })
}))

export type UserRole = InferSelectModel<typeof userRole>
