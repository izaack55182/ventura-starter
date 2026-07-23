// CORE

import { createId } from '@paralleldrive/cuid2'
import { pgTable } from 'drizzle-orm/pg-core'

export const session = pgTable('session', (t) => ({
	id: t
		.varchar({ length: 191 })
		.primaryKey()
		.$defaultFn(() => createId()),
	expirationDate: t.timestamp('expiration_date').notNull(),
	createdAt: t.timestamp('createdAt').defaultNow().notNull(),
	updatedAt: t
		.timestamp('updatedAt')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
	userId: t.integer('userId').notNull(),
}))
