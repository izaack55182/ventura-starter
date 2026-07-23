// CORE

import { type InferInsertModel, type InferSelectModel, relations } from 'drizzle-orm'
import { boolean, customType, integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

// SCHEMAS
import { user } from './user'

const bytea = customType<{ data: Buffer; driverData: string | Buffer }>({
	dataType() {
		return 'bytea'
	},
})

export const passkey = pgTable('passkeys', (t) => ({
	id: t.varchar('id', { length: 255 }).primaryKey(),
	aaguid: t.varchar('aaguid', { length: 255 }).notNull(),
	publicKey: bytea('public_key').notNull(),
	userId: t
		.integer('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	webauthnUserId: t.varchar('webauthn_user_id', { length: 255 }).notNull(),
	counter: t.integer('counter').notNull(),
	deviceType: t.varchar('device_type', { length: 255 }).notNull(),
	backedUp: t.boolean('backed_up').notNull().default(false),
	transports: t.varchar('transports', { length: 255 }),
	createdAt: t.timestamp('created_at').defaultNow().notNull(),
	updatedAt: t.timestamp('updated_at').defaultNow().notNull(),
}))

export const passkeyRelations = relations(passkey, ({ one }) => ({
	user: one(user, {
		fields: [passkey.userId],
		references: [user.id],
	}),
}))

// TYPES
export type Passkey = InferSelectModel<typeof passkey>
export type PasskeyInsert = InferInsertModel<typeof passkey>

// ZOD SCHEMAS
export const PasskeySchema = createSelectSchema(passkey)
export const PasskeyInsertSchema = createInsertSchema(passkey)
