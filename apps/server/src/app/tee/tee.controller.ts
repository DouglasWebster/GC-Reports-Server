import { Controller, Get, Param } from '@nestjs/common';
import { TeeService } from './tee.service';

@Controller('tees')
export class TeeController {
  constructor(private readonly teeService: TeeService) {}

  @Get()
  async getTees() {
    return this.teeService.getTees();
  }

  @Get(':id')
  async getTee(@Param('id') teeId: string) {
    return this.teeService.getTee(parseInt(teeId));
  }

  @Get('competition/:id')
  async getTeesForCompetition(@Param('id') competitionId: string) {
    return this.teeService.getTeesForCompetition(parseInt(competitionId));
  }
}
