import { Controller, Get } from '@nestjs/common';
import { CompetitionService } from './competition.service';

@Controller('competitions')
export class CompetitionController {
    constructor(private readonly competitionService: CompetitionService) {}

    @Get()
    async getCompetitionList() {
        return this.competitionService.getCompetitionList()
    }
}
