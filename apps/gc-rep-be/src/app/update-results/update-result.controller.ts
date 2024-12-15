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
  constructor(
    private readonly updateResultService: UpdateResultsService
  ) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result: IResult = await this.updateResultService.storeResult(
      file.buffer.toString()
    );
    // console.log(result);

    if (!result) {
      return 'could not read competition results file';
    } else {
     const insertCount = await this.updateResultService.sendUnknowPlayersToDB(result);
    
    if(insertCount === 0) return 'No unknow players found.'
    return `${insertCount} unknow players(s) added to the member list.`
    }
  }
}
