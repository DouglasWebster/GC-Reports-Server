import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { NewMember } from '../../db/schema/member.schema';
import { ICompetitor, IResult } from '../../utils/models/report.interface';
import { MemberService } from '../member/member.service';
import { UpdateResultsService } from './update-results.service';

@Controller('update-result')
export class UpdateResultController {
  constructor(
    private readonly updateResultService: UpdateResultsService,
    private readonly memberService: MemberService
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
     const insertCount = await this.sendMembersToDB(result);
    
    if(insertCount === 0) return 'No new players added to the member list'
    return `${insertCount} players(s) added to the member list.`
    }
  }

  async sendMembersToDB(results: IResult) :Promise<number> {
    const players: ICompetitor[] = results.players;
    const members: NewMember[] = [];
    players.forEach((player) => {
      const nameParts: string[] = player.name.split(' ');
      const member: NewMember = {
        foreName: nameParts.at(0),
        surname: nameParts.at(-1),
      };
      members.push(member);
    });
    
    const result = await this.memberService.insertMembers(members);
    console.log(result)
    return result
  }
}
