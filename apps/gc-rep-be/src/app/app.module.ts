import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../db/database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompFormModule } from './comp-form/comp-form.module';
import { CompetitionModule } from './competition/competition.module';
import { MemberModule } from './member/member.module';
import { PlayerModule } from './player/player.module';
import { TeeModule } from './tee/tee.module';
import { UpdateResultsModule } from './update-results/update-results.module';

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
    UpdateResultsModule,
    MemberModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
