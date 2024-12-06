import { relations, sql } from 'drizzle-orm';
import { boolean, integer, pgTable, serial } from 'drizzle-orm/pg-core';
import { competition } from '../schema';
import { member } from '../schema';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const player = pgTable('player', {
  id: serial().primaryKey(),
  competitionId: integer()
    .notNull()
    .references(() => competition.id),
  memberId: integer()
    .notNull()
    .references(() => member.id),
  handicap: integer().notNull(),
  division: integer().notNull(),
  signedIn: boolean().notNull().default(true),
  inTwos: boolean().notNull().default(false),
  twoHoles: integer()
    .array()
    .default(sql`'{}'::integer[]`),
  position: integer().notNull(),
  teamNo: integer().notNull().default(0),
});

export const playerRelations = relations(player, ({ one }) => ({
  competition: one(competition, {
    fields: [player.competitionId],
    references: [competition.id],
  }),
  member: one(member, {
    fields: [player.memberId],
    references: [member.id]
  })
}));

export const playerSchema = createInsertSchema(player)
export type PlayerSchema = z.infer<typeof playerSchema>
