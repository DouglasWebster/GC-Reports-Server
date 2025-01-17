export interface ICompetitionGeneral {
    id: number,
    date: Date,
    compFormat: string,
    validated: boolean
}

export interface IReviewHeader {
    compFormat: string;
    date: string;
    validated: boolean;
    id: number;
  }