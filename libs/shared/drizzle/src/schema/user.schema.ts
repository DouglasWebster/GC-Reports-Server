import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const user = pgTable('user', {
  id: serial().primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull()
})

export type InsertUser = typeof user.$inferInsert
export type SelectUser = typeof user.$inferSelect