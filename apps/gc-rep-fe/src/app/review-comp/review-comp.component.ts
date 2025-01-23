import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectCompetion, SelectPlayer } from '@libs/drizzle';
import { DataTable } from 'simple-datatables';

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

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.updateTable();
  }

  updateTable(): void {
    this.http
      .get<any[]>('api/competitions/list-unreviewed')
      .subscribe((resp) => {
        this.dataTable?.destroy();
        console.log(resp);
        this.dataTable = new DataTable('#testTable', {
          data: {
            headings: Object.keys(resp[0]),
            data: resp.map((item) => Object.values(item)),
          },
          columns: [
            {
              select: 0,
              sortable: true,
              hidden: true
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
              render: (rowValue, _td, rowIndex, _cellIndex) =>
                `<button type='button' data-id='${rowIndex}' class='class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 me-2  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'> Review Comp </button>`,
            },
          ],
        });
        this.dataTable.on('datatable.init', () => {
          const collumns = this.dataTable?.columns; // Get the columns
          const noOfCols = collumns?.size(); // Get the number of columns
          if (noOfCols !== undefined) {
            for (let i = 0; i < noOfCols; i++) {
              const column = collumns?.get(i);
              console.log(column);
            }
          }
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
              const data = [].slice.call(rowData).map(cell => cell.data)
              let messageStr = `Yow wish to review the following competition:\n\n`;
              console.log(data)
              const compId = rowData[0].data[0].data;
              messageStr += `Copetition ID: ${compId}\n`;
              messageStr += `Copetition Date: ${rowData[1].data}\n`;
              messageStr += `Copetition Name: ${rowData[2].data[0].data}\n`;
              messageStr += `Copetition Validation: ${rowData[3].data[0].data}\n`;

              this.compId = compId

              alert(messageStr);
            }
          }
        });
      });
  }

  renderButton = (data: any, _td: any, rowIndex: number, _cellIndex: number): string =>  {
    console.log(data, _td, rowIndex, _cellIndex);
    return `<button type='button' data-id='${rowIndex}' class='btn btn-sm`
  }
}
