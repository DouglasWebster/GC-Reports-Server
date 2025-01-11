import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ICompetitionGeneral } from '@libs/models';
import { DbAccessService } from '../db-access/db-access.service';

@Component({
  selector: 'gc-rep-fe-review',
  imports: [CommonModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css',
})
export class ReviewComponent implements OnInit {
  unreviewedComps$!: Observable<ICompetitionGeneral[]>;
  reviewIds: number [] = []
  reviewId: number | null = null

  constructor(private readonly dbAccessService: DbAccessService) {}

  ngOnInit(): void {
    this.unreviewedComps$ = this.dbAccessService.getCompUnreviewedHeaders()
    this.unreviewedComps$.subscribe((items) => {
      for (const item of items) {
        this.reviewIds.push(item.id)
      }
    })
  }

  reviewBtnClicked(id: number) {
      this.reviewId = this.reviewIds[id];
  }
}
