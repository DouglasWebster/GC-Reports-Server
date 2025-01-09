import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IResult } from '@libs/models';
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

    if (insertCount === 0) replyMessages.push('Members: list was up to date');
    else
      replyMessages.push(
        `Members: ${insertCount} unknow players(s) added to the member list.`
      );

    // setup the basis for new competion

    try {
      await this.updateResultService.recordCompetition(result).then(() => {
        replyMessages.push(
          `Competion: outline dated ${result.date.toLocaleDateString(
            undefined,
            {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }
          )} added to database`
        );
      });
    } catch (error) {
      if (error instanceof Error) replyMessages.push(error.message);
    }

    try {
      await this.updateResultService
        .addPlayers(result)
        .then((playersAddedCount) => {
          if (playersAddedCount === 0)
            replyMessages.push('Players: all players already registered.');
          else
            replyMessages.push(
              `Players: ${playersAddedCount} players added to the players list for this competition`
            );
        });
    } catch (error) {
      if (error instanceof Error) replyMessages.push(error.message);
    }
    if (result.twos.length !== 0) {
      try {
        await this.updateResultService
          .addTwos(result)
          .then((twosRegisteredCount) => {
            if (twosRegisteredCount === 0)
              replyMessages.push('Twos: all twos already registered.');
            else
              replyMessages.push(
                `Twos: ${twosRegisteredCount} registered for this competition `
              );
          });
      } catch (error) {
        if (error instanceof Error) replyMessages.push(error.message);
      }
    } else {
      replyMessages.push('Twos: No twos recorded for this competion');
    }

    return replyMessages;
  }
}
