import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateResultsService } from './update-results.service';
import { Express } from 'express';
import { Multer } from 'multer';
import { IResult, ICompetitor } from '../../utils/models/report.interface';

@Controller('update-result')
export class UpdateResultController {
  constructor(
    private readonly updateResultService: UpdateResultsService
  ) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result: IResult = await this.updateResultService.storeResult(
      file.buffer.toString()
    );
    if (!result) {
      return 'could not read competition results file';
    } else {
      return 'Could not read the data';
    }
  }

  sendMembersToDB(results: IResult) {
    const players: ICompetitor[] = results.players;
    const playersNames : string[] = []
    for (let index = 0; index < players.length; ++index) {
        playersNames.push(players.at(index).name)
    };
  }
}
