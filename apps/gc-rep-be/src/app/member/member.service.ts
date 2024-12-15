import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../../db/database/database-connection';
import * as schema from '../../db/schema/member.schema';
import { member } from './schema';

@Injectable()
export class MemberService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>
  ) {}

  async getMembers() {
    await this.database.query.member.findMany();
  }

  async countMembers() {
    const size: number = await this.database.$count(member);
    return size;
  }

  async getMemberByName(memberName: typeof schema.member.$inferInsert) {
    const result = await this.database
      .select()
      .from(schema.member)
      .where(
        and(
          eq(schema.member.foreName, memberName.foreName),
          eq(schema.member.surname, memberName.surname)
        )
      );
    return result;
  }

  async createMember(member: typeof schema.member.$inferInsert) {
    const memberId = await this.database
      .select({ id: schema.member.id })
      .from(schema.member)
      .where(
        and(
          eq(schema.member.foreName, member.foreName),
          eq(schema.member.surname, member.surname)
        )
      );

    if (memberId.length !== 0)
      return { error: HttpStatus.FOUND, message: 'Member already exists.' };
    await this.database.insert(schema.member).values(member);
  }

  async insertMembers(members: schema.NewMember[]) : Promise<number> {
    // members.forEach(async (member) => {
    //   const foundMember = await this.getMemberByName(member);
    //   if (foundMember.length === 0) this.createMember(member);
    // });
    let membersDetails = '';
    members.forEach((member) => {
      membersDetails += `('${member.foreName}','${member.surname}'),`
    })
    
    membersDetails = membersDetails.substring(0, membersDetails.length - 1)

    const  sqlStatement = 
    `WITH data(fore_name, surname) AS (values ${membersDetails}) INSERT INTO member (fore_name, surname) SELECT d.fore_name, d.surname FROM data d WHERE not EXISTS (SELECT 1 FROM member m2 WHERE m2.fore_name = d.fore_name AND m2.surname = d.surname);`;
    
    // console.log(`sql statement: ${sqlStatement}`)

    const res = await this.database.execute(sqlStatement)
    console.log(`rows inserted: ${res.rowCount}`)
    return res.rowCount
  }
}
