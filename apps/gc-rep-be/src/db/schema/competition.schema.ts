import {
    check,
    date,
    integer,
    pgTable,
    serial,
    timestamp,
    uniqueIndex,
  } from 'drizzle-orm/pg-core';
  import { compForm } from '.'
  import { relations, SQL, sql } from 'drizzle-orm';
  import { player } from '.';
  
  export const competition = pgTable(
    'competition',
    {
      id: serial().primaryKey(),
      compDate: date({ mode: 'date' }).notNull(),
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
    (t) => [check('twos_entry_check', sql`${t.twosEntered} <= ${t.sheetEntries}`),
      uniqueIndex('comp_format_and_date_idx').on(t.compFormId, t.compDate)
    ]
  );
  
  export const competitionRefelations = relations(competition, ({ one, many }) => ({
    compForm: one(compForm, {
      fields: [competition.compFormId],
      references: [compForm.id],
    }),
    player: many(player)
  }));


  export type NewCompetion = typeof competition.$inferInsert
  