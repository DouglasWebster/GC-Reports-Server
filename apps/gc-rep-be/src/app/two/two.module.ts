import { Module } from '@nestjs/common';
import { TwoService } from './two.service';
import { DatabaseModule } from '../../db/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [TwoService],
  exports: [TwoService]
})
export class TwoModule {}
