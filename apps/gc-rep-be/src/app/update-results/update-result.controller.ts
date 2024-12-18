import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IResult } from '../../utils/models/report.interface';
import { UpdateResultsService } from './update-results.service';

@Controller('update-result')
export class UpdateResultController {
  constructor(private readonly updateResultService: UpdateResultsService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result: IResult = await this.updateResultService.storeResult(
      file.buffer.toString()
    );
    console.log(result);

    if (!result) {
      return 'could not read competition results file';
    }

    const replyMessages: string[] = [];

    // add any players to the member list that aren't already on it.
    const insertCount = await this.updateResultService.sendUnknowPlayersToDB(
      result
    );

    if (insertCount === 0) replyMessages.push('Players list was up to date');
    else
      replyMessages.push(
        `${insertCount} unknow players(s) added to the member list.`
      );

    // setup the basis for new competion

    try {
      await this.updateResultService.recordCompetition(result).then(() => {
        replyMessages.push(
          `Competion outline dated ${result.date.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })} added to database`
        );
      });
    } catch (error) {
      if (error instanceof Error) replyMessages.push(error.message);
    }

    try {
      await this.updateResultService.addPlayers(result).then((result) => {
        replyMessages.push(
          `${result} players added to the players list for this competition`
        );
      });
    } catch (error) {
      if (error instanceof Error) replyMessages.push(error.message);
    }

    return replyMessages;
  }
}
