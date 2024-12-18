import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../db/database/database-connection';
import * as schema from '../../db/schema/player.schema';
import { NewPlayer } from '../../db/schema/player.schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ICompetitor } from '../../utils/models/report.interface';
import { member } from '../../db/schema/member.schema';
import { and, eq } from 'drizzle-orm';

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
      const playersArray: NewPlayer[] = [];
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
        const playerDetail: NewPlayer = {
          competitionId: compId,
          division: player.division,
          grossScore: grossScore,
          handicap: handicap,
          memberId: playerMemberId[0].id,
          position: position,
          stablefordPoints: points,
        };
        playersArray.push(playerDetail);
      }

      return playersArray;
    };

    const playersToInsert = await getPlayersToInsert(compId, players);
    // console.log(playersToInsert);
    let playersValuesString = '';
    for (const player of playersToInsert) {
      playersValuesString += `(${player.competitionId}, ${player.division}, ${player.grossScore}, ${player.handicap}, ${player.memberId}, ${player.position}, ${player.stablefordPoints}),`;
    }
    playersValuesString = playersValuesString.substring(
      0,
      playersValuesString.length - 1
    );

    const playersInsertSqlStatment = `WITH data(competition_id, division, gross_score, handicap, member_id, position, stableford_points) AS (values ${playersValuesString}) INSERT INTO player (competition_id, division, gross_score, handicap, member_id, position, stableford_points) SELECT d.competition_id, d.division, d.gross_score, d.handicap, d.member_id, d.position, d.stableford_points FROM data d WHERE not EXISTS (SELECT 1 FROM player m2 WHERE m2.competition_id = d.competition_id AND m2.member_id = d.member_id);`;

    // console.log(playersInsertSqlStatment);
    const res = await this.database.execute(playersInsertSqlStatment);
    // console.log(`${res.rowCount} players details added for competion`)
    return res;
  }
}
