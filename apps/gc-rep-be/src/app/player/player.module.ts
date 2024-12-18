import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { DatabaseModule } from '../../db/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PlayerService],
  exports: [PlayerService]
})
export class PlayerModule {}
