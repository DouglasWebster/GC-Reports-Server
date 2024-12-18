import { relations, sql } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, uniqueIndex } from 'drizzle-orm/pg-core';
import { competition } from '.';
import { member } from '.';
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
  grossScore: integer().notNull(),
  stablefordPoints: integer().notNull(),
  handicap: integer().notNull(),
  handicapIndex: integer(),
  division: integer().notNull(),
  signedIn: boolean().notNull().default(true),
  inTwos: boolean().notNull().default(true),
  twoHoles: integer()
    .array()
    .default(sql`'{}'::integer[]`),
  position: integer().notNull(),
  teamNo: integer().notNull().default(0),
},
(t) => [
  uniqueIndex('competition_id_and_player_id.idx').on(t.competitionId, t.memberId)
]);

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
export type NewPlayer = typeof player.$inferInsert
