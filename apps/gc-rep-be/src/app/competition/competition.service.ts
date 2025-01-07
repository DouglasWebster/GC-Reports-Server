import { compForm } from '../../db/schema/format.schema';
import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../../db/database/database-connection';
import * as schema from '../../db/schema/competition.schema';

@Injectable()
export class CompetitionService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>
  ) {}
  
  async getCompetitionList() {
      return await this.database.select({
        id: schema.competition.id,
        date: schema.competition.compDate,
        compFormat: compForm.title,
        validated: schema.competition.isValid
      })
      .from(schema.competition)
      .leftJoin(compForm, eq(compForm.id, schema.competition.compFormId))
      .orderBy(desc(schema.competition.compDate))
  }
  
  async createNamedComp(record: schema.NewCompetion) {
    const competitionId = await this.database
      .select({
        date: schema.competition.compDate,
        formatId: schema.competition.compFormId,
      })
      .from(schema.competition)
      .where(
        and(
          eq(schema.competition.compDate, record.compDate),
          eq(schema.competition.compFormId, record.compFormId)
        )
      );

    if (competitionId.length !== 0) return undefined;
    return await this.database
      .insert(schema.competition)
      .values(record)
      .returning({ competitionId: schema.competition.id });
  }

  async getCompetitionFromFormatIdAndDate(
    formatId: number,
    date: Date
  ) {
    return await this.database.query.competition.findFirst({
      where: and(eq(schema.competition.compFormId, formatId),
    eq(schema.competition.compDate, date))
    })
  }
}
