import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from './database-connection';
import { ConfigService } from '@nestjs/config';
// import * as teesSchema from '../tee/schema';
// import * as compFormSchema from '../comp-form/schema';
// import * as competitionSchema from '../competition/schema'
// import * as playerSchema from '../player/schema'
// import * as memberSchema from '../member/schema'
import * as schemas from '../schema'

@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: () => {
        return drizzle({
          connection: process.env.DATABASE_URL,
          schema: {
            // ...teesSchema,
            // ...compFormSchema,
            // ...competitionSchema,
            // ...playerSchema,
            // ...memberSchema,
            ...schemas
            
          },
          casing: 'snake_case',
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
