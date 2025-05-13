import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core'
import { Observable } from 'rxjs';
import { DbAccessService } from '../db-access/db-access.service';
import { AuthService } from '@lib/client/data-acess';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'client-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly dbAccessService = inject(DbAccessService);
  private readonly authService = inject(AuthService)

  noOfCompsInDb$!: Observable<number>;
  noOfMemersInDb$!: Observable<number>;
  noOfCompsToReview$!: Observable<number>;

  isSignedIn = this.authService.isTokenExpired()
  login = "/login";

  ngOnInit(): void {
    this.updateData();
  }

  updateData() {
    this.noOfCompsInDb$ = this.dbAccessService.countAllComps();
    this.noOfCompsToReview$ = this.dbAccessService.countCompsToReview();
    this.noOfMemersInDb$ = this.dbAccessService.countMembers();
  }
}
