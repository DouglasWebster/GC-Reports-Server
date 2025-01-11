import { Controller, Get, Param } from '@nestjs/common';
import { CompetitionService } from './competition.service';

@Controller('competitions')
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  @Get(':id')
  async getCompetition(@Param('id') compId: string) {
    console.log(`getting competition with id of ${compId}`);
    return this.competitionService.getCompetition(parseInt(compId));
  }

  @Get()
  async getCompetitionList() {
    console.log(`getting all competition list`);
    return this.competitionService.getCompetitionList();
  }

  @Get('details')
  async getCompetitionDetails() {
    return this.competitionService.getCompetitionDetails();
  }

  @Get('count')
  async getAllCompetitionsCount() {
    return this.competitionService.getAllCompsCount();
  }

  @Get('count-unreviewed')
  async getCompetitionsToReviewCount() {
    return this.competitionService.getCompsToReviewCount();
  }

  @Get('list-unreviewed')
  async getCompetitionUnrevieweList() {
    return this.competitionService.getCompetitionUnreviewedList();
  }
}
