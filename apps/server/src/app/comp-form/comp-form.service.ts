import { compForm, compFormToTee, tee } from '@lib/shared/drizzle';
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '../../db/database/drizzle.service';

@Injectable()
export class CompFormService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async getCompsForms() {
    // const compForm = aliasedTable(schema.compForm, 'comp_form');
    return this.drizzleService.db
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
      .leftJoin(compFormToTee, eq(compForm.id, compFormToTee.compFormId))
      .leftJoin(tee, eq(compFormToTee.teeId, tee.id));
  }

  getCompsForm(compFormId: number) {
    // const compForm = aliasedTable(schema.compForm, 'comp_form');
    return this.drizzleService.db
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
      .leftJoin(compFormToTee, eq(compForm.id, compFormToTee.compFormId))
      .leftJoin(tee, eq(compFormToTee.teeId, tee.id))
      .where(eq(compForm.id, compFormId));
  }
  async getCompFormIdFromName(compName: string) {
    // const compForm = aliasedTable(schema.compForm, 'comp_form');
    const result = this.drizzleService.db.query.compForm.findFirst({
      columns: {
        id: true,
      },
      where: eq(compForm.title, compName),
    });

    return result;
  }
}
