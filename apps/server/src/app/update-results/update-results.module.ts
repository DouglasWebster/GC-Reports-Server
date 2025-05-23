import { Module } from '@nestjs/common';
import { CompFormModule } from '../comp-form/comp-form.module';
import { CompetitionModule } from '../competition/competition.module';
import { MemberModule } from '../member/member.module';
import { PlayerModule } from '../player/player.module';
import { TwoModule } from '../two/two.module';
import { UpdateResultController } from './update-result.controller';
import { UpdateResultsService } from './update-results.service';

@Module({
  imports: [
    MemberModule,
    CompFormModule,
    CompetitionModule,
    PlayerModule,
    TwoModule,
  ],
  providers: [UpdateResultsService],
  controllers: [UpdateResultController],
})
export class UpdateResultsModule {}
