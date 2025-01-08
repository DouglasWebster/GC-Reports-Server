import { relations, sql } from "drizzle-orm";
import { check, index, integer, pgTable, serial, unique } from "drizzle-orm/pg-core";
import { competition } from "./competition.schema";
import { member } from "./member.schema";

export const two = pgTable('two', {
    id : serial().primaryKey(),
    competitionId : integer().references(() => competition.id).notNull(),
    memberId : integer().references(() => member.id).notNull(),
    hole: integer().notNull()
},
(t) => [
    check('hole_check1', sql`${t.hole} > 0`),
    check('hole_check2', sql`${t.hole} < 19`),
    index('twos_comp_idx').on(t.competitionId),
    index('twos_player_idx').on(t.memberId),
    unique('no_duplicate_twos').on(t.competitionId, t.memberId, t.hole)
])

export const twoRelations = relations(two, ({one}) => ({
    competition: one(competition, {
        fields: [two.competitionId],
        references: [competition.id],
    }),
    member: one(member, {
        fields: [two.memberId],
        references: [member.id]
    })
}))

export type InsertTwo = typeof two.$inferInsert
export type SelectTwo = typeof two.$inferSelect