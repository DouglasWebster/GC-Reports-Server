import { relations } from "drizzle-orm";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { player } from "../schema";

export const member = pgTable('member', {
    id: serial().primaryKey(),
    surname: varchar({length: 64}).notNull(),
    foreName: varchar({length: 64}).notNull()
})

export const memberRelations = relations(member, ({many}) => ({
    player: many(player)
}))