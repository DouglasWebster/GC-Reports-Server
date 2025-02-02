import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { ICompReviewUpdate } from '@libs/models';
import { repl } from '@nestjs/core';

@Controller('competitions')
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  @Get('list')
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

  @Get('unreviewed-json')
  async getUnreviewedJson() {
    const resp = this.competitionService
      .getCompetitionUnreviewedList()
      .then((data) => {
        const respString = '{ "data" : ' + JSON.stringify(data) + '}';
        console.log(respString);
        return JSON.parse(respString);
      });
    return resp;
  }

  @Get('review/:id')
  async getReviewComp(@Param('id') id: string) {
    return this.competitionService.getCompetitionReviewDetails(parseInt(id));
  }

  @Get(':id')
  async getCompetition(@Param('id') id: string) {
    console.log(`getting competition with id of ${id}`);
    return this.competitionService.getCompetition(parseInt(id));
  }

  @Patch('update-comp')
  async updateCompAndPlayersAfterReview(@Body() updateData: ICompReviewUpdate) {
    console.log('Updating competition with: ', updateData);
    const reply  =
      this.competitionService.updateCompAndPlayersAfterReview(updateData);
    console.log(reply)
    return reply;
  }
}
