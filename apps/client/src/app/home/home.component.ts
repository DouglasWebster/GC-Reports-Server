import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DbAccessService } from '../db-access/db-access.service';

@Component({
  selector: 'client-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly dbAccessService = inject(DbAccessService);

  noOfCompsInDb$!: Observable<number>;
  noOfMemersInDb$!: Observable<number>;
  noOfCompsToReview$!: Observable<number>;

  ngOnInit(): void {
    this.updateData();
  }

  updateData() {
    this.noOfCompsInDb$ = this.dbAccessService.countAllComps();
    this.noOfCompsToReview$ = this.dbAccessService.countCompsToReview();
    this.noOfMemersInDb$ = this.dbAccessService.countMembers();
  }
}
