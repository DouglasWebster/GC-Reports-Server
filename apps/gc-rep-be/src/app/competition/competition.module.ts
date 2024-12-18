import { Module } from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { CompetitionController } from './competition.controller';
import { DatabaseModule } from '../../db/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [CompetitionService ],
  controllers: [CompetitionController],
  exports: [CompetitionService]
})
export class CompetitionModule {}
