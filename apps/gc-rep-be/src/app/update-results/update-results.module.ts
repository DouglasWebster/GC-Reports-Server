import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../db/database/database.module';
import { CompFormModule } from '../comp-form/comp-form.module';
import { MemberModule } from '../member/member.module';
import { UpdateResultController } from './update-result.controller';
import { UpdateResultsService } from './update-results.service';
import { CompetitionModule } from '../competition/competition.module';
import { PlayerModule } from '../player/player.module';


@Module({
  imports: [MemberModule, DatabaseModule, CompFormModule, CompetitionModule, PlayerModule],
  providers: [UpdateResultsService],
  controllers: [UpdateResultController],
})
export class UpdateResultsModule {}
