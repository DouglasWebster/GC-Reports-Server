import { Injectable } from '@nestjs/common';
import { NewCompetion } from '../../db/schema/competition.schema';
import { NewMember } from '../../db/schema/member.schema';
import {
  ICompetitor,
  IResult,
  ITwos,
} from '../../utils/models/report.interface';
import { CompFormService } from '../comp-form/comp-form.service';
import { CompetitionService } from '../competition/competition.service';
import { MemberService } from '../member/member.service';
import { PlayerService } from '../player/player.service';

@Injectable()
export class UpdateResultsService {
  constructor(
    private readonly memberService: MemberService,
    private readonly compFormService: CompFormService,
    private readonly competitionService: CompetitionService,
    private readonly playerService: PlayerService
  ) {}

  async storeResult(resultData: string): Promise<IResult> {
    const isStableford: boolean = resultData.includes('Stableford');
    const buffer: string = resultData.toString().replace(/"/g, '');
    // console.log(buffer)
    const data: string[] = buffer.split(/\r?\n/);

    const compName: string = data[1];
    const dateItems: string[] = data[4].split(' ');
    const compDate: Date = new Date(
      Date.parse(dateItems[3] + ' ' + dateItems[4] + ' ' + dateItems[5])
    );
    const twosWinners: ITwos[] = [];

    let noOfCards = 0;
    let noOfDivisions = 0;
    let incrementDivisionCount = true;
    const competitors: ICompetitor[] = [];

    for (const line of data) {
      if (line.startsWith('Number of Cards')) {
        const matches = line.match(/\d+/g);
        if (matches) noOfCards = Number(matches[0]);
        continue;
      }
      if ((line[0] >= '0' && line[0] <= '9') || line[0] === '-') {
        const lineSections = line.split(',');
        if (lineSections.length < 4) continue; // ignore dq'd entries
        const compPostition: number =
          line[0] !== '-' ? Number(lineSections[0]) : null;
        // if (isNaN(compPostition)) continue;
        if (incrementDivisionCount) noOfDivisions += 1;
        incrementDivisionCount = false;
        const scoreDetails = lineSections[3];
        const scoreValues = scoreDetails.match(/\d+/g);
        let points: number = null;
        let handicap: number = null;
        let grossScore: number = null;
        if (scoreValues !== null) {
          handicap = Number(scoreValues[1]);
          points = isStableford ? Number(scoreValues[0]) : null;
          grossScore = isStableford ? null : Number(scoreValues[0]);
        }

        competitors.push({
          position: compPostition,
          name: lineSections[1],
          division: noOfDivisions,
          grossScore: grossScore,
          points: points,
          handicap: handicap,
          handicapIndex: null,
        });
      } else {
        incrementDivisionCount = true;
      }
    }

    const hasTwos = /There were .+ Twos recorded/g;

    for (let index = data.length - 1; index > 0; --index) {
      const twosFound = data[index].match(hasTwos);
      if (twosFound !== null) {
        if (data[index] === 'There were no Twos recorded.') break;
        let twosIndex: number = index + 2;
        while (data[twosIndex] !== '') {
          const items = data[twosIndex].split(',');
          if (items.length < 3 || items[(0)[0]] === '') break;
          twosWinners.push({
            name: items.at(0),
            hole: +items.at(-2),
          });
          ++twosIndex;
        }
        break;
      }
    }

    const result: IResult = {
      name: compName,
      date: compDate,
      cards: noOfCards,
      players: competitors,
      twos: twosWinners,
    };

    return result;
  }

  async sendUnknowPlayersToDB(results: IResult): Promise<number> {
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
    // console.log(result);
    return result;
  }

  async recordCompetition(results: IResult) {
    const competionDate = results.date;
    const competitionName = results.name;
    const competitionCardCount = results.cards;

    const idResult = await this.compFormService.getCompFormIdFromName(
      competitionName
    );

    // if no format defined exit gracefully.
    if (idResult === undefined)
      throw new Error('Competion format not yet defined.');

    const newCompInsertDetails: NewCompetion = {
      compFormId: idResult.id,
      computerEntries: competitionCardCount,
      compDate: competionDate,
      playerCount: results.players.length,
      sheetEntries: results.cards,
      twosEntered: results.cards,
    };
    const compInsertResult = await this.competitionService.createNamedComp(
      newCompInsertDetails
    );
    console.log(compInsertResult);
    if (compInsertResult === undefined)
      throw new Error(
        'Unable to create competition - competition already exists'
      );

    return compInsertResult[0].competitionId;
  }

  async addPlayers(result: IResult) {
    const competitionFormatId =
      await this.compFormService.getCompFormIdFromName(result.name);

    // if no format defined exit gracefully.
    if (competitionFormatId === undefined)
      throw new Error('Competion format not yet defined.');

    const competitionId =
      await this.competitionService.getCompetitionFromFormatIdAndDate(
        competitionFormatId.id,
        result.date
      );

    const playerAddedResult = await this.playerService.addPlayersToCompetition(
      competitionId.id,
      result.players
    );

    if(playerAddedResult === undefined)
      throw new  Error('Unable to proccess the players for this competition.')

    return playerAddedResult.rowCount
  } 
}
