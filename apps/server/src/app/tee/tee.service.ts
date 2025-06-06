import * as schema from '@lib/shared/drizzle';
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '../../db/database/drizzle.service';

@Injectable()
export class TeeService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async getTees() {
    return this.drizzleService.db.query.tee.findMany();
  }

  async getTee(teeId: number) {
    return this.drizzleService.db.query.tee.findFirst({
      where: eq(schema.tee.id, teeId),
    });
  }

  getTeesForCompetition(arg0: number) {
    return this.drizzleService.db
      .select({
        teeName: schema.tee.name,
        isLadies: schema.tee.ladies,
        isMens: schema.tee.mens,
      })
      .from(schema.competition)
      .leftJoin(
        schema.compFormToTee,
        eq(schema.competition.compFormId, schema.compFormToTee.compFormId)
      )
      .leftJoin(schema.tee, eq(schema.compFormToTee.teeId, schema.tee.id))
      .where(eq(schema.competition.id, arg0));
  }
}