import * as schema from '@libs/drizzle';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../../db/database/database-connection';

@Injectable()
export class TeeService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>
  ) {}

  async getTees() {
    return this.database.query.tee.findMany();
  }

  async getTee(teeId: number) {
    return this.database.query.tee.findFirst({
      where: eq(schema.tee.id, teeId),
    });
  }
}
