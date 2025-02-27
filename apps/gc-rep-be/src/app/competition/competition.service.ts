import * as schema from '@libs/drizzle';
import { competition, compForm } from '@libs/drizzle';
import { ICompReviewUpdate } from '@libs/models';
import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq, max, min, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../../db/database/database-connection';

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

  async getCompetitionReviewedList(isReviewed: boolean) {
    return await this.database
      .select({
        id: competition.id,
        // date: competition.compDate,
        date: sql<string>`to_char(${competition.compDate}, 'YYYY-MM-DD')`.as(
          'date'
        ),
        compFormat: compForm.title,
        validated: competition.isValid,
      })
      .from(competition)
      .where(eq(competition.isValid, isReviewed))
      .leftJoin(compForm, eq(compForm.id, schema.competition.compFormId))
      .orderBy(desc(competition.compDate));
  }

  async getCompetition(compId: number) {
    return await this.database.query.competition.findFirst({
      where: eq(competition.id, compId),
    });
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

  async getCompsReviewedCount() {
    return await this.database.$count(
      competition,
      eq(competition.isValid, true)
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

  async getCompetitionReviewDetails(compId: number) {
    return await this.database.query.competition.findFirst({
      where: eq(competition.id, compId),
      columns: {
        id: true,
        compDate: true,
        computerEntries: true,
        twosEntered: true,
        playerCount: true,
        sheetEntries: true,
      },
      with: {
        compForm: {
          columns: {
            title: true,
          },
        },
      },
    });
  }

  async updateCompAndPlayersAfterReview(reviewResult: ICompReviewUpdate) {
    const replyMessage: string[] = [];
    const updatesToDo = reviewResult.players.length + 1;
    let updatesDone = 0;
    try {
      return await this.database.transaction(async (compDetailsTx) => {
        for (const member of reviewResult.players) {
          const playerResult = await compDetailsTx
            .update(schema.player)
            .set({
              inTwos: member.inTwos,
              signedIn: member.onSheet,
            })
            .where(
              and(
                eq(schema.player.competitionId, reviewResult.compId),
                eq(schema.player.memberId, member.memberId)
              )
            );
          if (playerResult.rowCount === 1) ++updatesDone;
        }
        if (updatesDone !== reviewResult.players.length)
          replyMessage.push('Failed to update all players details.');
        else replyMessage.push('Players details updated successfully.');

        const compResult = await compDetailsTx
          .update(competition)
          .set({
            sheetEntries: reviewResult.signedInCount,
            twosEntered: reviewResult.twosCount,
            isValid: true,
          })
          .where(
            and(
              eq(competition.id, reviewResult.compId),
              eq(competition.isValid, false)
            )
          );
        if (compResult.rowCount === 1) {
          ++updatesDone;
          replyMessage.push('Competition details updated successfully.');
        } else replyMessage.push('Failed to update competition details.');

        if (updatesDone !== updatesToDo) {
          replyMessage.push(
            'Not all updates completed successfully.  All updates cancelled!'
          );
          compDetailsTx.rollback();
        } else replyMessage.push('All updates completed successfully.');

        return replyMessage;
      });
    } catch (error) {
      console.log(error);
      if (updatesDone !== updatesToDo) {
        return replyMessage;
      }
    }
  }

  async getMinMaxDates() {
    return await this.database
      .select({
        minDate: min(competition.compDate),
        maxDate: max(competition.compDate),
      })
      .from(competition)
      .where(eq(competition.isValid, true));
  }

  async getCompetitionResults(compId: number) {
    const isValid = await this.database.query.competition.findFirst({
      where: and(eq(competition.id, compId), eq(competition.isValid, true)),
    });
    console.log(isValid);
    if (isValid === undefined) return isValid;
    return await this.database
      .select({
        foreName: schema.member.foreName,
        surnamne: schema.member.surname,
        handicap: schema.player.handicap,
        division: schema.player.division,
        position: schema.player.position,
        score: schema.player.grossScore,
        stablefordPoints: schema.player.stablefordPoints,
        inTwos: schema.player.inTwos,
        signedIn: schema.player.signedIn,
      })
      .from(schema.player)
      .leftJoin(schema.member, eq(schema.member.id, schema.player.memberId))
      .where(
        and(
          eq(schema.player.competitionId, compId)
        )
      );
  }
}
