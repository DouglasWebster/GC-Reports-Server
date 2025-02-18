export interface ICompetitionGeneral {
  id: number;
  date: Date;
  compFormat: string;
  validated: boolean;
}

export interface IReviewHeader {
  compFormat: string;
  date: string;
  validated: boolean;
  id: number;
}

export interface ICompetitionWithFormat {
  id: number;
  compDate: Date;
  format: string;
  computerEntries: number;
  sheetEntries: number;
  playerCount: number;
  twosEntered: number;
  compForm: {
    title: string;
  };
}

export interface IPlayerReviewUpdate {
  memberId: number;
  inTwos: boolean;
  onSheet: boolean;
}

export interface ICompReviewUpdate {
  compId: number;
  twosCount: number;
  signedInCount: number;
  players: IPlayerReviewUpdate[];
}

export interface IDateRange {
  minDate: Date;
  maxDate: Date;
}

export interface IResultPlayers {
  foreName: string;
  surnamne: string;
  handicap: number;
  divison: number;
  position: number;
  score: number;
  stablefordPoints: number;
  inTwos: boolean;
  signedIn: boolean;
}
