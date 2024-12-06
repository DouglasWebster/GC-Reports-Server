import {
  check,
  date,
  integer,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { compForm } from '../comp-form/schema';
import { relations, sql } from 'drizzle-orm';
import { player } from '../player/schema';

export const competition = pgTable(
  'competition',
  {
    id: serial().primaryKey(),
    compDate: date({ mode: 'date' }).notNull().defaultNow(),
    entryFee: integer().notNull().default(2),
    compFormId: integer()
      .notNull()
      .references(() => compForm.id),
    computerEntries: integer().notNull(),
    sheetEntries: integer().notNull(),
    twosEntered: integer().notNull(),
    playerCount: integer().notNull(),
    createdAt: timestamp({ mode: 'date', precision: 2 }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: 'date', precision: 2 }).$onUpdate(
      () => new Date()
    ),
  },
  (t) => [check('twos_entry_check', sql`${t.twosEntered} <= ${t.sheetEntries}`)]
);

export const competitionRefelations = relations(competition, ({ one, many }) => ({
  compForm: one(compForm, {
    fields: [competition.compFormId],
    references: [compForm.id],
  }),
  player: many(player)
}));
