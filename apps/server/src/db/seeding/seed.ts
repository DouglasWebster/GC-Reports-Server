import { getTableName, sql, Table } from 'drizzle-orm';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { reset } from 'drizzle-seed';
// import * as compFormSchema from '../schema/format.schema';
// import * as teeSchema from '../schema/tee.schema';
// import * as memberSchema from '../schema/member.schema';
// import * as competitionSchema from '../schema/competition.schema';
// import * as playerSchema from '../schema/player.schema';
// import * as twoSchem from '../schema/two.schema'
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  compForm,
  compFormToTee,
  tee,
  member,
  competition,
  two,
  player,
} from '../../../../../libs/shared/drizzle/src/index';
import compForms from './data/comp_form_seed.json';
import tees from './data/tees.json';
import compFormsToTees from './data/comp_to_tee_seed.json';

async function resetTable(db: NodePgDatabase, table: Table) {
  console.log(`reseting table: ${getTableName(table)}`);
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

  await resetTable(db, tee);
  await db.insert(tee).values(tees);

  await resetTable(db, compForm);
  await db.insert(compForm).values(compForms);

  await resetTable(db, compFormToTee);
  await db.insert(compFormToTee).values(compFormsToTees);

  await resetTable(db, member);
  await resetTable(db, competition);
  await resetTable(db, player);
  await resetTable(db, two);
}

main();
