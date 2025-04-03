import { Injectable, Scope } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { promiseTimeout, TimeoutError as PromiseTimeoutError } from '@nestjs/terminus/dist/utils';
import { sql } from 'drizzle-orm';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

const ENV = process.env.ENVIRONMENT;

@Injectable({ scope: Scope.TRANSIENT })
export class HealthService {
  db = drizzle({
    connection: ENV==='docker' ? process.env.DOCKER_URL : process.env.DATABASE_URL,
    casing: 'snake_case',
  })
    // process.env.DA?TABASE_URL);

  constructor(
    private readonly healthIndicatorService: HealthIndicatorService
  ) {}

  private async pingDB(connection: NodePgDatabase, timeout: number) {
    const check: Promise<any> = connection.execute(sql`SELECT 1`);
    return await promiseTimeout(timeout, check);
  }

  public async pingCheck<Key extends string = string>(
    key: Key,
  ): Promise<HealthIndicatorResult<Key>> {
    const check = this.healthIndicatorService.check(key);
    const timeout = 1000;
    const connection = this.db;
    if (!connection) {
      return check.down('No connection to database' );
    }
    try {
      await this.pingDB(connection, timeout);
    } catch (err) {
      if (err instanceof PromiseTimeoutError) {
        return check.down(`timeout of ${timeout}ms exceeded`);
      }
      return check.down('database response error');
    }
    return check.up();
  }
}
