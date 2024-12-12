import { Injectable } from '@nestjs/common';
import {
  ICompetitor,
  IResult,
  ITwos,
} from '../../utils/models/report.interface';

@Injectable()
export class UpdateResultsService {
  async storeResult(resultData: string) : Promise<IResult> {
    const isStableford: boolean = resultData.includes('Stableford');
    const buffer: string = resultData.toString().replace(/"/g, '');
    console.log(buffer)
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
        if(lineSections.length < 4) continue  // ignore dq'd entries
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
          handicapIndex: null
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
            name: items[0],
            hole: +items[2],
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
}
