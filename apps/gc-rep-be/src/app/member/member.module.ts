import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { DatabaseModule } from '../../db/database/database.module';

@Module({
  imports : [DatabaseModule],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
