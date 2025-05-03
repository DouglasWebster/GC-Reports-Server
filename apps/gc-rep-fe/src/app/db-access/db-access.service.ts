import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ICompetitionGeneral,
  IReviewHeader,
  ICompetitionWithFormat,
  ICompReviewUpdate,
  IDateRange,
  IResultPlayers,
  ITeesFromCompetitionID,
  ITwosScorersForComp,
} from '@lib/shared/models';
import { Observable } from 'rxjs';
import * as schema from '@lib/shared/drizzle';

@Injectable({
  providedIn: 'root',
})
export class DbAccessService {
  constructor(private readonly http: HttpClient) {}

  addCompetion(fd: FormData): Observable<HttpResponse<string>> {
    return this.http.post<string>(`/api/update-result`, fd, {
      observe: 'response',
    });
  }

  countMembers(): Observable<number> {
    return this.http.get<number>('api/member/count');
  }

  countAllComps(): Observable<number> {
    return this.http.get<number>('api/competitions/count');
  }

  countCompsToReview(): Observable<number> {
    return this.http.get<number>('api/competitions/count-unreviewed');
  }

  countCompsReviewed(): Observable<number> {
    return this.http.get<number>('api/competitions/count-reviewed');
  }

  getCompShortForm(): Observable<ICompetitionGeneral[]> {
    return this.http.get<ICompetitionGeneral[]>('api/competitions');
  }

  getCompUnreviewedHeaders(): Observable<IReviewHeader[]> {
    return this.http.get<IReviewHeader[]>('api/competitions/list-unreviewed');
  }

  getCompReviewedHeaders(): Observable<IReviewHeader[]> {
    return this.http.get<IReviewHeader[]>('api/competitions/list-reviewed')
  }

  getCompetitionDetailsById(id: number): Observable<schema.SelectCompetion> {
    return this.http.get<schema.SelectCompetion>(`api/competitions/${id}`);
  }

  getCompetitionWithFormatById(id: number): Observable<ICompetitionWithFormat> {
    return this.http.get<ICompetitionWithFormat>(
      `api/competitions/review/${id}`
    );
  }

  getPlayersInCompetition(id: number): Observable<schema.SelectPlayer[]> {
    return this.http.get<schema.SelectPlayer[]>(`api/players/${id}`);
  }

  patchCompetitionReviewData(
    reviewData: ICompReviewUpdate
  ) {
    const reply = this.http.patch<string>('api/competitions/update-comp', reviewData)
    console.log(reply)
    return reply
  }

  getFinalisedCompDateRange() {
    return this.http.get<IDateRange[]>('api/competitions/finalised-date-range')
  }

  getFinalisedCompetitionPlayersDetails(compId: number) {
    return this.http.get<IResultPlayers[]>(`api/competitions/results/${compId}`)
  }

  getTeesPlayedInCompetition(compId: number) {
    return this.http.get<ITeesFromCompetitionID[]>(`api/tees/competition/${compId}`)
  }

  getTwosScorersForCompetition(compId: number) {
    return this.http.get<ITwosScorersForComp[]>(`api/twos/comp_twos/${compId}`)
  }
}
