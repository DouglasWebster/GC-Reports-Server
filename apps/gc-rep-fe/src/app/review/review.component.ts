import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { Component, OnInit } from '@angular/core';
import { SelectCompetion, SelectPlayer } from '@libs/drizzle';
import { ICompetitionGeneral } from '@libs/models';
import { DbAccessService } from '../db-access/db-access.service';

@Component({
  selector: 'gc-rep-fe-review',
  imports: [CommonModule, FormsModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css',
})
export class ReviewComponent implements OnInit {
  unreviewedComps$!: ICompetitionGeneral[];
  compId: number | null = null;
  compToReview: SelectCompetion | null = null;
  compPlayers: SelectPlayer[] = [];

  constructor(private readonly dbAccessService: DbAccessService) {}

  ngOnInit(): void {
    this.dbAccessService
      .getCompUnreviewedHeaders()
      .subscribe((competition) => (this.unreviewedComps$ = competition));
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
}
