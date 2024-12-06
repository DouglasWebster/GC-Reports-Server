import { relations } from 'drizzle-orm';
import {
  boolean,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { compFormToTee } from '../schema';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const tee = pgTable('tee', {
  id: serial().primaryKey(),
  name: varchar({ length: 50 }).notNull().unique(),
  mens: boolean().default(true),
  ladies: boolean().default(false),
  createdAt: timestamp({ mode: 'date', precision: 2 }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: 'date', precision: 2 }).$onUpdate(
    () => new Date()
  ),
});

export const teeRelations = relations(tee, ({ many }) => ({
  compFormToTee: many(compFormToTee),
}));

export const teeSchema = createInsertSchema(tee);
export type TeeSchema = z.infer<typeof teeSchema>;
