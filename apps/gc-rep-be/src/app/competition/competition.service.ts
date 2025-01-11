import { compForm, competition } from '@libs/drizzle';
import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../../db/database/database-connection';
import * as schema from '@libs/drizzle';

@Injectable()
export class CompetitionService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>
  ) {}
  
  async getCompetitionList() {
    return await this.database
    .select({
      id: competition.id,
      date: competition.compDate,
      compFormat: compForm.title,
      validated: competition.isValid,
    })
    .from(competition)
    .leftJoin(compForm, eq(compForm.id, schema.competition.compFormId))
    .orderBy(desc(competition.compDate));
  }
  
  async getCompetitionUnreviewedList() {
    return await this.database
    .select({
      id: competition.id,
      date: competition.compDate,
      compFormat: compForm.title,
      validated: competition.isValid,
    })
    .from(competition)
    .where(eq(competition.isValid, false))
    .leftJoin(compForm, eq(compForm.id, schema.competition.compFormId))
    .orderBy(desc(competition.compDate));
  }
  
  async getCompetition(compId: number) {
    return await this.database.query.competition.findFirst({
      where: eq(competition.id, compId)
    })
  }
  
  async getCompetitionDetails() {
    return await this.database.query.competition.findMany();
  }

  async getAllCompsCount() {
    return await this.database.$count(competition);
  }

  async getCompsToReviewCount() {
    return await this.database.$count(
      competition,
      eq(competition.isValid, false)
    );
  }

  async createNamedComp(record: schema.InsertCompetion) {
    const competitionId = await this.database
      .select({
        date: competition.compDate,
        formatId: competition.compFormId,
      })
      .from(competition)
      .where(
        and(
          eq(competition.compDate, record.compDate),
          eq(competition.compFormId, record.compFormId)
        )
      );

    if (competitionId.length !== 0) return undefined;
    return await this.database
      .insert(competition)
      .values(record)
      .returning({ competitionId: competition.id });
  }

  async getCompetitionFromFormatIdAndDate(formatId: number, date: Date) {
    return await this.database.query.competition.findFirst({
      where: and(
        eq(competition.compFormId, formatId),
        eq(competition.compDate, date)
      ),
    });
  }
}
