import { createId } from '@paralleldrive/cuid2'
import { integer, pgTable, timestamp, unique, varchar } from 'drizzle-orm/pg-core'

export const verification = pgTable(
	'verification',
	(t) => ({
		id: t
			.varchar('id', { length: 128 })
			.$defaultFn(() => createId())
			.primaryKey(),
		createdAt: t.timestamp('created_at').defaultNow().notNull(),
		type: t.varchar('type', { length: 255 }).notNull(),
		target: t.varchar('target', { length: 255 }).notNull(),
		secret: t.varchar('secret', { length: 255 }).notNull(),
		algorithm: t.varchar('algorithm', { length: 255 }).notNull(),
		digits: t.integer('digits').notNull(),
		period: t.integer('period').notNull(),
		charSet: t.varchar('char_set', { length: 255 }).notNull(),
		expiresAt: t.timestamp('expires_at'),
	}),
	(table) => [unique('verification_target_type_unique').on(table.target, table.type)]
)
