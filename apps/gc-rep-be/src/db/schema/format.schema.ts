import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  check,
  integer,
  pgTable,
  primaryKey,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { tee } from '.';
import { competition } from '.';

export const compForm = pgTable(
  'comp_form',
  {
    id: serial().primaryKey(),
    title: varchar({ length: 120 }).notNull(),
    teamSize: integer()
      .array()
      .notNull()
      .default(sql`'{1}'::integer[]`),
    isMedal: boolean().notNull().default(true),
    isStableford: boolean().notNull().default(false),
    isScramble: boolean().notNull().default(false),
    isMajor: boolean().notNull().default(false),
    createdAt: timestamp({ mode: 'date', precision: 2 }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: 'date', precision: 2 }).$onUpdate(
      () => new Date()
    ),
  },
  (t) => [check('not_both_formats', sql`${t.isMedal} <> ${t.isStableford}`)]
);

export const compFormRelations = relations(compForm, ({ many }) => ({
  compFormToTee: many(compFormToTee),
  competition: many(competition)
}));

export const compFormToTee = pgTable(
  'comp_form_to_tee',
  {
    compFormId: integer()
      .notNull()
      .references(() => compForm.id),
    teeId: integer()
      .notNull()
      .references(() => tee.id),
  },
  (t) => [
    primaryKey({
      name: 'comp_form_to_tee_pk',
      columns: [t.compFormId, t.teeId],
    }),
  ]
);

export const compFromToTeeRelations = relations(
  compFormToTee,
  ({one}) => ({
    compForm: one(compForm, {
      fields: [compFormToTee.compFormId],
      references: [compForm.id]
    }),
    tee: one(tee, {
      fields: [compFormToTee.teeId],
      references:[tee.id]
    })
  })
)
