import { Inject, Injectable } from '@nestjs/common';
import { and, asc, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../../db/database/database-connection';
import { member, InsertTwo } from '@lib/shared/drizzle';
import * as schema from '@lib/shared/drizzle';
import { ITwos } from '@lib/shared/models';

@Injectable()
export class TwoService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>
  ) {}

  async registerTwosForCompetition(compId: number, twos: ITwos[]) {
    const getTwosToRegister = async (compId: number, twos: ITwos[]) => {
      const twoArray: InsertTwo[] = [];
      for (const two of twos) {
        const memberNameParts = two.name.split(' ');
        const memberForename = memberNameParts.at(0);
        const memberSurname = memberNameParts.at(-1);

        const twoMemberId = await this.database
          .select({ id: member.id })
          .from(member)
          .where(
            and(
              eq(member.foreName, memberForename),
              eq(member.surname, memberSurname)
            )
          );

        const twoDetail: InsertTwo = {
          competitionId: compId,
          memberId: twoMemberId[0].id,
          hole: two.hole,
        };
        twoArray.push(twoDetail);
      }
      return twoArray;
    };

    const twosToRegister = await getTwosToRegister(compId, twos);

    let twosValueString = '';
    for (const two of twosToRegister) {
      twosValueString += `(${two.competitionId}, ${two.memberId}, ${two.hole}),`;
    }
    twosValueString = twosValueString.substring(0, twosValueString.length - 1);

    const twosInsertSqlStatment = `WITH data(competition_id, member_id, hole) AS (values ${twosValueString}) INSERT INTO two (competition_id, member_id, hole)SELECT d.competition_id, d.member_id, d.hole FROM data d WHERE not EXISTS (SELECT 1 FROM two m2 WHERE m2.competition_id = d.competition_id AND m2.member_id = d.member_id AND m2.hole = d.hole);`;
    console.log(`twos insert statement: \n${twosInsertSqlStatment}`);
    const res = await this.database.execute(twosInsertSqlStatment);
    console.log(`${res.rowCount} twos registered for the competion`);

    return res;
  }

  async getTwosWinnersForCompetition(compId: number) {
    const twos = await this.database
      .select({
        foreName: schema.member.foreName,
        surname: schema.member.surname,
        hole: schema.two.hole,
        inTwos: schema.player.inTwos,
      })
      .from(schema.two)
      .leftJoin(schema.member, eq(schema.two.memberId, schema.member.id))
      .leftJoin(
        schema.player,
        and(
          eq(schema.member.id, schema.player.memberId),
          eq(schema.two.competitionId, schema.player.competitionId)
        )
      )
      .where(
        and(
          eq(schema.two.competitionId, compId),
          eq(schema.player.inTwos, true)
        )
      )
      .orderBy(schema.player.inTwos, schema.member.surname, schema.two.hole);
    return twos;
  }
}
