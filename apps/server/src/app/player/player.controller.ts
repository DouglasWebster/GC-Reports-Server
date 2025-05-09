import { Controller, Get, Param } from '@nestjs/common';
import { PlayerService } from './player.service';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get()
  async getPlayers() {
    return this.playerService.getPlayers();
  }

  @Get('comp-review/:id')
  async GetPlayersForCompToReview(@Param('id') id: string) {
    return this.playerService.GetPlayersForCompToReview(parseInt(id));
  }

  @Get(':id')
  async getPlayersInComp(@Param('id') id: string) {
    return this.playerService.getPlayersInComp(parseInt(id));
  }
}
