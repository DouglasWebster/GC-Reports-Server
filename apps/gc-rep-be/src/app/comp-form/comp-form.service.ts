import { compForm, compFormToTee, tee } from '@lib/shared/drizzle';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../../db/database/database-connection';
import * as schema from '@lib/shared/drizzle';

@Injectable()
export class CompFormService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>
  ) {}
  
  async getCompsForms() {
    // const compForm = aliasedTable(schema.compForm, 'comp_form');
    return this.database
    .select({
      Name: compForm.title,
      'Team size': compForm.teamSize,
      Medal: compForm.isMedal,
      Stableford: compForm.isStableford,
      Scramble: compForm.isScramble,
      Major: compForm.isMajor,
      tee: tee.name,
    })
    .from(compForm)
    .leftJoin(
      compFormToTee,
      eq(compForm.id, compFormToTee.compFormId)
    )
    .leftJoin(tee, eq(compFormToTee.teeId, tee.id));
  }
  
  getCompsForm(compFormId: number) {
    // const compForm = aliasedTable(schema.compForm, 'comp_form');
    return this.database
    .select({
      Name: compForm.title,
      'Team size': compForm.teamSize,
      Medal: compForm.isMedal,
      Stableford: compForm.isStableford,
      Scramble: compForm.isScramble,
      Major: compForm.isMajor,
      tee: tee.name,
    })
    .from(compForm)
    .leftJoin(
      compFormToTee,
      eq(compForm.id, compFormToTee.compFormId)
    )
    .leftJoin(tee, eq(compFormToTee.teeId, tee.id))
    .where(eq(compForm.id, compFormId));
  
  }
  async getCompFormIdFromName(compName: string) {
    // const compForm = aliasedTable(schema.compForm, 'comp_form');
    const result =  this.database.query.compForm.findFirst({
      columns: {
        id: true
      },
      where: eq(compForm.title, compName)
    })

    return result
  }
}
