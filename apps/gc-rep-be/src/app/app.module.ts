import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../db/database/database.module';
import { TeeModule } from './tee/tee.module';
import { CompFormModule } from './comp-form/comp-form.module';
import { CompetitionModule } from './competition/competition.module';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TeeModule,
    CompFormModule,
    CompetitionModule,
    PlayerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
