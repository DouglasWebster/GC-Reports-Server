import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbAccessService } from '../db-access/db-access.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DataTable } from 'simple-datatables';

@Component({
  selector: 'client-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  noOfCompsInDb$!: Observable<number>;
  noOfMemersInDb$!: Observable<number>;
  noOfCompsToReview$!: Observable<number>;
  compYears: number[] = [];
  compId: number | null = null;

  finalisedComps?: DataTable;
  playerTable?: DataTable;

  constructor(
    private readonly dbAccessService: DbAccessService,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    this.updateData();
  }

  updateData() {
    this.noOfCompsInDb$ = this.dbAccessService.countAllComps();
    this.noOfCompsToReview$ = this.dbAccessService.countCompsToReview();
    this.noOfMemersInDb$ = this.dbAccessService.countMembers();
  }
}
