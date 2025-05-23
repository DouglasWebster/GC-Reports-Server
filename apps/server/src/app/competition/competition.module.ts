import { Module } from '@nestjs/common';
import { CompetitionController } from './competition.controller';
import { CompetitionService } from './competition.service';

@Module({
  providers: [CompetitionService],
  controllers: [CompetitionController],
  exports: [CompetitionService],
})
export class CompetitionModule {}
