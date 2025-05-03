import * as schema from '@lib/shared/drizzle';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../../db/database/database-connection';

@Injectable()
export class TeeService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>
  ) {}
  
  async getTees() {
    return this.database.query.tee.findMany();
  }
  
  async getTee(teeId: number) {
    return this.database.query.tee.findFirst({
      where: eq(schema.tee.id, teeId),
    });
  }

  getTeesForCompetition(arg0: number) {
    return this.database.select({teeName: schema.tee.name, isLadies: schema.tee.ladies, isMens: schema.tee.mens }).from(schema.competition).leftJoin(schema.compFormToTee, eq(schema.competition.compFormId, schema.compFormToTee.compFormId)).leftJoin(schema.tee, eq(schema.compFormToTee.teeId, schema.tee.id)).where(eq(schema.competition.id, arg0));
  }
}

//   SELECT tee.name as "Tee", tee.ladies as "Ladies", tee.mens as "Mens" FROM competition
// left join comp_form_to_tee
// ON comp_form_to_tee.comp_form_id = competition.comp_form_id
// left join tee ON tee.id = comp_form_to_tee.tee_id
// where competition.id = 5