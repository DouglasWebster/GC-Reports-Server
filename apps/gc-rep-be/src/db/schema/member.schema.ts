import { relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar
} from 'drizzle-orm/pg-core';
import { player } from '.';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const member = pgTable(
  'member',
  {
    id: serial().primaryKey(),
    surname: varchar({ length: 64 }).notNull(),
    foreName: varchar({ length: 64 }).notNull(),
    createdAt: timestamp({ mode: 'date', precision: 2 }).defaultNow(),
    updatedAt: timestamp({ mode: 'date', precision: 2 }).$onUpdate(
      () => new Date()
    ),
  },
  (table) => [
      uniqueIndex('member_name_idx').on(table.surname, table.foreName),
  ]
);

export const memberRelations = relations(member, ({ many }) => ({
  player: many(player),
}));

export const memberSchema = createInsertSchema(member)
export type MemberSchemaDTO = z.infer<typeof memberSchema>;
export type NewMember = typeof member.$inferInsert
