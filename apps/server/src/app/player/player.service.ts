import * as schema from '@lib/shared/drizzle';
import { InsertPlayer, member } from '@lib/shared/drizzle';
import { ICompetitor } from '@lib/shared/models';
import { Inject, Injectable } from '@nestjs/common';
import { and, asc, eq, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../../db/database/database-connection';

@Injectable()
export class PlayerService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>
  ) {}

  async addPlayersToCompetition(compId: number, players: ICompetitor[]) {
    // let rowCount = 0;

    const getPlayersToInsert = async (
      compId: number,
      players: ICompetitor[]
    ) => {
      const playersArray: InsertPlayer[] = [];
      for (const player of players) {
        const playerNameParts = player.name.split(' ');
        const memberForename = playerNameParts.at(0);
        const memberSurname = playerNameParts.at(-1);

        // deal with possible null values - set them to -1 to indicate that they do not apply.
        const grossScore = player.grossScore === null ? -1 : player.grossScore;
        const points = player.points === null ? -1 : player.points;
        const position = player.position === null ? -1 : player.position;

        // a card that has not been returned will have no handicap so set that to -1 as well.
        const handicap = player.handicap === null ? -1 : player.handicap;

        const playerMemberId = await this.database
          .select({ id: member.id })
          .from(member)
          .where(
            and(
              eq(member.foreName, memberForename),
              eq(member.surname, memberSurname)
            )
          );
        const playerDetail: InsertPlayer = {
          competitionId: compId,
          division: player.division,
          grossScore: grossScore,
          handicap: handicap,
          memberId: playerMemberId[0].id,
          position: position,
          stablefordPoints: points,
          inTwos: true,
          signedIn: true,
        };
        playersArray.push(playerDetail);
      }

      return playersArray;
    };

    const playersToInsert = await getPlayersToInsert(compId, players);
    // console.log(playersToInsert);
    let playersValuesString = '';
    for (const player of playersToInsert) {
      playersValuesString += `(${player.competitionId}, ${player.division}, ${player.grossScore}, ${player.handicap}, ${player.memberId}, ${player.position}, ${player.stablefordPoints}, ${player.signedIn}, ${player.inTwos}),`;
    }
    playersValuesString = playersValuesString.substring(
      0,
      playersValuesString.length - 1
    );

    const playersInsertSqlStatment = `WITH data(competition_id, division, gross_score, handicap, member_id, position, stableford_points, signed_in, in_twos) AS (values ${playersValuesString}) INSERT INTO player (competition_id, division, gross_score, handicap, member_id, position, stableford_points, signed_in, in_twos) SELECT d.competition_id, d.division, d.gross_score, d.handicap, d.member_id, d.position, d.stableford_points, d.signed_in, d.in_twos FROM data d WHERE not EXISTS (SELECT 1 FROM player m2 WHERE m2.competition_id = d.competition_id AND m2.member_id = d.member_id);`;

    // console.log(playersInsertSqlStatment);
    const res = await this.database.execute(playersInsertSqlStatment);
    // console.log(`${res.rowCount} players details added for competion`)
    return res;
  }

  async getPlayersInComp(compId: number) {
    return await this.database.query.player.findMany({
      where: eq(schema.player.competitionId, compId),
    });
  }

  async getPlayers() {
    return await this.database.select().from(schema.player);
  }

  async GetPlayersForCompToReview(compId: number) {
    return await this.database
      .select({
        memberId: schema.player.memberId,
        inTwos: schema.player.inTwos,
        signedIn: schema.player.signedIn,
        surname: schema.member.surname,
        forename: schema.member.foreName,
      })
      .from(schema.player)
      .where(eq(schema.player.competitionId, compId))
      .leftJoin(member, eq(member.id, schema.player.memberId))
      .orderBy(asc(schema.member.surname));
  }
}
