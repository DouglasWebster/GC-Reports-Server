import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../db/database/database.module';
import { MemberModule } from '../member/member.module';
import { UpdateResultController } from './update-result.controller';
import { UpdateResultsService } from './update-results.service';


@Module({
  imports: [MemberModule, DatabaseModule],
  providers: [UpdateResultsService],
  controllers: [UpdateResultController],
})
export class UpdateResultsModule {}
