import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../../db/database/database-connection';
import * as schema from '../../db/schema/member.schema';

@Injectable()
export class MemberService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>
  ) {}

  async getMembers() {
    await this.database.query.member.findMany();
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
    console.log(result);
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
    for (const id in memberId) console.log(id)

    if(memberId.length !== 0 ) return { error: HttpStatus.FOUND, message: "Member already exists."}
    await this.database.insert(schema.member).values(member);
  }
}
