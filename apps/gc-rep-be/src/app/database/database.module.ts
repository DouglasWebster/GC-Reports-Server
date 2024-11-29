import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from './database-connection';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: () => {
        return drizzle({
          connection: process.env.DATABASE_URL,
          schema: {},
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
