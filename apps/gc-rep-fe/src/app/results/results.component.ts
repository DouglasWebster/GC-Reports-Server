import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataTable } from 'simple-datatables';
import { DbAccessService } from '../db-access/db-access.service';

@Component({
  selector: 'gc-rep-fe-results',
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
})
export class ResultsComponent implements OnInit {
  compYears: number[] = [];
  compId: number | null = null

  finalisedComps?: DataTable;
  playerTable?: DataTable;

  constructor(
    private readonly dbAccessService: DbAccessService,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    this.calculateYearRanges();
    this.updateTable()
  }


  updateTable(): void {
    this.http
      .get<any[]>('api/competitions/list-reviewed')
      .subscribe((data) => {
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
              const compId = rowData[0].data[0].data;

              this.compId = compId;

              this.generateResultDisplay(compId);
            }
          }
        });
      });
  }

  calculateYearRanges() {
    let earliestCompYear = Number.MAX_SAFE_INTEGER;
    let latestCompYear = Number.MIN_SAFE_INTEGER;
    this.dbAccessService.getCompReviewedHeaders().subscribe((headers) => {
      for (const header of headers) {
        const compYear = new Date(header.date).getFullYear();
        if (compYear < earliestCompYear) earliestCompYear = compYear;
        if (compYear > latestCompYear) latestCompYear = compYear;
      }
      for (let year = earliestCompYear; year <= latestCompYear; year++)
        this.compYears.push(year);
    });
  }

  generateResultDisplay(compId: number) {
    console.log(`competition ${compId} selected`)
  }
}

