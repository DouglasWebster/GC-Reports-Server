import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../../db/database/database-connection';
import * as schema from '@lib/drizzle';
import { member, InsertMember } from '@lib/drizzle';

@Injectable()
export class MemberService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>
  ) {}

  async getMembers() {
    return await this.database.query.member.findMany();
  }

  async countMembers() {
    return await this.database.$count(member);
  }

  async getMemberByName(memberName: InsertMember) {
    const result = await this.database
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
    const memberId = await this.database
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
    await this.database.insert(member).values(memberName);
  }

  async insertMembers(members: InsertMember[]) : Promise<number> {
    let membersDetails = '';
    members.forEach((member) => {
      membersDetails += `('${member.foreName}','${member.surname}'),`
    })
    
    membersDetails = membersDetails.substring(0, membersDetails.length - 1)

    const  sqlStatement = 
    `WITH data(fore_name, surname) AS (values ${membersDetails}) INSERT INTO member (fore_name, surname) SELECT d.fore_name, d.surname FROM data d WHERE not EXISTS (SELECT 1 FROM member m2 WHERE m2.fore_name = d.fore_name AND m2.surname = d.surname);`;
    
    // console.log(`sql statement: ${sqlStatement}`)

    const res = await this.database.execute(sqlStatement)
    return res.rowCount
  }
}
