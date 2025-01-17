import { CommonModule } from '@angular/common';
import {
  afterNextRender,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectCompetion, SelectPlayer } from '@libs/drizzle';
import { IReviewHeader } from '@libs/models';
import { DataTable } from 'simple-datatables';
import { DbAccessService } from '../db-access/db-access.service';

// interface IReviewHeader {
//   compFormat: string;
//   compDate: string;
//   validationState: boolean;
//   id: number;
// }

@Component({
  selector: 'gc-rep-fe-review',
  imports: [CommonModule, FormsModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css',
})
export class ReviewComponent implements OnInit {
  @ViewChild('testTable') _table!: ElementRef;
  unreviewedComps$!: IReviewHeader[];
  compId: number | null = null;
  compToReview: SelectCompetion | null = null;
  compPlayers: SelectPlayer[] = [];

  dataTable?: DataTable;

  constructor(private readonly dbAccessService: DbAccessService) {
    afterNextRender(() => {
      this.dataTable?.on('datatable.init', () => {
        console.log('data table init finished');
        console.log(this.dataTable);

        this.dataTable?.dom.addEventListener('click', (e: Event) => {
          console.log('e');
          const target = e.target as Element;
          if (target.nodeName === 'BUTTON' && target?.hasAttribute('data-id')) {
            const index = parseInt(target.getAttribute('data-id') || '0', 10);
            const row = this.dataTable?.data.data[index].cells;
            const message = [
              'This is row ',
              (target.closest('tr')?.rowIndex ?? 0 + 1).toString(),
              ' of ',
              this.dataTable?.options.perPage.toString() || '',
              ' rendered rows and row ',
              (index + 1).toString(),
              ' of ',
              this.dataTable?.data.data.length.toString() || '',
              ' total rows.',
            ];
            // const data = [].slice.call(row).map(cell => cell.data)
            const data = row?.map((cell) => cell.data);
            let totalMessage = message.join('');
            totalMessage = `${totalMessage}\n\nThe row data is:\n${JSON.stringify(
              data
            )}`;
            alert(totalMessage);
          }
        });
      });
    });
  }

  ngOnInit(): void {
    this.dbAccessService
      .getCompUnreviewedHeaders()
      .subscribe((competitions) => {
        this.unreviewedComps$ = competitions;
        this.updateTable();
      });
  }

  reviewBtnClicked(id: number) {
    this.compId = this.unreviewedComps$[id].id;
    this.dbAccessService
      .getCompetitionDetailsById(this.compId)
      .subscribe((competion) => {
        this.compToReview = competion;
        console.log(this.compToReview);
      });
    this.dbAccessService
      .getPlayersInCompetition(this.compId)
      .subscribe((players) => {
        for (const player of players) this.compPlayers.push(player);
      });
  }

  updateTable() {
    const reviewHeaders: IReviewHeader[] = [];
    for (const reviewHeader of this.unreviewedComps$) {
      const reviewHeaderItem: IReviewHeader = {
        compFormat: reviewHeader.compFormat,
        date: reviewHeader.date,
        validated: reviewHeader.validated,
        id: reviewHeader.id,
      };
      reviewHeaders.push(reviewHeaderItem);
    }

    console.log(reviewHeaders);

    const tableData: { headings: string[]; data: [] } = {
      headings: Object.keys(reviewHeaders[0]),
      data: [],
    };

    for (const reviewHeader of reviewHeaders) {
      const dataArray: (string | string | boolean | number)[] = [
        reviewHeader.compFormat,
        reviewHeader.date,
        reviewHeader.validated,
        reviewHeader.id,
      ];
      // @ts-expect-error: we need to assign to a never
      tableData.data.push(dataArray);
    }
    console.log(`Table data/n${tableData.data}`);
    if (this.dataTable) this.dataTable.destroy();
    this.dataTable = new DataTable('#testTable', {
      data: tableData,
      columns: [
        // {
        //   select: [3],
        //   hidden: true,
        // },
        {
          select: [1],
          type: 'string',
          format: 'DD/MM/YYYY',
          // render: (data) => {

          //   return `<Date(${data}.toLocaleDateString())>`;
          // }
        },
        {
          select: [3],
          // @ts-expect-error: we need to assign to a never
          render: (data: number) => {
            return `<button type='button' data-id='${data}' class='btn btn-sm btn-primary pull-right notify'>Review</button>`;
          },
        },
      ],
      searchable: true,
      fixedHeight: true,
    });
  }

  // ngAfterViewInit(): void {
  //   if (this.dataTable === undefined) {
  //     console.log('data table is not undefined');
  //   } else {
  //     this.dataTable.on('datatable.init', () => {
  //       console.log('data table init finished');
  //       console.log(this.dataTable);

  //       this.dataTable?.dom.addEventListener('click', (e: Event) => {
  //         console.log('e');
  //         const target = e.target as Element;
  //         if (target.nodeName === 'BUTTON' && target?.hasAttribute('data-id')) {
  //           const index = parseInt(target.getAttribute('data-id') || '0', 10);
  //           const row = this.dataTable?.data.data[index].cells;
  //           let message: any = [
  //             'This is row ',
  //             (target.closest('tr')?.rowIndex ?? 0 + 1).toString(),
  //             ' of ',
  //             this.dataTable?.options.perPage.toString() || '',
  //             ' rendered rows and row ',
  //             (index + 1).toString(),
  //             ' of ',
  //             this.dataTable?.data.data.length.toString() || '',
  //             ' total rows.',
  //           ];
  //           // const data = [].slice.call(row).map(cell => cell.data)
  //           const data = row?.map((cell) => cell.data);
  //           message = message.join('');
  //           message = `${message}\n\nThe row data is:\n${JSON.stringify(data)}`;
  //           alert(message);
  //         }
  //       });
  //     });
  //   }
  // }
}
