import { Module } from '@nestjs/common';
import { TwoService } from './two.service';
import { DatabaseModule } from '../../db/database/database.module';
import { TwoController } from './two.controller';

@Module({
  imports: [DatabaseModule],
  providers: [TwoService],
  exports: [TwoService],
  controllers: [TwoController],
})
export class TwoModule {}
