import { compForm, competition } from '@libs/drizzle';
import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../../db/database/database-connection';
import * as schema from '@libs/drizzle';
import { ICompReviewUpdate } from '@libs/models';

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
        // date: competition.compDate,
        date: sql<string>`to_char(${competition.compDate}, 'YYYY-MM-DD')`.as(
          'date'
        ),
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
    return await this.database.transaction(async (compDetailsTx) => {
      const replyMessage: string[] = []
      try {
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

        if (compResult.rowCount != 1) {
          replyMessage.push(`Failed to update competition details.\nReview update transaction terminated: ${compResult.rowCount} competition rows affected`)
          console.log(
            `Failed to update competition details.\nReview update transaction terminated: ${compResult.rowCount} competition rows affected`
          );
          compDetailsTx.rollback();
        }

        return await this.database.transaction(async (playerDetailTx) => {
          try {
            for (const member of reviewResult.players) {
              const playerResult = await playerDetailTx
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
              if (playerResult.rowCount !== 1) {
                replyMessage.push(`Failed to ammend a players details.`)
                console.log(
                  `Review update transaction terminated: ${compResult.rowCount} competition rows affected`
                );
                playerDetailTx.rollback();
                compDetailsTx.rollback();
              }
            }
          } catch (error) {
            replyMessage.push('Player update transaction canceled.')
            if (error) return ;
          }
        });
      } catch (error) {
        replyMessage.push('Competition update transaction canceled.')
        if (error) return replyMessage;
      }
      replyMessage.push('Competition updated successfull')
      return replyMessage;
    });
  }
}
