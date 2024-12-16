import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../db/database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { aliasedTable, eq } from 'drizzle-orm';
import * as schema from '../../db/schema/format.schema';
import { TeeService } from '../tee/tee.service';
import { tee } from '../../db/schema';

@Injectable()
export class CompFormService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
    private readonly teeService: TeeService
  ) {}
  
  async getCompsForms() {
    const compForm = aliasedTable(schema.compForm, 'comp_form');
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
    .from(schema.compForm)
    .leftJoin(
      schema.compFormToTee,
      eq(schema.compForm.id, schema.compFormToTee.compFormId)
    )
    .leftJoin(tee, eq(schema.compFormToTee.teeId, tee.id));
  }
  
  getCompsForm(compFormId: number) {
    const compForm = aliasedTable(schema.compForm, 'comp_form');
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
    .from(schema.compForm)
    .leftJoin(
      schema.compFormToTee,
      eq(schema.compForm.id, schema.compFormToTee.compFormId)
    )
    .leftJoin(tee, eq(schema.compFormToTee.teeId, tee.id))
    .where(eq(compForm.id, compFormId));
  
  }
  async getCompFormIdFromName(compName: string) {
    const compForm = aliasedTable(schema.compForm, 'comp_form');
    return this.database.query.compForm.findMany({
      columns: {id: true},
      where: eq(compForm.title, compName)
    })
      
  }
}
