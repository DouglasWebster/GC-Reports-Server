import { getTableName, sql, Table } from 'drizzle-orm';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { reset } from 'drizzle-seed';
import * as compFormSchema from '../comp-form/schema';
import * as teeSchema from '../tee/schema';
import compForms from './data/comp_form_seed.json';
import tees from './data/tees.json';
import compFormsToTees from './data/comp_to_tee_seed.json'

async function resetTable(db: NodePgDatabase, table: Table) {
  console.log(`reseting table: ${getTableName(table)}`)
  return db.execute(
    sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`)
  );
}

async function main() {
  console.log(process.env.DATABASE_URL);
  const db = drizzle({
    connection: process.env.DATABASE_URL,
    casing: 'snake_case',
  });

  await resetTable(db, teeSchema.tee);
  await db.insert(teeSchema.tee).values(tees);

  await resetTable(db, compFormSchema.compForm);
  await db.insert(compFormSchema.compForm).values(compForms)

  await reset(db, compFormSchema.compFormToTee);
  await db.insert(compFormSchema.compFormToTee).values(compFormsToTees)
}

main();
