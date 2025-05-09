import { Controller, Get, Param } from '@nestjs/common';
import { TwoService } from './two.service';

@Controller('twos')
export class TwoController {
  constructor(private readonly twoService: TwoService) {}

  @Get('comp_twos/:id')
  async getTwosWinnersForCompetition(@Param('id') id: string) {
    return this.twoService.getTwosWinnersForCompetition(parseInt(id));
  }
}
