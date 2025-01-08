import { Controller, Get } from '@nestjs/common';
import { CompetitionService } from './competition.service';

@Controller('competitions')
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  @Get()
  async getCompetitionList() {
    return this.competitionService.getCompetitionList();
  }

  @Get('details')
  async getCompetitionDetails() {
    return this.competitionService.getCompetitionDetails()
  }

  @Get('count')
  async getAllCompetitionsCount() {
    return this.competitionService.getAllCompsCount();
  }

  @Get('to_review')
  async getCompetitionsToReviewCount() {
    return this.competitionService.getCompsToReviewCount();
  }
}
