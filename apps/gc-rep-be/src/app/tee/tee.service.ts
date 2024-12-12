import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../db/database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema/tee.schema';
import { eq } from 'drizzle-orm';

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
