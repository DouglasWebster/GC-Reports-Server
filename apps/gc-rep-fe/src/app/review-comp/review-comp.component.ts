import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectPlayer } from '@libs/drizzle';
import {
  ICompetitionWithFormat,
  ICompReviewUpdate,
  IPlayerReviewUpdate,
} from '@libs/models';
import { DataTable } from 'simple-datatables';
import { DbAccessService } from '../db-access/db-access.service';

@Component({
  selector: 'gc-rep-fe-review-comp',
  imports: [CommonModule, FormsModule],
  templateUrl: './review-comp.component.html',
  styleUrl: './review-comp.component.css',
})
export class ReviewCompComponent implements OnInit {
  @Input()
  compToReview: ICompetitionWithFormat | null = null;

  compId: number | null = null;
  compPlayers: SelectPlayer[] = [];
  compDate = '';
  playerUpdates: IPlayerReviewUpdate[] = [];
  reviewValid = true;
  updatePosted = false

  reviewUpdateResponse = '';

  reviewTable?: DataTable;
  playerTable?: DataTable;
  haveUnreviewedComps$!: boolean

  constructor(
    private readonly http: HttpClient,
    private readonly dbAccessService: DbAccessService
  ) {}

  ngOnInit(): void {
   this.dbAccessService.countCompsToReview().subscribe(
      result => {
        this.haveUnreviewedComps$ = (result === 0) ? false : true
        this.updateTable();
      }
    )
  }

  updateTable(): void {
    this.http
      .get<any[]>('api/competitions/list-unreviewed')
      .subscribe((data) => {
        this.reviewTable?.destroy();
        if(this.haveUnreviewedComps$){  
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
        });}

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
              const compId = rowData[0].data[0].data;

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
        .getCompetitionWithFormatById(id)
        .subscribe((competion) => {
          this.compDate = new Intl.DateTimeFormat('en-GB', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }).format(new Date(competion.compDate));
          this.compToReview = competion;
          console.log(this.compToReview);
          this.reviewPlayersDetails(id);
        });
    }
  }

  reviewPlayersDetails(compId: number) {
    this.http
      .get<any[]>(`api/players/comp-review/${compId}`)
      .subscribe((data) => {
        this.playerTable?.destroy();
        console.log(data);
        this.playerTable = new DataTable('#playersTable', {
          data: {
            headings: [
              'memberId',
              'In Twos',
              'Signed In',
              'Surname',
              'First Name',
            ],
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
              render: (value, _td, _rowIndex, _cellIndex) =>
                `<span class="checkbox" cell-index='${_cellIndex}' row-index='${_rowIndex}'  which-box='twos'>${
                  value ? '☑️' : '☐'
                }</span>`,
            },
            {
              select: 2,
              render: (value, _td, _rowIndex, _cellIndex) =>
                `<span class="checkbox" cell-index='${_cellIndex}' row-index='${_rowIndex}' which-box='signed'>${
                  value ? '☑' : '☐'
                }</span>`,
            },
          ],
          searchable: true,
          perPage: 5,
        });
        this.playerTable.columns.order([0, 3, 4, 2, 1]);
        this.checkReviewValidity();

        this.playerTable?.dom.addEventListener('click', (event: MouseEvent) => {
          if (
            event.target instanceof HTMLSpanElement &&
            event.target.hasAttribute('cell-index')
          ) {
            console.log(event);
            event.preventDefault();
            event.stopPropagation();
            const cellIndex = event.target.getAttribute('cell-index');
            const rowIndex = event.target.getAttribute('row-index');
            let memberId = -1;
            if (rowIndex) {
              const index = parseInt(rowIndex, 10);
              const rowData = this.playerTable?.data.data[index].cells as {
                data: any;
              }[];
              memberId = rowData[0].data[0].data;
            }
            const checkBoxType = event.target.getAttribute('which-box');
            if (cellIndex) {
              const playerCell = parseInt(cellIndex, 10);
              // prettier-ignore
              // @ts-expect-error: doesn't know about property cell.
              const tableIndex = parseInt(event.target.parentElement?.parentElement?.dataset.index, 10);
              const tableRow = this.playerTable?.data.data[tableIndex];
              const cell = tableRow?.cells[playerCell];
              if (cell) {
                const checked = cell?.data;
                cell.data = !checked;
                this.playerTable?.update();
                this.updatePlayerCorrection(memberId, checkBoxType);
              }
            }
          }
        });
      });
  }

  updatePlayerCorrection(id: number, which: string | null) {
    if (!which) return;
    console.log(`member id: ${id}, to change: ${which}`);
    const player = this.playerUpdates.find(({ memberId }) => memberId == id);
    if (player) {
      const currentTwos = player.inTwos;
      const currentOnSheet = player.onSheet;
      if (which === 'twos') player.inTwos = !currentTwos;
      if (which === 'signed') player.onSheet = !currentOnSheet;
    } else {
      const newPlayer: IPlayerReviewUpdate = {
        memberId: id,
        inTwos: true,
        onSheet: true,
      };
      if (which === 'twos') newPlayer.inTwos = false;
      if (which === 'signed') newPlayer.onSheet = false;
      this.playerUpdates.push(newPlayer);
    }
    this.checkReviewValidity();
  }

  checkReviewValidity() {
    if (!this.compToReview) return;

    let reviewState = true; // assume everything is OK

    const computerEntries = this.compToReview?.computerEntries;
    const signedIn = this.compToReview?.sheetEntries;
    const inTwos = this.compToReview?.twosEntered;
    let notSignedIn = 0;
    let notInTwos = 0;
    if (this.playerUpdates?.length !== 0) {
      notSignedIn = this.playerUpdates.filter(
        (item) => item.onSheet === false
      ).length;
      notInTwos = this.playerUpdates.filter(
        (item) => item.inTwos === false
      ).length;
    }

    if (computerEntries + notSignedIn < signedIn) reviewState = false;
    if (computerEntries - notInTwos > inTwos) reviewState = false;

    this.reviewValid = reviewState;
  }

  acceptReviewBtnClicked() {
    if (this.compId && this.compToReview) {
      const reviewCorrections: ICompReviewUpdate = {
        compId: this.compId,
        twosCount: this.compToReview.twosEntered,
        signedInCount: this.compToReview.sheetEntries,
        players: this.playerUpdates,
      };
      this.dbAccessService
        .patchCompetitionReviewData(reviewCorrections)
        .subscribe((result) => {
          console.log(result);
          this.reviewUpdateResponse = result
          this.updatePosted = true
        });
    }

  }

  cancelReviewBtnClicked() {
    this.compId = null;
    this.compToReview = null;
    this.compPlayers.length = 0;
    this.compDate = '';
    this.playerTable?.destroy();
    this.playerUpdates.length = 0;
    this.reviewValid = true;
    this.reviewUpdateResponse = ''
    this.updatePosted = false
    this.ngOnInit();
  }
}
