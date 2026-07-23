import { type InferInsertModel, type InferSelectModel, relations, type SQL, sql } from 'drizzle-orm'
import { index, pgTable, text, unique, uuid } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { passkey } from './passkey'
import { userRole } from './user-role'
export const user = pgTable(
	'users',
	(t) => ({
		id: t.serial('id').primaryKey(),
		firstName: t.varchar({ length: 191 }),
		password: t.varchar({ length: 191 }),
		lastName: t.varchar({ length: 191 }),
		email: t.varchar({ length: 191 }).notNull(),
		username: t.varchar({ length: 191 }).notNull(),
		createdAt: t.timestamp(),
		updatedAt: t.timestamp(),
		statusAccount: t.varchar({ length: 191 }),

		name: t
			.text()
			.generatedAlwaysAs(
				(): SQL => sql`COALESCE(${user.firstName}, '') || ' ' || COALESCE(${user.lastName}, '')`
			),
	}),
	(table) => [index('email').on(table.email), unique('users_email_unique').on(table.email)]
)

export const userRelations = relations(user, ({ many, one }) => ({
	roles: many(userRole),
	passkeys: many(passkey),
	image: one(userImage),
}))

export type User = InferSelectModel<typeof user>
export type UserInsert = InferInsertModel<typeof user>

export const UserSchema = createSelectSchema(user)
export const UserInsertSchema = createInsertSchema(user)

export const userImage = pgTable('user_images', (t) => ({
	id: t.serial('id').primaryKey(),
	altText: t.varchar('alt_text', { length: 191 }),
	objectKey: t.varchar('object_key', { length: 191 }).notNull(),
	contentType: t.varchar('content_type', { length: 191 }),
	userId: t
		.integer('user_id')
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	createdAt: t.timestamp('created_at').defaultNow(),
	updatedAt: t.timestamp('updated_at').defaultNow(),
}))

export const userImageRelations = relations(userImage, ({ one }) => ({
	user: one(user, {
		fields: [userImage.userId],
		references: [user.id],
	}),
}))

export type UserImage = InferSelectModel<typeof userImage>
export type UserImageInsert = InferInsertModel<typeof userImage>
