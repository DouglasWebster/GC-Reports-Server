import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectCompetion, SelectPlayer } from '@libs/drizzle';
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
  compToReview: SelectCompetion | null = null;
  compPlayers: SelectPlayer[] = [];

  dataTable?: DataTable;

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
      .subscribe((resp) => {
        this.dataTable?.destroy();
        console.log(resp);
        this.dataTable = new DataTable('#reviewTable', {
          data: {
            headings: ['Competition ID', 'Date', 'Format', 'Review'],
            data: resp.map((item) => Object.values(item)),
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
            },
            {
              select: 2,
              sortable: true,
            },
            {
              select: 3,
              sortable: true,
              render: (rowValue, _td, rowIndex) =>
                `<button type='button' data-id='${rowIndex}' class='class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 me-2  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'> Review Comp </button>`,
            },
          ],
          searchable: false,
          perPage: 5,
        });

        this.dataTable?.dom.addEventListener('click', (e: MouseEvent) => {
          console.log(e);
          if (
            e.target instanceof HTMLButtonElement &&
            e.target.hasAttribute('data-id')
          ) {
            const dataId = e.target.getAttribute('data-id');
            if (dataId) {
              const index = parseInt(dataId, 10);
              console.log(index);
              const rowData = this.dataTable?.data.data[index].cells as {
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
      });
  }

  reviewBtnClicked(id: number) {
    if (id) {
      this.dbAccessService
        .getCompetitionDetailsById(id)
        .subscribe((competion) => {
          this.compToReview = competion;
          console.log(this.compToReview);
        });
      this.dbAccessService.getPlayersInCompetition(id).subscribe((players) => {
        for (const player of players) this.compPlayers.push(player);
      });
    }
  }
}
