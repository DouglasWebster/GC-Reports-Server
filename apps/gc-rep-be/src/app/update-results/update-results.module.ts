import { Module } from '@nestjs/common';
import { UpdateResultsService } from './update-results.service';
import { UpdateResultController } from './update-result.controller';

@Module({
  providers: [UpdateResultsService],
  controllers: [UpdateResultController],
})
export class UpdateResultsModule {}
