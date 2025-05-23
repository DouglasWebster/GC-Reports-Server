import { Module } from '@nestjs/common';
import { TwoService } from './two.service';
import { TwoController } from './two.controller';

@Module({
  providers: [TwoService],
  exports: [TwoService],
  controllers: [TwoController],
})
export class TwoModule {}
