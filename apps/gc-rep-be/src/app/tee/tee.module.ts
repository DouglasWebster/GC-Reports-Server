import { Module } from '@nestjs/common';
import { TeeController } from './tee.controller';
import { TeeService } from './tee.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TeeController],
  providers: [TeeService],
  exports: [TeeService]
})
export class TeeModule {}
