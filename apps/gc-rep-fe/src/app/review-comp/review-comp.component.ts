import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectPlayer } from '@libs/drizzle';
import { ICompetitionWithFormat } from '@libs/models';
import { DataTable } from 'simple-datatables';
import { DbAccessService } from '../db-access/db-access.service';

@Component({
  selector: 'gc-rep-fe-review-comp',
  imports: [CommonModule, FormsModule],
  templateUrl: './review-comp.component.html',
  styleUrl: './review-comp.component.css',
})
export class ReviewCompComponent implements OnInit {
  compId: number | null = null;
  compToReview: ICompetitionWithFormat | null = null;
  compPlayers: SelectPlayer[] = [];
  compDate = ''

  reviewTable?: DataTable;

  constructor(
    private readonly http: HttpClient,
    private readonly dbAccessService: DbAccessService
  ) {}

  ngOnInit(): void {
    this.updateTable();
  }

  updateTable(): void {
    this.http
      .get<any[]>('api/competitions/list-unreviewed')
      .subscribe((data) => {
        this.reviewTable?.destroy();
        console.log(data);
        this.reviewTable = new DataTable('#reviewTable', {
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
                `<button type='button' data-id='${rowIndex}' class='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 me-2  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'> Review Comp </button>`,
            },
          ],
          searchable: false,
          perPage: 5,
        });

        this.reviewTable?.dom.addEventListener('click', (e: MouseEvent) => {
          console.log(e);
          if (
            e.target instanceof HTMLButtonElement &&
            e.target.hasAttribute('data-id')
          ) {
            const dataId = e.target.getAttribute('data-id');
            if (dataId) {
              const index = parseInt(dataId, 10);
              console.log(index);
              const rowData = this.reviewTable?.data.data[index].cells as {
                data: any;
              }[];
              // @ts-expect-error: doesn't know about property cell.
              const data = [].slice.call(rowData).map((cell) => cell.data);
              let messageStr = `Yow wish to review the following competition:\n\n`;
              console.log(data);
              const compId = rowData[0].data[0].data;
              messageStr += `Copetition ID: ${compId}\n`;
              messageStr += `Copetition Date: ${rowData[1].data}\n`;
              messageStr += `Copetition Name: ${rowData[2].data[0].data}\n`;
              messageStr += `Copetition Validation: ${rowData[3].data[0].data}\n`;
              console.log(messageStr);

              this.compId = compId;

              this.reviewBtnClicked(compId);
            }
          }
        });
/** 
 * TODO: Remove this code for final release 
 * only here to speed up development by loading a default competioin 
 */        
        const rowData = this.reviewTable?.data.data[0].cells as {
          data: any;
        }[];
        this.reviewBtnClicked(rowData[0].data[0].data);

/**
 * End of TODO sectopm
 */
      });
  }

  reviewBtnClicked(id: number) {
    if (id) {
      this.dbAccessService
        .getCompetitionWithFormatById(id)
        .subscribe((competion) => {
          this.compDate  = new Intl.DateTimeFormat('en-GB', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }).format(new Date(competion.compDate))
          this.compToReview = competion;
          console.log(this.compToReview);
        });
      this.dbAccessService.getPlayersInCompetition(id).subscribe((players) => {
        for (const player of players) this.compPlayers.push(player);
      });
    }
  }
}
