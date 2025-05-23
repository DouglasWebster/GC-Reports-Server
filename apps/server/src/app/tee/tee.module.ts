import { Module } from '@nestjs/common';
import { TeeController } from './tee.controller';
import { TeeService } from './tee.service';

@Module({
  controllers: [TeeController],
  providers: [TeeService],
  exports: [TeeService],
})
export class TeeModule {}
