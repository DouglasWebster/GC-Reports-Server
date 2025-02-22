import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { IDateRange, IResultPlayers, IWinners } from '@libs/models';
import { DataTable } from 'simple-datatables';
import { DbAccessService } from '../db-access/db-access.service';
import { max } from 'drizzle-orm';

@Component({
  selector: 'gc-rep-fe-results',
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
})
export class ResultsComponent implements OnInit {
  compYears: string[] = [];
  selectedYear = 0;
  minMonth = 1;
  maxMonth = 12;
  months: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  viableMonths: string[] = [];

  filterOnYear = false;
  filterOnMonth = false;
  resultCompId: number | null = null;
  resultCompName: string | null = null;
  resultCompDate: string | null = null;
  resultMensTees = signal('');
  resultLadiesTees = signal('');
  resultCompEntries = signal(0);
  resultCompFees = signal(0);
  resultTwosEntries = signal(0);

  resultWinners = signal<IWinners[]>([]);

  finalisedComps?: DataTable;
  compPlayers: IResultPlayers[] | null = null;

  constructor(
    private readonly dbAccessService: DbAccessService,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    this.calculateYearRanges();
    this.updateTable();
  }

  updateTable(): void {
    this.http.get<any[]>('api/competitions/list-reviewed').subscribe((data) => {
      this.finalisedComps?.destroy();
      if (this.compYears.length > 0) {
        console.log(data);
        this.finalisedComps = new DataTable('#finalisedComp', {
          data: {
            headings: ['Competition', 'Date   ↕️', 'Format   ↕️', ''],
            data: data.map((item) => Object.values(item)),
          },
          columns: [
            {
              select: 0,
              sortable: true,
              hidden: true,
            },
            {
              select: 1,
              sortable: true,
              type: 'date',
              format: 'YYYY-MM-DD',
              render: (rowValue, _td, _rowIndex, _cellIndex) =>
                `${new Intl.DateTimeFormat('en-GB', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }).format(new Date(rowValue as string | number | Date))}`,
              // `${new Date(rowValue as string | number | Date).toDateString()}`
            },
            {
              select: 2,
              sortable: true,
            },
            {
              select: 3,
              sortable: false,

              render: (rowValue, _td, rowIndex) =>
                `<button type='button' data-id='${rowIndex}' class='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 me-2  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'> View Result</button>`,
            },
          ],
          searchable: false,
          perPage: 5,
        });
      }

      this.finalisedComps?.dom.addEventListener('click', (e: MouseEvent) => {
        console.log(e);
        if (
          e.target instanceof HTMLButtonElement &&
          e.target.hasAttribute('data-id')
        ) {
          const dataId = e.target.getAttribute('data-id');
          if (dataId) {
            const index = parseInt(dataId, 10);
            console.log(index);
            const rowData = this.finalisedComps?.data.data[index].cells as {
              data: any;
            }[];
            console.log(rowData);
            this.closeResult();
            this.resultCompId = rowData[0].data[0].data;
            this.resultCompName = rowData[2].data[0].data;
            this.resultCompDate = rowData[1].data;

            this.populateCompetionPlayers();
          }
        }
      });
    });
  }

  calculateYearRanges() {
    this.dbAccessService
      .getFinalisedCompDateRange()
      .subscribe((range: IDateRange[]) => {
        if (range.length > 0) {
          const latestCompYear = new Date(range[0].maxDate).getFullYear();
          const earliestCompYear = new Date(range[0].minDate).getFullYear();
          this.maxMonth = new Date(range[0].maxDate).getMonth();
          this.minMonth = new Date(range[0].minDate).getMonth();
          for (let year = earliestCompYear; year <= latestCompYear; year++)
            this.compYears.push(year.toString());

          console.log(
            `Min date: ${earliestCompYear}, Max date: ${latestCompYear}, Min Month: ${this.minMonth}, Max Month: ${this.maxMonth}`
          );
        }
      });
  }

  onSelectedYear(value: string) {
    this.filterOnYear = value === 'All' ? false : true;
    if (this.filterOnYear) {
      this.selectedYear = parseInt(value, 10);
      this.finalisedComps?.search(value);
      this.viableMonths = this.months;
      if (value === this.compYears[0]) {
        this.viableMonths = this.months.slice(this.minMonth, 12);
      }
      if (value === this.compYears[this.compYears.length - 1]) {
        this.viableMonths = this.months.slice(0, this.maxMonth + 1);
      }
    } else {
      this.finalisedComps?.search('');
    }
  }

  onSelectedMonth(value: string) {
    this.filterOnMonth = value === 'All' ? false : true;
    if (this.filterOnMonth) {
      const monthIndex = this.months.indexOf(value) + 1;
      const searchString = `${this.selectedYear}-${monthIndex
        .toString()
        .padStart(2, '0')}`;
      console.log(searchString);
      this.finalisedComps?.search(searchString);
    } else {
      this.finalisedComps?.search(this.selectedYear.toString());
    }
  }

