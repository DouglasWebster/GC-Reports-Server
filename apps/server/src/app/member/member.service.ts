import { InsertMember, member } from '@lib/shared/drizzle';
import { HttpStatus, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DrizzleService } from '../../db/database/drizzle.service';

@Injectable()
export class MemberService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async getMembers() {
    return await this.drizzleService.db.query.member.findMany();
  }

  async countMembers() {
    return await this.drizzleService.db.$count(member);
  }

  async getMemberByName(memberName: InsertMember) {
    const result = await this.drizzleService.db
      .select()
      .from(member)
      .where(
        and(
          eq(member.foreName, memberName.foreName),
          eq(member.surname, memberName.surname)
        )
      );
    return result;
  }

  async createMember(memberName: InsertMember) {
    const memberId = await this.drizzleService.db
      .select({ id: member.id })
      .from(member)
      .where(
        and(
          eq(member.foreName, memberName.foreName),
          eq(member.surname, memberName.surname)
        )
      );

    if (memberId.length !== 0)
      return { error: HttpStatus.FOUND, message: 'Member already exists.' };
    await this.drizzleService.db.insert(member).values(memberName);
  }

  async insertMembers(members: InsertMember[]): Promise<number> {
    let membersDetails = '';
    members.forEach((member) => {
      // Database do not like apostrophes in names so escape them by doubling them
      member.surname = member.surname.replace("'", "''");
      member.foreName = member.foreName.replace("'", "''");

      membersDetails += `('${member.foreName}','${member.surname}'),`;
    });

    membersDetails = membersDetails.substring(0, membersDetails.length - 1);

    const sqlStatement = `WITH data(fore_name, surname) AS (values ${membersDetails}) INSERT INTO member (fore_name, surname) SELECT d.fore_name, d.surname FROM data d WHERE not EXISTS (SELECT 1 FROM member m2 WHERE m2.fore_name = d.fore_name AND m2.surname = d.surname);`;

    // console.log(`sql statement: ${sqlStatement}`)

    const res = await this.drizzleService.db.execute(sqlStatement);
    return res.rowCount;
  }
}
