import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbAccessService } from '../db-access/db-access.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'gc-rep-fe-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  noOfCompsInDb$!: Observable<number>;
  noOfMemersInDb$!: Observable<number>;
  noOfCompsToReview$!: Observable<number>;
  compYears: number[] = [];

  constructor(private readonly dbAccessService: DbAccessService) {}

  ngOnInit(): void {
    this.noOfCompsInDb$ = this.dbAccessService.countAllComps();
    this.noOfCompsToReview$ = this.dbAccessService.countCompsToReview();
    this.noOfMemersInDb$ = this.dbAccessService.countMembers();
    this.calculateYearRanges();
  }

  updateData() {
    this.noOfCompsInDb$ = this.dbAccessService.countAllComps();
    this.noOfCompsToReview$ = this.dbAccessService.countCompsToReview();
    this.noOfMemersInDb$ = this.dbAccessService.countMembers();
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
}