  populateCompetionPlayers() {
    console.log(
      `competition ${this.resultCompId}, date: ${this.resultCompDate}, name: ${this.resultCompName} selected`
    );
    if (this.resultCompId === null) return;
    this.dbAccessService
      .getFinalisedCompetitionPlayersDetails(this.resultCompId)
      .subscribe((data) => {
        this.compPlayers = data;
        this.compPlayers.sort((a, b) => a.position - b.position);
        console.log(this.compPlayers);
        if (this.compPlayers.length > 0) {
          if (this.resultCompId !== null) {
            this.fillInCompDetails(this.resultCompId);
            this.fillInTwosDetails();
          }
        }
      });
  }

  fillInCompDetails(compId: number) {
    this.dbAccessService
      .getTeesPlayedInCompetition(compId)
      .subscribe((data) => {
        console.log(data);
        for (const tee of data) {
          if (tee.isMens) {
            this.resultMensTees.set(tee.teeName);
          } else {
            this.resultMensTees.set('');
          }
          if (tee.isLadies) {
            this.resultLadiesTees.set(tee.teeName);
          } else {
            this.resultLadiesTees.set('');
          }
        }
      });
    this.dbAccessService.getCompetitionDetailsById(compId).subscribe((data) => {
      console.log(data);
      this.resultCompEntries.set(data.sheetEntries);
      this.resultCompFees.set(data.entryFee);
      this.resultTwosEntries.set(data.twosEntered);

      this.determinWinners();
    });
  }

  determinWinners() {
    console.log('determining winners');
    if (this.compPlayers === null) return;

    const validPlayers = this.compPlayers.filter(
      (player) => player.position > 0
    );

    validPlayers.sort(
      (a, b) => a.position - b.position
    );

    const maxDivision = Math.max(
      ...validPlayers.map((player) => player.division)
    );
    const winners: IWinners[] = [];

    switch (maxDivision) {
      case 1:
        winners.push({ title: 'Overall winner', name: '', prize: 0 });
        break;
      case 2:
        winners.push({ title: 'Tiger', name: '', prize: 0 });
        winners.push({ title: 'Rabbit', name: '', prize: 0 });
        break;
      case 3:
        winners.push({ title: 'Winner division 1', name: '', prize: 0 });
        winners.push({ title: 'Winner division 2', name: '', prize: 0 });
        winners.push({ title: 'Winner division 3', name: '', prize: 0 });
        break;
    }

    for (let i = 1; i <= maxDivision; i++) {
      const divisionWinner = validPlayers.find(
        (player) => player.division === i
      );
      if (divisionWinner) {
        validPlayers.splice(
          validPlayers.findIndex(
            (player) => player.position === divisionWinner.position
          ),
          1
        );
        const winner = winners.at(i - 1);
        if (winner) {
          winner.name = `${divisionWinner.foreName} ${divisionWinner.surnamne}`;
        }
      }
    }

    const prizeBase = this.resultCompFees() * this.resultCompEntries();

    if (validPlayers.length < 36) {
      const prize = Math.round(prizeBase / maxDivision);
      for (const winner of winners) winner.prize = prize;
    }

    if (
      this.resultCompEntries() > 35 &&
      this.resultCompEntries() < 46 &&
      maxDivision === 3
    ) {
      const winnersPrize = Math.round((prizeBase * 0.84) / 3);
      for (const winner of winners) winner.prize = winnersPrize;
      const nextWinner = validPlayers.at(0);
      if (nextWinner)
        winners.push({
          title: 'Next best highest score',
          name: `${nextWinner.foreName} ${nextWinner.surnamne}`,
          prize: prizeBase * 0.16,
        });
    }

    if (this.resultCompEntries() > 45 && maxDivision === 3) {
      const winnersPrize = Math.round((prizeBase * 0.7) / 3);
      for (const winner of winners) winner.prize = winnersPrize;

      // 2 runners up + 1 more for every 20 extra players
      const extraWinners = 2 + Math.round((this.resultCompEntries() - 46) / 20);
      const runnerUpPrize = Math.round((prizeBase * 0.3) / extraWinners);
      for (let i = 0; i < extraWinners; i++) {
        const nextWinner = validPlayers.at(i);
        if (nextWinner)
          winners.push({
            title: 'Next best highest score',
            name: `${nextWinner.foreName} ${nextWinner.surnamne}`,
            prize: runnerUpPrize,
          });
      }
    }

    this.resultWinners.set(winners);
  }

  fillInTwosDetails() {
    console.log('filling in twos details');
  }

  closeResult() {
    this.resultCompId = null;
    this.resultCompName = null;
    this.resultCompDate = null;
    this.resultMensTees.set('');
    this.resultCompEntries.set(0);
    this.resultCompFees.set(0);
    this.resultTwosEntries.set(0);
    this.compPlayers = null;
  }
}
