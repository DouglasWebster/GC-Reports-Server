import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { DatabaseModule } from '../../db/database/database.module';
import { PlayerController } from './player.controller';

@Module({
  imports: [DatabaseModule],
  providers: [PlayerService],
  exports: [PlayerService],
  controllers: [PlayerController],
})
export class PlayerModule {}
