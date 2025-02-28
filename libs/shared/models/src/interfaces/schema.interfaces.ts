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
  division: number;
  position: number;
  score: number;
  stablefordPoints: number;
  inTwos: boolean;
  signedIn: boolean;
}

export interface ITeesFromCompetitionID {
  teeName: string;
  isLadies: boolean;
  isMens: boolean;
}

export interface IWinners {
  title: string;
  name: string;
  prize: number;
}

export interface ITwosScorersForComp {
  foreName: string;
  surname: string;
  hole: number;
  inTwos: boolean;
}

export interface ITwosResults {
  name: string;
  holes: string
  count: number;
  inTwos: boolean;
} 
