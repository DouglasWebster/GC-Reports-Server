import { check, integer, pgTable, serial } from "drizzle-orm/pg-core";
import { player } from "./player.schema";
import { sql } from "drizzle-orm";

export const two = pgTable('two', {
    id : serial().primaryKey(),
    playerId : integer().references(() => player.id).notNull(),
    hole: integer().notNull()
},
(t) => [
    check('hole_check1', sql`${t.hole} > 0`),
    check('hole_check2', sql`${t.hole} < 19`)
])