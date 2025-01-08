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
  noOfCompsInDb$!: Observable<number>
  noOfMemersInDb$!: Observable<number>
  noOfCompsToReview$!: Observable<number>

  constructor(private readonly dbAccessService: DbAccessService) {}

  ngOnInit(): void {
      this.noOfCompsInDb$ = this.dbAccessService.countAllComps()
      this.noOfCompsToReview$ = this.dbAccessService.countCompsToReview()
      this.noOfMemersInDb$ = this.dbAccessService.countMembers()
  }

  updateData() {
    this.noOfCompsInDb$ = this.dbAccessService.countAllComps()
      this.noOfCompsToReview$ = this.dbAccessService.countCompsToReview()
      this.noOfMemersInDb$ = this.dbAccessService.countMembers()
  }



}
